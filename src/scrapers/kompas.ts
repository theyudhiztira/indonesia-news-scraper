import * as cheerio from 'cheerio';
import { fetchContent } from '../browser/index.js';
import { convertDate } from '../utils/dateConverter.js';
import type { Scraper, SearchResult } from '../types.js';

export class Kompas implements Scraper {
  readonly source = 'Kompas';
  private readonly baseUrl = 'https://www.kompas.com/tag/';

  async scrap(query: string): Promise<SearchResult[]> {
    if (!query) {
      throw new Error('Please provide a keyword!');
    }

    const url = `${this.baseUrl}${encodeURIComponent(query)}?sort=desc`;
    const html = await fetchContent(url);
    const $ = cheerio.load(html);
    const results: SearchResult[] = [];

    $('.articleItem').each((_i, el) => {
      const title = $(el).find('.articleTitle').text().trim();
      const articleUrl = $(el).find('.article-link').attr('href') || '';
      const img = $(el).find('.articleItem-img img').attr('src') || '';
      const dateRaw = $(el).find('.articlePost-date').text().trim();
      const date = convertDate(dateRaw);

      if (title && articleUrl) {
        results.push({ title, url: articleUrl, img, date });
      }
    });

    return results;
  }
}

/** Default singleton instance for convenience: `import { kompas } from 'indonesian-news-scraper'` */
export const kompas = new Kompas();
