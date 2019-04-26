const fs = require('fs'),
    path = require('path'),
    Balle = require('balle');

function CverNode (cache, config, rootTpl, parent, solver) {
    const self = this;
    this.cache = cache;
    this.config = config;
    this.parent = parent;
    this.content = null;
    this.solver = solver;
    this.tpl = config.tpl;
    this.rootTpl = rootTpl;
    this.data = config.data || {};
    this.blocks = config.blocks || [];
    this.debit = 0;
    this.isRoot = parent === null;
    this.process().then(() => {
        console.log(`processing node with parent #${parent || 'root'} done`);
        self.solver(self.content);
    });
    this.replacingStrategy = null;
}

CverNode.prototype.process = function () {
    const self = this;
    console.log(`\tprocessing \`${this.tpl}\``);
    // console.log(self)
    return Balle.chain([
        /* get tpl content */
        () => Balle.one((res, rej) => {
            console.log('\t\tcontent');

            self.content = self.isRoot
                ? self.cache.get(self)
                : self.cache.getBlock(self);
            console.log(self.content)
            res();
        }),

        /* replace all local vars with values */
        () => Balle.one((res, rej) => {
            console.log('\t\tvars');
            for (let k in self.data) {
                const rx = `\\$${self.tpl}.${k}\\$`;
                while (self.content.match(new RegExp(rx, 'gm'))) {
                    self.content = self.content.replace(
                        new RegExp(rx, 'gm'),
                        self.data[k]
                    );
                }
            }
            res();
        }),
        () => Balle.one((res, rej) => {
            // check %blocks%
            if (self.content.match(/%blocks%/)) {
                console.log('\t\thas %blocks%');
                self.replacingStrategy = 'processBlocks';
            } else
            // check $placeholders$
            if (self.content.match(/\$\$([a-z/.]*)\$\$/i)) {
                console.log('\t\thas file placeholders');
                self.replacingStrategy = 'processPlaceholders';
            } else {
                self.replacingStrategy = 'straight';
            }
            res();
        }),
        () => Balle.one((res, rej) => {
            self.solver = res;
            self[self.replacingStrategy]();
        })
    ]);
};

CverNode.prototype.processBlocks = function () {
    console.log('\t\t\tblocks');
    const self = this;
    this.debit = this.config.blocks.length;
    this.config.blocks.forEach(block => new CverNode(
        self.cache,
        block,
        self.rootTpl,
        self,
        self.solve
    ));
    console.log(self.blocks);
};

CverNode.prototype.solve = function () {
    this.debit--;
    if (this.debit === 0) {
        this.solver();
    }
};

CverNode.prototype.processPlaceholders = function (solver) {

    console.log('\t\t\tplaceholders');
    solver();
};

CverNode.prototype.straight = function (solver) {
    console.log('process straight');
    solver();
};

CverNode.prototype.solve = function () {
    this.debit--;
    if (this.debit <= 0) {
        this.solver(this.content);
    }
};

module.exports = CverNode;
