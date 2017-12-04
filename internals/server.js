const path = require('path')
const chalk = require('chalk')
const express = require('express')
const compression = require('compression')
const { PORT, APP_PATH, BUILD_PATH, PUBLIC_PATH } = require('./constants')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = () => {
  const server = express()

  return {
    start: function() {
      // gzip
      if (isProduction) {
        server.use(compression())
      }

      server.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET')
        next()
      })

      // dev middleware
      if (!isProduction) {
        addMiddleware(server)
      }

      // serve build
      server.use(PUBLIC_PATH, express.static(path.join(APP_PATH, BUILD_PATH)))

      server.get('*', (req, res) => {
        res.send(getDocument())
      })

      // start
      server.listen(PORT, () => {
        console.log(chalk.blue(`Server started at localhost:${PORT}`))
      })
    }
  }
}

const addMiddleware = (server) => {
  const webpack = require('webpack')
  const webpackConfig = require('../webpack.config.js')
  const compiler = webpack(webpackConfig)
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')

  const middleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true,
    stats: {
      colors: true
    }
  })

  server.use(middleware)
  server.use(webpackHotMiddleware(compiler))
}

const getDocument = (content) => {
  const packageJSON = require(path.join(APP_PATH, 'package.json'))
  return require('./document')(packageJSON.version)(content)
}
