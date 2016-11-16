const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    'bootstrap-loader',
    './src/app'
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devtool: 'source-map',

  plugins: [
    new ExtractTextPlugin('app.css', { 
      allChunks: true 
    }),
    new webpack.ProvidePlugin({
      "window.Tether": "tether"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve:{
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};
