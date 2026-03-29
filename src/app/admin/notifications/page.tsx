"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Bell, Send, Mail, Map, Users, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  name: string;
  message: string;
  channel: "SMS" | "EMAIL" | "PUSH";
  created_at: string;
  recipients_count: number;
};


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.campaigns || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
            <Bell className="h-3.5 w-3.5" /> Communication
          </div>
          <h1 className="text-5xl font-black text-black tracking-tighter">Notification Center</h1>
          <p className="text-gray-500 font-medium text-lg">Broadcast urgent messages via SMS, Email, and Push Notifications.</p>
        </div>

        <Button className="bg-[#ED1C24] hover:bg-black text-white rounded-2xl h-14 px-8 font-black shadow-xl shadow-red-500/10 transition-all flex items-center gap-2">
            <Send className="h-5 w-5" /> New Broadcast
        </Button>
      </div>

      <div className="flex w-full items-center space-x-2">
        <div className="relative w-full max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by broadcast ID or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 pl-12 bg-black text-white border-none rounded-2xl font-bold text-lg focus:ring-2 focus:ring-[#ED1C24]/10 transition-all shadow-xl"
            />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Send Sidebar */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-black text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500 transition-all transform rotate-12 translate-x-4 -translate-y-4 font-black text-9xl">SMS</div>
                <h3 className="text-2xl font-black mb-4 flex items-center gap-3"><Mail className="h-6 w-6 text-[#ED1C24]" /> Quick Reach</h3>
                <p className="text-gray-400 font-bold text-sm mb-6 leading-relaxed">Reach all regional coordinators instantly via emergency broadcast.</p>
                <div className="flex flex-col gap-3">
                    <Button className="bg-[#ED1C24] hover:bg-white hover:text-black text-white h-12 rounded-xl transition-all font-black uppercase text-xs tracking-widest">Blast Regional Admins</Button>
                    <Button variant="outline" className="border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 h-12 rounded-xl transition-all font-black uppercase text-xs tracking-widest">Custom Target</Button>
                </div>
            </div>

            <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-black text-black mb-4 flex items-center gap-2"><Map className="h-5 w-5" /> Location Targeting</h3>
                <div className="space-y-3">
                    {["Addis Ababa", "Amhara", "Oromia", "Tigray"].map(region => (
                        <div key={region} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <span className="font-bold text-sm text-gray-600 uppercase tracking-tight">{region}</span>
                            <span className="text-[10px] font-black text-[#ED1C24]">{Math.floor(Math.random() * 50) + 10} Coordinators</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
                <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow className="hover:bg-transparent border-gray-50">
                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Campaign</TableHead>
                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Channel</TableHead>
                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black text-right">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                    <TableRow>
                        <TableCell colSpan={3} className="h-64 text-center">
                            <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin mx-auto mb-4" />
                            <p className="font-bold flex items-center justify-center gap-2 text-gray-400 uppercase tracking-widest text-[10px]">Filtering Records...</p>
                        </TableCell>
                    </TableRow>
                    ) : (
                        notifications.map((n) => (
                            <TableRow key={n.id} className="hover:bg-gray-50/50 transition-colors border-gray-50">
                            <TableCell className="px-8 py-6">
                        <div className="flex flex-col">
                                    <span className="font-black text-black text-lg leading-tight uppercase tracking-tighter">{n.name}</span>
                                    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 group transition-all cursor-default">
                                        <Users className="h-3 w-3" /> {n.recipients_count} Recipients
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="px-8 py-6">
                                <span className={cn(
                                    "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest",
                                    n.channel === "SMS" ? "bg-red-50 text-[#ED1C24]" :
                                    n.channel === "EMAIL" ? "bg-blue-50 text-blue-600" :
                                    "bg-green-50 text-green-600"
                                )}>
                                    {n.channel}
                                </span>
                            </TableCell>
                            <TableCell className="px-8 py-6 text-right font-bold text-gray-400 text-xs">
                                {n.created_at}
                            </TableCell>

                            </TableRow>
                        ))
                    )}
                </TableBody>
                </Table>
            </div>
        </div>
      </div>
    </div>
  );
}
