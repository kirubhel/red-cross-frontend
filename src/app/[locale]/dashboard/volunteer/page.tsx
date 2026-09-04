"use client";

import { useState, useEffect, useMemo } from "react";
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
  X,
  Building2,
  Briefcase,
  ShieldCheck,
  Award,
  Sparkles,
  DollarSign,
  HeartHandshake,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ParsedRequestMeta = {
  cleanTitle: string;
  cleanDescription: string;
  benefits?: string;
  regionName?: string;
  zoneName?: string;
  durationDays?: number;
  paymentAmount?: number;
};

const ERCS_ACTIVITY_CATEGORIES = [
  "First Aid & Emergency Triage",
  "Disaster Relief & Food Distribution",
  "Community Health & Sanitation Outreach",
  "Blood Drive Donor Support & Logistics",
  "Crowd Safety & Logistics Coordination",
  "Youth Mentorship & Training Facilitation",
  "Water & Environmental Sanitation",
  "Administrative & Translation Support"
];

function formatBenefits(benefitsRaw: any): string {
  if (!benefitsRaw) return "";
  if (typeof benefitsRaw === "string") {
    if (benefitsRaw.trim().startsWith("{")) {
      try {
        return formatBenefits(JSON.parse(benefitsRaw));
      } catch {
        return benefitsRaw;
      }
    }
    return benefitsRaw;
  }
  if (typeof benefitsRaw === "object") {
    const perks: string[] = [];
    if (benefitsRaw.meals) perks.push(`Meals: ${benefitsRaw.custom_meals || benefitsRaw.meals}`);
    if (benefitsRaw.transport) perks.push(`Transport: ${benefitsRaw.custom_transport || benefitsRaw.transport}`);
    if (benefitsRaw.accommodation) perks.push(`Accommodation: ${benefitsRaw.custom_accommodation || benefitsRaw.accommodation}`);
    if (benefitsRaw.custom_perk_amount) perks.push(`${benefitsRaw.custom_perk_amount} ETB Daily Allowance`);
    if (benefitsRaw.safety_gear) perks.push("Safety Gear Provided");
    if (benefitsRaw.certificate) perks.push("Certificate of Service");
    if (benefitsRaw.notes) perks.push(benefitsRaw.notes);
    return perks.join(" • ") || "Volunteer perks provided";
  }
  return String(benefitsRaw);
}

function parseRequestDetails(req: any): ParsedRequestMeta {
  let cleanTitle = req.title || req.activities_skills || "Humanitarian Volunteer Opportunity";
  let cleanDescription = req.description || "";
  let benefits = "";
  let regionName = req.region_name || "";
  let zoneName = req.zone_name || "";
  let durationDays = req.duration_days || 1;
  let paymentAmount = req.payment_amount || 0;

  if (typeof req.description === "string" && req.description.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(req.description);
      if (parsed.title) cleanTitle = parsed.title;
      if (parsed.description) cleanDescription = parsed.description;
      if (parsed.benefits) benefits = formatBenefits(parsed.benefits);
      if (parsed.region_name) regionName = parsed.region_name;
      if (parsed.zone_name) zoneName = parsed.zone_name;
      if (parsed.duration_days) durationDays = Number(parsed.duration_days);
      if (parsed.payment_amount) paymentAmount = Number(parsed.payment_amount);
    } catch {
      // Use fallback
    }
  }

  if (!benefits && req.benefits) {
    benefits = formatBenefits(req.benefits);
  }

  return {
    cleanTitle,
    cleanDescription,
    benefits,
    regionName,
    zoneName,
    durationDays,
    paymentAmount,
  };
}

function parseActivitiesList(activitiesRaw: any): { name: string; count?: number }[] {
  if (!activitiesRaw) return [];
  if (Array.isArray(activitiesRaw)) return activitiesRaw;
  if (typeof activitiesRaw === "string") {
    try {
      const parsed = JSON.parse(activitiesRaw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return activitiesRaw.split(",").map((s) => ({ name: s.trim() })).filter((a) => a.name);
    }
  }
  return [];
}

export default function VolunteerPage() {
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  
  // Modals State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  // Log Hours Form with activity linkage
  const [logForm, setLogForm] = useState({
    requestId: "",
    activityName: ERCS_ACTIVITY_CATEGORIES[0],
    customMissionName: "",
    hours: "4.0",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reqRes, histRes] = await Promise.all([
        api.get("/volunteer/open-requests").catch(() => ({ data: { requests: [] } })),
        api.get("/volunteer/history").catch(() => ({ data: { assignments: [] } })),
      ]);
      setActiveRequests(reqRes.data.requests || []);
      setHistory(histRes.data.assignments || []);
    } catch (err) {
      console.error("Failed to fetch volunteer data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogHours = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const missionTitle = logForm.requestId
        ? activeRequests.find((r) => r.id === logForm.requestId)?.title || logForm.activityName
        : logForm.customMissionName || logForm.activityName;

      await api.post("/volunteer/log-hours", {
        request_id: logForm.requestId || undefined,
        activity_name: logForm.activityName,
        mission_title: missionTitle,
        hours: parseFloat(logForm.hours),
        description: logForm.description || `Performed ${logForm.activityName} service`,
        date: logForm.date,
      });

      toast.success("Service hours logged successfully!", {
        description: "Your hours have been recorded and submitted for verification.",
      });

      setIsLogModalOpen(false);
      setLogForm({
        requestId: "",
        activityName: ERCS_ACTIVITY_CATEGORIES[0],
        customMissionName: "",
        hours: "4.0",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });

      const histRes = await api.get("/volunteer/history");
      setHistory(histRes.data.assignments || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to log hours. Please try again.");
    }
  };

  const handleApply = async (request: any) => {
    setApplyingId(request.id);
    try {
      await api.post("/volunteer/apply", { request_id: request.id });
      toast.success("Application submitted successfully!", {
        description: `Your application has been sent to ${request.org_name || "the organization"} for approval.`,
      });
      setSelectedOpportunity(null);
      fetchData();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.response?.data || "You may have already applied to this opportunity.";
      toast.info("Application status updated", {
        description: typeof errorMsg === "string" ? errorMsg : "Submitted for organization review.",
      });
    } finally {
      setApplyingId(null);
    }
  };

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return activeRequests.filter((req) => {
      const { cleanTitle, cleanDescription, regionName } = parseRequestDetails(req);
      const matchSearch =
        cleanTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cleanDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (req.org_name && req.org_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (regionName && regionName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === "ALL" ||
        (req.volunteer_type && req.volunteer_type.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        (req.activities_skills && req.activities_skills.toLowerCase().includes(selectedCategory.toLowerCase()));

      return matchSearch && matchCategory;
    });
  }, [activeRequests, searchQuery, selectedCategory]);

  const totalServiceHours = history.reduce((acc, curr) => acc + (curr.hours_worked || curr.hours || 0), 0);

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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-red-50 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-wider border border-red-100">
            <HeartHandshake className="h-3.5 w-3.5" /> Humanitarian Service Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black">
            Volunteer <span className="text-[#ED1C24]">Opportunities</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm max-w-2xl">
            Explore partner missions, respond to volunteer needs, and log verified service hours for humanitarian impact.
          </p>
        </div>

        <Button 
          onClick={() => setIsLogModalOpen(true)}
          className="bg-[#ED1C24] hover:bg-black text-white px-6 h-12 rounded-2xl font-black tracking-wider uppercase text-xs shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Log Service Hours
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-red-50 text-[#ED1C24] flex items-center justify-center font-black">
            <HandHeart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Open Missions</p>
            <p className="text-2xl font-black text-black">{activeRequests.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Logged Hours</p>
            <p className="text-2xl font-black text-black">{totalServiceHours} hrs</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center font-black">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Assignments</p>
            <p className="text-2xl font-black text-black">{history.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Volunteer Tier</p>
            <p className="text-xl font-black text-amber-600">
              {totalServiceHours >= 100 ? "GOLD" : totalServiceHours >= 50 ? "SILVER" : "BRONZE"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Feed & Sidebar */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Opportunities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search & Category Filter Bar */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search missions by title, skill, organization, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-10 bg-gray-50/70 text-black border-gray-200 rounded-2xl text-xs font-semibold focus:border-[#ED1C24]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar-small">
              {["ALL", "General", "Emergency", "Health", "Logistics", "Community"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                    selectedCategory === cat
                      ? "bg-black text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req, idx) => {
                const meta = parseRequestDetails(req);
                const activitiesList = parseActivitiesList(req.activities);
                const isApplying = applyingId === req.id;

                return (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedOpportunity(req)}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:border-red-100 transition-all group cursor-pointer space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-lg bg-red-50 text-[#ED1C24] text-[9px] font-black uppercase tracking-wider border border-red-100 flex items-center gap-1">
                            <Building2 className="h-3 w-3" /> {req.org_name || "Partner Organization"}
                          </span>
                          {req.volunteer_type && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[9px] font-bold uppercase tracking-wider">
                              {req.volunteer_type}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-black text-black tracking-tight group-hover:text-[#ED1C24] transition-colors leading-snug pt-1">
                          {meta.cleanTitle}
                        </h3>
                      </div>

                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(req);
                        }}
                        disabled={isApplying}
                        className="bg-black hover:bg-[#ED1C24] text-white px-5 h-10 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all shrink-0 self-start shadow-md"
                      >
                        {isApplying ? "Submitting..." : "Apply Now"}
                      </Button>
                    </div>

                    {meta.cleanDescription && (
                      <p className="text-xs text-gray-600 font-medium line-clamp-2 leading-relaxed">
                        {meta.cleanDescription}
                      </p>
                    )}

                    {/* Activities / Skills Tags */}
                    {activitiesList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {activitiesList.slice(0, 4).map((act, aIdx) => (
                          <span key={aIdx} className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-bold text-gray-600">
                            {act.name} {act.count ? `(${act.count})` : ""}
                          </span>
                        ))}
                        {activitiesList.length > 4 && (
                          <span className="px-2 py-1 text-[9px] font-bold text-gray-400">
                            +{activitiesList.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Metadata Footer */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-gray-500 pt-4 border-t border-gray-50 text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#ED1C24]" />
                        <span>{meta.regionName ? `${meta.regionName}${meta.zoneName ? `, ${meta.zoneName}` : ""}` : "Addis Ababa"}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-blue-500" />
                        <span>{req.headcount || 5} Volunteers Needed</span>
                      </div>

                      {meta.durationDays ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-green-600" />
                          <span>{meta.durationDays} Day{meta.durationDays > 1 ? "s" : ""} Mission</span>
                        </div>
                      ) : null}

                      {meta.benefits ? (
                        <div className="flex items-center gap-1.5 text-amber-600">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span className="truncate max-w-[200px]">{meta.benefits}</span>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="bg-gray-50 rounded-3xl p-12 text-center space-y-3 border-2 border-dashed border-gray-200">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-gray-300">
                  <HandHeart className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-base font-black text-black">No Open Opportunities Found</h4>
                  <p className="text-xs text-gray-400 font-medium">Try adjusting your search or category filter, or check back soon.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Recent Service & Lifetime Impact */}
        <div className="space-y-6">
          {/* Recent Service History Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black tracking-tight text-black flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#ED1C24]" />
                Recent Service History
              </h2>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{history.length} logged</span>
            </div>

            <div className="space-y-3">
              {history.length > 0 ? (
                history.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex gap-3.5 p-3 rounded-2xl bg-gray-50/70 border border-gray-100 group">
                    <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-red-50 group-hover:border-red-100 transition-colors">
                      <CheckCircle2 className="h-4 w-4 text-gray-400 group-hover:text-[#ED1C24]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-black text-gray-900 truncate">
                          {item.title || item.activity_name || "Humanitarian Assignment"}
                        </p>
                        <span className="text-[10px] font-black text-[#ED1C24] shrink-0 ml-1">
                          {item.hours_worked || item.hours || 0} hrs
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        {item.date || item.created_at ? new Date(item.date || item.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Recent"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400 text-xs font-medium bg-gray-50 rounded-2xl">
                  No verified assignments yet. Apply to open missions or log hours to build your record.
                </div>
              )}
            </div>

            <Button 
              onClick={() => setIsLogModalOpen(true)}
              variant="outline" 
              className="w-full h-11 rounded-xl text-xs font-black uppercase tracking-wider border-gray-200 hover:bg-black hover:text-white transition-colors"
            >
              + Log New Service Activity
            </Button>
          </div>

          {/* Lifetime Impact Box */}
          <div className="bg-black rounded-3xl p-7 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-36 h-36 bg-red-600/30 rounded-full blur-3xl" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-4">
              Your ERCS Impact
            </h3>
            <div className="space-y-1">
              <p className="text-5xl font-black tracking-tight text-white">
                {totalServiceHours}
              </p>
              <p className="text-xs font-bold text-gray-300">Total Verified Service Hours</p>
            </div>
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-gray-400">
              <span>Missions Completed:</span>
              <span className="text-white font-black">{history.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: OPPORTUNITY INSPECTOR / DETAIL MODAL */}
      <AnimatePresence>
        {selectedOpportunity && (() => {
          const meta = parseRequestDetails(selectedOpportunity);
          const activitiesList = parseActivitiesList(selectedOpportunity.activities);
          const isApplying = applyingId === selectedOpportunity.id;

          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white w-full max-w-2xl rounded-[32px] p-6 sm:p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="absolute top-6 right-6 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="space-y-6">
                  {/* Modal Header */}
                  <div className="space-y-2 pr-10">
                    <span className="px-3 py-1 bg-red-50 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-wider border border-red-100 inline-flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" /> {selectedOpportunity.org_name || "Partner Organization"}
                    </span>
                    <h2 className="text-2xl font-black text-black tracking-tight leading-snug">
                      {meta.cleanTitle}
                    </h2>
                  </div>

                  {/* Key Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Headcount</p>
                      <p className="text-sm font-black text-black">{selectedOpportunity.headcount || 5} Total</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Duration</p>
                      <p className="text-sm font-black text-black">{meta.durationDays || 1} Day(s)</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Location</p>
                      <p className="text-sm font-black text-black truncate">{meta.regionName || "Addis Ababa"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Type</p>
                      <p className="text-sm font-black text-[#ED1C24]">{selectedOpportunity.volunteer_type || "General"}</p>
                    </div>
                  </div>

                  {/* Full Mission Description */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-black">Mission Scope & Briefing</h4>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed bg-gray-50/40 p-4 rounded-2xl border border-gray-100">
                      {meta.cleanDescription || "No additional description provided for this mission."}
                    </p>
                  </div>

                  {/* Required Activities Breakdown */}
                  {activitiesList.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-black">Required Activity Roles</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activitiesList.map((act, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <span className="text-xs font-bold text-gray-800">{act.name}</span>
                            {act.count ? (
                              <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-black text-gray-600 border border-gray-200">
                                {act.count} pers.
                              </span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Qualifications & Benefits */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedOpportunity.qualifications && (
                      <div className="space-y-1.5 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <h5 className="text-[10px] font-black uppercase tracking-wider text-gray-500">Qualifications</h5>
                        <p className="text-xs font-semibold text-gray-800">{selectedOpportunity.qualifications}</p>
                      </div>
                    )}

                    {meta.benefits && (
                      <div className="space-y-1.5 p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                        <h5 className="text-[10px] font-black uppercase tracking-wider text-amber-700">Perks & Compensation</h5>
                        <p className="text-xs font-bold text-amber-900">{meta.benefits}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedOpportunity(null)}
                      className="h-11 px-5 rounded-xl font-bold text-xs"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => handleApply(selectedOpportunity)}
                      disabled={isApplying}
                      className="h-11 px-7 bg-[#ED1C24] hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-red-500/20"
                    >
                      {isApplying ? "Submitting Application..." : "Submit Application"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* MODAL 2: ACTIVITY-LINKED LOG SERVICE HOURS MODAL */}
      <AnimatePresence>
        {isLogModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-lg rounded-[32px] p-6 sm:p-8 shadow-2xl relative z-10 border border-gray-100 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsLogModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6 space-y-1 pr-8">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#ED1C24] text-[10px] font-black uppercase tracking-wider border border-red-100">
                  <Clock className="h-3 w-3" /> Service Verification
                </div>
                <h3 className="text-2xl font-black tracking-tight text-black">Log Service Hours</h3>
                <p className="text-xs text-gray-500 font-medium">Record hours served under specific humanitarian activities for official accreditation.</p>
              </div>

              <form onSubmit={handleLogHours} className="space-y-4">
                {/* Linked Opportunity / Mission Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Linked Mission / Assignment (Optional)
                  </label>
                  <select
                    value={logForm.requestId}
                    onChange={(e) => setLogForm({ ...logForm, requestId: e.target.value })}
                    className="w-full h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/20"
                  >
                    <option value="">-- General / Branch Activity (No specific request) --</option>
                    {activeRequests.map((r) => {
                      const m = parseRequestDetails(r);
                      return (
                        <option key={r.id} value={r.id}>
                          {m.cleanTitle} ({r.org_name || "Partner"})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Core Activity Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Primary Service Activity Type <span className="text-[#ED1C24]">*</span>
                  </label>
                  <select
                    value={logForm.activityName}
                    onChange={(e) => setLogForm({ ...logForm, activityName: e.target.value })}
                    className="w-full h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/20"
                    required
                  >
                    {ERCS_ACTIVITY_CATEGORIES.map((act) => (
                      <option key={act} value={act}>
                        {act}
                      </option>
                    ))}
                  </select>
                </div>

                {!logForm.requestId && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Task / Event Title
                    </label>
                    <Input 
                      placeholder="e.g. Meskel Square Blood Drive Station" 
                      className="h-11 rounded-xl bg-gray-50 border-gray-200 text-xs font-bold text-black focus:border-[#ED1C24]"
                      value={logForm.customMissionName}
                      onChange={(e) => setLogForm({ ...logForm, customMissionName: e.target.value })}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Hours Served <span className="text-[#ED1C24]">*</span>
                    </label>
                    <Input 
                      type="number"
                      placeholder="4.0" 
                      step="0.5"
                      min="0.5"
                      max="24"
                      className="h-11 rounded-xl bg-gray-50 border-gray-200 text-xs font-bold text-black focus:border-[#ED1C24]"
                      value={logForm.hours}
                      onChange={(e) => setLogForm({ ...logForm, hours: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Date of Service <span className="text-[#ED1C24]">*</span>
                    </label>
                    <Input 
                      type="date"
                      className="h-11 rounded-xl bg-gray-50 border-gray-200 text-xs font-bold text-black focus:border-[#ED1C24]"
                      value={logForm.date}
                      onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Activity Notes & Description
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Briefly describe the specific tasks completed during this volunteer shift..." 
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-black focus:outline-none focus:border-[#ED1C24]"
                    value={logForm.description}
                    onChange={(e) => setLogForm({ ...logForm, description: e.target.value })}
                  />
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-wider bg-[#ED1C24] hover:bg-black text-white shadow-lg shadow-red-500/20 transition-all"
                  >
                    Submit Service Log for Verification
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
