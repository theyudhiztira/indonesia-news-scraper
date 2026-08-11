import * as cheerio from 'cheerio';
import { fetchContent } from '../browser/index.js';
import { convertDate } from '../utils/dateConverter.js';
import type { Scraper, SearchResult } from '../types.js';

export class Viva implements Scraper {
  readonly source = 'Viva';
  private readonly baseUrl = 'https://www.viva.co.id/search?q=';

  async scrap(query: string): Promise<SearchResult[]> {
    if (!query) {
      throw new Error('Please provide a keyword!');
    }

    const url = `${this.baseUrl}${encodeURIComponent(query)}&type=all`;
    const html = await fetchContent(url);
    const $ = cheerio.load(html);
    const results: SearchResult[] = [];

    $('div.article-list-row').each((_i, el) => {
      const title = $(el).find('.article-list-title').text().trim();
      const articleUrl = $(el).find('.article-list-title').attr('href') || '';
      const img =
        $(el).find('.article-list-thumb img').attr('src') ||
        $(el).find('.article-list-thumb img').attr('data-original') ||
        '';
      const date = convertDate($(el).find('.article-list-date').text().trim());

      if (title && articleUrl) {
        results.push({ title, url: articleUrl, img, date });
      }
    });

    return results;
  }
}

/** Default singleton instance for convenience: `import { viva } from 'indonesian-news-scraper'` */
export const viva = new Viva();
