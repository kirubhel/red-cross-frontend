"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, Clock, CheckCircle2, XCircle, Download, 
  RefreshCw, Trophy, MapPin, TrendingUp, Building2, Filter, 
  Copy, Check, ArrowUpDown, ChevronRight, X
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { REGIONS } from "@/lib/constants";
import { getUserScope, type UserScope } from "@/lib/auth-scope";

import { PageHeader } from "@/components/admin/page-ui";
import { StatTile } from "@/components/admin/analytics/widgets";
import { FinanceUnlock } from "@/components/admin/FinanceUnlock";
type Payment = {
  id: string;
  invoice_number?: string;
  person_id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  payment_method?: string;
  payer_name?: string;
  payer_phone?: string;
  payer_email?: string;
  region_id?: number;
  purpose?: string;
  created_at: string;
  paid_at?: string;
  due_date?: string;
};

const isPaid = (p: Payment) => p.status === "PAID" || p.status === "SUCCESS";
const isPending = (p: Payment) => p.status === "PENDING" || p.status === "UNPAID";
const cur = (p: Payment) => (p.currency || "ETB").toUpperCase();

/** Sum amounts per currency so ETB and USD are never added together. */
function sumByCurrency(list: Payment[]) {
  const out: Record<string, number> = {};
  for (const p of list) out[cur(p)] = (out[cur(p)] || 0) + (Number(p.amount) || 0);
  return out;
}
function formatTotals(t: Record<string, number>) {
  const keys = Object.keys(t).sort((a, b) => (a === "ETB" ? -1 : b === "ETB" ? 1 : a.localeCompare(b)));
  if (keys.length === 0) return "0 ETB";
  return keys.map((k) => `${Math.round(t[k]).toLocaleString()} ${k}`).join(" + ");
}
const PAGE_SIZE = 200;

interface RegionMeta {
  id: number;
  name: string;
  code: string;
  badgeColor: string;
}

const REGION_LOOKUP: Record<number, RegionMeta> = {
  0: { id: 0, name: "National / General", code: "NAT", badgeColor: "bg-gray-100 text-gray-700 border-gray-200" },
  1: { id: 1, name: "Addis Ababa", code: "AA", badgeColor: "bg-blue-50 text-blue-700 border-blue-200" },
  2: { id: 2, name: "Dire Dawa", code: "DD", badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  3: { id: 3, name: "Tigray", code: "TG", badgeColor: "bg-amber-50 text-amber-700 border-amber-200" },
  4: { id: 4, name: "Afar", code: "AF", badgeColor: "bg-orange-50 text-orange-700 border-orange-200" },
  5: { id: 5, name: "Amhara", code: "AM", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  6: { id: 6, name: "Oromia", code: "OR", badgeColor: "bg-red-50 text-[#ED1C24] border-red-200" },
  7: { id: 7, name: "Somali", code: "SM", badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  8: { id: 8, name: "Benishangul Gumz", code: "BG", badgeColor: "bg-teal-50 text-teal-700 border-teal-200" },
  9: { id: 9, name: "Central Ethiopia", code: "CE", badgeColor: "bg-purple-50 text-purple-700 border-purple-200" },
  10: { id: 10, name: "Gambela", code: "GM", badgeColor: "bg-lime-50 text-lime-700 border-lime-200" },
  11: { id: 11, name: "Harari", code: "HR", badgeColor: "bg-rose-50 text-rose-700 border-rose-200" },
  12: { id: 12, name: "Sidama", code: "SD", badgeColor: "bg-sky-50 text-sky-700 border-sky-200" },
  13: { id: 13, name: "South West Ethiopia", code: "SW", badgeColor: "bg-violet-50 text-violet-700 border-violet-200" },
  14: { id: 14, name: "South Ethiopia", code: "SE", badgeColor: "bg-pink-50 text-pink-700 border-pink-200" },
};

function PaymentsContent() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userScope, setUserScope] = useState<UserScope | null>(null);
  const [loadedAt, setLoadedAt] = useState<Date | null>(null);

  useEffect(() => {
    const scope = getUserScope();
    setUserScope(scope);
    if (!scope.isSuperAdmin && scope.regionId) {
      setSelectedRegion(Number(scope.regionId));
    }
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // The API pages its results (50 by default). Totals are only real if every invoice is
      // counted, so keep reading until we have them all.
      const all: Payment[] = [];
      let page = 1;
      let totalItems = 0;
      for (;;) {
        const res = await api.get("/payments", { params: { page, page_size: PAGE_SIZE } });
        const batch: Payment[] = res.data.invoices || [];
        all.push(...batch);
        totalItems = Number(res.data.pagination?.total_items ?? all.length);
        if (batch.length < PAGE_SIZE || all.length >= totalItems || page >= 100) break;
        page += 1;
      }
      setPayments(all);
      setLoadedAt(new Date());
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Regional revenue calculations
  const regionalStats = useMemo(() => {
    const map = new Map<number, { id: number; name: string; code: string; totalAmount: number; count: number; paidCount: number }>();

    // Initialize all 14 regions + National
    for (const r of [0, ...REGIONS.map(reg => reg.id)]) {
      const meta = REGION_LOOKUP[r] || { id: r, name: `Region ${r}`, code: `R${r}`, badgeColor: "bg-gray-50 text-gray-700 border-gray-200" };
      map.set(r, {
        id: r,
        name: meta.name,
        code: meta.code,
        totalAmount: 0,
        count: 0,
        paidCount: 0,
      });
    }

    payments.forEach((p) => {
      const rId = p.region_id ?? 0;
      const entry = map.get(rId) || {
        id: rId,
        name: REGION_LOOKUP[rId]?.name || `Region ${rId}`,
        code: REGION_LOOKUP[rId]?.code || `R${rId}`,
        totalAmount: 0,
        count: 0,
        paidCount: 0,
      };

      entry.count += 1;
      if (isPaid(p)) {
        entry.paidCount += 1;
        // The leaderboard ranks in birr; other currencies are shown in the totals card.
        if (cur(p) === "ETB") entry.totalAmount += Number(p.amount) || 0;
      }
      map.set(rId, entry);
    });

    // Return sorted descending by total revenue
    return Array.from(map.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [payments]);

  // Overall Financial KPIs
  const kpiData = useMemo(() => {
    const paid = payments.filter(isPaid);
    const pending = payments.filter(isPending);
    const failed = payments.filter((p) => p.status === "FAILED");
    const paidTotals = sumByCurrency(paid);
    const etbPaid = paid.filter((p) => cur(p) === "ETB");

    const activeRegions = regionalStats.filter((r) => r.id !== 0 && r.totalAmount > 0);
    const topRegion = activeRegions.length > 0 ? activeRegions[0] : null;
    const avgAmount = etbPaid.length > 0 ? Math.round(paidTotals.ETB / etbPaid.length) : 0;

    return {
      paidTotals,
      paidCount: paid.length,
      totalCount: payments.length,
      pendingTotals: sumByCurrency(pending),
      pendingCount: pending.length,
      failedCount: failed.length,
      activeRegionsCount: activeRegions.length,
      topRegion,
      avgAmount,
    };
  }, [payments, regionalStats]);

  // Filtered Payments List
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      // Region filter
      if (selectedRegion !== null && (p.region_id ?? 0) !== selectedRegion) {
        return false;
      }

      // Status filter
      if (statusFilter !== "ALL") {
        if (statusFilter === "PAID" && !isPaid(p)) return false;
        if (statusFilter === "PENDING" && !isPending(p)) return false;
        if (statusFilter === "FAILED" && p.status !== "FAILED") return false;
      }

      // Search term
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesId = p.id.toLowerCase().includes(query);
        const matchesInvoiceNum = (p.invoice_number || "").toLowerCase().includes(query);
        const matchesName = (p.payer_name || "").toLowerCase().includes(query);
        const matchesEmail = (p.payer_email || "").toLowerCase().includes(query);
        const matchesPhone = (p.payer_phone || "").toLowerCase().includes(query);
        const matchesDesc = (p.description || "").toLowerCase().includes(query);
        const matchesPerson = (p.person_id || "").toLowerCase().includes(query);
        return matchesId || matchesInvoiceNum || matchesName || matchesEmail || matchesPhone || matchesDesc || matchesPerson;
      }

      return true;
    });
  }, [payments, selectedRegion, statusFilter, search]);

  const handleExport = async () => {
    if (filteredPayments.length === 0) {
      toast.error("No payment records available to export");
      return;
    }
    try {
      toast.loading("Exporting financial report...", { id: "payment-export" });
      const { exportFinancialReport } = await import("@/lib/report-export");

      const enrichedRecords = filteredPayments.map(p => ({
        ...p,
        region_name: REGION_LOOKUP[p.region_id ?? 0]?.name || "National",
      }));

      await exportFinancialReport(enrichedRecords, "xlsx");
      toast.success("Financial report downloaded successfully", { id: "payment-export" });
    } catch (err) {
      console.error("Failed to export payments:", err);
      toast.error("Failed to export financial report", { id: "payment-export" });
    }
  };

  const maxRegionalAmount = regionalStats[0]?.totalAmount || 1;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <PageHeader
        title="Payments"
        description={
          loading
            ? "Loading every payment on record…"
            : `${kpiData.totalCount.toLocaleString()} payments on record${loadedAt ? `, loaded ${loadedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}` : ""}. Totals count every payment, not just the visible page.`
        }
        actions={
          <>
          <Button
            variant="outline"
            onClick={fetchPayments}
            disabled={loading}
            className="h-10 px-4 rounded-xl border-gray-200 text-gray-700 font-bold hover:bg-gray-50 flex items-center gap-2 text-xs"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
          </Button>
          <Button 
            onClick={handleExport}
            className="bg-[#ED1C24] hover:bg-black text-white rounded-xl h-10 px-5 font-bold transition-colors flex items-center gap-2 text-xs cursor-pointer"
          >
            <Download className="h-4 w-4" /> Export Report
          </Button>
        
          </>
        }
      />

      {/* Headline numbers, counted from every payment */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Revenue collected" value={loading ? "…" : formatTotals(kpiData.paidTotals)} icon={TrendingUp} hint={`${kpiData.paidCount.toLocaleString()} of ${kpiData.totalCount.toLocaleString()} payments completed`} />
        <StatTile label="Top region" value={loading ? "…" : kpiData.topRegion ? kpiData.topRegion.name : "None yet"} icon={Trophy} hint={kpiData.topRegion ? `${kpiData.topRegion.totalAmount.toLocaleString()} ETB collected` : "No paid regional payments"} />
        <StatTile label="Pending" value={loading ? "…" : formatTotals(kpiData.pendingTotals)} icon={Clock} hint={`${kpiData.pendingCount.toLocaleString()} unpaid or awaiting confirmation${kpiData.failedCount ? `, ${kpiData.failedCount.toLocaleString()} failed` : ""}`} />
        <StatTile label="Regions contributing" value={loading ? "…" : `${kpiData.activeRegionsCount} of 14`} icon={Building2} hint={`Average payment ${kpiData.avgAmount.toLocaleString()} ETB`} />
      </div>

      {/* Revenue by region Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#ED1C24]" />
              <h2 className="text-base font-bold tracking-tight text-gray-900">
                Revenue by region
              </h2>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Paid birr per region. Select a region to filter the payments list below.
            </p>
          </div>
          {selectedRegion !== null && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRegion(null)}
              className="text-xs font-bold text-[#ED1C24] hover:bg-red-50 rounded-xl h-8 px-3"
            >
              <X className="h-3.5 w-3.5 mr-1" /> Reset Region Filter
            </Button>
          )}
        </div>

        {/* Region Cards Horizontal Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {regionalStats.map((r, idx) => {
            const isSelected = selectedRegion === r.id;
            const percentage = maxRegionalAmount > 0 ? Math.round((r.totalAmount / maxRegionalAmount) * 100) : 0;
            const meta = REGION_LOOKUP[r.id] || { id: r.id, name: r.name, code: r.code, badgeColor: "bg-gray-50 text-gray-700 border-gray-200" };

            return (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(isSelected ? null : r.id)}
                className={cn(
                  "p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between group",
                  isSelected 
                    ? "border-[#ED1C24] bg-red-50/40 ring-2 ring-[#ED1C24]/10 shadow-sm"
                    : "border-gray-100 hover:border-gray-300 hover:bg-gray-50/60"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "text-[9px] font-black px-1.5 py-0.5 rounded-md border tracking-wider",
                    meta.badgeColor
                  )}>
                    {meta.code}
                  </span>
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-wider",
                    idx === 0 && r.totalAmount > 0 ? "text-amber-500 font-black" : "text-gray-400"
                  )}>
                    #{idx + 1}
                  </span>
                </div>

                <div className="space-y-0.5 mb-2.5">
                  <p className="text-xs font-black text-black truncate">{r.name}</p>
                  <p className="text-sm font-black text-black">
                    {r.totalAmount.toLocaleString()} <span className="text-[10px] text-gray-400 font-bold">ETB</span>
                  </p>
                </div>

                {/* Relative progress bar */}
                <div className="space-y-1 w-full">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        idx === 0 && r.totalAmount > 0 ? "bg-[#ED1C24]" : "bg-gray-800"
                      )}
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-bold text-gray-400">
                    <span>{r.paidCount} paid</span>
                    <span>{percentage}%</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-2xl">
          {/* Free text search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by payer, email, phone, invoice #, transaction ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-10 pr-9 bg-white text-black border-gray-200 rounded-xl font-bold text-xs focus:ring-2 focus:ring-[#ED1C24]/10 transition-all shadow-sm"
            />
            {search && (
              <button 
                onClick={() => setSearch("")} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Region Dropdown Selector */}
          <select
            value={selectedRegion === null ? "" : selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value === "" ? null : Number(e.target.value))}
            className="h-10 px-3 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/10"
          >
            <option value="">All regions</option>
            {regionalStats.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.totalAmount.toLocaleString()} ETB)
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl shrink-0">
          {[
            { id: "ALL", label: "All Records" },
            { id: "PAID", label: "Completed" },
            { id: "PENDING", label: "Pending" },
            { id: "FAILED", label: "Failed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-black transition-all",
                statusFilter === tab.id 
                  ? "bg-white text-black shadow-sm" 
                  : "text-gray-500 hover:text-black"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Invoice & ID</TableHead>
              <TableHead>Payer</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-64 text-center">
                  <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin mx-auto mb-4" />
                  <p className="font-bold flex items-center justify-center gap-2 text-gray-400 uppercase tracking-widest text-[10px]">
                    Loading financial ledger...
                  </p>
                </TableCell>
              </TableRow>
            ) : filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-64 text-center">
                  <div className="space-y-2">
                    <p className="font-black text-gray-400 text-sm">No payment records found.</p>
                    <p className="text-xs text-gray-400 font-medium">
                      Try clearing your search term or selecting another region filter.
                    </p>
                    {(selectedRegion !== null || statusFilter !== "ALL" || search) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRegion(null);
                          setStatusFilter("ALL");
                          setSearch("");
                        }}
                        className="mt-2 text-xs font-bold rounded-xl"
                      >
                        Reset All Filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((p) => {
                const reg = REGION_LOOKUP[p.region_id ?? 0] || { id: 0, name: "National", code: "NAT", badgeColor: "bg-gray-50 text-gray-700 border-gray-200" };
                const when = isPaid(p) && p.paid_at ? p.paid_at : p.created_at;
                const formattedDate = when ? new Date(when).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                }) : "N/A";

                return (
                  <TableRow key={p.id}>
                    {/* Invoice & ID */}
                    <TableCell>
                      <div className="space-y-1">
                        <span className="font-black text-black text-xs leading-tight block tracking-tight">
                          {p.invoice_number || "No invoice number"}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 font-mono">
                          <span>{p.id.slice(0, 8)}...</span>
                          <button
                            onClick={() => copyToClipboard(p.id, p.id)}
                            className="hover:text-black transition-colors"
                            title="Copy full transaction ID"
                          >
                            {copiedId === p.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>
                    </TableCell>

                    {/* Payer Contact */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-black text-black truncate max-w-[180px]">
                          {p.payer_name || "Name not recorded"}
                        </p>
                        <p className="text-[11px] font-bold text-gray-500 truncate max-w-[180px]">
                          {p.payer_phone || p.payer_email || "No contact recorded"}
                        </p>
                      </div>
                    </TableCell>

                    {/* Region Scope */}
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border",
                        reg.badgeColor
                      )}>
                        <MapPin className="h-2.5 w-2.5 shrink-0" />
                        {reg.name}
                      </span>
                    </TableCell>

                    {/* Purpose / Description */}
                    <TableCell>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-700">
                        {p.purpose || p.description || "Not recorded"}
                      </span>
                    </TableCell>

                    {/* Method */}
                    <TableCell>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        {p.payment_method || "Not recorded"}
                      </span>
                    </TableCell>

                    {/* Amount */}
                    <TableCell>
                      <span className="font-black text-sm text-black">
                        {Number(p.amount).toLocaleString()}{" "}
                        <span className="text-[10px] text-gray-400 font-bold">{cur(p)}</span>
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit border",
                        p.status === "SUCCESS" || p.status === "PAID" 
                          ? "bg-green-50 text-green-700 border-green-200" 
                          : p.status === "FAILED" 
                          ? "bg-red-50 text-red-600 border-red-200" 
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      )}>
                        {(p.status === "PENDING" || p.status === "UNPAID") && <Clock className="h-3 w-3" />}
                        {(p.status === "SUCCESS" || p.status === "PAID") && <CheckCircle2 className="h-3 w-3" />}
                        {p.status === "FAILED" && <XCircle className="h-3 w-3" />}
                        {p.status}
                      </span>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-right text-xs text-gray-500">
                      {formattedDate}
                      <span className="block text-[10px] text-gray-400">{isPaid(p) && p.paid_at ? "Paid" : "Created"}</span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  return <FinanceUnlock><PaymentsContent /></FinanceUnlock>;
}
