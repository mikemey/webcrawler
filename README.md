# Web crawler

### Requirements:
- Node v10

#### Run:

- Download github repository
- run `npm install`
- run `node index.js https://msm-itc.com`

Results in a JSON object with images and links listed:
```json
{ 
  images: [ 'https://msm-itc.com/assets/msm_logo.png' ],
  links:
   [ 'https://msm-itc.com',
     'https://beta.companieshouse.gov.uk/company/09793365',
     'http://uk.linkedin.com/in/msmitc' 
   ],
}
```

#### Assumptions:

-  As requirement says "links to static content such as images and to external URLs.":
   Assuming all urls in `<a href="...">` and `<img src="...">` attributes (no included are
   `<link href="...">`, could be added simply in `backend/crawler.js`) 
- Lenient URL parsing (ie: `http://blabla.com` treated as `http://blabla.com/`)