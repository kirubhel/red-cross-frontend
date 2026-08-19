"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import {
  ETHIOPIAN_MONTHS,
  EthiopianDate,
  parseEthiopianDate,
  formatEthiopianDate,
  getDaysInEthiopianMonth,
  getEthiopianDateLabel,
  isEthiopianLeapYear,
} from "@/lib/ethiopian-calendar";

interface EthiopianDatePickerProps {
  id?: string;
  name?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minYear?: number;
  maxYear?: number;
}

export function EthiopianDatePicker({
  id,
  name,
  value = "",
  onChange,
  placeholder = "DD/MM/YYYY (Ethiopian Calendar)",
  className = "",
  disabled = false,
  minYear = 1920,
  maxYear = 2018,
}: EthiopianDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parsed active date or default view (e.g. Year 1995, Month 1)
  const parsed = parseEthiopianDate(value);
  const [selectedYear, setSelectedYear] = useState<number>(parsed?.year || 1995);
  const [selectedMonth, setSelectedMonth] = useState<number>(parsed?.month || 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(parsed?.day || null);

  // Sync internal state when prop value changes
  useEffect(() => {
    const p = parseEthiopianDate(value);
    if (p) {
      setSelectedYear(p.year);
      setSelectedMonth(p.month);
      setSelectedDay(p.day);
    } else if (!value) {
      setSelectedDay(null);
    }
  }, [value]);

  // Handle outside clicks to close popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const currentMonthObj = ETHIOPIAN_MONTHS[selectedMonth - 1] || ETHIOPIAN_MONTHS[0];
  const daysInCurrentMonth = getDaysInEthiopianMonth(selectedYear, selectedMonth);

  // Generate years list
  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y);
  }

  const handleSelectDay = (day: number) => {
    const newDate: EthiopianDate = {
      year: selectedYear,
      month: selectedMonth,
      day,
    };
    setSelectedDay(day);
    const formatted = formatEthiopianDate(newDate);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDay(null);
    onChange("");
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedMonth > 1) {
      setSelectedMonth(selectedMonth - 1);
    } else if (selectedYear > minYear) {
      setSelectedYear(selectedYear - 1);
      setSelectedMonth(13);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedMonth < 13) {
      setSelectedMonth(selectedMonth + 1);
    } else if (selectedYear < maxYear) {
      setSelectedYear(selectedYear + 1);
      setSelectedMonth(1);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input for standard form serialization */}
      <input type="hidden" id={id} name={name} value={value} />

      {/* Trigger Button */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between h-10 w-full rounded-lg bg-gray-50 border border-transparent font-bold text-xs text-black px-4 cursor-pointer transition-all hover:bg-gray-100/80 focus-within:ring-2 focus-within:ring-[#ED1C24]/10 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <CalendarIcon className="w-3.5 h-3.5 text-[#ED1C24] shrink-0" />
          {value && parsed ? (
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-black font-extrabold">{value}</span>
              <span className="text-[10px] text-gray-500 font-semibold truncate hidden sm:inline">
                ({getEthiopianDateLabel(parsed)})
              </span>
            </div>
          ) : (
            <span className="text-gray-400 font-medium truncate">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-200/50"
              title="Clear date"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Popover Calendar Modal */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 left-0 w-full sm:w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Controls: Month & Year Selectors */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {/* Month Dropdown */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-gray-50 text-xs font-bold text-gray-900 rounded-lg px-2.5 py-1.5 border border-gray-200 outline-none focus:ring-2 focus:ring-[#ED1C24]/20 cursor-pointer"
              >
                {ETHIOPIAN_MONTHS.map((m) => (
                  <option key={m.number} value={m.number}>
                    {m.number}. {m.nameEn} ({m.nameAm})
                  </option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-gray-50 text-xs font-bold text-gray-900 rounded-lg px-2.5 py-1.5 border border-gray-200 outline-none focus:ring-2 focus:ring-[#ED1C24]/20 cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y} EC
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Month Indicator & Leap year tag */}
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[11px] font-bold text-[#ED1C24]">
              {currentMonthObj.nameEn} · {currentMonthObj.nameAm}
            </span>
            {selectedMonth === 13 && (
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                {isEthiopianLeapYear(selectedYear) ? "Leap Year (6 Days)" : "5 Days"}
              </span>
            )}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((day) => {
              const isSelected =
                parsed &&
                parsed.year === selectedYear &&
                parsed.month === selectedMonth &&
                parsed.day === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                    isSelected
                      ? "bg-[#ED1C24] text-white shadow-md shadow-red-500/20 scale-105"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer with preview */}
          {selectedDay && (
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px]">
              <span className="text-gray-500 font-medium">Selected Date:</span>
              <span className="font-extrabold text-gray-800">
                {String(selectedDay).padStart(2, "0")}/{String(selectedMonth).padStart(2, "0")}/
                {selectedYear} EC
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default EthiopianDatePicker;
