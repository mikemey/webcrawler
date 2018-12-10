const requests = require('./requests')

const createCrawler = site => {
  const getSiteMap = () => {
    return extractUrlsFrom(site)
  }

  const extractUrlsFrom = site => requests.getHtml(site)
    .then(page => {
      const images = extractImages(page)
      const links = extractLinks(page)
      return {
        images, links
      }
    })

  const extractImages = page => extractFrom(page, 'img', 'src')
  const extractLinks = page => extractFrom(page, 'a')

  const extractFrom = (page, tag, attrName) => {
    const result = []
    page(tag).each((_, el) => {
      const href = cleanHref(el, attrName)
      result.push(href)
    })
    return result
  }

  const cleanHref = (el, attributeName = 'href') => {
    const href = el.attribs[attributeName]
    return href.startsWith('/')
      ? site + href
      : href
  }

  return { getSiteMap }
}

module.exports = createCrawler
