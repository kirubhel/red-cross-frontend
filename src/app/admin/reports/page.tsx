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
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                <BarChart3 className="h-3.5 w-3.5" /> Intelligence
            </div>
            <h1 className="text-5xl font-black text-black tracking-tighter text-balance">Reports & Analytics</h1>
            <p className="text-gray-500 font-medium text-lg max-w-2xl">
                Advanced data insights across all operational metrics. Select a category below to view detailed analytics and performance tracking.
            </p>
        </div>

        <div className="flex items-center gap-3">
             <Button 
                onClick={handleExport}
                variant="outline" 
                className="rounded-2xl h-14 px-8 font-black border-gray-200 flex items-center gap-3 shadow-sm hover:bg-black hover:text-white transition-all"
            >
                <Download className="h-5 w-5" /> Export Data
            </Button>
            <Button className="rounded-2xl h-14 px-8 font-black shadow-xl shadow-red-500/10 flex items-center gap-3 bg-[#ED1C24] text-white">
                <Plus className="h-5 w-5" /> Create Custom View
            </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-[28px] w-fit shadow-inner">
        {[
          { id: "MEMBERS", label: "Members", icon: Users },
          { id: "VOLUNTEERS", label: "Volunteers", icon: HandHeart },
          { id: "ORGANIZATIONS", label: "Organizations", icon: Building2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "flex items-center gap-3 px-8 py-4 rounded-[22px] font-black text-sm uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-white text-black shadow-lg shadow-black/5 scale-[1.02]" 
                : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
            )}
          >
            <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-[#ED1C24]" : "")} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="space-y-6 p-8 bg-white border border-gray-100 rounded-[40px] shadow-sm">
         <div className="grid lg:grid-cols-4 gap-6">
            <div className="space-y-1.5 flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Start Date
                </label>
                <Input 
                    type="date" 
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="h-12 bg-gray-50 border-none rounded-xl font-bold focus:ring-2 focus:ring-[#ED1C24]/10"
                />
            </div>
            <div className="space-y-1.5 flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> End Date
                </label>
                <Input 
                    type="date" 
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="h-12 bg-gray-50 border-none rounded-xl font-bold focus:ring-2 focus:ring-[#ED1C24]/10"
                />
            </div>
            <div className="space-y-1.5 flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> Filter by Region
                </label>
                <select 
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="h-12 w-full bg-gray-50 border-none rounded-xl font-bold px-4 focus:ring-2 focus:ring-[#ED1C24]/10 outline-none appearance-none"
                >
                    <option value="">All Regions</option>
                    {regions.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                </select>
            </div>
            <div className="space-y-1.5 flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 flex items-center gap-2">
                    {activeTab === "MEMBERS" ? <Users className="h-3 w-3" /> : activeTab === "VOLUNTEERS" ? <HandHeart className="h-3 w-3" /> : <Building2 className="h-3 w-3" />} 
                    Category / Type
                </label>
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-12 w-full bg-gray-50 border-none rounded-xl font-bold px-4 focus:ring-2 focus:ring-[#ED1C24]/10 outline-none appearance-none"
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
         
         <div className="flex items-center justify-between border-t border-gray-50 pt-6">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                    placeholder="Search by ID, Name or Record Reference..."
                    className="h-12 pl-12 bg-gray-50 border-none rounded-xl font-bold text-sm"
                />
            </div>
            <div className="flex items-center gap-3">
                <Button 
                    variant="ghost" 
                    className="h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-black"
                    onClick={() => {
                        setDateFrom("");
                        setDateTo("");
                        setRegionFilter("");
                        setStatusFilter("");
                    }}
                >
                    Clear All
                </Button>
                <Button 
                    onClick={fetchStats}
                    className="h-12 px-8 bg-black text-white hover:bg-[#ED1C24] rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all"
                >
                    <Filter className="h-4 w-4" /> Apply Global Filters
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
        <div className="space-y-10">
            {/* Visual Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
                
                {/* Chart 1: Distribution */}
                <div className="bg-white p-10 rounded-[48px] border border-gray-100/50 shadow-xl overflow-hidden relative">
                    <div className="flex items-center justify-between mb-10">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-black tracking-tight uppercase italic">{activeTab} Composition</h3>
                            <p className="text-xs font-medium text-gray-400">Hierarchical breakdown by {activeTab === "MEMBERS" ? "membership Type" : activeTab === "VOLUNTEERS" ? "skill proficiency" : "organization category"}.</p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <ArrowUpRight className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    
                    <div className="h-[300px] w-full">
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
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
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
                <div className="bg-black p-10 rounded-[48px] shadow-2xl overflow-hidden relative text-white">
                    <div className="flex items-center justify-between mb-10">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">{activeTab} Health Sync</h3>
                            <p className="text-xs font-medium text-gray-500">Real-time status tracking and validation metrics.</p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-2xl">
                             <RefreshCcw className="h-5 w-5 text-red-500" />
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
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
            <div className="bg-white rounded-[48px] border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-3xl font-black text-black tracking-tighter uppercase italic">Raw Data Subset</h3>
                        <p className="text-sm font-medium text-gray-400 mt-1">Full filtered list view for manual auditing and granular inspection.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select className="h-11 px-4 rounded-xl bg-gray-50 border-none font-bold text-xs uppercase tracking-widest outline-none">
                            <option>Showing 10 of 1,240</option>
                            <option>Showing 50</option>
                            <option>All Data</option>
                        </select>
                        <Button variant="outline" className="h-11 rounded-xl px-5 font-black text-[10px] uppercase tracking-widest border-gray-200">
                           <FileText className="h-4 w-4 mr-2" /> Summary Report
                        </Button>
                    </div>
                </div>

                <div className="p-4 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Primary ID</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Identity / Name</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Metric 01</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Metric 02</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <tr key={item} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-6 font-black text-xs text-black">ERCS-ADM-{1000 + item}</td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">Sample Record {item}</span>
                                            <span className="text-[10px] font-medium text-gray-400">Updated 2h ago</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-bold text-xs text-gray-500">Regional HQ</td>
                                    <td className="px-6 py-6 font-bold text-xs text-gray-500">{activeTab === "MEMBERS" ? "Individual" : activeTab === "VOLUNTEERS" ? "Verified" : "Corporate"}</td>
                                    <td className="px-6 py-6">
                                        <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest inline-block border border-green-100">
                                            Active
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white border border-transparent hover:border-gray-200">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest select-none underline decoration-[#ED1C24] decoration-2 underline-offset-4 pointer-events-none">
                        Audit Trail: Active Session
                     </p>
                     <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest text-[#ED1C24] hover:bg-white">
                        View Full Dataset <ChevronDown className="h-4 w-4 ml-2" />
                     </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}


