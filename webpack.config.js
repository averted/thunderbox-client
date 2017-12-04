const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { APP_PATH, BUILD_PATH, PUBLIC_PATH } = require('./internals/constants')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: (function() {
    const entry = {
      app: [
        './src/index.js',
      ],
      vendor: [
        'react',
        'react-dom',
        'react-router',
        'react-redux',
        'redux',
        'redux-thunk',
        'classnames',
        'moment'
      ]
    }

    if (!isProduction) {
      entry.app.unshift('webpack-hot-middleware/client?reload=true')
    }

    return entry
  })(),
  output: {
    path: path.join(APP_PATH, BUILD_PATH),
    publicPath: PUBLIC_PATH,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css?$/,
        loader: isProduction ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          publicPath: PUBLIC_PATH,
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        }) : [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[local]__[hash:base64:5]'
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'url-loader?limit=10000'
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)$/,
        loader: 'url-loader?limit=10000'
      }
    ]
  },
  resolve: {
    modules: ['src', 'config', 'node_modules'],
    extensions: ['.js', '.jsx', '.css', '.styl', '.json']
  },
  plugins: isProduction ? [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin({
      filename: 'app.css',
      disable: false,
      allChunks: true
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ] : [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new ExtractTextPlugin({
      filename: 'app.css',
      disable: false,
      allChunks: true
    })
  ]
}
