/* eslint-disable no-console */
const fs = require('fs'),
    Malta = require('malta'),
    Balle = require('balle'),
    sh = require('searchhash'),
    doLog = false,
    time = true,
    log = msg => doLog && console.log(msg);

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
    log('@print');
    const self = this;
    Balle.chain([
        self.process(),
        self.runMalta()
    ]).then(() => {
        log('@print V');
        log('done');
    });
};

Cver.prototype.process = function () {
    const self = this;
    return () => Balle.one(resolve => {
        log('\t@process');
        Balle.chain([
            self.createOutDir(),
            self.createVars(),
            self.createTpl(),
            self.createStyles(),
            self.createBlocks()
        ]).then(() => {
            log('\t@process V'); resolve();
        });
    });
};

Cver.prototype.createVars = function () {
    log('\t\t@createVars');
    const self = this,
        varsFile = `${self.root}/${self.config.outFolder}/source/vars.json`,
        fixConfig = () => {
            let cache = {};
            const blks = sh.forKey(self.config, 'data');
            blks.forEach(blk => {
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

    let data = sh.forKey(self.config, 'data'),
        baseObj = {
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
            case 'parentKey' in d:
                key = d.parentKey;
                break;
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
                log(err);
                throw err;
            }
            log('\t\t@createVars V');
            resolve();
        });
    });
};

Cver.prototype.createOutDir = function () {
    log('\t\t@createOutDir');
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
            log('\t\t@createOutDir V');
            this.time('outdir created');
            resolve();
        });
    });
};

Cver.prototype.createTpl = function () {
    log('\t\t@createTpl');
    const self = this;
    return () => Balle.one((resolve, reject) => {
        fs.copyFile(
            `dist/tpls/${self.config.tpl.name}/index.html`,
            `${self.config.outFolder}/source/${self.config.tpl.name}.html`,
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    log('\t\t@createTpl V');
                    this.time('tpl created');
                    resolve();
                }
            }
        );
    });
};

Cver.prototype.createStyles = function () {
    log('\t\t@createStyles');
    const self = this;

    return () => Balle.one((resolve, reject) => {
        Balle.chain([
            () => Balle.one((resolve, reject) => {
                fs.copyFile(
                    `dist/tpls/common.css`,
                    `${self.config.outFolder}/source/common.css`,
                    (err) => {
                        err ? reject(err) : resolve();
                    }
                );
            }),
            () => Balle.one((resolve, reject) => {
                fs.copyFile(
                    `dist/tpls/${self.config.tpl.name}/${self.config.tpl.theme}.css`,
                    `${self.config.outFolder}/source/style.css`,
                    (err) => {
                        err ? reject(err) : resolve();
                    }
                );
            })
        ]).then(() => {
            log('\t\t@createStyles V');
            this.time('styles created');
            resolve();
        }).catch(e => {
            reject(e);
        });
    });
};

Cver.prototype.createBlocks = function () {
    log('\t\t@createBlocks');
    const self = this;
    let elements = sh.forKey(self.config, 'blocks');

    elements = elements.reduce(
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
                        : `dist/blocks/${element.name}.html`;

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
                        content.replace(`%blocks%`, blocksContent),
                        { encoding: 'utf-8' },
                        (err) => {
                            err ? reject(err) : resolve();
                        }
                    );
                })
            )
        ).then(() => {
            log('\t\t@createBlocks V');
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
        log('\t@runMaltas');
        Balle.chain(
            targetLangs.map(lang => () => Balle.one(resolve => {
                log(`\t\t@runMalta for lang ${lang}`);
                Malta.get().check([
                    `#out/source/${self.config.tpl.name}.html`, 'out',
                    `-plugins=malta-translate[input:"${self.config.translate.from}",output:"${lang}"]...malta-rename[to:"${self.config.outName}_${lang}.html"]...malta-html2pdf[format:"${self.config.format}",border:"0.2in"]`,
                    '-options=showPath:false,verbose:0'
                ]).start().then(() => {
                    log(`\t\t@runMalta for lang ${lang} V`);
                    resolve();
                });
            }))
        ).then(() => {
            log('\t@runMaltas V');
            this.time('malta ran');
            resolve();
        }).catch(e => {
            reject(e);
        });
    });
};

module.exports = Cver;
