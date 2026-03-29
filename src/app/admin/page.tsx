"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, HandHeart, CreditCard, Activity, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Add. Ababa', volunteers: 4000 },
  { name: 'Oromia', volunteers: 3000 },
  { name: 'Amhara', volunteers: 2000 },
  { name: 'Sidama', volunteers: 2780 },
  { name: 'Tigray', volunteers: 1890 },
  { name: 'Somali', volunteers: 2390 },
];

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    members: 0,
    volunteers: 0,
    revenue: 0,
    incidents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [membersRes, volunteersRes] = await Promise.all([
          api.get("/person?page=1&page_size=1"),
          api.get("/volunteers?page=1&page_size=1"),
        ]);
        setStats({
          members: membersRes.data.pagination?.total_items || 0,
          volunteers: volunteersRes.data.pagination?.total_items || 0,
          revenue: 1200000, // Placeholder revenue
          incidents: 12, // Placeholder incidents
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsItems = [
    { title: "Total Members", count: stats.members.toLocaleString(), trend: "+20.1%", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Active Volunteers", count: stats.volunteers.toLocaleString(), trend: "+15.0%", icon: HandHeart, color: "text-[#ED1C24]", bg: "bg-red-50" },
    { title: "Monthly Revenue", count: `ETB ${(stats.revenue / 1000000).toFixed(1)}M`, trend: "+35.5%", icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Active Incidents", count: stats.incidents, trend: "Critical", icon: Activity, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-black text-black tracking-tighter">Portal Overview</h1>
        <p className="text-gray-500 font-medium mt-1">Monitor all key metrics across ERCS operations.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsItems.map((stat, i) => (
          <Card key={i} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white pt-6 px-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">{stat.title}</CardTitle>
              <div className={`h-10 w-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                <stat.icon className="h-5 w-5" strokeWidth={2.5} />
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2">
              <div className="text-3xl font-black text-black tracking-tighter">
                {loading ? "..." : stat.count}
              </div>
              <p className="text-xs font-bold mt-2 flex items-center gap-1 text-emerald-500">
                 {stat.trend.includes('+') ? <ArrowUpRight className="h-3 w-3" /> : null}
                 {stat.trend} <span className="text-gray-400 font-medium ml-1">last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Remaining content... */}


      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        
        {/* Chart Column */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl lg:col-span-2 overflow-hidden">
             <CardHeader className="border-b border-gray-50 px-8 py-6">
                <CardTitle className="text-lg font-black tracking-tight text-black">Volunteers per Region</CardTitle>
             </CardHeader>
             <CardContent className="p-8">
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 'bold' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 'bold' }} dx={-10} />
                            <Tooltip cursor={{ fill: '#fef2f2' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                            <Bar dataKey="volunteers" fill="#ED1C24" radius={[6, 6, 0, 0]} maxBarSize={48} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
             </CardContent>
        </Card>

         {/* Activity Column */}
         <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden">
             <CardHeader className="border-b border-gray-50 px-6 py-6">
                <CardTitle className="text-lg font-black tracking-tight text-black">Recent Activity</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                 <div className="divide-y divide-gray-50">
                     {[
                       { title: "New Volunteer", desc: "Abebe Kebede registered", time: "Just now", color: "bg-blue-50 text-blue-500", icon: Users },
                       { title: "Payment Received", desc: "ETB 5,000 from Corporate", time: "2m ago", color: "bg-emerald-50 text-emerald-500", icon: CreditCard },
                       { title: "Mission Updated", desc: "Medical team deployed", time: "1h ago", color: "bg-orange-50 text-orange-500", icon: Activity },
                       { title: "Database Sync", offline: true, desc: "Region 4 offline sync completed", time: "3h ago", color: "bg-purple-50 text-purple-500", icon: HandHeart },
                       { title: "New Volunteer", desc: "Tigist Haile registered", time: "4h ago", color: "bg-blue-50 text-blue-500", icon: Users },
                     ].map((item, i) => (
                         <div key={i} className="flex items-start gap-4 p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                             <div className={`h-10 w-10 flex items-center justify-center rounded-xl shrink-0 ${item.color} group-hover:scale-110 transition-transform`}>
                                <item.icon className="h-5 w-5" />
                             </div>
                             <div className="flex flex-col gap-1 flex-1">
                                 <span className="text-sm font-black text-black leading-none">{item.title}</span>
                                 <span className="text-xs font-medium text-gray-500">{item.desc}</span>
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">{item.time}</span>
                         </div>
                     ))}
                 </div>
             </CardContent>
        </Card>

      </div>
    </div>
  );
}
