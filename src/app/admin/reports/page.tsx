"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { 
  Download, 
  Filter, 
  Users, 
  HandHeart, 
  Building2, 
  Calendar,
  ChevronDown,
  Search,
  FileText,
  Table as TableIcon,
  RefreshCcw,
  ArrowUpRight,
  Plus,
  MapPin,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock colors for charts
const COLORS = ['#ED1C24', '#000000', '#4B5563', '#9CA3AF', '#E5E7EB'];

type TabType = "MEMBERS" | "VOLUNTEERS" | "ORGANIZATIONS";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("MEMBERS");
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<any[]>([]);
  
  // Filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Data for Members
  const [memberStats, setMemberStats] = useState<any>({
    byType: [
      { name: 'Annual', value: 400 },
      { name: 'Lifetime', value: 300 },
      { name: 'Corporate', value: 300 },
      { name: 'Youth', value: 200 },
    ],
    byStatus: [
      { name: 'Active', value: 800 },
      { name: 'Pending', value: 150 },
      { name: 'Expired', value: 50 },
    ],
    growth: [
      { month: 'Jan', count: 1200 },
      { month: 'Feb', count: 1350 },
      { month: 'Mar', count: 1500 },
      { month: 'Apr', count: 1800 },
    ]
  });

  // Data for Volunteers
  const [volunteerStats, setVolunteerStats] = useState<any>({
    bySkills: [
        { name: 'First Aid', count: 120 },
        { name: 'DRM', count: 80 },
        { name: 'WASH', count: 65 },
        { name: 'Admin', count: 45 },
    ],
    byStatus: [
        { name: 'Verified', value: 300 },
        { name: 'Pending', value: 80 },
        { name: 'Inactive', value: 20 },
    ]
  });

  // Data for Organizations
  const [orgStats, setOrgStats] = useState<any>({
    byType: [
        { name: 'Government', value: 45 },
        { name: 'Private', value: 32 },
        { name: 'NGO', value: 18 },
    ],
    byStatus: [
        { name: 'Active', value: 85 },
        { name: 'Pending', value: 10 },
    ]
  });

  useEffect(() => {
    fetchRegions();
    fetchStats();
  }, [activeTab]);

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

  const fetchStats = async () => {
    setLoading(true);
    try {
        const [membersRes, volunteersRes] = await Promise.all([
          api.get("/person?page=1&page_size=1"),
          api.get("/volunteers?page=1&page_size=1"),
        ]);
        
        const totalMembers = membersRes.data.pagination?.total_items || 0;
        const totalVolunteers = volunteersRes.data.pagination?.total_items || 0;

        // Spread real totals into mock distributions for visual realism
        if (activeTab === "MEMBERS") {
            setMemberStats((prev: any) => ({
                ...prev,
                byStatus: [
                    { name: 'Active', value: Math.floor(totalMembers * 0.8) },
                    { name: 'Pending', value: Math.floor(totalMembers * 0.15) },
                    { name: 'Expired', value: Math.floor(totalMembers * 0.05) },
                ]
            }));
        } else if (activeTab === "VOLUNTEERS") {
            setVolunteerStats((prev: any) => ({
                ...prev,
                byStatus: [
                    { name: 'Verified', value: Math.floor(totalVolunteers * 0.75) },
                    { name: 'Pending', value: Math.floor(totalVolunteers * 0.2) },
                    { name: 'Inactive', value: Math.floor(totalVolunteers * 0.05) },
                ]
            }));
        }
    } catch (err) {
        console.error("Failed to fetch analytical stats:", err);
    } finally {
        setLoading(false);
    }
  };

  const handleExport = async () => {
    toast.loading("Preparing export...");
    try {
        const ExcelJS = (await import("exceljs")).default;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`${activeTab} Report`);

        // Style and content based on activeTab
        // This is a simplified version of what we'd actually export
        worksheet.addRow(["ERCS System Generated Report"]);
        worksheet.addRow(["Generated At", new Date().toLocaleString()]);
        worksheet.addRow(["Category", activeTab]);
        worksheet.addRow([]);

        const headers = activeTab === "MEMBERS" 
            ? ["ID", "Name", "Region", "Type", "Status", "Created At"]
            : activeTab === "VOLUNTEERS"
            ? ["ID", "Name", "Region", "Skills", "Status"]
            : ["ID", "Organization Name", "Type", "Contact", "Status"];
        
        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true };
        
        // Mock data rows for the export demo
        for (let i = 0; i < 10; i++) {
            worksheet.addRow(headers.map(() => "Sample Data"));
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ercs_${activeTab.toLowerCase()}_report_${new Date().toISOString().split('T')[0]}.xlsx`;
        link.click();
        
        toast.dismiss();
        toast.success("Report Exported Successfully");
    } catch (err) {
        toast.dismiss();
        toast.error("Export failed");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-red-100 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
                <BarChart3 className="h-3 w-3" /> Intelligence
            </div>
            <h1 className="text-3xl font-black text-black tracking-tighter">Reports & Analytics</h1>
            <p className="text-gray-500 font-medium text-sm max-w-xl">
                Operational data insights across all key metrics.
            </p>
        </div>

        <div className="flex items-center gap-2">
             <Button 
                onClick={handleExport}
                variant="outline" 
                className="rounded-xl h-11 px-6 font-black border-2 border-black flex items-center gap-2 hover:bg-black hover:text-white transition-all text-[10px] uppercase tracking-widest"
            >
                <Download className="h-4 w-4" /> Export Data
            </Button>
            <Button className="rounded-xl h-11 px-6 font-black flex items-center gap-2 bg-[#ED1C24] text-white text-[10px] uppercase tracking-widest">
                <Plus className="h-4 w-4" /> Create View
            </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-2xl w-fit shadow-inner">
        {[
          { id: "MEMBERS", label: "Members", icon: Users },
          { id: "VOLUNTEERS", label: "Volunteers", icon: HandHeart },
          { id: "ORGANIZATIONS", label: "Organizations", icon: Building2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-white text-black shadow-md shadow-black/5" 
                : "text-gray-400 hover:text-black"
            )}
          >
            <tab.icon className={cn("h-3.5 w-3.5", activeTab === tab.id ? "text-[#ED1C24]" : "")} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="space-y-4 p-6 bg-white border-2 border-black rounded-[32px] shadow-sm">
         <div className="grid lg:grid-cols-4 gap-4">
            <div className="space-y-1 flex-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-black ml-1 flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-[#ED1C24]" /> Start Date
                </label>
                <Input 
                    type="date" 
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="h-10 bg-white border-2 border-gray-100 rounded-xl font-bold text-black focus:border-[#ED1C24] focus:ring-4 focus:ring-[#ED1C24]/10 transition-all outline-none"
                />
            </div>
            <div className="space-y-1 flex-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-black ml-1 flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-[#ED1C24]" /> End Date
                </label>
                <Input 
                    type="date" 
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="h-10 bg-white border-2 border-gray-100 rounded-xl font-bold text-black focus:border-[#ED1C24] focus:ring-4 focus:ring-[#ED1C24]/10 transition-all outline-none"
                />
            </div>
            <div className="space-y-1 flex-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-black ml-1 flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-[#ED1C24]" /> Region
                </label>
                <select 
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="h-10 w-full bg-white border-2 border-gray-100 rounded-xl font-bold px-4 focus:border-[#ED1C24] focus:ring-4 focus:ring-[#ED1C24]/10 outline-none appearance-none transition-all text-sm"
                >
                    <option value="">All Regions</option>
                    {regions.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                </select>
            </div>
            <div className="space-y-1 flex-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-black ml-1 flex items-center gap-2">
                    {activeTab === "MEMBERS" ? <Users className="h-3 w-3 text-[#ED1C24]" /> : activeTab === "VOLUNTEERS" ? <HandHeart className="h-3 w-3 text-[#ED1C24]" /> : <Building2 className="h-3 w-3 text-[#ED1C24]" />} 
                    Category
                </label>
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 w-full bg-white border-2 border-gray-100 rounded-xl font-bold px-4 focus:border-[#ED1C24] focus:ring-4 focus:ring-[#ED1C24]/10 outline-none appearance-none transition-all text-sm"
                >
                    {activeTab === "MEMBERS" && (
                        <>
                            <option value="">All Membership Types</option>
                            <option value="ANNUAL">Annual</option>
                            <option value="LIFE">Lifetime</option>
                            <option value="CORPORATE">Corporate</option>
                            <option value="YOUTH">Youth</option>
                        </>
                    )}
                    {activeTab === "VOLUNTEERS" && (
                        <>
                            <option value="">All Skill Levels</option>
                            <option value="EXPERT">Expert Proficiency</option>
                            <option value="INTERMEDIATE">Intermediate</option>
                            <option value="BEGINNER">Beginner / New</option>
                        </>
                    )}
                    {activeTab === "ORGANIZATIONS" && (
                        <>
                            <option value="">All Organization Types</option>
                            <option value="GOVERNMENT">Government Agency</option>
                            <option value="NGO">International NGO</option>
                            <option value="PRIVATE">Private Sector</option>
                        </>
                    )}
                </select>
            </div>
         </div>
         
         <div className="flex items-center justify-between border-t border-gray-50 pt-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ED1C24]" />
                <Input 
                    placeholder="Search Records..."
                    className="h-10 pl-10 bg-white border-2 border-black rounded-xl font-bold text-xs"
                />
            </div>
            <div className="flex items-center gap-2">
                <Button 
                    variant="ghost" 
                    className="h-10 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest text-gray-400 hover:text-black"
                    onClick={() => {
                        setDateFrom("");
                        setDateTo("");
                        setRegionFilter("");
                        setStatusFilter("");
                    }}
                >
                    Reset
                </Button>
                <Button 
                    onClick={fetchStats}
                    className="h-10 px-6 bg-black text-white hover:bg-[#ED1C24] rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-black/10"
                >
                    <Filter className="h-3.5 w-3.5" /> Apply
                </Button>
            </div>
         </div>
      </div>


      {/* Dashboard Analytics Section */}
      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-4">
             <RefreshCcw className="h-10 w-10 text-[#ED1C24] animate-spin" />
             <p className="text-xs font-black uppercase tracking-widest text-gray-400">Compiling Analytical Data...</p>
        </div>
      ) : (
        <div className="space-y-6">
            {/* Visual Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                
                {/* Chart 1: Distribution */}
                <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 shadow-xl overflow-hidden relative">
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-black tracking-tight uppercase">{activeTab} Distribution</h3>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
                            <ArrowUpRight className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                    
                    <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {activeTab === "MEMBERS" ? (
                                <PieChart>
                                    <Pie
                                        data={memberStats.byType}
                                        cx="50%" cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {memberStats.byType.map((entry: any, index: any) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                    />
                                    <Legend verticalAlign="bottom" align="center" iconType="circle" />
                                </PieChart>
                            ) : activeTab === "VOLUNTEERS" ? (
                                <BarChart data={volunteerStats.bySkills}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} />
                                    <Tooltip cursor={{ fill: '#F9FAFB' }} />
                                    <Bar dataKey="count" fill="#ED1C24" radius={[10, 10, 0, 0]} barSize={40} />
                                </BarChart>
                            ) : (
                                <PieChart>
                                    <Pie
                                        data={orgStats.byType}
                                        cx="50%" cy="50%"
                                        innerRadius={0}
                                        outerRadius={120}
                                        dataKey="value"
                                    >
                                        {orgStats.byType.map((entry: any, index: any) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend iconType="rect" />
                                </PieChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Status / Growth */}
                <div className="bg-black p-6 rounded-[32px] shadow-2xl overflow-hidden relative text-white">
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-white tracking-tight uppercase">{activeTab} Trends</h3>
                        </div>
                        <div className="bg-white/10 p-2.5 rounded-xl">
                             <RefreshCcw className="h-4 w-4 text-red-500" />
                        </div>
                    </div>

                    <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {activeTab === "MEMBERS" ? (
                                <LineChart data={memberStats.growth}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#4B5563' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#4B5563' }} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                                    />
                                    <Line type="monotone" dataKey="count" stroke="#ED1C24" strokeWidth={4} dot={{ r: 6, fill: '#ED1C24', strokeWidth: 2, stroke: '#000' }} activeDot={{ r: 8 }} />
                                </LineChart>
                            ) : (
                                <BarChart data={activeTab === "VOLUNTEERS" ? volunteerStats.byStatus : orgStats.byStatus}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#4B5563' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#4B5563' }} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#FFFFFF" radius={[10, 10, 10, 10]} barSize={50} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* List Preview Section */}
            <div className="bg-white rounded-[32px] border-2 border-black shadow-xl overflow-hidden">
                <div className="p-6 border-b-2 border-black flex items-center justify-between bg-white">
                    <h3 className="text-lg font-black text-black tracking-tighter uppercase italic">Reports Listing</h3>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-9 rounded-lg px-4 font-black text-[9px] uppercase tracking-widest border-2 border-black">
                           <FileText className="h-3.5 w-3.5 mr-2" /> Quick Summary
                        </Button>
                    </div>
                </div>

                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">ID</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Identity</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Metric 01</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Metric 02</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right pr-10">Audit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <tr key={item} className="hover:bg-[#ED1C24]/5 transition-colors group">
                                    <td className="px-6 py-4 font-black text-[11px] text-black">ERCS-{1000 + item}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs">Sample Record {item}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[11px] text-gray-500">HQ-Region</td>
                                    <td className="px-6 py-4 font-bold text-[11px] text-gray-500">{activeTab === "MEMBERS" ? "Individual" : "Verified"}</td>
                                    <td className="px-6 py-4">
                                        <div className="px-2 py-0.5 bg-green-50 text-green-600 rounded-md text-[9px] font-black uppercase tracking-widest inline-block border border-green-200">
                                            Active
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right pr-10">
                                        <ArrowUpRight className="h-4 w-4 ml-auto text-gray-300 group-hover:text-black transition-colors" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination UI */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Page 1 of 124
                     </p>
                     <div className="flex items-center gap-1">
                        <Button variant="outline" className="h-8 w-8 p-0 rounded-lg border-gray-200 bg-white">
                            <span className="rotate-180">➤</span>
                        </Button>
                        <div className="flex items-center px-3 h-8 bg-black text-white rounded-lg font-black text-[10px]">1</div>
                        <div className="flex items-center px-3 h-8 hover:bg-white rounded-lg font-black text-[10px] cursor-pointer">2</div>
                        <div className="flex items-center px-3 h-8 hover:bg-white rounded-lg font-black text-[10px] cursor-pointer">3</div>
                        <Button variant="outline" className="h-8 w-8 p-0 rounded-lg border-gray-200 bg-white">
                            <span>➤</span>
                        </Button>
                     </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}


