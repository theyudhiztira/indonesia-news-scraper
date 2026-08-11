import * as cheerio from 'cheerio';
import { fetchContent } from '../browser/index.js';
import { convertDate } from '../utils/dateConverter.js';
import type { Scraper, SearchResult } from '../types.js';

export class Liputan6 implements Scraper {
  readonly source = 'Liputan6';
  private readonly baseUrl = 'https://www.liputan6.com/search?q=';

  async scrap(query: string): Promise<SearchResult[]> {
    if (!query) {
      throw new Error('Please provide a keyword!');
    }

    const url = `${this.baseUrl}${encodeURIComponent(query)}`;
    const html = await fetchContent(url);
    const $ = cheerio.load(html);
    const results: SearchResult[] = [];

    $('li.promotion-article--list__item').each((_i, el) => {
      const title = $(el).find('.promotion-article--list__title').text().trim();
      const articleUrl = $(el).find('.promotion-article--list__title').attr('href') || '';
      const img = $(el).find('.promotion-article--list__image img').attr('src') || '';
      const dateRaw = $(el).find('time.promotion-article--list__published.timeago').attr('datetime') || '';

      const date = convertDate(dateRaw);

      if (title && articleUrl) {
        results.push({ title, url: articleUrl, img, date });
      }
    });

    return results;
  }
}

/** Default singleton instance for convenience: `import { liputan6 } from 'indonesian-news-scraper'` */
export const liputan6 = new Liputan6();
