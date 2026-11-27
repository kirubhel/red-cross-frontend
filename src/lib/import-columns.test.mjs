import assert from "node:assert/strict";
import test from "node:test";
import { memberImportConfig } from "./import-columns.ts";

const regions = [{ id: 1, name: "Addis Ababa" }, { id: 6, name: "Oromia" }];
const keys = (c) => c.columns.map((x) => x.key);

test("a super admin's template has a Region column and no note", () => {
  const c = memberImportConfig(regions, null, null);
  assert.ok(keys(c).includes("region"));
  assert.equal(c.notes, undefined);
});

test("a regional admin's template drops Region and names the region", () => {
  const c = memberImportConfig(regions, regions[0]);
  assert.ok(!keys(c).includes("region"));
  assert.match(c.notes[0], /Addis Ababa/);
  assert.match(c.notes[0], /no Region column/);
});

test("a zonal admin's template names the zone and has no area columns", () => {
  const c = memberImportConfig(regions, regions[0], { zone: "Nifas Silk Lafto" });
  assert.ok(!keys(c).includes("region"));
  assert.match(c.notes[0], /Addis Ababa \/ Nifas Silk Lafto zone/);
  assert.match(c.notes[0], /Region, Zone or Woreda/);
});

test("a woreda admin's template names the woreda", () => {
  const c = memberImportConfig(regions, regions[0], { woreda: "Woreda 03" });
  assert.match(c.notes[0], /Addis Ababa \/ Woreda 03/);
});
