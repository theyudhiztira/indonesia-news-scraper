import { afterAll, describe, expect, test } from 'bun:test';
import { detik, Detik } from '../src/index.js';
import { antara, Antara } from '../src/index.js';
import { kompas, Kompas } from '../src/index.js';
import { liputan6, Liputan6 } from '../src/index.js';
import { viva, Viva } from '../src/index.js';
import { closeBrowser } from '../src/browser/index.js';

const KEYWORD = 'jakarta';

const scrapers = [
  { name: 'Detik', cls: Detik, inst: detik },
  { name: 'Antara', cls: Antara, inst: antara },
  { name: 'Kompas', cls: Kompas, inst: kompas },
  { name: 'Liputan6', cls: Liputan6, inst: liputan6 },
  // Tempo search redirects to homepage — search no longer functional on the site
  // { name: 'Tempo', cls: Tempo, inst: tempo },
  { name: 'Viva', cls: Viva, inst: viva },
];

afterAll(async () => {
  await closeBrowser();
});

for (const { name, cls, inst } of scrapers) {
  describe(`${name} scraper`, () => {
    test('singleton is pre-exported', () => {
      expect(inst).toBeInstanceOf(cls);
      expect(inst.source).toBe(name);
    });

    test('scrap() throws on empty query', async () => {
      const s = new cls();
      await expect(s.scrap('')).rejects.toThrow();
    });

    test(
      `scrap("${KEYWORD}") returns valid results`,
      async () => {
        const results = await new cls().scrap(KEYWORD);
        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeGreaterThan(0);

        for (const r of results.slice(0, 3)) {
          expect(typeof r.title).toBe('string');
          expect(r.title.length).toBeGreaterThan(0);
          expect(r.url).toMatch(/^https?:\/\//);
          expect(typeof r.img).toBe('string');
          expect(typeof r.date).toBe('string');
          // Date should be ISO or empty for Tempo (no date on page)
          if (r.date) {
            expect(r.date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
          }
        }
      },
      { timeout: 30000 },
    );
  });
}
