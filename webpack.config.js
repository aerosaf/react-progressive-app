var HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');
const WebpackPwaManifest = require('webpack-manifest-plugin');
module.exports = {
  entry: ["./src/index.jsx"],
  output: {
    path: path.resolve('public'),
    publicPath: '/public',
    filename: '[hash].bundle.js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  mode: 'production',
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          },
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
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
      apiUrl: 'https://apixstage.gem.live'
    })
  },
  node: {
    fs: 'empty'
  }
};