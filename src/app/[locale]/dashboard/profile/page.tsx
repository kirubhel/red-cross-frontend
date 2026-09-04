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
  AlertCircle,
  X,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ImageCropper from "@/components/profile/ImageCropper";
import SelfieCameraModal from "@/components/profile/SelfieCameraModal";
import PhoneNumberInput, { buildFullPhoneNumber, stripDialCode } from "@/components/ui/phone-number-input";
import EthiopianDatePicker from "@/components/EthiopianDatePicker";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import { 
  REGIONS, 
  REGION_MAP_VALUE_TO_ID, 
  ETHIOPIA_LOCATION_DATA, 
  getWoredasForZone,
  resolveRegionId 
} from "@/lib/constants";

const detectCountryFromPhone = (phone: string): string => {
  if (!phone) return "ET";
  const countries = getCountries();
  for (const country of countries) {
    const dialCode = `+${getCountryCallingCode(country)}`;
    if (phone.startsWith(dialCode)) {
      return country;
    }
  }
  return "ET";
};

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);
  const [isSelfieModalOpen, setIsSelfieModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [countryIso, setCountryIso] = useState("ET");

  // Dynamic location options
  const [zones, setZones] = useState<{ id: string; name: string }[]>([]);
  const [woredas, setWoredas] = useState<{ id: string; name: string }[]>([]);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    fatherName: "",
    grandfatherName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    occupation: "",
    organizationName: "",
    educationLevel: "",
    educationalBackground: "",
    area: "",
    languages: "",
    kebele: "",
    region: 0,
    zone: "",
    woreda: "",
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
        
        let meta: any = {};
        try {
          if (typeof data.metadata === 'string' && data.metadata) {
            meta = JSON.parse(data.metadata);
          } else if (typeof data.metadata === 'object' && data.metadata) {
            meta = data.metadata;
          }
        } catch (e) {
          console.warn("Failed to parse metadata", e);
        }

        const rawPhone = data.phone_number || data.phone || "";
        const country = detectCountryFromPhone(rawPhone);
        const localPhone = stripDialCode(rawPhone, country);

        const resolvedRegion = resolveRegionId(
          data.region_id || data.region || meta.region || meta.region_id,
          REGIONS
        );

        const resolvedZone = data.zone_id || data.zoneId || data.zone || meta.zone_id || meta.zone || meta.zone_name || "";
        const resolvedWoreda = data.woreda_id || data.woredaId || data.woreda || meta.woreda_id || meta.woreda || meta.woreda_name || "";
        const resolvedGrandfather = data.grandfather_name || data.grandfatherName || data.last_name || data.lastName || meta.grandfather_name || meta.last_name || meta.grandfatherName || meta.lastName || "";

        setCountryIso(country);
        setFormData({
          firstName: data.first_name || data.firstName || "",
          fatherName: data.father_name || data.fatherName || "",
          grandfatherName: resolvedGrandfather,
          email: data.email || "",
          phone: localPhone,
          gender: data.gender || meta.gender || "",
          dateOfBirth: data.date_of_birth || meta.date_of_birth || meta.dateOfBirth || "",
          occupation: data.profession || meta.occupation || "",
          organizationName: meta.organization_name || meta.organizationName || "",
          educationLevel: meta.education_level || meta.educationLevel || "",
          educationalBackground: meta.educational_background || meta.educationalBackground || "",
          area: meta.area || "",
          languages: meta.languages || "",
          kebele: data.kebele_id || meta.kebele || meta.kebele_id || "",
          region: resolvedRegion,
          zone: resolvedZone,
          woreda: resolvedWoreda,
          bio: meta.bio || ""
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch Zones whenever region changes
  useEffect(() => {
    if (formData.region && formData.region > 0) {
      const regionObj = REGIONS.find(r => r.id === Number(formData.region));
      const regionVal = regionObj?.value || `REGION_${regionObj?.name?.toLowerCase().replace(/\s+/g, '_')}`;
      
      api.get(`/location/zones?region_id=${formData.region}`).then(res => {
        if (res.data?.zones && res.data.zones.length > 0) {
          setZones(res.data.zones);
        } else {
          setZones(ETHIOPIA_LOCATION_DATA[regionVal]?.zones || []);
        }
      }).catch(() => {
        setZones(ETHIOPIA_LOCATION_DATA[regionVal]?.zones || []);
      });
    } else {
      setZones([]);
    }
  }, [formData.region]);

  // Fetch Woredas whenever zone changes
  useEffect(() => {
    if (formData.zone) {
      api.get(`/location/woredas?zone_id=${formData.zone}`).then(res => {
        if (res.data?.woredas && res.data.woredas.length > 0) {
          setWoredas(res.data.woredas);
        } else {
          setWoredas(getWoredasForZone(formData.zone));
        }
      }).catch(() => {
        setWoredas(getWoredasForZone(formData.zone));
      });
    } else {
      setWoredas([]);
    }
  }, [formData.zone]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'region' ? parseInt(value, 10) : value 
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Size limit: 3MB
    if (file.size > 3 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Profile photo must be smaller than 3MB."
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setSelectedImage(reader.result as string);
    });
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    try {
      setUploading(true);
      
      const file = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });
      const fd = new FormData();
      fd.append("file", file);

      // 1. Upload to storage
      const uploadRes = await api.post("/person/profile/photo", fd);
      const photoUrl = uploadRes.data.url;
      
      if (!photoUrl) throw new Error("Storage server did not return a valid URL");

      // 2. Update profile
      const personData = { ...(user || {}) };
      
      if (personData.region_id && !personData.region) {
        personData.region = personData.region_id;
      }

      if (personData.date_of_birth === "") {
        delete personData.date_of_birth;
      }

      await api.put("/person/profile", {
        ...personData,
        photo_url: photoUrl
      });

      setUser((prev: any) => ({ ...prev, photo_url: photoUrl }));
      toast.success("Profile photo updated!", {
        description: "Your identification photo has been refreshed."
      });
    } catch (err: any) {
      console.error("Upload failed:", err);
      const errorDetail = err.response?.data?.error || err.response?.data || err.message;
      toast.error("Failed to upload photo", {
        description: typeof errorDetail === 'string' ? errorDetail : "Please try again later."
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      let meta: any = {};
      try {
        if (typeof user?.metadata === 'string' && user.metadata) {
          meta = JSON.parse(user.metadata);
        } else if (typeof user?.metadata === 'object' && user.metadata) {
          meta = { ...user.metadata };
        }
      } catch (e) {
        console.warn("Failed to parse existing metadata", e);
      }
      meta.bio = formData.bio;
      meta.date_of_birth = formData.dateOfBirth;
      meta.gender = formData.gender;
      meta.occupation = formData.occupation;
      meta.organization_name = formData.organizationName;
      meta.education_level = formData.educationLevel;
      meta.educational_background = formData.educationalBackground;
      meta.educationalBackground = formData.educationalBackground;
      meta.area = formData.area;
      meta.languages = formData.languages;
      meta.kebele = formData.kebele;
      meta.zone = formData.zone;
      meta.woreda = formData.woreda;
      meta.grandfather_name = formData.grandfatherName;
      meta.last_name = formData.grandfatherName;
      const metaString = JSON.stringify(meta);

      const fullPhone = buildFullPhoneNumber(countryIso, formData.phone);

      await api.put("/person/profile", {
        id: user?.id,
        first_name: formData.firstName,
        father_name: formData.fatherName,
        grandfather_name: formData.grandfatherName,
        last_name: formData.grandfatherName,
        email: formData.email,
        phone_number: fullPhone,
        gender: formData.gender,
        date_of_birth: formData.dateOfBirth,
        profession: formData.occupation,
        region: Number(formData.region),
        zone_id: formData.zone,
        woreda_id: formData.woreda,
        metadata: metaString,
        photo_url: user?.photo_url
      });

      // Update local state so subsequent saves have latest metadata
      setUser((prev: any) => ({
        ...prev,
        ...formData,
        first_name: formData.firstName,
        father_name: formData.fatherName,
        grandfather_name: formData.grandfatherName,
        last_name: formData.grandfatherName,
        phone_number: fullPhone,
        metadata: metaString
      }));

      toast.success("Profile updated successfully!", {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
      });
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update profile.", {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 text-[#ED1C24] animate-spin" />
      </div>
    );
  }

  const fullNameDisplay = [formData.firstName, formData.fatherName, formData.grandfatherName].filter(Boolean).join(" ");

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Link 
            href="/dashboard" 
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#ED1C24] transition-colors flex items-center gap-1.5 group"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-black">My Profile</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">
            Manage your personal information and digital identity
          </p>
        </div>
        <div className="bg-green-50 text-green-600 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-green-100 shadow-xs">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="text-[9px] font-black uppercase tracking-widest">Verified Account</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Left Column: Photo & ID Summary */}
        <div className="space-y-5">
          <div className="bg-white rounded-[28px] p-5 border border-gray-100 shadow-xs flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <div className="h-28 w-28 rounded-[24px] overflow-hidden bg-gray-100 border-4 border-white shadow-md group-hover:scale-[1.02] transition-transform duration-300">
                {user?.photo_url ? (
                  <img src={user.photo_url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-300">
                    <User className="h-14 w-14" />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center rounded-[20px]">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <button 
                type="button"
                onClick={() => setIsPhotoMenuOpen(true)}
                className="absolute -bottom-1.5 -right-1.5 h-9 w-9 bg-[#ED1C24] text-white rounded-xl flex items-center justify-center shadow-md shadow-red-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Change profile photo"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            
            <div className="space-y-0.5">
              <h2 className="text-base font-black tracking-tight text-gray-900">{fullNameDisplay || "Valued Member"}</h2>
              <p className="text-[9px] font-black text-[#ED1C24] uppercase tracking-widest">{user?.ercs_id || (user?.role === "VOLUNTEER" ? "ERCS VOLUNTEER" : "ERCS MEMBER")}</p>
            </div>

            <div className="w-full pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
               <div className="text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                  <p className="text-xs font-black text-green-500 uppercase mt-0.5">{user?.status || "ACTIVE"}</p>
               </div>
               <div className="text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Joined</p>
                  <p className="text-xs font-black text-black mt-0.5">March 2024</p>
               </div>
            </div>
          </div>

          {/* Membership Badge */}
          <div className="bg-black rounded-[28px] p-5 text-white space-y-4 shadow-xl shadow-black/10 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <CreditCard className="h-20 w-20 rotate-12" />
             </div>
             <div className="relative z-10 space-y-3">
                <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                   <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <div>
                   <h3 className="text-base font-black tracking-tight">Digital ID Ready</h3>
                   <p className="text-[11px] font-medium opacity-60 mt-0.5">Your profile information is used to generate your official Digital ID card.</p>
                </div>
                <Link href="/dashboard" className="block text-center py-2.5 bg-white text-black rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-gray-100 transition-colors">
                   View Digital ID
                </Link>
             </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="bg-white rounded-[32px] p-5 sm:p-7 border border-gray-100 shadow-xs">
           <form onSubmit={handleSubmit} className="space-y-6">
              {/* Names: 3 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">First Name</label>
                    <div className="relative">
                       <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300 pointer-events-none" />
                       <input 
                          type="text" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 pl-10 pr-3.5 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all" 
                          placeholder="First Name"
                       />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Father's Name</label>
                    <div className="relative">
                       <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300 pointer-events-none" />
                       <input 
                          type="text" 
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 pl-10 pr-3.5 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all" 
                          placeholder="Father's Name"
                       />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Grandfather's Name</label>
                    <div className="relative">
                       <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300 pointer-events-none" />
                       <input 
                          type="text" 
                          name="grandfatherName"
                          value={formData.grandfatherName}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 pl-10 pr-3.5 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all" 
                          placeholder="Grandfather's Name"
                       />
                    </div>
                 </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300 pointer-events-none" />
                       <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 pl-10 pr-3.5 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all" 
                          placeholder="email@example.com"
                       />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Phone Number</label>
                    <PhoneNumberInput
                       countryCode={countryIso}
                       onCountryChange={(code) => {
                          setCountryIso(code);
                          setFormData(prev => ({ ...prev, phone: "" }));
                       }}
                       localNumber={formData.phone}
                       onLocalNumberChange={(val) =>
                          setFormData(prev => ({ ...prev, phone: val }))
                       }
                       inputClassName="h-11 bg-gray-50 border border-gray-100 text-gray-900 rounded-r-xl font-bold text-xs focus:ring-0"
                    />
                 </div>
              </div>

              {/* Gender & Date of Birth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Gender</label>
                    <select
                       name="gender"
                       value={formData.gender}
                       onChange={handleInputChange}
                       className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 px-4 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all appearance-none cursor-pointer"
                    >
                       <option value="">Select Gender</option>
                       <option value="MALE">MALE</option>
                       <option value="FEMALE">FEMALE</option>
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Date of Birth (Eth)</label>
                    <EthiopianDatePicker
                       id="dateOfBirth"
                       value={formData.dateOfBirth}
                       onChange={(val) => setFormData(prev => ({ ...prev, dateOfBirth: val }))}
                    />
                 </div>
              </div>

              {/* Occupation & Organization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Occupation</label>
                    <input
                       type="text"
                       name="occupation"
                       value={formData.occupation}
                       onChange={handleInputChange}
                       className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 px-4 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all"
                       placeholder="e.g. Civil Servant, Farmer..."
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Organization Name</label>
                    <input
                       type="text"
                       name="organizationName"
                       value={formData.organizationName}
                       onChange={handleInputChange}
                       className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 px-4 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all"
                       placeholder="Organization / Company Name"
                    />
                 </div>
              </div>

              {/* Education Level & Educational Background */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Education Level</label>
                    <select
                       name="educationLevel"
                       value={formData.educationLevel}
                       onChange={handleInputChange}
                       className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 px-4 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all appearance-none cursor-pointer"
                    >
                       <option value="">Select Education Level</option>
                       <option value="Below Primary School">Below Primary School</option>
                       <option value="Primary School Completed">Primary School Completed</option>
                       <option value="High School Completed">High School Completed</option>
                       <option value="Degree">Degree</option>
                       <option value="Masters">Masters</option>
                       <option value="PHD">PHD</option>
                    </select>
                 </div>
                  <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Educational Background</label>
                     <input
                        type="text"
                        name="educationalBackground"
                        value={formData.educationalBackground || ""}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 px-4 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all"
                        placeholder="e.g. B.Sc in Public Health, AAU"
                     />
                  </div>
               </div>

               {/* Area */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Area</label>
                     <select
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 px-4 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all appearance-none cursor-pointer"
                     >
                        <option value="">Select Area</option>
                        <option value="URBAN">URBAN</option>
                        <option value="RURAL">RURAL</option>
                     </select>
                  </div>
              </div>

              {/* Languages & Kebele */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Languages</label>
                    <input
                       type="text"
                       name="languages"
                       value={formData.languages}
                       onChange={handleInputChange}
                       className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 px-4 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all"
                       placeholder="e.g. Amharic, English, Oromiffa..."
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Kebele / House No.</label>
                    <input
                       type="text"
                       name="kebele"
                       value={formData.kebele}
                       onChange={handleInputChange}
                       className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 px-4 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all"
                       placeholder="Kebele or House Number"
                    />
                 </div>
              </div>

              {/* Geographic Hierarchy: Region, Zone, Woreda */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Region / Branch</label>
                    <div className="relative">
                       <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300 pointer-events-none" />
                       <select 
                          name="region"
                          value={formData.region}
                          onChange={(e) => {
                            const rId = parseInt(e.target.value, 10);
                            setFormData(prev => ({ ...prev, region: rId, zone: "", woreda: "" }));
                          }}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 pl-10 pr-4 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all appearance-none cursor-pointer"
                       >
                          <option value={0}>Select Region</option>
                          {REGIONS.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                       </select>
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Zone / Subcity</label>
                    <div className="relative">
                       <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300 pointer-events-none" />
                       {zones.length > 0 ? (
                         <select
                            name="zone"
                            value={formData.zone}
                            onChange={(e) => setFormData(prev => ({ ...prev, zone: e.target.value, woreda: "" }))}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 pl-10 pr-4 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all appearance-none cursor-pointer"
                         >
                            <option value="">Select Zone</option>
                            {zones.map(z => (
                              <option key={z.id} value={z.id}>{z.name}</option>
                            ))}
                         </select>
                       ) : (
                         <input 
                            type="text" 
                            name="zone"
                            value={formData.zone}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 pl-10 pr-3.5 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all" 
                            placeholder="Zone / Subcity"
                         />
                       )}
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Woreda / District</label>
                    <div className="relative">
                       <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300 pointer-events-none" />
                       {woredas.length > 0 ? (
                         <select
                            name="woreda"
                            value={formData.woreda}
                            onChange={(e) => setFormData(prev => ({ ...prev, woreda: e.target.value }))}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 pl-10 pr-4 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all appearance-none cursor-pointer"
                         >
                            <option value="">Select Woreda</option>
                            {woredas.map(w => (
                              <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                         </select>
                       ) : (
                         <input 
                            type="text" 
                            name="woreda"
                            value={formData.woreda}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 pl-10 pr-3.5 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all" 
                            placeholder="Woreda / District"
                         />
                       )}
                    </div>
                 </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">Bio / About You</label>
                 <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-xs text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all min-h-[90px]" 
                    placeholder="Tell us about your commitment to humanitarian work..."
                 />
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                 <Button 
                    type="submit" 
                    disabled={saving}
                    className="flex-1 bg-[#ED1C24] hover:bg-black text-white h-12 rounded-xl font-black tracking-widest uppercase text-[10px] shadow-lg shadow-red-500/20 transition-all gap-2 cursor-pointer"
                 >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Profile Changes
                 </Button>
                 <Link href="/dashboard">
                   <Button 
                      type="button" 
                      variant="outline"
                      className="w-full sm:w-36 h-12 rounded-xl border border-gray-200 font-black tracking-widest uppercase text-[10px] hover:bg-gray-50 transition-all cursor-pointer"
                   >
                      Cancel
                   </Button>
                 </Link>
              </div>
           </form>

           {/* Security Note */}
           <div className="mt-8 p-4 bg-gray-50 rounded-2xl flex items-start gap-3 border border-gray-100">
              <div className="p-1.5 bg-white rounded-lg border border-gray-100 shrink-0">
                 <AlertCircle className="h-4 w-4 text-amber-500" />
              </div>
              <div className="flex-1">
                 <p className="text-[11px] font-black uppercase tracking-tight text-gray-900">Important Security Notice</p>
                 <p className="text-[10px] font-medium text-gray-500 mt-0.5">Changes to your name or identification details are secured and synchronized with your digital ERCS ID card.</p>
              </div>
           </div>
           <div className="mt-3 flex justify-end">
             <Link
               href="/delete-account"
               className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
             >
               Delete my account
             </Link>
           </div>
        </div>
      </div>
      {selectedImage && (
        <ImageCropper
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setSelectedImage(null)}
        />
      )}

      {/* Live Selfie Camera Modal */}
      <SelfieCameraModal
        isOpen={isSelfieModalOpen}
        onCapture={(imgDataUrl) => {
          setSelectedImage(imgDataUrl);
        }}
        onClose={() => setIsSelfieModalOpen(false)}
      />

      {/* Photo Selection Dialog */}
      {isPhotoMenuOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-gray-100 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900">Profile Photo</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Select Photo Source</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoMenuOpen(false)}
                className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Take Selfie Option */}
              <button
                type="button"
                onClick={() => {
                  setIsPhotoMenuOpen(false);
                  setIsSelfieModalOpen(true);
                }}
                className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-red-50/70 border border-red-100/80 hover:bg-red-100/80 active:scale-[0.98] transition-all text-left group cursor-pointer"
              >
                <div className="h-11 w-11 rounded-xl bg-[#ED1C24] text-white flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-900">Take a Selfie</p>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">Use your camera / webcam</p>
                </div>
              </button>

              {/* Upload from Device Option */}
              <button
                type="button"
                onClick={() => {
                  setIsPhotoMenuOpen(false);
                  fileInputRef.current?.click();
                }}
                className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-gray-50 border border-gray-200/80 hover:bg-gray-100 active:scale-[0.98] transition-all text-left group cursor-pointer"
              >
                <div className="h-11 w-11 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-md shadow-black/10 group-hover:scale-105 transition-transform">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-900">Upload from Device</p>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">Choose an image from files</p>
                </div>
              </button>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPhotoMenuOpen(false)}
              className="w-full h-10 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-900"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
