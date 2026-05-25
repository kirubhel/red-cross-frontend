"use client";

import { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend, LineChart, Line
} from 'recharts';
import { 
  Users, CheckCircle, Megaphone, Calendar, ChevronDown, Download, FileText, Activity, Trash2, Eye
} from "lucide-react";
import { motion } from "framer-motion";
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

export default function AnalyticsDashboardPage() {
  const [dateRange, setDateRange] = useState("May 1, 2024 - May 31, 2024");

  // Mock Data arrays based on the image
  const kpis = {
    totalVolunteers: 12450,
    activeVolunteers: 8745,
    activeCampaigns: 34,
    events: 18,
    reportsGenerated: 56
  };

  const volunteerGrowthData = [
    { month: 'Jan', volunteers: 2000 }, { month: 'Feb', volunteers: 4000 },
    { month: 'Mar', volunteers: 6000 }, { month: 'Apr', volunteers: 8500 },
    { month: 'May', volunteers: 12450 }, { month: 'Jun', volunteers: 12000 },
    { month: 'Jul', volunteers: 13000 }, { month: 'Aug', volunteers: 14000 },
    { month: 'Sep', volunteers: 14500 }, { month: 'Oct', volunteers: 15000 },
    { month: 'Nov', volunteers: 15500 }, { month: 'Dec', volunteers: 16000 },
  ];

  const monthlyRegistrationsData = [
    { month: 'Jan', registrations: 1500 }, { month: 'Feb', registrations: 1800 },
    { month: 'Mar', registrations: 2100 }, { month: 'Apr', registrations: 2300 },
    { month: 'May', registrations: 2350 }, { month: 'Jun', registrations: 2100 },
    { month: 'Jul', registrations: 1900 }, { month: 'Aug', registrations: 2000 },
    { month: 'Sep', registrations: 1800 }, { month: 'Oct', registrations: 1700 },
    { month: 'Nov', registrations: 1600 }, { month: 'Dec', registrations: 1500 },
  ];

  const regionalData = [
    { name: "Addis Ababa", value: 4250, percentage: 34 },
    { name: "Oromia", value: 3150, percentage: 25 },
    { name: "Amhara", value: 2350, percentage: 19 },
    { name: "SNNPR", value: 1850, percentage: 15 },
    { name: "Tigray", value: 850, percentage: 7 },
  ];

  const campaignStatusData = [
    { name: "Ongoing", value: 16, percentage: 47 },
    { name: "Upcoming", value: 10, percentage: 29 },
    { name: "Completed", value: 6, percentage: 18 },
    { name: "Cancelled", value: 2, percentage: 6 },
  ];

  const userActivityTrendData = [
    { date: 'May 1', logins: 1500, newUsers: 500, actions: 2000 },
    { date: 'May 8', logins: 1200, newUsers: 800, actions: 1800 },
    { date: 'May 15', logins: 1700, newUsers: 600, actions: 2200 },
    { date: 'May 22', logins: 1400, newUsers: 700, actions: 1900 },
    { date: 'May 29', logins: 1600, newUsers: 900, actions: 2100 },
  ];

  const reportsList = [
    { name: "Volunteer Growth Report - May 2024", type: "PDF", date: "May 31, 2024", by: "Admin User" },
    { name: "Campaign Performance Report - Q2", type: "Excel", date: "May 25, 2024", by: "Admin User" },
    { name: "User Activity Report - May 2024", type: "PDF", date: "May 20, 2024", by: "System" },
    { name: "Monthly Overview Report - May 2024", type: "PDF", date: "May 5, 2024", by: "Admin User" },
  ];

  const topPerformingCampaigns = [
    { name: "Clean City Initiative", volunteers: 2450, percentage: 85, color: "bg-green-500", icon: Megaphone },
    { name: "Tree Planting Day", volunteers: 1980, percentage: 72, color: "bg-green-400", icon: Calendar },
    { name: "Blood Donation Drive", volunteers: 1520, percentage: 65, color: "bg-orange-500", icon: Activity },
    { name: "Community Education", volunteers: 1250, percentage: 55, color: "bg-orange-400", icon: Users },
    { name: "Food Support Program", volunteers: 980, percentage: 40, color: "bg-red-500", icon: FileText },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm font-medium text-gray-500">Overview of system statistics and performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white flex items-center gap-2 px-4 shadow-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            {dateRange} <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
          </Button>
          <Button className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-6 flex items-center gap-2 shadow-lg shadow-blue-500/20 tracking-widest uppercase">
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Top KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total Volunteers</p>
          </div>
          <div>
            <h3 className="text-2xl font-black text-black leading-none">{kpis.totalVolunteers.toLocaleString()}</h3>
            <p className="text-[10px] font-bold text-green-500 mt-1">↑ 12.5% <span className="text-gray-400 font-medium">vs Apr 1 - Apr 30</span></p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500 shrink-0">
              <CheckCircle className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Active Volunteers</p>
          </div>
          <div>
            <h3 className="text-2xl font-black text-black leading-none">{kpis.activeVolunteers.toLocaleString()}</h3>
            <p className="text-[10px] font-bold text-green-500 mt-1">↑ 8.2% <span className="text-gray-400 font-medium">vs Apr 1 - Apr 30</span></p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
              <Megaphone className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Active Campaigns</p>
          </div>
          <div>
            <h3 className="text-2xl font-black text-black leading-none">{kpis.activeCampaigns}</h3>
            <p className="text-[10px] font-bold text-green-500 mt-1">↑ 6.7% <span className="text-gray-400 font-medium">vs Apr 1 - Apr 30</span></p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Events</p>
          </div>
          <div>
            <h3 className="text-2xl font-black text-black leading-none">{kpis.events}</h3>
            <p className="text-[10px] font-bold text-green-500 mt-1">↑ 3.1% <span className="text-gray-400 font-medium">vs Apr 1 - Apr 30</span></p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Reports Generated</p>
          </div>
          <div>
            <h3 className="text-2xl font-black text-black leading-none">{kpis.reportsGenerated}</h3>
            <p className="text-[10px] font-bold text-green-500 mt-1">↑ 15.4% <span className="text-gray-400 font-medium">vs Apr 1 - Apr 30</span></p>
          </div>
        </motion.div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volunteer Growth */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-black uppercase tracking-widest">Volunteer Growth</h3>
            <Button variant="outline" className="h-8 text-[10px] font-bold px-3 rounded-lg border-gray-200">
                This Year <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volunteerGrowthData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="volunteers" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6, fill: "#6366f1" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Registrations */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-black uppercase tracking-widest">Monthly Registrations</h3>
            <Button variant="outline" className="h-8 text-[10px] font-bold px-3 rounded-lg border-gray-200">
                This Year <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRegistrationsData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} />
                <Tooltip cursor={{ fill: '#fef2f2' }} content={<CustomTooltip />} />
                <Bar dataKey="registrations" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom 3 Columns Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Volunteers by Region */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-sm font-black text-black uppercase tracking-widest mb-6">Volunteers by Region</h3>
          <div className="flex-1 flex items-center justify-between">
            <div className="w-1/2 relative h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={regionalData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                    {regionalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <p className="text-lg font-black text-black leading-none">{kpis.totalVolunteers}</p>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total</p>
              </div>
            </div>
            <div className="w-1/2 pl-4">
                <ul className="space-y-3">
                    {regionalData.map((item, index) => (
                        <li key={index} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
                                <span className="font-bold text-gray-600">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-black text-black">{item.value.toLocaleString()}</span>
                                <span className="text-[9px] font-bold text-gray-400">({item.percentage}%)</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
          </div>
        </div>

        {/* Active Campaigns by Status */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-sm font-black text-black uppercase tracking-widest mb-6">Active Campaigns by Status</h3>
          <div className="flex-1 flex items-center justify-between">
            <div className="w-1/2 relative h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={campaignStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                    {campaignStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#8b5cf6', ERCS_RED][index]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <p className="text-lg font-black text-black leading-none">{kpis.activeCampaigns}</p>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total</p>
              </div>
            </div>
            <div className="w-1/2 pl-4">
                <ul className="space-y-3">
                    {campaignStatusData.map((item, index) => (
                        <li key={index} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', ERCS_RED][index] }}></div>
                                <span className="font-bold text-gray-600">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-black text-black">{item.value}</span>
                                <span className="text-[9px] font-bold text-gray-400">({item.percentage}%)</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
          </div>
        </div>

        {/* User Activity Trend */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-black uppercase tracking-widest">User Activity Trend</h3>
            <Button variant="outline" className="h-8 text-[10px] font-bold px-3 rounded-lg border-gray-200">
                This Month <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="flex-1 h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userActivityTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 'bold' }} dy={5} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Line type="monotone" name="Logins" dataKey="logins" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" name="New Users" dataKey="newUsers" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" name="Actions" dataKey="actions" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Reports Summary and Top Campaigns Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Reports Summary Table */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-black text-black uppercase tracking-widest mb-6">Reports Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Report Name</th>
                  <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                  <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Generated On</th>
                  <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Generated By</th>
                  <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportsList.map((report, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 text-xs font-bold text-black">{report.name}</td>
                    <td className="py-4 px-4 text-xs font-bold text-gray-600">{report.type}</td>
                    <td className="py-4 px-4 text-xs font-bold text-gray-500">{report.date}</td>
                    <td className="py-4 px-4 text-xs font-bold text-gray-500">{report.by}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50"><Download className="h-4 w-4" /></button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"><Eye className="h-4 w-4" /></button>
                        <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Campaigns */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-black uppercase tracking-widest">Top Performing Campaigns</h3>
            <span className="text-[10px] font-bold text-blue-500 cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-5">
            {topPerformingCampaigns.map((camp, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl ${camp.color.replace('bg-', 'bg-').replace('500', '50')} flex items-center justify-center shrink-0`}>
                  <camp.icon className={`h-5 w-5 ${camp.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold text-black">{camp.name}</p>
                    <p className="text-xs font-black text-black">{camp.volunteers.toLocaleString()} <span className="text-[10px] font-bold text-gray-400 font-normal">Volunteers</span></p>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex items-center">
                    <div className={`h-full ${camp.color} rounded-full`} style={{ width: `${camp.percentage}%` }} />
                    <span className="ml-auto text-[10px] font-black text-gray-400 pl-2">{camp.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
