try {
    const Cver = require('./cver'),

        cver = new Cver(),

        labels = {
            header: {
                title: 'i18n[Presentazione]'
            },
            body: {
                component1: {
                    content: 'i18n[il mio contenuto]'
                },
                component2: {
                    content: 'i18n[un commento]'
                }
            }
        },

        config = {
            outFolder: 'out',
            translate: {
                from: 'it',
                to: 'en'
            },
            tpl: {
                name: 'one',
                theme: 'dark',
                data: {
                    title: labels.header.title
                },
                // style: 'dark',
                header: {
                    data: {
                        name: 'my name'
                    },
                    blocks: [{
                        name: 'header1',
                        data: {
                            content: 'contatto skype',
                            img: 'http://www.jmvc.org/fg.jpg',
                            title: labels.header.title,
                            name: 'Federico Ghedina'
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
                        name: 'component2',
                        data: {
                            content: labels.body.component2.content
                        }
                    }]
                },
                footer: {
                    data: {
                        name: 'i18n[il mio piede]'
                    },
                    blocks: [{
                        name: 'footer1',
                        data: {
                            name: 'Erol'
                        }
                    }]
                }
            }
        };
    cver.setup(config);
    cver.print();
} catch (e) {
    console.log(e);
}
