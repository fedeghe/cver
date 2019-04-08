const fs = require('fs'),
    path = require('path'),
    Balle = require('balle');

function CverNode (block, parent, solver, cache) {
    const self = this;
    console.log(block, parent, solver);
    this.solvingSteps = [
        0, // content
        0, // %blocks%
        0, // %theme%
        0, // %common%
        0 //  specific blocks placeholders
    ];
    this.parent = parent;
    this.solver = solver;
    this.tpl = block.tpl;
    this.content = null;

    this.data = block.data || {};
    this.blocks = block.blocks || [];
    this.debit = this.blocks.length;
    this.process().then(() => {
        console.log('results');
        console.log(self.content);
    });
}

CverNode.prototype.process = function () {
    const self = this;
    return Balle.one((res, rej) => {
        res();
    });
};

CverNode.prototype.solve = function () {
    this.debit--;
    if (this.debit <= 0) {
        this.solver(this.content);
    }
};

module.exports = CverNode;
