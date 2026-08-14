"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Building2,
  Phone,
  Mail,
  Search,
  Users,
  HandHeart,
  ShieldCheck,
  Globe2,
  ExternalLink,
  Layers,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  List,
  Sparkles,
  ChevronRight,
  X,
  Filter,
  Download,
  Building
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";

interface Branch {
  id: string;
  name: string;
  name_am?: string;
  name_or?: string;
  branch_type: string; // 'REGIONAL_BRANCH', 'ZONAL_BRANCH', 'COORDINATION_OFFICE', 'SPECIAL_WOREDA'
  region_id: number;
  zone_id?: string;
  address?: string;
  phone?: string;
  email?: string;
  is_active?: boolean;
}

const REGION_MAP: Record<number, string> = {
  1: "Addis Ababa",
  2: "Dire Dawa",
  3: "Tigray",
  4: "Afar",
  5: "Amhara",
  6: "Oromia",
  7: "Somali",
  8: "Benishangul Gumz",
  9: "Central Ethiopia",
  10: "Gambela",
  11: "Harari",
  12: "Sidama",
  13: "South West Ethiopia",
  14: "South Ethiopia",
};

const BRANCH_TYPE_CONFIG: Record<string, { label: string; badge: string; border: string; bg: string }> = {
  REGIONAL_BRANCH: {
    label: "Regional Branch",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    border: "border-emerald-100",
    bg: "from-emerald-50/40 to-transparent",
  },
  ZONAL_BRANCH: {
    label: "Zonal Branch",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    border: "border-blue-100",
    bg: "from-blue-50/40 to-transparent",
  },
  COORDINATION_OFFICE: {
    label: "Coordination Office",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    border: "border-amber-100",
    bg: "from-amber-50/40 to-transparent",
  },
  SPECIAL_WOREDA: {
    label: "Special Woreda / Border Office",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    border: "border-purple-100",
    bg: "from-purple-50/40 to-transparent",
  },
};

export default function BranchManagementPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"GRID" | "TABLE">("GRID");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await api.get("/location/branches");
      setBranches(res.data?.branches || []);
    } catch (err) {
      console.error("Failed to load branches", err);
      toast.error("Failed to load branch directory");
    } finally {
      setLoading(false);
    }
  };

  // Filtered branches
  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      // Region filter
      if (selectedRegion !== "ALL" && String(b.region_id) !== selectedRegion) {
        return false;
      }
      // Type filter
      if (selectedType !== "ALL" && b.branch_type !== selectedType) {
        return false;
      }
      // Search term
      if (search.trim()) {
        const term = search.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(term);
        const matchesAm = b.name_am ? b.name_am.toLowerCase().includes(term) : false;
        const matchesOr = b.name_or ? b.name_or.toLowerCase().includes(term) : false;
        const matchesAddress = b.address ? b.address.toLowerCase().includes(term) : false;
        const matchesPhone = b.phone ? b.phone.toLowerCase().includes(term) : false;
        const matchesEmail = b.email ? b.email.toLowerCase().includes(term) : false;
        const matchesId = b.id.toLowerCase().includes(term);
        const matchesRegion = (REGION_MAP[b.region_id] || "").toLowerCase().includes(term);

        return (
          matchesName ||
          matchesAm ||
          matchesOr ||
          matchesAddress ||
          matchesPhone ||
          matchesEmail ||
          matchesId ||
          matchesRegion
        );
      }
      return true;
    });
  }, [branches, selectedRegion, selectedType, search]);

  // Statistics
  const stats = useMemo(() => {
    const total = branches.length;
    const regional = branches.filter((b) => b.branch_type === "REGIONAL_BRANCH").length;
    const zonal = branches.filter((b) => b.branch_type === "ZONAL_BRANCH").length;
    const coordination = branches.filter((b) => b.branch_type === "COORDINATION_OFFICE").length;
    const special = branches.filter((b) => b.branch_type === "SPECIAL_WOREDA").length;
    return { total, regional, zonal, coordination, special };
  }, [branches]);

  const handleExport = () => {
    if (branches.length === 0) {
      toast.error("No branch records to export");
      return;
    }
    const headers = [
      "Branch ID",
      "Branch Name (English)",
      "Branch Name (Amharic)",
      "Branch Name (Afan Oromo)",
      "Branch Type",
      "Region",
      "Zone ID",
      "Address",
      "Phone",
      "Email",
      "Status",
    ];

    const rows = filteredBranches.map((b) => [
      b.id,
      `"${b.name.replace(/"/g, '""')}"`,
      `"${(b.name_am || "").replace(/"/g, '""')}"`,
      `"${(b.name_or || "").replace(/"/g, '""')}"`,
      b.branch_type,
      `"${REGION_MAP[b.region_id] || b.region_id}"`,
      b.zone_id || "",
      `"${(b.address || "").replace(/"/g, '""')}"`,
      b.phone || "",
      b.email || "",
      b.is_active ? "ACTIVE" : "INACTIVE",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ercs_branches_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Branch directory exported successfully");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-[#ED1C24] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">
              National Structure Directory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Branch Management
          </h1>
          <p className="text-xs sm:text-sm font-medium text-gray-400 mt-1">
            Centralized registry of all {branches.length || 60}+ Ethiopian Red Cross Society regional branches, zonal offices, and coordination centers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleExport}
            variant="outline"
            className="h-11 px-4 rounded-2xl font-black text-xs uppercase tracking-wider border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm"
          >
            <Download className="mr-2 h-4 w-4 text-gray-500" /> Export Directory
          </Button>
          <Link href="/admin/user-management?create=true">
            <Button className="h-11 px-5 rounded-2xl font-black text-xs uppercase tracking-wider bg-[#ED1C24] hover:bg-black text-white transition-all shadow-md shadow-red-500/20">
              <ShieldCheck className="mr-2 h-4 w-4" /> Provision Officer
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Branches</span>
            <div className="h-7 w-7 rounded-xl bg-red-50 text-[#ED1C24] flex items-center justify-center">
              <Building2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-black tracking-tight">{stats.total}</p>
          <p className="text-[10px] font-bold text-gray-400 mt-0.5">Across 14 Regions</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Regional Branches</span>
            <div className="h-7 w-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Globe2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-black tracking-tight">{stats.regional}</p>
          <p className="text-[10px] font-bold text-emerald-600 mt-0.5">National Regional Hubs</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Zonal Branches</span>
            <div className="h-7 w-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-black tracking-tight">{stats.zonal}</p>
          <p className="text-[10px] font-bold text-blue-600 mt-0.5">Zonal Operations</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Coordination Offices</span>
            <div className="h-7 w-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-black tracking-tight">{stats.coordination}</p>
          <p className="text-[10px] font-bold text-amber-600 mt-0.5">Sub-City & Woreda Hubs</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Special Woredas</span>
            <div className="h-7 w-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MapPin className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-black tracking-tight">{stats.special}</p>
          <p className="text-[10px] font-bold text-purple-600 mt-0.5">Border & Strategic Hubs</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by English, Amharic (ሰሜን ጎንደር), Oromo (Arsi), address, or phone..."
              className="h-11 pl-10 pr-4 rounded-xl bg-gray-50/60 border-gray-200 text-black font-semibold text-xs focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Region Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 font-bold text-xs text-black outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="ALL">🏛️ All Regions (14)</option>
              {Object.entries(REGION_MAP).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>

            {/* Type Dropdown */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 font-bold text-xs text-black outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="ALL">📂 All Branch Types</option>
              <option value="REGIONAL_BRANCH">Regional Branch</option>
              <option value="ZONAL_BRANCH">Zonal Branch</option>
              <option value="COORDINATION_OFFICE">Coordination Office</option>
              <option value="SPECIAL_WOREDA">Special Woreda / Border</option>
            </select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("GRID")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "GRID" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-black"
                )}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("TABLE")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "TABLE" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-black"
                )}
                title="Table View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Summary Tags */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-50">
          <span>
            Showing <strong className="text-black">{filteredBranches.length}</strong> of {branches.length} branches
          </span>
          {(selectedRegion !== "ALL" || selectedType !== "ALL" || search) && (
            <button
              onClick={() => {
                setSelectedRegion("ALL");
                setSelectedType("ALL");
                setSearch("");
              }}
              className="text-[#ED1C24] font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 flex flex-col items-center justify-center">
          <div className="h-10 w-10 border-4 border-red-200 border-t-[#ED1C24] rounded-full animate-spin mb-4" />
          <p className="font-black text-sm text-black">Loading ERCS National Branch Directory...</p>
        </div>
      ) : filteredBranches.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100">
          <div className="h-14 w-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <Building2 className="h-7 w-7" />
          </div>
          <h3 className="text-base font-black text-black">No Branches Found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto font-medium">
            No branch offices matched your current filter criteria. Try adjusting your search query or region filter.
          </p>
        </div>
      ) : viewMode === "GRID" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredBranches.map((branch) => {
            const config = BRANCH_TYPE_CONFIG[branch.branch_type] || BRANCH_TYPE_CONFIG.ZONAL_BRANCH;
            return (
              <motion.div
                key={branch.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setSelectedBranch(branch)}
                className={cn(
                  "bg-white rounded-3xl border p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:border-red-200/80 cursor-pointer flex flex-col justify-between relative group overflow-hidden",
                  config.border
                )}
              >
                {/* Top Subtle Gradient */}
                <div className={cn("absolute inset-x-0 top-0 h-2 bg-gradient-to-r", config.bg)} />

                <div>
                  {/* Header Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                        config.badge
                      )}
                    >
                      {config.label}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 font-mono">
                      {REGION_MAP[branch.region_id] || `Region ${branch.region_id}`}
                    </span>
                  </div>

                  {/* Branch Titles */}
                  <h3 className="font-black text-black text-base tracking-tight leading-snug group-hover:text-[#ED1C24] transition-colors">
                    {branch.name}
                  </h3>

                  {branch.name_am && (
                    <p className="text-xs font-semibold text-gray-500 mt-1 font-ethiopic">
                      {branch.name_am}
                    </p>
                  )}
                  {branch.name_or && (
                    <p className="text-[11px] font-medium text-gray-400 italic">
                      {branch.name_or}
                    </p>
                  )}

                  {/* Address & Contacts */}
                  <div className="mt-4 pt-3 border-t border-gray-50 space-y-1.5 text-xs text-gray-600 font-medium">
                    {branch.address && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{branch.address}</span>
                      </div>
                    )}
                    {branch.phone && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="font-mono text-[11px]">{branch.phone}</span>
                      </div>
                    )}
                    {branch.email && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="font-mono text-[11px] truncate">{branch.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/members?branch_id=${branch.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-[#ED1C24] text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1"
                    >
                      <Users className="h-3 w-3" /> Members
                    </Link>
                    <Link
                      href={`/admin/volunteers?search=${branch.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-[#ED1C24] text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1"
                    >
                      <HandHeart className="h-3 w-3" /> Volunteers
                    </Link>
                  </div>

                  <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-black transition-colors flex items-center">
                    Details <ChevronRight className="h-3 w-3 ml-0.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <th className="px-6 py-4">Branch Structure</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Region & Zone</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBranches.map((branch) => {
                  const config = BRANCH_TYPE_CONFIG[branch.branch_type] || BRANCH_TYPE_CONFIG.ZONAL_BRANCH;
                  return (
                    <tr
                      key={branch.id}
                      onClick={() => setSelectedBranch(branch)}
                      className="hover:bg-gray-50/60 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-black text-black text-sm">{branch.name}</div>
                        {branch.name_am && (
                          <div className="text-[11px] text-gray-500 font-medium font-ethiopic">{branch.name_am}</div>
                        )}
                        {branch.name_or && (
                          <div className="text-[10px] text-gray-400 italic">{branch.name_or}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                            config.badge
                          )}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-black">{REGION_MAP[branch.region_id] || `Region ${branch.region_id}`}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{branch.zone_id || "Direct Branch"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[11px] font-mono text-gray-700">{branch.phone || "—"}</div>
                        <div className="text-[10px] text-gray-400 truncate max-w-[160px]">{branch.email || "—"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-green-50 text-green-700">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <Link
                            href={`/admin/members?branch_id=${branch.id}`}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-[#ED1C24] text-[10px] font-black uppercase tracking-wider transition-colors"
                          >
                            Members
                          </Link>
                          <Link
                            href={`/admin/volunteers?search=${branch.id}`}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-[#ED1C24] text-[10px] font-black uppercase tracking-wider transition-colors"
                          >
                            Volunteers
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Branch Detail Slide-over / Modal */}
      <AnimatePresence>
        {selectedBranch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBranch(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-8 overflow-hidden z-10 space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                        (BRANCH_TYPE_CONFIG[selectedBranch.branch_type] || BRANCH_TYPE_CONFIG.ZONAL_BRANCH).badge
                      )}
                    >
                      {(BRANCH_TYPE_CONFIG[selectedBranch.branch_type] || BRANCH_TYPE_CONFIG.ZONAL_BRANCH).label}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 font-mono">
                      ID: {selectedBranch.id}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-black tracking-tight">{selectedBranch.name}</h2>
                  {selectedBranch.name_am && (
                    <p className="text-sm font-bold text-gray-600 mt-1 font-ethiopic">{selectedBranch.name_am}</p>
                  )}
                  {selectedBranch.name_or && (
                    <p className="text-xs font-semibold text-gray-400 italic">{selectedBranch.name_or}</p>
                  )}
                </div>

                <button
                  onClick={() => setSelectedBranch(null)}
                  className="h-9 w-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Geographic Hierarchy Info */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50/70 p-4 rounded-2xl border border-gray-100 text-xs">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Assigned Region</p>
                  <p className="font-black text-black mt-0.5">{REGION_MAP[selectedBranch.region_id] || `Region ${selectedBranch.region_id}`}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Zone Mapping</p>
                  <p className="font-black text-black mt-0.5">{selectedBranch.zone_id || "All Zones / Central"}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Branch Contact & Office Details
                </Label>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-[9px] font-bold uppercase text-gray-400">Physical Address</p>
                      <p className="font-bold text-black">{selectedBranch.address || "Main Red Cross Zonal Office Compound"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-[9px] font-bold uppercase text-gray-400">Phone</p>
                        <p className="font-bold text-black font-mono">{selectedBranch.phone || "+251 11 000 0000"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase text-gray-400">Email</p>
                        <p className="font-bold text-black font-mono truncate">{selectedBranch.email || "info@ercs.org"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <Link
                  href={`/admin/members?branch_id=${selectedBranch.id}`}
                  className="p-3 rounded-2xl bg-gray-50 hover:bg-red-50 hover:text-[#ED1C24] border border-gray-100 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Users className="h-4 w-4 text-gray-400 group-hover:text-[#ED1C24] mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Branch Members</span>
                </Link>
                <Link
                  href={`/admin/volunteers?search=${selectedBranch.id}`}
                  className="p-3 rounded-2xl bg-gray-50 hover:bg-red-50 hover:text-[#ED1C24] border border-gray-100 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <HandHeart className="h-4 w-4 text-gray-400 group-hover:text-[#ED1C24] mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Volunteers</span>
                </Link>
                <Link
                  href={`/admin/user-management?branch_id=${selectedBranch.id}`}
                  className="p-3 rounded-2xl bg-gray-50 hover:bg-red-50 hover:text-[#ED1C24] border border-gray-100 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <ShieldCheck className="h-4 w-4 text-gray-400 group-hover:text-[#ED1C24] mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Branch Officers</span>
                </Link>
              </div>

              {/* Close Button */}
              <Button
                onClick={() => setSelectedBranch(null)}
                className="w-full h-11 rounded-2xl font-black text-xs uppercase tracking-wider bg-black hover:bg-[#ED1C24] text-white transition-all"
              >
                Close Details
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
