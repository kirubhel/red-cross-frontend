import assert from "node:assert/strict";
import test from "node:test";
import { memberPaymentChannel, paymentChannel } from "./payment-source.ts";

test("a member's latest paid invoice decides Manual or ArifPay", () => {
  assert.equal(memberPaymentChannel("MANUAL", "ACTIVE"), "MANUAL");
  assert.equal(memberPaymentChannel("ARIFPAY", "ACTIVE"), "ARIFPAY");
  assert.equal(memberPaymentChannel("ONLINE", "ACTIVE"), "ARIFPAY");
  assert.equal(memberPaymentChannel("TELEBIRR", "ACTIVE"), "ARIFPAY");
});

test("imported and seeded members with no payment count as Manual", () => {
  assert.equal(memberPaymentChannel(undefined, "ACTIVE"), "MANUAL");
  assert.equal(memberPaymentChannel("", "EXPIRED"), "MANUAL");
  assert.equal(memberPaymentChannel(null, undefined), "MANUAL");
});

test("a member who still owes the fee has no payment method yet", () => {
  assert.equal(memberPaymentChannel(undefined, "PENDING_PAYMENT"), null);
  assert.equal(paymentChannel("manual"), "MANUAL");
});
