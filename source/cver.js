/* eslint-disable no-console */
const fs = require('fs'),
    Malta = require('malta'),
    Balle = require('balle'),
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
        varsFile = `${self.root}/${self.config.outFolder}/source/vars.json`;
    return () => Balle.one((resolve) => {
        fs.writeFile(varsFile, JSON.stringify({
            header: {
                title: self.config.tpl.header.data.title
            }
        }), (err) => {
            if (err) throw err;
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
                    `dist/blocks/${self.config.tpl.header.component}.html`,
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
                fs.copyFile(
                    `dist/blocks/${el}.html`,
                    `${self.config.outFolder}/source/${el}.html`,
                    (err) => {
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
            `-plugins=malta-translate[input:"${self.config.translate.from}",output:"${self.config.translate.to}"]...malta-html2pdf`
        ]).start().then(() => {
            log('\t\t@runMalta V');
            resolve();
        });
    });
};

module.exports = Cver;
