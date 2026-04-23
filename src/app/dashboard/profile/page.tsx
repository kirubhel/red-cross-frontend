"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  ShieldCheck, 
  ArrowLeft,
  Loader2,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    fatherName: "",
    grandfatherName: "",
    email: "",
    phone: "",
    region: "",
    bio: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/person/profile");
        // GetSelfProfile returns GetPersonResponse which has a 'person' field
        const data = res.data.person || res.data;
        
        setUser(data);
        setFormData({
          firstName: data.first_name || "",
          fatherName: data.father_name || "",
          grandfatherName: data.grandfather_name || "",
          email: data.email || "",
          phone: data.phone_number || "",
          region: data.region_name || "",
          bio: data.bio || ""
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);

      const uploadRes = await api.post("/person/profile/photo", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const photoUrl = uploadRes.data.url;
      
      // Update profile with new photo
      await api.put("/person/profile", {
        first_name: formData.firstName,
        father_name: formData.fatherName,
        grandfather_name: formData.grandfatherName,
        email: formData.email,
        phone_number: formData.phone,
        region_name: formData.region,
        bio: formData.bio,
        photo_url: photoUrl
      });

      setUser((prev: any) => ({ ...prev, photo_url: photoUrl }));
      alert("Profile photo updated!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put("/person/profile", {
        first_name: formData.firstName,
        father_name: formData.fatherName,
        grandfather_name: formData.grandfatherName,
        email: formData.email,
        phone_number: formData.phone,
        region_name: formData.region,
        bio: formData.bio,
        photo_url: user?.photo_url
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#ED1C24] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <Link 
            href="/dashboard" 
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#ED1C24] transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black tracking-tighter text-black">My Profile</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
            Manage your personal information and digital identity
          </p>
        </div>
        <div className="bg-green-50 text-green-600 px-4 py-2 rounded-2xl flex items-center gap-2 border border-green-100 shadow-sm shadow-green-500/5">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Verified Account</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
        {/* Left Column: Photo & ID Summary */}
        <div className="space-y-8">
          <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="h-40 w-40 rounded-[32px] overflow-hidden bg-gray-100 border-4 border-white shadow-xl group-hover:scale-[1.02] transition-transform duration-500">
                {user?.photo_url ? (
                  <img src={user.photo_url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-300">
                    <User className="h-20 w-20" />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-[28px]">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 h-12 w-12 bg-[#ED1C24] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 hover:scale-110 active:scale-95 transition-all"
              >
                <Camera className="h-5 w-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-black tracking-tight">{formData.firstName} {formData.fatherName}</h2>
              <p className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest">{user?.ercs_id || "ERCS MEMBER"}</p>
            </div>

            <div className="w-full pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
               <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                  <p className="text-sm font-black text-green-500 uppercase">{user?.status || "ACTIVE"}</p>
               </div>
               <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</p>
                  <p className="text-sm font-black text-black">March 2024</p>
               </div>
            </div>
          </div>

          {/* Membership Badge */}
          <div className="bg-black rounded-[40px] p-8 text-white space-y-6 shadow-2xl shadow-black/10 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-6 opacity-10">
                <CreditCard className="h-24 w-24 rotate-12" />
             </div>
             <div className="relative z-10 space-y-4">
                <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                   <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <div>
                   <h3 className="text-xl font-black tracking-tighter">Digital ID Ready</h3>
                   <p className="text-xs font-medium opacity-60">Your profile information is used to generate your official Digital ID card.</p>
                </div>
                <Link href="/dashboard" className="block text-center py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-colors">
                   View Digital ID
                </Link>
             </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="bg-white rounded-[48px] p-8 md:p-12 border border-gray-100 shadow-sm">
           <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">First Name</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                       <input 
                          type="text" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border-none rounded-2xl h-14 pl-12 pr-6 font-bold text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all" 
                          placeholder="Kebede"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Father's Name</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                       <input 
                          type="text" 
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border-none rounded-2xl h-14 pl-12 pr-6 font-bold text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all" 
                          placeholder="Alemu"
                       />
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Grandfather's Name</label>
                 <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <input 
                       type="text" 
                       name="grandfatherName"
                       value={formData.grandfatherName}
                       onChange={handleInputChange}
                       className="w-full bg-gray-50 border-none rounded-2xl h-14 pl-12 pr-6 font-bold text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all" 
                       placeholder="Bekele"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                       <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border-none rounded-2xl h-14 pl-12 pr-6 font-bold text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all" 
                          placeholder="kebede@example.com"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Phone Number</label>
                    <div className="relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                       <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border-none rounded-2xl h-14 pl-12 pr-6 font-bold text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all" 
                          placeholder="+251 911..."
                       />
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Region / Branch</label>
                 <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <input 
                       type="text" 
                       name="region"
                       value={formData.region}
                       onChange={handleInputChange}
                       className="w-full bg-gray-50 border-none rounded-2xl h-14 pl-12 pr-6 font-bold text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all" 
                       placeholder="Addis Ababa Branch"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Bio / About You</label>
                 <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none rounded-3xl p-6 font-bold text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all min-h-[120px]" 
                    placeholder="Tell us about your commitment to humanitarian work..."
                 />
              </div>

              <div className="pt-4 flex flex-col md:flex-row gap-4">
                 <Button 
                    type="submit" 
                    disabled={saving}
                    className="flex-1 bg-[#ED1C24] hover:bg-black text-white h-16 rounded-[24px] font-black tracking-widest uppercase text-xs shadow-xl shadow-red-500/20 transition-all gap-2"
                 >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Profile Changes
                 </Button>
                 <Button 
                    type="button" 
                    variant="outline"
                    className="md:w-48 h-16 rounded-[24px] border-2 border-gray-100 font-black tracking-widest uppercase text-xs hover:bg-gray-50 transition-all"
                 >
                    Cancel
                 </Button>
              </div>
           </form>

           {/* Security Note */}
           <div className="mt-12 p-6 bg-gray-50 rounded-3xl flex items-start gap-4">
              <div className="p-2 bg-white rounded-xl border border-gray-100">
                 <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                 <p className="text-xs font-black uppercase tracking-tight text-gray-900">Important Security Notice</p>
                 <p className="text-[11px] font-medium text-gray-400 mt-1">Changes to your name or membership ID may require manual verification from an ERCS administrator before they are reflected on your physical ID card.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
