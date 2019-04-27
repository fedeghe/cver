const fs = require('fs'),
    path = require('path'),
    Cache = {
        tpls: {},
        blocks: {}
    };

Cache.getTpl = function (node) {
    const k = node.tpl;
    console.log('getting template', k);
    if (!Cache.tpls[k]) {
        Cache.tpls[k] = fs.readFileSync(
            path.resolve(`dist/tpls/${k}/index.html`),
            { encoding: 'utf-8' }
        );
    }
    return Cache.tpls[k];
};

Cache.getBlock = function (node) {
    const k = node.tpl;
    console.log('getting block', k);
    if (!Cache.blocks[k]) {
        Cache.blocks[k] = fs.readFileSync(
            path.resolve(`dist/tpls/${node.rootTpl}/blocks/${k}/index.html`),
            { encoding: 'utf-8' }
        );
    }
    return Cache.blocks[k];
};

module.exports = Cache;
