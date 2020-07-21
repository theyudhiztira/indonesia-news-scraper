# Indo News Scraper [Beta]

This package is a package to help you fetch single page news from Indonesian news websites.

## Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) to install indo-news-scraper.

```bash
pip install foobar
```

## Available News Portal
- Detik
- Antara
- Kompas
- Republika

## Usage
You can simply use the scrap function and pass the `KEYWORDS` as the parameter.

```javascript
import { Detik } from 'indo-news-scraper';

Detik.scrap('put your keywords here').then(res => {
 console.log(res);
});
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)