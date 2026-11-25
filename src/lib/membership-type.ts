/** Display labels for membership values stored as either plan codes or names. */
export function membershipTypeLabel(value: string): string {
  const normalized = value.trim().replace(/[_\s]+/g, " ").toUpperCase();
  if (!normalized) return "Not recorded";
  if (normalized === "REGULAR" || normalized === "REGULAR MEMBER") return "Regular Member";
  return normalized.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}
