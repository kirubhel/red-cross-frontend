"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  HandHeart, 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp,
  ArrowRight,
  Plus,
  Search,
  Bell,
  MapPin,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  QrCode,
  Download,
  Share2,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  User,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState<any[]>([]);
  const [openRequests, setOpenRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Profile
        const profileRes = await api.get("/person/profile");
        const userData = profileRes.data.person || profileRes.data;
        
        // 2. Fetch News
        const newsRes = await api.get("/news?page_size=3");
        setNews(newsRes.data.articles || []);

        // 3. Fetch ID Assets from System Settings
        let idAssets = { stampUrl: "", signature1Url: "", signature2Url: "" };
        try {
          const settingsRes = await api.get("/system/settings");
          const settings = settingsRes.data.settings || {};
          if (settings.id_assets) {
            idAssets = JSON.parse(settings.id_assets);
          }
        } catch (err) {
          console.error("Failed to fetch ID assets:", err);
        }

        const role = localStorage.getItem("user_role");
        const storedErcsId = localStorage.getItem("ercs_id");
        
        const isMemberUser = role === "MEMBER" || role === "5";
        let totalHours = 0;

        if (!isMemberUser) {
           // Fetch Volunteer Specific Data
           try {
             const [histRes, reqRes] = await Promise.all([
                api.get("/volunteer/history"),
                api.get("/volunteer/open-requests")
             ]);
             setHistory(histRes.data.assignments || []);
             totalHours = histRes.data.total_hours || 0;
             setOpenRequests(reqRes.data.requests || []);
           } catch (e) {
             console.error("Failed to load volunteer data", e);
           }
        }

        const issueDate = userData?.created_at ? new Date(userData.created_at) : new Date();
        const membershipType = userData?.membership_type || "REGULAR";
        
        // Calculate Membership Expiry
        let expiryDate = new Date(issueDate);
        if (membershipType.toUpperCase() === "LIFETIME") {
          expiryDate = new Date(issueDate.getFullYear() + 100, issueDate.getMonth(), issueDate.getDate());
        } else if (membershipType.toUpperCase() === "MONTHLY") {
          expiryDate.setMonth(expiryDate.getMonth() + 1);
        } else {
          // Default to Yearly for REGULAR/YEARLY
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }

        // ID Card specific expiry is always +1 year from issue
        const cardExpiry = new Date(issueDate);
        cardExpiry.setFullYear(cardExpiry.getFullYear() + 1);

        const diffTime = expiryDate.getTime() - new Date().getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const REGIONS: Record<number, string> = {
          1: "Addis Ababa",
          2: "Dire Dawa",
          3: "Tigray",
          4: "Afar",
          5: "Amhara",
          6: "Oromia",
          7: "Somali",
          8: "Benishangul Gumuz",
          9: "SNNPR",
          10: "Gambela",
          11: "Harari",
          12: "Sidama",
          13: "South West",
          14: "Federal HQ"
        };

        const regionId = userData?.region_id || userData?.region || 0;
        const regionName = REGIONS[regionId] || userData?.region_name || "Federal HQ";

        setUser({
          firstName: userData?.first_name || "",
          fatherName: userData?.father_name || "",
          grandfatherName: userData?.grandfather_name || "",
          fullName: `${userData?.first_name || ""} ${userData?.father_name || ""} ${userData?.grandfather_name || ""}`.trim(),
          memberId: userData?.ercs_id || storedErcsId || "NOT_ASSIGNED",
          status: userData?.membership_status || userData?.status || "PENDING",
          membershipType: membershipType,
          role: role || "MEMBER",
          issueDate: issueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          expiryDate: membershipType.toUpperCase() === "LIFETIME" ? "LIFETIME" : expiryDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          cardExpiry: cardExpiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          daysLeft: diffDays > 0 ? diffDays : 0,
          region: regionName,
          phone: userData?.phone_number || userData?.phone || "+251...",
          email: userData?.email || "N/A",
          photo: userData?.photo_url || null,
          totalHours: totalHours,
          idAssets: idAssets,
          raw: userData
        });

        // Mock activities for members
        setActivities([
          { title: "Monthly Membership Fee", date: "Today", amount: "10.00 ETB", status: "COMPLETED", icon: CreditCard, bg: "bg-green-50", color: "text-green-500" },
          { title: "Quarterly Donation", date: "24 Mar 2024", amount: "250.00 ETB", status: "VERIFIED", icon: Heart, bg: "bg-red-50", color: "text-red-500" },
        ]);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", { description: "Please upload an image." });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      // 1. Upload to storage
      const uploadRes = await api.post("/person/profile/photo", formData);
      const photoUrl = uploadRes.data.url;

      if (!photoUrl) throw new Error("Storage server did not return a valid URL");

      // 2. Update profile with sanitized data
      const personData = { ...(user.raw || {}) };
      
      // Map region_id to region for the Protobuf enum
      if (personData.region_id && !personData.region) {
        personData.region = personData.region_id;
      }
      
      // Prevent PQ error: invalid input syntax for type date: ""
      if (personData.date_of_birth === "") {
        delete personData.date_of_birth;
      }
      
      await api.put("/person/profile", {
        ...personData,
        photo_url: photoUrl
      });

      // 3. Update local state
      setUser((prev: any) => ({ 
        ...prev, 
        photo: photoUrl,
        raw: { ...prev.raw, photo_url: photoUrl }
      }));
      
      toast.success("Profile photo updated!", {
        description: "Your digital ID has been updated."
      });
    } catch (err: any) {
      console.error("Profile update failed:", err);
      const errorDetail = err.response?.data?.error || err.response?.data || err.message;
      toast.error("Update failed", {
        description: typeof errorDetail === 'string' ? errorDetail : "Check server logs or connection."
      });
    } finally {
      setUploading(false);
    }
  };

  const isMember = user?.role === "MEMBER" || user?.role === "5" || user?.role === 5;
  const isVolunteer = !isMember;

  const stats = [
    isVolunteer 
      ? { label: "Volunteer Hours", value: user?.totalHours || 0, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" }
      : { label: "Membership Years", value: user?.membershipYears || 1, icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Donations", value: user?.donations || "0 ETB", icon: Heart, color: "text-red-600", bg: "bg-red-50" },
    { label: "Impact Score", value: `${user?.impactScore || 0}%`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: isVolunteer ? "Volunteer Points" : "Member Points", value: user?.points || 0, icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const upcomingEvents = [
    { title: "First Aid Training", date: "April 28, 2024", location: "ERCS HQ, Addis", type: isVolunteer ? "Training" : "Workshop" },
    { title: "Blood Donation Drive", date: "May 02, 2024", location: "Meskel Square", type: "Field Work" },
    { title: "Community Health Awareness", date: "May 10, 2024", location: "Kality Sub-city", type: "Outreach" },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Plus className="h-12 w-12 text-[#ED1C24]" strokeWidth={3} />
        </motion.div>
      </div>
    );
  }

  // --- MEMBER DASHBOARD VIEW ---
  if (isMember) {
    return (
      <div className="p-6 md:p-8 space-y-8 bg-[#F8FAFC] min-h-full pb-20">
        
        {!user?.photo && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#ED1C24]/10 border border-[#ED1C24]/20 p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 text-[#ED1C24]">
              <div className="h-10 w-10 bg-[#ED1C24] rounded-2xl flex items-center justify-center text-white shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-tight">Profile Photo Missing</p>
                <p className="text-xs font-medium opacity-80">Please upload your photo to complete your Digital ID card and verify your membership.</p>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <Button 
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#ED1C24] hover:bg-black text-white px-6 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-red-500/20"
            >
               {uploading ? "Uploading..." : "Upload Photo Now"}
            </Button>
          </motion.div>
        )}

        {/* Top Row: Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Membership Type */}
          <div className="bg-[#ED1C24] rounded-[32px] p-6 text-white shadow-lg shadow-red-900/10 flex flex-col justify-between min-h-[160px]">
            <div className="flex justify-between items-start">
               <h3 className="text-2xl font-black tracking-tighter uppercase leading-tight">{user?.membershipType}</h3>
               <div className="p-2 bg-white/10 rounded-xl"><User className="h-5 w-5" /></div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Membership Type</p>
          </div>

          {/* Membership Status */}
          <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between min-h-[160px]">
            <div className="flex justify-between items-start">
               <h3 className="text-2xl font-black tracking-tighter text-[#ED1C24] uppercase">{user?.status}</h3>
               <div className="p-2 bg-gray-50 rounded-xl text-gray-400"><CreditCard className="h-5 w-5" /></div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Membership Status</p>
          </div>

          {/* Telegram Connection */}
          <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col gap-4 min-h-[160px]">
             <p className="text-xs font-bold text-gray-500">Become a Telegram member to receive notifications.</p>
             <button className="w-full bg-[#0088CC] hover:bg-[#0077B5] text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/10">
                <MessageCircle className="h-4 w-4" /> Connect with Telegram
             </button>
          </div>

          {/* Expiry Date */}
          <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
               <Calendar className="h-16 w-16 text-[#ED1C24]" />
            </div>
            <div>
               <h3 className="text-xl font-black tracking-tighter text-gray-900">{user?.expiryDate}</h3>
               <p className="text-xs font-black text-[#ED1C24] uppercase mt-1">{user?.daysLeft} Days Left</p>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expired Date</p>
          </div>
        </div>

        {/* Digital ID Section */}
        <div className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-sm space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-50 pb-8">
             <div>
                <h2 className="text-3xl font-black tracking-tighter">Digital ID Card</h2>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Official ERCS {user?.role === "VOLUNTEER" ? "Volunteer" : "Membership"} Identification</p>
             </div>
             <Button className="bg-[#ED1C24] hover:bg-black text-white px-8 h-14 rounded-2xl font-black tracking-widest uppercase text-xs shadow-xl shadow-red-500/20 transition-all flex items-center gap-2">
                <Download className="h-4 w-4" /> Download ID Card
             </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Front View */}
            <div className="space-y-4">
              <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Card Front</p>
              <div className="bg-white rounded-[24px] border-2 border-red-800/20 overflow-hidden shadow-2xl relative max-w-[500px] mx-auto aspect-[1.6/1]">
                 <div className="bg-[#ED1C24] text-white p-4 flex items-center gap-3">
                    <div className="bg-white p-1 rounded-lg shrink-0">
                       <Image src="/logo.png" alt="ERCS" width={28} height={28} unoptimized />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black leading-none uppercase tracking-tighter">Ethiopia Red Cross Society</span>
                       <span className="text-[8px] font-bold opacity-70 uppercase">የኢትዮጵያ ቀይ መስቀል ማኅበር</span>
                    </div>
                 </div>
                 
                 <div className="p-6 flex gap-6 h-full relative overflow-hidden">
                    {/* Watermark Stamp */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-[0.06] pointer-events-none rotate-12">
                       {user?.idAssets?.stampUrl ? (
                         <img src={user.idAssets.stampUrl} alt="Watermark" className="w-full h-full object-contain grayscale" />
                       ) : (
                         <Image src="/logo.png" alt="Watermark" width={200} height={200} unoptimized />
                       )}
                    </div>

                    <div className="w-1/3 aspect-square bg-gray-100 rounded-xl border-2 border-red-100 overflow-hidden shrink-0 relative">
                       {user?.photo ? (
                          <img src={user.photo} alt="ID" className="w-full h-full object-cover" />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center text-red-900/20">
                             <User className="h-20 w-20" />
                          </div>
                       )}
                    </div>
                    <div className="flex-1 space-y-2">
                       {[
                         { label: user?.role === "VOLUNTEER" ? "Volunteer ID" : "Member ID", val: user?.memberId },
                         { label: "Name", val: user?.fullName || `${user?.firstName} ${user?.lastName}` },
                         { label: user?.role === "VOLUNTEER" ? "Volunteer Type" : "Membership Type", val: user?.membershipType },
                         { label: "Mobile Number", val: user?.phone || "+251..." },
                         { label: "Region", val: user?.region },
                         { label: "Issued Date", val: user?.issueDate },
                         { label: "Expired Date", val: user?.cardExpiry }
                       ].map((f, i) => (
                         <div key={i} className="flex justify-between items-end border-b border-gray-50 pb-0.5">
                            <span className="text-[7px] font-black text-red-900 uppercase tracking-widest">{f.label}</span>
                            <span className="text-[9px] font-black text-gray-900">{f.val}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="absolute bottom-0 left-0 w-full bg-[#ED1C24] py-1.5 px-4 text-center">
                    <p className="text-[8px] font-bold text-white uppercase tracking-tighter italic">Humanitarian Identity • {user?.role} • {user?.region}</p>
                 </div>
              </div>
            </div>

            {/* Back View */}
            <div className="space-y-4">
              <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Card Back</p>
              <div className="bg-white rounded-[24px] border-2 border-red-800/20 overflow-hidden shadow-2xl relative max-w-[500px] mx-auto aspect-[1.6/1]">
                 <div className="h-full flex flex-col">
                    <div className="bg-[#ED1C24] text-white p-3 text-center text-[9px] font-black uppercase tracking-widest">
                       Emergency Contact & Authentication
                    </div>
                    
                    <div className="flex-1 p-6 flex gap-8">
                       <div className="flex-1 space-y-3">
                          <div className="space-y-1">
                             <p className="text-[7px] font-black text-red-900 uppercase tracking-widest">Office Address</p>
                             <p className="text-[9px] font-bold text-gray-800 leading-tight">
                                Ethiopian Red Cross Society HQ<br />
                                Bisrate Gebriel, In front of Zambia Embassy<br />
                                Addis Ababa, Ethiopia
                             </p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[7px] font-black text-red-900 uppercase tracking-widest">Contact Information</p>
                             <p className="text-[9px] font-bold text-gray-800">
                                Tel: +251 11 551 91 00<br />
                                Email: info@redcrosseth.org<br />
                                Web: www.redcrosseth.org
                             </p>
                          </div>
                       </div>
                       
                       <div className="w-1/3 flex flex-col items-center justify-center gap-2">
                          <div className="p-2 bg-white border-2 border-gray-100 rounded-xl shadow-sm">
                             <QRCodeCanvas 
                               value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${user?.memberId}`}
                               size={64}
                               level={"H"}
                               includeMargin={false}
                               imageSettings={{
                                 src: "/logo.png",
                                 x: undefined,
                                 y: undefined,
                                 height: 12,
                                 width: 12,
                                 excavate: true,
                               }}
                             />

                          </div>
                          <p className="text-[5px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Scan to Verify<br />{user?.memberId}</p>
                       </div>
                    </div>

                    <div className="px-6 pb-6 flex justify-between items-end gap-10">
                       <div className="space-y-1 text-center flex-1">
                          <div className="h-8 flex items-center justify-center">
                             {user?.idAssets?.signature1Url ? (
                               <img src={user.idAssets.signature1Url} alt="Signature 1" className="h-full object-contain grayscale opacity-70" />
                             ) : (
                               <span className="italic font-serif text-gray-300 text-xs">Signature</span>
                             )}
                          </div>
                          <p className="text-[6px] font-black text-red-900 uppercase border-t border-gray-100 pt-1">General Secretary</p>
                       </div>
                       <div className="space-y-1 text-center flex-1">
                          <div className="h-8 flex items-center justify-center">
                             {user?.idAssets?.signature2Url ? (
                               <img src={user.idAssets.signature2Url} alt="Signature 2" className="h-full object-contain grayscale opacity-70" />
                             ) : (
                               <span className="italic font-serif text-gray-300 text-xs">Signature</span>
                             )}
                          </div>
                          <p className="text-[6px] font-black text-red-900 uppercase border-t border-gray-100 pt-1">Branch Manager</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Support */}
        <div className="bg-[#ED1C24] rounded-[40px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-6 text-center md:text-left">
              <div className="h-16 w-16 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10 shrink-0">
                 <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                 <h4 className="text-xl font-black">Secure Your Membership</h4>
                 <p className="text-sm font-medium opacity-60">Keep your information up to date to ensure seamless access to ERCS benefits.</p>
              </div>
           </div>
           <button className="whitespace-nowrap px-8 py-4 bg-white text-[#ED1C24] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl shadow-black/20">
              Update Profile Information
           </button>
        </div>
      </div>
    );
  }

  // --- VOLUNTEER DASHBOARD VIEW (Original) ---
  return (
    <div className="p-6 md:p-10 space-y-10">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black tracking-tighter text-black"
          >
            Welcome back, <span className="text-[#ED1C24]">{user?.firstName}</span>!
          </motion.h1>
          <p className="text-black/40 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {isVolunteer ? "Active Humanitarian Mission" : "ERCS Membership Hub"} • {user?.region}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-400 hover:text-black transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-3 right-3 h-2 w-2 bg-[#ED1C24] rounded-full border-2 border-white" />
            </button>
          </div>
          <button className="bg-[#ED1C24] text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
            {isVolunteer ? (
              <><Plus className="h-4 w-4" /> Log Service Hours</>
            ) : (
              <><Award className="h-4 w-4" /> Renew Membership</>
            )}
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer"
          >
            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", stat.bg)}>
              <stat.icon className={cn("h-7 w-7", stat.color)} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <div className="flex flex-col">
                <p className="text-2xl font-black text-black tracking-tight">{stat.value}</p>
                {stat.label === "Days Remaining" && (
                  <p className="text-[9px] font-black text-gray-400 mt-0.5">{user?.expiryDate}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        
        {/* Main Section */}
        <div className="space-y-10">
          
          {/* Membership Card Visual */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black rounded-[48px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-black/20"
          >
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-white/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-12">
               <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div className="bg-white p-2 rounded-xl w-fit">
                      <Image src="/logo.png" alt="ERCS" width={32} height={32} unoptimized />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50">Ethiopia Red Cross Society</h3>
                      <h2 className="text-3xl font-black tracking-tighter">Humanitarian Identity</h2>
                    </div>
                  </div>
                  <div className="bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Verified Member</span>
                  </div>
               </div>

                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                   <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Full Name</p>
                     <p className="text-2xl font-black tracking-tight">{user?.fullName || `${user?.firstName} ${user?.lastName}`}</p>
                   </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">System ID</p>
                    <p className="text-xl font-mono font-bold tracking-tighter text-red-500">{user?.memberId}</p>
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Activity/History */}
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                Recent Contributions <span className="text-[10px] font-black bg-gray-100 text-gray-400 px-2 py-1 rounded-full uppercase tracking-widest">Live</span>
              </h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] hover:opacity-60 transition-opacity flex items-center gap-1">
                View Full History <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="grid gap-4">
              {history && history.length > 0 ? history.map((item, idx) => {
                const Icon = item.status === "ASSIGNED" || item.status === "ONBOARDED" ? HandHeart : CheckCircle2;
                return (
                  <div key={idx} className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between group hover:border-[#ED1C24]/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-5">
                      <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0", "bg-blue-50")}>
                        <Icon className={cn("h-6 w-6", "text-blue-500")} />
                      </div>
                      <div>
                        <p className="font-black text-black tracking-tight">{item.org_name || "Volunteer Engagement"}</p>
                        <p className="text-xs text-gray-500 font-bold tracking-widest mt-0.5">{item.engagement}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Assigned: {new Date(item.assigned_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-black">{item.hours_worked} Hrs</p>
                      <p className={cn(
                        "text-[9px] font-black uppercase tracking-[0.2em]",
                        item.status === "ONBOARDED" ? "text-green-500" : "text-amber-500"
                      )}>{item.status}</p>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-10 bg-gray-50 rounded-[32px] border border-gray-100">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No Service History Found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-10">
          
          {/* Open Opportunities for Volunteers */}
          {openRequests && openRequests.length > 0 && (
            <div className="bg-blue-50 rounded-[40px] p-8 border border-blue-100 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                 <HandHeart className="h-24 w-24 text-blue-600" />
              </div>
              <h3 className="text-xl font-black tracking-tighter text-blue-900">
                Open Opportunities
              </h3>
              <div className="space-y-4 relative z-10">
                {openRequests.map((req, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-blue-50 hover:border-blue-200 transition-colors">
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{req.org_name}</p>
                     <p className="font-black text-black leading-tight mb-2 text-sm">{req.activities_skills}</p>
                     <div className="flex items-center justify-between mt-3">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-md">
                           {req.headcount} Needed
                        </span>
                        <Button 
                          onClick={async () => {
                             try {
                               await api.post("/volunteer/apply", { request_id: req.id });
                               toast.success("Applied to opportunity successfully!");
                             } catch (e) {
                               toast.error("Failed to apply");
                             }
                          }}
                          className="h-8 px-4 bg-blue-600 hover:bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                        >
                          Apply
                        </Button>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ERCS News */}
          <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black tracking-tighter">
              ERCS News
            </h3>
            <div className="space-y-6">
              {news.map((item, idx) => (
                <div key={idx} className="group relative pl-6 border-l-2 border-gray-100 hover:border-[#ED1C24] transition-colors cursor-pointer">
                   <div className="absolute top-0 -left-[5px] h-2 w-2 rounded-full bg-gray-100 group-hover:bg-[#ED1C24] transition-colors" />
                   <div>
                      <p className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest mb-1">{item.category}</p>
                      <p className="font-black text-black leading-tight group-hover:text-[#ED1C24] transition-colors">{item.title}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs font-bold text-gray-400">
                        <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {item.date}</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-gray-100 font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:text-black">
              Explore All News
            </Button>
          </div>


          {/* Quick Support */}
          <div className="bg-gradient-to-br from-red-600 to-[#ED1C24] rounded-[40px] p-8 text-white space-y-6 shadow-2xl shadow-red-500/30">
             <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                <Heart className="h-8 w-8 fill-white" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tighter leading-tight">Every Birr <br />Saves a Life.</h3>
                <p className="text-sm font-medium opacity-80">Support our emergency response funds to reach people in need faster.</p>
             </div>
             <Button className="w-full h-14 bg-white text-[#ED1C24] hover:bg-black hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all">
                Donate Now
             </Button>
          </div>

          {/* Points Progress */}
          <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="font-black tracking-tight text-lg">Next Reward</h3>
                <Award className="h-5 w-5 text-amber-500" />
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                   <span className="text-gray-400">Humanitarian Hero</span>
                   <span className="text-black">450 / 500 pts</span>
                </div>
                <div className="h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "90%" }}
                    className="h-full bg-amber-500 rounded-full"
                   />
                </div>
                <p className="text-[10px] font-bold text-gray-400 pt-1">Earn 50 more points to reach the next tier!</p>
             </div>
          </div>

        </div>

      </div>

    </div>
  );
}
