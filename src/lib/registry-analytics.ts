// Shared data layer for the admin dashboard and the reports page: loads members and
// volunteers, cleans the messy imported fields, and aggregates them for charts.
// Unknown values stay "unknown" - nothing is defaulted to a region, gender or date.

import api from "@/lib/api";
import { REGIONS } from "@/lib/constants";

export type Role = "MEMBER" | "VOLUNTEER";
export type Gender = "FEMALE" | "MALE" | "UNKNOWN";

export type RegistryRecord = {
  id: string;
  role: Role;
  name: string;
  email: string;
  phone: string;
  /** 1-14, or 0 when the record has no usable region */
  regionId: number;
  gender: Gender;
  /** age in whole years, or null when the birth date is missing or unparseable */
  age: number | null;
  status: string;
  membershipType: string;
  /** registration time in ms, or null when unknown */
  createdAt: number | null;
};

export type RegistryLoad = {
  records: RegistryRecord[];
  /** totals reported by the server, which can exceed what was loaded */
  memberTotal: number;
  volunteerTotal: number;
  truncated: boolean;
};

export const REGION_NAME: Record<number, string> = Object.fromEntries(REGIONS.map((r) => [r.id, r.name]));
export const REGION_IDS = REGIONS.map((r) => r.id);

/** Series colors (validated: categorical, light surface). Color follows the entity. */
export const SERIES = {
  MEMBER: "#2a78d6",
  VOLUNTEER: "#eb6834",
  FEMALE: "#1baf7a",
  MALE: "#6250d6",
  UNKNOWN: "#c9c8c2",
} as const;

/** One-hue ramp for magnitude (choropleth), light to dark. */
export const SEQUENTIAL = ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#104281"];
export const NO_DATA = "#f0efec";

const REGION_SLUGS: Record<string, number> = {
  addis_ababa: 1, dire_dawa: 2, tigray: 3, afar: 4, amhara: 5, oromia: 6, somali: 7,
  benishangul_gumz: 8, benishangul_gumuz: 8, central_ethiopia: 9, gambela: 10, gambella: 10,
  harari: 11, sidama: 12, south_west_ethiopia: 13, south_ethiopia: 14,
};

export function parseRegionId(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "object") return parseRegionId((value as { id?: unknown }).id);
  const str = String(value).trim();
  if (!str) return 0;
  const slug = REGION_SLUGS[str.toLowerCase().replace(/^region_/, "").replace(/[\s-]+/g, "_")];
  if (slug) return slug;
  const digits = str.match(/\d+/);
  const id = digits ? Number(digits[0]) : 0;
  return REGION_NAME[id] ? id : 0;
}

export function parseGender(value: unknown): Gender {
  const g = String(value ?? "").trim().toUpperCase();
  if (g === "FEMALE" || g === "F") return "FEMALE";
  if (g === "MALE" || g === "M") return "MALE";
  return "UNKNOWN";
}

function parseTime(value: unknown): number | null {
  if (!value) return null;
  const t = new Date(String(value)).getTime();
  return Number.isFinite(t) ? t : null;
}

/** Accepts ISO dates and the dd/mm/yyyy strings left by spreadsheet imports. */
export function parseAge(value: unknown, now = Date.now()): number | null {
  const str = String(value ?? "").trim();
  if (!str) return null;
  let birth: Date | null = null;
  const dmy = str.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (dmy) birth = new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
  else if (/^\d{4}-\d{2}-\d{2}/.test(str)) birth = new Date(str);
  if (!birth || !Number.isFinite(birth.getTime())) return null;
  const age = Math.floor((now - birth.getTime()) / (365.25 * 24 * 3600 * 1000));
  return age >= 0 && age <= 110 ? age : null;
}

export type RegistryQuery = {
  region?: string;
  zone?: string;
  woreda?: string;
  branchId?: string;
  status?: string;
  category?: string;
  type?: string;
  search?: string;
};

const PAGE_SIZE = 5000;

function toParams(q: RegistryQuery, keys: (keyof RegistryQuery)[]): string {
  const params = new URLSearchParams({ page: "1", page_size: String(PAGE_SIZE) });
  const names: Record<keyof RegistryQuery, string> = {
    region: "region", zone: "zone", woreda: "woreda", branchId: "branch_id",
    status: "status", category: "category", type: "type", search: "search",
  };
  keys.forEach((k) => {
    if (q[k]) params.set(names[k], String(q[k]));
  });
  return params.toString();
}

/** Loads members and volunteers matching the query. Throws only if both requests fail. */
export async function loadRegistry(query: RegistryQuery = {}): Promise<RegistryLoad> {
  const [people, volunteers] = await Promise.allSettled([
    api.get(`/person?${toParams(query, ["region", "zone", "woreda", "branchId", "status", "category", "type", "search"])}&members_only=true`),
    api.get(`/volunteers?${toParams(query, ["region", "status", "search"])}`),
  ]);
  if (people.status === "rejected" && volunteers.status === "rejected") throw people.reason;

  type Row = Record<string, string | undefined>;
  const peopleRows: Row[] = people.status === "fulfilled" ? people.value.data?.people || [] : [];
  const volunteerRows: Row[] = volunteers.status === "fulfilled" ? volunteers.value.data?.volunteers || [] : [];
  const memberTotal = people.status === "fulfilled" ? Number(people.value.data?.pagination?.total_items ?? peopleRows.length) : 0;
  const volunteerTotal = volunteers.status === "fulfilled" ? Number(volunteers.value.data?.pagination?.total_items ?? volunteerRows.length) : 0;

  const records: RegistryRecord[] = [
    ...peopleRows.map((p, i): RegistryRecord => ({
      id: String(p.id || p.ercs_id || `member-${i}`),
      role: "MEMBER",
      name: [p.first_name, p.father_name].filter(Boolean).join(" ").trim() || "Unnamed member",
      email: p.email || "",
      phone: p.phone_number || "",
      regionId: parseRegionId(p.region) || parseRegionId(p.region_id),
      gender: parseGender(p.gender),
      age: parseAge(p.date_of_birth),
      status: String(p.status || "UNKNOWN").toUpperCase(),
      membershipType: String(p.membership_type || "").trim(),
      createdAt: parseTime(p.created_at),
    })),
    ...volunteerRows.map((v, i): RegistryRecord => ({
      id: String(v.id || v.person_id || `volunteer-${i}`),
      role: "VOLUNTEER",
      name: [v.first_name, v.last_name || v.father_name].filter(Boolean).join(" ").trim() || "Unnamed volunteer",
      email: v.email || "",
      phone: v.phone_number || "",
      regionId: parseRegionId(v.region),
      gender: parseGender(v.gender),
      age: parseAge(v.date_of_birth),
      status: String(v.status || "UNKNOWN").toUpperCase(),
      membershipType: "",
      createdAt: parseTime(v.created_at),
    })),
  ];

  return {
    records,
    memberTotal,
    volunteerTotal,
    truncated: memberTotal > peopleRows.length || volunteerTotal > volunteerRows.length,
  };
}

// ---------- aggregation ----------

export type RegionStat = {
  id: number;
  name: string;
  total: number;
  members: number;
  volunteers: number;
  female: number;
  male: number;
  unknownGender: number;
};

export function byRegion(records: RegistryRecord[]): RegionStat[] {
  const stats = new Map<number, RegionStat>(
    REGION_IDS.map((id) => [id, { id, name: REGION_NAME[id], total: 0, members: 0, volunteers: 0, female: 0, male: 0, unknownGender: 0 }])
  );
  records.forEach((r) => {
    const s = stats.get(r.regionId);
    if (!s) return;
    s.total++;
    if (r.role === "MEMBER") s.members++;
    else s.volunteers++;
    if (r.gender === "FEMALE") s.female++;
    else if (r.gender === "MALE") s.male++;
    else s.unknownGender++;
  });
  return [...stats.values()];
}

export function genderSplit(records: RegistryRecord[]) {
  const out = { FEMALE: 0, MALE: 0, UNKNOWN: 0 };
  records.forEach((r) => out[r.gender]++);
  return out;
}

export const AGE_GROUPS = [
  { label: "Under 18", min: 0, max: 17 },
  { label: "18–24", min: 18, max: 24 },
  { label: "25–34", min: 25, max: 34 },
  { label: "35–44", min: 35, max: 44 },
  { label: "45–59", min: 45, max: 59 },
  { label: "60+", min: 60, max: 200 },
];

export function ageGroups(records: RegistryRecord[]) {
  const groups = AGE_GROUPS.map((g) => ({ label: g.label, value: 0 }));
  let unknown = 0;
  records.forEach((r) => {
    if (r.age === null) return void unknown++;
    const i = AGE_GROUPS.findIndex((g) => r.age! >= g.min && r.age! <= g.max);
    if (i >= 0) groups[i].value++;
  });
  return { groups, unknown };
}

export function countBy(records: RegistryRecord[], key: (r: RegistryRecord) => string, limit = 6) {
  const counts = new Map<string, number>();
  records.forEach((r) => {
    const k = key(r);
    if (k) counts.set(k, (counts.get(k) || 0) + 1);
  });
  const sorted = [...counts.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  if (sorted.length <= limit) return sorted;
  const rest = sorted.slice(limit - 1).reduce((sum, x) => sum + x.value, 0);
  return [...sorted.slice(0, limit - 1), { label: "Other", value: rest }];
}

const DAY = 24 * 3600 * 1000;

/** New registrations per week (Monday start) or per month, split by role. Undated records are excluded. */
export function registrationTrend(records: RegistryRecord[]) {
  const dated = records.filter((r) => r.createdAt !== null);
  if (dated.length === 0) return { points: [] as { label: string; start: number; members: number; volunteers: number }[], unit: "week" as const, undated: records.length };
  const min = Math.min(...dated.map((r) => r.createdAt!));
  const max = Math.max(...dated.map((r) => r.createdAt!));
  const unit: "week" | "month" = max - min > 200 * DAY ? "month" : "week";

  const bucketStart = (t: number) => {
    const d = new Date(t);
    if (unit === "month") return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    day.setDate(day.getDate() - ((day.getDay() + 6) % 7));
    return day.getTime();
  };
  const next = (t: number) => {
    const d = new Date(t);
    if (unit === "month") d.setMonth(d.getMonth() + 1);
    else d.setDate(d.getDate() + 7);
    return d.getTime();
  };

  const buckets = new Map<number, { members: number; volunteers: number }>();
  for (let t = bucketStart(min); t <= bucketStart(max); t = next(t)) buckets.set(t, { members: 0, volunteers: 0 });
  dated.forEach((r) => {
    const b = buckets.get(bucketStart(r.createdAt!));
    if (!b) return;
    if (r.role === "MEMBER") b.members++;
    else b.volunteers++;
  });
  const points = [...buckets.entries()].map(([start, v]) => ({
    start,
    label: new Date(start).toLocaleDateString("en-US", unit === "month" ? { month: "short", year: "2-digit" } : { month: "short", day: "numeric" }),
    ...v,
  }));
  return { points, unit, undated: records.length - dated.length };
}

/** Registrations in the last `days` and in the equal window before it. */
export function recentWindow(records: RegistryRecord[], days = 30, now = Date.now()) {
  let current = 0;
  let previous = 0;
  records.forEach((r) => {
    if (r.createdAt === null) return;
    const age = now - r.createdAt;
    if (age >= 0 && age <= days * DAY) current++;
    else if (age > days * DAY && age <= 2 * days * DAY) previous++;
  });
  return { current, previous };
}

export const formatNumber = (n: number) => n.toLocaleString("en-US");
export const percent = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0);
