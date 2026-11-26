"use client";

import React, { useId, useMemo, useRef, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ETHIOPIAN_MONTHS,
  ethiopianToGregorian,
  getDaysInEthiopianMonth,
  gregorianToEthiopian,
} from "@/lib/ethiopian-calendar";

interface DateOfBirthPickerProps {
  id?: string;
  value?: string;
  onChange: (dateStr: string) => void;
  required?: boolean;
  disabled?: boolean;
  minAge?: number;
  maxAge?: number;
  className?: string;
}

const MONTHS = [
  { value: "01", label: "01 - January" },
  { value: "02", label: "02 - February" },
  { value: "03", label: "03 - March" },
  { value: "04", label: "04 - April" },
  { value: "05", label: "05 - May" },
  { value: "06", label: "06 - June" },
  { value: "07", label: "07 - July" },
  { value: "08", label: "08 - August" },
  { value: "09", label: "09 - September" },
  { value: "10", label: "10 - October" },
  { value: "11", label: "11 - November" },
  { value: "12", label: "12 - December" },
];

export default function DateOfBirthPicker({
  id,
  value = "",
  onChange,
  required = false,
  disabled = false,
  minAge = 0,
  maxAge = 110,
  className,
}: DateOfBirthPickerProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [calendarMode, setCalendarMode] = useState<"GC" | "EC">("GC");

  // Parse existing value (format expected: YYYY-MM-DD or DD/MM/YYYY)
  const { currentYear, currentMonth, currentDay } = useMemo(() => {
    if (!value) return { currentYear: "", currentMonth: "", currentDay: "" };
    if (value.includes("-")) {
      const [y, m, d] = value.split("-");
      return {
        currentYear: y || "",
        currentMonth: m ? m.padStart(2, "0") : "",
        currentDay: d ? d.padStart(2, "0") : "",
      };
    }
    if (value.includes("/")) {
      const [d, m, y] = value.split("/");
      return {
        currentYear: y || "",
        currentMonth: m ? m.padStart(2, "0") : "",
        currentDay: d ? d.padStart(2, "0") : "",
      };
    }
    return { currentYear: "", currentMonth: "", currentDay: "" };
  }, [value]);

  const ecEquivalent = useMemo(() => {
    if (!currentYear || !currentMonth || !currentDay) return null;
    return gregorianToEthiopian(`${currentYear}-${currentMonth}-${currentDay}`);
  }, [currentYear, currentMonth, currentDay]);

  const currentEcYear = (new Date().getFullYear() - 7) - minAge;
  const minEcYear = (new Date().getFullYear() - 8) - maxAge;
  const ecYears = useMemo(() => {
    const list: number[] = [];
    for (let y = currentEcYear; y >= minEcYear; y--) list.push(y);
    return list;
  }, [currentEcYear, minEcYear]);

  const [ecDraft, setEcDraft] = useState<{ y: string; m: string; d: string }>({ y: "", m: "", d: "" });
  const activeEcYear = ecEquivalent ? String(ecEquivalent.year) : ecDraft.y;
  const activeEcMonth = ecEquivalent ? String(ecEquivalent.month) : ecDraft.m;
  const activeEcDay = ecEquivalent ? String(ecEquivalent.day) : ecDraft.d;

  const handleEcChange = (yStr: string, mStr: string, dStr: string) => {
    setEcDraft({ y: yStr, m: mStr, d: dStr });
    const y = parseInt(yStr, 10);
    const m = parseInt(mStr, 10);
    const d = parseInt(dStr, 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      const maxD = getDaysInEthiopianMonth(y, m);
      onChange(ethiopianToGregorian({ year: y, month: m, day: Math.min(d, maxD) }));
    } else if (!yStr && !mStr && !dStr) {
      onChange("");
    }
  };

  const currentGregorianYear = new Date().getFullYear();
  const maxYear = currentGregorianYear - minAge;
  const minYear = currentGregorianYear - maxAge;

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      list.push(y);
    }
    return list;
  }, [maxYear, minYear]);

  // Calculate days in selected month and year
  const daysInMonth = useMemo(() => {
    if (!currentMonth) return 31;
    const m = parseInt(currentMonth, 10);
    const y = currentYear ? parseInt(currentYear, 10) : 2024;
    return new Date(y, m, 0).getDate();
  }, [currentMonth, currentYear]);

  const days = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      return dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    });
  }, [daysInMonth]);

  const handleYearChange = (newYear: string) => {
    emitChange(newYear, currentMonth, currentDay);
  };

  const handleMonthChange = (newMonth: string) => {
    emitChange(currentYear, newMonth, currentDay);
  };

  const handleDayChange = (newDay: string) => {
    emitChange(currentYear, currentMonth, newDay);
  };

  const handleNativePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const emitChange = (y: string, m: string, d: string) => {
    if (!y && !m && !d) {
      onChange("");
      return;
    }
    const maxDays = m ? new Date(parseInt(y || "2024", 10), parseInt(m, 10), 0).getDate() : 31;
    let validDay = d;
    if (d && parseInt(d, 10) > maxDays) {
      validDay = maxDays < 10 ? `0${maxDays}` : `${maxDays}`;
    }
    if (y && m && validDay) {
      onChange(`${y}-${m}-${validDay}`);
    } else {
      onChange(`${y || ""}-${m || ""}-${validDay || ""}`);
    }
  };

  const dateInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex rounded-md bg-gray-100 p-0.5 text-[10px] font-black">
          <button
            type="button"
            onClick={() => setCalendarMode("GC")}
            className={cn(
              "px-2 py-0.5 rounded transition-colors",
              calendarMode === "GC" ? "bg-white text-black shadow-xs" : "text-gray-500 hover:text-black"
            )}
          >
            Gregorian (GC)
          </button>
          <button
            type="button"
            onClick={() => setCalendarMode("EC")}
            className={cn(
              "px-2 py-0.5 rounded transition-colors",
              calendarMode === "EC" ? "bg-white text-[#ED1C24] shadow-xs" : "text-gray-500 hover:text-black"
            )}
          >
            Ethiopian (EC)
          </button>
        </div>
        {ecEquivalent && calendarMode === "GC" && (
          <span className="text-[10px] font-bold text-gray-500 truncate">
            EC: {ecEquivalent.day} {ETHIOPIAN_MONTHS[ecEquivalent.month - 1]?.nameEn} {ecEquivalent.year}
          </span>
        )}
        {value && calendarMode === "EC" && currentYear && currentMonth && currentDay && (
          <span className="text-[10px] font-bold text-gray-500 truncate">
            GC: {currentYear}-{currentMonth}-{currentDay}
          </span>
        )}
      </div>

      {calendarMode === "EC" ? (
        <div className="grid grid-cols-3 gap-2">
          <select
            aria-label="Ethiopian Day"
            value={activeEcDay}
            disabled={disabled}
            required={required}
            onChange={(e) => handleEcChange(activeEcYear, activeEcMonth, e.target.value)}
            className="flex h-10 w-full rounded-lg bg-gray-50 border border-transparent px-3 py-2 text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/20"
          >
            <option value="">Day</option>
            {Array.from(
              { length: activeEcYear && activeEcMonth ? getDaysInEthiopianMonth(parseInt(activeEcYear, 10), parseInt(activeEcMonth, 10)) : 30 },
              (_, i) => String(i + 1)
            ).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            aria-label="Ethiopian Month"
            value={activeEcMonth}
            disabled={disabled}
            required={required}
            onChange={(e) => handleEcChange(activeEcYear, e.target.value, activeEcDay)}
            className="flex h-10 w-full rounded-lg bg-gray-50 border border-transparent px-3 py-2 text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/20"
          >
            <option value="">Month</option>
            {ETHIOPIAN_MONTHS.map((m) => (
              <option key={m.number} value={String(m.number)}>{m.number} - {m.nameEn}</option>
            ))}
          </select>
          <select
            aria-label="Ethiopian Year"
            value={activeEcYear}
            disabled={disabled}
            required={required}
            onChange={(e) => handleEcChange(e.target.value, activeEcMonth, activeEcDay)}
            className="flex h-10 w-full rounded-lg bg-gray-50 border border-transparent px-3 py-2 text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/20"
          >
            <option value="">Year (EC)</option>
            {ecYears.map((y) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </select>
        </div>
      ) : (
      <>
      <div className="grid grid-cols-3 gap-2">
        {/* Day Select */}
        <div className="relative">
          <select
            id={`${inputId}-day`}
            value={currentDay}
            disabled={disabled}
            required={required}
            onChange={(e) => handleDayChange(e.target.value)}
            className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-3 py-2 text-xs font-bold text-black focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none cursor-pointer disabled:opacity-50"
          >
            <option value="">Day</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-black/30 uppercase">
            Day
          </span>
        </div>

        {/* Month Select */}
        <div className="relative">
          <select
            id={`${inputId}-month`}
            value={currentMonth}
            disabled={disabled}
            required={required}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-3 py-2 text-xs font-bold text-black focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none cursor-pointer disabled:opacity-50"
          >
            <option value="">Month</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-black/30 uppercase">
            Mo
          </span>
        </div>

        {/* Year Select */}
        <div className="relative">
          <select
            id={`${inputId}-year`}
            value={currentYear}
            disabled={disabled}
            required={required}
            onChange={(e) => handleYearChange(e.target.value)}
            className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-3 py-2 text-xs font-bold text-black focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none cursor-pointer disabled:opacity-50"
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-black/30 uppercase">
            Yr
          </span>
        </div>
      </div>

      {/* Helper & Graphical Calendar trigger */}
      <div className="flex items-center justify-between px-1 text-[10px] text-black/50">
        <span className="flex items-center gap-1 font-semibold text-black/40">
          <CalendarIcon className="h-3 w-3 text-[#ED1C24]" />
          Select Day, Month &amp; Year
        </span>
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              if (dateInputRef.current) {
                if (typeof dateInputRef.current.showPicker === "function") {
                  dateInputRef.current.showPicker();
                } else {
                  dateInputRef.current.focus();
                }
              }
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 hover:bg-red-100 text-[#ED1C24] font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <CalendarIcon className="h-3 w-3" />
            <span>Open Calendar</span>
          </button>
          <input
            ref={dateInputRef}
            type="date"
            value={value && value.length === 10 && !value.includes("--") ? value : ""}
            onChange={handleNativePicker}
            max={`${maxYear}-12-31`}
            min={`${minYear}-01-01`}
            className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
            tabIndex={-1}
            aria-label="Pick date from calendar"
          />
        </div>
      </div>
      </>
      )}
    </div>
  );
}
