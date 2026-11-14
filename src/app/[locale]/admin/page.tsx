"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, HandHeart, UserPlus, MapPinned, Search, RefreshCw, Bell, Newspaper, BarChart3, ArrowRight, AlertTriangle, IdCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserScope } from "@/lib/auth-scope";
import { REGIONS } from "@/lib/constants";
import { REGION_NAME, SERIES, byRegion, formatNumber, loadRegistry, recentWindow, type RegistryLoad, type RegistryRecord } from "@/lib/registry-analytics";
import { RegistryInsights } from "@/components/admin/analytics/RegistryInsights";
import { Card, Empty, StatTile } from "@/components/admin/analytics/widgets";

const DAY = 24 * 3600 * 1000;
const DATE_RANGES = [
  { value: "ALL", label: "All time" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

const selectClass =
  "h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:bg-gray-50 disabled:text-gray-500";

const QUICK_ACTIONS = [
  { href: "/admin/user-management?create=true", label: "Add volunteer", icon: UserPlus },
  { href: "/admin/notifications", label: "Send notification", icon: Bell },
  { href: "/admin/news", label: "Publish news", icon: Newspaper },
  { href: "/admin/reports", label: "Reports & exports", icon: BarChart3 },
];

function relativeTime(t: number | null) {
  if (t === null) return "Date not recorded";
  const diff = Date.now() - t;
  if (diff < 3600 * 1000) return `${Math.max(1, Math.floor(diff / 60000))}m ago`;
  if (diff < DAY) return `${Math.floor(diff / (3600 * 1000))}h ago`;
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}d ago`;
  return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<RegistryLoad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  const [range, setRange] = useState("ALL");
  const [regionId, setRegionId] = useState<number | null>(null);
  const [regionLocked, setRegionLocked] = useState(false);
  const [scopeLabel, setScopeLabel] = useState("");
  const [quickSearch, setQuickSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const scope = getUserScope();
      const scoped = !scope.isSuperAdmin;
      setRegionLocked(scoped && Boolean(scope.regionId));
      if (scoped && scope.regionNumber) setRegionId(scope.regionNumber);
      setScopeLabel(scope.isSuperAdmin ? "National view" : scope.regionName || "Regional view");
      setData(
        await loadRegistry(
          scoped ? { region: scope.regionId || undefined, zone: scope.zoneId || undefined, woreda: scope.woredaId || undefined, branchId: scope.branchId || undefined } : {}
        )
      );
    } catch (e) {
      console.error("Failed to load dashboard data", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // everything except region: the map needs the whole country
  const filtered = useMemo(() => {
    const now = Date.now();
    return (data?.records || []).filter((r) => {
      if (role && r.role !== role) return false;
      if (gender && r.gender !== gender) return false;
      if (range !== "ALL" && (r.createdAt === null || now - r.createdAt > Number(range) * DAY)) return false;
      return true;
    });
  }, [data, role, gender, range]);

  const scoped = useMemo(() => (regionId ? filtered.filter((r) => r.regionId === regionId) : filtered), [filtered, regionId]);
  const members = scoped.filter((r) => r.role === "MEMBER").length;
  const volunteers = scoped.length - members;
  const window30 = recentWindow(scoped);
  const regionsCovered = byRegion(filtered).filter((r) => r.total > 0).length;
  const recent = useMemo(() => [...scoped].filter((r) => r.createdAt !== null).sort((a, b) => b.createdAt! - a.createdAt!).slice(0, 8), [scoped]);

  const submitSearch = (target: "members" | "volunteers" | "payments") => {
    if (quickSearch.trim()) router.push(`/admin/${target}?search=${encodeURIComponent(quickSearch.trim())}`);
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-4 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#B5121B] via-[#ED1C24] to-[#F0484F] p-6 text-white shadow-sm">
        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" aria-hidden />
        <div className="absolute -bottom-20 right-32 h-44 w-44 rounded-full bg-white/5" aria-hidden />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Ethiopian Red Cross Society · {scopeLabel}</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-white">
              {loading ? "Loading the registry…" : `${formatNumber(scoped.length)} people in ${regionId ? REGION_NAME[regionId] : `${regionsCovered} of 14 regions`}.`}
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch("members");
            }}
            className="flex w-full max-w-md items-center gap-2 rounded-xl bg-white p-1.5 shadow-sm"
          >
            <Search className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
            <input
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Search by name, phone or ID"
              aria-label="Search the registry"
              className="h-8 min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            <button type="submit" className="h-8 rounded-lg bg-gray-900 px-3 text-xs font-bold text-white hover:bg-gray-700">
              Members
            </button>
            <button type="button" onClick={() => submitSearch("volunteers")} className="h-8 rounded-lg bg-gray-100 px-3 text-xs font-bold text-gray-800 hover:bg-gray-200">
              Volunteers
            </button>
          </form>
        </div>
      </div>

      {/* Filters: one row, scoping everything below */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
        <select aria-label="Registry type" className={selectClass} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Members & volunteers</option>
          <option value="MEMBER">Members only</option>
          <option value="VOLUNTEER">Volunteers only</option>
        </select>
        <select aria-label="Region" className={selectClass} value={regionId ?? ""} disabled={regionLocked} onChange={(e) => setRegionId(e.target.value ? Number(e.target.value) : null)}>
          <option value="">All regions</option>
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <select aria-label="Gender" className={selectClass} value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">All genders</option>
          <option value="FEMALE">Female</option>
          <option value="MALE">Male</option>
          <option value="UNKNOWN">Not recorded</option>
        </select>
        <select aria-label="Registered" className={selectClass} value={range} onChange={(e) => setRange(e.target.value)}>
          {DATE_RANGES.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
        <button onClick={load} disabled={loading} className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> {loading ? "Loading" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">
          <AlertTriangle className="h-4 w-4" /> Could not load the registry. Check your connection and press Refresh.
        </div>
      )}
      {data?.truncated && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">
          <AlertTriangle className="h-4 w-4" /> Showing the first {formatNumber(data.records.length)} of {formatNumber(data.memberTotal + data.volunteerTotal)} records, so totals on this page are incomplete.
        </div>
      )}

      {/* Headline numbers */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile label="Total registry" value={loading ? "…" : formatNumber(scoped.length)} icon={Users} hint="Members and volunteers" />
        <StatTile label="Members" value={loading ? "…" : formatNumber(members)} icon={IdCard} hint={scoped.length ? `${Math.round((members / scoped.length) * 100)}% of the registry` : ""} />
        <StatTile label="Volunteers" value={loading ? "…" : formatNumber(volunteers)} icon={HandHeart} hint={scoped.length ? `${Math.round((volunteers / scoped.length) * 100)}% of the registry` : ""} />
        <StatTile label="New in the last 30 days" value={loading ? "…" : formatNumber(window30.current)} icon={UserPlus} delta={loading ? undefined : window30} />
      </div>

      <RegistryInsights records={filtered} regionId={regionId} onRegionChange={setRegionId} regionLocked={regionLocked} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card
          className="xl:col-span-3"
          title="Latest registrations"
          subtitle={regionId ? REGION_NAME[regionId] : "All regions"}
          action={
            <Link href="/admin/members" className="inline-flex items-center gap-1 text-xs font-bold text-[#B5121B] hover:underline">
              Open members <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          {recent.length === 0 ? (
            <Empty>{loading ? "Loading…" : "No dated registrations for the current filters."}</Empty>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recent.map((r: RegistryRecord) => (
                <li key={`${r.role}-${r.id}`} className="flex items-center gap-3 py-2.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: SERIES[r.role] }} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">{r.name}</p>
                    <p className="truncate text-xs text-gray-500">
                      {r.role === "MEMBER" ? "Member" : "Volunteer"} · {r.regionId ? REGION_NAME[r.regionId] : "No region"}
                      {r.phone ? ` · ${r.phone}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-gray-500">{relativeTime(r.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="xl:col-span-2" title="Quick actions" subtitle="Common tasks">
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((a) => (
              <Link key={a.href} href={a.href} className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 transition hover:border-red-200 hover:bg-red-50">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#ED1C24] shadow-sm">
                  <a.icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#B5121B]">{a.label}</span>
              </Link>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 p-3 text-[11px] text-gray-500">
            <MapPinned className="h-4 w-4 shrink-0 text-gray-400" /> Every number on this page is counted from the live registry. Campaign and event figures were removed because the system does not track them yet.
          </p>
        </Card>
      </div>
    </div>
  );
}
