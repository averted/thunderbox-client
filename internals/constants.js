const path = require('path')

const PORT = process.env.PORT || 3010
const APP_PATH = process.cwd()
const BUILD_PATH = '.build'
const PUBLIC_PATH = '/public/'

module.exports.PORT = PORT
module.exports.APP_PATH = APP_PATH
module.exports.BUILD_PATH = BUILD_PATH
module.exports.PUBLIC_PATH = PUBLIC_PATH
