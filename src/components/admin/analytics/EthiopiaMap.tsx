"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { ETHIOPIA_MAP_VIEWBOX, ETHIOPIA_REGION_SHAPES } from "@/lib/ethiopia-map";
import { NO_DATA, SEQUENTIAL, formatNumber } from "@/lib/registry-analytics";

// City-sized regions get a marker so they stay visible and clickable.
const CITY_REGIONS = new Set([1, 2, 11]);
const SHORT_NAME: Record<number, string> = { 8: "Benishangul G.", 9: "Central Eth.", 13: "SW Ethiopia", 14: "South Eth." };
const CITY_LABEL_OFFSET: Record<number, [number, number]> = { 1: [0, 22], 2: [-8, -20], 11: [10, 22] };
const NICE = [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];

/**
 * Lower bounds of the color bins. Counts are heavily skewed (one region can hold 80%),
 * so the bins grow geometrically instead of linearly.
 */
export function colorBreaks(max: number): number[] {
  if (max <= 0) return [1];
  const steps = SEQUENTIAL.length;
  const picked = new Set<number>([1]);
  for (let i = 1; i < steps; i++) {
    const target = Math.pow(max, i / steps);
    const nice = NICE.reduce((best, n) => (Math.abs(n - target) < Math.abs(best - target) ? n : best), NICE[0]);
    if (nice <= max) picked.add(nice);
  }
  return [...picked].sort((a, b) => a - b);
}

function colorFor(value: number, breaks: number[]): string {
  if (!value || value <= 0) return NO_DATA;
  let bin = 0;
  breaks.forEach((b, i) => {
    if (value >= b) bin = i;
  });
  // spread the used bins across the ramp so the darkest step is always reached
  const idx = breaks.length === 1 ? SEQUENTIAL.length - 3 : Math.round((bin / (breaks.length - 1)) * (SEQUENTIAL.length - 1));
  return SEQUENTIAL[idx];
}

type Props = {
  /** value per region id */
  values: Record<number, number>;
  /** what the value counts, e.g. "people" */
  unit: string;
  selected?: number | null;
  onSelect?: (regionId: number | null) => void;
  /** extra tooltip rows for a region */
  tooltip?: (regionId: number) => ReactNode;
};

export function EthiopiaMap({ values, unit, selected, onSelect, tooltip }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ id: number; x: number; y: number } | null>(null);

  const max = useMemo(() => Math.max(0, ...Object.values(values)), [values]);
  const breaks = useMemo(() => colorBreaks(max), [max]);
  const { width, height } = ETHIOPIA_MAP_VIEWBOX;

  const place = (id: number, e: React.MouseEvent) => {
    const box = wrapRef.current?.getBoundingClientRect();
    if (box) setHover({ id, x: e.clientX - box.left, y: e.clientY - box.top });
  };
  const placeAtCentroid = (id: number) => {
    const shape = ETHIOPIA_REGION_SHAPES.find((s) => s.id === id);
    const box = wrapRef.current?.getBoundingClientRect();
    if (shape && box) setHover({ id, x: (shape.cx / width) * box.width, y: (shape.cy / height) * box.height });
  };
  const toggle = (id: number) => onSelect?.(selected === id ? null : id);

  const handlers = (id: number) => ({
    onMouseMove: (e: React.MouseEvent) => place(id, e),
    onMouseLeave: () => setHover(null),
    onFocus: () => placeAtCentroid(id),
    onBlur: () => setHover(null),
    onClick: () => toggle(id),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(id);
      }
    },
  });

  // draw big regions first, then city markers on top; selected region last so its outline is not covered
  const ordered = [...ETHIOPIA_REGION_SHAPES].sort((a, b) => Number(a.id === selected) - Number(b.id === selected));
  const hovered = hover ? ETHIOPIA_REGION_SHAPES.find((s) => s.id === hover.id) : null;
  const legend = breaks.map((b, i) => {
    const next = breaks[i + 1];
    const label = next === undefined ? `${formatNumber(b)}+` : next - 1 === b ? formatNumber(b) : `${formatNumber(b)}–${formatNumber(next - 1)}`;
    return { label, color: colorFor(b, breaks) };
  });

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="group" aria-label={`Map of Ethiopia: ${unit} by region`}>
        {ordered
          .filter((s) => !CITY_REGIONS.has(s.id))
          .map((s) => {
            const isSel = selected === s.id;
            const dim = selected != null && !isSel;
            return (
              <path
                key={s.id}
                d={s.d}
                fill={colorFor(values[s.id] || 0, breaks)}
                fillRule="evenodd"
                stroke={isSel ? "#0b0b0b" : "#ffffff"}
                strokeWidth={isSel ? 2.5 : 1.5}
                strokeLinejoin="round"
                opacity={dim ? 0.55 : 1}
                tabIndex={0}
                role="button"
                aria-pressed={isSel}
                aria-label={`${s.name}: ${formatNumber(values[s.id] || 0)} ${unit}`}
                className="cursor-pointer outline-none transition-opacity focus-visible:stroke-[#0b0b0b] hover:brightness-95"
                {...handlers(s.id)}
              />
            );
          })}

        {/* labels sit above the fills and never take pointer events */}
        <g pointerEvents="none" fontFamily="inherit">
          {ETHIOPIA_REGION_SHAPES.filter((s) => !CITY_REGIONS.has(s.id)).map((s) => (
            <text
              key={s.id}
              x={s.cx}
              y={s.cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={12}
              fontWeight={700}
              fill="#0b0b0b"
              stroke="#ffffff"
              strokeWidth={3}
              strokeLinejoin="round"
              paintOrder="stroke"
              opacity={selected != null && selected !== s.id ? 0.6 : 1}
            >
              {SHORT_NAME[s.id] || s.name}
            </text>
          ))}
        </g>

        {ETHIOPIA_REGION_SHAPES.filter((s) => CITY_REGIONS.has(s.id)).map((s) => {
          const isSel = selected === s.id;
          const [dx, dy] = CITY_LABEL_OFFSET[s.id] || [0, 22];
          return (
            <g key={s.id} opacity={selected != null && !isSel ? 0.6 : 1}>
              <circle
                cx={s.cx}
                cy={s.cy}
                r={9}
                fill={colorFor(values[s.id] || 0, breaks)}
                stroke={isSel ? "#0b0b0b" : "#ffffff"}
                strokeWidth={isSel ? 2.5 : 2}
                pointerEvents="none"
              />
              {/* hit target larger than the mark */}
              <circle
                cx={s.cx}
                cy={s.cy}
                r={16}
                fill="transparent"
                tabIndex={0}
                role="button"
                aria-pressed={isSel}
                aria-label={`${s.name}: ${formatNumber(values[s.id] || 0)} ${unit}`}
                className="cursor-pointer outline-none"
                {...handlers(s.id)}
              />
              <text
                x={s.cx + dx}
                y={s.cy + dy}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fontWeight={700}
                fill="#0b0b0b"
                stroke="#ffffff"
                strokeWidth={3}
                strokeLinejoin="round"
                paintOrder="stroke"
                pointerEvents="none"
              >
                {s.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-gray-600">
        <span className="text-gray-400">{unit.charAt(0).toUpperCase() + unit.slice(1)}:</span>
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm" style={{ background: NO_DATA }} /> 0
        </span>
        {legend.map((l) => (
          <span key={l.label} className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm" style={{ background: l.color }} /> {l.label}
          </span>
        ))}
      </div>
      <p className="mt-1 text-[10px] text-gray-400">Boundaries: geoBoundaries / Open Africa, Code for Ethiopia (CC BY 4.0, ODbL). Approximate, not authoritative.</p>

      {hover && hovered && (
        <div
          className="pointer-events-none absolute z-10 min-w-[160px] rounded-xl border border-gray-100 bg-white p-3 shadow-lg"
          style={{
            left: Math.min(Math.max(hover.x + 14, 4), (wrapRef.current?.clientWidth || 0) - 180),
            top: Math.max(hover.y - 12, 4),
          }}
        >
          <p className="text-xs font-black text-gray-900">{hovered.name}</p>
          <p className="mt-0.5 text-sm font-black text-gray-900">
            {formatNumber(values[hovered.id] || 0)} <span className="text-[11px] font-semibold text-gray-500">{unit}</span>
          </p>
          {tooltip?.(hovered.id)}
        </div>
      )}
    </div>
  );
}
