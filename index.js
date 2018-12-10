const url = process.argv.slice(2, 3)[0]
const Crawler = require('./backend/crawler')

if (url) {
  console.log(`Crawling ${url}...`)
  const crawler = Crawler(url)
  crawler.getSiteMap()
    .then(result => {
      console.log(result)
    })
} else {
  console.log('expected one URL argument.')
}
