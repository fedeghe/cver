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
                type: 'template',
                theme: 'light',
                data: {
                    title: labels.header.title,
                    name: 'Federico Ghedina'
                },
                blocks: [{
                    name: 'core/header',
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
                            npm: 'https://www.npmjs.com/~fedeghe',
                            blocks: null
                        }
                    }]
                }, {
                    name: 'core/body',
                    data: {
                        title: 'body title'
                    },
                    blocks: [{
                        name: 'titledSection',
                        data: {
                            title: 'i18n[Informazioni personali]'
                        },
                        blocks: [{
                            name: 'keyValue',
                            data: {
                                key: 'i18n[Luogo di nascita]',
                                value: 'i18n[Padova]'
                            },
                            blocks: null
                        }, {
                            name: 'keyValue',
                            alias: 'dataNasc',
                            data: {
                                key: 'i18n[Data di nascita]',
                                value: '20 /9 / 1976'
                            },
                            blocks: null
                        }]
                    }, {
                        name: 'component1',
                        data: {
                            content: labels.body.component1.content
                        },
                        blocks: null
                    }, {
                        name: 'component1',
                        alias: 'componentx',
                        data: {
                            content: labels.body.component2.content
                        },
                        blocks: null
                    }]
                }, {
                    name: 'core/footer',
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
                                name: 'footer 2'
                            },
                            blocks: null
                        }, {
                            name: 'footer2',
                            alias: 'footerx',
                            data: {
                                name: 'footer x'
                            },
                            blocks: null
                        }]
                    }]
                }]
            }
        };
    cver.setup(config);
    cver.print();
} catch (e) {
    /* eslint-disable no-console */
    console.log(e);
    /* eslint-enable no-console */
}
