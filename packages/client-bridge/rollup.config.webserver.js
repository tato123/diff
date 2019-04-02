const config = require('./rollup.config');
const serve = require('rollup-plugin-serve');


module.exports = {
    ...config,
    plugins: [
        ...config.plugins,
        serve({
            // Launch in browser (default: false)
            open: true,

            // Page to navigate to when opening the browser.
            // Will not do anything if open=false.
            // Remember to start with a slash.
            openPage: '/index.html',

            // Show server address in console (default: true)
            verbose: true,

            // Multiple folders to serve from
            contentBase: ['dist', 'example'],

        })
    ]
}