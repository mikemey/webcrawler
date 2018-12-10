# Web crawler

### Requirements:
- Node v10

#### Assumptions:

-  As requirement says "links to static content such as images and to external URLs.":
   Assuming all urls in `<a href="...">` and `<img src="...">` attributes (no included are
   `<link href="...">`, could be added simply in `backend/crawler.js`) 
- Lenient URL parsing (ie: `http://blabla.com` treated as `http://blabla.com/`)