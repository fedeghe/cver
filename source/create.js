const path = require('path');
const Cver = require('./cver');
try {
    /**
     * do not require cver before removing the args cause they will be passed to Malta
     *
     * here istead the first thing is to remove them
     */
    const args = process.argv;
    if (args.length !== 3) {
        console.log('[ERROR] `node create.js` expects exactly one parameter as the path for the config json file.');
        process.exit(1);
    }
    const configPath = path.resolve(args[2]),
        config = require(configPath),
        cver = new Cver(config);

    cver.print();
} catch (e) {
    /* eslint-disable no-console */
    console.log(e);
    /* eslint-enable no-console */
}
