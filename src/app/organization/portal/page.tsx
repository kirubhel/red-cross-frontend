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
  MessageSquare,
  Trash2
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
  men_count: number;
  women_count: number;
  min_experience: number;
  qualifications: string;
  activities: { name: string; count: number }[];
};

const ENGAGEMENT_AREAS = [
  "First Aid Service",
  "Ambulance service",
  "Community Health Promotion Services",
  "ERCS Community Health Services",
  "Lonely, elderly, and disabled people's support services",
  "Emergency response and stand-by services",
  "Restoring Family Link(RFL) Services",
  "Disaster Risk Reduction activities like terracing and reforestation",
  "Dissemination and Membership Drive Services",
  "Fundraising activities",
  "Office Services",
  "Technical Services",
  "Volunteer planning, implementation, and coordination services",
  "Focal point services for other volunteer activities",
  "Other Services"
];

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
  
  // Form State
  const [headcount, setHeadcount] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [menCount, setMenCount] = useState("");
  const [womenCount, setWomenCount] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [activities, setActivities] = useState<{ name: string; count: number }[]>([
    { name: "", count: 1 }
  ]);
  const [volunteerType, setVolunteerType] = useState("General Volunteer");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "requests" | "profile" | "support">("dashboard");

  // Organization Profile State
  const [profile, setProfile] = useState<any>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    const role = localStorage.getItem("user_role");
    
    if (!token || (role !== "ORGANIZATION" && role !== "8")) {
      router.push("/login");
      return;
    }

    fetchPortalData();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/organizations/me");
      setProfile(res.data.organization);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

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
    if (!headcount || !qualifications) {
      toast.error("Please fill in basic mission fields");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        headcount: Number(headcount),
        activities_skills: selectedAreas.join(", "),
        men_count: Number(menCount),
        women_count: Number(womenCount),
        min_experience: Number(minExperience),
        qualifications,
        activities,
        volunteer_type: volunteerType
      };
      await api.post("/organizations/requests", payload);
      toast.success("Volunteer request created!");
      setShowForm(false);
      
      // Reset
      setHeadcount("");
      setQualifications("");
      setMenCount("");
      setWomenCount("");
      setMinExperience("");
      setVolunteerType("General Volunteer");
      setActivities([{ name: "", count: 1 }]);
      
      fetchPortalData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await api.put("/organizations", profile);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const addActivity = () => {
    setActivities([...activities, { name: "", count: 1 }]);
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const updateActivity = (index: number, field: "name" | "count", value: string | number) => {
    const newActivities = [...activities];
    newActivities[index] = { ...newActivities[index], [field]: value };
    setActivities(newActivities);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col md:flex-row overflow-hidden">
      {/* Aesthetic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#ED1C24]/5 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] opacity-10" />
      </div>

      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 p-8 flex flex-col z-10">
        <div className="flex items-center gap-3 mb-16">
          <div className="bg-[#ED1C24] p-2 rounded-xl group hover:scale-110 transition-transform cursor-pointer">
            <Plus className="h-6 w-6 text-white" strokeWidth={4} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter leading-none text-slate-900">ERCS PORTAL</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Organization Management</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-sm transition-all group ${activeTab === 'dashboard' ? 'bg-[#ED1C24] text-white shadow-lg shadow-[#ED1C24]/20' : 'text-slate-400 hover:bg-slate-50 hover:text-[#ED1C24]'}`}
          >
            <span className="flex items-center gap-3">
              <Layers className="h-5 w-5" /> Dashboard
            </span>
            <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === 'dashboard' ? 'group-hover:translate-x-1' : 'opacity-0'}`} />
          </button>
          
          <button 
            onClick={() => setActiveTab("requests")}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-sm transition-all group ${activeTab === 'requests' ? 'bg-[#ED1C24] text-white shadow-lg shadow-[#ED1C24]/20' : 'text-slate-400 hover:bg-slate-50 hover:text-[#ED1C24]'}`}
          >
            <span className="flex items-center gap-3">
              <Briefcase className="h-5 w-5" /> Manage Requests
            </span>
            <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === 'requests' ? 'group-hover:translate-x-1' : 'opacity-0'}`} />
          </button>

          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-sm transition-all group ${activeTab === 'profile' ? 'bg-[#ED1C24] text-white shadow-lg shadow-[#ED1C24]/20' : 'text-slate-400 hover:bg-slate-50 hover:text-[#ED1C24]'}`}
          >
            <span className="flex items-center gap-3">
              <Building2 className="h-5 w-5" /> Profile Settings
            </span>
            <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === 'profile' ? 'group-hover:translate-x-1' : 'opacity-0'}`} />
          </button>

          <button 
            onClick={() => setActiveTab("support")}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-sm transition-all group ${activeTab === 'support' ? 'bg-[#ED1C24] text-white shadow-lg shadow-[#ED1C24]/20' : 'text-slate-400 hover:bg-slate-50 hover:text-[#ED1C24]'}`}
          >
            <span className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5" /> Support
            </span>
            <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === 'support' ? 'group-hover:translate-x-1' : 'opacity-0'}`} />
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
      <main className="flex-1 p-6 md:p-12 overflow-y-auto z-10 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
          
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 text-slate-900">
                    Mission <span className="text-[#ED1C24]">Control</span>
                  </h1>
                  <p className="text-slate-400 font-bold">Manage your humanitarian volunteer requests and impact.</p>
                </div>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="h-16 px-8 bg-[#ED1C24] hover:bg-slate-900 text-white rounded-2xl font-black tracking-widest uppercase text-xs flex items-center gap-2 group transition-all shadow-xl shadow-[#ED1C24]/20"
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
                  <div key={i} className="bg-white border border-slate-200 p-8 rounded-[32px] group hover:border-[#ED1C24]/30 transition-all shadow-sm hover:shadow-xl hover:shadow-[#ED1C24]/5">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-[#ED1C24]/10 transition-colors">
                        {stat.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{stat.trend}</span>
                    </div>
                    <div className="text-4xl font-black tracking-tighter mb-1 text-slate-900">{stat.value}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Requests Summary */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black tracking-tighter uppercase tracking-widest text-[#ED1C24]">Recent Requests</h3>
                  <Button variant="ghost" onClick={() => setActiveTab('requests')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#ED1C24]">View All</Button>
                </div>
                <div className="h-px bg-slate-200 w-full" />

                {requests.length === 0 ? (
                  <div className="bg-white border border-dashed border-slate-200 rounded-[40px] p-20 text-center shadow-sm">
                    <div className="h-20 w-20 bg-slate-50 rounded-3xl mx-auto flex items-center justify-center mb-6">
                      <Briefcase className="h-10 w-10 text-slate-200" />
                    </div>
                    <h4 className="text-2xl font-black tracking-tight mb-2 text-slate-900">No active requests</h4>
                    <p className="text-slate-400 font-medium max-w-sm mx-auto">You haven't submitted any volunteer requests yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {requests.slice(0, 3).map((request) => (
                      <div key={request.id} className="bg-white border border-slate-100 p-6 rounded-[32px] flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-6">
                          <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                             <span className="text-lg font-black text-slate-900">{request.headcount}</span>
                          </div>
                          <div>
                            <StatusBadge status={request.status} />
                            <h4 className="font-black text-slate-900">{request.activities_skills}</h4>
                          </div>
                        </div>
                        <Button variant="outline" onClick={() => setActiveTab('requests')} className="rounded-xl font-black text-[10px] uppercase tracking-widest">Details</Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'requests' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 text-slate-900">Volunteer <span className="text-[#ED1C24]">Requests</span></h1>
                    <p className="text-slate-400 font-bold">Track and manage your volunteer missions.</p>
                  </div>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="h-14 px-6 bg-[#ED1C24] text-white rounded-2xl font-black uppercase text-xs flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> New Request
                  </Button>
                </div>

                <div className="grid gap-6">
                   {requests.length === 0 ? (
                      <div className="bg-white border border-dashed border-slate-200 rounded-[40px] p-20 text-center shadow-sm">
                        <h4 className="text-2xl font-black tracking-tight mb-2 text-slate-900">No requests found</h4>
                        <p className="text-slate-400 font-medium">Click "New Request" to get started.</p>
                      </div>
                   ) : (
                     requests.map((request) => (
                       <div key={request.id} className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm hover:shadow-xl transition-all group">
                          <div className="flex flex-col md:flex-row justify-between gap-8">
                             <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                  <StatusBadge status={request.status} />
                                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(request.created_at).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 leading-tight">{request.activities_skills}</h3>
                                <div className="flex flex-wrap gap-4">
                                   <div className="bg-slate-50 px-4 py-2 rounded-xl flex items-center gap-2">
                                      <Users className="h-4 w-4 text-[#ED1C24]" />
                                      <span className="text-xs font-black">{request.headcount} Volunteers needed</span>
                                   </div>
                                   <div className="bg-slate-50 px-4 py-2 rounded-xl flex items-center gap-2">
                                      <ShieldCheck className="h-4 w-4 text-blue-500" />
                                      <span className="text-xs font-black">{request.min_experience}+ Years Experience</span>
                                   </div>
                                </div>
                                <div className="p-4 bg-slate-50/50 rounded-2xl">
                                   <p className="text-sm text-slate-600 font-medium italic">"{request.qualifications}"</p>
                                </div>
                             </div>
                             <div className="w-full md:w-64 space-y-3">
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                   <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2">Gender Split</div>
                                   <div className="flex items-center justify-between">
                                      <div className="text-xs font-black">M: {request.men_count}</div>
                                      <div className="text-xs font-black">W: {request.women_count}</div>
                                   </div>
                                   <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden flex">
                                      <div className="h-full bg-blue-400" style={{ width: `${(request.men_count / (request.men_count + request.women_count || 1)) * 100}%` }} />
                                      <div className="h-full bg-pink-400" style={{ width: `${(request.women_count / (request.men_count + request.women_count || 1)) * 100}%` }} />
                                   </div>
                                </div>
                                <Button className="w-full h-12 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#ED1C24] transition-colors">
                                   View Applicants
                                </Button>
                             </div>
                          </div>
                       </div>
                     ))
                   )}
                </div>
             </motion.div>
          )}

          {activeTab === 'profile' && profile && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto space-y-12">
               <div>
                  <h1 className="text-4xl font-black tracking-tighter mb-2 text-slate-900">Profile <span className="text-[#ED1C24]">Settings</span></h1>
                  <p className="text-slate-400 font-bold">Update your organization's public information.</p>
               </div>

               <form onSubmit={handleUpdateProfile} className="space-y-8 bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Organization Name</Label>
                        <Input 
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="h-14 bg-slate-50 border-slate-200 rounded-xl font-bold"
                        />
                     </div>
                     <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Type</Label>
                        <Input 
                          value={profile.type}
                          onChange={(e) => setProfile({...profile, type: e.target.value})}
                          className="h-14 bg-slate-50 border-slate-200 rounded-xl font-bold"
                        />
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Contact Person</Label>
                        <Input 
                          value={profile.contact_person}
                          onChange={(e) => setProfile({...profile, contact_person: e.target.value})}
                          className="h-14 bg-slate-50 border-slate-200 rounded-xl font-bold"
                        />
                     </div>
                     <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Phone Number</Label>
                        <Input 
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="h-14 bg-slate-50 border-slate-200 rounded-xl font-bold"
                        />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Email Address</Label>
                     <Input 
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="h-14 bg-slate-50 border-slate-200 rounded-xl font-bold"
                     />
                  </div>

                  <div className="space-y-3">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Website</Label>
                     <Input 
                        value={profile.website}
                        onChange={(e) => setProfile({...profile, website: e.target.value})}
                        className="h-14 bg-slate-50 border-slate-200 rounded-xl font-bold"
                     />
                  </div>

                  <div className="space-y-3">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Description</Label>
                     <textarea 
                        value={profile.description}
                        onChange={(e) => setProfile({...profile, description: e.target.value})}
                        className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-sm min-h-[150px] outline-none focus:ring-2 focus:ring-[#ED1C24]/10"
                     />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={updatingProfile}
                    className="w-full h-16 bg-[#ED1C24] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#ED1C24]/20 hover:bg-slate-900 transition-all"
                  >
                    {updatingProfile ? "Updating..." : "Save Changes"}
                  </Button>
               </form>
            </motion.div>
          )}

          {activeTab === 'support' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto text-center space-y-6 pt-20">
                <div className="h-20 w-20 bg-slate-50 rounded-3xl mx-auto flex items-center justify-center">
                   <MessageSquare className="h-10 w-10 text-[#ED1C24]" />
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-slate-900">Need <span className="text-[#ED1C24]">Help?</span></h1>
                <p className="text-slate-400 font-bold text-lg">Our humanitarian support team is here to assist you with your volunteer requests and portal management.</p>
                <div className="pt-6">
                   <Button className="h-16 px-12 bg-slate-900 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-[#ED1C24] transition-all">
                      Contact Support Team
                   </Button>
                </div>
             </motion.div>
          )}
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
              className="w-full max-w-5xl bg-white border border-slate-200 rounded-[40px] p-8 md:p-12 shadow-2xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#ED1C24]" />
              
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter mb-2 text-slate-900">New <span className="text-[#ED1C24]">Volunteer Request</span></h2>
                  <p className="text-slate-400 font-bold">Specify your mission needs to find the right volunteers.</p>
                </div>
                <Button variant="ghost" onClick={() => setShowForm(false)} className="h-12 w-12 rounded-full hover:bg-slate-50">
                  <Plus className="h-6 w-6 rotate-45 text-slate-400" />
                </Button>
              </div>

              <form onSubmit={handleCreateRequest} className="space-y-12">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Voluntary Service Engagement Areas *</Label>
                      <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar-small">
                        {ENGAGEMENT_AREAS.map(area => (
                          <label key={area} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${selectedAreas.includes(area) ? 'bg-[#ED1C24]/5 border-[#ED1C24] text-[#ED1C24]' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-[#ED1C24]/30'}`}>
                            <input 
                              type="checkbox"
                              className="hidden"
                              checked={selectedAreas.includes(area)}
                              onChange={() => {
                                if (selectedAreas.includes(area)) {
                                  setSelectedAreas(selectedAreas.filter(a => a !== area));
                                } else {
                                  setSelectedAreas([...selectedAreas, area]);
                                }
                              }}
                            />
                            <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors ${selectedAreas.includes(area) ? 'bg-[#ED1C24] border-[#ED1C24]' : 'bg-white border-slate-200'}`}>
                              {selectedAreas.includes(area) && <CheckCircle2 className="h-3 w-3 text-white" />}
                            </div>
                            <span className="text-xs font-black leading-tight">{area}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Volunteer Type</Label>
                        <div className="flex gap-4">
                          {["General Volunteer", "Professional Volunteer"].map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setVolunteerType(type)}
                              className={`flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${volunteerType === type ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-[#ED1C24]/30'}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Total Headcount</Label>
                        <Input 
                          type="number"
                          placeholder="e.g. 10"
                          value={headcount}
                          onChange={(e) => setHeadcount(e.target.value)}
                          className="h-16 bg-slate-50 border-slate-200 rounded-2xl font-bold text-lg text-slate-900"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Min Experience (Yrs)</Label>
                        <Input 
                          type="number"
                          placeholder="e.g. 2"
                          value={minExperience}
                          onChange={(e) => setMinExperience(e.target.value)}
                          className="h-16 bg-slate-50 border-slate-200 rounded-2xl font-bold text-lg text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Men Count</Label>
                        <Input 
                          type="number"
                          placeholder="0"
                          value={menCount}
                          onChange={(e) => setMenCount(e.target.value)}
                          className="h-16 bg-slate-50 border-slate-200 rounded-2xl font-bold text-lg text-slate-900"
                        />
                      </div>
                       <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Women Count</Label>
                        <Input 
                          type="number"
                          placeholder="0"
                          value={womenCount}
                          onChange={(e) => setWomenCount(e.target.value)}
                          className="h-16 bg-slate-50 border-slate-200 rounded-2xl font-bold text-lg text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Specific Qualifications & Skills</Label>
                      <textarea 
                        placeholder="e.g. Medical background, First Aid certified, Fluency in Amharic..."
                        value={qualifications}
                        onChange={(e) => setQualifications(e.target.value)}
                        className="w-full h-32 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#ED1C24]/20 font-bold text-sm text-slate-900 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-slate-100">
                   <div className="flex items-center justify-between">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Specific Activities Breakdown (Optional)</Label>
                     <Button type="button" onClick={addActivity} variant="ghost" className="h-10 px-4 text-[10px] font-black uppercase tracking-widest text-[#ED1C24] hover:bg-[#ED1C24]/10 bg-[#ED1C24]/5 rounded-xl">
                       <Plus className="h-3 w-3 mr-1" /> Add Activity
                     </Button>
                   </div>
                   
                   <div className="grid md:grid-cols-2 gap-4">
                     {activities.map((activity, index) => (
                       <div key={index} className="flex gap-4 items-end bg-slate-50 p-4 rounded-3xl border border-slate-100 group">
                         <div className="flex-1 space-y-2">
                           <Input 
                             placeholder="Activity name..."
                             value={activity.name}
                             onChange={(e) => updateActivity(index, "name", e.target.value)}
                             className="h-12 bg-white border-slate-200 rounded-xl font-medium text-xs text-slate-900"
                           />
                         </div>
                         <div className="w-20 space-y-2">
                           <Input 
                             type="number"
                             placeholder="Qty"
                             value={activity.count}
                             onChange={(e) => updateActivity(index, "count", Number(e.target.value))}
                             className="h-12 bg-white border-slate-200 rounded-xl font-black text-xs text-center text-slate-900"
                           />
                         </div>
                         {activities.length > 1 && (
                           <Button 
                             type="button" 
                             onClick={() => removeActivity(index)}
                             variant="ghost" 
                             className="h-12 w-12 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100"
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         )}
                       </div>
                     ))}
                   </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-4">
                  <Button 
                    type="submit" 
                    disabled={submitting || selectedAreas.length === 0}
                    className="flex-1 h-20 bg-[#ED1C24] hover:bg-slate-900 text-white rounded-3xl text-xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-[#ED1C24]/20 disabled:opacity-50"
                  >
                    {submitting ? "Processing..." : <span className="flex items-center gap-2">Publish Mission <Send className="h-5 w-5" /></span>}
                  </Button>
                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={() => setShowForm(false)}
                    className="h-20 px-10 text-slate-400 hover:text-slate-900 font-black uppercase tracking-widest text-xs"
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
