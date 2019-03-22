
const Cver = require('./cver'),

    cver = new Cver(),

    labels = {
        title: 'i18n[Presentazione]'
    },

    config = {
        outFolder: 'out',
        translate: {
            from: 'it',
            to: 'zh-TW'
        },
        tpl: {
            file: 'one',
            style: 'dark',
            header: {
                component: 'header1',
                data: {
                    img: 'tryme/federico.jpg',
                    title: labels.title,
                    name: 'Federico Ghedina',
                    left: {
                        component: 'headerInfo1',
                        data: {
                            content: 'contatto skype'
                        }
                    }
                }
            },
            body: {
                blocks: [{
                    name: 'component2',
                    data: {
                        content: 'il mio contenuto'
                    }
                }]
            },
            foooter: {
                blocks: null
            }
        }
    };
cver.setup(config);
cver.print();
