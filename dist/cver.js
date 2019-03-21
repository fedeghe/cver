const fs = require('fs'),
    path = require('path'),
    Malta = require('malta'),
    malta = Malta.get();

const doLog = true;
const log = (msg) => {
    doLog && console.log(msg);
}

function Cver () {
    this.config = null;
    this.ready = false;
}

Cver.prototype.setup = function (config) {
    this.config = config;
};

Cver.prototype.print = function () {
    var self = this;
    log('@print')
    this.prepare().then(self.run).then(() => {
        log('@print V')
    });
};

Cver.prototype.prepare = function () {
    log('\t@prepare')
    const self = this;
    return new Promise((resolve, reject) => {
        return Promise.all([
            self.createOutDir(),
            self.createSections(),
            self.runMalta()
        ]).then(() => {
            log('\t@prepare V')
            resolve();
        });
    });
};

Cver.prototype.createOutDir = function () {
    log('\t\t@createOutDir');
    const self = this;
    return new Promise((resolve, reject) => {
        fs.mkdir(`${self.config.outFolder}/source`, { recursive: true }, () => {
            log('\t\t@createOutDir V');
            resolve();
        });
    });
};
Cver.prototype.createSections = function () {
    log('\t\t@createSections');
    const self = this;
    return new Promise((resolve, reject) => {
        Promise.all([
            new Promise((resolve, reject) => {
                fs.copyFile(
                    `dist/tpls/${self.config.tpl.file}/index.html`,
                    `${self.config.outFolder}/source/${self.config.tpl.file}.html`,
                    (err) => {
                        if (err) throw err;
                        resolve();
                    }
                );
            }),
            new Promise((resolve, reject) => {
                fs.copyFile(
                    `dist/blocks/${self.config.tpl.header.component}.html`,
                    `${self.config.outFolder}/source/header.html`,
                    (err) => {
                        if (err) throw err;
                        resolve();
                    }
                );
            }),
            new Promise((resolve, reject) => {
                fs.copyFile(
                    `dist/tpls/${self.config.tpl.file}/style.css`,
                    `${self.config.outFolder}/source/style.css`,
                    (err) => {
                        if (err) throw err;
                        resolve();
                    }
                );
            })
        ].concat(['body', 'footer'].map((el) => (
            new Promise((resolve, reject) => {
                fs.copyFile(
                    `dist/blocks/${el}.html`,
                    `${self.config.outFolder}/source/${el}.html`,
                    (err) => {
                        if (err) throw err;
                        resolve();
                    }
                );
            })
        ))).concat(self.config.tpl.body.blocks.map((block) => (
            new Promise((resolve, reject) => {
                fs.copyFile(
                    `dist/blocks/${block.name}.html`,
                    `${self.config.outFolder}/source/${block.name}.html`,
                    (err) => {
                        if (err) throw err;
                        resolve();
                    }
                );
            })
        )))).then(() => {
            log('\t\t@createSections V');
            resolve();
        });
    });
};

Cver.prototype.runMalta = function () {
    log('\t\t@runMalta');
    const self = this;
    return new Promise((resolve, reject) => {
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
