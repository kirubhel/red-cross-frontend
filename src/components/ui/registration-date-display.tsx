"use client";

import React, { useMemo } from "react";
import { CalendarCheck, ShieldCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface RegistrationDateDisplayProps {
  label?: string;
  dateStr?: string;
  className?: string;
}

export default function RegistrationDateDisplay({
  label = "Registration Date",
  dateStr,
  className,
}: RegistrationDateDisplayProps) {
  const displayFormatted = useMemo(() => {
    const d = dateStr ? new Date(dateStr) : new Date();
    if (isNaN(d.getTime())) return dateStr || "Today";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  }, [dateStr]);

  const isoDate = useMemo(() => {
    return dateStr || new Date().toISOString().split("T")[0];
  }, [dateStr]);

  return (
    <div className={cn("space-y-1 group md:col-span-1", className)}>
      <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1">
        {label}
      </Label>
      <div className="flex h-10 w-full items-center justify-between rounded-lg bg-gray-50/80 border border-gray-100 px-4 text-xs font-bold text-black select-none gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <CalendarCheck className="h-4 w-4 text-[#ED1C24] shrink-0" />
          <span className="truncate">{displayFormatted}</span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 border border-green-200/60 text-[8px] font-black text-green-700 tracking-wider uppercase shrink-0">
          <ShieldCheck className="h-3 w-3 text-green-600" />
          <span>Auto-captured</span>
        </div>
      </div>
      <p className="text-[9px] text-black/40 font-medium px-1">
        Captured automatically by the system upon registration.
      </p>
    </div>
  );
}
