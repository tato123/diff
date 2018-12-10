module.exports = () => {
    const bs = require("browser-sync").create();
    const target = process.env.TARGET || 'https://www.getdiff.app';
    const script = process.env.SCRIPT_URL || '';

    return new Promise((resolve, reject) => {
        // Start a Browsersync proxy
        bs.init({
            proxy: {
                target: target,
                middleware: [
                    {
                        route: "/_ah/health",
                        handle: function (req, res, next) {
                            res.end('ok');
                        }
                    },
                    {
                        route: "/_ah/start",
                        handle: function (req, res, next) {
                            res.end('ok');
                        }
                    },
                    {
                        route: "/_ah/stop",
                        handle: function (req, res, next) {
                            res.end('ok');
                        }
                    }
                ]
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
                        return `<script async src="${script}"></script>` + snippet + match;
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
