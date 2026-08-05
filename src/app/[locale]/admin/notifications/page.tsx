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
import { Search, Bell, Send, Mail, Map, Users, Settings, X, Plus, RefreshCcw } from "lucide-react";
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

const TEMPLATES = [
  { id: "renew", name: "Membership Renewal", code: "MembershipRenewal", active: true },
  { id: "expire_warn", name: "Expiration Warning", code: "MembershipExpirationWarning", active: true },
  { id: "reject", name: "ID Card Rejected", code: "IdCardRejected", active: true },
  { id: "birthday", name: "Birthday Wish", code: "BirthdayWish", active: true },
  { id: "expired", name: "Membership Expired", code: "MembershipExpired", active: true },
  { id: "register", name: "Member Registration", code: "MemberRegistration", active: true },
  { id: "approve", name: "ID Card Approved", code: "IdCardApproved", active: true },
];

const VARIABLES = [
  { tag: "{{memberName}}", desc: "Member Full Name" },
  { tag: "{{memberId}}", desc: "Membership ID" },
  { tag: "{{phoneNumber}}", desc: "Phone Number" },
  { tag: "{{expiredDate}}", desc: "Expiry Date" },
  { tag: "{{loginUrl}}", desc: "Login URL" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);

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
      // Fallback data for demo
      setNotifications([
        { id: "1", name: "Urgent Meeting", message: "Meeting tomorrow", channel: "SMS", created_at: "2024-05-12", recipients_count: 142 },
        { id: "2", name: "Newsletter Update", message: "Monthly news", channel: "EMAIL", created_at: "2024-05-10", recipients_count: 5020 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-red-100 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
            <Bell className="h-3 w-3" /> Communication
          </div>
          <h1 className="text-3xl font-black text-black tracking-tighter">Notification Center</h1>
          <p className="text-gray-500 font-medium text-sm">Broadcast urgent messages via SMS, Email, and Push Notifications.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowTemplates(true)}
            variant="outline" 
            className="rounded-xl h-10 px-6 font-black shadow-sm flex items-center gap-2 border-gray-200 text-black hover:bg-gray-50"
          >
              <Settings className="h-4 w-4" /> Manage Templates
          </Button>
          <Button className="bg-black hover:bg-[#ED1C24] text-white rounded-xl h-10 px-6 font-black shadow-lg shadow-red-500/10 transition-all flex items-center gap-2">
              <Send className="h-4 w-4" /> New Broadcast
          </Button>
        </div>
      </div>

      <div className="flex w-full items-center space-x-2">
        <div className="relative w-full max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by broadcast ID or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-10 bg-white text-black border border-gray-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-[#ED1C24]/10 transition-all shadow-sm"
            />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Send Sidebar */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-black text-white rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-7xl select-none">SMS</div>
                <h3 className="text-lg font-black mb-2 flex items-center gap-2"><Mail className="h-5 w-5 text-[#ED1C24]" /> Quick Reach</h3>
                <p className="text-gray-400 font-bold text-xs mb-4 leading-relaxed">Reach all regional coordinators instantly via emergency broadcast.</p>
                <div className="flex flex-col gap-2">
                    <Button className="bg-[#ED1C24] hover:bg-white hover:text-black text-white h-10 rounded-lg transition-all font-black uppercase text-[10px] tracking-widest">Blast Admins</Button>
                    <Button variant="outline" className="border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 h-10 rounded-lg transition-all font-black uppercase text-[10px] tracking-widest">Custom Target</Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-black text-black mb-4 flex items-center gap-2"><Map className="h-4 w-4" /> Location Targeting</h3>
                <div className="space-y-2">
                    {["Addis Ababa", "Amhara", "Oromia", "Tigray"].map(region => (
                        <div key={region} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="font-bold text-xs text-gray-600 uppercase tracking-tight">{region}</span>
                            <span className="text-[9px] font-black text-[#ED1C24]">Coordinators</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow className="hover:bg-transparent border-gray-100">
                    <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Campaign</TableHead>
                    <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Channel</TableHead>
                    <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 text-right">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                    <TableRow>
                        <TableCell colSpan={3} className="h-32 text-center text-xs font-bold text-gray-400">
                            Loading...
                        </TableCell>
                    </TableRow>
                    ) : (
                        notifications.map((n) => (
                            <TableRow key={n.id} className="hover:bg-gray-50/50 transition-colors border-gray-50">
                            <TableCell className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="font-black text-black text-sm leading-tight uppercase tracking-tighter">{n.name}</span>
                                    <span className="text-gray-400 font-bold text-[9px] uppercase tracking-widest flex items-center gap-1 mt-1">
                                        <Users className="h-3 w-3" /> {n.recipients_count} Recipients
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <span className={cn(
                                    "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest",
                                    n.channel === "SMS" ? "bg-red-50 text-[#ED1C24]" :
                                    n.channel === "EMAIL" ? "bg-blue-50 text-blue-600" :
                                    "bg-green-50 text-green-600"
                                )}>
                                    {n.channel}
                                </span>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right font-bold text-gray-400 text-xs">
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

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
           <div className="bg-gray-50 w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-2 text-sm">
                    <span className="font-black text-black">Notification Templates</span>
                    <span className="text-gray-300">/</span>
                    <span className="font-bold text-gray-500">Membership</span>
                    <span className="text-gray-300">/</span>
                    <span className="font-bold text-gray-400">Message Management</span>
                 </div>
                 <button onClick={() => setShowTemplates(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black">
                    <X className="h-5 w-5" />
                 </button>
              </div>

              {/* Modal Body */}
              <div className="flex flex-1 overflow-hidden p-6 gap-6">
                 
                 {/* Sidebar: Types */}
                 <div className="w-72 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden shrink-0 shadow-sm">
                    <div className="p-4 border-b border-gray-50 font-black text-xs uppercase tracking-widest flex items-center gap-2 text-black">
                        <Bell className="h-3.5 w-3.5" /> Notification Types
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {TEMPLATES.map(t => (
                            <button
                               key={t.code}
                               onClick={() => setSelectedTemplate(t)}
                               className={cn(
                                   "w-full flex items-center justify-between p-3 rounded-xl transition-all text-left",
                                   selectedTemplate.code === t.code 
                                     ? "bg-blue-50/50 border-l-4 border-blue-500 shadow-sm" 
                                     : "hover:bg-gray-50 border-l-4 border-transparent"
                               )}
                            >
                                <div className="flex items-center gap-3">
                                   <div className={cn(
                                       "h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs",
                                       selectedTemplate.code === t.code ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                                   )}>
                                       {t.name.charAt(0)}
                                   </div>
                                   <div>
                                       <div className={cn("text-xs font-black", selectedTemplate.code === t.code ? "text-blue-700" : "text-black")}>{t.name}</div>
                                       <div className="text-[9px] font-bold text-gray-400 uppercase">{t.code}</div>
                                   </div>
                                </div>
                                {t.active && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[8px] font-black uppercase">Active</span>}
                            </button>
                        ))}
                    </div>
                 </div>

                 {/* Main: Editor */}
                 <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between shrink-0">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                              <RefreshCcw className="h-5 w-5" />
                          </div>
                          <div>
                              <h2 className="text-xl font-black">{selectedTemplate.name}</h2>
                              <p className="text-xs font-bold text-gray-400">{selectedTemplate.code}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Active</span>
                          <Button className="bg-[#10b981] hover:bg-[#059669] text-white rounded-xl h-10 px-6 font-black shadow-md flex items-center gap-2 text-xs">
                              <Settings className="h-3.5 w-3.5" /> Edit Template
                          </Button>
                       </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 flex gap-8 custom-scrollbar">
                       <div className="flex-1 space-y-6">
                           
                           <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><Mail className="h-3 w-3" /> Email Subject (EN)</label>
                               <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold text-black border-dashed">
                                   Membership Renewed
                               </div>
                           </div>

                           <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><Mail className="h-3 w-3" /> Email Subject (AMH)</label>
                               <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold text-gray-400 italic border-dashed">
                                   -
                               </div>
                           </div>

                           <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><MessageSquare className="h-3 w-3" /> Message Template (EN)</label>
                               <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-sm font-medium text-black border-dashed leading-relaxed space-y-4">
                                   <p>Congratulations {`{{memberName}}`}, your ERCS Membership has been successfully renewed!</p>
                                   <p>We have received your payment. Thank you for continuing to be a valued member.<br/>
                                   Your renewed Membership ID is {`{{memberId}}`}, valid until {`{{expiredDate}}`}.</p>
                                   <p>You can log in at {`{{loginUrl}}`} using your Membership ID.</p>
                               </div>
                           </div>

                           <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><MessageSquare className="h-3 w-3" /> Message Template (AMH)</label>
                               <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-sm font-bold text-gray-400 italic border-dashed">
                                   -
                               </div>
                           </div>

                       </div>

                       {/* Variables Sidebar */}
                       <div className="w-64 shrink-0 space-y-4">
                           <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                               {`{x}`} Available Variables
                           </div>
                           <div className="space-y-2">
                               {VARIABLES.map(v => (
                                   <div key={v.tag} className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-gray-200">
                                       <span className="text-[10px] font-black text-green-600 font-mono bg-green-50 px-1.5 py-0.5 rounded">{v.tag}</span>
                                       <span className="text-[9px] font-bold text-gray-400">{v.desc}</span>
                                   </div>
                               ))}
                           </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

// Ensure the icon used exists
import { MessageSquare } from "lucide-react";
