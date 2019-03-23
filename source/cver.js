/* eslint-disable no-console */
const fs = require('fs'),
    Malta = require('malta'),
    Balle = require('balle'),
    sh = require('searchhash'),
    malta = Malta.get(),

    doLog = true,
    log = msg => doLog && console.log(msg);

function Cver () {
    this.config = null;
    this.ready = false;
    this.root = process.cwd();
}

Cver.prototype.setup = function (config) {
    this.config = config;
};

Cver.prototype.print = function () {
    log('@print');
    this.prepare().then(() => {
        log('@print V');
    });
};

Cver.prototype.prepare = function () {
    log('\t@prepare');
    const self = this;

    return Balle.one((resolve) => {
        Balle.chain([
            self.createOutDir(),
            self.createBlocks(),
            self.createVars(),
            self.runMalta()
        ]).then(() => {
            log('\t@prepare V');
            resolve();
        });
    });
};


Cver.prototype.createVars = function () {
    log('\t\t@createVars');
    const self = this,
        varsFile = `${self.root}/${self.config.outFolder}/source/vars.json`,
        data = sh.forKey(self.config, 'data');
    console.log(data);
    console.log('------');
    let baseObj = {};

    data.forEach(d => {
        console.log(d.obj)
        baseObj[d.obj.name] = baseObj[d.obj.name] || {};
        for (let i in d.value) {
            baseObj[d.obj.name][i] = d.value[i];
        }
    });

    console.log(JSON.stringify(baseObj));

    return () => Balle.one(resolve => {
        fs.writeFile(varsFile, JSON.stringify(baseObj), (err) => {
            if (err) {
                console.log(err);
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

Cver.prototype.createBlocks = function () {
    log('\t\t@createBlocks');
    const self = this;
    return () => Balle.one(resolve => {
        Balle.chain([
            () => Balle.one(resolve => {
                fs.copyFile(
                    `dist/tpls/${self.config.tpl.file}/index.html`,
                    `${self.config.outFolder}/source/${self.config.tpl.file}.html`,
                    (err) => {
                        if (err) throw err;
                        resolve();
                    }
                );
            }),
            () => Balle.one(resolve => {
                fs.copyFile(
                    `dist/blocks/${self.config.tpl.header.name}.html`,
                    `${self.config.outFolder}/source/header.html`,
                    (err) => {
                        if (err) throw err;
                        resolve();
                    }
                );
            }),
            () => Balle.one(resolve => {
                fs.copyFile(
                    `dist/tpls/${self.config.tpl.file}/style.css`,
                    `${self.config.outFolder}/source/style.css`,
                    (err) => {
                        if (err) throw err;
                        resolve();
                    }
                );
            })
        ].concat(['body', 'footer'].map(el => () => Balle.one(
            resolve => {
                let sectionContent = fs.readFileSync(`dist/blocks/${el}.html`, { encoding: 'UTF8' }),
                    blocksContent = '';

                if (self.config.tpl[el].blocks) {
                    blocksContent = self.config.tpl[el].blocks.reduce((acc, current) => {
                        const content = `$$$$${current.name}.html$$$$`;
                        console.log(content);
                        return [acc, content].join('\n');
                    }, '');
                    console.log(blocksContent, sectionContent);
                }
            
                fs.writeFile(
                    `${self.config.outFolder}/source/${el}.html`,
                    sectionContent.replace(`%${el}_blocks%`, blocksContent),
                    err => {
                        if (err) throw err;
                        resolve();
                    }
                );
            })
        )).concat(self.config.tpl.body.blocks.map(
            block => () => Balle.one(resolve => {
                fs.copyFile(
                    `dist/blocks/${block.name}.html`,
                    `${self.config.outFolder}/source/${block.name}.html`,
                    (err) => {
                        if (err) throw err;
                        resolve();
                    }
                );
            })
        ))).then(() => {
            log('\t\t@createBlocks V');
            resolve();
        });
    });
};

Cver.prototype.runMalta = function () {
    log('\t\t@runMalta');
    const self = this;
    return () => Balle.one(resolve => {
        malta.check([
            `#out/source/${self.config.tpl.file}.html`, 'out',
            `-plugins=malta-translate[input:"${self.config.translate.from}",output:"${self.config.translate.to}"]...malta-html2pdf`,
            '-options=showPath:false'
        ]).start().then(() => {
            log('\t\t@runMalta V');
            resolve();
        });
    });
};

module.exports = Cver;
