const typescript = require('rollup-plugin-typescript');
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');



module.exports = {
  input: 'src/main.ts',
  output: {
    file: 'dist/diff.js',
    format: 'umd'
  },
  plugins: [

    json(),
    resolve({ jsnext: true }),

    typescript(),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: ['node_modules/**', '../../node_modules/**'],  // Default: undefined
      // these values can also be regular expressions
      // include: /node_modules/

      // search for files other than .js files (must already
      // be transpiled by a previous plugin!)
      extensions: ['.js'],  // Default: [ '.js' ]
    })
  ]
};