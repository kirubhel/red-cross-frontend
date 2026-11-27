// Which zone (sub-city) each person belongs to, for the regional dashboard. Zones are stored
// inconsistently: usually the catalogue id ("ZONE_aa_bole"), sometimes a typed name
// ("Addis Ketema"), and for most people not at all. Nothing is guessed: unknown stays unknown.
import { ETHIOPIA_LOCATION_DATA } from "./constants.ts";

export const ZONE_NOT_RECORDED = "";

const ALL_ZONES = Object.values(ETHIOPIA_LOCATION_DATA).flatMap((r) => r.zones);

/** The catalogue id for a stored zone (matching id or name, any case); other text is kept as typed. */
export function normalizeZone(value: unknown): string {
  const str = String(value ?? "").trim();
  if (!str) return ZONE_NOT_RECORDED;
  const hit = ALL_ZONES.find((z) => z.id.toLowerCase() === str.toLowerCase() || z.name.toLowerCase() === str.toLowerCase());
  return hit ? hit.id : str;
}

export function zoneLabel(zoneId: string): string {
  if (!zoneId) return "Zone not recorded";
  return ALL_ZONES.find((z) => z.id === zoneId)?.name || zoneId;
}

export interface ZoneRow {
  /** Catalogue id, the typed text, or "" for people with no zone. */
  key: string;
  label: string;
  value: number;
}

export interface ZoneBreakdown {
  rows: ZoneRow[];
  total: number;
  /** People who have a zone on record. */
  recorded: number;
}

/**
 * Counts members per zone inside one region, biggest first, with "Zone not recorded" last so a
 * large unrecorded group is visible instead of silently missing from the chart.
 */
export function zoneBreakdown(records: { role: string; regionId: number; zoneId: string }[], regionId: number): ZoneBreakdown {
  const counts = new Map<string, number>();
  let total = 0;
  for (const r of records) {
    if (r.role !== "MEMBER" || r.regionId !== regionId) continue;
    total++;
    counts.set(r.zoneId, (counts.get(r.zoneId) || 0) + 1);
  }
  const unrecorded = counts.get(ZONE_NOT_RECORDED) || 0;
  counts.delete(ZONE_NOT_RECORDED);
  const rows: ZoneRow[] = [...counts.entries()]
    .map(([key, value]) => ({ key, label: zoneLabel(key), value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
  if (unrecorded > 0) rows.push({ key: ZONE_NOT_RECORDED, label: zoneLabel(ZONE_NOT_RECORDED), value: unrecorded });
  return { rows, total, recorded: total - unrecorded };
}
