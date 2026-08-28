"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { 
  Download, Users, Activity, Megaphone, Calendar, FileText, 
  ArrowUpRight, ArrowDownRight, MapPin, Search, Plus, Filter,
  MoreVertical, Eye, Download as DownloadIcon, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { toast } from "sonner";
import { motion, Variants } from "framer-motion";

// Mock Colors
const COLORS = {
  primary: '#10b981', // green for success/active
  secondary: '#3b82f6', // blue
  danger: '#ef4444', // red
  warning: '#f59e0b', // orange
  purple: '#8b5cf6',
  gray: '#9ca3af'
};

const PIE_COLORS = [COLORS.secondary, COLORS.primary, COLORS.warning, COLORS.danger, COLORS.purple];

// Mock Data
const MOCK_GROWTH = [
  { month: 'Jan', count: 2200 },
  { month: 'Feb', count: 4800 },
  { month: 'Mar', count: 6500 },
  { month: 'Apr', count: 8100 },
  { month: 'May', count: 12450 },
  { month: 'Jun', count: 10000 },
  { month: 'Jul', count: 11000 },
  { month: 'Aug', count: 10500 },
  { month: 'Sep', count: 12000 },
  { month: 'Oct', count: 13000 },
  { month: 'Nov', count: 14500 },
  { month: 'Dec', count: 15500 },
];

const MOCK_REGISTRATIONS = [
  { month: 'Jan', count: 1500 },
  { month: 'Feb', count: 2100 },
  { month: 'Mar', count: 1800 },
  { month: 'Apr', count: 2000 },
  { month: 'May', count: 2350 },
  { month: 'Jun', count: 1500 },
  { month: 'Jul', count: 1800 },
  { month: 'Aug', count: 1600 },
  { month: 'Sep', count: 2000 },
  { month: 'Oct', count: 1900 },
  { month: 'Nov', count: 1500 },
  { month: 'Dec', count: 1400 },
];

const MOCK_REGIONS = [
  { name: 'Addis Ababa', value: 4250, percentage: 34 },
  { name: 'Oromia', value: 3150, percentage: 25 },
  { name: 'Amhara', value: 2350, percentage: 19 },
  { name: 'SNNPR', value: 1850, percentage: 15 },
  { name: 'Tigray', value: 850, percentage: 7 },
];

const MOCK_CAMPAIGNS_STATUS = [
  { name: 'Ongoing', value: 16, percentage: 47 },
  { name: 'Upcoming', value: 10, percentage: 29 },
  { name: 'Completed', value: 6, percentage: 18 },
  { name: 'Cancelled', value: 2, percentage: 6 },
];

const MOCK_USER_ACTIVITY = [
  { date: 'May 1', logins: 1200, newUsers: 400, actions: 1800 },
  { date: 'May 8', logins: 1500, newUsers: 500, actions: 2100 },
  { date: 'May 15', logins: 1100, newUsers: 300, actions: 1600 },
  { date: 'May 22', logins: 1600, newUsers: 600, actions: 2300 },
  { date: 'May 29', logins: 1800, newUsers: 450, actions: 2500 },
];

const MOCK_REPORTS = [
  { id: 1, name: 'Volunteer Growth Report - May 2024', type: 'PDF', generatedOn: 'May 31, 2024', generatedBy: 'Admin User' },
  { id: 2, name: 'Campaign Performance Report - Q2', type: 'Excel', generatedOn: 'May 25, 2024', generatedBy: 'Admin User' },
  { id: 3, name: 'User Activity Report - May 2024', type: 'PDF', generatedOn: 'May 20, 2024', generatedBy: 'System' },
  { id: 4, name: 'Monthly Overview Report - May 2024', type: 'PDF', generatedOn: 'May 5, 2024', generatedBy: 'Admin User' },
];

const MOCK_TOP_CAMPAIGNS = [
  { name: 'Clean City Initiative', volunteers: 2450, percentage: 85, color: '#10b981' },
  { name: 'Tree Planting Day', volunteers: 1980, percentage: 72, color: '#10b981' },
  { name: 'Blood Donation Drive', volunteers: 1520, percentage: 65, color: '#10b981' },
  { name: 'Community Education', volunteers: 1250, percentage: 55, color: '#f59e0b' },
  { name: 'Food Support Program', volunteers: 800, percentage: 40, color: '#ef4444' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function AnalyticsDashboard() {
  const [totalVolunteers, setTotalVolunteers] = useState(12450);
  const [activeVolunteers, setActiveVolunteers] = useState(8745);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const [membersRes, volunteersRes] = await Promise.all([
          api.get("/person?page=1&page_size=1"),
          api.get("/volunteers?page=1&page_size=1"),
        ]);
        
        const mCount = membersRes.data.pagination?.total_items || 0;
        const vCount = volunteersRes.data.pagination?.total_items || 0;
        
        const total = mCount + vCount;
        if (total > 0) {
            setTotalVolunteers(total);
            setActiveVolunteers(Math.floor(total * 0.7)); // Mock active percentage
        }
      } catch (err) {
        console.error("Failed to fetch totals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTotals();
  }, []);

  const handleExport = () => {
    toast.success("Generating Report...");
    setTimeout(() => toast.success("Report downloaded successfully."), 1500);
  };

  const KpiCard = ({ title, value, trend, isPositive, icon: Icon, color }: any) => (
    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
      <div className={`p-3 rounded-xl`} style={{ backgroundColor: `${color}15`, color }}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{value.toLocaleString()}</h3>
        <div className="flex items-center gap-1 text-[11px] font-medium">
          <span className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
            {trend}%
          </span>
          <span className="text-gray-400">vs Apr 1 - Apr 30</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      initial="hidden" 
      animate="show" 
      variants={containerVariants} 
      className="space-y-6 max-w-[1600px] mx-auto pb-10"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of system statistics and performance.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 font-medium">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            May 1, 2024 - May 31, 2024
          </div>
          <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-500/20 px-5 transition-all">
            <Download className="h-4 w-4 mr-2" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard title="Total Volunteers" value={totalVolunteers} trend="12.5" isPositive={true} icon={Users} color="#8b5cf6" />
        <KpiCard title="Active Volunteers" value={activeVolunteers} trend="8.2" isPositive={true} icon={Activity} color="#10b981" />
        <KpiCard title="Active Campaigns" value={34} trend="6.7" isPositive={true} icon={Megaphone} color="#ec4899" />
        <KpiCard title="Events" value={18} trend="3.1" isPositive={true} icon={Calendar} color="#f59e0b" />
        <KpiCard title="Reports Generated" value={56} trend="15.4" isPositive={true} icon={FileText} color="#3b82f6" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volunteer Growth Line Chart */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900">Volunteer Growth</h3>
            <select className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-gray-50 outline-none">
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_GROWTH} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(val) => val >= 1000 ? `${val/1000}K` : val} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Monthly Registrations Bar Chart */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900">Monthly Registrations</h3>
            <select className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-gray-50 outline-none">
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_REGISTRATIONS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(val) => val >= 1000 ? `${val/1000}K` : val} />
                <RechartsTooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Volunteers by Region */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Volunteers by Region</h3>
          <div className="flex items-center justify-between">
            <div className="h-[180px] w-[180px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_REGIONS}
                    cx="50%" cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {MOCK_REGIONS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-gray-900">{totalVolunteers.toLocaleString()}</span>
                <span className="text-[10px] text-gray-500 font-semibold uppercase">Total</span>
              </div>
            </div>
            <div className="space-y-3 flex-1 ml-4">
              {MOCK_REGIONS.map((region, i) => (
                <div key={region.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                    <span className="text-gray-600 font-medium">{region.name}</span>
                  </div>
                  <div className="text-gray-500">
                    {region.value.toLocaleString()} <span className="text-gray-400">({region.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Active Campaigns by Status */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Active Campaigns by Status</h3>
          <div className="flex items-center justify-between">
            <div className="h-[180px] w-[180px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_CAMPAIGNS_STATUS}
                    cx="50%" cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {MOCK_CAMPAIGNS_STATUS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={[COLORS.primary, COLORS.purple, COLORS.secondary, COLORS.danger][index % 4]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-gray-900">34</span>
                <span className="text-[10px] text-gray-500 font-semibold uppercase">Total</span>
              </div>
            </div>
            <div className="space-y-3 flex-1 ml-4">
              {MOCK_CAMPAIGNS_STATUS.map((status, i) => (
                <div key={status.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: [COLORS.primary, COLORS.purple, COLORS.secondary, COLORS.danger][i % 4] }}></span>
                    <span className="text-gray-600 font-medium">{status.name}</span>
                  </div>
                  <div className="text-gray-500">
                    {status.value} <span className="text-gray-400">({status.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* User Activity Trend */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">User Activity Trend</h3>
            <select className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-gray-50 outline-none">
              <option>This Month</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4 mb-4 text-xs font-medium text-gray-600">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Logins</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> New Users</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Actions</span>
          </div>

          <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_USER_ACTIVITY} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(val) => val >= 1000 ? `${val/1000}K` : val} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="actions" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: '#8b5cf6' }} />
                <Line type="monotone" dataKey="logins" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} />
                <Line type="monotone" dataKey="newUsers" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Footer Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports Summary Table */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
          <h3 className="text-base font-bold text-gray-900 mb-6">Reports Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-xs font-semibold text-gray-500">Report Name</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500">Type</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500">Generated On</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500">Generated By</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_REPORTS.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 text-sm font-medium text-gray-800">{report.name}</td>
                    <td className="py-3 text-xs font-medium text-gray-500">{report.type}</td>
                    <td className="py-3 text-xs text-gray-500">{report.generatedOn}</td>
                    <td className="py-3 text-xs text-gray-500">{report.generatedBy}</td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-3 text-gray-400">
                        <DownloadIcon className="h-4 w-4 hover:text-blue-600 cursor-pointer transition-colors" />
                        <Eye className="h-4 w-4 hover:text-gray-900 cursor-pointer transition-colors" />
                        <Trash2 className="h-4 w-4 hover:text-red-500 cursor-pointer transition-colors" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top Performing Campaigns */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900">Top Performing Campaigns</h3>
            <span className="text-xs font-medium text-blue-600 cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-5">
            {MOCK_TOP_CAMPAIGNS.map((campaign, i) => (
              <div key={campaign.name} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-gray-50 border border-gray-100 text-gray-500">
                      <Megaphone className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 leading-none">{campaign.name}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-gray-600">{campaign.volunteers.toLocaleString()} Volunteers</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${campaign.percentage}%`, backgroundColor: campaign.color }} 
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-8">{campaign.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
