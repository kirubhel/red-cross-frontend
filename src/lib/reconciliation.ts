import { paymentChannel, paymentMethodLabel } from "./payment-source.ts";

export interface PaymentRow {
  id: string;
  invoice_number?: string;
  person_id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  payment_method?: string;
  payer_name?: string;
  payer_phone?: string;
  payer_email?: string;
  region_id?: number;
  purpose?: string;
  created_at: string;
  paid_at?: string;
  provider_ref?: string;
}

const HOUR = 3600 * 1000;

export const isPaidRow = (p: PaymentRow) => p.status === "PAID" || p.status === "SUCCESS";
export const isPendingRow = (p: PaymentRow) => p.status === "PENDING" || p.status === "UNPAID";
export const currencyOf = (p: PaymentRow) => (p.currency || "ETB").toUpperCase();

/**
 * Things a person reconciling should look at first. An ArifPay payment marked paid with no
 * provider reference cannot be matched to an ArifPay statement line, and one still pending a
 * day after it started is either abandoned or a confirmation that never arrived.
 */
export type AttentionFlag = "NO_REFERENCE" | "STUCK_PENDING";

export function attentionFlag(p: PaymentRow, now: number = Date.now()): AttentionFlag | null {
  if (paymentChannel(p.payment_method) !== "ARIFPAY") return null;
  if (isPaidRow(p) && !(p.provider_ref || "").trim()) return "NO_REFERENCE";
  if (isPendingRow(p)) {
    const started = Date.parse(p.created_at);
    if (!Number.isNaN(started) && now - started > 24 * HOUR) return "STUCK_PENDING";
  }
  return null;
}

export const ATTENTION_LABEL: Record<AttentionFlag, string> = {
  NO_REFERENCE: "Paid, no ArifPay reference",
  STUCK_PENDING: "Pending for over 24 hours",
};

export interface MethodSummary {
  channel: "ARIFPAY" | "MANUAL";
  paidCount: number;
  /** Paid amount per currency; currencies are never added together. */
  paid: Record<string, number>;
  pendingCount: number;
  failedCount: number;
}

/** Totals per payment method for whatever rows are passed in (so they follow the filters). */
export function summarizeByMethod(rows: PaymentRow[]): MethodSummary[] {
  const make = (channel: "ARIFPAY" | "MANUAL"): MethodSummary => ({ channel, paidCount: 0, paid: {}, pendingCount: 0, failedCount: 0 });
  const out = { ARIFPAY: make("ARIFPAY"), MANUAL: make("MANUAL") };
  for (const p of rows) {
    // Anything that is not manual went through checkout, which is ArifPay.
    const s = paymentChannel(p.payment_method) === "MANUAL" ? out.MANUAL : out.ARIFPAY;
    if (isPaidRow(p)) {
      s.paidCount += 1;
      s.paid[currencyOf(p)] = (s.paid[currencyOf(p)] || 0) + (Number(p.amount) || 0);
    } else if (isPendingRow(p)) s.pendingCount += 1;
    else if (p.status === "FAILED") s.failedCount += 1;
  }
  return [out.ARIFPAY, out.MANUAL];
}

export function formatPaid(totals: Record<string, number>): string {
  const keys = Object.keys(totals).sort((a, b) => (a === "ETB" ? -1 : b === "ETB" ? 1 : a.localeCompare(b)));
  if (keys.length === 0) return "0";
  return keys.map((k) => `${Math.round(totals[k]).toLocaleString("en-US")} ${k}`).join(" + ");
}

const csvCell = (v: unknown) => {
  let s = v === null || v === undefined ? "" : String(v);
  // A cell that starts like a formula would run when the file is opened in Excel.
  if (/^[=+\-@\t\r]/.test(s) && !/^[+-]?\d+(\.\d+)?$/.test(s)) s = "'" + s;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const CSV_HEADER = [
  "Invoice number", "Transaction ID", "ArifPay reference", "Payer", "Phone", "Email", "Region",
  "Purpose", "Method", "Status", "Amount", "Currency", "Created", "Paid", "Needs attention",
];

/** One row per payment with every column the screen shows, for matching against statements. */
export function toCsv(rows: PaymentRow[], regionName: (id: number) => string, now: number = Date.now()): string {
  const lines = [CSV_HEADER.map(csvCell).join(",")];
  for (const p of rows) {
    const flag = attentionFlag(p, now);
    lines.push(
      [
        p.invoice_number, p.id, p.provider_ref, p.payer_name, p.payer_phone, p.payer_email,
        regionName(p.region_id ?? 0), p.purpose || p.description, paymentMethodLabel(p.payment_method),
        p.status, Number(p.amount) || 0, currencyOf(p), p.created_at, p.paid_at || "", flag ? ATTENTION_LABEL[flag] : "",
      ].map(csvCell).join(",")
    );
  }
  // BOM so Excel reads Amharic names as UTF-8.
  return "﻿" + lines.join("\r\n");
}
