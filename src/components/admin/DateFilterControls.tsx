import { Input } from "@/components/ui/input";
import { localDate, type DatePreset } from "@/lib/date-filters";

interface DateFilterControlsProps {
  id: string;
  label: string;
  value: DatePreset;
  from: string;
  to: string;
  onValueChange: (value: DatePreset) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

export function DateFilterControls({ id, label, value, from, to, onValueChange, onFromChange, onToChange }: DateFilterControlsProps) {
  const today = localDate(new Date());
  const labelClass = "mb-1 block text-xs font-semibold text-gray-600";
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div>
        <label htmlFor={`${id}-preset`} className={labelClass}>{label}</label>
        <select id={`${id}-preset`} value={value} onChange={(event) => onValueChange(event.target.value as DatePreset)}
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200">
          <option value="">Any date</option>
          <option value="today">Today</option>
          <option value="last7">Last 7 days</option>
          <option value="range">Date range</option>
        </select>
      </div>
      {value === "range" && (
        <>
          <div>
            <label htmlFor={`${id}-from`} className={labelClass}>From</label>
            <Input id={`${id}-from`} type="date" value={from} max={to || today} onChange={(event) => onFromChange(event.target.value)}
              className="h-10 border-gray-200 bg-white text-xs text-gray-800" />
          </div>
          <div>
            <label htmlFor={`${id}-to`} className={labelClass}>To</label>
            <Input id={`${id}-to`} type="date" value={to} min={from} max={today} onChange={(event) => onToChange(event.target.value)}
              className="h-10 border-gray-200 bg-white text-xs text-gray-800" />
          </div>
        </>
      )}
    </div>
  );
}
