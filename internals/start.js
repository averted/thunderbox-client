const fs = require('fs')
const chalk = require('chalk')
const isProduction = process.env.NODE_ENV === 'production'

const start = (server) => {
  console.log(chalk.yellow('Starting server...'))
  server().start()
}

try {
  const server = require('./server')

  if (isProduction && fs.existsSync('.build')) {
    start(server)
  } else {
    require('./build').then(() => start(server))
  }
} catch (err) {
  console.log(chalk.red(err.stack))
  console.log(chalk.redBright('\nCould not start server.'))
  process.exit(1)
}
