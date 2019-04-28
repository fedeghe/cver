const fs = require('fs'),
    path = require('path'),
    Balle = require('balle');

function CverNode (config, parent, rootTpl, resolutor) {
    console.log(config)
    const self = this;
    this.config = config;
    this.rootTpl = rootTpl;
    this.parent = parent;
    this.content = null;
    this.resolutor = resolutor;
    this.isRoot = parent === null;

    this.tpl = config.tpl;
    this.data = config.data || {};
    this.blocks = config.blocks || [];
    this.debit = 0;

    this.process().then(() => {
        console.log(`processing node with parent #${parent || 'root'} done`);
        self.resolutor(self.content);
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
            console.log('isRoot', self.isRoot)

            self.content = self.isRoot
                ? CverNode.Cache.getTpl(self)
                : CverNode.Cache.getBlock(self);
            // console.log(self.content);
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
    console.log('\t\t\tprocessing blocks');
    const self = this;
    this.debit = this.config.blocks.length;
    this.config.blocks.forEach(
        block => new CverNode(
            block, self, self.rootTpl, self.solve
        )
    );
    console.log(self.blocks);
};

CverNode.prototype.solve = function () {
    this.debit--;
    if (this.debit === 0) {
        console.log('SOLVED');
        this.solver();
    }
};

CverNode.prototype.processPlaceholders = function () {
    console.log('\t\t\tprocessing placeholders');
    this.solver();
};

CverNode.prototype.straight = function () {
    console.log('process straight');
    this.solver();
};

CverNode.prototype.solve = function () {
    this.debit--;
    if (this.debit <= 0) {
        this.solver(this.content);
    }
};

module.exports = CverNode;
