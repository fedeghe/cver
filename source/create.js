const path = require('path');
const Cver = require('./cver');
try {
    /**
     * do not require cver before removing the args cause they will be passed to Malta
     *
     * here istead the first thing is to remove them
     */
    const args = process.argv;
    if (args.length < 3) {
        console.log('[ERROR] `node create.js` expects at least one parameter as the path for the config json file.');
        process.exit(1);
    }
    const configPath = path.resolve(args[2]),
        config = require(configPath),
        params = args.slice(3).reduce((acc, el) => {
            const p = el.match(/^-(.*)=(.*)$/);
            p && acc.push({
                path: p[1],
                value: p[2]
            });
            return acc;
        }, []);
    params.length && params.forEach(({ path, value }) => {
        const els = path.split('.');
        els.reduce((acc, el, i) => {
            if (i === els.length - 1) {
                acc[el] = value;
            }
            return acc[el];
        }, config);
    });
    new Cver(config).print();
} catch (e) {
    /* eslint-disable no-console */
    console.log(e);
    /* eslint-enable no-console */
}
