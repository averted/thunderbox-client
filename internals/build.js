const webpack = require('webpack')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const readline = require('readline')
const chalk = require('chalk')
const cp = require('child_process')
const fs = require('fs')
const path = require('path')

const faviconPath = path.join(process.cwd(), 'src', 'favicon.ico')
const webpackPath = path.join(process.cwd(), 'webpack.config.js')

const nextFrame = (() => {
  let i = 0
  const frames = [
    '.  ', ' . ', '  .', '.: ', ' .:',
    ': .', '. :', ':. ', ' :.', ': :',
    '...', '...', '..:', '.:.', '.: ',
    ':..', '.::', ':.:', '::.', ':::',
  ]
  return () => {
    const frame = frames[i]
    i = (i + 1) % frames.length
    return frame
  }
})()

const serveFavicon = (outputPath) => {
  console.log(chalk.blue('Serving favicon: favicon.ico\n'))
  cp.execSync(`cp ${faviconPath} ${outputPath}`)
}

const bundle = (resolve) => {
  const config = require(webpackPath)
  const compiler = webpack(config)
  let isBuildingModules = false

  console.time(chalk.green('Compile time'))
  console.log(chalk.blue('Building client...\n'))

  compiler.apply(
    new ProgressPlugin((percentage, msg) => {
      if (msg.match(/building modules/)) {
        if (!isBuildingModules) {
          isBuildingModules = true
          process.stdout.write(`[webpack] ${msg}`)
        }

        readline.cursorTo(process.stdout, 0)
        process.stdout.write(`[${Math.round(percentage * 1.4 * 100)}] Building webpack modules... ${nextFrame()}`)
      } else if (msg) {
        if (isBuildingModules) {
          process.stdout.write('\n')
          isBuildingModules = false
        }
        process.stdout.write(`[webpack] ${msg}\n`)
      }
    })
  )

  compiler.run((err, rawStats) => {
    if (err) {
      throw err
    } else {
      const stats = rawStats.toJson()
      if (stats.errors.length) {
        throw stats.errors[0]
      } else {
        //serveFavicon(config.output.path)
        console.timeEnd(chalk.green('Compile time'))
        resolve()
      }
    }
  })
}

module.exports = new Promise((res, rej) => {
  try {
    bundle(res)
  } catch (err) {
    console.log(chalk.redBright(err))
  }
})
