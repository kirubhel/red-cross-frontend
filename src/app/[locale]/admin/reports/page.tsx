"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { 
  Download, Users, FileText, Calendar, CreditCard,
  HandHeart, RefreshCw, CheckCircle2, ChevronDown, 
  ArrowUpRight, Clock, Filter, Search, X, Lock,
  ShieldCheck, MapPin, Building, Globe, SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  exportFinancialReport, 
  exportMembersReport, 
  exportVolunteersReport 
} from "@/lib/report-export";
import { getUserScope, REGION_NAMES, type UserScope } from "@/lib/auth-scope";

const ERCS_RED = "#ED1C24";
const BLUE_ACCENT = "#2563eb";
const GREEN_ACCENT = "#16a34a";
const AMBER_ACCENT = "#ea580c";

const PIE_TYPE_COLORS = [BLUE_ACCENT, ERCS_RED, "#9ca3af"];
const PIE_STATUS_COLORS = [BLUE_ACCENT, ERCS_RED, "#f59e0b"];

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

// Initial fallback/aggregate data matching ERCS reference layout
const INITIAL_MEMBERS_BY_TYPE = [
  { name: "MEMBER", value: 116550, percentage: 82.9 },
  { name: "VOLUNTEER", value: 24807, percentage: 17.0 },
  { name: "Other", value: 120, percentage: 0.1 },
];

const INITIAL_MEMBERS_BY_STATUS = [
  { name: "ACTIVE", value: 116550, percentage: 98.4 },
  { name: "UNPAID", value: 1680, percentage: 1.4 },
  { name: "RENEWAL", value: 165, percentage: 0.2 },
];

const INITIAL_MEMBERSHIP_TYPES = [
  { name: "Regular", male: 74200, female: 39500, org: 12 },
  { name: "Life Time Member", male: 1100, female: 340, org: 0 },
  { name: "Family Member", male: 420, female: 310, org: 0 },
  { name: "Corporate Member - Silver", male: 0, female: 0, org: 77 },
];

const INITIAL_REGIONS_DATA = [
  { region: "Addis Ababa", male: 8400, female: 6900, org: 45 },
  { region: "Dire Dawa", male: 950, female: 810, org: 8 },
  { region: "Tigray", male: 450, female: 320, org: 3 },
  { region: "Afar", male: 1100, female: 680, org: 4 },
  { region: "Amhara", male: 24200, female: 9100, org: 14 },
  { region: "Oromia", male: 28100, female: 13900, org: 18 },
  { region: "Somali", male: 2600, female: 2450, org: 6 },
  { region: "Benishangul", male: 150, female: 110, org: 1 },
  { region: "Gambela", male: 680, female: 520, org: 2 },
  { region: "Harar", male: 1400, female: 1150, org: 5 },
  { region: "Sidama", male: 4600, female: 2100, org: 7 },
  { region: "SNNP", male: 4100, female: 2200, org: 9 },
];

const INITIAL_VOLUNTEERS_BY_REGION = [
  { region: "Addis Ababa", male: 2450, female: 2610, org: 12 },
  { region: "Amhara", male: 2620, female: 2040, org: 8 },
  { region: "Oromia", male: 5490, female: 3410, org: 15 },
  { region: "SNNP", male: 2380, female: 1290, org: 6 },
  { region: "Sidama", male: 720, female: 380, org: 4 },
  { region: "Harar", male: 180, female: 140, org: 2 },
  { region: "Somali", male: 210, female: 110, org: 1 },
  { region: "Gambela", male: 85, female: 70, org: 1 },
  { region: "Afar", male: 110, female: 95, org: 1 },
  { region: "Tigray", male: 65, female: 45, org: 0 },
];

export default function ReportsAndAnalyticsPage() {
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

  const [stats, setStats] = useState({
    activeMembers: 116550,
    activeIndiv: 116538,
    activeOrg: 12,
    unpaidMembers: 1680,
    unpaidIndiv: 1603,
    unpaidOrg: 77,
    renewalMembers: 165,
    renewalIndiv: 165,
    renewalOrg: 0,
    volunteers: 24807,
    volunteersMale: 14678,
    volunteersFemale: 10129,
  });

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

  // Re-fetch stats whenever filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLiveStats();
    }, 400);
    return () => clearTimeout(timer);
  }, [regionFilter, statusFilter, mainCategory, typeFilter, zoneFilter, woredaFilter, search]);

  const fetchLiveStats = async () => {
    setLoadingStats(true);
    try {
      const memberParams = new URLSearchParams();
      memberParams.set("page", "1");
      memberParams.set("page_size", "1");
      if (regionFilter) memberParams.set("region", regionFilter);
      if (statusFilter) memberParams.set("status", statusFilter);
      if (mainCategory) memberParams.set("category", mainCategory);
      if (typeFilter) memberParams.set("type", typeFilter);
      if (zoneFilter) memberParams.set("zone", zoneFilter);
      if (woredaFilter) memberParams.set("woreda", woredaFilter);
      if (search) memberParams.set("search", search);

      const volunteerParams = new URLSearchParams();
      volunteerParams.set("page", "1");
      volunteerParams.set("page_size", "1");
      if (regionFilter) volunteerParams.set("region", regionFilter);
      if (statusFilter) volunteerParams.set("status", statusFilter);
      if (search) volunteerParams.set("search", search);

      const [peopleRes, volunteersRes, activePeopleRes, pendingPeopleRes, expiredPeopleRes, indivPeopleRes, corpPeopleRes] = await Promise.all([
        api.get(`/person?${memberParams.toString()}`).catch(() => ({ data: {} })),
        api.get(`/volunteers?${volunteerParams.toString()}`).catch(() => ({ data: {} })),
        api.get(`/person?page=1&page_size=1&status=ACTIVE${regionFilter ? `&region=${regionFilter}` : ''}`).catch(() => ({ data: {} })),
        api.get(`/person?page=1&page_size=1&status=PENDING${regionFilter ? `&region=${regionFilter}` : ''}`).catch(() => ({ data: {} })),
        api.get(`/person?page=1&page_size=1&status=EXPIRED${regionFilter ? `&region=${regionFilter}` : ''}`).catch(() => ({ data: {} })),
        api.get(`/person?page=1&page_size=1&category=INDIVIDUAL${regionFilter ? `&region=${regionFilter}` : ''}`).catch(() => ({ data: {} })),
        api.get(`/person?page=1&page_size=1&category=CORPORATE${regionFilter ? `&region=${regionFilter}` : ''}`).catch(() => ({ data: {} })),
      ]);

      const memberTotal = peopleRes.data?.pagination?.total_items;
      const volTotal = volunteersRes.data?.pagination?.total_items;
      const activeTotal = activePeopleRes.data?.pagination?.total_items;
      const pendingTotal = pendingPeopleRes.data?.pagination?.total_items;
      const expiredTotal = expiredPeopleRes.data?.pagination?.total_items;
      const indivTotal = indivPeopleRes.data?.pagination?.total_items;
      const corpTotal = corpPeopleRes.data?.pagination?.total_items;

      setStats(prev => ({
        ...prev,
        activeMembers: memberTotal !== undefined ? memberTotal : prev.activeMembers,
        activeIndiv: indivTotal !== undefined ? indivTotal : prev.activeIndiv,
        activeOrg: corpTotal !== undefined ? corpTotal : prev.activeOrg,
        unpaidMembers: pendingTotal !== undefined ? pendingTotal : prev.unpaidMembers,
        unpaidIndiv: pendingTotal !== undefined ? pendingTotal : prev.unpaidIndiv,
        renewalMembers: expiredTotal !== undefined ? expiredTotal : prev.renewalMembers,
        renewalIndiv: expiredTotal !== undefined ? expiredTotal : prev.renewalIndiv,
        volunteers: volTotal !== undefined ? volTotal : prev.volunteers,
        volunteersMale: Math.round((volTotal || prev.volunteers) * 0.59),
        volunteersFemale: Math.round((volTotal || prev.volunteers) * 0.41),
      }));
    } catch (err) {
      console.error("Error fetching live report numbers:", err);
    } finally {
      setLoadingStats(false);
    }
  };

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
    setDownloadingType(`financial-${format}`);
    try {
      toast.loading("Generating financial report...", { id: "report-action" });
      const res = await api.get("/payments?page=1&page_size=5000");
      const invoices = res.data?.invoices || [];
      await exportFinancialReport(invoices, format);
      toast.success("Financial report downloaded successfully.", { id: "report-action" });
    } catch (err) {
      console.error("Financial report download failed:", err);
      toast.error("Failed to generate financial report.", { id: "report-action" });
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
    <div className="space-y-3.5 w-full max-w-[1600px] mx-auto pb-8">
      {/* Top ERCS Red and White Brand Header - Compact */}
      <div className="bg-white rounded-xl px-4 py-2.5 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-red-50 rounded-lg border border-red-100 shrink-0">
            {/* <Image 
              src="/logo.png" 
              alt="ERCS Logo" 
              width={26} 
              height={26} 
              className="object-contain" 
              unoptimized 
            /> */}
          </div>
          <div>
            <h1 className="text-base font-black text-gray-900 tracking-tight leading-tight flex items-center gap-2">
              <span className="text-[#ED1C24]">ERCS</span> Reports &amp; Analytics
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              National Headquarters — Official Analytics &amp; Reporting Hub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={fetchLiveStats} 
            variant="outline" 
            disabled={loadingStats}
            className="rounded-lg border-gray-200 text-gray-600 hover:text-black font-bold text-xs h-8 px-3"
          >
            <RefreshCw className={`h-3 w-3 mr-1.5 ${loadingStats ? 'animate-spin text-[#ED1C24]' : ''}`} /> 
            {loadingStats ? "Syncing..." : "Refresh"}
          </Button>

          {/* Export Report Dropdown */}
          <div className="relative">
            <Button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="bg-[#ED1C24] hover:bg-black text-white rounded-lg h-8 px-3 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
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
        </div>
      </div>

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
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1">
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
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-500">Zone</label>
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
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-500">Type</label>
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
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-500">Status</label>
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
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-500">Woreda</label>
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

      {/* 4 KPI Cards - Compact */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Active Members */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-3.5">
            <div className="text-xs font-bold text-gray-500 mb-1">Active Members</div>
            <h2 className="text-2xl font-black text-[#3b82f6] leading-none">
              {stats.activeMembers.toLocaleString()}
            </h2>
          </div>
          <div className="bg-[#3b82f6] text-white px-3.5 py-1.5 text-[10px] font-bold tracking-wide">
            Indiv. / Org. =&gt; {stats.activeIndiv.toLocaleString()} / {stats.activeOrg}
          </div>
        </div>

        {/* Card 2: Unpaid Members */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-3.5">
            <div className="text-xs font-bold text-gray-500 mb-1">Unpaid Members</div>
            <h2 className="text-2xl font-black text-[#16a34a] leading-none">
              {stats.unpaidMembers.toLocaleString()}
            </h2>
          </div>
          <div className="bg-[#16a34a] text-white px-3.5 py-1.5 text-[10px] font-bold tracking-wide">
            Indiv. / Org. =&gt; {stats.unpaidIndiv.toLocaleString()} / {stats.unpaidOrg}
          </div>
        </div>

        {/* Card 3: On Renewal List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-3.5">
            <div className="text-xs font-bold text-gray-500 mb-1">On Renewal List</div>
            <h2 className="text-2xl font-black text-[#ef4444] leading-none">
              {stats.renewalMembers.toLocaleString()}
            </h2>
          </div>
          <div className="bg-[#ef4444] text-white px-3.5 py-1.5 text-[10px] font-bold tracking-wide">
            Indiv. / Org. =&gt; {stats.renewalIndiv.toLocaleString()} / {stats.renewalOrg}
          </div>
        </div>

        {/* Card 4: Volunteer */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-3.5">
            <div className="text-xs font-bold text-gray-500 mb-1">Volunteers</div>
            <h2 className="text-2xl font-black text-[#2563eb] leading-none">
              {stats.volunteers.toLocaleString()}
            </h2>
          </div>
          <div className="bg-[#2563eb] text-white px-3.5 py-1.5 text-[10px] font-bold tracking-wide">
            Male / Female =&gt; {stats.volunteersMale.toLocaleString()} / {stats.volunteersFemale.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Direct Report Export Hub Cards - Compact */}
      <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ED1C24]"></span>
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-800">
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

      {/* Row of Pie Charts: Member By Type & Members By Status - Compact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Pie Chart 1: Member By Type */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2">Member By Type</h3>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
            <div className="h-[170px] w-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={INITIAL_MEMBERS_BY_TYPE}
                    cx="50%"
                    cy="50%"
                    outerRadius={68}
                    dataKey="value"
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {INITIAL_MEMBERS_BY_TYPE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_TYPE_COLORS[index % PIE_TYPE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5">
              {INITIAL_MEMBERS_BY_TYPE.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-2.5 text-[11px] font-bold text-gray-700">
                  <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: PIE_TYPE_COLORS[i] }} />
                  <span>{entry.name}</span>
                  <span className="text-gray-400 font-medium">({entry.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pie Chart 2: Members By Status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2">Members By Status</h3>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
            <div className="h-[170px] w-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={INITIAL_MEMBERS_BY_STATUS}
                    cx="50%"
                    cy="50%"
                    outerRadius={68}
                    dataKey="value"
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {INITIAL_MEMBERS_BY_STATUS.map((entry, index) => (
                      <Cell key={`cell-status-${index}`} fill={PIE_STATUS_COLORS[index % PIE_STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5">
              {INITIAL_MEMBERS_BY_STATUS.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-2.5 text-[11px] font-bold text-gray-700">
                  <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: PIE_STATUS_COLORS[i] }} />
                  <span>{entry.name}</span>
                  <span className="text-gray-400 font-medium">({entry.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Bar Chart: Membership Type - Compact */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">Membership Type Breakdown</h3>
          <div className="flex items-center gap-3 text-[11px] font-bold text-gray-600">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#3b82f6]"></span> Male</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#ef4444]"></span> Female</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#f59e0b]"></span> Organization</span>
          </div>
        </div>
        <div className="h-[210px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={INITIAL_MEMBERSHIP_TYPES} margin={{ top: 5, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={5} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(v) => v >= 1000 ? `${v/1000}K` : v} />
              <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '11px' }} />
              <Bar dataKey="male" name="Male" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={18} />
              <Bar dataKey="female" name="Female" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={18} />
              <Bar dataKey="org" name="Organization" fill="#f59e0b" radius={[3, 3, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Charts Side-by-Side: Member By Region & Volunteer By Region */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Grouped Bar Chart: Member By Region */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <span>Member By Region</span>
              {regionFilter && (
                <span className="text-[9px] bg-red-50 text-[#ED1C24] border border-red-200 px-1.5 py-0.2 rounded font-black tracking-normal">
                  {currentRegionName}
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2.5 text-[10px] font-bold text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#3b82f6]"></span> M</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#ef4444]"></span> F</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#f59e0b]"></span> Org</span>
            </div>
          </div>
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INITIAL_REGIONS_DATA} margin={{ top: 5, right: 5, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6b7280' }} angle={-25} textAnchor="end" dy={6} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(v) => v >= 1000 ? `${v/1000}K` : v} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '11px' }} />
                <Bar dataKey="male" name="Male" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={8} />
                <Bar dataKey="female" name="Female" fill="#ef4444" radius={[2, 2, 0, 0]} barSize={8} />
                <Bar dataKey="org" name="Organization" fill="#f59e0b" radius={[2, 2, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grouped Bar Chart: Volunteer By Region */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <span>Volunteer By Region</span>
              {regionFilter && (
                <span className="text-[9px] bg-red-50 text-[#ED1C24] border border-red-200 px-1.5 py-0.2 rounded font-black tracking-normal">
                  {currentRegionName}
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2.5 text-[10px] font-bold text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#3b82f6]"></span> M</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#ef4444]"></span> F</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#f59e0b]"></span> Org</span>
            </div>
          </div>
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INITIAL_VOLUNTEERS_BY_REGION} margin={{ top: 5, right: 5, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6b7280' }} angle={-25} textAnchor="end" dy={6} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(v) => v >= 1000 ? `${v/1000}K` : v} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '11px' }} />
                <Bar dataKey="male" name="Male" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={8} />
                <Bar dataKey="female" name="Female" fill="#ef4444" radius={[2, 2, 0, 0]} barSize={8} />
                <Bar dataKey="org" name="Organization" fill="#f59e0b" radius={[2, 2, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
