/* eslint-disable no-console */

const fs = require('fs'),
    path = require('path'),
    Malta = require('malta'),
    Balle = require('balle'),
    sh = require('searchhash'),
    CverNode = require('./CverNode'),
    Cache = {
        tpls: {},
        blocks: {}
    };

Cache.get = function (node) {
    let ret = this.tpls[node.tpl];
    if (!ret) {
        ret = fs.readFileSync(path.resolve(`dist/tpls/${node.tpl}/index.html`), { encoding: 'utf-8' });
        this.tpls[node.tpl] = ret;
    }
    return ret;
};
Cache.getBlock = function (node) {
    let ret = this.blocks[node.tpl];
    if (!ret) {
        ret = fs.readFileSync(path.resolve(`dist/tpls/${node.rootTpl}/blocks/${node.tpl}/index.html`), { encoding: 'utf-8' });
        this.blocks[node.tpl] = ret;
    }
    return ret;
};


function Cver (config) {
    this.config = config;
    this.printConfig = config.print;
    this.content = null;
    this.tpl = config.tpl;
    this.themes = config.themes || [];
    this.core = null;
    this.ready = false;
    this.root = process.cwd();
}

Cver.prototype.start = function () {
    const self = this;
    return Balle.chain([
        () => self.prepare(),
        () => self.dig(),
        (r) => self.coreHead(r),
        (r) => self.print()
    ]).finally(() => {
        console.log('the end anyway');
    });
};

Cver.prototype.prepare = function () {
    const self = this;
    /**
     * %core%:
     * - both core/common and theme styles
     * - core/script
     */
    return Balle.one((res, rej) => {
        console.log('preparing');
        const common = fs.readFileSync(
                path.resolve(`dist/tpls/common.css`),
                { encoding: 'utf-8' }
            ),
            themeStyles = self.themes.reduce(
                (acc, theme) => `${acc}\n${fs.readFileSync(path.resolve(`dist/tpls/${self.tpl}/themes/${theme}.css`), { encoding: 'utf-8' })}`,
                common
            ),
            script = fs.readFileSync(path.resolve(`dist/tpls/script.js`), { encoding: 'utf-8' });
        this.core = `<script>${script}</script><style>${themeStyles}</style>`;
        res();
    });
};

Cver.prototype.dig = function (r) {
    const self = this;
    return Balle.one((res, rej) => {
        console.log('start digging');
        return new CverNode(
            Cache,
            self.config,
            self.tpl, // root
            null,   // root
            r => res(r)
        );
    });
};

Cver.prototype.coreHead = function (content) {
    const self = this;
    self.content = content;
    return Balle.one((res, rej) => {
        console.log('core head');
        self.content = self.content.replace(/%core%/, self.core);
        res();
    });
};

Cver.prototype.print = function () {
    const self = this;
    return Balle.one((res, rej) => {
        console.log('printing size', self.content.length);
        // console.log(self.content);
        res();
    });
};

module.exports = Cver;
