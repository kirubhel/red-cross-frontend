"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  BarChart3, Settings2, Download, RefreshCcw, FileText, ChevronDown,
  Maximize, Minimize, Layout, Map, Info, TrendingUp, Users, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ERCS_RED = "#ED1C24";
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', ERCS_RED, '#8b5cf6'];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  // Real Data states
  const [kpis, setKpis] = useState({
    totalMembers: 0,
    pendingApps: 0,
    settled: 0,
    outstanding: 0,
    growthRate: "+12.5%",
    collectionRate: "94.2%"
  });

  const [genderData, setGenderData] = useState<any[]>([]);
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
  const [financeData, setFinanceData] = useState<any[]>([]);
  const [geographicData, setGeographicData] = useState<any[]>([]);
  const [growthData, setGrowthData] = useState([
    { year: '2024', members: 950 },
    { year: '2025', members: 79 },
    { year: '2026', members: 3 },
  ]);

  const [allPeople, setAllPeople] = useState<any[]>([]);
  const [allPayments, setAllPayments] = useState<any[]>([]);

  const [filterRegionId, setFilterRegionId] = useState<number>(0);
  const [filterZoneId, setFilterZoneId] = useState<number>(0);
  const [filterWoredaId, setFilterWoredaId] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState("Payment: All");
  const [filterGender, setFilterGender] = useState("Gender: All");

  const [zones, setZones] = useState<any[]>([]);
  const [woredas, setWoredas] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRegionalInsights, setShowRegionalInsights] = useState(false);

  const REGIONS_LIST = [
    { value: 1, label: "Addis Ababa" },
    { value: 2, label: "Dire Dawa" },
    { value: 3, label: "Tigray" },
    { value: 4, label: "Afar" },
    { value: 5, label: "Amhara" },
    { value: 6, label: "Oromia" },
    { value: 7, label: "Somali" },
    { value: 8, label: "Benishangul-Gumuz" },
    { value: 9, label: "SNNPR" },
    { value: 10, label: "Gambela" },
    { value: 11, label: "Harari" },
    { value: 12, label: "Sidama" },
    { value: 13, label: "South West" },
    { value: 14, label: "Federal HQ" }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [peopleRes, paymentsRes, zonesRes, woredasRes] = await Promise.all([
        api.get('/person?page=1&page_size=1000').catch(() => ({ data: { people: [] }})),
        api.get('/payments?page=1&page_size=1000').catch(() => ({ data: { invoices: [] }})),
        api.get('/location/zones').catch(() => ({ data: { zones: [] }})),
        api.get('/location/woredas').catch(() => ({ data: { woredas: [] }}))
      ]);
      
      setAllPeople(peopleRes.data?.people || []);
      setAllPayments(paymentsRes.data?.invoices || []);
      setZones(zonesRes.data?.zones || []);
      setWoredas(woredasRes.data?.woredas || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      // 1. Filter People
      let filteredPeople = allPeople;
      
      const REGIONS: Record<string, string> = {
          "1": "Addis Ababa", "2": "Dire Dawa", "3": "Tigray", "4": "Afar", 
          "5": "Amhara", "6": "Oromia", "7": "Somali", "8": "Benishangul-Gumuz", 
          "9": "SNNPR", "10": "Gambela", "11": "Harari", "12": "Sidama", 
          "13": "South West", "14": "Federal HQ"
      };

      if (filterRegionId > 0) {
          filteredPeople = filteredPeople.filter(p => p.region_id === filterRegionId);
      }
      if (filterZoneId > 0) {
          filteredPeople = filteredPeople.filter(p => p.zone_id === filterZoneId);
      }
      if (filterWoredaId > 0) {
          filteredPeople = filteredPeople.filter(p => p.woreda_id === filterWoredaId);
      }

      if (filterGender !== "Gender: All") {
         const genderVal = filterGender.replace("Gender: ", "").toUpperCase();
         filteredPeople = filteredPeople.filter(p => p.gender === genderVal);
      }

      // 2. Filter Payments 
      let filteredPayments = allPayments;
      if (filterStatus !== "Payment: All") {
         const statusVal = filterStatus.replace("Payment: ", "").toUpperCase();
         if (statusVal === "PAID") {
             filteredPayments = filteredPayments.filter(p => p.status === 'SUCCESS' || p.status === 'PAID');
         } else if (statusVal === "PENDING") {
             filteredPayments = filteredPayments.filter(p => p.status === 'PENDING' || p.status === 'UNPAID');
         }
      }

      // 3. Calculate KPIs
      const pendingPayments = filteredPayments.filter((p: any) => p.status === 'PENDING' || p.status === 'UNPAID');
      const paidPayments = filteredPayments.filter((p: any) => p.status === 'SUCCESS' || p.status === 'PAID');

      const settledAmount = paidPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
      const outstandingAmount = pendingPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

      setKpis({
        totalMembers: filteredPeople.length,
        pendingApps: pendingPayments.length, 
        settled: settledAmount,
        outstanding: outstandingAmount,
        growthRate: "+12.5%",
        collectionRate: paidPayments.length > 0 ? `${((paidPayments.length / filteredPayments.length) * 100).toFixed(1)}%` : "0%"
      });

      // Gender Distribution
      const genders = filteredPeople.reduce((acc: any, p: any) => {
        const g = p.gender || 'UNKNOWN';
        acc[g] = (acc[g] || 0) + 1;
        return acc;
      }, {});
      setGenderData(Object.keys(genders).map(k => ({ name: k, value: genders[k] })));

      // Regional Distribution
      const regionsMap = filteredPeople.reduce((acc: any, p: any) => {
        const r = p.region_id?.toString() || 'Unknown';
        acc[r] = (acc[r] || 0) + 1;
        return acc;
      }, {});
      setGeographicData(Object.keys(regionsMap).map(k => ({ name: REGIONS[k] || `Region ${k}`, value: regionsMap[k] })).sort((a: any, b: any) => b.value - a.value).slice(0, 5));

      // Financial Health
      const statuses = filteredPayments.reduce((acc: any, p: any) => {
        const s = p.status || 'UNKNOWN';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {});
      setFinanceData(Object.keys(statuses).map(k => ({ name: k, value: statuses[k] })));

      // Enrollment Data
      const types = filteredPeople.reduce((acc: any, p: any) => {
        let type = p.membership_plan_id ? `Plan ${p.membership_plan_id}` : (p.membership_type || 'STANDARD');
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
      setEnrollmentData(Object.keys(types).map(k => ({ name: k, value: types[k] })));

  }, [allPeople, allPayments, filterRegionId, filterZoneId, filterWoredaId, filterStatus, filterGender]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const selectedRegionName = REGIONS_LIST.find(r => r.value === filterRegionId)?.label || "Global";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 p-4 font-bold text-xs">
          <p className="text-gray-500 mb-1">{label}</p>
          <p className="text-black scale-110 origin-left">{`${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header & Filters */}
      <div className={cn(
          "flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white rounded-3xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 transition-all duration-500",
          isFullscreen ? "sticky top-0 z-[100] shadow-xl" : ""
      )}>
        <div className="flex items-center gap-3 pl-4">
          <div className="h-10 w-10 rounded-full border-2 border-[#ED1C24] flex items-center justify-center text-[#ED1C24] bg-red-50/50">
            <Layout className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-black tracking-tight">{selectedRegionName} Dashboard</h1>
            <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Live Infrastructure Monitoring</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={toggleFullscreen} variant="outline" className="h-10 w-10 rounded-xl p-0 border-gray-200">
             {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          
          {/* Region Dropdown */}
          <div className="relative group">
            <div className="flex flex-col bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100 cursor-pointer hover:border-gray-200 hover:bg-gray-100 transition-colors">
               <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">Region <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-black transition-colors" /></span>
               <span className="text-sm font-black text-black">{REGIONS_LIST.find(r => r.value === filterRegionId)?.label || "Global (All)"}</span>
            </div>
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[300px] overflow-y-auto">
              <div onClick={() => { setFilterRegionId(0); setFilterZoneId(0); setFilterWoredaId(0); }} className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">Global (All Regions)</div>
              {REGIONS_LIST.map(r => (
                <div key={r.value} onClick={() => { setFilterRegionId(r.value); setFilterZoneId(0); setFilterWoredaId(0); }} className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                  {r.label}
                </div>
              ))}
            </div>
          </div>

          {/* Zone Dropdown */}
          <div className="relative group">
            <div className="flex flex-col bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100 cursor-pointer hover:border-gray-200 hover:bg-gray-100 transition-colors">
               <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">Zone <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-black transition-colors" /></span>
               <span className="text-sm font-black text-black">{zones.find(z => z.id === filterZoneId)?.name || "All Zones"}</span>
            </div>
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[300px] overflow-y-auto">
              <div onClick={() => { setFilterZoneId(0); setFilterWoredaId(0); }} className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">All Zones</div>
              {zones.filter(z => filterRegionId === 0 || z.region_id === filterRegionId).map(z => (
                <div key={z.id} onClick={() => { setFilterZoneId(z.id); setFilterWoredaId(0); }} className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                  {z.name}
                </div>
              ))}
            </div>
          </div>

          {/* Woreda Dropdown */}
          <div className="relative group">
            <div className="flex flex-col bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100 cursor-pointer hover:border-gray-200 hover:bg-gray-100 transition-colors">
               <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">Woreda <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-black transition-colors" /></span>
               <span className="text-sm font-black text-black">{woredas.find(w => w.id === filterWoredaId)?.name || "All Woredas"}</span>
            </div>
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[300px] overflow-y-auto">
              <div onClick={() => setFilterWoredaId(0)} className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">All Woredas</div>
              {woredas.filter(w => filterZoneId === 0 || w.zone_id === filterZoneId).map(w => (
                <div key={w.id} onClick={() => setFilterWoredaId(w.id)} className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                  {w.name}
                </div>
              ))}
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="relative group">
            <div className="flex flex-col bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100 cursor-pointer hover:border-gray-200 hover:bg-gray-100 transition-colors">
               <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">Status <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-black transition-colors" /></span>
               <span className="text-sm font-black text-black">{filterStatus}</span>
            </div>
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {['Payment: All', 'Payment: Paid', 'Payment: Pending'].map(r => (
                <div key={r} onClick={() => setFilterStatus(r)} className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                  {r}
                </div>
              ))}
            </div>
          </div>

          {/* Gender Dropdown */}
          <div className="relative group">
            <div className="flex flex-col bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100 cursor-pointer hover:border-gray-200 hover:bg-gray-100 transition-colors">
               <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">Gender <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-black transition-colors" /></span>
               <span className="text-sm font-black text-black">{filterGender}</span>
            </div>
            <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {['Gender: All', 'Gender: Male', 'Gender: Female'].map(r => (
                <div key={r} onClick={() => setFilterGender(r)} className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Membership Base", value: loading ? "..." : kpis.totalMembers.toString(), trend: kpis.growthRate, icon: Users, color: "blue" },
          { label: "Pending Applications", value: loading ? "..." : kpis.pendingApps.toString(), trend: "Manual Review", icon: Info, color: "amber" },
          { label: "Settled Revenue", value: loading ? "..." : `ETB ${kpis.settled.toLocaleString()}`, trend: kpis.collectionRate, icon: TrendingUp, color: "green" },
          { label: "Outstanding Receivable", value: loading ? "..." : `ETB ${kpis.outstanding.toLocaleString()}`, trend: "Overdue", icon: Target, color: "red" },
        ].map((kpi, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col justify-center relative overflow-hidden group transition-all"
          >
            <div className={cn(
                "absolute -top-4 -right-4 h-24 w-24 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity",
                kpi.color === "blue" ? "bg-blue-500" : 
                kpi.color === "amber" ? "bg-amber-500" : 
                kpi.color === "green" ? "bg-green-500" : "bg-red-500"
            )} />
            <div className="flex items-center justify-between mb-4">
               <div className={cn(
                   "h-10 w-10 rounded-2xl flex items-center justify-center transition-colors",
                   kpi.color === "blue" ? "bg-blue-50 text-blue-500" : 
                   kpi.color === "amber" ? "bg-amber-50 text-amber-500" : 
                   kpi.color === "green" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"
               )}>
                  <kpi.icon className="h-5 w-5" />
               </div>
               <div className={cn(
                   "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                   kpi.color === "blue" ? "bg-blue-50 text-blue-600" : 
                   kpi.color === "amber" ? "bg-amber-50 text-amber-600" : 
                   kpi.color === "green" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
               )}>
                  {kpi.trend}
               </div>
            </div>
            <div className="text-3xl font-black text-black tracking-tighter mb-0.5">{kpi.value}</div>
            <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Regional Spotlight - Only show when a region is selected */}
      <AnimatePresence>
        {filterRegionId > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black text-white rounded-[40px] p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
               <Map className="h-48 w-48" />
            </div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
               <div>
                  <div className="flex items-center gap-3 mb-4">
                     <span className="px-3 py-1 bg-[#ED1C24] text-white text-[10px] font-black uppercase tracking-widest rounded-full">Regional Spotlight</span>
                     <div className="h-px w-12 bg-white/20" />
                  </div>
                  <h2 className="text-5xl font-black tracking-tighter mb-4 leading-none">{selectedRegionName}</h2>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-md">
                     Deep insights for {selectedRegionName} administration. Currently monitoring {kpis.totalMembers} active members and {zones.filter(z => z.region_id === filterRegionId).length} administrative zones within this jurisdiction.
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10">
                     <div className="text-2xl font-black mb-1">{((kpis.totalMembers / (allPeople.length || 1)) * 100).toFixed(1)}%</div>
                     <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Share of National Base</div>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10">
                     <div className="text-2xl font-black mb-1">ETB {(kpis.settled / 1000).toFixed(1)}K</div>
                     <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Localized Revenue</div>
                  </div>
               </div>
            </div>

            {/* Horizontal Zones Scroller */}
            <div className="mt-12 pt-8 border-t border-white/5 overflow-x-auto no-scrollbar">
               <div className="flex gap-4 min-w-max pb-4">
                  {zones.filter(z => z.region_id === filterRegionId).map((z, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                      className="px-6 py-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer transition-colors"
                    >
                       <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Zone {i + 1}</div>
                       <div className="text-xs font-black">{z.name}</div>
                    </motion.div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gender Distribution */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 lg:col-span-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
               <div className="w-1 h-4 bg-[#ED1C24] rounded-full" />
               <h3 className="text-xs font-black uppercase tracking-widest text-black">Distribution by Gender</h3>
             </div>
             <div className="flex gap-2 text-gray-400">
               <Download className="h-4 w-4 cursor-pointer hover:text-black transition-colors" />
               <RefreshCcw className="h-4 w-4 cursor-pointer hover:text-black transition-colors" />
             </div>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} fill="#8884d8" paddingAngle={2} dataKey="value">
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enrollment Category */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
               <div className="w-1 h-4 bg-[#ED1C24] rounded-full" />
               <h3 className="text-xs font-black uppercase tracking-widest text-black">Enrollment Category</h3>
             </div>
             <div className="flex gap-2 text-gray-400">
               <Download className="h-4 w-4 cursor-pointer hover:text-black transition-colors" />
               <RefreshCcw className="h-4 w-4 cursor-pointer hover:text-black transition-colors" />
             </div>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={enrollmentData} margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6b7280', fontWeight: 'bold' }} />
                <Tooltip cursor={{ fill: '#fef2f2' }} content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#ED1C24" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Growth & Retention */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
               <div className="w-1 h-4 bg-black rounded-full" />
               <h3 className="text-xs font-black uppercase tracking-widest text-black">Growth & Retention Analysis</h3>
             </div>
             <div className="flex items-center gap-4">
               <div className="px-4 py-1.5 bg-gray-50 rounded-full text-[10px] font-black uppercase tracking-widest">Yearly</div>
               <div className="flex gap-2 text-gray-400">
                 <Download className="h-4 w-4 cursor-pointer hover:text-black transition-colors" />
                 <RefreshCcw className="h-4 w-4 cursor-pointer hover:text-black transition-colors" />
               </div>
             </div>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} dx={-10} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="members" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Health */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 lg:col-span-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
               <div className="w-1 h-4 bg-black rounded-full" />
               <h3 className="text-xs font-black uppercase tracking-widest text-black">Financial Health</h3>
             </div>
             <div className="flex gap-2 text-gray-400">
               <Download className="h-4 w-4 cursor-pointer hover:text-black transition-colors" />
             </div>
          </div>
          <div className="flex-1 min-h-[250px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={financeData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#8884d8" paddingAngle={2} dataKey="value">
                  {financeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#f59e0b', '#10b981', ERCS_RED][index % 3]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 3 - Geographic Reach */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-2">
               <div className="w-1 h-4 bg-[#ED1C24] rounded-full" />
               <h3 className="text-xs font-black uppercase tracking-widest text-black">Geographic Reach</h3>
             </div>
             <div className="flex gap-2 text-gray-400">
               <Download className="h-4 w-4 cursor-pointer hover:text-black transition-colors" />
               <RefreshCcw className="h-4 w-4 cursor-pointer hover:text-black transition-colors" />
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geographicData} margin={{ bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6b7280', fontWeight: 'bold' }} angle={-45} textAnchor="end" dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} dx={-10} />
                <Tooltip cursor={{ fill: '#fef2f2' }} content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32}>
                  {geographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      {/* Row 4 - Recent Activity */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-2">
               <div className="w-1 h-4 bg-black rounded-full" />
               <h3 className="text-xs font-black uppercase tracking-widest text-black">Recent Activity</h3>
             </div>
             <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">View All</button>
          </div>
          <div className="space-y-4">
             {allPeople.slice(0, 5).map((p, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-full bg-white border border-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:border-red-100 group-hover:text-red-500 transition-colors">
                        {p.first_name?.[0]}{p.father_name?.[0]}
                     </div>
                     <div>
                        <div className="text-sm font-black text-black">{p.first_name} {p.father_name}</div>
                        <div className="text-[10px] text-gray-500 font-bold">{p.email || p.phone_number}</div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="text-[10px] font-black text-black uppercase tracking-tighter">New Registration</div>
                     <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{new Date(p.created_at).toLocaleDateString()}</div>
                  </div>
               </div>
             ))}
             {allPeople.length === 0 && <div className="text-center py-10 text-gray-400 font-bold text-xs">No recent activity</div>}
          </div>
        </div>

    </div>
  );
}
