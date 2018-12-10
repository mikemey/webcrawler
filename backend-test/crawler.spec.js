const mockServer = require('mockttp').getLocal()

const fs = require('fs')
const path = require('path')

const crawler = require('../backend/crawler')

const readTestFile = fileName => fs.readFileSync(path.join(__dirname, './data', fileName), 'utf8')

describe('Crawler full end', () => {
  const port = 7543
  const simpleTestHtml = readTestFile('msm.html')
  const crawlUrl = `http://localhost:${port}`

  beforeEach(() => mockServer.start(port))
  afterEach(() => mockServer.stop())

  it('should run test', () => {
    return mockServer.get('/')
      .thenReply(200, simpleTestHtml)
      .then(() => crawler.getSiteMap(crawlUrl))
      .then(siteMap => {
        console.log(siteMap)
        siteMap.images.should.deep.equal([`${crawlUrl}/assets/msm_logo.png`])
        siteMap.outlinks.should.deep.equal([
          'https://beta.companieshouse.gov.uk/company/09793365',
          'http://uk.linkedin.com/in/msmitc'
        ])
      })
  })
})
