# Indonesian News Scraper

Scrape Indonesian news portal search results. Returns `{title, url, img, date}` per keyword query.

[![npm](https://img.shields.io/npm/v/indo-news-scraper?style=flat-square)](https://www.npmjs.com/package/indo-news-scraper)
[![GitHub last commit](https://img.shields.io/github/last-commit/theyudhiztira/indonesia-news-scraper?style=flat-square)](https://github.com/theyudhiztira/indonesia-news-scraper)

## Installation

```bash
npm install indo-news-scraper
# or
bun add indo-news-scraper
```

## Available News Portals

| Portal   | Status |
| -------- | ------ |
| Detik    | ✅     |
| Kompas   | ✅     |
| Liputan6 | ✅     |
| Antara   | ✅     |
| Suara    | ✅     |
| Viva     | ✅     |

## Usage

```typescript
import { detik, kompas, liputan6 } from 'indo-news-scraper';

// Basic usage — each scraper has a `scrap(keyword)` method
const results = await detik.scrap('jakarta');
console.log(results);
// [
//   { title: '...', url: 'https://...', img: 'https://...', date: '2026-08-10T...' },
//   ...
// ]

// Use multiple scrapers
const [detikNews, kompasNews] = await Promise.all([
  detik.scrap('ekonomi'),
  kompas.scrap('ekonomi'),
]);
```

```javascript
// CommonJS
const { detik } = require('indonesian-news-scraper');
detik.scrap('jakarta').then(console.log);
```

### Result shape

```typescript
interface SearchResult {
  title: string;  // Article headline
  url: string;    // Full article URL
  img: string;    // Thumbnail image URL
  date: string;   // ISO 8601 date string
}
```

## API

Every scraper exports both a class and a singleton instance:

```typescript
import { Detik, detik } from 'indonesian-news-scraper';

// Singleton (recommended)
await detik.scrap('jakarta');

// Fresh instance
const myDetik = new Detik();
await myDetik.scrap('jakarta');
```

Available exports: `detik`, `kompas`, `liputan6`, `antara`, `suara`, `viva` (singletons) and `Detik`, `Kompas`, `Liputan6`, `Antara`, `Suara`, `Viva` (classes).

## Development

```bash
bun install           # install dependencies
bun run typecheck     # check types
bun run build         # compile to dist/
bun test              # run integration tests (~35s)
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
