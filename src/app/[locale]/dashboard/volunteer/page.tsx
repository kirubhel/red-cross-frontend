"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HandHeart, 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Users,
  ChevronRight,
  Filter,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function VolunteerPage() {
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  
  // Log Hours Form
  const [logForm, setLogForm] = useState({
    requestId: "",
    hours: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reqRes, histRes] = await Promise.all([
          api.get("/volunteer/open-requests"),
          api.get("/volunteer/history")
        ]);
        setActiveRequests(reqRes.data.requests || []);
        setHistory(histRes.data.assignments || []);
      } catch (err) {
        console.error("Failed to fetch volunteer data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogHours = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/volunteer/log-hours", {
        request_id: logForm.requestId,
        hours: parseFloat(logForm.hours),
        description: logForm.description,
        date: logForm.date
      });
      toast.success("Hours logged successfully!", {
        description: "Thank you for your service."
      });
      setIsLogModalOpen(false);
      // Refresh history
      const histRes = await api.get("/volunteer/history");
      setHistory(histRes.data.assignments || []);
    } catch (err) {
      toast.error("Failed to log hours");
    }
  };

  const handleApply = async (requestId: string) => {
    try {
      await api.post("/volunteer/apply", { request_id: requestId });
      toast.success("Application submitted!", {
        description: "The organization will review your profile."
      });
    } catch (err) {
      toast.error("Failed to apply", {
        description: "You may have already applied to this opportunity."
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Plus className="h-12 w-12 text-[#ED1C24]" strokeWidth={3} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-black">Volunteering</h1>
          <p className="text-black/40 font-bold uppercase tracking-widest text-[10px] mt-1">
            Manage your service and find new opportunities
          </p>
        </div>
        <Button 
          onClick={() => setIsLogModalOpen(true)}
          className="bg-[#ED1C24] hover:bg-black text-white px-8 h-14 rounded-2xl font-black tracking-widest uppercase text-xs shadow-xl shadow-red-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Log Service Hours
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Feed: Open Requests */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <HandHeart className="h-5 w-5 text-[#ED1C24]" />
              Open Opportunities
            </h2>
            <div className="flex items-center gap-2">
               <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><Search className="h-4 w-4" /></button>
               <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><Filter className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="grid gap-4">
            {activeRequests.length > 0 ? (
              activeRequests.map((req, idx) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">
                        {req.org_name}
                      </span>
                      <h3 className="text-lg font-black tracking-tight group-hover:text-[#ED1C24] transition-colors leading-tight">
                        {req.title}
                      </h3>
                    </div>
                    <Button 
                      onClick={(e) => { e.stopPropagation(); handleApply(req.id); }}
                      className="bg-black hover:bg-[#ED1C24] text-white px-6 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg"
                    >
                      Apply Now
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 font-medium">
                    {req.description}
                  </p>

                  {/* Skills/Activities tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {req.activities_skills?.split(',').map((skill: string, sIdx: number) => (
                      <span key={sIdx} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-400">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-gray-400 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold">
                      <MapPin className="h-3.5 w-3.5" /> {req.location || "Addis Ababa"}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold">
                      <Calendar className="h-3.5 w-3.5" /> {req.date || "Next Week"}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold">
                      <Users className="h-3.5 w-3.5" /> {req.volunteers_needed || 5} Needed
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-gray-50 rounded-[40px] p-20 text-center space-y-4 border-2 border-dashed border-gray-200">
                <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <HandHeart className="h-10 w-10 text-gray-200" />
                </div>
                <div>
                  <h4 className="text-lg font-black">No open requests</h4>
                  <p className="text-sm text-gray-400 font-medium">Check back later for new volunteering opportunities.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Recent Activity */}
        <div className="space-y-6">
           <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#ED1C24]" />
              Recent Service
            </h2>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-6 space-y-6">
              {history.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-red-50 group-hover:border-red-100 transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-gray-400 group-hover:text-[#ED1C24]" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex justify-between">
                       <p className="text-xs font-black truncate max-w-[150px]">{item.title || "Humanitarian Aid"}</p>
                       <span className="text-[10px] font-bold text-gray-400">{item.hours} hrs</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              
              <Button variant="ghost" className="w-full h-12 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#ED1C24] hover:bg-red-50">
                 View Full History <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Impact Box */}
            <div className="bg-black rounded-[40px] p-8 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-3xl" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-6">Your Lifetime Impact</h3>
               <div className="space-y-1">
                  <p className="text-5xl font-black tracking-tighter">
                    {history.reduce((acc, curr) => acc + (curr.hours || 0), 0)}
                  </p>
                  <p className="text-sm font-bold opacity-60">Total Service Hours</p>
               </div>
            </div>
        </div>
      </div>

      {/* Log Hours Modal */}
      <AnimatePresence>
        {isLogModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[40px] p-8 shadow-2xl relative z-10 border border-gray-100"
            >
              <button 
                onClick={() => setIsLogModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>

              <div className="mb-8">
                <h3 className="text-2xl font-black tracking-tighter">Log Service Hours</h3>
                <p className="text-sm text-gray-400 font-medium">Record your volunteer work for verification.</p>
              </div>

              <form onSubmit={handleLogHours} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Mission / Task Name</label>
                  <Input 
                    placeholder="e.g. Food Distribution" 
                    className="h-14 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-[#ED1C24]/10 font-bold"
                    value={logForm.description}
                    onChange={(e) => setLogForm({...logForm, description: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Hours Served</label>
                    <Input 
                      type="number"
                      placeholder="0.0" 
                      step="0.5"
                      className="h-14 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-[#ED1C24]/10 font-bold"
                      value={logForm.hours}
                      onChange={(e) => setLogForm({...logForm, hours: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Date</label>
                    <Input 
                      type="date"
                      className="h-14 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-[#ED1C24]/10 font-bold"
                      value={logForm.date}
                      onChange={(e) => setLogForm({...logForm, date: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all">
                   Submit for Verification
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
