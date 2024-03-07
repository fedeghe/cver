/* eslint-disable no-console */
const fs = require('fs'),
    Malta = require('malta'),
    Balle = require('balle'),
    sh = require('searchhash'),
    time = true,
    baseVars = {
        cverGithub: 'https://github.com/fedeghe/cver',
        cverNpm: 'https://github.com/fedeghe/cver',
        cverAuthor: '$PACKAGE.author$',
        cverVersion: '$PACKAGE.version$'
    };

class Cver {
    constructor (config) {
        this.times = [];
        this.config = config || null;
        this.ready = false;
        this.root = process.cwd();
    }

    time (msg) {
        this.times.push(+new Date());
        const len = this.times.length;
        if (time) {
            console.log(`${msg} in ${this.times[len - 1] - this.times[len - 2]}ms`);
        }
    }

    print () {
        this.times.push(+new Date());
        Balle.chain([
            this.process(),
            this.runMalta()
        ]).then(() => {
            console.log('...done');
        });
    }

    process () {
        return () => Balle.one(resolve => {
            Balle.chain([
                this.outDirPromiseFunc,
                this.varsPromiseFunc,
                this.tplPromiseFunc,
                this.stylesPromiseFunc,
                this.blocksPromiseFunc
            ]).then(() => {
                resolve();
            });
        });
    };

    get outDirPromiseFunc () {
        return () => Balle.one(resolve => {
            Balle.chain([
                () => Balle.one(resolve => {
                    fs.mkdir(`${this.root}/${this.config.outFolder}/source`, { recursive: true }, err => {
                        if (err && err.code !== 'EEXIST') {
                            throw err;
                        }
                        resolve();
                    });
                })
            ]).then(() => {
                this.time('outdir created');
                resolve();
            });
        });
    }

    get varsPromiseFunc () {
        const data = sh.forKey(this.config, 'data'),
            varsFile = `${this.root}/${this.config.outFolder}/source/vars.json`,
            fixConfig = () => {
                let cache = {};
                data.forEach(blk => {
                    // add blocks if not there
                    if (!('blocks' in blk.obj)) {
                        blk.obj.blocks = [];
                    }
                    // add alias if needed
                    blk.obj.blocks.forEach(b => {
                        if (b.name in cache) {
                            b.alias = `${b.name}_${cache[b.name]}`;
                            cache[b.name]++;
                        } else {
                            cache[b.name] = 0;
                        }
                    });
                });
            };
        fixConfig();

        let baseObj = Object.assign({}, baseVars);

        data.forEach(d => {
            let key = null;
            switch (true) {
                case 'alias' in d.obj:
                    key = d.obj.alias;
                    break;
                case 'name' in d.obj:
                    key = d.obj.name.replace(/^\w*\//, ''); // remove `whatever/` useful only for separation of header & body & footer
                    break;
                // case 'parentKey' in d:
                //     key = d.parentKey;
                //     break;
                default:;
            }
            baseObj[key] = baseObj[key] || {};
            for (let i in d.value) {
                baseObj[key][i] = d.value[i];
            }
        });

        return () => Balle.one(resolve => {
            fs.writeFile(varsFile, JSON.stringify(baseObj, null, '\t'), (err) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                resolve();
            });
        });
    }

    get tplPromiseFunc () {
        return () => Balle.one((resolve, reject) => {
            fs.copyFile(
                `dist/tpls/${this.config.tpl.name}/index.html`,
                `${this.config.outFolder}/source/${this.config.tpl.name}.html`,
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.time('tpl created');
                        resolve();
                    }
                }
            );
        });
    };

    get stylesPromiseFunc () {
        const resolver = (resolve, reject) => (err) => err ? reject(err) : resolve();
        return () => Balle.one((resolve, reject) => {
            Balle.chain([
                () => Balle.one((resolve, reject) => {
                    fs.copyFile(
                        'dist/tpls/common.css',
                        `${this.config.outFolder}/source/common.css`,
                        resolver(resolve, reject)
                    );
                }),
                () => Balle.one((resolve, reject) => {
                    fs.copyFile(
                        `dist/tpls/${this.config.tpl.name}/template.css`,
                        `${this.config.outFolder}/source/template.css`,
                        resolver(resolve, reject)
                    );
                }),
                () => Balle.one((resolve, reject) => {
                    fs.copyFile(
                        `dist/tpls/${this.config.tpl.name}/${this.config.tpl.theme}.css`,
                        `${this.config.outFolder}/source/theme.css`,
                        resolver(resolve, reject)
                    );
                })
            ]).then(() => {
                this.time('styles created');
                resolve();
            }).catch(e => {
                reject(e);
            });
        });
    };

    get blocksPromiseFunc () {
        const elements = sh.forKey(this.config, 'blocks').reduce(
            (acc, blk) => {
                if (blk.level === 1) {
                    blk.obj.isRoot = true;
                }
                return acc.concat(blk.obj);
            }, []
        );

        return () => Balle.one((resolve, reject) => {
            /**
             * rem: chain expects an array of functions each returning a promise
             */
            Balle.chain(
                elements.map(
                    element => () => Balle.one((resolve, reject) => {
                        const elementPath = element.isRoot
                            ? `dist/tpls/${element.name}/index.html`
                            : `dist/tpls/${this.config.tpl.name}/blocks/${element.name}.html`;

                        let content = fs.readFileSync(elementPath, { encoding: 'utf-8' }),
                            blocksContent = '';

                        if (element.alias) {
                            while (content.indexOf(`$${element.name}.`) >= 0) {
                                content = content.replace(`$${element.name}.`, `$${element.alias}.`);
                            }
                        }
                        if (element.blocks) {
                            blocksContent = element.blocks.reduce((acc, current) => {
                                const content = `$$$$${current.alias || current.name}.html$$$$`;
                                return [acc, content].join('\n');
                            }, '');
                        }
                        fs.writeFile(
                            `${this.config.outFolder}/source/${(element.alias || element.name).replace(/^\w*\//, '')}.html`,
                            content.replace('%blocks%', blocksContent),
                            { encoding: 'utf-8' },
                            err => err ? reject(err) : resolve()
                        );
                    })
                )
            ).then(() => {
                this.time('blocks created');
                resolve();
            }).catch(e => {
                reject(e);
            });
        });
    };

    runMalta () {
        const targetLangs = this.config.translate.to instanceof Array
            ? this.config.translate.to
            : [this.config.translate.to];

        return () => Balle.one((resolve, reject) => {
            Balle.chain(
                targetLangs.map(lang => () => Balle.one(resolve => {
                    try {
                        const outName = this.config.outName.match(/%lang%/)
                            ? this.config.outName.replace('%lang%', lang)
                            : `${this.config.outName}_${lang}`;
                        Malta.get().check([
                            `#${this.config.outFolder}/source/${this.config.tpl.name}.html`, this.config.outFolder,
                            '-plugins='
                                + `malta-translate[input:"${this.config.translate.from}",output:"${lang}"]`
                                + `...malta-rename[to:"${outName}.html"]`
                                + `...malta-html2pdf[format:"${this.config.format}",border:"${this.config.border}"]`,
                            '-options=showPath:false,verbose:0'
                        ]).start().then(() => {
                            console.log(`ran Malta for lang ${lang}`);
                            resolve();
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }))
            ).then(() => {
                this.time('malta ran');
                resolve();
            }).catch(e => {
                reject(e);
            });
        });
    };
}


module.exports = Cver;
