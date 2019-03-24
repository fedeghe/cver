/* eslint-disable no-console */
const fs = require('fs'),
    Malta = require('malta'),
    Balle = require('balle'),
    sh = require('searchhash'),
    doLog = true,
    log = msg => doLog && console.log(msg);

function Cver () {
    this.times = {};
    this.times.start = new Date();
    this.config = null;
    this.ready = false;
    this.root = process.cwd();
}

Cver.prototype.setup = function (config) {
    this.config = config;
};

Cver.prototype.print = function () {
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
    log('\t\t@createVars'); const self = this,
        varsFile = `${self.root}/${self.config.outFolder}/source/vars.json`,
        data = sh.forKey(self.config, 'data');

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
                key = d.obj.name;
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
        fs.writeFile(varsFile, JSON.stringify(baseObj), (err) => {
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
            resolve();
        }).catch(e => {
            reject(e);
        });
    });
};

Cver.prototype.createBlocks = function () {
    log('\t\t@createBlocks');
    const self = this;

    return () => Balle.one((resolve, reject) => {
        Balle.chain(['header', 'body', 'footer'].map(el => () => Balle.one(
            (resolve, reject) => {
                let sectionContent = fs.readFileSync(`dist/blocks/core/${el}.html`, { encoding: 'utf-8' }),
                    blocksContent = '';

                if (self.config.tpl[el].blocks) {
                    blocksContent = self.config.tpl[el].blocks.reduce((acc, current) => {
                        const content = `$$$$${current.alias || current.name}.html$$$$`;
                        return [acc, content].join('\n');
                    }, '');
                }

                fs.writeFile(
                    `${self.config.outFolder}/source/${el}.html`,
                    sectionContent.replace(`%${el}_blocks%`, blocksContent),
                    err => {
                        err ? reject(err) : resolve();
                    }
                );
            })
        ).concat(
            [].concat(
                self.config.tpl.header.blocks,
                self.config.tpl.body.blocks,
                self.config.tpl.footer.blocks
            ).map(
                block => () => Balle.one((resolve, reject) => {
                    let content = fs.readFileSync(`dist/blocks/${block.name}.html`, { encoding: 'utf-8' });
                    if (block.alias) {
                        while (content.indexOf(`$${block.name}.`) >= 0) {
                            content = content.replace(`$${block.name}.`, `$${block.alias}.`);
                        }
                    }
                    fs.writeFile(
                        `${self.config.outFolder}/source/${block.alias || block.name}.html`,
                        content,
                        { encoding: 'utf-8' },
                        (err) => {
                            err ? reject(err) : resolve();
                        }
                    );
                    /*
                    fs.copyFile(
                        `dist/blocks/${block.name}.html`,
                        `${self.config.outFolder}/source/${block.name}.html`,
                        (err) => {
                            err ? reject(err) : resolve();
                        }
                    );
                    */


                })
            )
        )).then(() => {
            log('\t\t@createBlocks V');
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
            resolve();
        }).catch(e => {
            reject(e);
        });
    });
};

module.exports = Cver;
