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
  Search, CreditCard, Clock, CheckCircle2, XCircle, Download, 
  RefreshCw, Trophy, MapPin, TrendingUp, Building2, Filter, 
  Copy, Check, ArrowUpDown, ChevronRight, X
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { REGIONS } from "@/lib/constants";
import { getUserScope, type UserScope } from "@/lib/auth-scope";

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
  created_at: string;
  due_date?: string;
};

interface RegionMeta {
  id: number;
  name: string;
  code: string;
  badgeColor: string;
}

const REGION_LOOKUP: Record<number, RegionMeta> = {
  0: { id: 0, name: "National / General", code: "NAT", badgeColor: "bg-slate-100 text-slate-700 border-slate-200" },
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

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userScope, setUserScope] = useState<UserScope | null>(null);

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
      const res = await api.get("/payments");
      setPayments(res.data.invoices || []);
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
      const isPaid = p.status === "PAID" || p.status === "SUCCESS";
      if (isPaid) {
        entry.totalAmount += Number(p.amount) || 0;
        entry.paidCount += 1;
      }
      map.set(rId, entry);
    });

    // Return sorted descending by total revenue
    return Array.from(map.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [payments]);

  // Overall Financial KPIs
  const kpiData = useMemo(() => {
    let totalRevenue = 0;
    let paidCount = 0;
    let pendingAmount = 0;
    let pendingCount = 0;

    payments.forEach((p) => {
      const amt = Number(p.amount) || 0;
      if (p.status === "PAID" || p.status === "SUCCESS") {
        totalRevenue += amt;
        paidCount += 1;
      } else if (p.status === "PENDING" || p.status === "UNPAID") {
        pendingAmount += amt;
        pendingCount += 1;
      }
    });

    const activeRegions = regionalStats.filter(r => r.totalAmount > 0);
    const topRegion = activeRegions.length > 0 ? activeRegions[0] : null;
    const avgAmount = paidCount > 0 ? Math.round(totalRevenue / paidCount) : 0;

    return {
      totalRevenue,
      paidCount,
      totalCount: payments.length,
      pendingAmount,
      pendingCount,
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
        if (statusFilter === "PAID" && p.status !== "PAID" && p.status !== "SUCCESS") return false;
        if (statusFilter === "PENDING" && p.status !== "PENDING" && p.status !== "UNPAID") return false;
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
    <div className="space-y-6 w-full max-w-full pb-14">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-red-50 text-[#ED1C24] border border-red-200 rounded-full text-[10px] font-black uppercase tracking-wider">
            <CreditCard className="h-3 w-3" /> ERCS Finance & Revenue
          </div>
          <h1 className="text-3xl font-black text-black tracking-tight">Payments & Regional Revenue</h1>
          <p className="text-gray-500 font-medium text-sm">
            Track all membership subscriptions, public relief donations, and distinguish revenue raised across regions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            onClick={fetchPayments}
            disabled={loading}
            className="h-10 px-4 rounded-xl border-gray-200 text-gray-700 font-bold hover:bg-gray-50 shadow-sm flex items-center gap-2 text-xs"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
          </Button>
          <Button 
            onClick={handleExport}
            className="bg-[#ED1C24] hover:bg-black text-white rounded-xl h-10 px-6 font-black shadow-sm transition-all flex items-center gap-2 text-xs cursor-pointer"
          >
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Revenue Raised</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-black tracking-tight mb-1">
            {kpiData.totalRevenue.toLocaleString()} <span className="text-xs font-bold text-gray-400">ETB</span>
          </h3>
          <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> {kpiData.paidCount} of {kpiData.totalCount} transactions completed
          </p>
        </div>

        {/* Top Performing Region */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Top Region by Revenue</span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <Trophy className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-black tracking-tight mb-1 truncate">
            {kpiData.topRegion ? kpiData.topRegion.name : "None"}
          </h3>
          <p className="text-[11px] font-bold text-gray-500">
            {kpiData.topRegion ? `${kpiData.topRegion.totalAmount.toLocaleString()} ETB raised` : "Awaiting transactions"}
          </p>
        </div>

        {/* Pending In-Flight */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Settlements</span>
            <div className="h-9 w-9 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center font-black">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-black tracking-tight mb-1">
            {kpiData.pendingAmount.toLocaleString()} <span className="text-xs font-bold text-gray-400">ETB</span>
          </h3>
          <p className="text-[11px] font-bold text-yellow-700">
            {kpiData.pendingCount} transactions awaiting verification
          </p>
        </div>

        {/* Active Branches */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contributing Regions</span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-black tracking-tight mb-1">
            {kpiData.activeRegionsCount} <span className="text-xs font-bold text-gray-400">/ 14 Regions</span>
          </h3>
          <p className="text-[11px] font-bold text-gray-500">
            Avg. contribution: {kpiData.avgAmount.toLocaleString()} ETB
          </p>
        </div>
      </div>

      {/* Regional Revenue Leaderboard Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#ED1C24]" />
              <h2 className="text-base font-black text-black uppercase tracking-wider">
                Regional Revenue Leaderboard
              </h2>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Click any region card below to isolate its financial transactions in the ledger.
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
          {regionalStats.slice(0, 10).map((r, idx) => {
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
            <option value="">All Regions ({regionalStats.length})</option>
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
          <TableHeader className="bg-gray-50/60">
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black">Invoice & ID</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black">Payer Contact</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black">Region Scope</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black">Contribution Type</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black">Method</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black">Amount</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black">Status</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black text-right">Date</TableHead>
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
                const formattedDate = p.created_at ? new Date(p.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                }) : "N/A";

                return (
                  <TableRow key={p.id} className="hover:bg-gray-50/50 transition-colors border-gray-50">
                    {/* Invoice & ID */}
                    <TableCell className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="font-black text-black text-xs leading-tight block tracking-tight">
                          {p.invoice_number || "ERCS-REC-PENDING"}
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
                    <TableCell className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="text-xs font-black text-black truncate max-w-[180px]">
                          {p.payer_name || "Member Contributor"}
                        </p>
                        <p className="text-[11px] font-bold text-gray-500 truncate max-w-[180px]">
                          {p.payer_email || p.payer_phone || p.person_id}
                        </p>
                      </div>
                    </TableCell>

                    {/* Region Scope */}
                    <TableCell className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border",
                        reg.badgeColor
                      )}>
                        <MapPin className="h-2.5 w-2.5 shrink-0" />
                        {reg.name}
                      </span>
                    </TableCell>

                    {/* Purpose / Description */}
                    <TableCell className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-700">
                        {p.description || "MEMBERSHIP FEE"}
                      </span>
                    </TableCell>

                    {/* Method */}
                    <TableCell className="px-6 py-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                        {p.payment_method || "ARIFPAY"}
                      </span>
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="px-6 py-4">
                      <span className="font-black text-sm text-black">
                        {Number(p.amount).toLocaleString()}{" "}
                        <span className="text-[10px] text-gray-400 font-bold">{p.currency || "ETB"}</span>
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-6 py-4">
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
                    <TableCell className="px-6 py-4 text-right font-bold text-gray-400 text-[10px]">
                      {formattedDate}
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
