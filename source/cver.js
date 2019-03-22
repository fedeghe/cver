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
            self.createSections(),
            self.runMalta()
        ]).then(() => {
            log('\t@prepare V');
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
Cver.prototype.createSections = function () {
    log('\t\t@createSections');
    const self = this;
    return () => Balle.one(resolve => {
        Balle.chain([
            () => Balle.one(resolve => {
                fs.copyFile(
                    `dist/tpls/${self.config.tpl.file}/index.html`,
                    `${self.config.outFolder}/source/${self.config.tpl.file}.html`,
                    (err) => {
                        console.log('copy1 done');
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
                        console.log('copy2 done');
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
                        console.log('copy3 done');
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
                        console.log('copy4 done');
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
                        console.log('copy5 done');
                        if (err) throw err;
                        resolve();
                    }
                );
            })
        ))).then(() => {
            log('\t\t@createSections V');
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
            '-plugins=malta-html2pdf'
        ]).start().then(() => {
            log('\t\t@runMalta V');
            resolve();
        });
    });
};

module.exports = Cver;
