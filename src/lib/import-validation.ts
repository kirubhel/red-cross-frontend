// Pure validation for the Excel member / volunteer imports.
// Nothing here touches Excel or the DOM, so it can be unit-tested on its own.

export type ColumnKind = "text" | "name" | "phone" | "email" | "date" | "list" | "yesno" | "region";

export interface ImportColumn {
  key: string;
  /** Header text in the template, without the required/optional marker. */
  label: string;
  required: boolean;
  kind: ColumnKind;
  /** Old header names that still map to this column, so earlier files keep working. */
  aliases?: string[];
  /** Canonical values for `list` columns. */
  options?: string[];
  /** Extra spellings accepted for a list value, e.g. m -> Male. */
  synonyms?: Record<string, string>;
  width: number;
  /** One-line help shown in the instructions sheet and as a cell prompt. */
  help: string;
  /** Example shown in the instructions sheet (never placed in the data sheet). */
  example: string;
}

export interface RegionOption {
  id: number;
  name: string;
}

export interface CellIssue {
  key: string;
  /** Column label as the user sees it in the sheet. */
  column: string;
  message: string;
}

export interface ParsedRow {
  /** Row number in the user's sheet, so messages point at the right line. */
  rowNumber: number;
  /** Raw text per column key. */
  values: Record<string, string>;
}

export interface ValidatedRow {
  row: ParsedRow;
  issues: CellIssue[];
  /** Cleaned values (phone as +251..., date as YYYY-MM-DD, canonical list values). */
  clean: Record<string, string>;
}

export const PHONE_HELP =
  "Ethiopian mobile: 0912345678, +251912345678, 251912345678 or 912345678 (all accepted). " +
  "Numbers from another country must start with + and the country code.";

const SPACES = /[\s \-().]/g;

export function normalizeHeader(value: string): string {
  return value
    .replace(/\(\s*(optional|required)\s*\)/gi, "")
    .replace(/\*/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function normalizePhone(input: string): { ok: true; value: string } | { ok: false; message: string } {
  const original = input.trim();
  let text = original.replace(SPACES, "");
  if (text.startsWith("00")) text = "+" + text.slice(2);
  const plus = text.startsWith("+");
  const digits = text.replace(/\D/g, "");
  if (digits.length === 0 || /[^\d+]/.test(text)) {
    return { ok: false, message: `"${original}" is not a phone number. Use 0912345678 or +251912345678.` };
  }

  const ethiopianMobile = /^[79]\d{8}$/;
  const fromLocal = (local: string) => (ethiopianMobile.test(local) ? { ok: true as const, value: "+251" + local } : null);

  if (plus || digits.startsWith("251")) {
    if (digits.startsWith("251")) {
      let rest = digits.slice(3);
      if (rest.startsWith("0") && rest.length === 10) rest = rest.slice(1); // +251 0912...
      const ok = fromLocal(rest);
      if (ok) return ok;
      return {
        ok: false,
        message: `"${original}" starts with +251 but is not a valid Ethiopian mobile number (needs 9 digits after +251, starting with 9 or 7).`,
      };
    }
    if (plus && digits.length >= 8 && digits.length <= 15) return { ok: true, value: "+" + digits };
    return { ok: false, message: `"${original}" is not a valid international number (8 to 15 digits after +).` };
  }

  if (digits.length === 10 && digits.startsWith("0")) {
    const ok = fromLocal(digits.slice(1));
    if (ok) return ok;
  }
  if (digits.length === 9) {
    const ok = fromLocal(digits);
    if (ok) return ok;
  }

  const hint =
    digits.length < 9
      ? "it is too short"
      : digits.length > 10
        ? "it is too long"
        : "an Ethiopian mobile number starts with 09, 07, 9 or 7";
  return { ok: false, message: `"${original}" is not a valid phone number: ${hint}. Use 0912345678 or +251912345678.` };
}

export function parseDate(input: string): { ok: true; value: string } | { ok: false; message: string } {
  const text = input.trim();
  let y: number, m: number, d: number;
  let match: RegExpMatchArray | null;
  if ((match = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/))) {
    [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  } else if ((match = text.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/))) {
    [d, m, y] = [Number(match[1]), Number(match[2]), Number(match[3])]; // day first
  } else {
    return { ok: false, message: `"${text}" is not a date. Use YYYY-MM-DD, for example 1990-04-25.` };
  }
  const date = new Date(Date.UTC(y, m - 1, d));
  const real = date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  if (!real) return { ok: false, message: `"${text}" is not a real calendar date (check the day and month).` };
  if (y < 1900) return { ok: false, message: `"${text}": the year ${y} is too far in the past.` };
  if (date.getTime() > Date.now()) return { ok: false, message: `"${text}" is in the future.` };
  const pad = (n: number) => String(n).padStart(2, "0");
  return { ok: true, value: `${y}-${pad(m)}-${pad(d)}` };
}

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s'’.\-]*$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function resolveRegion(input: string, regions: RegionOption[]): RegionOption | null {
  const text = input.trim();
  const idMatch = text.match(/^(\d{1,3})\s*(?:[-–:.]|$)/);
  if (idMatch) {
    const byId = regions.find((r) => r.id === Number(idMatch[1]));
    if (byId) return byId;
  }
  const wanted = text.replace(/^\d+\s*[-–:.]\s*/, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  return regions.find((r) => r.name.toLowerCase().replace(/[^a-z0-9]/g, "") === wanted) || null;
}

export interface ValidationContext {
  regions?: RegionOption[];
}

function validateCell(col: ImportColumn, raw: string, ctx: ValidationContext): { clean?: string; message?: string } {
  const value = raw.trim();
  if (!value) {
    return col.required ? { message: "Required: this cell is empty." } : { clean: "" };
  }
  switch (col.kind) {
    case "name":
      if (value.length > 100) return { message: "Too long (maximum 100 characters)." };
      if (!NAME_PATTERN.test(value)) return { message: `"${value}" should contain letters only (no digits or symbols).` };
      return { clean: value.replace(/\s+/g, " ") };
    case "text":
      if (value.length > 255) return { message: "Too long (maximum 255 characters)." };
      return { clean: value };
    case "email":
      return EMAIL_PATTERN.test(value) && value.length <= 255
        ? { clean: value.toLowerCase() }
        : { message: `"${value}" is not a valid email address (example: name@example.com).` };
    case "phone": {
      const r = normalizePhone(value);
      return r.ok ? { clean: r.value } : { message: r.message };
    }
    case "date": {
      const r = parseDate(value);
      return r.ok ? { clean: r.value } : { message: r.message };
    }
    case "list": {
      const options = col.options || [];
      const key = value.toLowerCase();
      const synonym = col.synonyms?.[key];
      const hit = options.find((o) => o.toLowerCase() === (synonym || key).toLowerCase());
      return hit ? { clean: hit } : { message: `"${value}" is not allowed. Choose one of: ${options.join(", ")}.` };
    }
    case "yesno": {
      if (["yes", "y", "1", "true"].includes(value.toLowerCase())) return { clean: "YES" };
      if (["no", "n", "0", "false"].includes(value.toLowerCase())) return { clean: "NO" };
      return { message: `"${value}" must be YES or NO.` };
    }
    case "region": {
      const regions = ctx.regions || [];
      const hit = resolveRegion(value, regions);
      return hit ? { clean: String(hit.id) } : { message: `"${value}" is not a known region. Pick one from the dropdown list.` };
    }
  }
}

/**
 * Checks every row against the column rules and flags the exact cells that are wrong.
 * Phone numbers and emails that repeat inside the file are flagged on every repeat after the first.
 */
export function validateRows(columns: ImportColumn[], rows: ParsedRow[], ctx: ValidationContext = {}): ValidatedRow[] {
  const seen: Record<string, Map<string, number>> = { phone: new Map(), email: new Map() };

  return rows.map((row) => {
    const issues: CellIssue[] = [];
    const clean: Record<string, string> = {};

    for (const col of columns) {
      const result = validateCell(col, row.values[col.key] ?? "", ctx);
      if (result.message) {
        issues.push({ key: col.key, column: col.label, message: result.message });
      } else {
        clean[col.key] = result.clean ?? "";
      }
    }

    for (const col of columns) {
      const bucket = seen[col.kind];
      const value = clean[col.key];
      if (!bucket || !value || issues.some((i) => i.key === col.key)) continue;
      const first = bucket.get(value);
      if (first !== undefined) {
        const what = col.kind === "phone" ? "phone number" : "email";
        issues.push({ key: col.key, column: col.label, message: `Same ${what} as row ${first} in this file. Each person needs their own.` });
      } else {
        bucket.set(value, row.rowNumber);
      }
    }

    return { row, issues, clean };
  });
}

/** Maps a server error message to the column it is about, so the cell can be highlighted. */
export function issueFromServerError(columns: ImportColumn[], message: string): CellIssue {
  const text = (message || "Import failed.").trim();
  const lower = text.toLowerCase();
  const pick = (kind: ColumnKind) => columns.find((c) => c.kind === kind);

  let col: ImportColumn | undefined;
  let friendly = text;
  if (lower.includes("phone")) {
    col = pick("phone");
    if (lower.includes("already in use")) friendly = "This phone number is already registered in the system.";
  } else if (lower.includes("email")) {
    col = pick("email");
    if (lower.includes("already in use")) friendly = "This email is already registered in the system.";
  } else if (lower.includes("region")) {
    col = pick("region");
  } else if (lower.includes("date_of_birth") || lower.includes("date of birth") || lower.includes("invalid input syntax for type date") || lower.includes("date/time field")) {
    col = pick("date");
    friendly = "The date of birth was rejected by the system. Use YYYY-MM-DD.";
  } else if (lower.includes("first_name") || lower.includes("first name")) {
    col = columns.find((c) => c.key === "firstName");
  } else if (lower.includes("father")) {
    col = columns.find((c) => c.key === "fatherName");
  }

  friendly = friendly.replace(/^core person creation failed:\s*/i, "").replace(/rpc error: code = \w+ desc = /i, "");
  return { key: col?.key || "", column: col?.label || "", message: friendly };
}
