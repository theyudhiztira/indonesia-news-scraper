export interface SearchResult {
  /** Article title */
  title: string;
  /** Full URL to the article */
  url: string;
  /** Image thumbnail URL (may be empty string if none) */
  img: string;
  /** ISO 8601 date string, e.g. "2026-08-10T10:18:13.122Z" */
  date: string;
}

export interface Scraper {
  /** Human-readable news source name */
  readonly source: string;
  /** Search the news portal for a keyword. Returns promise of results. */
  scrap(query: string): Promise<SearchResult[]>;
}
