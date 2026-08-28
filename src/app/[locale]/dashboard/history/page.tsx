"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  History, 
  Award, 
  Star, 
  Target, 
  MapPin, 
  Calendar, 
  Clock, 
  Plus,
  CheckCircle2,
  Trophy,
  Users,
  Heart
} from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get("/volunteer/history");
        setHistory(res.data.assignments || []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalHours = history.reduce((acc, curr) => acc + (curr.hours || 0), 0);
  const missionsCount = history.length;

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
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-black">Impact History</h1>
        <p className="text-black/40 font-bold uppercase tracking-widest text-[10px] mt-1">
          A timeline of your humanitarian contributions and service
        </p>
      </div>

      {/* Accomplishments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Total Hours", val: totalHours, icon: Clock, bg: "bg-blue-50", color: "text-blue-600" },
           { label: "Missions Completed", val: missionsCount, icon: Target, bg: "bg-red-50", color: "text-red-600" },
           { label: "Service Points", val: totalHours * 10, icon: Star, bg: "bg-amber-50", color: "text-amber-600" },
           { label: "Recognition", val: missionsCount > 5 ? "SILVER" : "BRONZE", icon: Award, bg: "bg-purple-50", color: "text-purple-600" },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center text-center gap-3">
              <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                 <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div>
                 <p className="text-2xl font-black text-black">{stat.val}</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-10">
         {/* Timeline */}
         <div className="space-y-8">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <History className="h-5 w-5 text-[#ED1C24]" />
              Timeline of Service
            </h2>

            <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
               {history.length > 0 ? (
                 history.map((item, idx) => (
                   <motion.div 
                     key={idx}
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     className="relative pl-12 group"
                   >
                      <div className="absolute left-0 top-1 h-10 w-10 bg-white border-4 border-gray-50 rounded-full flex items-center justify-center z-10 group-hover:border-red-50 transition-colors">
                         <div className="h-2.5 w-2.5 bg-gray-300 rounded-full group-hover:bg-[#ED1C24] transition-colors" />
                      </div>
                      
                      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group-hover:shadow-xl group-hover:shadow-gray-200/50 transition-all">
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                            <div className="space-y-1">
                               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                               <h3 className="text-xl font-black tracking-tight text-gray-900">{item.title || "Humanitarian Assignment"}</h3>
                            </div>
                            <div className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-green-100">
                               <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                            </div>
                         </div>
                         
                         <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
                            {item.description || "Contributed to humanitarian efforts as part of the Ethiopian Red Cross Society volunteer network."}
                         </p>

                         <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                               <Clock className="h-4 w-4 text-[#ED1C24]" /> {item.hours} Hours Served
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                               <MapPin className="h-4 w-4 text-[#ED1C24]" /> {item.location || "Branch Location"}
                            </div>
                         </div>
                      </div>
                   </motion.div>
                 ))
               ) : (
                 <div className="bg-gray-50 rounded-[40px] p-20 text-center space-y-4 border-2 border-dashed border-gray-200 ml-12">
                   <p className="text-sm font-bold text-gray-400">Your humanitarian journey starts here.</p>
                 </div>
               )}
            </div>
         </div>

         {/* Badges & Recognition */}
         <div className="space-y-6">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#ED1C24]" />
              Achievements
            </h2>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 space-y-8">
               <div className="flex gap-6 items-center p-4 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                     <Award className="h-8 w-8 text-[#ED1C24]" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Level</p>
                     <h4 className="text-lg font-black text-black">Bronze Volunteer</h4>
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Unlocked Badges</p>
                  <div className="grid grid-cols-3 gap-4">
                     {[
                       { icon: Heart, label: "First Aid" },
                       { icon: Users, label: "Team Player" },
                       { icon: CheckCircle2, label: "Active" },
                     ].map((badge, i) => (
                       <div key={i} className="flex flex-col items-center gap-2">
                          <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center border-2 border-white shadow-sm">
                             <badge.icon className="h-6 w-6 text-[#ED1C24]" />
                          </div>
                          <span className="text-[8px] font-black uppercase text-gray-400">{badge.label}</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="pt-6 border-t border-gray-50">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-[10px] font-black uppercase text-gray-400">Next Milestone</span>
                     <span className="text-[10px] font-black text-[#ED1C24]">75 / 100 hrs</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full bg-[#ED1C24] w-[75%] rounded-full shadow-[0_0_10px_rgba(237,28,36,0.3)]" />
                  </div>
                  <p className="text-[9px] font-bold text-gray-400 mt-2">25 more hours to reach Silver Level</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
