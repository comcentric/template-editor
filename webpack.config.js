var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './src/index.js',

  output: {
    path: 'public',
    filename: 'app.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel']
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
            "style",
            "css!sass")
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?|$)/,
        loaders: ["url-loader"]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("app.css")
  ]
}
