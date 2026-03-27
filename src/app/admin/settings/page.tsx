"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Globe, 
  MessageSquare, 
  Cpu, 
  Save, 
  Check, 
  MessageSquareText, 
  CreditCard, 
  ShieldCheck,
  Send,
  Link as LinkIcon,
  BellRing,
  History,
  IdCard,
  UserPlus,
  Cake,
  Mail,
  Phone,
  MapPin,
  RefreshCcw,
  AlertTriangle,
  XCircle,
  Braces
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications"); // notifications, landing, contact, system
  const [activeTemplate, setActiveTemplate] = useState("renewal");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const tabs = [
    { id: "notifications", label: "Notification Templates", icon: BellRing },
    { id: "landing", label: "Landing Page Content", icon: Globe },
    { id: "contact", label: "Contact Us", icon: MessageSquare },
    { id: "system", label: "System Settings", icon: Cpu },
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
            <Settings className="h-3.5 w-3.5" strokeWidth={3} /> Dashboard Config
          </div>
          <h1 className="text-4xl font-black text-black tracking-tighter">System Settings</h1>
          <p className="text-gray-500 font-medium">Manage your portal content, contact details, and API integrations.</p>
        </div>

        <Button 
            onClick={handleSave} 
            disabled={saving}
            className={cn(
                "h-12 rounded-xl px-10 font-black transition-all text-white shadow-xl flex items-center gap-2",
                success ? "bg-green-500" : "bg-[#ED1C24] hover:bg-black shadow-red-500/10"
            )}
        >
            {saving ? "Saving Changes..." : success ? <><Check className="h-5 w-5" /> Saved Successfully</> : <><Save className="h-5 w-5" /> Save All Changes</>}
        </Button>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-[24px] border border-gray-100 shadow-sm w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-[18px] text-xs font-black transition-all relative",
              activeTab === tab.id ? "text-black" : "text-gray-400 hover:text-black"
            )}
          >
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-white border border-gray-100 shadow-sm rounded-[18px]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-[#ED1C24]" : "")} />
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      <div className="w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'notifications' && (
            <motion.div 
              key="notifications"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex gap-8 items-start min-h-[700px]"
            >
               {/* Template Sidebar */}
               <div className="w-80 shrink-0 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col sticky top-24">
                  <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                        <BellRing className="h-3.5 w-3.5 text-[#ED1C24]" /> Notification Types
                    </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-1">
                     {[
                        { id: 'renewal', icon: RefreshCcw, label: 'Membership Renewal', sub: 'MembershipRenewal', color: 'text-sky-500', bg: 'bg-sky-50' },
                        { id: 'warning', icon: AlertTriangle, label: 'Expiration Warning', sub: 'MembershipExpirationWarning', color: 'text-amber-500', bg: 'bg-amber-50' },
                        { id: 'rejected', icon: XCircle, label: 'ID Card Rejected', sub: 'IdCardRejected', color: 'text-red-500', bg: 'bg-red-50' },
                        { id: 'wish', icon: Cake, label: 'Birthday Wish', sub: 'BirthdayWish', color: 'text-pink-500', bg: 'bg-pink-50' },
                        { id: 'expired', icon: History, label: 'Membership Expired', sub: 'MembershipExpired', color: 'text-gray-500', bg: 'bg-gray-50' },
                        { id: 'register', icon: UserPlus, label: 'Member Registration', sub: 'MemberRegistration', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        { id: 'approved', icon: IdCard, label: 'ID Card Approved', sub: 'IdCardApproved', color: 'text-blue-500', bg: 'bg-blue-50' },
                     ].map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveTemplate(item.id)}
                            className={cn(
                                "w-full p-4 rounded-3xl transition-all flex items-start gap-4 text-left group",
                                activeTemplate === item.id ? "bg-red-50/50 ring-1 ring-[#ED1C24]/10" : "hover:bg-gray-50"
                            )}
                        >
                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", activeTemplate === item.id ? "bg-white" : item.bg)}>
                                <item.icon className={cn("h-5 w-5", item.color)} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className={cn("text-xs font-black truncate", activeTemplate === item.id ? "text-[#ED1C24]" : "text-black")}>{item.label}</span>
                                    <span className="text-[8px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Active</span>
                                </div>
                                <p className={cn("text-[9px] font-bold truncate tracking-widest uppercase", activeTemplate === item.id ? "text-red-900/40" : "text-black/30")}>{item.sub}</p>
                            </div>
                        </button>
                     ))}
                  </div>
               </div>

               {/* Editor Hub */}
               <div className="flex-1 bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col min-h-[700px]">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-red-50 text-[#ED1C24] rounded-2xl flex items-center justify-center shadow-inner">
                            <RefreshCcw className="h-7 w-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-black tracking-tighter capitalize">{activeTemplate.replace('-', ' ')} Template</h2>
                            <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">{activeTemplate === 'renewal' ? 'MembershipRenewal' : activeTemplate}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">Global Template</span>
                        <Button className="h-12 bg-black hover:bg-[#ED1C24] text-white rounded-xl text-xs font-black uppercase tracking-widest px-6 flex items-center gap-2">
                             Update Content
                        </Button>
                    </div>
                  </div>

                  <div className="p-10 flex gap-10 h-full">
                     {/* Left: Input Fields */}
                     <div className="flex-1 space-y-8">
                        <div className="space-y-3">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Email Subject (EN)</Label>
                           <Input defaultValue="Membership Renewed" className="h-14 bg-gray-50 border-none rounded-2xl font-black text-lg text-black px-6 focus:bg-white" />
                        </div>
                        <div className="space-y-3">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Email Subject (AMH)</Label>
                           <Input placeholder="ኢሜይል ርዕስ..." className="h-14 bg-gray-50 border-none rounded-2xl font-black text-lg text-black px-6 focus:bg-white" />
                        </div>
                        
                        <div className="space-y-3">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Message Template (EN)</Label>
                           <div className="relative group">
                              <textarea 
                                className="w-full h-48 bg-gray-50 border-none rounded-[32px] p-8 font-bold text-black focus:ring-2 focus:ring-red-100 focus:bg-white transition-all resize-none"
                                defaultValue="Congratulations {{memberName}}, your Red Cross Membership has been successfully renewed! We have received your payment. Thank you for continuing to be a valued member. Your renewed Membership ID is {{memberId}}, valid until {{expiredDate}}. You can log in at {{loginUrl}} using your Membership ID."
                              ></textarea>
                              <div className="absolute right-6 bottom-6 h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Braces className="h-4 w-4" />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-3">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Message Template (AMH)</Label>
                           <textarea 
                            className="w-full h-48 bg-gray-50 border-none rounded-[32px] p-8 font-bold text-black focus:ring-2 focus:ring-red-50 transition-all resize-none"
                            placeholder="የመልዕክት አብነት እዚህ ይፃፉ..."
                           ></textarea>
                        </div>
                     </div>

                     {/* Right: Variable Sidebar */}
                     <div className="w-72 space-y-6 shrink-0">
                        <div className="bg-[#ED1C24]/95 p-6 rounded-[32px] text-white space-y-4 shadow-xl shadow-red-500/10">
                            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                                <Braces className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Available Variables</span>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { key: '{{memberName}}', desc: 'Member Full Name' },
                                    { key: '{{memberId}}', desc: 'Membership ID' },
                                    { key: '{{phoneNumber}}', desc: 'Phone Number' },
                                    { key: '{{expiredDate}}', desc: 'Expiry Date' },
                                    { key: '{{loginUrl}}', desc: 'Portal Login URL' },
                                ].map((row) => (
                                    <div key={row.key} className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <code className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-black">{row.key}</code>
                                        </div>
                                        <p className="text-[9px] font-bold text-white/60 tracking-wide">{row.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 border-dashed">
                             <p className="text-[9px] font-black text-black uppercase tracking-[0.2em] mb-3">Pro Tip</p>
                             <p className="text-[10px] font-bold text-black/50 leading-relaxed italic">
                                "Use double braces to inject dynamic data from your database into your messages automatically."
                             </p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'system' && (
            <motion.div 
              key="system"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* SMS Gateway Section */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                   <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                      <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center">
                        <MessageSquareText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-black text-xs uppercase tracking-widest text-black">SMS Gateway</h3>
                        <p className="text-[10px] font-bold text-gray-400">GeezSMS Service Integration</p>
                      </div>
                   </div>

                   <div className="space-y-4 pt-2">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">S M S TOKEN</Label>
                        <div className="relative group/input">
                           <Input 
                             type="password" 
                             defaultValue="••••••••••••••••••••••••••••••••••••••••" 
                             className="h-12 bg-gray-50 border-none rounded-xl font-bold pr-12 focus:bg-white transition-all text-black"
                           />
                           <div className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-green-900 text-white rounded-lg flex items-center justify-center shadow-lg cursor-pointer transform group-hover/input:scale-110 transition-transform">
                              <Save className="h-4 w-4" />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">S M S API URL</Label>
                        <div className="relative group/input">
                           <Input 
                             defaultValue="https://api.geezsms.com/api/v1/sms/send" 
                             className="h-12 bg-gray-50 border-none rounded-xl font-bold pr-12 focus:bg-white transition-all text-black"
                           />
                           <div className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-green-900 text-white rounded-lg flex items-center justify-center shadow-lg cursor-pointer transform group-hover/input:scale-110 transition-transform">
                              <Save className="h-4 w-4" />
                           </div>
                        </div>
                     </div>
                   </div>
                </div>

                {/* Telegram Bot Section */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                   <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                      <div className="h-10 w-10 bg-sky-50 rounded-xl flex items-center justify-center">
                        <Send className="h-5 w-5 text-sky-500" />
                      </div>
                      <div>
                        <h3 className="font-black text-xs uppercase tracking-widest text-black">Telegram Bot</h3>
                        <p className="text-[10px] font-bold text-gray-400">Automated Notification Bot</p>
                      </div>
                   </div>

                   <div className="space-y-4 pt-2">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">TELEGRAM TOKEN</Label>
                        <div className="relative group/input">
                           <Input 
                             type="password" 
                             defaultValue="••••••••••••••••••••••••••••••••••••••••" 
                             className="h-12 bg-gray-50 border-none rounded-xl font-bold pr-12 focus:bg-white transition-all text-black"
                           />
                           <div className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-sky-400 text-white rounded-lg flex items-center justify-center shadow-lg cursor-pointer transform group-hover/input:scale-110 transition-transform">
                              <Save className="h-4 w-4" />
                           </div>
                        </div>
                     </div>
                   </div>
                </div>

                {/* Payment Gateway Section */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                   <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                      <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-black text-xs uppercase tracking-widest text-black">Payment Gateway</h3>
                        <p className="text-[10px] font-bold text-gray-400">Telebirr & Chapa Integration</p>
                      </div>
                   </div>

                   <div className="space-y-4 pt-2">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">MERCHANT KEY</Label>
                        <Input 
                             type="password" 
                             placeholder="Enter key..." 
                             className="h-12 bg-gray-50 border-none rounded-xl font-bold text-black"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">CALLBACK URL</Label>
                        <Input 
                             placeholder="https://api.ercs.et/payment/callback" 
                             className="h-12 bg-gray-50 border-none rounded-xl font-bold text-black"
                        />
                     </div>
                   </div>
                </div>

                {/* Security Section */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                   <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                      <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-[#ED1C24]" />
                      </div>
                      <div>
                        <h3 className="font-black text-xs uppercase tracking-widest text-black">Security Keys</h3>
                        <p className="text-[10px] font-bold text-gray-400">Internal System Protection</p>
                      </div>
                   </div>

                   <div className="space-y-4 pt-2">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">ADMIN SECRET</Label>
                        <Input 
                             type="password" 
                             placeholder="••••••••••••••••" 
                             className="h-12 bg-gray-50 border-none rounded-xl font-bold text-black"
                        />
                     </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm space-y-8"
            >
               <div className="space-y-2">
                 <h3 className="text-2xl font-black tracking-tighter text-black">Landing Page Content</h3>
                 <p className="text-gray-500 font-medium italic text-sm">Update the welcome message and heroic headers of the landing page.</p>
               </div>
               
               <div className="grid grid-cols-1 gap-8">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Main Hero Title</Label>
                    <Input defaultValue="Saving lives, changing minds." className="h-14 bg-gray-50 border-none rounded-2xl font-black text-2xl text-black px-6" />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Mission Description</Label>
                    <textarea 
                        className="w-full h-40 bg-gray-50 border-none rounded-3xl p-6 font-bold text-lg text-black focus:ring-2 focus:ring-red-100"
                        defaultValue="The Ethiopian Red Cross Society (ERCS) was established by government decree on 8 July 1935 with the mission of alleviating human suffering during the second Italo-Ethiopian war."
                    ></textarea>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Hero Image URL</Label>
                    <div className="flex gap-4">
                        <Input defaultValue="/hero-image.jpg" className="h-14 bg-gray-50 border-none rounded-2xl font-bold flex-1 px-6 text-black" />
                        <Button className="h-14 bg-black rounded-2xl px-8 font-black uppercase text-xs tracking-widest">Update Asset</Button>
                    </div>
                 </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div 
              key="contact"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm space-y-8"
            >
               <div className="space-y-2">
                 <h3 className="text-2xl font-black tracking-tighter text-black">Contact & Support</h3>
                 <p className="text-gray-500 font-medium italic text-sm">Manage office locations, email addresses, and phone numbers.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Support Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input defaultValue="info@redcrosseth.org" className="h-14 bg-gray-50 border-none rounded-2xl font-bold pl-12 text-black" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Emergency Hotline</Label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input defaultValue="921" className="h-14 bg-gray-50 border-none rounded-2xl font-bold pl-12 text-black" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">HQ Office Address</Label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-6 h-5 w-5 text-gray-400" />
                        <textarea 
                            className="w-full h-24 bg-gray-50 border-none rounded-3xl p-6 pl-12 font-bold text-black"
                            defaultValue="Kirkos Sub-City, Addis Ababa, Ethiopia"
                        ></textarea>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
