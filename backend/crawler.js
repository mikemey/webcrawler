const requests = require('./requests')

const getSiteMap = site => {
  return requests.getHtml(site)
    .then(result => {
      return result.toString()
    })
}

module.exports = { getSiteMap }
