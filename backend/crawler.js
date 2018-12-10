const requests = require('./requests')

const getSiteMap = site => {
  const extractImages = page => {
    const result = []
    page('img').each((_, imageEl) => {
      const imgSrc = cleanHref(imageEl, 'src')
      result.push(imgSrc)
    })
    return result
  }

  const extractLinks = page => {
    const result = []
    page('a').each((_, anchorEl) => {
      const anchorSrc = cleanHref(anchorEl)
      result.push(anchorSrc)
    })
    return result
  }

  const cleanHref = (el, attributeName = 'href') => {
    const href = el.attribs[attributeName]
    return href.startsWith('/')
      ? site + href
      : href
  }

  return requests.getHtml(site)
    .then(page => {
      const images = extractImages(page)
      const outlinks = extractLinks(page)
      return {
        images, outlinks
      }
    })
}

module.exports = { getSiteMap }
