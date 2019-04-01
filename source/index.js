try {
    const Cver = require('./cver'),

        cver = new Cver(),

        config = {
            format: 'A4',
            outFolder: 'out',
            border: '0.2in',
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
                    title: 'i18n[Presentazione]',
                    name: 'Federico Ghedina'
                },
                blocks: [{
                    name: 'core/header',
                    blocks: [{
                        name: 'header1',
                        data: {
                            name: 'Federico Ghedina',
                            title: 'Curriculum vitae',
                            content: 'contatto skype',
                            img: 'http://www.jmvc.org/fedeghe.jpeg',
                            email: 'federico.ghedina@gmail.com',
                            mobile: '+49 162 7305989',
                            skype: 'federico.ghedina',
                            linkedin: 'http://www.linkedin.com/in/federicoghedina',
                            github: 'https://github.com/fedeghe',
                            npm: 'https://www.npmjs.com/~fedeghe'
                        }
                    }]
                }, {
                    name: 'core/body',
                    data: {
                        title: 'body title'
                    },
                    blocks: [{
                        name: 'TitledSection',
                        data: {
                            title: 'i18n[Informazioni personali]'
                        },
                        blocks: [{
                            name: 'itemKeyValue',
                            data: { key: 'i18n[Luogo di nascita]', value: 'i18n[Padova]' }
                        }, {
                            name: 'itemKeyValue',
                            data: { key: 'i18n[Data di nascita]', value: '20 / 9 / 1976' }
                        }, {
                            name: 'itemKeyValue',
                            data: { key: 'i18n[Residenza]', value: 'Kurfürstendamm 74, 10709, Berlin, Germany' }
                        }, {
                            name: 'itemKeyValue',
                            data: { key: 'i18n[Stato civile]', value: 'i18n[Sposato]' }
                        }, {
                            name: 'itemKeyValue',
                            data: { key: 'i18n[Nazionalitá]', value: 'i18n[Italiana]' }
                        }]
                    }, {
                        name: 'TitledSection',
                        data: { title: 'i18n[Esperienze lavorative]' },
                        blocks: [{
                            name: 'itemPeriodDescription',
                            data: {
                                start: 'i18n[Ottobre 2018]',
                                end: 'i18n[ora]',
                                company: 'Verkstedt',
                                city: 'Berlin',
                                role: 'Front-end Senior Developer',
                                description: 'i18n[tecnologie utilizzate]: React, Redux, StoryBook, pure javascript, ES6, Jest, NodeJs, Sass, Docker, MAC OS'
                            }
                        }, {
                            name: 'itemPeriodDescription',
                            data: {
                                start: 'i18n[Ottobre 2017]',
                                end: 'i18n[Ottobre 2018]',
                                company: 'Relayr.io',
                                city: 'Berlin',
                                role: 'Front-end Senior Developer',
                                description: 'i18n[tecnologie utilizzate]: React, Redux, pure javascript, ES6, Jest, Bootstrap, NodeJs, Sass, Microservices based backend, Swagger, Docker, MAC OS'
                            }
                        }, {
                            name: 'itemPeriodDescription',
                            data: {
                                start: 'i18n[Gennaio 2015]',
                                end: 'i18n[Settembre 2017]',
                                company: 'Stailamedia AG',
                                city: 'Zürich',
                                role: 'Front-end Senior Developer',
                                description: 'i18n[tecnologie utilizzate]: MAC OS, AWS, NodeJS, Mocha, Express, nginx, fast pure javascript, less, HTML5, Phantomjs, Selenium, MEAN stack (sails), Symfony'
                            }
                        }, {
                            name: 'itemPeriodDescription',
                            data: {
                                start: 'i18n[Gennaio 2015]',
                                end: 'i18n[Settembre 2017]',
                                company: 'ExMachina S.a.g.l.',
                                city: 'Lugano',
                                role: 'Front-end Senior Developer',
                                description: 'i18n[tecnologie utilizzate]: linux Ubuntu, MAC OS, LAMP stack, XEAN stack (sails.js), pure javascript, HTM5, CSS3, jQuery, Angular.js, Bootstrap, Selenium, Modx, E4x, Rhinojs, NodeJS, Jasmine, Phantomjs, Karma'
                            }
                        }, {
                            name: 'itemPeriodDescription',
                            data: {
                                start: 'i18n[Ottobre 2008]',
                                end: 'i18n[Febbraio 2012]',
                                company: 'Site By Site AG',
                                city: 'Padova',
                                role: 'Front-end Senior Developer',
                                description: 'i18n[tecnologie utilizzate]: linux Ubuntu, LAMP stack, jQuery, Backbone, Bootstrap, Selenium, Modx, pure javascript, HTML5, CSS3'
                            }
                        }, {
                            name: 'itemPeriodDescription',
                            data: {
                                start: 'i18n[Giugno 2007]',
                                end: 'i18n[Ottobre 2008]',
                                company: 'Dodotour s.r.l.',
                                city: 'Montegrotto terme',
                                role: 'Front-end Senior Developer',
                                description: 'i18n[tecnologie utilizzate]: linux Ubuntu, LAMP stack, jQuery, Selenium, CodeIgniter, pure javascript, HTML, CSS'
                            }
                        }, {
                            name: 'itemPeriodDescription',
                            data: {
                                start: 'i18n[Giugno 2006]',
                                end: 'i18n[Gennaio 2008]',
                                company: 'i18n[Universitá di Padova, dipartimento di Sociologia]',
                                city: 'Padova',
                                role: 'i18n[Responsabile del laboratorio multimediale]',
                                description: 'i18n[tecnologie utilizzate]: linux Ubuntu, LAMP stack, jQuery, Prototype, pure javascript, HTML, CSS'
                            }
                        }]
                    }, {
                        name: 'TitledSection',
                        data: {
                            title: 'i18n[Istruzione]'
                        },
                        blocks: [{
                            name: 'itemInstruction',
                            data: {
                                year: 2006,
                                what: 'i18n[Laurea in ingegneria informatica - Universitá di Padova]',
                                label1: 'i18n[Titolo tesi]',
                                value1: 'i18n[Creazione di una collezione sperimentale con texture]',
                                label2: 'i18n[Relatore]',
                                value2: 'Prof. Guido Maria Cortellazzo'
                            }
                        }]
                    }, {
                        name: 'TitledSection',
                        data: {
                            title: 'i18n[Conoscenza lingue]'
                        },
                        blocks: [{
                            name: 'itemKeyValue',
                            data: { key: 'i18n[Italiano]', value: 'i18n[lingua nativa]' }
                        }, {
                            name: 'itemKeyValue',
                            data: { key: 'i18n[Inglese]', value: 'i18n[ottimo, scritto e parlato]' }
                        }, {
                            name: 'itemKeyValue',
                            data: { key: 'i18n[Francese]', value: 'i18n[discreto]' }
                        }, {
                            name: 'itemKeyValue',
                            data: { key: 'i18n[Spagnolo]', value: 'i18n[elementare]' }
                        }, {
                            name: 'itemKeyValue',
                            data: { key: 'i18n[Tedesco]', value: 'i18n[elementare]' }
                        }]
                    }]
                }, {
                    name: 'core/footer',
                    data: {
                        name: 'i18n[Questa é la fine]',
                        made: 'Built on __DATE__ using <a href="$cverGithub$">cver</a>'
                    }
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
