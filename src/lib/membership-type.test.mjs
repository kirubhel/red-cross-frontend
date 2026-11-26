import assert from "node:assert/strict";
import test from "node:test";
import { membershipTypeLabel } from "./membership-type.ts";

test("regular membership codes and names share one chart label", () => {
  assert.equal(membershipTypeLabel("REGULAR"), "Regular Member");
  assert.equal(membershipTypeLabel("regular_member"), "Regular Member");
  assert.equal(membershipTypeLabel("Regular Member"), "Regular Member");
});

test("other membership types and missing values keep meaningful labels", () => {
  assert.equal(membershipTypeLabel("FAMILY_LIFETIME"), "Family Lifetime");
  assert.equal(membershipTypeLabel(""), "Not recorded");
});
