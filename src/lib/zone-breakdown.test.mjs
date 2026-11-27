import assert from "node:assert/strict";
import test from "node:test";
import { normalizeZone, zoneBreakdown, zoneLabel } from "./zone-breakdown.ts";

test("zones stored as an id, a name or nothing resolve to one key", () => {
  assert.equal(normalizeZone("ZONE_aa_bole"), "ZONE_aa_bole");
  assert.equal(normalizeZone("zone_AA_Bole"), "ZONE_aa_bole");
  assert.equal(normalizeZone("Addis Ketema"), "ZONE_aa_addis_ketema");
  assert.equal(normalizeZone("  "), "");
  assert.equal(normalizeZone(null), "");
  assert.equal(normalizeZone("Somewhere else"), "Somewhere else");
  assert.equal(zoneLabel("ZONE_aa_nifas_silk"), "Nifas Silk Lafto");
});

test("members are counted per zone in the region, unrecorded last", () => {
  const rec = (role, regionId, zoneId) => ({ role, regionId, zoneId });
  const b = zoneBreakdown(
    [
      rec("MEMBER", 1, "ZONE_aa_bole"), rec("MEMBER", 1, "ZONE_aa_bole"), rec("MEMBER", 1, "ZONE_aa_kirkos"),
      rec("MEMBER", 1, ""), rec("MEMBER", 1, ""), rec("MEMBER", 1, ""),
      rec("VOLUNTEER", 1, "ZONE_aa_bole"), rec("MEMBER", 6, "ZONE_aa_bole"),
    ],
    1
  );
  assert.equal(b.total, 6);
  assert.equal(b.recorded, 3);
  assert.deepEqual(b.rows.map((r) => [r.label, r.value]), [["Bole", 2], ["Kirkos", 1], ["Zone not recorded", 3]]);
});

test("a region with no members gives an empty breakdown", () => {
  assert.deepEqual(zoneBreakdown([], 1), { rows: [], total: 0, recorded: 0 });
});
