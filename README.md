# Web crawler

### Requirements:
- Node v10

#### Assumptions:

-  As requirement says "links to static content such as images and to external URLs.":
   Assuming all urls in `<a href="...">` and `<img src="...">` attributes (no included are
   `<link href="...">`, could be added simply in `backend/crawler.js`) 
- Strict URL parsing (ie: `http://localhost` is different from `http://localhost:7543/`)