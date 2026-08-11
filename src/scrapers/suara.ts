import * as cheerio from 'cheerio';
import { fetchContent } from '../browser/index.js';
import { convertDate } from '../utils/dateConverter.js';
import type { Scraper, SearchResult } from '../types.js';

export class Suara implements Scraper {
  readonly source = 'Suara';
  private readonly baseUrl = 'https://www.suara.com/search';

  async scrap(query: string): Promise<SearchResult[]> {
    if (!query) {
      throw new Error('Please provide a keyword!');
    }

    const url = `${this.baseUrl}?q=${encodeURIComponent(query)}`;
    const html = await fetchContent(url);
    const $ = cheerio.load(html);
    const results: SearchResult[] = [];

    $('.gsc-result').each((_i, el) => {
      const title = ($(el).find('a.gs-title').html() || '')
        .replace(/(<([^>]+)>)/gi, '')
        .trim();

      const articleUrl = $(el).find('a').attr('href') || '';
      const img = $(el).find('img.gs-image').attr('src') || '';

      // Date text lives in .gs-bidi-start-align, may contain "..."
      const dateRaw = ($(el).find('.gsc-table-result .gs-bidi-start-align').html() || '')
        .replace(/(<([^>]+)>)/gi, '')
        .trim();

      // Split on " ... " or "..." to get just the date portion
      const datePart = dateRaw.includes(' ... ')
        ? dateRaw.split(' ... ')[0]
        : dateRaw.split('...')[0];

      const date = convertDate(datePart);

      if (title && articleUrl) {
        results.push({ title, url: articleUrl, img, date });
      }
    });

    return results;
  }
}

/** Default singleton instance for convenience: `import { suara } from 'indonesian-news-scraper'` */
export const suara = new Suara();
