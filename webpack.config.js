var path = require('path');
var webpack = require('webpack');
var PorgressBarPlugin = require('progress-bar-webpack-plugin');
// const WebpackMonitor = require('webpack-monitor');

module.exports = {
    entry: ['./src/index'],
    devtool: 'source-map',
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
        new PorgressBarPlugin(),
        // new WebpackMonitor({
        //     capture: true, // -> default 'true'
        //     target: '../monitor/myStatsStore.json', // default -> '../monitor/stats.json'
        //     launch: true, // -> default 'false'
        //     port: 3030, // default -> 8081
        // }),
    ]
};
