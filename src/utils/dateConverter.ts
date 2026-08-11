import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

/** Map Indonesian month names/abbreviations to English equivalents for dayjs parsing. */
const MONTHS: Record<string, string> = {
  // Full names
  januari: 'january',
  februari: 'february',
  maret: 'march',
  april: 'april',
  mei: 'may',
  juni: 'june',
  juli: 'july',
  agustus: 'august',
  september: 'september',
  oktober: 'october',
  november: 'november',
  desember: 'december',
  // Abbreviations
  jan: 'jan',
  feb: 'feb',
  mar: 'mar',
  apr: 'apr',
  jun: 'jun',
  jul: 'jul',
  ags: 'aug',
  agu: 'aug',
  sep: 'sep',
  okt: 'oct',
  nov: 'nov',
  des: 'dec',
};

function translateMonth(input: string): string {
  let result = input;
  for (const [id, en] of Object.entries(MONTHS)) {
    const regex = new RegExp(id, 'gi');
    result = result.replace(regex, en);
  }
  return result;
}

/** Strip WIB timezone suffix. */
function stripWib(input: string): string {
  return input.replace(/\bWIB\b/gi, '').trim();
}

/**
 * Parse Indonesian relative time expressions into ISO 8601.
 * Handles: "X menit yang lalu", "X detik yang lalu", "X jam yang lalu", "X hari yang lalu"
 */
function parseRelative(idText: string): string | null {
  const lower = idText.toLowerCase().trim();

  const patterns: [RegExp, dayjs.ManipulateType][] = [
    [/^(\d+)\s*detik\s+(?:yang\s+)?lalu/, 'second'],
    [/^(\d+)\s*menit\s+(?:yang\s+)?lalu/, 'minute'],
    [/^(\d+)\s*jam\s+(?:yang\s+)?lalu/, 'hour'],
    [/^(\d+)\s*hari\s+(?:yang\s+)?lalu/, 'day'],
  ];

  for (const [regex, unit] of patterns) {
    const match = lower.match(regex);
    if (match) {
      return dayjs().subtract(Number(match[1]), unit).toISOString();
    }
  }

  return null;
}

/**
 * Convert an Indonesian date string to ISO 8601.
 * Accepts relative times ("5 menit yang lalu"), Indonesian locale dates,
 * and already-ISO strings.
 *
 * Common input formats:
 *   - "5 menit yang lalu"
 *   - "Senin, 10 Agustus 2026 14:30 WIB"
 *   - "10 Ags 2026 14:30 WIB"
 *   - "2026-08-10T14:30:00+07:00"
 */
export function convertDate(dateString: string): string {
  // Handle "10 Agustus 2026 | 10:26 WIB" style dates (Viva)
  const cleaned = stripWib(dateString).replace(/,/g, '').replace(/\s*\|\s*/g, ' ').trim();

  // Already ISO?
  if (/^\d{4}-\d{2}-\d{2}T/.test(cleaned)) {
    return dayjs(cleaned).toISOString();
  }

  // Relative time?
  const relative = parseRelative(cleaned);
  if (relative) return relative;

  // Translate Indonesian months and parse with dayjs
  const translated = translateMonth(cleaned);

  // Try common date formats
  const formats = [
    'DD MMMM YYYY HH:mm',
    'D MMMM YYYY HH:mm',
    'DD MMM YYYY HH:mm',
    'D MMM YYYY HH:mm',
    'DD/MM/YYYY HH:mm',
    'D/M/YYYY HH:mm',
    'DD-MM-YYYY HH:mm',
    'D-M-YYYY HH:mm',
    // Date-only formats (Kompas, etc.)
    'DD MMMM YYYY',
    'D MMMM YYYY',
    'DD MMM YYYY',
    'D MMM YYYY',
  ];

  for (const fmt of formats) {
    const parsed = dayjs(translated, fmt, true);
    if (parsed.isValid()) return parsed.toISOString();
  }

  // Last resort: try loose parsing
  const loose = dayjs(translated);
  if (loose.isValid()) return loose.toISOString();

  // Give up, return current time
  return dayjs().toISOString();
}
