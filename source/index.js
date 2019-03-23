
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
            file: 'one',
            style: 'dark',
            header: {
                name: 'header1',
                data: {
                    img: 'tryme/federico.jpg',
                    title: labels.header.title,
                    name: 'Federico Ghedina'
                },
                blocks: [{
                    left: {
                        name: 'headerInfo1',
                        data: {
                            content: 'contatto skype'
                        }
                    }
                }]
            },
            body: {
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
                blocks: null
            }
        }
    };
cver.setup(config);
cver.print();
