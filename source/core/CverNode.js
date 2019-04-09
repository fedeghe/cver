const fs = require('fs'),
    path = require('path'),
    Balle = require('balle');

function CverNode (config, content, parent, solver) {
    const self = this;
    this.config = config;
    this.parent = parent;
    this.content = content;
    this.solver = solver;
    this.tpl = config.tpl;

    this.data = config.data || {};
    this.blocks = config.blocks || [];
    this.debit = 0;
    this.scan().then(() => {
        console.log('results');
        self.solver();
    });

    this.replacingStrategy = null;
}

CverNode.prototype.processBlocks = function (solver) {
    console.log('process blocks');
    const self = this;
    this.debit = this.config.blocks.length;
    console.log(self.blocks);
    solver();
};

CverNode.prototype.processPlaceholders = function (solver) {
    console.log('process placeholders');
    solver();
};
CverNode.prototype.straight = function (solver) {
    console.log('process straight');
    solver();
};

CverNode.prototype.scan = function () {
    const self = this;
    // console.log(self)
    return Balle.chain([
        () => Balle.one((res, rej) => {
            // check %blocks%
            if (self.content.match(/%blocks%/)) {
                console.log('has %blocks%');
                self.replacingStrategy = 'processBlocks';
            } else
            // check $placeholders$
            if (self.content.match(/\$\$([a-z/.]*)\$\$/i)) {
                console.log('has file placeholders');
                self.replacingStrategy = 'processPlaceholders';
            } else {
                self.replacingStrategy = 'straight';
            }
            res();
        }),
        () => Balle.one((res, rej) => {
            self[self.replacingStrategy](res);
        })
    ]);
};

CverNode.prototype.solve = function () {
    this.debit--;
    if (this.debit <= 0) {
        this.solver(this.content);
    }
};

module.exports = CverNode;
