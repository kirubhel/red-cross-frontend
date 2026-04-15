"use client";

import { useEffect, useState } from "react";
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
import { Search, HandHeart, Plus, Star, Filter, Download, FileText, Table as TableIcon, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type Volunteer = {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  region: string;
  hoursSpent: number;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
};

type Region = {
    id: number;
    name: string;
    code: string;
};

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchVolunteers();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, regionFilter, statusFilter]);

  const fetchRegions = async () => {
    try {
        const res = await api.get("/system-settings");
        if (res.data.settings && res.data.settings.all_regions) {
            setRegions(JSON.parse(res.data.settings.all_regions));
        }
    } catch (err) {
        console.error("Failed to fetch regions:", err);
    }
  };

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const url = `/volunteers?search=${search}&region=${regionFilter}&status=${statusFilter}`;
      const res = await api.get(url);
      setVolunteers(res.data.volunteers || []);
    } catch (err) {
      console.error("Failed to fetch volunteers:", err);
      toast.error("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (volunteers.length === 0) {
        toast.error("No data to export");
        return;
    }

    const headers = ["Name", "Phone", "Region", "Hours Spent", "Status"];
    const rows = volunteers.map(v => [
        `${v.first_name} ${v.last_name}`,
        v.phone_number,
        v.region,
        v.hoursSpent,
        v.status
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ercs_volunteers_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    toast.success("CSV Report Generated");
  };

  const exportToPDF = () => {
    window.print();
    toast.info("Preparing PDF Report...");
  };

  return (
    <div className="space-y-10 print:p-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-red-100 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
            <HandHeart className="h-3 w-3" /> Volunteers System
          </div>
          <h1 className="text-3xl font-black text-black tracking-tighter">Volunteer Registry</h1>
          <p className="text-gray-500 font-medium text-sm">Manage all field volunteers, track hours, and coordinate field activities.</p>
        </div>

        <div className="flex items-center gap-3">
            <Button 
                onClick={exportToCSV}
                variant="outline" 
                className="rounded-xl h-10 px-6 font-black border-gray-200"
            >
                <TableIcon className="h-4 w-4 mr-2" /> Export CSV
            </Button>
            <Button 
                onClick={exportToPDF}
                variant="outline" 
                className="rounded-xl h-10 px-6 font-black border-gray-200"
            >
                <FileText className="h-4 w-4 mr-2" /> Export PDF
            </Button>
            <Button className="rounded-xl h-10 px-6 font-black shadow-lg shadow-red-500/10 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Field Member
            </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 print:hidden">
        <div className="flex w-full items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                placeholder="Search volunteers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-10 bg-white border border-gray-200 shadow-sm text-black rounded-xl font-bold text-sm"
                />
            </div>

            <Button 
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className={`h-10 px-6 rounded-xl font-black flex items-center gap-2 ${showFilters ? 'bg-black text-white' : 'border-gray-200'}`}
            >
                <Filter className="h-4 w-4" /> 
                {showFilters ? 'Hide Filters' : 'Advanced Filters'}
            </Button>
        </div>

        {showFilters && (
            <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Location/Region</label>
                    <select 
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-white border border-gray-200 font-bold text-xs outline-none"
                    >
                        <option value="">All Regions</option>
                        {regions.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Status</label>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-white border border-gray-200 font-bold text-xs outline-none"
                    >
                        <option value="">All Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="PENDING">Pending</option>
                    </select>
                </div>

                <div className="flex items-end pb-0.5">
                    <Button 
                        onClick={() => { setRegionFilter(""); setStatusFilter(""); setSearch(""); }}
                        variant="ghost" 
                        className="h-10 px-4 rounded-lg font-black text-[9px] uppercase tracking-widest text-gray-400"
                    >
                        <X className="h-3 w-3 mr-2" /> Reset
                    </Button>
                </div>
            </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden print:shadow-none print:border-none">
        <Table>
          <TableHeader className="bg-gray-50/50 print:bg-transparent">
            <TableRow className="hover:bg-transparent border-gray-50">
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Volunteer Identity</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Contact</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Location</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Contribution</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                   <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                         <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin" />
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Volunteers...</p>
                      </div>
                   </TableCell>
                </TableRow>
            ) : volunteers.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={5} className="h-32 text-center text-gray-400 font-bold italic text-xs">No volunteers found matching your criteria</TableCell>
                </TableRow>
            ) : (
                volunteers.map((v) => (
                    <TableRow key={v.id} className="hover:bg-gray-50/50 transition-colors border-gray-50 font-bold">
                    <TableCell className="px-6 py-4">
                        <span className="font-black text-black text-sm leading-tight uppercase tracking-tighter">{v.first_name} {v.last_name}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                        <span className="text-xs font-bold text-gray-500">{v.phone_number}</span>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[9px] font-black uppercase tracking-widest rounded-md">
                            {regions.find(r => String(r.id) === String(v.region))?.name || v.region || 'N/A'}
                        </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                            <span className="font-black text-sm text-[#ED1C24]">{v.hoursSpent || 0} <span className="text-[9px] uppercase font-black opacity-50">Hrs</span></span>
                            {v.hoursSpent > 100 && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                        </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                        <span className={cn(
                            "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest",
                            v.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                        )}>
                            {v.status || "PENDING"}
                        </span>
                    </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Print-only Report Header */}
      <div className="hidden print:block mb-8">
          <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-black">Volunteer Registry Report</h1>
                <p className="text-gray-500 font-bold text-lg">Ethiopian Red Cross Society</p>
                <div className="mt-6 grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Region Scope:</span> {regions.find(r => String(r.id) === regionFilter)?.name || "All National Branches"}</div>
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Status Filter:</span> {statusFilter || "All Volunteers"}</div>
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Generated On:</span> {new Date().toLocaleString()}</div>
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Record Count:</span> {volunteers.length}</div>
                </div>
              </div>
              <div className="bg-[#ED1C24] text-white p-6 font-black text-3xl">ERCS</div>
          </div>
          <div className="mt-8 border-t-2 border-dashed border-gray-100 pt-4 text-[10px] font-black uppercase tracking-widest text-gray-300">
              Confidentail Administrative Record • ERCS Humanitarian Management System
          </div>
      </div>
    </div>
  );
}
