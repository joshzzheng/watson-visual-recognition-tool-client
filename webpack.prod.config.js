const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: [
    //'tether',
    //'font-awesome-loader',
    'bootstrap-loader',
    './watson_visual_recognition_tool/static/js/app.jsx'
  ],
  output: {
    path: './watson_visual_recognition_tool/static/lib',
    filename: 'browser-bundle.js'
  },
  devtool: 'source-map',

  plugins: [
    new ExtractTextPlugin('app.css', { allChunks: true }),
    new webpack.ProvidePlugin({
      "window.Tether": "tether"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),  
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    })
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
        //include: ['./watson_visual_recognition_tool/static/js'],
        query: {
          presets: ['es2015', 'react']
        }
      },
      //{ test: /\.css$/, loaders: [ 'style', 'css', 'postcss' ] },
      //{ test: /\.scss$/, loaders: [ 'style', 'css', 'postcss', 'sass' ] },

      // Bootstrap 4
      //{ test: /bootstrap[\/\\]dist[\/\\]js[\/\\]umd[\/\\]/, loader: 'imports?jQuery=jquery' },
    ]
  }
};
