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
  Heart,
  ShieldCheck,
  Building2,
  Sparkles
} from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

function cleanHistoryDescription(desc: any): { title?: string; text: string } {
  if (!desc) return { text: "Contributed to humanitarian service as part of the Ethiopian Red Cross Society network." };
  if (typeof desc === "string" && desc.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(desc);
      return {
        title: parsed.title,
        text: parsed.description || parsed.notes || "Humanitarian service mission."
      };
    } catch {
      // Fallback to raw string
    }
  }
  return { text: typeof desc === "string" ? desc : "Humanitarian service mission." };
}

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

  const totalHours = history.reduce((acc, curr) => acc + (curr.hours_worked || curr.hours || 0), 0);
  const missionsCount = history.length;
  const volunteerTier = totalHours >= 100 ? "GOLD" : totalHours >= 50 ? "SILVER" : "BRONZE";
  const nextTierHours = totalHours >= 100 ? 200 : totalHours >= 50 ? 100 : 50;
  const progressPercent = Math.min(100, Math.round((totalHours / nextTierHours) * 100));

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center bg-white">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Plus className="h-10 w-10 text-[#ED1C24]" strokeWidth={3} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-red-50 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-wider border border-red-100">
          <History className="h-3.5 w-3.5" /> Humanitarian Service Record
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black">
          Impact <span className="text-[#ED1C24]">History & Service</span>
        </h1>
        <p className="text-gray-500 font-medium text-sm max-w-2xl">
          A verified chronological timeline of your voluntary contributions, deployments, and humanitarian recognition.
        </p>
      </div>

      {/* Accomplishments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Service Hours", val: `${totalHours} hrs`, icon: Clock, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Missions Completed", val: missionsCount, icon: Target, bg: "bg-red-50", color: "text-[#ED1C24]" },
          { label: "Humanitarian Points", val: `${totalHours * 10} pts`, icon: Star, bg: "bg-amber-50", color: "text-amber-600" },
          { label: "Current Tier", val: volunteerTier, icon: Award, bg: "bg-purple-50", color: "text-purple-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center font-black", stat.bg)}>
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
              <p className="text-2xl font-black text-black">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8 items-start">
        {/* Timeline */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight text-black flex items-center gap-2">
              <History className="h-4 w-4 text-[#ED1C24]" />
              Timeline of Assignments
            </h2>
            <span className="text-xs font-bold text-gray-400">{history.length} Verified Entries</span>
          </div>

          <div className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
            {history.length > 0 ? (
              history.map((item, idx) => {
                const parsed = cleanHistoryDescription(item.description || item.notes);
                const title = item.title || parsed.title || item.activity_name || "Humanitarian Assignment";
                const hours = item.hours_worked || item.hours || 0;
                const formattedDate = item.date || item.created_at || item.assigned_at
                  ? new Date(item.date || item.created_at || item.assigned_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "Recent Service";

                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative pl-12 group"
                  >
                    <div className="absolute left-0 top-1.5 h-10 w-10 bg-white border-4 border-gray-50 rounded-full flex items-center justify-center z-10 group-hover:border-red-50 transition-colors shadow-sm">
                      <div className="h-2.5 w-2.5 bg-gray-300 rounded-full group-hover:bg-[#ED1C24] transition-colors" />
                    </div>
                    
                    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm group-hover:shadow-lg group-hover:border-red-100 transition-all space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                            {formattedDate}
                          </span>
                          <h3 className="text-lg font-black tracking-tight text-black group-hover:text-[#ED1C24] transition-colors">
                            {title}
                          </h3>
                        </div>

                        <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-green-200">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          <span>{item.status || "Verified"}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 font-medium leading-relaxed bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100">
                        {parsed.text}
                      </p>

                      <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-gray-500 pt-3 border-t border-gray-50 text-xs font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[#ED1C24]" />
                          <span>{hours} Hours Credited</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#ED1C24]" />
                          <span>{item.location || item.region_name || "Addis Ababa Hub"}</span>
                        </div>

                        {item.rating ? (
                          <div className="flex items-center gap-1 text-amber-500 font-black">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span>{item.rating}.0 Rating</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="bg-gray-50 rounded-3xl p-14 text-center space-y-3 border-2 border-dashed border-gray-200 ml-12">
                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-gray-300">
                  <History className="h-7 w-7" />
                </div>
                <h4 className="text-base font-black text-black">No Service History Yet</h4>
                <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto">
                  Your humanitarian impact starts here. Apply to opportunities or log your hours to see verified milestones.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Achievements & Level Progression */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-7 space-y-6">
            <h2 className="text-base font-black tracking-tight text-black flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#ED1C24]" />
              Humanitarian Achievements
            </h2>

            <div className="flex gap-4 items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="h-14 w-14 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-gray-100 text-[#ED1C24]">
                <Award className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Current Volunteer Tier</p>
                <h4 className="text-base font-black text-black">{volunteerTier} Volunteer</h4>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Earned Badges</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Heart, label: "First Responder" },
                  { icon: Users, label: "Community Team" },
                  { icon: ShieldCheck, label: "Verified" },
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-[#ED1C24]">
                      <badge.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-black text-center text-gray-700 leading-tight">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-gray-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-500">Tier Progress:</span>
                <span className="font-black text-[#ED1C24]">{totalHours} / {nextTierHours} hrs</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#ED1C24] rounded-full shadow-[0_0_10px_rgba(237,28,36,0.3)] transition-all" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] font-medium text-gray-400">
                {Math.max(0, nextTierHours - totalHours)} more hours needed to reach the next milestone tier.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
