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
          'https://beta.companieshouse.gov.uk/company/09793365',
          'http://uk.linkedin.com/in/msmitc'
        ])
      })
  })

  it('follow local links', () => {
    const firstHtml = readTestFile('linked.first.html')
    const secondHtml = readTestFile('linked.second.html')
    const firstMock = mockServer.get('/').thenReply(200, firstHtml)
    const secondMock = mockServer.get('/second').thenReply(200, secondHtml)

    return Promise.all([firstMock, secondMock])
      .then(() => crawler.getSiteMap())
      .then(siteMap => {
        console.log(siteMap)
        siteMap.images.should.deep.equal([
          `${crawlUrl}/assets/msm_logo.png`,
          `${crawlUrl}/assets/msm_logo_second.png`
        ])
        siteMap.links.should.deep.equal([
          'https://beta.companieshouse.gov.uk/company/09793365',
          'http://uk.linkedin.com/in/msmitc',
          'https://beta.companieshouse.gov.uk/company/09793365_second'
        ])
      })
  })
})
