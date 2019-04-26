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
    this.config = Object.assign({}, config, { Cache });
    this.printCOnfig = config.print;
    this.content = '';
}

Cver.prototype.start = function () {
    const self = this;
    return Balle.one(
        (res, rej) => new CverNode(self.config, null, self.config, res)
    ).finally(() => {
        console.log('the end anyway');
    });
};


module.exports = Cver;
