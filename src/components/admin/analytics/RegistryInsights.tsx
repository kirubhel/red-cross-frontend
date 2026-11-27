"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { membershipTypeLabel } from "@/lib/membership-type";
import {
  SERIES,
  REGION_NAME,
  ageGroups,
  byRegion,
  countBy,
  formatNumber,
  genderSplit,
  percent,
  registrationTrend,
  type RegistryRecord,
} from "@/lib/registry-analytics";
import { EthiopiaMap } from "./EthiopiaMap";
import { Card, GenderBars, HBarList, RegionTable, TrendChart } from "./widgets";

type Metric = "total" | "members" | "volunteers";
const METRICS: { key: Metric; label: string; unit: string }[] = [
  { key: "total", label: "Everyone", unit: "people" },
  { key: "members", label: "Members", unit: "members" },
  { key: "volunteers", label: "Volunteers", unit: "volunteers" },
];

const titleCase = (s: string) => s.toLowerCase().replace(/(^|[_\s])\w/g, (m) => m.replace("_", " ").toUpperCase());

type Props = {
  /** records filtered by everything except region, so the map always shows the whole country */
  records: RegistryRecord[];
  regionId: number | null;
  onRegionChange?: (regionId: number | null) => void;
  /** true when the viewer is scoped to one region and cannot change it */
  regionLocked?: boolean;
  /** Narrower area (zone, woreda) a locked admin is limited to; shown instead of the region name. */
  areaName?: string;
  /** adds the full regional table (reports page) */
  showTable?: boolean;
};

export function RegistryInsights({ records, regionId, onRegionChange, regionLocked, areaName, showTable }: Props) {
  const [metric, setMetric] = useState<Metric>("total");
  const select = regionLocked ? undefined : onRegionChange;

  const regions = useMemo(() => byRegion(records), [records]);
  const scoped = useMemo(() => (regionId ? records.filter((r) => r.regionId === regionId) : records), [records, regionId]);
  const members = useMemo(() => scoped.filter((r) => r.role === "MEMBER"), [scoped]);
  const volunteers = useMemo(() => scoped.filter((r) => r.role === "VOLUNTEER"), [scoped]);
  const trend = useMemo(() => registrationTrend(scoped), [scoped]);
  const ages = useMemo(() => ageGroups(scoped), [scoped]);
  const statuses = useMemo(() => countBy(members, (r) => titleCase(r.status)), [members]);
  const types = useMemo(() => countBy(members, (r) => membershipTypeLabel(r.membershipType)), [members]);

  const noRegion = records.filter((r) => r.regionId === 0).length;
  const values = Object.fromEntries(regions.map((r) => [r.id, r[metric]]));
  const metricInfo = METRICS.find((m) => m.key === metric)!;
  const ranking = [...regions].sort((a, b) => b[metric] - a[metric]).map((r) => ({ key: r.id, label: r.name, value: r[metric] }));
  const scopeName = regionId ? REGION_NAME[regionId] : "All regions";
  const selectedStat = regionId ? regions.find((r) => r.id === regionId) : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card
          className="xl:col-span-3"
          title="Where the registry lives"
          subtitle={regionLocked ? `Your scope: ${areaName || scopeName}` : "Click a region to focus every chart on it. Click it again to clear."}
          action={
            <div className="flex rounded-lg bg-gray-100 p-0.5" role="tablist" aria-label="Map measure">
              {METRICS.map((m) => (
                <button
                  key={m.key}
                  role="tab"
                  aria-selected={metric === m.key}
                  onClick={() => setMetric(m.key)}
                  className={cn("rounded-md px-3 py-1 text-xs font-bold transition", metric === m.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800")}
                >
                  {m.label}
                </button>
              ))}
            </div>
          }
        >
          <EthiopiaMap
            values={values}
            unit={metricInfo.unit}
            selected={regionId}
            onSelect={select}
            tooltip={(id) => {
              const r = regions.find((x) => x.id === id);
              if (!r) return null;
              const known = r.female + r.male;
              return (
                <div className="mt-2 space-y-0.5 border-t border-gray-100 pt-2 text-[11px] text-gray-600">
                  <p className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm" style={{ background: SERIES.MEMBER }} /> Members <b className="ml-auto text-gray-900">{formatNumber(r.members)}</b>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm" style={{ background: SERIES.VOLUNTEER }} /> Volunteers <b className="ml-auto text-gray-900">{formatNumber(r.volunteers)}</b>
                  </p>
                  <p className="flex items-center gap-1.5">
                    Female share <b className="ml-auto text-gray-900">{known ? `${percent(r.female, known)}%` : "not recorded"}</b>
                  </p>
                </div>
              );
            }}
          />
          {noRegion > 0 && <p className="mt-2 text-[11px] font-semibold text-amber-700">{formatNumber(noRegion)} records have no region and are not on the map.</p>}
        </Card>

        <div className="space-y-4 xl:col-span-2">
          <Card
            title={`${metricInfo.label} by region`}
            subtitle="Ranked, with each region's share of the total"
            action={
              regionId && !regionLocked ? (
                <button onClick={() => onRegionChange?.(null)} className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-gray-700">
                  {scopeName} <X className="h-3 w-3" />
                </button>
              ) : undefined
            }
          >
            <HBarList items={ranking} selected={regionId} onSelect={select ? (key) => select(regionId === key ? null : Number(key)) : undefined} />
            {selectedStat && (
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-3 text-center">
                {[
                  { label: "In " + selectedStat.name, value: selectedStat.total },
                  { label: "Members", value: selectedStat.members },
                  { label: "Volunteers", value: selectedStat.volunteers },
                ].map((x) => (
                  <div key={x.label}>
                    <p className="text-lg font-black tabular-nums text-gray-900">{formatNumber(x.value)}</p>
                    <p className="truncate text-[10px] font-bold uppercase tracking-wider text-gray-500">{x.label}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card title="Gender" subtitle={`${scopeName} · share of each group`}>
            <GenderBars
              rows={[
                { label: "Everyone", split: genderSplit(scoped) },
                { label: "Members", split: genderSplit(members) },
                { label: "Volunteers", split: genderSplit(volunteers) },
              ]}
            />
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card
          className="xl:col-span-3"
          title="New registrations"
          subtitle={`${scopeName} · per ${trend.unit}${trend.undated > 0 ? ` · ${formatNumber(trend.undated)} undated records left out` : ""}`}
        >
          <TrendChart points={trend.points} unit={trend.unit} />
        </Card>
        <Card className="xl:col-span-2" title="Age groups" subtitle={`${scopeName}${ages.unknown > 0 ? ` · ${formatNumber(ages.unknown)} without a usable birth date` : ""}`}>
          <HBarList items={ages.groups} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Member status" subtitle={`${scopeName} · members only`}>
          <HBarList items={statuses} />
        </Card>
        <Card title="Membership type" subtitle={`${scopeName} · members only`}>
          <HBarList items={types} />
        </Card>
      </div>

      {showTable && (
        <Card title="Regional breakdown" subtitle="Every region, with the numbers behind the map. Gender percentages use records where gender is recorded.">
          <RegionTable stats={regions} selected={regionId} onSelect={select ? (id) => select(regionId === id ? null : id) : undefined} />
        </Card>
      )}
    </div>
  );
}
