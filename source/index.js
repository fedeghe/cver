try {
    const Cver = require('./cver'),

        cver = new Cver(),

        labels = {
            header: {
                title: 'i18n[Presentazione]'
            },
            body: {
                component1: {
                    content: 'i18n[Esperienze Lavorative]'
                },
                component2: {
                    content: 'i18n[Capacita tecniche]'
                }
            }
        },

        config = {
            format: 'A4',
            outFolder: 'out',
            outName: 'Federico_Ghedina_cv',
            translate: {
                from: 'it',
                to: ['en', 'de']
            },
            tpl: {
                name: 'one',
                theme: 'dark',
                data: {
                    title: labels.header.title,
                    name: 'Federico Ghedina'
                },
                // style: 'dark',
                header: {
                    data: {
                        name: 'Federico Ghedina',
                        title: 'Curriculum vitae'
                    },
                    blocks: [{
                        name: 'header1',
                        data: {
                            content: 'contatto skype',
                            img: 'http://www.jmvc.org/fedeghe.jpeg',
                            title: labels.header.title,
                            email: 'federico.ghedina@gmail.com',
                            mobile: '+49 162 7305989',
                            skype: 'federico.ghedina',
                            linkedin: 'http://www.linkedin.com/in/federicoghedina',
                            github: 'https://github.com/fedeghe',
                            npm: 'https://www.npmjs.com/~fedeghe'
                        }
                    }]
                },
                body: {
                    data: {
                        title: 'body title'
                    },
                    blocks: [{
                        name: 'component1',
                        data: {
                            content: labels.body.component1.content
                        }
                    }, {
                        name: 'component1',
                        alias: 'componentx',
                        data: {
                            content: labels.body.component2.content
                        }
                    }]
                },
                footer: {
                    data: {
                        name: 'i18n[Questa é la fine]',
                        made: 'Built on __DATE__ using <a href="$cverGithub$">cver</a>'
                    },
                    blocks: [{
                        name: 'footer1',
                        data: {
                            name: 'Erol'
                        },
                        blocks: [{
                            name: 'footer2',
                            data: {
                                name: 'josef'
                            }
                        }, {
                            name: 'footer2',
                            alias: 'footerx',
                            data: {
                                name: 'federico'
                            }
                        }]
                    }]
                }
            }
        };
    cver.setup(config);
    cver.print();
} catch (e) {
    /* eslint-disable no-console */
    console.log(e);
    /* eslint-enable no-console */
}
