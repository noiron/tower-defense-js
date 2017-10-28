var path = require('path');
var webpack = require('webpack');
var PorgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    entry: ['./src/index'],
    devtool: 'cheap-source-map',
    output: {
        path: path.join(__dirname, 'static'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                include: path.join(__dirname, 'src')
            }
        ]
    },
    devServer: {
        stats: 'errors-only'
    },
    plugins: [
        new PorgressBarPlugin()
    ]
};
