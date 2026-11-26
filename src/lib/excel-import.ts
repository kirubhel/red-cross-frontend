// Excel side of the member / volunteer imports: the colour-coded template,
// the reader that maps columns by header name, and the "fix these cells" error file.
import {
  PHONE_HELP,
  normalizeHeader,
  type CellIssue,
  type ImportColumn,
  type ParsedRow,
  type RegionOption,
} from "./import-validation";

export interface ImportConfig {
  /** Name of the data sheet, e.g. "Members". */
  sheetName: string;
  title: string;
  columns: ImportColumn[];
  regions?: RegionOption[];
  /** Extra lines for the instructions sheet. */
  notes?: string[];
}

const COLORS = {
  requiredHeader: "FFED1C24",
  optionalHeader: "FF475569",
  requiredCell: "FFFEF2F2",
  optionalCell: "FFF8FAFC",
  errorCell: "FFFCA5A5",
  errorText: "FF7F1D1D",
  errorHeader: "FF991B1B",
  white: "FFFFFFFF",
};

const DATA_ROWS = 500;
const INSTRUCTIONS_SHEET = "Instructions";
const LISTS_SHEET = "Lists";
export const MAX_IMPORT_ROWS = 2000;

type Workbook = import("exceljs").Workbook;
type Worksheet = import("exceljs").Worksheet;
type Cell = import("exceljs").Cell;

async function loadExcelJS() {
  const mod: any = await import("exceljs");
  return mod.default ?? mod;
}

export function headerText(col: ImportColumn): string {
  return col.required ? `${col.label} *` : `${col.label} (optional)`;
}

function colLetter(index: number): string {
  let n = index + 1;
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

const thin = (argb: string) => ({
  top: { style: "thin" as const, color: { argb } },
  left: { style: "thin" as const, color: { argb } },
  bottom: { style: "thin" as const, color: { argb } },
  right: { style: "thin" as const, color: { argb } },
});

/** Writes the colour-coded data sheet (header, tinted columns, dropdowns, prompts). */
function writeDataSheet(wb: Workbook, config: ImportConfig, hasLists: boolean): Worksheet {
  const ws = wb.addWorksheet(config.sheetName, {
    views: [{ state: "frozen", ySplit: 1 }],
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });
  const { columns } = config;

  ws.addRow(columns.map(headerText));
  ws.getRow(1).height = 32;

  columns.forEach((col, i) => {
    const letter = colLetter(i);
    ws.getColumn(i + 1).width = col.width;

    const head = ws.getCell(`${letter}1`);
    head.font = { bold: true, color: { argb: COLORS.white }, size: 11 };
    head.fill = { type: "pattern", pattern: "solid", fgColor: { argb: col.required ? COLORS.requiredHeader : COLORS.optionalHeader } };
    head.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    head.note = `${col.required ? "REQUIRED" : "Optional"}: ${col.help}\nExample: ${col.example}`;

    const tint = col.required ? COLORS.requiredCell : COLORS.optionalCell;
    for (let r = 2; r <= DATA_ROWS; r++) {
      const cell = ws.getCell(`${letter}${r}`);
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: tint } };
      cell.border = thin("FFE2E8F0");
      // Text format keeps Excel from eating a leading 0 / + in phones or reformatting dates.
      if (col.kind === "phone" || col.kind === "date" || col.kind === "text" || col.kind === "name") cell.numFmt = "@";

      if (col.kind === "list" && col.options?.length) {
        cell.dataValidation = {
          type: "list",
          allowBlank: !col.required,
          formulae: [`"${col.options.join(",")}"`],
          showErrorMessage: true,
          errorTitle: "Not in the list",
          error: `Choose one of: ${col.options.join(", ")}`,
          showInputMessage: true,
          promptTitle: col.label,
          prompt: col.help,
        };
      } else if (col.kind === "yesno") {
        cell.dataValidation = { type: "list", allowBlank: true, formulae: ['"YES,NO"'], showErrorMessage: true, errorTitle: "YES or NO", error: "Choose YES or NO." };
      } else if (col.kind === "region" && hasLists && config.regions?.length) {
        cell.dataValidation = {
          type: "list",
          allowBlank: !col.required,
          formulae: [`'${LISTS_SHEET}'!$A$1:$A$${config.regions.length}`],
          showErrorMessage: true,
          errorTitle: "Not in the list",
          error: "Pick a region from the dropdown list.",
          showInputMessage: true,
          promptTitle: col.label,
          prompt: "Pick from the dropdown list.",
        };
      } else if (col.kind === "phone" || col.kind === "date") {
        cell.dataValidation = {
          type: "textLength",
          operator: "lessThanOrEqual",
          allowBlank: !col.required,
          formulae: [col.kind === "phone" ? 20 : 12],
          showInputMessage: true,
          promptTitle: col.label,
          prompt: col.kind === "phone" ? "0912345678 or +251912345678" : "YYYY-MM-DD, e.g. 1990-04-25",
        };
      }
    }
  });
  return ws;
}

function writeListsSheet(wb: Workbook, config: ImportConfig): boolean {
  if (!config.regions?.length) return false;
  const lists = wb.addWorksheet(LISTS_SHEET, { state: "hidden" });
  config.regions.forEach((r, i) => (lists.getCell(`A${i + 1}`).value = `${r.id} - ${r.name}`));
  return true;
}

function writeInstructionsSheet(wb: Workbook, config: ImportConfig) {
  const ws = wb.addWorksheet(INSTRUCTIONS_SHEET, { pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 } });
  ws.getColumn(1).width = 28;
  ws.getColumn(2).width = 16;
  ws.getColumn(3).width = 62;
  ws.getColumn(4).width = 30;

  const title = ws.addRow([config.title]);
  title.font = { bold: true, size: 16, color: { argb: COLORS.requiredHeader } };
  ws.addRow([]);

  const section = (text: string) => {
    const r = ws.addRow([text]);
    r.font = { bold: true, size: 12 };
    return r;
  };
  const line = (text: string) => {
    const r = ws.addRow([text]);
    ws.mergeCells(r.number, 1, r.number, 4);
    r.alignment = { wrapText: true, vertical: "top" };
    r.height = Math.max(18, Math.ceil(text.length / 105) * 16);
    return r;
  };

  section("1. Fill in the sheet named \"" + config.sheetName + "\" (one person per row)");
  line("Do not rename, move or delete the column headings, and do not leave the example text in the sheet.");
  ws.addRow([]);

  section("2. Colours");
  const req = ws.addRow(["Red heading, ends with *", "REQUIRED"]);
  req.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.requiredHeader } };
  req.getCell(1).font = { bold: true, color: { argb: COLORS.white } };
  ws.getCell(`C${req.number}`).value = "Must be filled in. A row with an empty required cell is not imported.";
  const opt = ws.addRow(["Grey heading, says (optional)", "Optional"]);
  opt.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.optionalHeader } };
  opt.getCell(1).font = { bold: true, color: { argb: COLORS.white } };
  ws.getCell(`C${opt.number}`).value = "Can be left empty.";
  ws.addRow([]);

  section("3. Phone numbers");
  line(PHONE_HELP);
  line("Examples that all work: 0967123456   +251967123456   251967123456   967123456. Keep the cell as Text (already set) so Excel does not remove the leading 0 or +.");
  ws.addRow([]);

  section("4. Dates");
  line("Use YYYY-MM-DD (1990-04-25). DD/MM/YYYY (25/04/1990) also works. These are normal (Gregorian) calendar dates.");
  ws.addRow([]);

  section("5. If some rows fail");
  line("After you upload, every row is checked first. You will see which rows and which cells are wrong, and you can download an Excel file with only the failed rows. In that file the wrong cells are shaded red, the reason is written in the last column and in a comment on the cell. Fix them and upload that file again: rows that were already imported are not in it.");
  ws.addRow([]);
  for (const note of config.notes || []) line(note);

  section("Columns");
  const head = ws.addRow(["Column", "Required?", "What to enter", "Example"]);
  head.font = { bold: true, color: { argb: COLORS.white } };
  head.eachCell((c) => (c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.optionalHeader } }));
  config.columns.forEach((col) => {
    const r = ws.addRow([col.label, col.required ? "REQUIRED" : "Optional", col.help, col.example]);
    r.alignment = { wrapText: true, vertical: "top" };
    r.getCell(1).font = { bold: true };
    r.getCell(2).font = { bold: true, color: { argb: col.required ? COLORS.requiredHeader : COLORS.optionalHeader } };
    r.height = Math.max(18, Math.ceil(col.help.length / 58) * 16);
  });
}

export async function buildTemplateWorkbook(config: ImportConfig): Promise<Workbook> {
  const ExcelJS = await loadExcelJS();
  const wb: Workbook = new ExcelJS.Workbook();
  writeInstructionsSheet(wb, config);
  const hasLists = writeListsSheet(wb, config);
  writeDataSheet(wb, config, hasLists);
  return wb;
}

export async function downloadWorkbook(wb: Workbook, filename: string) {
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------------------------------------------------------------- reading

function cellText(cell: Cell): string {
  const value: any = cell?.value;
  if (value === undefined || value === null) return "";
  if (value instanceof Date) {
    const p = (n: number) => String(n).padStart(2, "0");
    return `${value.getUTCFullYear()}-${p(value.getUTCMonth() + 1)}-${p(value.getUTCDate())}`;
  }
  if (typeof value === "object") {
    if (Array.isArray(value.richText)) return value.richText.map((p: any) => p.text || "").join("").trim();
    if ("result" in value) {
      const r = value.result;
      if (r instanceof Date) return cellText({ value: r } as Cell);
      return r === undefined || r === null ? "" : String(r).trim();
    }
    if ("text" in value) return String(value.text ?? "").trim(); // hyperlinks (emails are often auto-linked)
    if ("error" in value) return "";
    return "";
  }
  return String(value).trim();
}

/** Excel stores real dates as day counts since 1899-12-30; this turns one back into YYYY-MM-DD. */
function serialToIsoDate(serial: number): string {
  const d = new Date(Math.round((serial - 25569) * 86400000));
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`;
}

function readCell(cell: Cell, kind: ImportColumn["kind"]): string {
  const raw: any = cell?.value;
  if (kind === "date" && typeof raw === "number" && raw > 1 && raw < 80000) return serialToIsoDate(raw);
  return cellText(cell);
}

export interface ReadResult {
  rows: ParsedRow[];
  /** Required columns the file does not have at all. */
  missingRequired: string[];
  /** Headers in the file that are not part of the template (ignored). */
  ignoredHeaders: string[];
  truncated: boolean;
}

export async function readImportWorkbook(buffer: ArrayBuffer, config: ImportConfig): Promise<ReadResult> {
  const ExcelJS = await loadExcelJS();
  const wb: Workbook = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);

  const skip = new Set([INSTRUCTIONS_SHEET.toLowerCase(), LISTS_SHEET.toLowerCase(), "helperlists"]);
  const ws =
    wb.worksheets.find((s) => s.name.toLowerCase() === config.sheetName.toLowerCase()) ||
    wb.worksheets.find((s) => !skip.has(s.name.toLowerCase()) && s.actualRowCount > 0);
  if (!ws) throw new Error("The file has no data sheet. Download the template and fill that in.");

  const lookup = new Map<string, ImportColumn>();
  config.columns.forEach((c) => {
    [c.label, c.key, ...(c.aliases || [])].forEach((name) => lookup.set(normalizeHeader(name), c));
  });

  // The header is the first row (within the top 10) that matches at least two known columns.
  let headerRow = 0;
  let mapping = new Map<number, ImportColumn>();
  const ignored: string[] = [];
  for (let r = 1; r <= Math.min(10, ws.rowCount) && !headerRow; r++) {
    const row = ws.getRow(r);
    const found = new Map<number, ImportColumn>();
    const unknown: string[] = [];
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      const text = cellText(cell);
      if (!text) return;
      const col = lookup.get(normalizeHeader(text));
      if (col && ![...found.values()].includes(col)) found.set(colNumber, col);
      else unknown.push(text);
    });
    if (found.size >= 2) {
      headerRow = r;
      mapping = found;
      ignored.push(...unknown);
    }
  }
  if (!headerRow) {
    throw new Error("Could not find the column headings (First Name, Phone Number, ...). Please use the downloaded template.");
  }

  const present = new Set(mapping.values());
  const missingRequired = config.columns.filter((c) => c.required && !present.has(c)).map((c) => c.label);

  const rows: ParsedRow[] = [];
  let truncated = false;
  for (let r = headerRow + 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const values: Record<string, string> = {};
    let any = false;
    mapping.forEach((col, colNumber) => {
      const text = readCell(row.getCell(colNumber), col.kind);
      values[col.key] = text;
      if (text) any = true;
    });
    if (!any) continue;
    if (rows.length >= MAX_IMPORT_ROWS) {
      truncated = true;
      break;
    }
    rows.push({ rowNumber: r, values });
  }
  return { rows, missingRequired, ignoredHeaders: ignored, truncated };
}

// ---------------------------------------------------------------- error file

export interface FailedRow {
  row: ParsedRow;
  issues: CellIssue[];
}

/**
 * A copy of the template that holds only the failed rows, with the wrong cells shaded red,
 * a comment on each, and the reasons in the last two columns. It re-imports as is once fixed.
 */
export async function buildErrorWorkbook(config: ImportConfig, failed: FailedRow[]): Promise<Workbook> {
  const ExcelJS = await loadExcelJS();
  const wb: Workbook = new ExcelJS.Workbook();
  const hasLists = writeListsSheet(wb, config);
  const ws = writeDataSheet(wb, config, hasLists);
  const n = config.columns.length;

  const rowCol = n + 1;
  const whyCol = n + 2;
  [rowCol, whyCol].forEach((c, i) => {
    const head = ws.getCell(1, c);
    head.value = i === 0 ? "Row in your file" : "What to fix";
    head.font = { bold: true, color: { argb: COLORS.white } };
    head.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.errorHeader } };
    head.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  });
  ws.getColumn(rowCol).width = 14;
  ws.getColumn(whyCol).width = 80;

  failed.forEach((item, idx) => {
    const r = idx + 2;
    config.columns.forEach((col, i) => {
      ws.getCell(r, i + 1).value = item.row.values[col.key] ?? "";
    });
    ws.getCell(r, rowCol).value = item.row.rowNumber;
    ws.getCell(r, rowCol).alignment = { horizontal: "center", vertical: "top" };

    const reasons: string[] = [];
    for (const issue of item.issues) {
      const label = issue.column || "Row";
      reasons.push(`${label}: ${issue.message}`);
      const colIndex = config.columns.findIndex((c) => c.key === issue.key);
      if (colIndex >= 0) {
        const cell = ws.getCell(r, colIndex + 1);
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.errorCell } };
        cell.font = { bold: true, color: { argb: COLORS.errorText } };
        cell.border = thin("FFDC2626");
        cell.note = issue.message;
      }
    }
    const why = ws.getCell(r, whyCol);
    why.value = reasons.map((x) => "• " + x).join("\n");
    why.alignment = { wrapText: true, vertical: "top" };
    why.font = { color: { argb: COLORS.errorText } };
    // About 90 characters fit on a line of the "What to fix" column.
    const lines = reasons.reduce((sum, text) => sum + Math.max(1, Math.ceil((text.length + 2) / 90)), 0);
    ws.getRow(r).height = Math.max(20, lines * 15 + 4);
    for (let c = 1; c <= whyCol; c++) {
      const cell = ws.getCell(r, c);
      cell.alignment = { ...(cell.alignment || {}), vertical: "top", wrapText: c === whyCol };
    }
  });
  return wb;
}
