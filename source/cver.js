
/* eslint-disable no-console */

const fs = require('fs'),
    Malta = require('malta'),
    Balle = require('balle'),
    sh = require('searchhash'),
    time = true;

function Cver () {
    this.times = [];
    this.config = null;
    this.ready = false;
    this.root = process.cwd();
}

Cver.prototype.time = function (msg) {
    this.times.push(+new Date());
    const len = this.times.length;
    if (time) {
        console.log(`${msg} in ${this.times[len - 1] - this.times[len - 2]}ms`);
    }
};
Cver.prototype.setup = function (config) {
    this.config = config;
};

Cver.prototype.print = function () {
    this.times.push(+new Date());
    const self = this;
    Balle.chain([
        self.process(),
        self.runMalta()
    ]).then(() => {
        console.log('...done');
    });
};

Cver.prototype.process = function () {
    const self = this;
    return () => Balle.one(resolve => {
        Balle.chain([
            self.createOutDir(),
            self.createVars(),
            self.createTpl(),
            self.createStyles(),
            self.createBlocks()
        ]).then(() => {
            resolve();
        });
    });
};

Cver.prototype.createVars = function () {
    const self = this,
        data = sh.forKey(self.config, 'data').results,
        varsFile = `${self.root}/${self.config.outFolder}/source/vars.json`,
        fixConfig = () => {
            let cache = {};
            data.forEach(blk => {
                // add blocksif not present
                if (!('blocks' in blk.obj)) {
                    blk.obj.blocks = [];
                }
                // add alias if needed
                blk.obj.blocks.forEach(b => {
                    if (b.name in cache) {
                        b.alias = `${b.name}_${cache[b.name]}`;
                        cache[b.name]++;
                    } else {
                        cache[b.name] = 0;
                    }
                });
            });
        };
    fixConfig();

    let baseObj = {
        cverGithub: 'https://github.com/fedeghe/cver',
        cverNpm: 'https://github.com/fedeghe/cver',
        cverAuthor: '$PACKAGE.author$',
        cverVersion: '$PACKAGE.version$'
    };
    data.forEach(d => {
        let key = null;
        switch (true) {
            case 'alias' in d.obj:
                key = d.obj.alias;
                break;
            case 'name' in d.obj:
                key = d.obj.name.replace(/^\w*\//, ''); // remove `whatever/` useful only for separation of header & body & footer
                break;
            // case 'parentKey' in d:
            //     key = d.parentKey;
            //     break;
            default:;
        }
        baseObj[key] = baseObj[key] || {};
        for (let i in d.value) {
            baseObj[key][i] = d.value[i];
        }
    });

    return () => Balle.one(resolve => {
        fs.writeFile(varsFile, JSON.stringify(baseObj, null, '\t'), (err) => {
            if (err) {
                console.log(err);
                throw err;
            }
            resolve();
        });
    });
};

Cver.prototype.createOutDir = function () {
    const self = this;
    return () => Balle.one(resolve => {
        Balle.chain([
            () => Balle.one(resolve => {
                fs.mkdir(`${self.root}/${self.config.outFolder}`, (err) => {
                    if (err && err.code !== 'EEXIST') {
                        throw err;
                    }
                    resolve();
                });
            }),
            () => Balle.one(resolve => {
                fs.mkdir(`${self.root}/${self.config.outFolder}/source`, (err) => {
                    if (err && err.code !== 'EEXIST') {
                        throw err;
                    }
                    resolve();
                });
            })
        ]).then(() => {
            this.time('outdir created');
            resolve();
        });
    });
};

Cver.prototype.createTpl = function () {
    const self = this;
    return () => Balle.one((resolve, reject) => {
        fs.copyFile(
            `dist/tpls/${self.config.tpl.name}/index.html`,
            `${self.config.outFolder}/source/${self.config.tpl.name}.html`,
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    this.time('tpl created');
                    resolve();
                }
            }
        );
    });
};

Cver.prototype.createStyles = function () {
    const self = this;

    return () => Balle.one((resolve, reject) => {
        Balle.chain([
            () => Balle.one((resolve, reject) => {
                fs.copyFile(
                    'dist/tpls/common.css',
                    `${self.config.outFolder}/source/common.css`,
                    (err) => {
                        err ? reject(err) : resolve();
                    }
                );
            }),
            () => Balle.one((resolve, reject) => {
                fs.copyFile(
                    `dist/tpls/${self.config.tpl.name}/template.css`,
                    `${self.config.outFolder}/source/template.css`,
                    (err) => {
                        err ? reject(err) : resolve();
                    }
                );
            }),
            () => Balle.one((resolve, reject) => {
                fs.copyFile(
                    `dist/tpls/${self.config.tpl.name}/${self.config.tpl.theme}.css`,
                    `${self.config.outFolder}/source/theme.css`,
                    (err) => {
                        err ? reject(err) : resolve();
                    }
                );
            })
        ]).then(() => {
            this.time('styles created');
            resolve();
        }).catch(e => {
            reject(e);
        });
    });
};

Cver.prototype.createBlocks = function () {
    const self = this,
        elements = sh.forKey(self.config, 'blocks').results.reduce(
            (acc, blk) => {
                if (blk.level === 1) {
                    blk.obj.isRoot = true;
                }
                return acc.concat(blk.obj);
            }, []
        );

    return () => Balle.one((resolve, reject) => {
        /**
         * rem: chain expects an array of functions each returning a promise
         */
        Balle.chain(
            elements.map(
                element => () => Balle.one((resolve, reject) => {
                    const elementPath = element.isRoot
                        ? `dist/tpls/${element.name}/index.html`
                        : `dist/tpls/${self.config.tpl.name}/blocks/${element.name}.html`;

                    let content = fs.readFileSync(elementPath, { encoding: 'utf-8' }),
                        blocksContent = '';

                    if (element.alias) {
                        while (content.indexOf(`$${element.name}.`) >= 0) {
                            content = content.replace(`$${element.name}.`, `$${element.alias}.`);
                        }
                    }
                    if (element.blocks) {
                        blocksContent = element.blocks.reduce((acc, current) => {
                            const content = `$$$$${current.alias || current.name}.html$$$$`;
                            return [acc, content].join('\n');
                        }, '');
                    }
                    fs.writeFile(
                        `${self.config.outFolder}/source/${(element.alias || element.name).replace(/^\w*\//, '')}.html`,
                        content.replace('%blocks%', blocksContent),
                        { encoding: 'utf-8' },
                        err => err ? reject(err) : resolve()
                    );
                })
            )
        ).then(() => {
            this.time('blocks created');
            resolve();
        }).catch(e => {
            reject(e);
        });
    });
};

Cver.prototype.runMalta = function () {
    const self = this,
        targetLangs = self.config.translate.to instanceof Array
            ? self.config.translate.to
            : [self.config.translate.to];

    return () => Balle.one((resolve, reject) => {
        Balle.chain(
            targetLangs.map(lang => () => Balle.one(resolve => {
                try {
                    const outName = self.config.outName.match(/%lang%/)
                        ? self.config.outName.replace('%lang%', lang)
                        : `${self.config.outName}_${lang}`;
                    Malta.get().check([
                        `#out/source/${self.config.tpl.name}.html`, 'out',
                        `-plugins=malta-translate[input:"${self.config.translate.from}",output:"${lang}"]...malta-rename[to:"${outName}.html"]...malta-html2pdf[format:"${self.config.format}",border:"${self.config.border}"]`,
                        '-options=showPath:false,verbose:0'
                    ]).start().then(() => {
                        console.log(`ran Malta for lang ${lang}`);
                        resolve();
                    });
                } catch (e) {
                    console.log(e);
                }
            }))
        ).then(() => {
            this.time('malta ran');
            resolve();
        }).catch(e => {
            reject(e);
        });
    });
};

module.exports = Cver;
