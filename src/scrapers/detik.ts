import * as cheerio from 'cheerio';
import { fetchContent } from '../browser/index.js';
import { convertDate } from '../utils/dateConverter.js';
import type { Scraper, SearchResult } from '../types.js';

export class Detik implements Scraper {
  readonly source = 'Detik';
  private readonly baseUrl = 'https://www.detik.com/search/searchnews?query=';

  async scrap(query: string): Promise<SearchResult[]> {
    if (!query) {
      throw new Error('Please provide a keyword!');
    }

    const url = `${this.baseUrl}${encodeURIComponent(query)}`;
    const html = await fetchContent(url);
    const $ = cheerio.load(html);
    const results: SearchResult[] = [];

    $('article.list-content__item').each((_i, el) => {
      const articleEl = $(el).find('.media__title a');
      const title = articleEl.text().trim();
      const articleUrl = articleEl.attr('href') || '';
      const img = $(el).find('.media__image img').attr('src') || '';

      // Full date lives in the title attribute, e.g. "Senin, 10 Agu 2026 10:28 WIB"
      const dateRaw = $(el).find('.media__date span').attr('title') || '';
      const date = convertDate(dateRaw);

      if (title && articleUrl) {
        results.push({ title, url: articleUrl, img, date });
      }
    });

    return results;
  }
}

/** Default singleton instance for convenience: `import { detik } from 'indonesian-news-scraper'` */
export const detik = new Detik();
