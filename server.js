var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');

var server = new WebpackDevServer(webpack(config), {
  stats: config.devServer.stats,
  publicPath: config.output.publicPath,
});

const PORT = 3000;

server.listen(PORT, '0.0.0.0', function (err) {
  if (err) {
    return console.log(err);
  }
  return console.log(`listening at localhost:${PORT}`);
});
