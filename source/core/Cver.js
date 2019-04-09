/* eslint-disable no-console */

const fs = require('fs'),
    path = require('path'),
    Malta = require('malta'),
    Balle = require('balle'),
    sh = require('searchhash'),
    CverNode = require('./CverNode'),
    Cache = {
        tpls: {}
    };

Cache.get = function (n) {
    let ret = this.tpls[n];
    if (!ret) {
        ret = fs.readFileSync(path.resolve(`dist/tpls/${n}/index.html`), { encoding: 'utf-8' });
        this.tpls[n] = ret;
    }
    return ret;
};

function Cver (config) {
    this.config = config;
    this.printConfig = config.print;
    this.content = null;
    this.tpl = config.tpl;
    this.data = config.data;
    this.blocks = config.blocks;
    this.themes = config.themes || [];
    this.ready = false;
    this.root = process.cwd();
}

Cver.prototype.start = function () {
    const self = this;
    return Balle.chain([
        () => self.prepare(),
        (r) => self.dig(r),
        (r) => self.print(r)
    ]).then((res, rej) => {
        console.log('result: ', res)
    }).catch((e) => {
        console.log(e);
    }).finally(() => {
        console.log('the end anyway')
    });
};

Cver.prototype.dig = function (r) {
    const self = this;
    return Balle.one((res, rej) => {
        console.log('..... start digging');
        new CverNode(self.config, self.content, null, () => res(r));
        // res();
    });
};

Cver.prototype.print = function (r) {
    const self = this;
    return Balle.one((res, rej) => {
        console.log('..... printing');
        // console.log(self.content);
        res(['zzzz', r]);
    });
};

Cver.prototype.prepare = function () {
    const self = this;
    return Balle.chain([
        /**
         * get tpl content
         */
        () => Balle.one((res, rej) => {
            self.content = Cache.get(self.tpl);
            res(1);
        }),

        /**
         * %core%:
         * - both core/common and theme styles
         * - core/script
         */
        (n) => Balle.one((res, rej) => {
            const common = fs.readFileSync(
                    path.resolve(`dist/tpls/common.css`),
                    { encoding: 'utf-8' }
                ),
                themeStyles = self.themes.reduce(
                    (acc, theme) => `${acc}\n${fs.readFileSync(path.resolve(`dist/tpls/${self.tpl}/themes/${theme}.css`), { encoding: 'utf-8' })}`,
                    common
                ),
                script = fs.readFileSync(path.resolve(`dist/tpls/script.js`), { encoding: 'utf-8' });

            self.content = self.content.replace(/%core%/, `<script>${script}</script><style>${themeStyles}</style>`);
            res(n+2);
        }),

        /**
         * replace all local vars with values
         */
        (n) => Balle.one((res, rej) => {            
            for (let k in self.data) {
                const rx = `\\$${self.tpl}.${k}\\$`;
                while (self.content.match(new RegExp(rx, 'gm'))) {
                    self.content = self.content.replace(
                        new RegExp(rx, 'gm'),
                        self.data[k]
                    );
                }
            }
            res(n+3);
        })
    ]).then( r => r);
};

module.exports = Cver;
