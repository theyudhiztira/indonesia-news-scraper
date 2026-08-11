import * as cheerio from 'cheerio';
import { fetchContent } from '../browser/index.js';
import { convertDate } from '../utils/dateConverter.js';
import type { Scraper, SearchResult } from '../types.js';

export class Antara implements Scraper {
  readonly source = 'Antara';
  private readonly baseUrl = 'https://www.antaranews.com/search?q=';

  async scrap(query: string): Promise<SearchResult[]> {
    if (!query) {
      throw new Error('Please provide a keyword!');
    }

    const url = `${this.baseUrl}${encodeURIComponent(query)}`;
    const html = await fetchContent(url);
    const $ = cheerio.load(html);
    const results: SearchResult[] = [];

    $('.wrapper__list__article .card__post.card__post-list').each((_i, el) => {
      const title = $(el).find('.card__post__title h2 a').text().trim();
      const articleUrl = $(el).find('.card__post__title h2 a').attr('href') || '';
      const img =
        $(el).find('picture img').attr('data-src') ||
        $(el).find('picture img').attr('src') ||
        '';
      const date = convertDate(
        $(el).find('.card__post__author-info span.text-dark').text().trim()
      );

      if (title && articleUrl) {
        results.push({ title, url: articleUrl, img, date });
      }
    });

    return results;
  }
}

/** Default singleton instance for convenience: `import { antara } from 'indonesian-news-scraper'` */
export const antara = new Antara();
