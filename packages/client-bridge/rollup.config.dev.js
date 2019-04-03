const config = require('./rollup.config');
const serve = require('rollup-plugin-serve');


module.exports = {
    ...config,
    plugins: [
        ...config.plugins,
        serve({
            // Launch in browser (default: false)
            open: false,
            // Show server address in console (default: true)
            verbose: true,

            // Multiple folders to serve from
            contentBase: ['dist'],

        })
    ]
}