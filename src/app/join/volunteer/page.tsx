"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  CheckCircle, 
  Heart, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Star,
  Plus,
  ChevronRight,
  Eye,
  EyeOff,
  Check,
  Globe
} from "lucide-react";
import PhoneNumberInput, { buildFullPhoneNumber, ALL_COUNTRIES } from "@/components/ui/phone-number-input";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { REGIONS, REGION_MAP_VALUE_TO_ID, GENDER_OPTIONS } from "@/lib/constants";




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

import Header from "@/components/layout/Header";

export default function VolunteerJoinPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Personal, 2: Engagement/Skills, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formConfig, setFormConfig] = useState<any[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    password: "",
    confirmPassword: "",
    region: "REGION_addis_ababa",
    skills: "",
    interests: "",
    engagementAreas: [],
    otherEngagementArea: "",
    country: "ET",
    phoneNumber: "",
    internationalAddress: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [zones, setZones] = useState<any[]>([]);
  const [woredas, setWoredas] = useState<any[]>([]);

  const handlePhoneBlur = async () => {
    if (!formData.phoneNumber || formData.phoneNumber.length < 8) {
      setPhoneExists(false);
      return;
    }
    const fullPhone = buildFullPhoneNumber(formData.country || "ET", formData.phoneNumber);
    setCheckingPhone(true);
    try {
      const res = await api.get(`/public/check-phone?phone=${encodeURIComponent(fullPhone)}`);
      if (res.data?.exists) {
        setPhoneExists(true);
        setError("This phone number is already registered. If you already have an account, please log in.");
      } else {
        setPhoneExists(false);
        if (error && error.includes("already registered")) {
          setError("");
        }
      }
    } catch (err) {
      console.error("Error checking phone number:", err);
    } finally {
      setCheckingPhone(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configRes, plansRes] = await Promise.all([
          api.get("/config/form?type=VOLUNTEER"),
          api.get("/config/membership")
        ]);
        
        const fields = JSON.parse(configRes.data.fields_json);
        setFormConfig(fields);
        setMembershipPlans(plansRes.data);
        
        const initialData: any = { ...formData };
        fields.forEach((f: any) => {
           if (initialData[f.id] === undefined) initialData[f.id] = "";
        });
        setFormData(initialData);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    fetchData();
  }, []);

  // Fetch Zones
  useEffect(() => {
    if (formData.region && formData.country === "ET") {
      const regionId = REGION_MAP_VALUE_TO_ID[formData.region];
      api.get(`/location/zones?region_id=${regionId}`).then(res => {
        setZones(res.data.zones || []);
      }).catch(err => console.error("Failed to fetch zones:", err));
    } else {
      setZones([]);
    }
  }, [formData.region, formData.country]);

  // Fetch Woredas
  useEffect(() => {
    if (formData.zone && formData.country === "ET") {
      api.get(`/location/woredas?zone_id=${formData.zone}`).then(res => {
        setWoredas(res.data.woredas || []);
      }).catch(err => console.error("Failed to fetch woredas:", err));
    } else {
      setWoredas([]);
    }
  }, [formData.zone, formData.country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    const newData: any = { ...formData, [id]: value };
    
    // Cascading resets
    if (id === "country" && value !== "ET") {
        newData.region = "";
        newData.zone = "";
        newData.woreda = "";
    } else if (id === "region") {
        newData.zone = "";
        newData.woreda = "";
    } else if (id === "zone") {
        newData.woreda = "";
    }
    
    setFormData(newData);
  };

  const toggleEngagementArea = (area: string) => {
    const current = formData.engagementAreas;
    if (current.includes(area)) {
       setFormData({ ...formData, engagementAreas: current.filter((a: string) => a !== area) });
    } else {
       setFormData({ ...formData, engagementAreas: [...current, area] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
        if (!formData.phoneNumber) {
            setError("Phone number is required.");
            return;
        }

        const missingFields = formConfig.filter(f => {
            if (f.required && !formData[f.id] && f.type !== 'tel') {
                // If country is not Ethiopia, don't require region fields
                if (formData.country !== 'ET' && (f.dataSource === 'REGIONS' || f.id === 'region')) {
                    return false;
                }
                return true;
            }
            return false;
        });

        if (formData.country !== 'ET' && !formData.internationalAddress) {
            setError("Please provide your full international address.");
            return;
        }

        if (missingFields.length > 0) {
            setError(`Please fill in: ${missingFields.map(f => f.label).join(", ")}`);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setStep(2);
    } else {
        let finalAreas: string[] = [];
        if (formData.general === "YES") finalAreas.push("General");
        if (formData.youth === "YES") finalAreas.push("Youth");
        if (formData.professional === "YES") finalAreas.push("Professional");
        if (formData.leadership === "YES") finalAreas.push("Leadership");

        if (finalAreas.length === 0 && (!formData.engagementAreas || formData.engagementAreas.length === 0)) {
            setError("Please select at least one engagement area.");
            return;
        }

        if (finalAreas.length === 0) {
            finalAreas = [...(formData.engagementAreas || [])];
        }

        setLoading(true);
        try {
            const regionId = formData.country === "ET" ? (REGION_MAP_VALUE_TO_ID[formData.region] || 1) : 14;

            const fullPhone = buildFullPhoneNumber(
                formData.country || "ET",
                formData.phoneNumber
            );

            // Collect dynamic metadata fields
            const metadataObj: any = {
                country: formData.country,
                international_address: formData.country === 'ET' ? "" : formData.internationalAddress,
                zone_id: formData.zone,
                woreda_id: formData.woreda
            };

            // Loop through all custom form fields to add non-standard fields into metadata
            if (Array.isArray(formConfig)) {
                const standardFields = ['firstName', 'fatherName', 'grandfatherName', 'email', 'phone', 'gender', 'region', 'country', 'password', 'confirmPassword'];
                formConfig.forEach((field: any) => {
                    if (!standardFields.includes(field.id)) {
                        metadataObj[field.id] = formData[field.id];
                    }
                });
            }

            const interests = [];
            if (formData.area) interests.push(`Area:${formData.area}`);
            if (formData.educationLevel) interests.push(`Education:${formData.educationLevel}`);
            if (formData.organizationName) interests.push(`OrgName:${formData.organizationName}`);
            if (formData.organizationType) interests.push(`OrgType:${formData.organizationType}`);

            // Register User
            const res = await api.post("/auth/register/volunteer", {
                first_name: formData.firstName,
                father_name: formData.fatherName,
                grandfather_name: formData.grandfatherName,
                email: formData.email,
                phone_number: fullPhone,
                password: formData.password,
                region: regionId,
                role: 5, // ROLE_volunteer
                skills: formData.languages ? formData.languages.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
                interests: interests,
                engagement_areas: finalAreas,
                gender: formData.gender,
                date_of_birth: formData.dateOfBirth || "",
                profession: formData.occupation || "",
                address: formData.kebele || "",
                country: formData.country === "ET" ? "Ethiopia" : (formData.country || ""),
                metadata: JSON.stringify(metadataObj)
            });

            // Save session
            if (res.data.access_token || res.data.accessToken) {
                const tokenVal = res.data.access_token || res.data.accessToken;
                localStorage.setItem("token", tokenVal);
                localStorage.setItem("access_token", tokenVal);
                localStorage.setItem("user_role", "VOLUNTEER");
                const ercsIdVal = res.data.ercs_id || res.data.ercsId;
                if (ercsIdVal) localStorage.setItem("ercs_id", ercsIdVal);
            }

            setStep(3);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4 }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Header minimal={true} />


       <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-7xl grid lg:grid-cols-[1fr_640px] gap-20 items-start pt-10">
            
            <div className="hidden lg:flex flex-col space-y-6 sticky top-20">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                        <Star className="h-2.5 w-2.5 fill-current" /> Join the Mission
                    </div>
                    <h1 className="text-6xl font-black text-black leading-[0.8] tracking-tighter">
                        Become a <br />
                        <span className="text-[#ED1C24]">Force for Good.</span>
                    </h1>
                    <p className="text-lg text-black/60 font-medium max-w-sm">
                        Your time and skills can save lives. Join our network of over 6.2 million volunteers across Ethiopia.
                    </p>
                </div>

                <div className="space-y-6 pt-10 border-t border-gray-100">
                    {[
                        { icon: Heart, text: "Direct Community Impact" },
                        { icon: Star, text: "Gain Professional Experience" },
                        { icon: User, text: "Global Humanitarian Network" }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                <item.icon className="h-5 w-5 text-[#ED1C24]" />
                            </div>
                            <span className="font-bold text-black/80">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-white p-6 md:p-8 rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-gray-100 h-fit"
            >
        <div className="w-full text-left mb-8"> {/* Increased space below the header block */}
  <h1 className="text-2xl md:text-3xl font-black text-black tracking-normal uppercase leading-none">
    Volunteer &nbsp; Registration &nbsp; Form
</h1>
    <div className="mt-3 h-1 w-12 bg-[#ED1C24] rounded-full" /> {/* Added space above the accent line */}
</div>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" {...stepVariants}>
                            <div className="space-y-0.5 mb-6 text-left">
                                <h2 className="text-2xl font-black text-black tracking-tighter">Personal Details</h2>
                                <p className="text-black/60 font-black text-[9px] uppercase tracking-widest bg-gray-50 inline-block px-2 py-0.5 rounded-full border border-gray-100">Step 1 of 2</p>
                            </div>

                             <form onSubmit={handleSubmit} className="space-y-6 text-left">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                      {formConfig.map((field: any) => {
                                          if (field.id === 'password' || field.id === 'confirmPassword') return null;

                                          if (field.type === 'tel') {
                                              return (
                                                  <div key={field.id} className="space-y-1 group md:col-span-1">
                                                      <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">{field.label} {field.required && <span className="text-[#ED1C24] text-xs">*</span>}</Label>
                                                      <div className="relative">
                                                          <PhoneNumberInput
                                                              countryCode={formData.country || "ET"}
                                                              onCountryChange={(code) =>
                                                                  setFormData((prev: any) => ({ ...prev, country: code, phoneNumber: "" }))
                                                              }
                                                              localNumber={formData.phoneNumber}
                                                              onLocalNumberChange={(val) => {
                                                                  setFormData((prev: any) => ({ ...prev, phoneNumber: val }));
                                                                  if (phoneExists) setPhoneExists(false);
                                                              }}
                                                              onBlur={handlePhoneBlur}
                                                              required={field.required}
                                                          />
                                                          {checkingPhone && (
                                                              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                                                  <span className="text-[9px] font-bold text-black/40">Checking...</span>
                                                                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-[#ED1C24] border-t-transparent" />
                                                              </div>
                                                          )}
                                                      </div>
                                                      {phoneExists && (
                                                          <div className="mt-1 flex flex-col gap-1.5 p-2.5 bg-red-50 rounded-lg border border-red-100 text-left">
                                                              <span className="text-[10px] font-bold text-[#ED1C24]">This phone number is already registered.</span>
                                                              <button
                                                                  type="button"
                                                                  onClick={() => router.push("/login")}
                                                                  className="text-left text-[9px] font-black text-black hover:text-[#ED1C24] uppercase tracking-wider underline transition-colors"
                                                              >
                                                                  Log In to Portal Now
                                                              </button>
                                                          </div>
                                                      )}
                                                  </div>
                                              );
                                          }

                                          if (field.dataSource === 'REGIONS') {
                                              return (
                                                  <>
                                                      <div key={`${field.id}-country`} className="space-y-1 group md:col-span-1">
                                                          <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Country <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                          <div className="relative">
                                                              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#ED1C24] transition-colors">
                                                                  <Globe className="h-4 w-4" />
                                                              </div>
                                                              <select 
                                                                  id="country" 
                                                                  className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-12 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black"
                                                                  value={formData.country}
                                                                  onChange={handleChange}
                                                              >
                                                                  {ALL_COUNTRIES.map(c => (
                                                                      <option key={c.code} value={c.code}>{c.name}</option>
                                                                  ))}
                                                              </select>
                                                          </div>
                                                      </div>
                                                      
                                                      {formData.country === 'ET' && (
                                                          <div key={`${field.id}-region`} className="space-y-1 group md:col-span-1">
                                                              <Label htmlFor={field.id} className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
                                                              <div className="relative">
                                                                  <select 
                                                                      id={field.id} 
                                                                      required={field.required} 
                                                                      className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-6 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none relative text-black"
                                                                      value={formData[field.id] || ""}
                                                                      onChange={handleChange}
                                                                  >
                                                                      <option value="" disabled>{field.placeholder}</option>
                                                                      {REGIONS.map(r => (
                                                                          <option key={r.value} value={r.value}>{r.name}</option>
                                                                      ))}
                                                                  </select>
                                                              </div>
                                                          </div>
                                                      )}
                                                      {formData.country === 'ET' && !formData.region && <div className="hidden md:block" />}

                                                      {formData.country === 'ET' && formData.region && (
                                                          <motion.div key={`${field.id}-zone`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 group md:col-span-1">
                                                              <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Zone <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                              <select 
                                                                  id="zone" 
                                                                  required
                                                                  className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-6 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black"
                                                                  value={formData.zone}
                                                                  onChange={handleChange}
                                                              >
                                                                  <option value="">Select Zone</option>
                                                                  {zones.map(z => (
                                                                      <option key={z.id} value={z.id}>{z.name}</option>
                                                                  ))}
                                                              </select>
                                                          </motion.div>
                                                      )}
                                                      {formData.country === 'ET' && formData.region && !formData.zone && <div className="hidden md:block" />}

                                                      {formData.country === 'ET' && formData.zone && (
                                                          <motion.div key={`${field.id}-woreda`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 group md:col-span-1">
                                                              <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Woreda / Sub-City <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                              <select 
                                                                  id="woreda" 
                                                                  required
                                                                  className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-6 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black"
                                                                  value={formData.woreda}
                                                                  onChange={handleChange}
                                                              >
                                                                  <option value="">Select Woreda</option>
                                                                  {woredas.map(w => (
                                                                      <option key={w.id} value={w.id}>{w.name}</option>
                                                                  ))}
                                                              </select>
                                                          </motion.div>
                                                      )}

                                                      {formData.country !== 'ET' && (
                                                          <div key={`${field.id}-intl`} className="space-y-1 group md:col-span-1">
                                                              <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Address <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                              <Input 
                                                                 id="internationalAddress" 
                                                                 className="h-10 rounded-lg bg-gray-50 border-none font-bold placeholder:text-black/30 text-black focus:ring-2 focus:ring-[#ED1C24]/10 px-6 transition-all text-xs" 
                                                                 placeholder="Enter your address" 
                                                                 value={formData.internationalAddress} 
                                                                 onChange={handleChange} 
                                                                 required
                                                              />
                                                          </div>
                                                      )}
                                                  </>
                                              );
                                          }

                                          return (
                                              <div key={field.id} className="space-y-1 group md:col-span-1">
                                                   <Label htmlFor={field.id} className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
                                                  <div className="relative">
                                                       {field.type === 'select' ? (
                                                            <select 
                                                                id={field.id} 
                                                                required={field.required} 
                                                                className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-6 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none relative text-black"
                                                               value={formData[field.id] || ""}
                                                               onChange={handleChange}
                                                           >
                                                               <option value="" disabled>{field.placeholder}</option>
                                                               {(
                                                                 field.dataSource === 'GENDER'
                                                                   ? GENDER_OPTIONS :
                                                                 (field.options || [])
                                                               ).map((opt: any, i: number) => (
                                                                   <option key={i} value={opt.value}>{opt.label}</option>
                                                               ))}
                                                           </select>
                                                       ) : (
                                                            <Input 
                                                               id={field.id} 
                                                               type={field.type} 
                                                               required={field.required} 
                                                               className="h-10 rounded-lg bg-gray-50 border-none font-bold placeholder:text-black/30 text-black focus:ring-2 focus:ring-[#ED1C24]/10 px-6 transition-all text-left text-xs" 
                                                              placeholder={field.placeholder} 
                                                              value={formData[field.id] || ""} 
                                                              onChange={handleChange} 
                                                           />
                                                       )}
                                                  </div>
                                              </div>
                                          );
                                      })}

                                      {/* Explicit Password Fields */}
                                       <div className="space-y-1 group md:col-span-1">
                                           <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Create Password <span className="text-[#ED1C24] text-xs">*</span></Label>
                                           <div className="relative">
                                               <Input id="password" type={showPassword ? "text" : "password"} required className="h-10 rounded-lg bg-gray-50 border-none font-bold text-black px-6 pr-12 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all text-xs" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                                          </div>
                                      </div>

                                      <div className="space-y-1 group md:col-span-1">
                                           <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Confirm Password <span className="text-[#ED1C24] text-xs">*</span></Label>
                                           <div className="relative">
                                               <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} required className="h-10 rounded-lg bg-gray-50 border-none font-bold text-black px-6 pr-12 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all text-xs" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                                              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                                          </div>
                                      </div>
                                  </div>

                                  {error && <div className="bg-red-50 text-[#ED1C24] p-2 rounded-lg text-[10px] font-bold text-center border border-red-100 italic">{error}</div>}
                                  <Button type="submit" className="w-full h-12 bg-[#ED1C24] hover:bg-black text-white rounded-xl text-base font-black shadow-lg shadow-red-500/15 transition-all flex items-center justify-center gap-2">Continue <ChevronRight className="h-4 w-4" /></Button>
                             </form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" {...stepVariants}>
                             <div className="space-y-0.5 mb-6 text-left">
                                <h2 className="text-2xl font-black text-black tracking-tighter">Engagement & Skills</h2>
                                <p className="text-black/60 font-black text-[9px] uppercase tracking-widest bg-gray-50 inline-block px-2 py-0.5 rounded-full border border-gray-100">Step 2 of 2</p>
                             </div>

                             <form onSubmit={handleSubmit} className="space-y-8 text-left">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ED1C24] ml-1">Voluntary Service Engagement Areas <span className="text-red-500">*</span></Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {ENGAGEMENT_AREAS.map((area) => (
                                            <div key={area} onClick={() => toggleEngagementArea(area)} className={cn("flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer group", formData.engagementAreas.includes(area) ? "bg-black border-black text-white shadow-md" : "bg-gray-50/50 border-gray-100 text-black/60 hover:border-black/10 hover:bg-white")}>
                                                <div className={cn("w-4 h-4 rounded flex items-center justify-center border-2 transition-all", formData.engagementAreas.includes(area) ? "border-white bg-white" : "border-gray-200")}>{formData.engagementAreas.includes(area) && <Check className="h-3 w-3 text-black" strokeWidth={4} />}</div>
                                                <span className="text-[11px] font-bold leading-tight">{area}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {formData.engagementAreas.includes("Other Services") && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                            <div className="space-y-1">
                                                <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1">Please specify your areas of interest</Label>
                                                <Input id="otherEngagementArea" placeholder="Write your areas of interest..." className="h-10 rounded-lg bg-gray-50 border-none font-bold text-black px-6 focus:ring-2 focus:ring-[#ED1C24]/10 mt-1 text-xs" value={formData.otherEngagementArea} onChange={handleChange} />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1"><Label htmlFor="skills" className="text-[9px] font-black uppercase tracking-widest ml-1 text-black/40">Key Skills (Optional)</Label><Input id="skills" placeholder="e.g. First Aid, Driving" className="h-10 rounded-lg bg-gray-50 border-none font-bold placeholder:text-black/30 text-black px-6 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all text-xs" value={formData.skills} onChange={handleChange} /></div>
                                    <div className="space-y-1"><Label htmlFor="interests" className="text-[9px] font-black uppercase tracking-widest ml-1 text-black/40">Primary Interests (Optional)</Label><Input id="interests" placeholder="e.g. Disaster Relief" className="h-10 rounded-lg bg-gray-50 border-none font-bold placeholder:text-black/30 text-black px-6 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all text-xs" value={formData.interests} onChange={handleChange} /></div>
                                </div>
                                {error && <div className="bg-red-50 text-[#ED1C24] p-3 rounded-xl text-xs font-bold text-center border border-red-100 italic">{error}</div>}
                                <div className="flex gap-3 pt-1">
                                    <Button type="button" variant="ghost" className="h-12 rounded-xl font-black px-6 text-black/40 hover:text-black text-sm" onClick={() => setStep(1)} disabled={loading}>Back</Button>
                                    <Button type="submit" className="flex-1 h-12 bg-[#ED1C24] hover:bg-black text-white rounded-xl text-base font-black shadow-lg shadow-red-500/15 transition-all flex items-center justify-center gap-2" disabled={loading}>{loading ? "Processing..." : "Join the Red Cross"} <CheckCircle className="h-4 w-4 ml-1" /></Button>
                                 </div>
                             </form>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-6">
                            <div className="mx-auto h-20 w-20 bg-green-50 rounded-[32px] flex items-center justify-center shadow-inner relative"><CheckCircle className="h-10 w-10 text-green-500" strokeWidth={3} /><div className="absolute -inset-2 rounded-[36px] border-2 border-green-100 animate-ping opacity-20" /></div>
                            <div className="space-y-3"><h2 className="text-3xl font-black text-black tracking-tighter">Welcome home.</h2><p className="text-black/60 font-medium text-base leading-relaxed max-w-sm mx-auto">Your humanitarian journey has officially begun! You can now log into your portal dashboard to upload your profile photo and view your digital ID.</p></div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                              <Link href="/dashboard">
                                <Button className="h-14 bg-[#ED1C24] hover:bg-black text-white rounded-2xl px-8 text-base font-black shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-2">
                                  Go to Portal Dashboard <ChevronRight className="h-5 w-5" />
                                </Button>
                              </Link>
                              <Link href="/">
                                <Button variant="outline" className="h-14 border-gray-200 hover:bg-gray-50 text-black rounded-2xl px-8 text-base font-black transition-all">
                                  Back to Home
                                </Button>
                              </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
       </main>

       <footer className="relative z-10 px-6 py-10 text-center border-t border-gray-50 mt-10">
            <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.4em]"> Ethiopian Red Cross Society · Alleviating Human Suffering Since 1935 </p>
       </footer>
    </div>
  );
}
