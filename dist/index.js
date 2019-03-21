
const Cver = require('./cver'),

    cver = new Cver(),

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
                component: 'header1',
                data: {
                    img: 'tryme/federico.jpg',
                    cvLabel: 'Curriculum vitae',
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
