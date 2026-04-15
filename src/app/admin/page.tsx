"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  BarChart3, Settings2, Download, RefreshCcw, FileText, ChevronDown
} from "lucide-react";
import api from "@/lib/api";

const ERCS_RED = "#ED1C24";
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', ERCS_RED, '#8b5cf6'];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  // Real Data states
  const [kpis, setKpis] = useState({
    totalMembers: 0,
    pendingApps: 0,
    settled: 0,
    outstanding: 0
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

  const [filterRegion, setFilterRegion] = useState("Global (All Regions)");
  const [filterStatus, setFilterStatus] = useState("Payment: All");
  const [filterGender, setFilterGender] = useState("Gender: All");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [peopleRes, paymentsRes] = await Promise.all([
        api.get('/person?page=1&page_size=1000').catch(() => ({ data: { people: [] }})),
        api.get('/payments?page=1&page_size=1000').catch(() => ({ data: { invoices: [] }}))
      ]);

      setAllPeople(peopleRes.data?.people || []);
      setAllPayments(paymentsRes.data?.invoices || []);
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

      if (filterRegion !== "Global (All Regions)") {
         const regionId = Object.keys(REGIONS).find(k => REGIONS[k] === filterRegion);
         if (regionId) {
             filteredPeople = filteredPeople.filter(p => p.region_id?.toString() === regionId);
         }
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
        outstanding: outstandingAmount
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

  }, [allPeople, allPayments, filterRegion, filterStatus, filterGender]);

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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white rounded-3xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50">
        <div className="flex items-center gap-3 pl-4">
          <div className="h-10 w-10 rounded-full border-2 border-gray-100 flex items-center justify-center text-black">
            <BarChart3 className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight">Admin Dashboard</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Region Dropdown */}
          <div className="relative group">
            <div className="flex flex-col bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100 cursor-pointer hover:border-gray-200 hover:bg-gray-100 transition-colors">
               <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">Region <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-black transition-colors" /></span>
               <span className="text-sm font-black text-black">{filterRegion}</span>
            </div>
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {['Global (All Regions)', 'Addis Ababa', 'Oromia', 'Amhara', 'Federal HQ'].map(r => (
                <div key={r} onClick={() => setFilterRegion(r)} className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                  {r}
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
          { label: "Total Membership Base", value: loading ? "..." : kpis.totalMembers.toString() },
          { label: "Pending Applications", value: loading ? "..." : kpis.pendingApps.toString() },
          { label: "Settled Revenue", value: loading ? "..." : `ETB ${kpis.settled.toLocaleString()}` },
          { label: "Outstanding Receivable", value: loading ? "..." : `ETB ${kpis.outstanding.toLocaleString()}` },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col justify-center">
            <div className="text-3xl font-black text-black tracking-tighter mb-1">{kpi.value}</div>
            <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{kpi.label}</div>
          </div>
        ))}
      </div>

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
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32}>
                  {geographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#10b981' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

    </div>
  );
}
