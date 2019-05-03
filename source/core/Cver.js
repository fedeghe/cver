/* eslint-disable no-console */

const Malta = require('malta'),
    Balle = require('balle'),
    CverNode = require('./CverNode');


function Cver (config) {
    this.config = config;
    // console.log(this.config)
    this.printConfig = config.print;
    this.content = '';
}

Cver.prototype.start = function () {
    const self = this;
    return Balle.one(
        (res, rej) => new CverNode(self.config, null, self.config.tpl, res)
    ).finally(() => {
        console.log('the end anyway');
    });
};


module.exports = Cver;
