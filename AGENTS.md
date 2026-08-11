# AGENTS.md

## Project overview

`indonesian-news-scraper` — TypeScript library that scrapes Indonesian news portal search results. Returns `{title, url, img, date}` arrays per keyword query.

- **Runtime**: Node.js ≥18 or Bun
- **Language**: TypeScript → compiled to dual CJS + ESM
- **Entrypoint**: `src/index.ts` (compiled to `dist/`)
- **Key deps**: `cheerio` (HTML parse), `puppeteer-extra` + stealth (headless Chrome), `dayjs` (dates)
- **Dev toolchain**: Bun for install/test/dev; `tsup` for build; `bun test` for testing

## Architecture

```
src/
  index.ts              → public API (re-exports all scrapers + types)
  types.ts              → SearchResult, Scraper interfaces
  browser/index.ts      → singleton puppeteer-extra + stealth browser manager
  utils/dateConverter.ts → Indonesian date/month → ISO 8601 (dayjs, no moment)
  scrapers/
    detik.ts            → 1 class + 1 singleton export per scraper
    antara.ts
    kompas.ts
    liputan6.ts
    suara.ts
    tempo.ts
    viva.ts
test/
  suara.test.ts         → 3 tests (singleton, error, integration)
  scrapers.test.ts      → integration tests for all active scrapers
```

Every scraper: `class X implements Scraper { source, scrap(query) }` + `export const x = new X()` singleton.

## Commands

```bash
bun install            # install deps
bun run typecheck      # tsc --noEmit
bun run build          # tsup → dist/cjs + dist/esm + .d.ts
bun test               # all tests (21 integration tests, ~35s)
bun test --watch       # watch mode
```

## Adding a new scraper

1. Copy `src/scrapers/suara.ts`
2. Update selectors (inspect the live search page)
3. Register in `src/index.ts`
4. Add test in `test/scrapers.test.ts`
5. Run `bun test` to verify

## Gotchas

- **`bun test` only** — real integration tests that hit live sites. No mocks.
- **Singleton browser** — `src/browser/index.ts` reuses one puppeteer instance across all scrap() calls. Call `closeBrowser()` on shutdown.
- **Stealth plugin** — `puppeteer-extra-plugin-stealth` is registered globally. All pages use stealth.
- **SPA pages** — Tempo/Liputan6 are JS-heavy. Use `fetchContent(url, { waitUntil: 'domcontentloaded' })` instead of default `networkidle2` for SPA sites.
- **`dayjs` not `moment`** — uses dayjs with customParseFormat plugin. Indonesian month names translated via lookup table.
- **`.js` extensions in imports** — required by `moduleResolution: "bundler"` + `verbatimModuleSyntax`.
- **Old code in `lib/`** — v1 legacy. Not maintained. Reference only.

## Known limitations

- **Republika**: Blocked. Stealth bypasses Cloudflare, but search uses Google CSE which refuses to populate results in headless Chrome. Needs Google CSE API key.
- **Tempo**: Search redirects to homepage. The `/search?q=` endpoint ignores the query and shows "Berita Terkini" (latest news) regardless. Scraper exists but returns empty results.

## npm publish

```bash
bun run build          # clean build
bun test               # verify
npm publish            # ships dist/ only (see "files" in package.json)
```
