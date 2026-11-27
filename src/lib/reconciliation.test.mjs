import assert from "node:assert/strict";
import test from "node:test";
import { attentionFlag, summarizeByMethod, toCsv } from "./reconciliation.ts";

const now = Date.parse("2026-03-10T12:00:00Z");
const row = (o) => ({ id: "i", person_id: "p", amount: 100, currency: "ETB", status: "PAID", description: "", created_at: "2026-03-10T10:00:00Z", payment_method: "ARIFPAY", provider_ref: "TX1", ...o });

test("a paid ArifPay payment without a reference needs attention; a manual one does not", () => {
  assert.equal(attentionFlag(row({ provider_ref: "" }), now), "NO_REFERENCE");
  assert.equal(attentionFlag(row({ provider_ref: "" , payment_method: "MANUAL" }), now), null);
  assert.equal(attentionFlag(row(), now), null);
});

test("pending ArifPay payments are only flagged after a day", () => {
  assert.equal(attentionFlag(row({ status: "PENDING", provider_ref: "" }), now), null);
  assert.equal(attentionFlag(row({ status: "PENDING", provider_ref: "", created_at: "2026-03-08T10:00:00Z" }), now), "STUCK_PENDING");
});

test("totals split by method and never mix currencies", () => {
  const [arif, manual] = summarizeByMethod([
    row({ amount: 100 }), row({ amount: 50, currency: "USD" }), row({ status: "PENDING" }),
    row({ payment_method: "MANUAL", amount: 500 }), row({ payment_method: "MANUAL", status: "FAILED" }),
  ]);
  assert.deepEqual(arif.paid, { ETB: 100, USD: 50 });
  assert.equal(arif.paidCount, 2);
  assert.equal(arif.pendingCount, 1);
  assert.deepEqual(manual.paid, { ETB: 500 });
  assert.equal(manual.failedCount, 1);
});

test("csv escapes quotes and commas and neutralises formulas", () => {
  const csv = toCsv([row({ payer_name: '=HYPERLINK("x")', description: "a, b", invoice_number: "R-1" })], () => "Addis Ababa", now);
  const lines = csv.replace("﻿", "").split("\r\n");
  assert.equal(lines.length, 2);
  assert.ok(lines[1].includes(`"'=HYPERLINK(""x"")"`));
  assert.ok(lines[1].includes('"a, b"'));
  assert.ok(lines[1].startsWith("R-1,i,TX1,"));
  assert.ok(lines[1].includes(",ArifPay,"));
});
