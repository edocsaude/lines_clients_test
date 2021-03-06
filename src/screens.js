const R = require('ramda')

const lineService = require('./line_service')

let screenConfig = {}

function formatLogo() {
  if (!screenConfig || !screenConfig.logo) return screenConfig

  const imgBase64 = R.test(/^data:image\/png;base64,/, screenConfig.logo) ?
    screenConfig.logo : `data:image/png;base64, ${screenConfig.logo}`

  screenConfig.logo = imgBase64
  return screenConfig
}

function populateScreen() {
  return lineService.getScreenConfig()
    .tap(newScreen => { screenConfig = newScreen })
    .catch(e => { 
      if (R.path(['error', 'code'], e) === 'ENOENT'){
        screenConfig = {}
      } else {
        screenConfig = null
      }
    })
    .then(formatLogo)

}

module.exports = {
  start() { return populateScreen() },
  text() { return screenConfig.text },
  logo() { return screenConfig.logo },
}
