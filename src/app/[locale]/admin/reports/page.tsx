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
  ArrowUpRight, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  exportFinancialReport, 
  exportMembersReport, 
  exportVolunteersReport 
} from "@/lib/report-export";

const ERCS_RED = "#ED1C24";
const BLUE_ACCENT = "#2563eb";
const GREEN_ACCENT = "#16a34a";
const AMBER_ACCENT = "#ea580c";

const PIE_TYPE_COLORS = [BLUE_ACCENT, ERCS_RED, "#9ca3af"];
const PIE_STATUS_COLORS = [BLUE_ACCENT, ERCS_RED, "#f59e0b"];

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

  useEffect(() => {
    fetchLiveStats();
  }, []);

  const fetchLiveStats = async () => {
    try {
      const [peopleRes, volunteersRes] = await Promise.all([
        api.get("/person?page=1&page_size=1").catch(() => ({ data: {} })),
        api.get("/volunteers?page=1&page_size=1").catch(() => ({ data: {} })),
      ]);

      const memberTotal = peopleRes.data?.pagination?.total_items;
      const volTotal = volunteersRes.data?.pagination?.total_items;

      if (memberTotal || volTotal) {
        setStats(prev => ({
          ...prev,
          activeMembers: memberTotal || prev.activeMembers,
          volunteers: volTotal || prev.volunteers,
        }));
      }
    } catch (err) {
      console.error("Error fetching live report numbers:", err);
    }
  };

  // Dedicated real report generators
  const handleDownloadFinancialReport = async (format: "xlsx" | "csv" = "xlsx") => {
    setDownloadingType(`financial-${format}`);
    try {
      toast.loading("Generating financial report...", { id: "report-action" });
      const res = await api.get("/payments");
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
      toast.loading("Compiling registered members list...", { id: "report-action" });
      const res = await api.get("/person?page=1&page_size=5000");
      const people = res.data?.people || [];
      await exportMembersReport(people, format);
      toast.success("Members directory downloaded successfully.", { id: "report-action" });
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
      toast.loading("Compiling volunteers roster...", { id: "report-action" });
      const res = await api.get("/volunteers?page=1&page_size=5000");
      const volunteers = res.data?.volunteers || [];
      await exportVolunteersReport(volunteers, format);
      toast.success("Volunteers roster downloaded successfully.", { id: "report-action" });
    } catch (err) {
      console.error("Volunteers report download failed:", err);
      toast.error("Failed to generate volunteers report.", { id: "report-action" });
    } finally {
      setDownloadingType(null);
      setIsExportMenuOpen(false);
    }
  };

  return (
    <div className="space-y-8 w-full max-w-[1600px] mx-auto pb-16">
      {/* Top ERCS Red and White Brand Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-red-50 rounded-2xl border border-red-100 shrink-0">
            <Image 
              src="/logo.png" 
              alt="ERCS Logo" 
              width={48} 
              height={48} 
              className="object-contain" 
              unoptimized 
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#ED1C24] tracking-tight leading-none">
              Ethiopian Red Cross Society
            </h1>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
              National Headquarters — Official Analytics & Reporting Hub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative">
          <Button 
            onClick={fetchLiveStats} 
            variant="outline" 
            className="rounded-xl border-gray-200 text-gray-600 hover:text-black font-bold text-xs h-11"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" /> Refresh
          </Button>

          {/* Export Report Dropdown */}
          <div className="relative">
            <Button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="bg-[#ED1C24] hover:bg-black text-white rounded-xl h-11 px-5 font-black text-xs shadow-md shadow-red-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="h-4 w-4" /> Export Report <ChevronDown className="h-3.5 w-3.5" />
            </Button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-gray-100 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-1">
                  Choose Download Type
                </p>
                <div className="space-y-1 mt-1">
                  <button
                    onClick={() => handleDownloadFinancialReport("xlsx")}
                    disabled={!!downloadingType}
                    className="w-full text-left px-3 py-2.5 hover:bg-red-50 text-gray-800 hover:text-[#ED1C24] rounded-xl text-xs font-bold transition-all flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2"><CreditCard className="h-3.5 w-3.5 text-[#ED1C24]" /> Financial Report</span>
                    <span className="text-[9px] bg-red-100 text-[#ED1C24] px-1.5 py-0.5 rounded font-black">XLSX</span>
                  </button>

                  <button
                    onClick={() => handleDownloadMembersReport("xlsx")}
                    disabled={!!downloadingType}
                    className="w-full text-left px-3 py-2.5 hover:bg-blue-50 text-gray-800 hover:text-blue-600 rounded-xl text-xs font-bold transition-all flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-blue-600" /> Members Directory</span>
                    <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-black">XLSX</span>
                  </button>

                  <button
                    onClick={() => handleDownloadVolunteersReport("xlsx")}
                    disabled={!!downloadingType}
                    className="w-full text-left px-3 py-2.5 hover:bg-green-50 text-gray-800 hover:text-green-600 rounded-xl text-xs font-bold transition-all flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2"><HandHeart className="h-3.5 w-3.5 text-green-600" /> Volunteers Roster</span>
                    <span className="text-[9px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-black">XLSX</span>
                  </button>

                  <div className="border-t border-gray-100 pt-1 mt-1">
                    <button
                      onClick={() => handleDownloadFinancialReport("csv")}
                      disabled={!!downloadingType}
                      className="w-full text-left px-3 py-2 text-gray-600 hover:text-black rounded-lg text-xs font-semibold flex items-center justify-between"
                    >
                      <span>Financial CSV</span>
                      <span className="text-[9px] text-gray-400">CSV</span>
                    </button>
                    <button
                      onClick={() => handleDownloadMembersReport("csv")}
                      disabled={!!downloadingType}
                      className="w-full text-left px-3 py-2 text-gray-600 hover:text-black rounded-lg text-xs font-semibold flex items-center justify-between"
                    >
                      <span>Members CSV</span>
                      <span className="text-[9px] text-gray-400">CSV</span>
                    </button>
                    <button
                      onClick={() => handleDownloadVolunteersReport("csv")}
                      disabled={!!downloadingType}
                      className="w-full text-left px-3 py-2 text-gray-600 hover:text-black rounded-lg text-xs font-semibold flex items-center justify-between"
                    >
                      <span>Volunteers CSV</span>
                      <span className="text-[9px] text-gray-400">CSV</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 KPI Cards Matching Attached Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Active Members */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-6">
            <h2 className="text-4xl font-extrabold text-[#3b82f6] leading-none mb-3">
              {stats.activeMembers.toLocaleString()}
            </h2>
            <p className="text-sm font-bold text-gray-600 leading-snug">
              Active<br />Members
            </p>
          </div>
          <div className="bg-[#3b82f6] text-white px-5 py-3 text-xs font-bold tracking-wide">
            Indiv. / Org. =&gt; {stats.activeIndiv.toLocaleString()} / {stats.activeOrg}
          </div>
        </div>

        {/* Card 2: Unpaid Members */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-6">
            <h2 className="text-4xl font-extrabold text-[#16a34a] leading-none mb-3">
              {stats.unpaidMembers.toLocaleString()}
            </h2>
            <p className="text-sm font-bold text-gray-600 leading-snug">
              Unpaid<br />Members
            </p>
          </div>
          <div className="bg-[#16a34a] text-white px-5 py-3 text-xs font-bold tracking-wide">
            Indiv. / Org. =&gt; {stats.unpaidIndiv.toLocaleString()} / {stats.unpaidOrg}
          </div>
        </div>

        {/* Card 3: On Renewal List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-6">
            <h2 className="text-4xl font-extrabold text-[#ef4444] leading-none mb-3">
              {stats.renewalMembers.toLocaleString()}
            </h2>
            <p className="text-sm font-bold text-gray-600 leading-snug">
              On Renewal<br />List
            </p>
          </div>
          <div className="bg-[#ef4444] text-white px-5 py-3 text-xs font-bold tracking-wide">
            Indiv. / Org. =&gt; {stats.renewalIndiv.toLocaleString()} / {stats.renewalOrg}
          </div>
        </div>

        {/* Card 4: Volunteer */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-6">
            <h2 className="text-4xl font-extrabold text-[#2563eb] leading-none mb-3">
              {stats.volunteers.toLocaleString()}
            </h2>
            <p className="text-sm font-bold text-gray-600 leading-snug">
              Volunteer
            </p>
          </div>
          <div className="bg-[#2563eb] text-white px-5 py-3 text-xs font-bold tracking-wide">
            Male / Female =&gt; {stats.volunteersMale.toLocaleString()} / {stats.volunteersFemale.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Direct Report Export Hub Cards */}
      <div className="bg-gradient-to-r from-red-50 via-white to-gray-50 rounded-3xl p-6 border border-red-100/70 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#ED1C24] text-white rounded-full text-[9px] font-black uppercase tracking-wider mb-2">
              Instant File Download Center
            </div>
            <h3 className="text-xl font-black text-gray-900">
              Generate &amp; Download Operational Reports
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Exports real-time database records directly to formatted Excel (.xlsx) and CSV files.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Financial Data */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-sm hover:border-red-300 transition-all flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-red-50 text-[#ED1C24] flex items-center justify-center mb-3">
                <CreditCard className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-gray-900">Financial Transactions Report</h4>
              <p className="text-xs text-gray-500 mt-1">
                Invoices, fees, donations, payment statuses, ETB totals and transaction dates.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-2">
              <Button
                onClick={() => handleDownloadFinancialReport("xlsx")}
                disabled={downloadingType === "financial-xlsx"}
                className="flex-1 bg-[#ED1C24] hover:bg-black text-white text-xs font-bold h-9 rounded-xl cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" /> Download Excel
              </Button>
              <Button
                onClick={() => handleDownloadFinancialReport("csv")}
                disabled={downloadingType === "financial-csv"}
                variant="outline"
                className="text-xs font-bold h-9 rounded-xl text-gray-600 hover:text-black"
              >
                CSV
              </Button>
            </div>
          </div>

          {/* Card 2: Registered Members */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-gray-900">Registered Members Directory</h4>
              <p className="text-xs text-gray-500 mt-1">
                Full member list with ERCS ID, regional branches, membership categories and status.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-2">
              <Button
                onClick={() => handleDownloadMembersReport("xlsx")}
                disabled={downloadingType === "members-xlsx"}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold h-9 rounded-xl cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" /> Download Excel
              </Button>
              <Button
                onClick={() => handleDownloadMembersReport("csv")}
                disabled={downloadingType === "members-csv"}
                variant="outline"
                className="text-xs font-bold h-9 rounded-xl text-gray-600 hover:text-black"
              >
                CSV
              </Button>
            </div>
          </div>

          {/* Card 3: Registered Volunteers */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-sm hover:border-green-300 transition-all flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-3">
                <HandHeart className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-gray-900">Registered Volunteers Roster</h4>
              <p className="text-xs text-gray-500 mt-1">
                Volunteers directory, emergency contacts, regions, contributed hours, and readiness.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-2">
              <Button
                onClick={() => handleDownloadVolunteersReport("xlsx")}
                disabled={downloadingType === "volunteers-xlsx"}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold h-9 rounded-xl cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" /> Download Excel
              </Button>
              <Button
                onClick={() => handleDownloadVolunteersReport("csv")}
                disabled={downloadingType === "volunteers-csv"}
                variant="outline"
                className="text-xs font-bold h-9 rounded-xl text-gray-600 hover:text-black"
              >
                CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Row of Pie Charts: Member By Type & Members By Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart 1: Member By Type */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Member By Type</h3>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
            <div className="h-[240px] w-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={INITIAL_MEMBERS_BY_TYPE}
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
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
            <div className="space-y-3">
              {INITIAL_MEMBERS_BY_TYPE.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-3 text-xs font-bold text-gray-700">
                  <span className="w-3.5 h-3.5 rounded-sm shrink-0" style={{ backgroundColor: PIE_TYPE_COLORS[i] }} />
                  <span>{entry.name}</span>
                  <span className="text-gray-400 font-medium">({entry.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pie Chart 2: Members By Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Members By Status</h3>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
            <div className="h-[240px] w-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={INITIAL_MEMBERS_BY_STATUS}
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
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
            <div className="space-y-3">
              {INITIAL_MEMBERS_BY_STATUS.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-3 text-xs font-bold text-gray-700">
                  <span className="w-3.5 h-3.5 rounded-sm shrink-0" style={{ backgroundColor: PIE_STATUS_COLORS[i] }} />
                  <span>{entry.name}</span>
                  <span className="text-gray-400 font-medium">({entry.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Bar Chart: Membership Type */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-gray-900">Membership Type</h3>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#3b82f6]"></span> Male</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#ef4444]"></span> Female</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#f59e0b]"></span> Organization</span>
          </div>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={INITIAL_MEMBERSHIP_TYPES} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => v >= 1000 ? `${v/1000}K` : v} />
              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="male" name="Male" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={22} />
              <Bar dataKey="female" name="Female" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={22} />
              <Bar dataKey="org" name="Organization" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grouped Bar Chart: Member By Region */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-gray-900">Member By Region</h3>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#3b82f6]"></span> Male</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#ef4444]"></span> Female</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#f59e0b]"></span> Organization</span>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={INITIAL_REGIONS_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} angle={-15} textAnchor="end" dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => v >= 1000 ? `${v/1000}K` : v} />
              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="male" name="Male" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="female" name="Female" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="org" name="Organization" fill="#f59e0b" radius={[3, 3, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grouped Bar Chart: Volunteer By Region */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-gray-900">Volunteer By Region</h3>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#3b82f6]"></span> Male</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#ef4444]"></span> Female</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#f59e0b]"></span> Organization</span>
          </div>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={INITIAL_VOLUNTEERS_BY_REGION} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} angle={-15} textAnchor="end" dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => v >= 1000 ? `${v/1000}K` : v} />
              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="male" name="Male" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="female" name="Female" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="org" name="Organization" fill="#f59e0b" radius={[3, 3, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
