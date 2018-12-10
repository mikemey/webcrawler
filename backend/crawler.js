const requests = require('./requests')

const createCrawler = site => {
  const getSiteMap = () => {
    const visitedUrls = new Set()
    const sitemap = { images: new Set(), links: new Set() }

    const crawlThrough = pageUrl => {
      console.log('extracting: ' + pageUrl)
      return extractUrlsFrom(pageUrl)
        .then(result => {
          visitedUrls.add(pageUrl)
          const pagesToVisit = findPagesToVisit(result)
          result.images.forEach(image => { sitemap.images.add(image) })
          result.links.forEach(link => { sitemap.links.add(link) })
          return Promise.all(pagesToVisit.map(crawlThrough))
        })
    }

    const findPagesToVisit = result => result.links.filter(link => link.startsWith(site))

    return crawlThrough(site).then(() => {
      return {
        images: Array.from(sitemap.images),
        links: Array.from(sitemap.links)
      }
    })
  }

  const extractUrlsFrom = site => requests.getHtml(site)
    .then(page => {
      const images = extractImages(page)
      const links = extractLinks(page)
      return { images, links }
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
