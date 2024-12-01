const path = require('path')

const root_dir = path.normalize(path.join(__dirname, '..'))
const dist_dir = path.normalize(path.join(__dirname, '..', 'dist'))

const APP_NAME = 'developer-assistant'

module.exports = {
  APP_NAME,
  root_dir,
  dist_dir,
}
