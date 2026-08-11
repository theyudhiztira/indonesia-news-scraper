import { describe, expect, test } from 'bun:test';
import { Suara, suara } from '../src/index.js';

describe('Suara scraper', () => {
  test('singleton instance is pre-exported', () => {
    expect(suara).toBeInstanceOf(Suara);
    expect(suara.source).toBe('Suara');
  });

  test('scrap() throws on empty query', async () => {
    const scraper = new Suara();
    await expect(scraper.scrap('')).rejects.toThrow('keyword');
  });

  test(
    'scrap("phk") returns results with correct shape',
    async () => {
      const results = await new Suara().scrap('jakarta');

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);

      for (const r of results.slice(0, 3)) {
        expect(typeof r.title).toBe('string');
        expect(r.title.length).toBeGreaterThan(0);
        expect(r.url).toMatch(/^https?:\/\//);
        expect(typeof r.img).toBe('string');
        // Should be ISO 8601
        expect(r.date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      }
    },
    { timeout: 30000 },
  );
});
