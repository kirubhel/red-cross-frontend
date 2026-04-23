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
  Star,
  Plus,
  ChevronRight,
  Eye,
  EyeOff,
  Check,
  Globe
} from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en.json';
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { REGIONS, REGION_MAP_VALUE_TO_ID, GENDER_OPTIONS } from "@/lib/constants";

const ALL_COUNTRIES = getCountries().map(country => ({
  code: country,
  name: (en as any)[country] || country,
  callingCode: `+${getCountryCallingCode(country)}`
})).sort((a, b) => a.name.localeCompare(b.name));

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

export default function VolunteerJoinPage() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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

        const missingFields = formConfig.filter(f => f.required && !formData[f.id] && f.type !== 'tel');
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
        if (formData.engagementAreas.length === 0) {
            setError("Please select at least one engagement area.");
            return;
        }

        setLoading(true);
        try {
            // Prepare engagement areas
            let finalAreas = [...formData.engagementAreas];
            if (finalAreas.includes("Other Services") && formData.otherEngagementArea) {
                finalAreas = finalAreas.map(a => a === "Other Services" ? `Other: ${formData.otherEngagementArea}` : a);
            }

            const regionId = formData.country === "ET" ? (REGION_MAP_VALUE_TO_ID[formData.region] || 1) : 14;

            // Register User
            await api.post("/auth/register", {
                first_name: formData.firstName,
                father_name: formData.fatherName,
                grandfather_name: formData.grandfatherName,
                email: formData.email,
                phone_number: formData.phoneNumber,
                password: formData.password,
                region: regionId,
                role: 5, // ROLE_volunteer
                skills: formData.skills ? [formData.skills] : [],
                interests: formData.interests ? [formData.interests] : [],
                engagement_areas: finalAreas,
                gender: formData.gender,
                metadata: JSON.stringify({
                    country: formData.country,
                    international_address: formData.country === 'ET' ? "" : formData.internationalAddress
                })
            });

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
                        <Star className="h-3 w-3 fill-current" /> Join the Mission
                    </div>
                    <h1 className="text-8xl font-black text-black leading-[0.8] tracking-tighter">
                        Become a <br />
                        <span className="text-[#ED1C24]">Force for Good.</span>
                    </h1>
                    <p className="text-xl text-black/60 font-medium max-w-md">
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
                className="w-full bg-white p-6 md:p-10 rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 h-fit"
            >
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" {...stepVariants}>
                            <div className="space-y-1 mb-8 text-left">
                                <h2 className="text-3xl font-black text-black tracking-tighter">Personal Details</h2>
                                <p className="text-black/60 font-black text-[10px] uppercase tracking-widest bg-gray-50 inline-block px-3 py-1 rounded-full border border-gray-100">Step 1 of 2</p>
                            </div>

                             <form onSubmit={handleSubmit} className="space-y-5 text-left">
                                      {formConfig.map((field: any) => {
                                          if (field.id === 'password') {
                                              return (
                                                  <div key={field.id} className="space-y-2 group">
                                                      <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">{field.label} {field.required && <span className="text-[#ED1C24] text-xs">*</span>}</Label>
                                                      <div className="relative">
                                                          <Input id="password" type={showPassword ? "text" : "password"} required={field.required} className="h-12 rounded-xl bg-gray-50 border-none font-bold text-black px-6 pr-12 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                                                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                                                      </div>
                                                  </div>
                                              );
                                          }

                                          if (field.id === 'confirmPassword') {
                                              return (
                                                  <div key={field.id} className="space-y-2 group">
                                                      <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">{field.label} {field.required && <span className="text-[#ED1C24] text-xs">*</span>}</Label>
                                                      <div className="relative">
                                                          <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} required={field.required} className="h-12 rounded-xl bg-gray-50 border-none font-bold text-black px-6 pr-12 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                                                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
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
                                                          <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Country of Residence <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                          <div className="relative">
                                                             <div className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#ED1C24] transition-colors">
                                                                 <Globe className="h-4 w-4" />
                                                             </div>
                                                             <select 
                                                                 id="country" 
                                                                 className="flex h-12 w-full rounded-xl bg-gray-50 border-none px-12 py-2 text-sm font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black"
                                                                 value={formData.country}
                                                                 onChange={handleChange}
                                                             >
                                                                 {ALL_COUNTRIES.map(c => (
                                                                     <option key={c.code} value={c.code}>{c.name}</option>
                                                                 ))}
                                                             </select>
                                                          </div>
                                                      </div>
                                                      
                                                      {formData.country === 'ET' ? (
                                                          <div className="space-y-2 group">
                                                              <Label htmlFor={field.id} className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
                                                              <div className="relative">
                                                                  <select 
                                                                      id={field.id} 
                                                                      required={field.required} 
                                                                      className="flex h-12 w-full rounded-xl bg-gray-50 border-none px-6 py-2 text-sm font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none relative text-black"
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
                                                      ) : (
                                                          <div className="space-y-2 group">
                                                              <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">State / Province / Address <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                              <Input 
                                                                 id="internationalAddress" 
                                                                 className="h-12 rounded-xl bg-gray-50 border-none font-bold placeholder:text-black/30 text-black focus:ring-2 focus:ring-[#ED1C24]/10 px-6 transition-all" 
                                                                 placeholder="Enter your address" 
                                                                 value={formData.internationalAddress} 
                                                                 onChange={handleChange} 
                                                                 required
                                                              />
                                                          </div>
                                                      )}
                                                  </div>
                                              );
                                          }

                                          return (
                                              <div key={field.id} className={cn("space-y-2 group", field.type === 'textarea' ? "md:col-span-2" : "")}>
                                                  <Label htmlFor={field.id} className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
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
                                                                 field.dataSource === 'MEMBERSHIP_TYPES'
                                                                   ? membershipPlans.map(p => ({ label: p.name, value: p.short_code })) :
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
                                                              className="h-12 rounded-xl bg-gray-50 border-none font-bold placeholder:text-black/30 text-black focus:ring-2 focus:ring-[#ED1C24]/10 px-6 transition-all text-left" 
                                                              placeholder={field.placeholder} 
                                                              value={formData[field.id] || ""} 
                                                              onChange={handleChange} 
                                                           />
                                                       )}
                                                  </div>
                                              </div>
                                          );
                                      })}

                                 {error && <div className="bg-red-50 text-[#ED1C24] p-3 rounded-xl text-xs font-bold text-center border border-red-100 italic">{error}</div>}
                                 <Button type="submit" className="w-full h-14 bg-[#ED1C24] hover:bg-black text-white rounded-2xl text-lg font-black shadow-2xl shadow-red-500/20 transition-all flex items-center justify-center gap-2">Continue <ChevronRight className="h-5 w-5" /></Button>
                             </form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" {...stepVariants}>
                             <div className="space-y-1 mb-8 text-left">
                                <h2 className="text-3xl font-black text-black tracking-tighter">Engagement & Skills</h2>
                                <p className="text-black/60 font-black text-[10px] uppercase tracking-widest bg-gray-50 inline-block px-3 py-1 rounded-full border border-gray-100">Step 2 of 2</p>
                             </div>

                             <form onSubmit={handleSubmit} className="space-y-8 text-left">
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ED1C24] ml-1">Voluntary Service Engagement Areas <span className="text-red-500">*</span></Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {ENGAGEMENT_AREAS.map((area) => (
                                            <div key={area} onClick={() => toggleEngagementArea(area)} className={cn("flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer group", formData.engagementAreas.includes(area) ? "bg-black border-black text-white shadow-lg" : "bg-gray-50/50 border-gray-100 text-black/60 hover:border-black/10 hover:bg-white")}>
                                                <div className={cn("w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all", formData.engagementAreas.includes(area) ? "border-white bg-white" : "border-gray-200")}>{formData.engagementAreas.includes(area) && <Check className="h-4 w-4 text-black" strokeWidth={4} />}</div>
                                                <span className="text-xs font-bold leading-tight">{area}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {formData.engagementAreas.includes("Other Services") && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Please specify your areas of interest</Label>
                                            <Input id="otherEngagementArea" placeholder="Write your areas of interest here..." className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-black px-6 focus:ring-2 focus:ring-[#ED1C24]/10 mt-2" value={formData.otherEngagementArea} onChange={handleChange} />
                                        </motion.div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2"><Label htmlFor="skills" className="text-[10px] font-black uppercase tracking-widest ml-1 text-black/40">Key Skills (Optional)</Label><Input id="skills" placeholder="e.g. First Aid, Driving, Translation" className="h-14 rounded-xl bg-gray-50 border-none font-bold placeholder:text-black/30 text-black px-6 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all" value={formData.skills} onChange={handleChange} /></div>
                                    <div className="space-y-2"><Label htmlFor="interests" className="text-[10px] font-black uppercase tracking-widest ml-1 text-black/40">Primary Interests (Optional)</Label><Input id="interests" placeholder="e.g. Disaster Relief, Health Services" className="h-14 rounded-xl bg-gray-50 border-none font-bold placeholder:text-black/30 text-black px-6 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all" value={formData.interests} onChange={handleChange} /></div>
                                </div>
                                {error && <div className="bg-red-50 text-[#ED1C24] p-3 rounded-xl text-xs font-bold text-center border border-red-100 italic">{error}</div>}
                                <div className="flex gap-4 pt-2">
                                    <Button type="button" variant="ghost" className="h-16 rounded-2xl font-black px-8 text-black/40 hover:text-black" onClick={() => setStep(1)} disabled={loading}>Back</Button>
                                    <Button type="submit" className="flex-1 h-16 bg-[#ED1C24] hover:bg-black text-white rounded-2xl text-xl font-black shadow-2xl shadow-red-500/20 transition-all flex items-center justify-center gap-2" disabled={loading}>{loading ? "Processing..." : "Join the Red Cross"} <CheckCircle className="h-5 w-5 ml-1" /></Button>
                                </div>
                             </form>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-10">
                            <div className="mx-auto h-28 w-28 bg-green-50 rounded-[40px] flex items-center justify-center shadow-inner relative"><CheckCircle className="h-14 w-14 text-green-500" strokeWidth={3} /><div className="absolute -inset-2 rounded-[44px] border-2 border-green-100 animate-ping opacity-20" /></div>
                            <div className="space-y-4"><h2 className="text-5xl font-black text-black tracking-tighter">Welcome home.</h2><p className="text-black/60 font-medium text-xl leading-relaxed max-w-sm mx-auto">Your humanitarian journey has officially begun! We&apos;ll review your details and contact you shortly.</p></div>
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
