module.exports = (target, script) => {
    const bs = require("browser-sync").create();
    console.log('------------------------------')
    console.log('[proxy-target]: ' + target);
    console.log('[inject script target]: '+ script);
    console.log(`<script async src="${script}"></script>`);


    

    return new Promise((resolve, reject) => {
        // Start a Browsersync proxy
        bs.init({
            proxy: {
                target: target
            },
            notify: false,
            open: false,
            ghostMode: false,
            logLevel: 'debug',
            ui: false,
            https: false,
            host: '0.0.0.0',
            snippetOptions: {
                rule: {
                    match: /<\/head>/i,
                    fn: function (snippet, match) {
                        return `<script src="${script}"></script>` + snippet + match;
                    }
                }
            },
            callbacks: {
                ready(err, bs) {
                    if (err) {
                       return reject(err);
                    }

                    return resolve(bs)
                }
            }
        });
    })
}
