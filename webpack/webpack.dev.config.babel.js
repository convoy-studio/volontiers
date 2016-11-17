import path from 'path'
const autoprefixer = require('autoprefixer')
const rucksack = require('rucksack-css')
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

export default {
  context: path.resolve(__dirname, '..'),
  devtool: 'inline-source-map',
  entry: [
    'gsap',
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
    './client/index.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  resolve: {
    root: path.resolve( __dirname, '..', 'client' ),
    extensions: [
      '',
      '.js',
      '.jsx',
      '.json'
    ],
    alias: {
      'staticFolder': path.resolve(__dirname, '..', 'static')
    }
  },
  module: {
    preLoaders: [
      {
        test: /\.js?$/,
        exclude: [/node_modules/, /client\/vendor/, /static\/lib/],
        loader: 'eslint'
      }
    ],
    loaders: [
      {
        test: /\.html?$/,
        exclude: /node_modules/,
        loader: 'html'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /node_modules/,
        loader: 'ify'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: ['style', 'css', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: ['style', 'css', 'postcss-loader', 'sass']
      },
      {
        test: /\.(txt|htaccess|xml)$/,
        loader: 'static'
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file?name=assets/fonts/[name].[ext]'
      }
    ]
  },
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] }),
    rucksack()
  ],
  plugins: [
    new HtmlWebpackPlugin({
      template: 'client/templates/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      '__DEV__': JSON.stringify(true),
      '__PROD__': JSON.stringify(false)
    }),
    new webpack.ProvidePlugin({
      'React': 'react',
      'ReactDOM': 'react-dom'
    }),
    new CopyWebpackPlugin([
      { from: 'static' }
    ],
    { ignore: ['.DS_Store', '.keep'] })
  ]
}
