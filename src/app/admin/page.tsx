"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  BarChart3, Settings2, Download, RefreshCcw, FileText, ChevronDown,
  Maximize, Minimize, Layout, Map, Info, TrendingUp, Users, Target,
  Play, Pause
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ERCS_RED = "#ED1C24";
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', ERCS_RED, '#8b5cf6'];

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
  const [isAutoPlay, setIsAutoPlay] = useState(false);

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

  // Auto-Play Logic
  useEffect(() => {
    let interval: any;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setFilterRegionId(prev => {
          const next = prev + 1;
          return next > 14 ? 0 : next;
        });
        setFilterZoneId(0);
        setFilterWoredaId(0);
      }, 10000); // Cycle every 10 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const selectedRegionName = REGIONS_LIST.find(r => r.value === filterRegionId)?.label || "Global";

  return (
    <div className="flex flex-row gap-6 overflow-x-auto no-scrollbar h-[calc(100vh-60px)] pb-6 items-start">
      
      {/* Column 1: Strategic Overview & Spotlight */}
      <div className="flex flex-col gap-6 min-w-[450px] lg:min-w-[550px] h-full">
        {/* Header & Filters moved inside the column or floating? Let's keep it in column 1 */}
        <div className={cn(
          "flex flex-col gap-6 bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 transition-all duration-500",
          isFullscreen ? "sticky top-0 z-[100] shadow-xl" : ""
        )}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border-2 border-[#ED1C24] flex items-center justify-center text-[#ED1C24] bg-red-50/50">
              <Layout className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-black tracking-tight">{selectedRegionName} Portal</h1>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Live Infrastructure Monitoring</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              onClick={() => setIsAutoPlay(!isAutoPlay)} 
              variant="outline" 
              className={cn(
                "h-9 px-3 rounded-xl font-black text-[9px] uppercase tracking-widest border-gray-100 gap-2",
                isAutoPlay ? "bg-red-50 text-[#ED1C24] border-[#ED1C24]" : ""
              )}
            >
              {isAutoPlay ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              {isAutoPlay ? "Stop" : "Auto-Play"}
            </Button>
            <Button onClick={toggleFullscreen} variant="outline" className="h-9 w-9 rounded-xl p-0 border-gray-100">
              {isFullscreen ? <Minimize className="h-3 w-3" /> : <Maximize className="h-3 w-3" />}
            </Button>
            
            {/* Location Filters - Compacted */}
            <div className="flex gap-2 w-full mt-2">
                {/* Region Compact */}
                <div className="relative group flex-1">
                    <div className="bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-100 cursor-pointer hover:bg-gray-100">
                        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest block">Region</span>
                        <span className="text-xs font-black text-black truncate">{REGIONS_LIST.find(r => r.value === filterRegionId)?.label || "Global"}</span>
                    </div>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[250px] overflow-y-auto custom-scrollbar-small">
                        <div onClick={() => { setFilterRegionId(0); setFilterZoneId(0); }} className="px-3 py-2 text-[10px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">Global</div>
                        {REGIONS_LIST.map(r => (
                            <div key={r.value} onClick={() => { setFilterRegionId(r.value); setFilterZoneId(0); }} className="px-3 py-2 text-[10px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">{r.label}</div>
                        ))}
                    </div>
                </div>
                {/* Zone Compact */}
                <div className="relative group flex-1">
                    <div className="bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-100 cursor-pointer hover:bg-gray-100">
                        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest block">Zone</span>
                        <span className="text-xs font-black text-black truncate">{zones.find(z => z.id === filterZoneId)?.name || "All"}</span>
                    </div>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[250px] overflow-y-auto custom-scrollbar-small">
                        <div onClick={() => setFilterZoneId(0)} className="px-3 py-2 text-[10px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">All Zones</div>
                        {zones.filter(z => filterRegionId === 0 || z.region_id === filterRegionId).map(z => (
                            <div key={z.id} onClick={() => setFilterZoneId(z.id)} className="px-3 py-2 text-[10px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">{z.name}</div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* KPI Grid in Column 1 */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Members", value: loading ? "..." : kpis.totalMembers.toString(), trend: kpis.growthRate, icon: Users, color: "blue" },
            { label: "Pending", value: loading ? "..." : kpis.pendingApps.toString(), trend: "Review", icon: Info, color: "amber" },
            { label: "Revenue", value: loading ? "..." : `ETB ${kpis.settled.toLocaleString()}`, trend: kpis.collectionRate, icon: TrendingUp, color: "green" },
            { label: "Overdue", value: loading ? "..." : `ETB ${kpis.outstanding.toLocaleString()}`, trend: "Alert", icon: Target, color: "red" },
          ].map((kpi, i) => (
            <motion.div key={i} whileHover={{ y: -2, scale: 1.02 }} className="bg-white rounded-3xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 relative overflow-hidden group">
               <div className={cn("absolute -top-4 -right-4 h-16 w-16 rounded-full opacity-[0.03]", kpi.color === "blue" ? "bg-blue-500" : kpi.color === "amber" ? "bg-amber-500" : kpi.color === "green" ? "bg-green-500" : "bg-red-500")} />
               <div className="text-2xl font-black text-black tracking-tighter mb-0.5 leading-none">{kpi.value}</div>
               <div className="text-[8px] text-gray-400 font-black uppercase tracking-widest">{kpi.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Regional Spotlight in Column 1 */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {filterRegionId > 0 ? (
              <motion.div 
                key={filterRegionId}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="bg-black text-white rounded-[40px] p-8 h-full relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Map className="h-32 w-32" /></div>
                <div className="relative z-10">
                   <span className="px-2 py-0.5 bg-[#ED1C24] text-[8px] font-black uppercase tracking-widest rounded-full">Spotlight</span>
                   <h2 className="text-4xl font-black tracking-tighter mt-2 mb-4 leading-none">{selectedRegionName}</h2>
                   <div className="flex gap-4">
                      <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                         <div className="text-xl font-black">{((kpis.totalMembers / (allPeople.length || 1)) * 100).toFixed(1)}%</div>
                         <div className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Natl. Share</div>
                      </div>
                      <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                         <div className="text-xl font-black">{(kpis.settled / 1000).toFixed(1)}K</div>
                         <div className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Local Rev</div>
                      </div>
                   </div>
                </div>
                <div className="mt-8 pt-4 border-t border-white/5 overflow-x-auto no-scrollbar">
                   <div className="flex gap-3 min-w-max">
                      {zones.filter(z => z.region_id === filterRegionId).map((z, i) => (
                        <div key={i} className="px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                           <div className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Zone</div>
                           <div className="text-[10px] font-black truncate max-w-[80px]">{z.name}</div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 h-full flex flex-col items-center justify-center text-center p-8">
                 <Map className="h-12 w-12 text-gray-200 mb-4" />
                 <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Select a Region to Unlock Insights</div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Column 2: Demographics & Enrollment */}
      <div className="flex flex-col gap-6 min-w-[400px] lg:min-w-[450px] h-full">
        {/* Gender Distribution */}
        <div className="bg-white rounded-[40px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-4 bg-[#ED1C24] rounded-full" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Gender Dist.</h3>
          </div>
          <div className="flex-1 min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} fill="#8884d8" paddingAngle={2} dataKey="value">
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enrollment Category */}
        <div className="bg-white rounded-[40px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-4 bg-[#ED1C24] rounded-full" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Enrollment</h3>
          </div>
          <div className="flex-1 min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={enrollmentData} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#6b7280', fontWeight: 'bold' }} width={80} />
                <Tooltip cursor={{ fill: '#fef2f2' }} content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#ED1C24" radius={[0, 4, 4, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Column 3: Growth & Financial Health */}
      <div className="flex flex-col gap-6 min-w-[450px] lg:min-w-[500px] h-full">
        {/* Growth Analysis */}
        <div className="bg-white rounded-[40px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-black rounded-full" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Growth Analytics</h3>
            </div>
          </div>
          <div className="flex-1 min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 'bold' }} dy={5} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 'bold' }} dx={-5} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="members" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Health */}
        <div className="bg-white rounded-[40px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-4 bg-black rounded-full" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Financial Health</h3>
          </div>
          <div className="flex-1 min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={financeData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} fill="#8884d8" paddingAngle={2} dataKey="value">
                  {financeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#f59e0b', '#10b981', ERCS_RED][index % 3]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Column 4: Geography & Activity */}
      <div className="flex flex-col gap-6 min-w-[400px] lg:min-w-[450px] h-full">
        {/* Geographic Reach */}
        <div className="bg-white rounded-[40px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-4 bg-[#ED1C24] rounded-full" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Top Jurisdictions</h3>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geographicData} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#6b7280', fontWeight: 'bold' }} angle={-45} textAnchor="end" height={50} />
                <YAxis hide />
                <Tooltip cursor={{ fill: '#fef2f2' }} content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20}>
                  {geographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[40px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 h-[320px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-black rounded-full" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Log</h3>
            </div>
            <button className="text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-black">All</button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar-small pr-2">
            {allPeople.slice(0, 8).map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white border border-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-400 capitalize">
                    {p.first_name?.[0]}{p.father_name?.[0]}
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-black leading-none">{p.first_name}</div>
                    <div className="text-[8px] text-gray-500 font-bold">{new Date(p.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
