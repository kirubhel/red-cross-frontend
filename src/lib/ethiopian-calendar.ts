/**
 * Ethiopian Calendar Utility Module
 *
 * Provides month names, leap year calculation, days in month,
 * date parsing, validation, and formatting for the Ethiopian Calendar (EC).
 */

export interface EthiopianMonth {
  number: number; // 1 to 13
  nameEn: string;
  nameAm: string;
  days: number;
}

export const ETHIOPIAN_MONTHS: EthiopianMonth[] = [
  { number: 1, nameEn: 'Meskerem', nameAm: 'መስከረም', days: 30 },
  { number: 2, nameEn: 'Tikimt', nameAm: 'ጥቅምት', days: 30 },
  { number: 3, nameEn: 'Hidar', nameAm: 'ኅዳር', days: 30 },
  { number: 4, nameEn: 'Tahsas', nameAm: 'ታኅሣሥ', days: 30 },
  { number: 5, nameEn: 'Tir', nameAm: 'ጥር', days: 30 },
  { number: 6, nameEn: 'Yakatit', nameAm: 'የካቲት', days: 30 },
  { number: 7, nameEn: 'Megabit', nameAm: 'መጋቢት', days: 30 },
  { number: 8, nameEn: 'Miazia', nameAm: 'ሚያዝያ', days: 30 },
  { number: 9, nameEn: 'Ginbot', nameAm: 'ግንቦት', days: 30 },
  { number: 10, nameEn: 'Sene', nameAm: 'ሰኔ', days: 30 },
  { number: 11, nameEn: 'Hamle', nameAm: 'ሐምሌ', days: 30 },
  { number: 12, nameEn: 'Nehase', nameAm: 'ነሐሴ', days: 30 },
  { number: 13, nameEn: 'Pagume', nameAm: 'ጳጉሜ', days: 5 }, // 6 in leap year
];

export interface EthiopianDate {
  year: number;
  month: number; // 1 to 13
  day: number; // 1 to 30 (or 5/6 for Pagume)
}

/**
 * Checks whether an Ethiopian year is a leap year.
 * In the Ethiopian calendar, a leap year occurs when year % 4 === 3.
 */
export function isEthiopianLeapYear(year: number): boolean {
  return year % 4 === 3;
}

/**
 * Returns the number of days in a given Ethiopian month and year.
 */
export function getDaysInEthiopianMonth(year: number, month: number): number {
  if (month < 1 || month > 13) return 30;
  if (month === 13) {
    return isEthiopianLeapYear(year) ? 6 : 5;
  }
  return 30;
}

/**
 * Formats an EthiopianDate object into `DD/MM/YYYY`.
 */
export function formatEthiopianDate(date: EthiopianDate): string {
  const day = String(date.day).padStart(2, '0');
  const month = String(date.month).padStart(2, '0');
  const year = String(date.year);
  return `${day}/${month}/${year}`;
}

/**
 * Parses a string in `DD/MM/YYYY` or `YYYY-MM-DD` or `DD-MM-YYYY` format into an EthiopianDate object.
 * Returns null if invalid.
 */
export function parseEthiopianDate(dateStr: string): EthiopianDate | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  const parts = trimmed.split(/[/\-.]/);
  if (parts.length !== 3) return null;

  let year: number;
  let month: number;
  let day: number;

  const p0 = parseInt(parts[0], 10);
  const p1 = parseInt(parts[1], 10);
  const p2 = parseInt(parts[2], 10);

  if (isNaN(p0) || isNaN(p1) || isNaN(p2)) return null;

  if (parts[0].length === 4) {
    // Format: YYYY-MM-DD
    year = p0;
    month = p1;
    day = p2;
  } else if (parts[2].length === 4) {
    // Format: DD/MM/YYYY
    day = p0;
    month = p1;
    year = p2;
  } else {
    return null;
  }

  if (month < 1 || month > 13) return null;
  const maxDays = getDaysInEthiopianMonth(year, month);
  if (day < 1 || day > maxDays) return null;
  if (year < 1900 || year > 2100) return null;

  return { year, month, day };
}

/**
 * Returns a human-friendly label for an Ethiopian date e.g. "12 Meskerem (መስከረም) 1995 EC"
 */
export function getEthiopianDateLabel(date: EthiopianDate): string {
  const monthObj = ETHIOPIAN_MONTHS[date.month - 1];
  if (!monthObj) return formatEthiopianDate(date);
  return `${date.day} ${monthObj.nameEn} (${monthObj.nameAm}) ${date.year} EC`;
}

const ETHIOPIAN_JD_OFFSET = 1723856;

function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function jdnToGregorian(jdn: number): { year: number; month: number; day: number } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

/**
 * Converts a Gregorian date string (`YYYY-MM-DD` or ISO timestamp) to an EthiopianDate.
 */
export function gregorianToEthiopian(dateStr: string): EthiopianDate | null {
  if (!dateStr) return null;
  const match = dateStr.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  let year: number;
  let month: number;
  let day: number;
  if (match) {
    year = parseInt(match[1], 10);
    month = parseInt(match[2], 10);
    day = parseInt(match[3], 10);
  } else {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    year = d.getFullYear();
    month = d.getMonth() + 1;
    day = d.getDate();
  }
  const jdn = gregorianToJDN(year, month, day);
  const r = (jdn - ETHIOPIAN_JD_OFFSET) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const ecYear = 4 * Math.floor((jdn - ETHIOPIAN_JD_OFFSET) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const ecMonth = Math.floor(n / 30) + 1;
  const ecDay = (n % 30) + 1;
  return { year: ecYear, month: ecMonth, day: ecDay };
}

/**
 * Converts an EthiopianDate to a Gregorian ISO date string (`YYYY-MM-DD`).
 */
export function ethiopianToGregorian(ec: EthiopianDate): string {
  const jdn =
    ETHIOPIAN_JD_OFFSET +
    365 +
    365 * (ec.year - 1) +
    Math.floor(ec.year / 4) +
    30 * ec.month +
    ec.day -
    31;
  const gc = jdnToGregorian(jdn);
  return `${String(gc.year).padStart(4, '0')}-${String(gc.month).padStart(2, '0')}-${String(gc.day).padStart(2, '0')}`;
}

/**
 * Formats a Gregorian ISO date string in Gregorian, Ethiopian, or both calendars.
 */
export function formatDualDate(dateStr: string, mode: 'GC' | 'EC' | 'BOTH' = 'GC'): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const gcFormatted = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  if (mode === 'GC') return gcFormatted;
  const ec = gregorianToEthiopian(dateStr);
  if (!ec) return gcFormatted;
  const monthObj = ETHIOPIAN_MONTHS[ec.month - 1];
  const ecFormatted = `${ec.day} ${monthObj ? monthObj.nameEn : ec.month} ${ec.year} E.C.`;
  if (mode === 'EC') return ecFormatted;
  return `${gcFormatted} (${ecFormatted})`;
}
