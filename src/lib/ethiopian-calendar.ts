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
