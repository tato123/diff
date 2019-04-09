const merge = require('webpack-merge');
const defaultConfig = require('./webpack.config');
const path = require('path')


module.exports = merge(defaultConfig, {
    devServer: {
        contentBase: path.join(__dirname, "example"),
        compress: true,
        port: 9000,
        disableHostCheck: true,
        publicPath: '/assets/'
    }
})