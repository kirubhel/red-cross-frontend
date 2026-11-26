export type DatePreset = "" | "today" | "last7" | "range";

export function localDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function validLocalDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  return localDate(new Date(year, month - 1, day)) === value;
}

export function dateBounds(filter: DatePreset, from: string, to: string) {
  if (!filter) return null;
  const today = new Date();
  let start: Date;
  let end: Date;
  if (filter === "range") {
    if (!validLocalDate(from) || !validLocalDate(to) || from > to) return null;
    const [fromYear, fromMonth, fromDay] = from.split("-").map(Number);
    const [toYear, toMonth, toDay] = to.split("-").map(Number);
    start = new Date(fromYear, fromMonth - 1, fromDay);
    end = new Date(toYear, toMonth - 1, toDay + 1);
  } else {
    start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (filter === "last7") start.setDate(start.getDate() - 6);
    end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  }
  return { from: start.toISOString(), before: end.toISOString() };
}
