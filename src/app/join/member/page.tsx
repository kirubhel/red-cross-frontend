"use client";

import { useState, useEffect } from "react";
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
  ShieldCheck,
  Plus,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  Globe,
  QrCode
} from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en.json';
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { REGIONS, REGION_MAP_VALUE_TO_ID, GENDER_OPTIONS, ETHIOPIA_LOCATION_DATA, ZONE_WOREDA_DATA } from "@/lib/constants";

const REGION_ABBR: Record<string, string> = {
  "REGION_addis_ababa": "AA",
  "REGION_dire_dawa": "DD",
  "REGION_tigray": "TG",
  "REGION_afar": "AF",
  "REGION_amhara": "AM",
  "REGION_oromia": "OR",
  "REGION_somali": "SM",
  "REGION_benishangul_gumuz": "BG",
  "REGION_snnpr": "SN",
  "REGION_gambela": "GM",
  "REGION_harari": "HR",
  "REGION_sidama": "SD",
  "REGION_south_west": "SW",
  "REGION_federal_hq": "HQ",
};

const ALL_COUNTRIES = getCountries().map(country => ({
  code: country,
  name: (en as any)[country] || country,
  callingCode: `+${getCountryCallingCode(country)}`
})).sort((a, b) => a.name.localeCompare(b.name));

export default function MemberRegistrationPage() {
  const [step, setStep] = useState(1); // 1: Details, 2: Category Selection, 3: Plans, 4: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [memberId, setMemberId] = useState<string | null>(null);
  const [formConfig, setFormConfig] = useState<any[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({
    password: "",
    confirmPassword: "",
    region: "REGION_addis_ababa",
    zone: "",
    woreda: "",
    membershipType: "REGULAR",
    country: "ET",
    phoneNumber: "",
    internationalAddress: "",
    tierType: "INDIVIDUAL", // Default
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [zones, setZones] = useState<any[]>([]);
  const [woredas, setWoredas] = useState<any[]>([]);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const formRes = await api.get("/config/form?type=MEMBER");
        const fields = JSON.parse(formRes.data.fields_json);
        setFormConfig(fields);
        
        const plansRes = await api.get("/config/membership?active=true");
        const activePlans = plansRes.data.plans || [];
        setMembershipPlans(activePlans);

        const featured = activePlans.find((p: any) => p.is_featured) || activePlans[0];
        if (featured) {
            setFormData(prev => ({ ...prev, membershipType: featured.short_code }));
        }
        
        const initialData: Record<string, any> = { ...formData };
        fields.forEach((f: any) => {
           if (initialData[f.id] === undefined) initialData[f.id] = "";
        });
        setFormData(initialData);
      } catch (err) {
        console.error("Failed to load configs:", err);
      }
    };
    fetchConfigs();
  }, []);

  // Auto-select featured/first plan when tier type changes
  useEffect(() => {
    if (membershipPlans.length > 0) {
        const plansForTier = membershipPlans.filter(p => p.tier_type === formData.tierType);
        const currentSelectedInTier = plansForTier.find(p => p.short_code === formData.membershipType);
        
        if (!currentSelectedInTier) {
            const featured = plansForTier.find(p => p.is_featured) || plansForTier[0];
            if (featured) {
                setFormData(prev => ({ ...prev, membershipType: featured.short_code }));
            }
        }
    }
  }, [formData.tierType, membershipPlans, formData.membershipType]);

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
    const newData: Record<string, any> = { ...formData, [id]: value };
    
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

  const handleTypeSelect = (type: string) => {
      setFormData({ ...formData, membershipType: type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

        setLoading(true);
        try {
            const getVal = (keyword: string) => {
                const f = formConfig.find(f => f.label.toLowerCase().includes(keyword.toLowerCase()));
                return f ? (formData[f.id] || "") : "";
            };

            const extractedName = getVal("name");
            const extractedEmail = getVal("email");
            const extractedNationalId = getVal("national");
            const extractedDOB = getVal("date") || getVal("birth");
            const extractedGender = getVal("gender");
            
            // If Ethiopia, use Region ID, otherwise use Address field
            const regionId = formData.country === "ET" ? (REGION_MAP_VALUE_TO_ID[formData.region] || 1) : 14; // 14 is Federal HQ / Other
            const finalAddress = formData.country === "ET" ? "" : formData.internationalAddress;

            const res = await api.post("/join/member", {
                first_name: extractedName,
                father_name: getVal("father"),
                grandfather_name: getVal("grandfather"),
                email: extractedEmail,
                phone_number: formData.phoneNumber,
                national_id: extractedNationalId,
                date_of_birth: extractedDOB,
                gender: extractedGender,
                password: formData.password,
                region: regionId,
                role: 6,
                membershipType: formData.membershipType,
                metadata: JSON.stringify({
                    country: formData.country,
                    international_address: finalAddress,
                    zone_id: formData.zone,
                    woreda_id: formData.woreda
                })
            });
            
            const generatedId = res.data?.ercsId || res.data?.ercs_id;
            if (generatedId) setMemberId(generatedId);
            setStep(4);
        } catch (err: any) {
             console.error(err);
             setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
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
      <style jsx global>{`
        .PhoneInput {
          display: flex;
          align-items: center;
          background: #f9fafb;
          border-radius: 0.75rem;
          padding: 0 1.25rem;
          height: 3rem;
          transition: all 0.2s;
        }
        .PhoneInput:focus-within {
          box-shadow: 0 0 0 2px rgba(237, 28, 36, 0.1);
        }
        .PhoneInputInput {
          flex: 1;
          background: transparent;
          border: none !important;
          outline: none !important;
          font-weight: 700;
          font-size: 0.875rem;
          padding-left: 0.75rem;
          color: black;
        }
        .PhoneInputCountrySelect {
          outline: none;
          border: none;
          background: transparent;
          cursor: pointer;
        }
        .PhoneInputCountryIcon {
          width: 1.5rem;
          height: 1rem;
        }
      `}</style>
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-50 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-50 rounded-full blur-[120px] opacity-40" />
      </div>
      
       <header className="relative z-10 px-6 py-8 md:px-12 flex justify-between items-center">
            <Link href="/" className="group flex items-center gap-2 text-black/40 hover:text-black transition-colors font-black uppercase tracking-widest text-xs">
                 <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
                <Image src="/logo.jpg" alt="ERCS" width={32} height={32} />
              </div>
              <span className="text-xl font-black text-black tracking-tighter uppercase">ERCS</span>
            </div>
       </header>

       <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-7xl grid lg:grid-cols-[1fr_640px] gap-20 items-start pt-10">
            
            <div className="hidden lg:flex flex-col space-y-10 sticky top-20">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                        <ShieldCheck className="h-3 w-3 fill-current" /> Official Member
                    </div>
                    <h1 className="text-8xl font-black text-black leading-[0.8] tracking-tighter">
                        Stand With <br />
                        <span className="text-[#ED1C24]">Humanity.</span>
                    </h1>
                    <p className="text-xl text-black/60 font-medium max-w-md">
                        Your membership sustains our critical operations. Join millions of Ethiopians supporting our mission.
                    </p>
                </div>

                <div className="space-y-6 pt-10 border-t border-gray-100">
                    {[
                        { icon: ShieldCheck, text: "Official Credentials" },
                        { icon: User, text: "Assembly Voting Rights" },
                        { icon: Heart, text: "Sustainable Impact" }
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
                className="w-full bg-white p-6 md:p-10 rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 h-fit"
            >
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" {...stepVariants}>
                            <div className="space-y-1 mb-8">
                                <h2 className="text-3xl font-black text-black tracking-tighter">Registration Details</h2>
                                <p className="text-black/60 font-black text-[10px] uppercase tracking-widest bg-gray-50 inline-block px-3 py-1 rounded-full border border-gray-100">Step 1 of 3</p>
                            </div>

                             <form onSubmit={(e) => { 
                                 e.preventDefault(); 
                                 if (!formData.phoneNumber) { setError("Phone number is required."); return; }
                                 if (formData.password !== formData.confirmPassword) { setError("Passwords do not match."); return; }
                                 setStep(2); 
                             }} className="space-y-6">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-left">
                                      {/* Identity Fields */}
                                      {formConfig.map((field: any) => {
                                          if (field.id === 'password') {
                                              return (
                                                  <div key={field.id} className="space-y-2 group">
                                                      <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">{field.label} {field.required && <span className="text-[#ED1C24] text-xs">*</span>}</Label>
                                                      <div className="relative">
                                                          <Input type={showPassword ? "text" : "password"} id="password" required={field.required} className="h-12 rounded-xl bg-gray-50 border-none px-6 pr-12 font-bold text-black" value={formData.password} onChange={handleChange} />
                                                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors">
                                                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                          </button>
                                                      </div>
                                                  </div>
                                              );
                                          }
                                          
                                          if (field.id === 'confirmPassword') {
                                              return (
                                                  <div key={field.id} className="space-y-2 group">
                                                      <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">{field.label} {field.required && <span className="text-[#ED1C24] text-xs">*</span>}</Label>
                                                      <div className="relative">
                                                          <Input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" required={field.required} className="h-12 rounded-xl bg-gray-50 border-none px-6 pr-12 font-bold text-black" value={formData.confirmPassword} onChange={handleChange} />
                                                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors">
                                                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                          </button>
                                                      </div>
                                                  </div>
                                              );
                                          }

                                          if (field.type === 'tel') {
                                              return (
                                                  <div key={field.id} className="space-y-2 group">
                                                      <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">{field.label} {field.required && <span className="text-[#ED1C24] text-xs">*</span>}</Label>
                                                      <PhoneInput
                                                         international
                                                         defaultCountry={formData.country as any}
                                                         value={formData.phoneNumber}
                                                         onChange={(val) => setFormData({ ...formData, phoneNumber: val || "" })}
                                                         placeholder={field.placeholder || "Enter phone number"}
                                                         className="PhoneInput"
                                                      />
                                                  </div>
                                              );
                                          }

                                          if (field.dataSource === 'REGIONS') {
                                              return (
                                                  <div key={field.id} className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                                      <div className="space-y-2 group">
                                                          <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Country <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                          <select 
                                                              id="country" 
                                                              className="flex h-12 w-full rounded-xl bg-gray-50 border-none px-6 py-2 text-sm font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black"
                                                              value={formData.country}
                                                              onChange={handleChange}
                                                          >
                                                              {ALL_COUNTRIES.map(c => (
                                                                  <option key={c.code} value={c.code}>{c.name}</option>
                                                              ))}
                                                          </select>
                                                      </div>

                                                      {formData.country === 'ET' && (
                                                         <div className="space-y-2 group">
                                                            <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">{field.label} <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                            <select 
                                                                id="region" 
                                                                required={field.required}
                                                                className="flex h-12 w-full rounded-xl bg-gray-50 border-none px-6 py-2 text-sm font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black"
                                                                value={formData.region}
                                                                onChange={handleChange}
                                                            >
                                                                <option value="" disabled>{field.placeholder || "Select Region"}</option>
                                                                {REGIONS.map(r => <option key={r.value} value={r.value}>{r.name}</option>)}
                                                            </select>
                                                         </div>
                                                      )}

                                                      {formData.country === 'ET' && formData.region && (
                                                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 group">
                                                            <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Zone <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                            <select 
                                                                id="zone" 
                                                                required
                                                                className="flex h-12 w-full rounded-xl bg-gray-50 border-none px-6 py-2 text-sm font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black"
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

                                                      {formData.country === 'ET' && formData.zone && (
                                                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 group">
                                                            <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Woreda / Sub-City <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                            <select 
                                                                id="woreda" 
                                                                required
                                                                className="flex h-12 w-full rounded-xl bg-gray-50 border-none px-6 py-2 text-sm font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black"
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
                                                         <div className="space-y-2 group">
                                                            <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Address <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                            <Input id="internationalAddress" className="h-12 rounded-xl bg-gray-50 border-none font-bold text-black px-6" value={formData.internationalAddress} onChange={handleChange} required />
                                                         </div>
                                                      )}
                                                  </div>
                                              );
                                          }

                                          return (
                                              <div key={field.id} className={cn("space-y-2 group", field.type === 'textarea' ? "md:col-span-2" : "")}>
                                                  <Label htmlFor={field.id} className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">{field.label} {field.required && <span className="text-[#ED1C24] text-xs">*</span>}</Label>
                                                  <div className="relative">
                                                      {field.type === 'select' ? (
                                                          <select 
                                                              id={field.id} 
                                                              required={field.required} 
                                                              className="flex h-12 w-full rounded-xl bg-gray-50 border-none px-6 py-2 text-sm font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none relative text-black"
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
                                                              className="h-12 rounded-xl bg-gray-50 border-none font-bold placeholder:text-black/30 text-black focus:ring-2 focus:ring-[#ED1C24]/10 px-6 transition-all" 
                                                              placeholder={field.placeholder} 
                                                              value={formData[field.id] || ""} 
                                                              onChange={handleChange} 
                                                          />
                                                      )}
                                                  </div>
                                              </div>
                                          );
                                      })}
                                 </div>
                                 {error && <div className="text-red-500 text-xs font-bold text-center">{error}</div>}
                                 <Button type="submit" className="w-full h-14 bg-black hover:bg-[#ED1C24] text-white rounded-2xl text-lg font-black shadow-2xl transition-all flex items-center justify-center gap-2">
                                     Continue Selection <ChevronRight className="h-5 w-5" />
                                 </Button>
                             </form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="tier-select" {...stepVariants} className="space-y-10">
                            <div className="space-y-2 text-center">
                                <h2 className="text-5xl font-black text-black tracking-tighter">Membership Portal</h2>
                                <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Step 2 of 3 · Select Category</p>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <button 
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, tierType: "INDIVIDUAL" }));
                                        setStep(3);
                                    }}
                                    className="group relative p-8 bg-white border border-gray-100 rounded-[32px] hover:border-[#ED1C24] hover:shadow-2xl hover:shadow-red-500/10 transition-all flex items-center gap-8 text-left h-32"
                                >
                                    <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#ED1C24] group-hover:bg-[#ED1C24] group-hover:text-white transition-all shrink-0">
                                        <User className="h-8 w-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-3xl font-black text-black tracking-tight">Individual</h3>
                                        <p className="text-gray-400 font-medium">Personal humanitarian commitment.</p>
                                    </div>
                                    <ChevronRight className="h-6 w-6 ml-auto text-gray-200 group-hover:text-[#ED1C24] group-hover:translate-x-1 transition-all" />
                                </button>

                                <button 
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, tierType: "CORPORATE" }));
                                        setStep(3);
                                    }}
                                    className="group relative p-8 bg-white border border-gray-100 rounded-[32px] hover:border-purple-600 hover:shadow-2xl hover:shadow-purple-500/10 transition-all flex items-center gap-8 text-left h-32"
                                >
                                    <div className="h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0">
                                        <Globe className="h-8 w-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-3xl font-black text-black tracking-tight">Corporate</h3>
                                        <p className="text-gray-400 font-medium">Organizational humanitarian impact.</p>
                                    </div>
                                    <ChevronRight className="h-6 w-6 ml-auto text-gray-200 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                                </button>
                            </div>

                             <div className="flex justify-start">
                                <Button variant="ghost" onClick={() => setStep(1)} className="font-bold flex items-center gap-2 text-black/40 hover:text-black hover:bg-gray-50 px-6 py-3 rounded-xl transition-all">
                                     <ArrowLeft className="h-4 w-4" /> Back to My Details
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3-plans" {...stepVariants}>
                            <div className="space-y-4 text-center">
                                <h2 className="text-5xl font-black text-black tracking-tighter">Account Portal</h2>
                                <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Step 3 of 3 · Custom Subscription</p>
                            </div>


                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-4">
                                     <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-black">Select Tier</Label>
                                     <div className="grid grid-cols-1 gap-4">
                                        {membershipPlans.length === 0 ? (
                                            <div className="text-center py-12 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                                                <div className="text-xs font-black uppercase tracking-widest text-black/40 mt-3">Fetching premium plans...</div>
                                            </div>
                                        ) : membershipPlans
                                            .filter(p => p.tier_type === formData.tierType)
                                            .map((plan) => (
                                            <label 
                                                key={plan.short_code}
                                                className={cn(
                                                    "group relative p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between",
                                                    formData.membershipType === plan.short_code ? "border-[#ED1C24] bg-red-50/30 shadow-2xl scale-[1.02] z-10" : "border-gray-50 bg-gray-50/50 hover:border-gray-300"
                                                )}
                                            >
                                                <input type="radio" name="membershipType" className="sr-only" checked={formData.membershipType === plan.short_code} onChange={() => handleTypeSelect(plan.short_code)} />
                                                {plan.is_featured && <div className="absolute top-0 right-0 px-3 py-1 bg-[#ED1C24] text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl shadow-md">Featured</div>}
                                                <div className="flex items-center gap-5">
                                                    <div className={cn(
                                                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
                                                        formData.membershipType === plan.short_code ? "bg-[#ED1C24] text-white" : "bg-white text-[#ED1C24] border border-gray-100 shadow-sm"
                                                    )}>
                                                        <CreditCard className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                       <h3 className="font-black text-xl tracking-tighter leading-none text-black">{plan.name}</h3>
                                                       <p className="text-black/60 text-[10px] font-bold mt-1.5 uppercase tracking-widest">{plan.description}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                   <div className="text-2xl font-black text-black tracking-tighter">{plan.amount} <span className="text-xs font-bold text-black/30 tracking-normal">{plan.currency}</span></div>
                                                   <div className="text-[9px] font-black text-[#ED1C24] uppercase tracking-widest">per {plan.subscription_type.toLowerCase()}</div>
                                                </div>
                                                {formData.membershipType === plan.short_code && (
                                                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[#ED1C24] flex items-center justify-center text-white shadow-xl animate-in zoom-in-50 duration-300">
                                                        <CheckCircle className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </label>
                                        ))}
                                     </div>
                                </div>

                                <div className="bg-red-50 p-6 rounded-[28px] text-[11px] font-bold text-[#ED1C24] leading-relaxed border border-red-100/50 flex items-start gap-4">
                                    <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm"><ShieldCheck className="h-3.5 w-3.5" /></div>
                                    Secure Payment Notice: You will be redirected to our encrypted gateway to finalize your contribution. 100% of proceeds fund local programs.
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-[#ED1C24] p-3 rounded-xl text-xs font-bold text-center border border-red-100 italic">
                                        {error}
                                    </div>
                                )}

                                 <div className="flex gap-4 pt-2">
                                     <Button type="button" variant="ghost" className="h-16 rounded-2xl font-black px-8 text-black/40 hover:text-black hover:bg-gray-50 transition-all" onClick={() => setStep(2)} disabled={loading}>Back</Button>
                                    <Button type="submit" className="flex-1 h-16 bg-[#ED1C24] hover:bg-black text-white rounded-2xl text-xl font-black shadow-2xl shadow-red-500/20 transition-all flex items-center justify-center gap-3 active:scale-95" disabled={loading}>
                                        {loading ? "Processing..." : <><CreditCard className="h-6 w-6" /> Pay & Join</>}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div key="step5-success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-10">
                            <div className="mx-auto h-28 w-28 bg-green-50 rounded-[40px] flex items-center justify-center shadow-inner relative">
                                <CheckCircle className="h-14 w-14 text-green-500" strokeWidth={3} />
                                <div className="absolute -inset-2 rounded-[44px] border-2 border-green-100 animate-ping opacity-20" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-5xl font-black text-black tracking-tighter">Welcome Aboard.</h2>
                                <p className="text-black/60 font-medium text-xl leading-relaxed max-w-sm mx-auto">
                                    Your humanitarian journey has officially begun! Check your phone for your temporary credentials.
                                </p>
                            </div>
                            {memberId && (
                                <div className="mx-auto max-w-sm p-8 bg-gradient-to-br from-gray-900 to-black rounded-[40px] shadow-2xl relative overflow-hidden group text-left">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ED1C24]/10 blur-3xl rounded-full -mr-16 -mt-16" />
                                    <div className="relative z-10 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-white p-1.5 rounded-xl">
                                                    <Image src="/logo.jpg" alt="ERCS" width={24} height={24} />
                                                </div>
                                                <span className="text-white font-black text-[10px] uppercase tracking-widest italic opacity-60">Verified Member</span>
                                            </div>
                                            <ShieldCheck className="h-6 w-6 text-[#ED1C24]" />
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Membership ID</div>
                                            <div className="text-3xl font-black text-white tracking-tighter" style={{ fontVariantNumeric: "tabular-nums" }}>
                                                {memberId}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                                            <div className="space-y-1">
                                                <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">Type</div>
                                                <div className="text-xs font-bold text-white uppercase">{formData.tierType}</div>
                                            </div>
                                            <QrCode className="h-10 w-10 text-white/20" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <Link href="/"><Button className="h-16 bg-black hover:bg-[#ED1C24] text-white rounded-3xl px-16 text-xl font-black shadow-2xl transition-all">Back to Home</Button></Link>
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
