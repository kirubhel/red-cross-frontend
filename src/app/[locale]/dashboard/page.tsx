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
  Camera,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import { getRegionName, getZoneName, getWoredaName } from "@/lib/constants";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cmsContact, setCmsContact] = useState<{
    address: string;
    email: string;
    tel: string;
    mobile: string;
    web: string;
  }>({
    address: "Ras Desta Damtew Avenue, Addis Ababa, Ethiopia",
    email: "info@redcrosseth.org",
    tel: "+251 11 551 91 00",
    mobile: "+251 11 551 91 00",
    web: "www.redcrosseth.org"
  });

  const [history, setHistory] = useState<any[]>([]);
  const [openRequests, setOpenRequests] = useState<any[]>([]);
  const idCardRef = useRef<HTMLDivElement>(null);

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

        // 4. Fetch Contact Us CMS configuration
        try {
          const cmsRes = await api.get("/config/landing-page?lang=en");
          if (cmsRes.data?.content_json) {
            const parsed = typeof cmsRes.data.content_json === 'string'
              ? JSON.parse(cmsRes.data.content_json)
              : cmsRes.data.content_json;
            if (parsed?.contactSection) {
              setCmsContact({
                address: parsed.contactSection.address || "Ras Desta Damtew Avenue, Addis Ababa, Ethiopia",
                email: parsed.contactSection.email || "info@redcrosseth.org",
                tel: parsed.contactSection.tel || parsed.contactSection.mobile || "+251 11 551 91 00",
                mobile: parsed.contactSection.mobile || "+251 11 551 91 00",
                web: "www.redcrosseth.org"
              });
            }
          }
        } catch (err) {
          console.warn("Failed to fetch CMS contact info:", err);
        }

        const role = localStorage.getItem("user_role");
        const storedErcsId = localStorage.getItem("ercs_id");
        
        // Parse metadata for address & emergency details
        let userMeta: any = {};
        try {
          if (typeof userData?.metadata === 'string' && userData.metadata) {
            userMeta = JSON.parse(userData.metadata);
          } else if (typeof userData?.metadata === 'object' && userData.metadata) {
            userMeta = userData.metadata;
          }
        } catch (e) {
          console.warn("Failed to parse user metadata", e);
        }

        const rawRegion = userData?.region_id || userData?.region || userMeta?.region || userMeta?.region_id;
        const regionName = getRegionName(rawRegion);

        const rawZone = userData?.zone_id || userData?.zone || userMeta?.zone || userMeta?.zone_name || "";
        const zoneName = getZoneName(rawZone, rawRegion);

        const rawWoreda = userData?.woreda_id || userData?.woreda || userMeta?.woreda || userMeta?.woreda_name || "";
        const woredaName = getWoredaName(rawWoreda, rawZone);

        const kebele = userData?.kebele_id || userMeta?.kebele || userMeta?.kebele_id || "";
        const houseNo = userMeta?.house_number || userMeta?.house_no || userMeta?.houseNo || "";
        const area = userMeta?.area || "";
        const emergencyContactName = userMeta?.emergency_contact_name || userMeta?.emergencyContactName || userMeta?.emergency_contact || "";
        const emergencyContactPhone = userMeta?.emergency_contact_phone || userMeta?.emergencyContactPhone || userMeta?.emergencyPhone || "";
        
        // ROLE_volunteer = 5, ROLE_member = 6
        const isMemberUser = role === "MEMBER" || role === "6";
        const isVolunteerUser = role === "VOLUNTEER" || role === "5";
        let totalHours = 0;

        if (isVolunteerUser) {
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

        const isZeroDate = (d: Date) => d.getFullYear() <= 1;
        const rawIssueDate = userData?.created_at ? new Date(userData.created_at) : new Date();
        const issueDate = isZeroDate(rawIssueDate) ? new Date() : rawIssueDate;

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
        const status = userData?.membership_status || userData?.status || "PENDING";
        const isApproved = status.toUpperCase() === "APPROVED";

        const firstName = userData?.first_name || userData?.firstName || "";
        const fatherName = userData?.father_name || userData?.fatherName || "";
        const grandfatherName = userData?.grandfather_name || userData?.grandfatherName || userData?.last_name || userData?.lastName || userMeta?.grandfather_name || userMeta?.last_name || "";
        const constructedName = [firstName, fatherName, grandfatherName].filter(Boolean).join(" ");
        const fullName = constructedName || "Valued Member";
        const personId = userData?.id || userData?.person_id || userData?.personId || "";

        // 5. Fetch Payments / Total Donations
        let totalDonations = 0;
        let fetchedActivities: any[] = [];
        try {
          if (personId) {
            const payRes = await api.get(`/payments?person_id=${personId}`);
            const invoices = payRes.data.invoices || payRes.data || [];
            if (Array.isArray(invoices)) {
              invoices.forEach((inv: any) => {
                const amt = parseFloat(inv.amount || inv.total_amount || 0);
                if (inv.status === "PAID" || inv.status === "COMPLETED" || inv.status === "VERIFIED") {
                  totalDonations += amt;
                }
                fetchedActivities.push({
                  title: inv.description || inv.invoice_type || "Contribution",
                  date: inv.created_at ? new Date(inv.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Recent",
                  amount: `${amt} ETB`,
                  status: inv.status || "COMPLETED",
                  icon: CreditCard,
                  bg: "bg-green-50",
                  color: "text-green-500"
                });
              });
            }
          }
        } catch (e) {
          console.error("Failed to load user payments:", e);
        }

        setUser({
          id: personId,
          personId: personId,
          firstName: firstName || "Valued",
          fatherName: fatherName,
          grandfatherName: grandfatherName,
          fullName: fullName,
          memberId: userData?.ercs_id || storedErcsId || "NOT_ASSIGNED",
          status: status,
          isApproved: isApproved,
          membershipType: membershipType,
          role: role || "MEMBER",
          issueDate: !isApproved ? "PENDING" : issueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          expiryDate: !isApproved ? "PENDING" : (membershipType.toUpperCase() === "LIFETIME" ? "LIFETIME" : expiryDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })),
          cardExpiry: !isApproved ? "PENDING" : cardExpiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          daysLeft: isApproved ? (diffDays > 0 ? diffDays : 0) : 0,
          region: regionName,
          phone: userData?.phone_number || userData?.phone || "+251...",
          email: userData?.email || "N/A",
          photo: userData?.photo_url || null,
          totalHours: totalHours,
          donations: `${totalDonations} ETB`,
          totalDonations: totalDonations,
          idAssets: idAssets,
          address: {
            region: regionName,
            zone: zoneName,
            rawZone: rawZone,
            woreda: woredaName,
            rawWoreda: rawWoreda,
            kebele: kebele,
            houseNo: houseNo,
            area: area,
            emergencyName: emergencyContactName,
            emergencyPhone: emergencyContactPhone
          },
          raw: userData
        });

        if (fetchedActivities.length > 0) {
          setActivities(fetchedActivities);
        }
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
        description: "Your digital ID card has been updated with the new photo."
      });
    } catch (err: any) {
      console.error("Upload failed:", err);
      const errorDetail = err.response?.data?.error || err.response?.data || err.message;
      toast.error("Update failed", {
        description: typeof errorDetail === 'string' ? errorDetail : "Check server logs or connection."
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadIDCard = async () => {
    if (!idCardRef.current) return;
    
    try {
      const toastId = toast.loading("Generating your digital ID card...");
      
      const canvas = await html2canvas(idCardRef.current, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        imageTimeout: 5000,
        onclone: (clonedDoc) => {
          // 1. Remove all style/link tags to prevent 'oklch' parsing errors from Tailwind v4
          const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          styles.forEach(s => s.remove());

          // 2. Fix the container layout for the download
          const el = clonedDoc.querySelector('[data-id-card-grid]') as HTMLElement;
          if (el) {
            el.style.display = 'flex';
            el.style.flexDirection = 'row';
            el.style.gap = '40px';
            el.style.padding = '60px';
            el.style.width = '1250px';
            el.style.background = '#F8FAFC';
            el.style.justifyContent = 'center';
            el.style.alignItems = 'flex-start';
            el.style.fontFamily = 'Inter, system-ui, sans-serif';
          }
        }
      });
      
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `ERCS_ID_${user?.memberId || "Card"}.png`;
      link.href = url;
      link.click();
      
      toast.dismiss(toastId);
      toast.success("ID Card downloaded successfully!");
    } catch (err) {
      console.error("Failed to generate ID card image:", err);
      toast.error("Download failed", { description: "Could not generate ID card image." });
    }
  };

  // ROLE_member = 6, ROLE_volunteer = 5
  const isMember = user?.role === "MEMBER" || user?.role === "6" || user?.role === 6;
  const isVolunteer = user?.role === "VOLUNTEER" || user?.role === "5" || user?.role === 5;

  const stats = [
    { label: "Community Status", value: user?.status, desc: "Active ERCS Volunteer", icon: ShieldCheck, color: "text-[#ED1C24]", bg: "bg-red-50" },
    { label: "Service Hours", value: `${user?.totalHours || 0} hrs`, desc: "Total Verified Contribution", icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Direct Impact", value: `${user?.donations || "0 ETB"}`, desc: "Total Financial Contribution", icon: CreditCard, color: "text-green-500", bg: "bg-green-50" },
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Top Banner: Verification/Warning */}
      {!user?.isApproved && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/20 rounded-[28px] p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-amber-900"
        >
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-amber-500/20">
                <AlertCircle className="h-5 w-5" />
             </div>
             <div>
                <h4 className="text-sm font-black uppercase tracking-tight">Membership Pending Approval</h4>
                <p className="text-xs font-semibold text-amber-800/80">Your profile is currently under review by our administrative branch officers.</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <Button 
               onClick={() => router.push("/dashboard/profile")}
               variant="outline" 
               className="bg-white/80 hover:bg-white text-amber-900 border-amber-200 text-[10px] font-black uppercase tracking-widest rounded-xl h-9"
             >
                Review Profile
             </Button>
          </div>
        </motion.div>
      )}

      {/* Main Dashboard Layout */}
      <div className="space-y-6">
        {/* Photo Upload Banner if Missing Photo */}
        {!user?.photo && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-red-600 via-[#ED1C24] to-red-700 rounded-[32px] p-6 text-white shadow-xl shadow-red-500/10 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shrink-0">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight">Upload Your Profile Photograph</h3>
                <p className="text-xs text-white/80 font-medium">Add your photo to complete your digital membership identification card.</p>
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
              className="bg-white hover:bg-gray-100 text-[#ED1C24] px-6 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md cursor-pointer"
            >
               {uploading ? "Uploading..." : "Upload Photo Now"}
            </Button>
          </motion.div>
        )}

        {/* Top Row: Compact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Membership Type */}
          <div className="bg-[#ED1C24] rounded-[24px] p-5 text-white shadow-md shadow-red-900/10 flex flex-col justify-between min-h-[120px]">
            <div className="flex justify-between items-start">
               <h3 className="text-xl font-black tracking-tighter uppercase leading-tight">{user?.membershipType}</h3>
               <div className="p-2 bg-white/10 rounded-xl"><User className="h-4 w-4" /></div>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">Membership Type</p>
          </div>

          {/* Membership Status */}
          <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-xs flex flex-col justify-between min-h-[120px]">
            <div className="flex justify-between items-start">
               <h3 className="text-xl font-black tracking-tighter text-[#ED1C24] uppercase">{user?.status}</h3>
               <div className="p-2 bg-gray-50 rounded-xl text-gray-400"><CreditCard className="h-4 w-4" /></div>
            </div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Membership Status</p>
          </div>

          {/* Telegram Connection */}
          <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-xs flex flex-col justify-between min-h-[120px]">
             <div>
               <p className="text-xs font-bold text-gray-700">ERCS Telegram Community</p>
               <p className="text-[10px] text-gray-400 mt-0.5">Receive official alerts & updates.</p>
             </div>
             <button 
               onClick={() => window.open("https://t.me/ethiopianredcross", "_blank")}
               className="w-full bg-[#0088CC] hover:bg-[#0077B5] text-white py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
             >
                <MessageCircle className="h-3.5 w-3.5" /> Connect Telegram
             </button>
          </div>

          {/* Expiry Date */}
          <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-xs flex flex-col justify-between min-h-[120px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform">
               <Calendar className="h-12 w-12 text-[#ED1C24]" />
            </div>
            <div>
               <h3 className="text-lg font-black tracking-tighter text-gray-900">{user?.expiryDate}</h3>
               <p className="text-[10px] font-black text-[#ED1C24] uppercase mt-0.5">{user?.daysLeft} Days Left</p>
            </div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Expired Date</p>
          </div>
        </div>

        {/* Digital ID Section */}
        <div className="bg-white rounded-[36px] p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
             <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-gray-900">Digital ID Card</h2>
                <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest mt-0.5">Official ERCS {user?.role === "VOLUNTEER" ? "Volunteer" : "Membership"} Identification</p>
             </div>
             <Button 
                onClick={downloadIDCard}
                className="bg-[#ED1C24] hover:bg-black text-white px-6 h-11 rounded-xl font-black tracking-widest uppercase text-[10px] shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
              >
                <Download className="h-3.5 w-3.5" /> Download ID Card
             </Button>
          </div>

          <div 
            ref={idCardRef} 
              data-id-card-grid="true"
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-3 bg-white"
            >
              {/* Front View */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
                <p style={{ textAlign: 'center', fontSize: '10px', fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.3em', margin: 0 }}>Card Front</p>
                <div 
                  style={{ backgroundColor: 'white', borderRadius: '24px', border: '2px solid rgba(153, 27, 27, 0.15)', overflow: 'hidden', position: 'relative', width: '500px', height: '312px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', flexShrink: 0 }}
                >
                   <div style={{ backgroundColor: '#ED1C24', color: 'white', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ backgroundColor: 'white', padding: '4px', borderRadius: '8px', flexShrink: 0 }}>
                         <img src="/logo.png" alt="ERCS" width={28} height={28} crossOrigin="anonymous" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                         <span style={{ fontSize: '10px', fontWeight: '900', lineHeight: '1', textTransform: 'uppercase', letterSpacing: '-0.025em' }}>Ethiopia Red Cross Society</span>
                         <span style={{ fontSize: '8px', fontWeight: '700', opacity: '0.7', textTransform: 'uppercase' }}>የኢትዮጵያ ቀይ መስቀል ማኅበር</span>
                      </div>
                   </div>
                   
                   <div style={{ padding: '24px', display: 'flex', gap: '24px', height: '100%', position: 'relative', overflow: 'hidden' }}>
                      {/* Watermark Stamp */}
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(12deg)', width: '192px', height: '192px', opacity: '0.06', pointerEvents: 'none' }}>
                         {user?.idAssets?.stampUrl ? (
                           <img src={user.idAssets.stampUrl} alt="Watermark" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'grayscale(100%)' }} crossOrigin="anonymous" />
                         ) : (
                           <img src="/logo.png" alt="Watermark" width={200} height={200} crossOrigin="anonymous" />
                         )}
                      </div>
  
                      <div style={{ width: '120px', height: '120px', backgroundColor: '#F3F4F6', borderRadius: '12px', border: '2px solid #FEE2E2', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                         {user?.photo ? (
                            <img src={user.photo} alt="ID" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
                         ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(127, 29, 29, 0.2)' }}>
                               <User style={{ width: '80px', height: '80px' }} />
                            </div>
                         )}
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                         {[
                           { label: user?.role === "VOLUNTEER" ? "Volunteer ID" : "Member ID", val: user?.memberId },
                           { label: "Name", val: user?.fullName },
                           { label: user?.role === "VOLUNTEER" ? "Volunteer Type" : "Membership Type", val: user?.membershipType },
                           { label: "Mobile Number", val: user?.phone || "+251..." },
                           { label: "Region", val: user?.region },
                           { label: "Issued Date", val: user?.issueDate },
                           { label: "Expired Date", val: user?.cardExpiry }
                         ].map((f, i) => (
                           <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #F9FAFB', paddingBottom: '2px' }}>
                              <span style={{ fontSize: '7px', fontWeight: '900', color: '#7F1D1D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</span>
                              <span style={{ fontSize: '9px', fontWeight: '900', color: '#111827' }}>{f.val}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   
                   <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: '#ED1C24', padding: '6px 16px', textAlign: 'center' }}>
                      <p style={{ fontSize: '8px', fontWeight: '700', color: 'white', textTransform: 'uppercase', letterSpacing: '-0.025em', fontStyle: 'italic', margin: 0 }}>Humanitarian Identity • {user?.role} • {user?.region}</p>
                   </div>
                </div>
              </div>

              {/* Back View */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
                <p style={{ textAlign: 'center', fontSize: '10px', fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.3em', margin: 0 }}>Card Back</p>
                <div 
                   style={{ backgroundColor: 'white', borderRadius: '24px', border: '2px solid rgba(153, 27, 27, 0.15)', overflow: 'hidden', position: 'relative', width: '500px', height: '312px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', flexShrink: 0 }}
                >
                   <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                      <div style={{ backgroundColor: '#ED1C24', color: 'white', padding: '10px 12px', textAlign: 'center', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                         Emergency Contact & Authentication
                      </div>
                      
                      <div style={{ flex: 1, padding: '16px 20px 8px', display: 'flex', gap: '20px' }}>
                         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {/* Member Address */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                               <p style={{ fontSize: '7.5px', fontWeight: '900', color: '#7F1D1D', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Member Address</p>
                               <p style={{ fontSize: '9px', fontWeight: '800', color: '#111827', lineHeight: '1.4', margin: 0, letterSpacing: '0.02em' }}>
                                  Region: {user?.region || "Ethiopia"}<br />
                                  {[
                                    user?.address?.zone && `Zone: ${user.address.zone}`,
                                    user?.address?.woreda && `Woreda: ${user.address.woreda}`,
                                    user?.address?.kebele && `Kebele: ${user.address.kebele}`
                                  ].filter(Boolean).join("  •  ") || (user?.address?.area ? `Area: ${user.address.area}` : "National Registry")}
                                  {user?.address?.houseNo ? <><br />House No: {user.address.houseNo}</> : null}
                               </p>
                            </div>

                            {/* Emergency Contact or Member Contact */}
                            {user?.address?.emergencyName || user?.address?.emergencyPhone ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                 <p style={{ fontSize: '7px', fontWeight: '900', color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Emergency Contact</p>
                                 <p style={{ fontSize: '8.5px', fontWeight: '700', color: '#1F2937', margin: 0, lineHeight: '1.35', letterSpacing: '0.02em' }}>
                                    {user.address.emergencyName || "Contact"} {user.address.emergencyPhone && ` •  ${user.address.emergencyPhone}`}
                                 </p>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                 <p style={{ fontSize: '7px', fontWeight: '900', color: '#7F1D1D', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Member Contact</p>
                                 <p style={{ fontSize: '8.5px', fontWeight: '700', color: '#1F2937', margin: 0, lineHeight: '1.35', letterSpacing: '0.02em' }}>
                                    Tel: {user?.phone || "+251..."}  •  Email: {user?.email || "N/A"}
                                 </p>
                              </div>
                            )}

                            {/* Contact Details from CMS */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                               <p style={{ fontSize: '7px', fontWeight: '900', color: '#7F1D1D', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>ERCS Headquarters Contact</p>
                               <p style={{ fontSize: '8px', fontWeight: '600', color: '#374151', margin: 0, lineHeight: '1.4', letterSpacing: '0.02em' }}>
                                  Tel: {cmsContact.tel || cmsContact.mobile}<br />
                                  Email: {cmsContact.email}<br />
                                  Web: {cmsContact.web || "www.redcrosseth.org"}
                               </p>
                            </div>
                         </div>
                         
                         <div style={{ width: '32%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <div style={{ padding: '6px', backgroundColor: 'white', border: '2px solid #F3F4F6', borderRadius: '12px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                               <QRCodeCanvas 
                                 value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${user?.memberId || 'NOT_ASSIGNED'}`}
                                 size={60}
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
                            <p style={{ fontSize: '5px', fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.15em', textAlign: 'center', margin: 0 }}>Scan to Verify<br />{user?.memberId}</p>
                         </div>
                      </div>
  
                      <div style={{ padding: '0 20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '30px' }}>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'center', flex: 1 }}>
                            <div style={{ height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                               {user?.idAssets?.signature1Url ? (
                                 <img src={user.idAssets.signature1Url} alt="Signature 1" style={{ height: '100%', objectFit: 'contain', filter: 'grayscale(100%)', opacity: 0.7 }} crossOrigin="anonymous" />
                               ) : (
                                 <span style={{ fontStyle: 'italic', fontFamily: 'serif', color: '#D1D5DB', fontSize: '11px' }}>Signature</span>
                               )}
                            </div>
                            <p style={{ fontSize: '6px', fontWeight: '900', color: '#7F1D1D', textTransform: 'uppercase', borderTop: '1px solid #F3F4F6', paddingTop: '3px', margin: 0 }}>General Secretary</p>
                         </div>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'center', flex: 1 }}>
                            <div style={{ height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                               {user?.idAssets?.signature2Url ? (
                                 <img src={user.idAssets.signature2Url} alt="Signature 2" style={{ height: '100%', objectFit: 'contain', filter: 'grayscale(100%)', opacity: 0.7 }} crossOrigin="anonymous" />
                               ) : (
                                 <span style={{ fontStyle: 'italic', fontFamily: 'serif', color: '#D1D5DB', fontSize: '11px' }}>Signature</span>
                               )}
                            </div>
                            <p style={{ fontSize: '6px', fontWeight: '900', color: '#7F1D1D', textTransform: 'uppercase', borderTop: '1px solid #F3F4F6', paddingTop: '3px', margin: 0 }}>Branch Manager</p>
                         </div>
                      </div>

                      {/* Bottom Location from CMS Contact Us section */}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: '#ED1C24', padding: '5px 16px', textAlign: 'center' }}>
                         <p style={{ fontSize: '7.5px', fontWeight: '700', color: 'white', textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {cmsContact.address}  •  Tel: {cmsContact.tel || cmsContact.mobile}
                         </p>
                      </div>
                   </div>
                </div>
              </div>
          </div>
        </div>

        {/* Footer Support */}
        <div className="bg-[#ED1C24] rounded-[32px] p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4 text-center md:text-left">
              <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 shrink-0">
                 <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                 <h4 className="text-base font-black">Secure Your Membership</h4>
                 <p className="text-xs font-medium opacity-70">Keep your information up to date to ensure seamless access to ERCS benefits.</p>
              </div>
           </div>
           <button 
             onClick={() => router.push("/dashboard/profile")}
             className="whitespace-nowrap px-6 py-3 bg-white text-[#ED1C24] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all shadow-md cursor-pointer"
           >
              Update Profile Information
           </button>
        </div>
      </div>
    </div>
  );
}

  // --- VOLUNTEER DASHBOARD VIEW (Original) ---
  return (
    <div className="p-6 md:p-10 space-y-10">
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
              <p className="text-xs font-medium opacity-80">Please upload your photo to complete your Digital ID card and verify your volunteer status.</p>
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
            <button 
              onClick={() => router.push("/dashboard/notifications")}
              className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-400 hover:text-black transition-colors cursor-pointer"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-3 right-3 h-2 w-2 bg-[#ED1C24] rounded-full border-2 border-white" />
            </button>
          </div>
          <button 
            onClick={() => router.push(isVolunteer ? "/dashboard/events" : "/join/member")}
            className="bg-[#ED1C24] text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
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
                  {user?.isApproved ? (
                    <div className="bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Verified Member</span>
                    </div>
                  ) : (
                    <div className="bg-amber-500/20 border border-amber-500/30 px-4 py-2 rounded-full flex items-center gap-2">
                      <Clock className="h-3 w-3 text-amber-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Awaiting Approval</span>
                    </div>
                  )}
               </div>

                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                   <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Full Name</p>
                     <p className="text-2xl font-black tracking-tight">{user?.fullName && user.fullName !== "undefined undefined" ? user.fullName : (user?.firstName || "Valued Member")}</p>
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
              <div className="space-y-4 relative z-10 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
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
            <Button 
              onClick={() => router.push("/news")}
              variant="outline" 
              className="w-full h-14 rounded-2xl border-2 border-gray-100 font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:text-black cursor-pointer"
            >
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
             <Button 
                onClick={() => router.push("/donate")}
                className="w-full h-14 bg-white text-[#ED1C24] hover:bg-black hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer"
             >
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
