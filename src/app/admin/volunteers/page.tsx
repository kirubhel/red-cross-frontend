"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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
    Search, 
    HandHeart, 
    Plus, 
    Star, 
    Filter, 
    FileText, 
    Table as TableIcon, 
    X, 
    ArrowUpRight, 
    Phone, 
    Mail, 
    MapPin, 
    Calendar, 
    User,
    Briefcase,
    Home
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type Volunteer = {
  id: string;
  person_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  region: string;
  country: string;
  address: string;
  gender: string;
  date_of_birth: string;
  hoursSpent: number;
  profession?: string;
  email?: string;
  zone_id?: string;
  woreda_id?: string;
  engagement_areas?: string[];
  skills?: string[];
  interests?: string[];
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
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [showModal]);

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

    const headers = ["Name", "Phone", "Region", "Country", "Address", "Hours Spent", "Status"];
    const rows = volunteers.map(v => [
        `${v.first_name} ${v.last_name}`,
        v.phone_number,
        v.region,
        v.country || "Ethiopia",
        v.address || "---",
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

  const handleApprove = async (personId: string) => {
    try {
        await api.put("/volunteers/status", { person_id: personId, status: "ACTIVE" });
        toast.success("Volunteer Approved");
        fetchVolunteers();
    } catch (err) {
        toast.error("Failed to approve volunteer");
    }
  };

  return (
    <div className="space-y-10 print:p-0 text-black">
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
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Address</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Contribution</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                   <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                         <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin"></div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Volunteers...</p>
                      </div>
                   </TableCell>
                </TableRow>
            ) : volunteers.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={6} className="h-32 text-center text-gray-400 font-bold italic text-xs">No volunteers found matching your criteria</TableCell>
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
                        <div className="flex flex-col gap-1">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[9px] font-black uppercase tracking-widest rounded-md w-fit">
                                {regions.find(r => String(r.id) === String(v.region))?.name || v.region || 'N/A'}
                            </span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-tighter ml-1">{v.country || 'Ethiopia'}</span>
                        </div>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                        <span className="text-xs text-gray-500 truncate max-w-[150px] inline-block" title={v.address}>
                            {v.address || '---'}
                        </span>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                            <span className="font-black text-sm text-[#ED1C24]">{v.hoursSpent || 0} <span className="text-[9px] uppercase font-black opacity-50">Hrs</span></span>
                            {v.hoursSpent > 100 && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                        </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <span className={cn(
                                "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest",
                                v.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                            )}>
                                {v.status || "PENDING"}
                            </span>
                            <button 
                                onClick={() => { setSelectedVolunteer(v); setShowModal(true); }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                            >
                                <ArrowUpRight className="h-4 w-4 ml-auto text-gray-300 group-hover:text-[#ED1C24] transition-colors" />
                            </button>
                            {v.status === "PENDING" && (
                                <Button 
                                    onClick={() => handleApprove(v.person_id || v.id)}
                                    className="h-7 px-3 bg-[#ED1C24] text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-all"
                                >
                                    Approve
                                </Button>
                            )}
                        </div>
                    </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Volunteer Detail Modal */}
      {showModal && selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100"
            >
                <div className="p-6 border-b border-gray-50 flex justify-between items-start sticky top-0 bg-white/80 backdrop-blur-md z-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest">Volunteer Profile Audit</p>
                        <h2 className="text-2xl font-black tracking-tight text-black">
                            {selectedVolunteer.first_name} {selectedVolunteer.last_name}
                        </h2>
                        <p className="text-xs font-bold text-gray-400">{selectedVolunteer.person_id || selectedVolunteer.id}</p>
                    </div>
                    <button 
                        onClick={() => setShowModal(false)}
                        className="h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-gray-50 transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">Identity & Bio</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><User className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Gender</p>
                                        <p className="text-xs font-bold text-black">{selectedVolunteer.gender || "Not Specified"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Calendar className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Date of Birth</p>
                                        <p className="text-xs font-bold text-black">{selectedVolunteer.date_of_birth || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Star className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Hours Contributed</p>
                                        <p className="text-xs font-bold text-[#ED1C24]">{selectedVolunteer.hoursSpent || 0} Total Hours</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Briefcase className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Profession</p>
                                        <p className="text-xs font-bold text-black">{selectedVolunteer.profession || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">Contact & Location</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Phone className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Phone</p>
                                        <p className="text-xs font-bold text-black">{selectedVolunteer.phone_number || "No Phone"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><MapPin className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Region / Branch</p>
                                        <p className="text-xs font-bold text-black">
                                            {regions.find(r => String(r.id) === String(selectedVolunteer.region))?.name || "National HQ"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Mail className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Email Address</p>
                                        <p className="text-xs font-bold text-black">{selectedVolunteer.email || "No Email"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Home className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Address / Country</p>
                                        <p className="text-xs font-bold text-black">
                                            {selectedVolunteer.address || "---"} • {selectedVolunteer.country || "Ethiopia"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><MapPin className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Zone / Woreda</p>
                                        <p className="text-xs font-bold text-black">
                                            {selectedVolunteer.zone_id || "---"} • {selectedVolunteer.woreda_id || "---"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    <div className="mt-4 p-5 bg-gray-50 rounded-[24px] border border-gray-100">
                        <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Expertise & Engagement</h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Engagement Areas</p>
                                <div className="flex flex-wrap gap-2">
                                    {(selectedVolunteer.engagement_areas || []).map((area: string) => (
                                        <span key={area} className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-black shadow-sm">
                                            {area}
                                        </span>
                                    ))}
                                    {(!selectedVolunteer.engagement_areas || selectedVolunteer.engagement_areas.length === 0) && <p className="text-xs text-gray-400 font-bold italic">No areas selected</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(selectedVolunteer.skills || []).map((skill: string) => (
                                            <span key={skill} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black uppercase tracking-wider">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Interests</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(selectedVolunteer.interests || []).map((interest: string) => (
                                            <span key={interest} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md text-[9px] font-black uppercase tracking-wider">
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-5 bg-gray-50 rounded-[24px] border border-gray-100">
                        <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Volunteer Status</h4>
                        <div className="flex items-center justify-between">
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                selectedVolunteer.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                            )}>
                                {selectedVolunteer.status || "PENDING APPROVAL"}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                        {selectedVolunteer.status === "PENDING" && (
                            <Button 
                                onClick={() => {
                                    handleApprove(selectedVolunteer.person_id || selectedVolunteer.id);
                                    setShowModal(false);
                                }}
                                className="flex-1 bg-[#ED1C24] text-white rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest"
                            >
                                Approve Volunteer
                            </Button>
                        )}
                        <Button 
                            onClick={() => setShowModal(false)}
                            variant="outline" 
                            className="flex-1 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest border-gray-200"
                        >
                            Close Profile
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
      )}

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
              Confidential Administrative Record • ERCS Humanitarian Management System
          </div>
      </div>
    </div>
  );
}
