"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Check, ChevronLeft, ChevronRight, Copy, Download, RefreshCw, Search, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { REGIONS } from "@/lib/constants";
import { getUserScope } from "@/lib/auth-scope";
import { dateBounds, validLocalDate, type DatePreset } from "@/lib/date-filters";
import { paymentChannel, paymentMethodLabel } from "@/lib/payment-source";
import {
  ATTENTION_LABEL,
  attentionFlag,
  currencyOf,
  formatPaid,
  isPaidRow,
  isPendingRow,
  summarizeByMethod,
  toCsv,
  type AttentionFlag,
  type PaymentRow,
} from "@/lib/reconciliation";
import { DateFilterControls } from "@/components/admin/DateFilterControls";
import { FinanceUnlock } from "@/components/admin/FinanceUnlock";
import { PageHeader, Panel, TableCard, tableClass, tdClass, thClass, theadClass, trClass } from "@/components/admin/page-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LOAD_SIZE = 200;
const ROWS_PER_PAGE = 50;

const selectClass =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:bg-gray-50 disabled:text-gray-500";
const labelClass = "mb-1 block text-xs font-semibold text-gray-600";

const regionName = (id: number) => REGIONS.find((r) => r.id === id)?.name || (id ? `Region ${id}` : "National");

function stamp(value?: string) {
  if (!value) return "—";
  const t = Date.parse(value);
  if (Number.isNaN(t)) return "—";
  return new Date(t).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function ReconciliationContent() {
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [loadedAt, setLoadedAt] = useState<Date | null>(null);

  const [search, setSearch] = useState("");
  const [method, setMethod] = useState<"" | "ARIFPAY" | "MANUAL">("");
  const [status, setStatus] = useState("");
  const [purpose, setPurpose] = useState("");
  const [currency, setCurrency] = useState("");
  const [region, setRegion] = useState("");
  const [regionLocked, setRegionLocked] = useState(false);
  const [attention, setAttention] = useState<"" | AttentionFlag>("");
  const [dateField, setDateField] = useState<"paid_at" | "created_at">("paid_at");
  const [datePreset, setDatePreset] = useState<DatePreset>("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState("");

  const load = async () => {
    setLoading(true);
    setFailed(false);
    try {
      // The API pages its results; reconciling needs every payment, so read until all are in.
      const all: PaymentRow[] = [];
      for (let p = 1; p <= 100; p++) {
        const res = await api.get("/payments", { params: { page: p, page_size: LOAD_SIZE } });
        const batch: PaymentRow[] = res.data.invoices || [];
        all.push(...batch);
        const total = Number(res.data.pagination?.total_items ?? all.length);
        if (batch.length < LOAD_SIZE || all.length >= total) break;
      }
      setRows(all);
      setLoadedAt(new Date());
    } catch (err) {
      console.error("Failed to load payments for reconciliation", err);
      setFailed(true);
      toast.error("Could not load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const scope = getUserScope();
    if (!scope.isSuperAdmin && scope.regionId) {
      setRegion(scope.regionId);
      setRegionLocked(true);
    }
    load();
  }, []);

  const bounds = datePreset ? dateBounds(datePreset, from, to) : null;
  const rangeIncomplete = datePreset === "range" && (!validLocalDate(from) || !validLocalDate(to) || from > to);

  const now = Date.now();
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const lo = bounds ? Date.parse(bounds.from) : null;
    const hi = bounds ? Date.parse(bounds.before) : null;
    return rows.filter((p) => {
      if (method && (paymentChannel(p.payment_method) === "MANUAL" ? "MANUAL" : "ARIFPAY") !== method) return false;
      if (status === "PAID" && !isPaidRow(p)) return false;
      if (status === "PENDING" && !isPendingRow(p)) return false;
      if (status === "FAILED" && p.status !== "FAILED") return false;
      if (purpose && (p.purpose || "").toUpperCase() !== purpose) return false;
      if (currency && currencyOf(p) !== currency) return false;
      if (region && String(p.region_id ?? 0) !== region) return false;
      if (attention && attentionFlag(p, now) !== attention) return false;
      if (lo !== null && hi !== null) {
        const t = Date.parse(p[dateField] || "");
        if (Number.isNaN(t) || t < lo || t >= hi) return false;
      }
      if (q) {
        const hay = [p.id, p.invoice_number, p.provider_ref, p.payer_name, p.payer_phone, p.payer_email, p.person_id, p.description]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    // `now` only matters for the attention filter; rows are re-evaluated whenever a filter changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, search, method, status, purpose, currency, region, attention, bounds?.from, bounds?.before, dateField]);

  // Reset to the first page whenever the result set changes.
  useEffect(() => setPage(1), [filtered]);

  const attentionCounts = useMemo(() => {
    const c: Record<AttentionFlag, number> = { NO_REFERENCE: 0, STUCK_PENDING: 0 };
    for (const p of rows) {
      if (region && String(p.region_id ?? 0) !== region) continue;
      const f = attentionFlag(p, now);
      if (f) c[f] += 1;
    }
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, region]);

  const currencies = useMemo(() => Array.from(new Set(rows.map(currencyOf))).sort(), [rows]);
  const summary = useMemo(() => summarizeByMethod(filtered), [filtered]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const visible = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  const filtersActive = Boolean(search || method || status || purpose || currency || attention || datePreset || (!regionLocked && region));

  const clearFilters = () => {
    setSearch("");
    setMethod("");
    setStatus("");
    setPurpose("");
    setCurrency("");
    setAttention("");
    setDatePreset("");
    setFrom("");
    setTo("");
    if (!regionLocked) setRegion("");
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 1500);
  };

  const exportCsv = () => {
    if (filtered.length === 0) {
      toast.error("Nothing to export with these filters");
      return;
    }
    const blob = new Blob([toCsv(filtered, regionName)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reconciliation_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment reconciliation"
        description={
          loading
            ? "Loading every payment on record…"
            : `${rows.length.toLocaleString()} payments on record${loadedAt ? `, loaded ${loadedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}` : ""}. Match them against ArifPay statements and the cash and bank receipts admins recorded.`
        }
        actions={
          <>
            <Link href="/admin/payments" className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-4 text-xs font-bold text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="h-3.5 w-3.5" /> Payments
            </Link>
            <Button variant="outline" onClick={load} disabled={loading} className="h-10 gap-2 rounded-xl border-gray-200 px-4 text-xs font-bold text-gray-700 hover:bg-gray-50">
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
            </Button>
            <Button onClick={exportCsv} disabled={loading || filtered.length === 0} className="h-10 gap-2 rounded-xl bg-[#ED1C24] px-5 text-xs font-bold text-white hover:bg-black">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </>
        }
      />

      {failed && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">
          <AlertTriangle className="h-4 w-4" /> Could not load payments. Check your connection and press Refresh.
        </div>
      )}

      {/* Filters */}
      <Panel>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <label htmlFor="rec-search" className={labelClass}>Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="rec-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Invoice number, transaction ID, ArifPay reference, payer, phone…"
                className="h-10 border-gray-200 pl-9 text-xs font-semibold"
              />
            </div>
          </div>
          <div>
            <label htmlFor="rec-method" className={labelClass}>Payment method</label>
            <select id="rec-method" className={selectClass} value={method} onChange={(e) => setMethod(e.target.value as typeof method)}>
              <option value="">All methods</option>
              <option value="ARIFPAY">ArifPay</option>
              <option value="MANUAL">Manually collected</option>
            </select>
          </div>
          <div>
            <label htmlFor="rec-status" className={labelClass}>Status</label>
            <select id="rec-status" className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
          <div>
            <label htmlFor="rec-purpose" className={labelClass}>Purpose</label>
            <select id="rec-purpose" className={selectClass} value={purpose} onChange={(e) => setPurpose(e.target.value)}>
              <option value="">Membership and donations</option>
              <option value="MEMBERSHIP">Membership</option>
              <option value="DONATION">Donation</option>
            </select>
          </div>
          <div>
            <label htmlFor="rec-currency" className={labelClass}>Currency</label>
            <select id="rec-currency" className={selectClass} value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="">All currencies</option>
              {currencies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rec-region" className={labelClass}>Region</label>
            <select id="rec-region" className={selectClass} value={region} disabled={regionLocked} onChange={(e) => setRegion(e.target.value)}>
              <option value="">All regions</option>
              <option value="0">National / general</option>
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rec-datefield" className={labelClass}>Date to filter on</label>
            <select id="rec-datefield" className={selectClass} value={dateField} onChange={(e) => setDateField(e.target.value as typeof dateField)}>
              <option value="paid_at">Date paid</option>
              <option value="created_at">Date created</option>
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <DateFilterControls id="rec-date" label="Period" value={datePreset} from={from} to={to} onValueChange={setDatePreset} onFromChange={setFrom} onToChange={setTo} />
            {rangeIncomplete && <p className="mt-1 text-xs font-semibold text-amber-700">Pick a start and an end date to apply the range.</p>}
          </div>
        </div>
        {filtersActive && (
          <div className="mt-3 flex justify-end">
            <button onClick={clearFilters} className="inline-flex items-center gap-1 text-xs font-bold text-[#B5121B] hover:underline">
              <X className="h-3 w-3" /> Clear filters
            </button>
          </div>
        )}
      </Panel>

      {/* Totals for what is on screen */}
      <TableCard
        title="Totals for the current filters"
        description="Paid money is summed per currency; ETB and USD are never added together."
      >
        <table className={tableClass}>
          <thead className={theadClass}>
            <tr>
              <th className={thClass}>Method</th>
              <th className={cn(thClass, "text-right")}>Paid payments</th>
              <th className={cn(thClass, "text-right")}>Paid amount</th>
              <th className={cn(thClass, "text-right")}>Pending</th>
              <th className={cn(thClass, "text-right")}>Failed</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((s) => (
              <tr key={s.channel} className={trClass}>
                <td className={cn(tdClass, "font-bold text-gray-900")}>{s.channel === "MANUAL" ? "Manually collected" : "ArifPay"}</td>
                <td className={cn(tdClass, "text-right tabular-nums")}>{loading ? "…" : s.paidCount.toLocaleString()}</td>
                <td className={cn(tdClass, "text-right font-bold tabular-nums text-gray-900")}>{loading ? "…" : formatPaid(s.paid)}</td>
                <td className={cn(tdClass, "text-right tabular-nums")}>{loading ? "…" : s.pendingCount.toLocaleString()}</td>
                <td className={cn(tdClass, "text-right tabular-nums")}>{loading ? "…" : s.failedCount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {/* What to look at first */}
      {!loading && (attentionCounts.NO_REFERENCE > 0 || attentionCounts.STUCK_PENDING > 0) && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700" />
          <span className="text-xs font-bold text-amber-900">Needs a look:</span>
          {(Object.keys(attentionCounts) as AttentionFlag[])
            .filter((f) => attentionCounts[f] > 0)
            .map((f) => (
              <button
                key={f}
                onClick={() => setAttention(attention === f ? "" : f)}
                className={cn(
                  "rounded-lg border px-3 py-1 text-xs font-bold transition-colors",
                  attention === f ? "border-amber-700 bg-amber-700 text-white" : "border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
                )}
              >
                {ATTENTION_LABEL[f]} · {attentionCounts[f].toLocaleString()}
              </button>
            ))}
        </div>
      )}

      {/* Every payment */}
      <TableCard
        title="All payments"
        description={loading ? undefined : `${filtered.length.toLocaleString()} of ${rows.length.toLocaleString()} payments${filtersActive ? " match the filters" : ""}`}
        footer={
          filtered.length > ROWS_PER_PAGE ? (
            <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
              <span>
                {((page - 1) * ROWS_PER_PAGE + 1).toLocaleString()}–{Math.min(page * ROWS_PER_PAGE, filtered.length).toLocaleString()} of {filtered.length.toLocaleString()}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Previous page" className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-2 tabular-nums">Page {page} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)} aria-label="Next page" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : undefined
        }
      >
        <table className={tableClass}>
          <thead className={theadClass}>
            <tr>
              <th className={thClass}>Invoice</th>
              <th className={thClass}>ArifPay reference</th>
              <th className={thClass}>Payer</th>
              <th className={thClass}>Region</th>
              <th className={thClass}>Purpose</th>
              <th className={thClass}>Method</th>
              <th className={thClass}>Status</th>
              <th className={cn(thClass, "text-right")}>Amount</th>
              <th className={thClass}>Created</th>
              <th className={thClass}>Paid</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} className="h-40 text-center text-sm text-gray-400">Loading…</td></tr>
            ) : visible.length === 0 ? (
              <tr><td colSpan={10} className="h-40 text-center text-sm text-gray-400">{rows.length === 0 ? "No payments on record yet." : "No payments match these filters."}</td></tr>
            ) : (
              visible.map((p) => {
                const flag = attentionFlag(p, now);
                const manual = paymentChannel(p.payment_method) === "MANUAL";
                return (
                  <tr key={p.id} className={trClass}>
                    <td className={tdClass}>
                      <span className="block text-xs font-bold text-gray-900">{p.invoice_number || "No number"}</span>
                      <button onClick={() => copy(p.id)} title="Copy transaction ID" className="mt-0.5 inline-flex items-center gap-1 font-mono text-[10px] text-gray-400 hover:text-gray-900">
                        {p.id.slice(0, 8)}… {copied === p.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </td>
                    <td className={tdClass}>
                      {p.provider_ref ? (
                        <button onClick={() => copy(p.provider_ref!)} title="Copy ArifPay reference" className="inline-flex items-center gap-1 font-mono text-[11px] text-gray-700 hover:text-black">
                          {p.provider_ref} {copied === p.provider_ref ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-gray-400" />}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-300">{manual ? "Not applicable" : "—"}</span>
                      )}
                    </td>
                    <td className={tdClass}>
                      <span className="block max-w-[200px] truncate text-xs font-bold text-gray-900">{p.payer_name || "Name not recorded"}</span>
                      <span className="block max-w-[200px] truncate text-[11px] text-gray-500">{p.payer_phone || p.payer_email || "No contact"}</span>
                    </td>
                    <td className={cn(tdClass, "whitespace-nowrap text-xs")}>{regionName(p.region_id ?? 0)}</td>
                    <td className={cn(tdClass, "text-xs")}>{p.purpose || p.description || "—"}</td>
                    <td className={tdClass}>
                      <span
                        className={cn(
                          "inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider",
                          manual ? "border-amber-200 bg-amber-50 text-amber-700" : "border-blue-200 bg-blue-50 text-blue-700"
                        )}
                      >
                        {paymentMethodLabel(p.payment_method)}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest",
                          isPaidRow(p) ? "border-green-200 bg-green-50 text-green-700" : p.status === "FAILED" ? "border-red-200 bg-red-50 text-red-600" : "border-yellow-200 bg-yellow-50 text-yellow-700"
                        )}
                      >
                        {p.status}
                      </span>
                      {flag && (
                        <span className="mt-1 flex items-center gap-1 text-[10px] font-bold text-amber-700">
                          <AlertTriangle className="h-3 w-3" /> {ATTENTION_LABEL[flag]}
                        </span>
                      )}
                    </td>
                    <td className={cn(tdClass, "whitespace-nowrap text-right font-bold tabular-nums text-gray-900")}>
                      {Number(p.amount).toLocaleString()} <span className="text-[10px] font-bold text-gray-400">{currencyOf(p)}</span>
                    </td>
                    <td className={cn(tdClass, "whitespace-nowrap text-xs text-gray-500")}>{stamp(p.created_at)}</td>
                    <td className={cn(tdClass, "whitespace-nowrap text-xs text-gray-500")}>{stamp(p.paid_at)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}

export default function ReconciliationPage() {
  return (
    <FinanceUnlock>
      <ReconciliationContent />
    </FinanceUnlock>
  );
}
