"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { 
  Download, Users, FileText, Calendar, CreditCard,
  HandHeart, RefreshCw, CheckCircle2, ChevronDown, 
  ArrowUpRight, Clock, Filter, Search, X, Lock,
  ShieldCheck, MapPin, Building, Globe, SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api, { getFinanceToken } from "@/lib/api";
import { FinanceUnlock } from "@/components/admin/FinanceUnlock";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  exportFinancialReport, 
  exportMembersReport, 
  exportVolunteersReport 
} from "@/lib/report-export";
import { getUserScope, REGION_NAMES, type UserScope } from "@/lib/auth-scope";
import { formatNumber, genderSplit, loadRegistry, percent, type RegistryLoad } from "@/lib/registry-analytics";
import { RegistryInsights } from "@/components/admin/analytics/RegistryInsights";
import { StatTile } from "@/components/admin/analytics/widgets";

import { PageHeader } from "@/components/admin/page-ui";
interface RegionOption {
  id: number;
  name: string;
  code: string;
}

const DEFAULT_REGIONS: RegionOption[] = [
  { id: 1, name: "Addis Ababa", code: "AA" },
  { id: 2, name: "Dire Dawa", code: "DD" },
  { id: 3, name: "Tigray", code: "TG" },
  { id: 4, name: "Afar", code: "AF" },
  { id: 5, name: "Amhara", code: "AM" },
  { id: 6, name: "Oromia", code: "OR" },
  { id: 7, name: "Somali", code: "SM" },
  { id: 8, name: "Benishangul Gumz", code: "BG" },
  { id: 9, name: "Central Ethiopia", code: "CE" },
  { id: 10, name: "Gambela", code: "GM" },
  { id: 11, name: "Harari", code: "HR" },
  { id: 12, name: "Sidama", code: "SD" },
  { id: 13, name: "South West Ethiopia", code: "SW" },
  { id: 14, name: "South Ethiopia", code: "SE" }
];

export default function ReportsAndAnalyticsPage() {
  const [showFinancePrompt, setShowFinancePrompt] = useState(false);
  const [pendingFinancialFormat, setPendingFinancialFormat] = useState<"xlsx" | "csv">("xlsx");
  const [downloadingType, setDownloadingType] = useState<string | null>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  
  // Auth scope & region lock
  const [userScope, setUserScope] = useState<UserScope | null>(null);
  const [isRegionLocked, setIsRegionLocked] = useState(false);
  const [regions, setRegions] = useState<RegionOption[]>(DEFAULT_REGIONS);

  // Rich Filter Suite (matching Members Page)
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [mainCategory, setMainCategory] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [zoneFilter, setZoneFilter] = useState<string>("");
  const [woredaFilter, setWoredaFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Live registry behind every number and chart on this page
  const [registry, setRegistry] = useState<RegistryLoad | null>(null);
  const [loadError, setLoadError] = useState(false);

  // Initialize user scope and regions on mount
  useEffect(() => {
    const scope = getUserScope();
    setUserScope(scope);

    const hasRegionalLock = !scope.isSuperAdmin && Boolean(scope.regionId);
    setIsRegionLocked(hasRegionalLock);
    if (hasRegionalLock && scope.regionId) {
      setRegionFilter(scope.regionId);
    }

    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const res = await api.get("/system-settings");
      if (res.data?.settings?.all_regions) {
        const parsed = JSON.parse(res.data.settings.all_regions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRegions(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to fetch regions:", err);
    }
  };

  // Reload whenever a server-side filter changes. Region is applied on the client for
  // national users so the map keeps showing the whole country.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLiveStats();
    }, 400);
    return () => clearTimeout(timer);
  }, [isRegionLocked, isRegionLocked ? regionFilter : "", statusFilter, mainCategory, typeFilter, zoneFilter, woredaFilter, search]);

  const fetchLiveStats = async () => {
    setLoadingStats(true);
    setLoadError(false);
    try {
      setRegistry(
        await loadRegistry({
          region: isRegionLocked ? regionFilter : undefined,
          status: statusFilter,
          category: mainCategory,
          type: typeFilter,
          zone: zoneFilter,
          woreda: woredaFilter,
          search,
        })
      );
    } catch (err) {
      console.error("Error loading report data:", err);
      setLoadError(true);
    } finally {
      setLoadingStats(false);
    }
  };

  const regionId = regionFilter ? Number(regionFilter) : null;
  const allRecords = registry?.records || [];
  const scopedRecords = useMemo(() => (regionId ? allRecords.filter((r) => r.regionId === regionId) : allRecords), [allRecords, regionId]);
  const memberRecords = scopedRecords.filter((r) => r.role === "MEMBER");
  const volunteerRecords = scopedRecords.filter((r) => r.role === "VOLUNTEER");
  const statusCount = (status: string) => memberRecords.filter((r) => r.status === status).length;
  const volunteerGender = genderSplit(volunteerRecords);
  const volunteerGenderKnown = volunteerGender.FEMALE + volunteerGender.MALE;

  const resetFilters = () => {
    setSearch("");
    setMainCategory("");
    setTypeFilter("");
    setStatusFilter("");
    setZoneFilter("");
    setWoredaFilter("");
    // If region is locked to regional user, keep the region; otherwise reset to all
    if (!isRegionLocked) {
      setRegionFilter("");
    }
  };

  const activeFilterCount = [
    Boolean(search),
    Boolean(regionFilter && !isRegionLocked),
    Boolean(mainCategory),
    Boolean(typeFilter),
    Boolean(statusFilter),
    Boolean(zoneFilter),
    Boolean(woredaFilter),
  ].filter(Boolean).length;

  const currentRegionName = regionFilter 
    ? (regions.find(r => String(r.id) === String(regionFilter))?.name || REGION_NAMES[regionFilter] || `Region ${regionFilter}`)
    : "All Regions";

  // Dedicated filtered report generators
  const handleDownloadFinancialReport = async (format: "xlsx" | "csv" = "xlsx") => {
    if (!getFinanceToken()) {
      setPendingFinancialFormat(format);
      setShowFinancePrompt(true);
      return;
    }
    setDownloadingType(`financial-${format}`);
    try {
      toast.loading("Generating financial report...", { id: "report-action" });
      const res = await api.get("/payments?page=1&page_size=5000");
      const invoices = res.data?.invoices || [];
      await exportFinancialReport(invoices, format);
      toast.success("Financial report downloaded successfully.", { id: "report-action" });
    } catch (err) {
      console.error("Financial report download failed:", err);
      const status = (err as { response?: { status?: number } }).response?.status;
      if (status === 423) {
        setPendingFinancialFormat(format);
        setShowFinancePrompt(true);
      }
      toast.error(status === 423 ? "Finance access expired. Unlock to retry." : "Failed to generate financial report.", { id: "report-action" });
    } finally {
      setDownloadingType(null);
      setIsExportMenuOpen(false);
    }
  };

  const handleDownloadMembersReport = async (format: "xlsx" | "csv" = "xlsx") => {
    setDownloadingType(`members-${format}`);
    try {
      toast.loading("Compiling filtered members list...", { id: "report-action" });
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("page_size", "5000");
      params.set("members_only", "true");
      if (regionFilter) params.set("region", regionFilter);
      if (statusFilter) params.set("status", statusFilter);
      if (mainCategory) params.set("category", mainCategory);
      if (typeFilter) params.set("type", typeFilter);
      if (zoneFilter) params.set("zone", zoneFilter);
      if (woredaFilter) params.set("woreda", woredaFilter);
      if (search) params.set("search", search);

      const res = await api.get(`/person?${params.toString()}`);
      const people = res.data?.people || [];
      if (people.length === 0) {
        toast.warning("No members match the current filter criteria.", { id: "report-action" });
        return;
      }
      await exportMembersReport(people, format);
      toast.success(`Exported ${people.length} filtered members successfully.`, { id: "report-action" });
    } catch (err) {
      console.error("Members report download failed:", err);
      toast.error("Failed to generate members report.", { id: "report-action" });
    } finally {
      setDownloadingType(null);
      setIsExportMenuOpen(false);
    }
  };

  const handleDownloadVolunteersReport = async (format: "xlsx" | "csv" = "xlsx") => {
    setDownloadingType(`volunteers-${format}`);
    try {
      toast.loading("Compiling filtered volunteers roster...", { id: "report-action" });
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("page_size", "5000");
      if (regionFilter) params.set("region", regionFilter);
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await api.get(`/volunteers?${params.toString()}`);
      const volunteers = res.data?.volunteers || [];
      if (volunteers.length === 0) {
        toast.warning("No volunteers match the current filter criteria.", { id: "report-action" });
        return;
      }
      await exportVolunteersReport(volunteers, format);
      toast.success(`Exported ${volunteers.length} filtered volunteers successfully.`, { id: "report-action" });
    } catch (err) {
      console.error("Volunteers report download failed:", err);
      toast.error("Failed to generate volunteers report.", { id: "report-action" });
    } finally {
      setDownloadingType(null);
      setIsExportMenuOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {showFinancePrompt && <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Unlock finance access">
        <div className="mx-auto max-w-md">
          <button type="button" onClick={() => setShowFinancePrompt(false)} className="ml-auto block rounded-lg bg-white p-2 text-gray-600" aria-label="Close finance unlock"><X className="h-5 w-5" /></button>
          <FinanceUnlock onUnlocked={() => { setShowFinancePrompt(false); void handleDownloadFinancialReport(pendingFinancialFormat); }}><p className="rounded-2xl bg-white p-6 text-sm text-gray-700">Finance access unlocked. Preparing your report…</p></FinanceUnlock>
        </div>
      </div>}
      <PageHeader
        title="Reports & Analytics"
        description="National Headquarters — Official Analytics & Reporting Hub"
        actions={
          <>
          <Button 
            onClick={fetchLiveStats} 
            variant="outline" 
            disabled={loadingStats}
            className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs h-10 px-4"
          >
            <RefreshCw className={`h-3 w-3 mr-1.5 ${loadingStats ? 'animate-spin text-[#ED1C24]' : ''}`} /> 
            {loadingStats ? "Syncing..." : "Refresh"}
          </Button>

          {/* Export Report Dropdown */}
          <div className="relative">
            <Button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="bg-[#ED1C24] hover:bg-black text-white rounded-xl h-10 px-4 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Export Report <ChevronDown className="h-3 w-3" />
            </Button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl border border-gray-100 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2.5 py-1">
                  Choose Download Type
                </p>
                <div className="space-y-0.5 mt-0.5">
                  <button
                    onClick={() => handleDownloadFinancialReport("xlsx")}
                    disabled={!!downloadingType}
                    className="w-full text-left px-2.5 py-2 hover:bg-red-50 text-gray-800 hover:text-[#ED1C24] rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><CreditCard className="h-3.5 w-3.5 text-[#ED1C24]" /> Financial Report</span>
                    <span className="text-[9px] bg-red-100 text-[#ED1C24] px-1.5 py-0.5 rounded font-black">XLSX</span>
                  </button>

                  <button
                    onClick={() => handleDownloadMembersReport("xlsx")}
                    disabled={!!downloadingType}
                    className="w-full text-left px-2.5 py-2 hover:bg-blue-50 text-gray-800 hover:text-blue-600 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-blue-600" /> Members Directory</span>
                    <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-black">XLSX</span>
                  </button>

                  <button
                    onClick={() => handleDownloadVolunteersReport("xlsx")}
                    disabled={!!downloadingType}
                    className="w-full text-left px-2.5 py-2 hover:bg-green-50 text-gray-800 hover:text-green-600 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><HandHeart className="h-3.5 w-3.5 text-green-600" /> Volunteers Roster</span>
                    <span className="text-[9px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-black">XLSX</span>
                  </button>

                  <div className="border-t border-gray-100 pt-1 mt-1">
                    <button
                      onClick={() => handleDownloadFinancialReport("csv")}
                      disabled={!!downloadingType}
                      className="w-full text-left px-2.5 py-1.5 text-gray-600 hover:text-black rounded-md text-[11px] font-semibold flex items-center justify-between cursor-pointer"
                    >
                      <span>Financial CSV</span>
                      <span className="text-[9px] text-gray-400 font-bold">CSV</span>
                    </button>
                    <button
                      onClick={() => handleDownloadMembersReport("csv")}
                      disabled={!!downloadingType}
                      className="w-full text-left px-2.5 py-1.5 text-gray-600 hover:text-black rounded-md text-[11px] font-semibold flex items-center justify-between cursor-pointer"
                    >
                      <span>Members CSV</span>
                      <span className="text-[9px] text-gray-400 font-bold">CSV</span>
                    </button>
                    <button
                      onClick={() => handleDownloadVolunteersReport("csv")}
                      disabled={!!downloadingType}
                      className="w-full text-left px-2.5 py-1.5 text-gray-600 hover:text-black rounded-md text-[11px] font-semibold flex items-center justify-between cursor-pointer"
                    >
                      <span>Volunteers CSV</span>
                      <span className="text-[9px] text-gray-400 font-bold">CSV</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        
          </>
        }
      />

      {/* Rich Filter Bar (Members Style & Regional Auto-Scope) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 space-y-3">
        {/* Main Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Search & Scope Pill */}
          <div className="flex flex-1 items-center gap-2.5 min-w-[280px]">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search member, volunteer, ID or phone..."
                className="pl-8 h-8 rounded-lg text-xs bg-gray-50/70 border-gray-200 focus:bg-white focus:border-[#ED1C24] transition-all"
              />
              {search && (
                <button 
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Scope Badge */}
            {isRegionLocked ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-[#ED1C24] border border-red-200 rounded-lg text-[11px] font-bold shrink-0">
                <Lock className="w-3 h-3" />
                <span>Regional Scope: <strong>{userScope?.regionName}</strong></span>
                <span className="text-[9px] bg-[#ED1C24] text-white px-1.5 py-0.2 rounded font-black tracking-wider">LOCKED</span>
              </div>
            ) : regionFilter ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-[11px] font-bold shrink-0">
                <MapPin className="w-3 h-3 text-[#ED1C24]" />
                <span>Filter: <strong>{currentRegionName}</strong></span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-500 border border-gray-200 rounded-lg text-[11px] font-medium shrink-0">
                <Globe className="w-3 h-3 text-gray-400" />
                <span>National Scope — All 14 Regions</span>
              </div>
            )}
          </div>

          {/* Right: Toggle Filters Button & Reset */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? "default" : "outline"}
              className={`h-8 px-3 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
                showFilters 
                  ? "bg-black hover:bg-gray-900 text-white" 
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              <span>{showFilters ? "Hide Filters" : "Filters"}</span>
              {activeFilterCount > 0 && (
                <span className="bg-[#ED1C24] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full leading-none">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {activeFilterCount > 0 && (
              <Button
                onClick={resetFilters}
                variant="ghost"
                className="h-8 px-2.5 rounded-lg text-xs font-bold text-gray-500 hover:text-[#ED1C24] hover:bg-red-50 flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Reset
              </Button>
            )}
          </div>
        </div>

        {/* Collapsible Filter Detail Panel */}
        {showFilters && (
          <div className="pt-2.5 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
            {/* Region Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                {isRegionLocked && <Lock className="w-2.5 h-2.5 text-[#ED1C24]" />}
                Region
              </label>
              <select
                value={regionFilter}
                onChange={(e) => {
                  setRegionFilter(e.target.value);
                  setZoneFilter("");
                  setWoredaFilter("");
                }}
                disabled={isRegionLocked}
                className="w-full h-8 px-2.5 rounded-lg bg-white text-gray-900 border border-gray-200 font-bold text-xs focus:border-[#ED1C24] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isRegionLocked ? (
                  <option value={regionFilter}>{userScope?.regionName} (Locked)</option>
                ) : (
                  <>
                    <option value="">All Regions (National)</option>
                    {regions.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Zone Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Zone</label>
              <select
                value={zoneFilter}
                onChange={(e) => {
                  setZoneFilter(e.target.value);
                  setWoredaFilter("");
                }}
                disabled={!regionFilter}
                className="w-full h-8 px-2.5 rounded-lg bg-white text-gray-900 border border-gray-200 font-bold text-xs focus:border-[#ED1C24] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="">All Zones</option>
                {regionFilter === "1" && (
                  <>
                    <option value="bole">Bole</option>
                    <option value="arada">Arada</option>
                    <option value="kirkos">Kirkos</option>
                    <option value="yeka">Yeka</option>
                  </>
                )}
              </select>
            </div>

            {/* Category Select */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-[#ED1C24]">Category</label>
              <select
                value={mainCategory}
                onChange={(e) => {
                  setMainCategory(e.target.value);
                  setTypeFilter("");
                }}
                className="w-full h-8 px-2.5 rounded-lg bg-white text-gray-900 border border-gray-200 font-bold text-xs focus:border-[#ED1C24] outline-none transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="CORPORATE">Corporate</option>
              </select>
            </div>

            {/* Sub-Type Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                disabled={!mainCategory}
                className="w-full h-8 px-2.5 rounded-lg bg-white text-gray-900 border border-gray-200 font-bold text-xs focus:border-[#ED1C24] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="">Sub-Type...</option>
                {mainCategory === "INDIVIDUAL" && (
                  <>
                    <option value="ANNUAL">Annual</option>
                    <option value="LIFE">Lifetime</option>
                    <option value="YOUTH">Youth</option>
                  </>
                )}
                {mainCategory === "CORPORATE" && (
                  <>
                    <option value="SILVER">Silver</option>
                    <option value="GOLD">Gold</option>
                    <option value="PLATINUM">Platinum</option>
                  </>
                )}
              </select>
            </div>

            {/* Status Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg bg-white text-gray-900 border border-gray-200 font-bold text-xs focus:border-[#ED1C24] outline-none transition-all cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="EXPIRED">Expired</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>

            {/* Woreda Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Woreda</label>
              <select
                value={woredaFilter}
                onChange={(e) => setWoredaFilter(e.target.value)}
                disabled={!zoneFilter}
                className="w-full h-8 px-2.5 rounded-lg bg-white text-gray-900 border border-gray-200 font-bold text-xs focus:border-[#ED1C24] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="">All Woredas</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {loadError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">
          Could not load report data. Check your connection and press Refresh.
        </div>
      )}
      {registry?.truncated && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">
          Showing the first {formatNumber(registry.records.length)} of {formatNumber(registry.memberTotal + registry.volunteerTotal)} matching records, so the charts are incomplete. Narrow the filters to see everything.
        </div>
      )}

      {/* Headline numbers, counted from the loaded records */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          label="Members"
          value={registry ? formatNumber(memberRecords.length) : "…"}
          icon={Users}
          hint={memberRecords.length ? `${formatNumber(statusCount("ACTIVE"))} active (${percent(statusCount("ACTIVE"), memberRecords.length)}%)` : currentRegionName}
        />
        <StatTile label="Pending members" value={registry ? formatNumber(statusCount("PENDING")) : "…"} icon={Clock} hint="Registered, not yet active" />
        <StatTile label="Expired members" value={registry ? formatNumber(statusCount("EXPIRED")) : "…"} icon={RefreshCw} hint="Due for renewal" />
        <StatTile
          label="Volunteers"
          value={registry ? formatNumber(volunteerRecords.length) : "…"}
          icon={HandHeart}
          hint={volunteerGenderKnown ? `${percent(volunteerGender.FEMALE, volunteerGenderKnown)}% female where gender is recorded` : "Gender not recorded"}
        />
      </div>

      {/* Direct Report Export Hub Cards - Compact */}
      <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ED1C24]"></span>
            <h3 className="text-base font-bold tracking-tight text-gray-900">
              Instant File Download Center
            </h3>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold hidden sm:inline">Exports real-time database records to Excel &amp; CSV</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Card 1: Financial Data */}
          <div className="bg-gray-50/70 hover:bg-white rounded-lg p-3 border border-gray-100 hover:border-red-200 transition-all flex flex-col justify-between">
            <div className="flex items-start gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-red-100 text-[#ED1C24] flex items-center justify-center shrink-0">
                <CreditCard className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-gray-900">Financial Report</h4>
                <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                  Invoices, payment statuses, ETB totals &amp; dates
                </p>
              </div>
            </div>
            <div className="pt-2.5 mt-2.5 border-t border-gray-200/60 flex items-center gap-1.5">
              <Button
                onClick={() => handleDownloadFinancialReport("xlsx")}
                disabled={downloadingType === "financial-xlsx"}
                className="flex-1 bg-[#ED1C24] hover:bg-black text-white text-[11px] font-bold h-7 rounded-md cursor-pointer"
              >
                <Download className="h-3 w-3 mr-1" /> Excel
              </Button>
              <Button
                onClick={() => handleDownloadFinancialReport("csv")}
                disabled={downloadingType === "financial-csv"}
                variant="outline"
                className="text-[11px] font-bold h-7 px-2.5 rounded-md text-gray-600 hover:text-black border-gray-200 cursor-pointer"
              >
                CSV
              </Button>
            </div>
          </div>

          {/* Card 2: Registered Members */}
          <div className="bg-gray-50/70 hover:bg-white rounded-lg p-3 border border-gray-100 hover:border-blue-200 transition-all flex flex-col justify-between">
            <div className="flex items-start gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-gray-900">Members Directory</h4>
                <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                  ERCS ID, regional branches, plans &amp; status
                </p>
              </div>
            </div>
            <div className="pt-2.5 mt-2.5 border-t border-gray-200/60 flex items-center gap-1.5">
              <Button
                onClick={() => handleDownloadMembersReport("xlsx")}
                disabled={downloadingType === "members-xlsx"}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold h-7 rounded-md cursor-pointer"
              >
                <Download className="h-3 w-3 mr-1" /> Excel
              </Button>
              <Button
                onClick={() => handleDownloadMembersReport("csv")}
                disabled={downloadingType === "members-csv"}
                variant="outline"
                className="text-[11px] font-bold h-7 px-2.5 rounded-md text-gray-600 hover:text-black border-gray-200 cursor-pointer"
              >
                CSV
              </Button>
            </div>
          </div>

          {/* Card 3: Registered Volunteers */}
          <div className="bg-gray-50/70 hover:bg-white rounded-lg p-3 border border-gray-100 hover:border-green-200 transition-all flex flex-col justify-between">
            <div className="flex items-start gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <HandHeart className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-gray-900">Volunteers Roster</h4>
                <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                  Contacts, regions, contributed hours &amp; readiness
                </p>
              </div>
            </div>
            <div className="pt-2.5 mt-2.5 border-t border-gray-200/60 flex items-center gap-1.5">
              <Button
                onClick={() => handleDownloadVolunteersReport("xlsx")}
                disabled={downloadingType === "volunteers-xlsx"}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold h-7 rounded-md cursor-pointer"
              >
                <Download className="h-3 w-3 mr-1" /> Excel
              </Button>
              <Button
                onClick={() => handleDownloadVolunteersReport("csv")}
                disabled={downloadingType === "volunteers-csv"}
                variant="outline"
                className="text-[11px] font-bold h-7 px-2.5 rounded-md text-gray-600 hover:text-black border-gray-200 cursor-pointer"
              >
                CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Map, demography and trends from the same records */}
      <RegistryInsights
        records={allRecords}
        regionId={regionId}
        regionLocked={isRegionLocked}
        showTable
        onRegionChange={(id) => {
          setRegionFilter(id ? String(id) : "");
          setZoneFilter("");
          setWoredaFilter("");
        }}
      />
    </div>
  );
}
