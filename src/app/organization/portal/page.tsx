"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Users, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  LogOut,
  Send,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
import Image from "next/image";

type VolunteerRequest = {
  id: string;
  headcount: number;
  activities_skills: string;
  status: string;
  created_at: string;
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    REJECTED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  };
  
  const icons = {
    PENDING: <Clock className="h-3 w-3" />,
    APPROVED: <CheckCircle2 className="h-3 w-3" />,
    REJECTED: <AlertCircle className="h-3 w-3" />,
    COMPLETED: <ShieldCheck className="h-3 w-3" />
  };

  const key = status.toUpperCase() as keyof typeof styles;
  
  return (
    <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${styles[key] || styles.PENDING}`}>
      {icons[key] || icons.PENDING}
      {status}
    </div>
  );
};

export default function OrganizationPortal() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<VolunteerRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [headcount, setHeadcount] = useState("");
  const [skills, setSkills] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    const role = localStorage.getItem("user_role");
    
    if (!token || (role !== "ORGANIZATION" && role !== "8")) {
      router.push("/login");
      return;
    }

    fetchPortalData();
  }, []);

  const fetchPortalData = async () => {
    try {
      const res = await api.get("/organizations/requests");
      setRequests(res.data.requests || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      // toast.error("Failed to load portal data");
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headcount || !skills) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/organizations/requests", {
        headcount: Number(headcount),
        activities_skills: skills,
      });
      toast.success("Volunteer request created!");
      setShowForm(false);
      setHeadcount("");
      setSkills("");
      fetchPortalData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative"
        >
          <div className="h-16 w-16 border-t-4 border-r-4 border-[#ED1C24] rounded-full" />
          <Plus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#ED1C24]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row overflow-hidden">
      {/* Aesthetic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#ED1C24]/10 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] opacity-10" />
      </div>

      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-[#0A0A0A] border-r border-white/5 p-8 flex flex-col z-10">
        <div className="flex items-center gap-3 mb-16">
          <div className="bg-[#ED1C24] p-2 rounded-xl group hover:scale-110 transition-transform cursor-pointer">
            <Plus className="h-6 w-6 text-white" strokeWidth={4} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter leading-none">ERCS PORTAL</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Organization Management</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center justify-between p-4 bg-[#ED1C24] text-white rounded-2xl font-black text-sm transition-all group">
            <span className="flex items-center gap-3">
              <Layers className="h-5 w-5" /> Dashboard
            </span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full flex items-center gap-3 p-4 text-white/40 hover:bg-white/5 hover:text-white rounded-2xl font-black text-sm transition-all group">
            <Building2 className="h-5 w-5" /> Profile Settings
          </button>
          <button className="w-full flex items-center gap-3 p-4 text-white/40 hover:bg-white/5 hover:text-white rounded-2xl font-black text-sm transition-all group">
            <AlertCircle className="h-5 w-5" /> Support
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-8 flex items-center gap-3 p-4 text-rose-500 hover:bg-rose-500/10 rounded-2xl font-black text-sm transition-all group border border-transparent hover:border-rose-500/20"
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                Mission <span className="text-[#ED1C24]">Control</span>
              </h1>
              <p className="text-white/40 font-bold">Manage your humanitarian volunteer requests and impact.</p>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="h-16 px-8 bg-[#ED1C24] hover:bg-white hover:text-black text-white rounded-2xl font-black tracking-widest uppercase text-xs flex items-center gap-2 group transition-all"
            >
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" /> New Volunteer Request
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Active Requests", value: requests.filter(r => r.status === 'PENDING' || r.status === 'APPROVED').length, icon: <Clock className="text-amber-500" />, trend: "+2 this month" },
              { label: "Total Missions", value: requests.length, icon: <TrendingUp className="text-emerald-500" />, trend: "Goal: 20" },
              { label: "Volunteers Needed", value: requests.reduce((acc, r) => acc + (r.status === 'PENDING' ? r.headcount : 0), 0), icon: <Users className="text-[#ED1C24]" />, trend: "Across 4 regions" }
            ].map((stat, i) => (
              <div key={i} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[32px] group hover:border-[#ED1C24]/30 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-[#ED1C24]/10 transition-colors">
                    {stat.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{stat.trend}</span>
                </div>
                <div className="text-4xl font-black tracking-tighter mb-1">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Requests Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black tracking-tighter uppercase tracking-widest text-[#ED1C24]">Recent Requests</h3>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            {requests.length === 0 ? (
              <div className="bg-[#0A0A0A] border border-dashed border-white/10 rounded-[40px] p-20 text-center">
                <div className="h-20 w-20 bg-white/5 rounded-3xl mx-auto flex items-center justify-center mb-6">
                  <Briefcase className="h-10 w-10 text-white/20" />
                </div>
                <h4 className="text-2xl font-black tracking-tight mb-2">No active requests</h4>
                <p className="text-white/40 font-medium max-w-sm mx-auto">You haven't submitted any volunteer requests yet. Click the "New Request" button to get started.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {requests.map((request) => (
                  <motion.div 
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-[#ED1C24]/20 hover:bg-neutral-900/50 transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                         <div className="flex flex-col items-center">
                           <span className="text-lg font-black leading-none">{request.headcount}</span>
                           <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Vols</span>
                         </div>
                      </div>
                      <div className="space-y-1">
                        <StatusBadge status={request.status} />
                        <h4 className="font-black text-lg tracking-tight line-clamp-1">{request.activities_skills}</h4>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20">
                          <Calendar className="h-3 w-3" /> Submitted {new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10">
                         <MessageSquare className="h-5 w-5" />
                       </Button>
                       <Button className="h-12 px-6 bg-white/5 hover:bg-[#ED1C24] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                         View Details
                       </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Request Modal Overlay */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowForm(false)} />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#ED1C24]" />
              
              <div className="mb-10">
                <h2 className="text-3xl font-black tracking-tighter mb-2">New <span className="text-[#ED1C24]">Volunteer Request</span></h2>
                <p className="text-white/40 font-bold">Specify your mission needs to find the right volunteers.</p>
              </div>

              <form onSubmit={handleCreateRequest} className="space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-3 md:col-span-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Headcount</Label>
                    <Input 
                      type="number"
                      placeholder="e.g. 5"
                      value={headcount}
                      onChange={(e) => setHeadcount(e.target.value)}
                      className="h-16 bg-white/5 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#ED1C24]/20 font-bold text-lg"
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Main Activities</Label>
                    <Input 
                      placeholder="e.g. Emergency response support"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="h-16 bg-white/5 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#ED1C24]/20 font-bold text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full h-20 bg-[#ED1C24] hover:bg-white hover:text-black text-white rounded-3xl text-xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-[#ED1C24]/20"
                  >
                    {submitting ? "Sending..." : <span className="flex items-center gap-2">Submit Request <Send className="h-5 w-5" /></span>}
                  </Button>
                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={() => setShowForm(false)}
                    className="w-full h-14 text-white/40 hover:text-white font-black uppercase tracking-widest text-[10px]"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
