// server.js
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');

var server = new WebpackDevServer(webpack(config), {
  stats: config.devServer.stats,
  publicPath: config.output.publicPath,
});

server.listen(3000, '0.0.0.0', function (err, result) {
  if (err) {
    return console.log(err);
  }
  return console.log('listening at locahost:3000...');
})
