import path from 'path'
const autoprefixer = require('autoprefixer')
const rucksack = require('rucksack-css')
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'

export default {
  context: path.resolve(__dirname, '..'),
  entry: [
    'gsap',
    path.resolve(__dirname, '..', 'static/libs/CustomEase.js'),
    './client/index.js'
  ],
  externals: {
    'TweenLite': 'TweenLite'
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name]-[hash].min.js'
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
    loaders: [
      {
        test: /\.html?$/,
        exclude: /node_modules/,
        loader: 'html?minimize=false'
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
        loaders: [
          'style',
          ExtractTextPlugin.extract('style', 'css!postcss')
        ]
      },
      {
        test: /\.scss$/,
        loaders: [
          'style',
          ExtractTextPlugin.extract('style', 'css!postcss!sass')
        ]
      },
      {
        test: /\.(txt|htaccess|xml)$/,
        loader: 'static'
      },
      {
        test: /\.(gif|png|jpe?g|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=assets/images/[hash].[ext]',
          'image-webpack'
        ]
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
  imageWebpackLoader: {
    mozjpeg: {
      quality: 65
    },
    pngquant: {
      quality: '65-90',
      speed: 4
    },
    svgo: {
      plugins: [
        {
          removeViewBox: false
        },
        {
          removeEmptyAttrs: false
        }
      ]
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'client/templates/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      '__DEV__': JSON.stringify(false),
      '__PROD__': JSON.stringify(true)
    }),
    new webpack.ProvidePlugin({
      'React': 'react',
      'ReactDOM': 'react-dom'
    }),
    new CopyWebpackPlugin([
      { from: 'static' }
    ],
    { ignore: ['.DS_Store', '.keep'] }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        pure_funcs: ['console.log']
      }
    }),
    new ExtractTextPlugin('[name]-[hash].min.css', { allChunks: true }),
    new CleanWebpackPlugin(['dist'], { root: path.join(__dirname, '..') })
  ]
}
