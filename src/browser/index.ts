import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { Browser as PptBrowser } from 'puppeteer';

// Register the stealth plugin globally — makes puppeteer-extra apply it to every launch.
// Individual scrapers can still call vanilla puppeteer.launch() if they import 'puppeteer' directly.
puppeteer.use(StealthPlugin());

let _browser: PptBrowser | null = null;
let _refs = 0;

/**
 * Singleton browser manager using puppeteer-extra + stealth plugin.
 * Reuses a single stealth browser instance across multiple scrap() calls.
 */
export type WaitUntil = 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';

export interface PageOptions {
  /** Page load wait strategy. Default: 'networkidle2'. Use 'domcontentloaded' for SPA/heavy pages. */
  waitUntil?: WaitUntil;
  /** Navigation timeout in ms. Default: 30000. */
  timeout?: number;
}

export async function getPage(url: string, options: PageOptions = {}) {
  const { waitUntil = 'networkidle2', timeout = 30000 } = options;

  if (!_browser) {
    _browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  const page = await _browser.newPage();

  // Set a realistic viewport and user agent to help with anti-bot detection
  await page.setViewport({ width: 1366, height: 768 });
  _refs++;

  try {
    await page.goto(url, { waitUntil, timeout });
  } catch {
    await page.close();
    _refs--;
    throw new Error(`Failed to load page: ${url}`);
  }

  return page;
}

/** Returns HTML content of the fully-loaded page. Convenience wrapper. */
export async function fetchContent(url: string, options?: PageOptions): Promise<string> {
  const page = await getPage(url, options);
  try {
    return await page.content();
  } finally {
    await releasePage(page);
  }
}

export async function releasePage(page: import('puppeteer').Page) {
  await page.close();
  _refs--;
}

/** Close the shared browser. Call on process exit or after all scraping is done. */
export async function closeBrowser() {
  if (_browser) {
    await _browser.close();
    _browser = null;
    _refs = 0;
  }
}
