const mockServer = require('mockttp').getLocal()

const fs = require('fs')
const path = require('path')

const createCrawler = require('../backend/crawler')

const readTestFile = fileName => fs.readFileSync(path.join(__dirname, './data', fileName), 'utf8')

describe('Crawler full end', () => {
  const port = 7543
  const crawlUrl = `http://localhost:${port}`
  const crawler = createCrawler(crawlUrl)

  beforeEach(() => mockServer.start(port))
  afterEach(() => mockServer.stop())

  it('return simple result', () => {
    const simpleTestHtml = readTestFile('msm.html')
    return mockServer.get('/')
      .thenReply(200, simpleTestHtml)
      .then(() => crawler.getSiteMap())
      .then(siteMap => {
        siteMap.images.should.deep.equal([`${crawlUrl}/assets/msm_logo.png`])
        siteMap.links.should.deep.equal([
          'http://localhost:7543',
          'https://beta.companieshouse.gov.uk/company/09793365',
          'http://uk.linkedin.com/in/msmitc'
        ])
      })
  })

  it('follow local links', () => {
    const mockedUrls = [
      { path: '/', response: readTestFile('linked.first.html') },
      { path: '/second', response: readTestFile('linked.second.html') }
    ]
    return Promise
      .all(mockedUrls.map(murl => mockServer.get(murl.path).thenReply(200, murl.response)))
      .then(() => crawler.getSiteMap())
      .then(siteMap => {
        siteMap.images.should.deep.equal([
          `${crawlUrl}/assets/msm_logo.png`,
          `${crawlUrl}/assets/msm_logo_second.png`
        ])
        siteMap.links.should.deep.equal([
          'http://localhost:7543',
          'https://beta.companieshouse.gov.uk/company/09793365',
          'http://uk.linkedin.com/in/msmitc',
          'http://localhost:7543/second',
          'https://beta.companieshouse.gov.uk/company/09793365_second'
        ])
      })
  })

  xit('should not crawl indefinitely', () => {
    const mockedUrls = [
      { path: '/', response: readTestFile('loop.first.html') },
      { path: '/second', response: readTestFile('loop.second.html') },
      { path: '/third', response: readTestFile('loop.second.html') }
    ]

    return Promise
      .all(mockedUrls.map(murl => mockServer.get(murl.path).thenReply(200, murl.response)))
      .then(() => crawler.getSiteMap())
      .then(siteMap => {
        siteMap.images.should.deep.equal([])
        siteMap.links.should.deep.equal([
          'http://localhost:7543',
          'http://localhost:7543/second',
          'http://localhost:7543/third'
        ])
      })
  })
})
