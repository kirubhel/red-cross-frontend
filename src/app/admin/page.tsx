"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, HandHeart, CreditCard, Activity, ArrowUpRight, BarChart3, Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from "next/link";
import { Button } from "@/components/ui/button";

const data = [
  { name: 'Add. Ababa', volunteers: 4000 },
  { name: 'Oromia', volunteers: 3000 },
  { name: 'Amhara', volunteers: 2000 },
  { name: 'Sidama', volunteers: 2780 },
  { name: 'Tigray', volunteers: 1890 },
  { name: 'Somali', volunteers: 2390 },
];

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    members: 0,
    volunteers: 0,
    revenue: 0,
    incidents: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        // 1. Fetch Totals
        const [membersRes, volunteersRes, orgsRes, settingsRes] = await Promise.all([
          api.get("/person?page=1&page_size=5"),
          api.get("/volunteers?page=1&page_size=5"),
          api.get("/organizations?page=1&page_size=5"),
          api.get("/system-settings")
        ]);

        const totalMembers = membersRes.data.pagination?.total_items || 0;
        const totalVolunteers = volunteersRes.data.pagination?.total_items || 0;
        const totalOrgs = orgsRes.data.pagination?.total_items || 0;

        setStats({
          members: totalMembers,
          volunteers: totalVolunteers,
          revenue: totalMembers * 250, 
          incidents: totalOrgs, 
        });

        // 2. Regional Distribution
        if (settingsRes.data.settings?.all_regions) {
            const regionsList = JSON.parse(settingsRes.data.settings.all_regions);
            const topRegions = regionsList.slice(0, 6);
            const regionStats = await Promise.all(topRegions.map(async (reg: any) => {
                const res = await api.get(`/volunteers?page=1&page_size=1&region=${reg.id}`);
                return {
                    name: reg.name.replace(" Region", "").substring(0, 8),
                    volunteers: res.data.pagination?.total_items || 0
                };
            }));
            setChartData(regionStats);
        }

        // 3. Process Recent Activity
        const recentA = [
            ...(membersRes.data.people || []).map((m: any) => ({
                title: "New Member",
                desc: `${m.first_name} ${m.father_name} registered`,
                time: "Recently",
                color: "bg-blue-50 text-blue-500",
                icon: Users
            })),
            ...(volunteersRes.data.volunteers || []).map((v: any) => ({
                title: "New Volunteer",
                desc: `${v.first_name || 'Volunteer'} registered`,
                time: "Recently",
                color: "bg-red-50 text-[#ED1C24]",
                icon: HandHeart
            })),
            ...(orgsRes.data.organizations || []).map((o: any) => ({
                title: "New Partner",
                desc: `${o.name} joined`,
                time: "Recently",
                color: "bg-emerald-50 text-emerald-500",
                icon: Building2
            }))
        ].slice(0, 5);
        setActivities(recentA);

      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const statsItems = [
    { 
        title: "Total Members", 
        count: stats.members.toLocaleString(), 
        trend: stats.members > 0 ? "Initial" : "Stable", 
        icon: Users, 
        color: "text-blue-500", 
        bg: "bg-blue-50" 
    },
    { 
        title: "Active Volunteers", 
        count: stats.volunteers.toLocaleString(), 
        trend: stats.volunteers > 0 ? "Initial" : "Stable", 
        icon: HandHeart, 
        color: "text-[#ED1C24]", 
        bg: "bg-red-50" 
    },
    { 
        title: "Monthly Revenue", 
        count: `ETB ${(stats.revenue / 1000).toFixed(1)}K`, 
        trend: stats.revenue > 0 ? "+100%" : "Stable", 
        icon: CreditCard, 
        color: "text-emerald-500", 
        bg: "bg-emerald-50" 
    },
    { 
        title: "Active Partners", 
        count: stats.incidents, 
        trend: stats.incidents > 0 ? "Active" : "Stable", 
        icon: Activity, 
        color: "text-orange-500", 
        bg: "bg-orange-50" 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tighter">Portal Overview</h1>
          <p className="text-gray-500 font-medium mt-1">Monitor all key metrics across ERCS operations.</p>
        </div>
        
        <Link href="/admin/reports">
            <Button className="h-12 px-6 rounded-2xl bg-black hover:bg-[#ED1C24] text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-black/5 transition-all">
                <BarChart3 className="h-4 w-4" /> Detailed Reports
            </Button>
        </Link>
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
              <p className={cn(
                  "text-xs font-bold mt-2 flex items-center gap-1",
                  stat.trend.includes('+') || stat.trend === "Initial" || stat.trend === "Active" || stat.trend === "Stable" ? "text-emerald-500" : "text-red-500"
              )}>
                 {stat.trend.includes('+') ? <ArrowUpRight className="h-3 w-3" /> : null}
                 {stat.trend} <span className="text-gray-400 font-medium ml-1">{stat.trend === "Stable" ? "no change" : "this month"}</span>
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
                        <BarChart data={chartData.length > 0 ? chartData : [
                            { name: 'Loading...', volunteers: 0 },
                            { name: 'Loading...', volunteers: 0 },
                            { name: 'Loading...', volunteers: 0 },
                            { name: 'Loading...', volunteers: 0 }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} dy={10} />
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
                     {(activities.length > 0 ? activities : [
                        { title: "Syncing...", desc: "Fetching latest updates", time: "..", color: "bg-gray-50 text-gray-400", icon: Activity }
                     ]).map((item, i) => (
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
