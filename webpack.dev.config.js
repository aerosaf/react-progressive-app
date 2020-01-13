var HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');
const WebpackPwaManifest = require('webpack-manifest-plugin');

module.exports = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Welcome to GemSpot LITE',
      template: "./src/index.html",
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.config().parsed)
    }),
    new WebpackPwaManifest({
      name: 'GemSpot LITE Web App',
      short_name: 'GemSpot LITE',
      description: 'GemSpot LITE App for Merchant Login',
      background_color: '#ffffff',
      crossorigin: 'anonymous',
      icons: [
        {
          src: path.resolve('public/images/favicon/apple-icon-180x180.png'),
          sizes: [96, 128, 192, 256, 384, 512]
        }
      ]
    })
  ],
  devServer: {
    historyApiFallback: true
  },
  externals: {
    // global app config object
    config: JSON.stringify({
      apiUrl: 'https://apidev-gemx.gem.live'
    })
  },
  node: {
    fs: 'empty'
  }
}
