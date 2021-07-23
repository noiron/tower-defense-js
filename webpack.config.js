var path = require('path');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
  entry: ['./src/index'],
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  module: {
    rules: [
      {
        test: [/\.js$/, /\.ts$/],
        use: ['babel-loader'],
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  devServer: {
    stats: 'errors-only',
  },
  plugins: [new ProgressBarPlugin()],
};
