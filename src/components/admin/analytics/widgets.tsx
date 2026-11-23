"use client";

import type { ReactNode } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel } from "@/components/admin/page-ui";
import { SERIES, formatNumber, percent, type RegionStat } from "@/lib/registry-analytics";

export function Card({ title, subtitle, action, children, className }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Panel title={title} description={subtitle} actions={action} className={className}>
      {children}
    </Panel>
  );
}

export function StatTile({ label, value, hint, icon: Icon, delta }: { label: string; value: string; hint?: string; icon: LucideIcon; delta?: { current: number; previous: number } }) {
  let deltaNode: ReactNode = null;
  if (delta) {
    const diff = delta.current - delta.previous;
    const DeltaIcon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;
    const text = delta.previous === 0 ? (delta.current === 0 ? "no change" : "none in the 30 days before") : `${diff > 0 ? "+" : ""}${Math.round((diff / delta.previous) * 100)}% vs previous 30 days`;
    deltaNode = (
      <span className={cn("inline-flex items-center gap-1 font-semibold", diff > 0 ? "text-emerald-700" : diff < 0 ? "text-red-700" : "text-gray-500")}>
        <DeltaIcon className="h-3 w-3" /> {text}
      </span>
    );
  }
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-[#ED1C24]">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-3xl font-black tracking-tight text-gray-900">{value}</p>
      <p className="mt-1 min-h-[16px] text-[11px] text-gray-500">{deltaNode || hint}</p>
    </div>
  );
}

export function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-gray-600">
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: i.color }} /> {i.label}
        </span>
      ))}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-xl bg-gray-50 px-4 py-8 text-center text-xs font-semibold text-gray-400">{children}</p>;
}

/** Horizontal bars for one measure across categories; value printed at the tip. */
export function HBarList({ items, color = SERIES.MEMBER, onSelect, selected }: { items: { key?: string | number; label: string; value: number }[]; color?: string; onSelect?: (key: string | number) => void; selected?: string | number | null }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const total = items.reduce((s, i) => s + i.value, 0);
  if (total === 0) return <Empty>No data for the current filters.</Empty>;
  return (
    <ul className="space-y-1.5">
      {items.map((item) => {
        const key = item.key ?? item.label;
        const isSel = selected != null && selected === key;
        const row = (
          <>
            <span className={cn("w-32 shrink-0 truncate text-left text-xs", isSel ? "font-black text-gray-900" : "font-semibold text-gray-600")} title={item.label}>
              {item.label}
            </span>
            <span className="relative h-2.5 flex-1">
              <span className="absolute inset-y-0 left-0 rounded-r-[4px]" style={{ width: `${(item.value / max) * 100}%`, minWidth: item.value > 0 ? 2 : 0, background: color, opacity: selected != null && !isSel ? 0.45 : 1 }} />
            </span>
            <span className="w-24 shrink-0 text-right text-xs tabular-nums text-gray-900">
              <b>{formatNumber(item.value)}</b> <span className="text-gray-400">{percent(item.value, total)}%</span>
            </span>
          </>
        );
        return (
          <li key={key} title={`${item.label}: ${formatNumber(item.value)} (${percent(item.value, total)}%)`}>
            {onSelect ? (
              <button type="button" onClick={() => onSelect(key)} aria-pressed={isSel} className="flex w-full items-center gap-3 rounded-md px-1 py-0.5 hover:bg-gray-50">
                {row}
              </button>
            ) : (
              <div className="flex items-center gap-3 px-1 py-0.5">{row}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** 100% bars showing the gender mix of each row. Unknown is shown, never hidden. */
export function GenderBars({ rows }: { rows: { label: string; split: { FEMALE: number; MALE: number; UNKNOWN: number } }[] }) {
  const parts = [
    { key: "FEMALE" as const, label: "Female", color: SERIES.FEMALE },
    { key: "MALE" as const, label: "Male", color: SERIES.MALE },
    { key: "UNKNOWN" as const, label: "Not recorded", color: SERIES.UNKNOWN },
  ];
  const visible = rows.filter((r) => r.split.FEMALE + r.split.MALE + r.split.UNKNOWN > 0);
  if (visible.length === 0) return <Empty>No data for the current filters.</Empty>;
  return (
    <div className="space-y-4">
      <Legend items={parts} />
      {visible.map((row) => {
        const total = row.split.FEMALE + row.split.MALE + row.split.UNKNOWN;
        return (
          <div key={row.label}>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-bold text-gray-800">{row.label}</span>
              <span className="tabular-nums text-gray-500">{formatNumber(total)}</span>
            </div>
            <div className="flex h-3 gap-[2px] overflow-hidden rounded-[4px]">
              {parts.map((p) =>
                row.split[p.key] > 0 ? (
                  <span key={p.key} style={{ width: `${(row.split[p.key] / total) * 100}%`, background: p.color }} title={`${p.label}: ${formatNumber(row.split[p.key])} (${percent(row.split[p.key], total)}%)`} />
                ) : null
              )}
            </div>
            <p className="mt-1 text-[11px] tabular-nums text-gray-600">
              {parts
                .filter((p) => row.split[p.key] > 0)
                .map((p) => `${p.label} ${percent(row.split[p.key], total)}% (${formatNumber(row.split[p.key])})`)
                .join("  ·  ")}
            </p>
          </div>
        );
      })}
    </div>
  );
}

type TrendPoint = { label: string; members: number; volunteers: number };

function TrendTooltip({ active, payload, unit }: { active?: boolean; payload?: { payload: TrendPoint }[]; unit: "week" | "month" }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 text-xs shadow-lg">
      <p className="font-bold text-gray-500">
        {unit === "week" ? "Week of " : ""}
        {p.label}
      </p>
      <p className="mt-1 text-sm font-black text-gray-900">{formatNumber(p.members + p.volunteers)} new</p>
      <p className="mt-1 flex items-center gap-1.5 text-gray-700">
        <span className="h-2 w-2 rounded-sm" style={{ background: SERIES.MEMBER }} /> Members {formatNumber(p.members)}
      </p>
      <p className="flex items-center gap-1.5 text-gray-700">
        <span className="h-2 w-2 rounded-sm" style={{ background: SERIES.VOLUNTEER }} /> Volunteers {formatNumber(p.volunteers)}
      </p>
    </div>
  );
}

/** New registrations per period, members stacked under volunteers. */
export function TrendChart({ points, unit }: { points: TrendPoint[]; unit: "week" | "month" }) {
  if (points.length === 0) return <Empty>No dated registrations for the current filters.</Empty>;
  return (
    <div>
      <Legend
        items={[
          { label: "Members", color: SERIES.MEMBER },
          { label: "Volunteers", color: SERIES.VOLUNTEER },
        ]}
      />
      <div className="mt-3 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={points} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#efeeea" />
            <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: "#e3e2dc" }} tick={{ fontSize: 11, fill: "#6b6a65" }} minTickGap={24} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6b6a65" }} width={44} />
            <Tooltip cursor={{ fill: "#f5f4f0" }} content={<TrendTooltip unit={unit} />} />
            <Bar dataKey="members" stackId="a" fill={SERIES.MEMBER} maxBarSize={24} stroke="#ffffff" strokeWidth={2} isAnimationActive={false} />
            <Bar dataKey="volunteers" stackId="a" fill={SERIES.VOLUNTEER} maxBarSize={24} stroke="#ffffff" strokeWidth={2} radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** The table view of the regional numbers (also what the map and bars are drawn from). */
export function RegionTable({ stats, selected, onSelect }: { stats: RegionStat[]; selected?: number | null; onSelect?: (id: number) => void }) {
  const rows = [...stats].sort((a, b) => b.total - a.total);
  const grand = rows.reduce((s, r) => s + r.total, 0);
  const max = Math.max(1, ...rows.map((r) => r.total));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-xs">
        <thead>
          <tr className="border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500">
            <th className="py-2 pr-3 font-bold">Region</th>
            <th className="py-2 pr-3 font-bold">Share</th>
            <th className="py-2 pr-3 text-right font-bold">Total</th>
            <th className="py-2 pr-3 text-right font-bold">Members</th>
            <th className="py-2 pr-3 text-right font-bold">Volunteers</th>
            <th className="py-2 pr-3 text-right font-bold">Female</th>
            <th className="py-2 text-right font-bold">Male</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const known = r.female + r.male;
            return (
              <tr key={r.id} onClick={() => onSelect?.(r.id)} className={cn("border-b border-gray-50 tabular-nums", onSelect && "cursor-pointer hover:bg-gray-50", selected === r.id && "bg-blue-50/60")}>
                <td className="py-2 pr-3 font-bold text-gray-900">{r.name}</td>
                <td className="w-40 py-2 pr-3">
                  <span className="flex h-2.5 gap-[2px]" title={`${percent(r.total, grand)}% of the registry`}>
                    <span className="rounded-l-[2px]" style={{ width: `${(r.members / max) * 100}%`, background: SERIES.MEMBER }} />
                    <span className="rounded-r-[4px]" style={{ width: `${(r.volunteers / max) * 100}%`, background: SERIES.VOLUNTEER }} />
                  </span>
                </td>
                <td className="py-2 pr-3 text-right font-black text-gray-900">{formatNumber(r.total)}</td>
                <td className="py-2 pr-3 text-right text-gray-700">{formatNumber(r.members)}</td>
                <td className="py-2 pr-3 text-right text-gray-700">{formatNumber(r.volunteers)}</td>
                <td className="py-2 pr-3 text-right text-gray-700">{known ? `${formatNumber(r.female)} (${percent(r.female, known)}%)` : "—"}</td>
                <td className="py-2 text-right text-gray-700">{known ? `${formatNumber(r.male)} (${percent(r.male, known)}%)` : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-3">
        <Legend
          items={[
            { label: "Members", color: SERIES.MEMBER },
            { label: "Volunteers", color: SERIES.VOLUNTEER },
          ]}
        />
      </div>
    </div>
  );
}
