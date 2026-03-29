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
  EyeOff
} from "lucide-react";
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en.json';
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { REGIONS, REGION_MAP_VALUE_TO_ID, GENDER_OPTIONS } from "@/lib/constants";

const ALL_COUNTRY_CODES = getCountries().map(country => ({
  code: `+${getCountryCallingCode(country)}`,
  name: (en as any)[country] || country
}));

export default function MemberRegistrationPage() {
  const [step, setStep] = useState(1); // 1: Personal, 2: Membership Type/Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [memberId, setMemberId] = useState<string | null>(null);
  const [formConfig, setFormConfig] = useState<any[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({
    password: "",
    confirmPassword: "",
    region: "REGION_addis_ababa",
    membershipType: "REGULAR",
  });
  const [countryCode, setCountryCode] = useState("+251");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        // Fetch Form Config
        const formRes = await api.get("/config/form?type=MEMBER");
        const fields = JSON.parse(formRes.data.fields_json);
        setFormConfig(fields);
        
        // Fetch Membership Plans
        const plansRes = await api.get("/config/membership?active=true");
        const activePlans = plansRes.data.plans || [];
        setMembershipPlans(activePlans);

        // Pre-select featured or first plan
        const featured = activePlans.find((p: any) => p.is_featured) || activePlans[0];
        if (featured) {
            setFormData(prev => ({ ...prev, membershipType: featured.short_code }));
        }
        
        // Initialize formData with defaults from config
        const initialData: Record<string, string> = { ...formData };
        fields.forEach((f: any) => {
           if (!initialData[f.id]) initialData[f.id] = "";
        });
        setFormData(initialData);
      } catch (err) {
        console.error("Failed to load configs:", err);
      }
    };
    fetchConfigs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleTypeSelect = (type: string) => {
      setFormData({ ...formData, membershipType: type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
        // Validate required fields from config
        const missingFields = formConfig.filter(f => f.required && !formData[f.id]);
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
        setLoading(true);
        try {
            // Find the phone field to get its ID from config if it varies
            const phoneField = formConfig.find(f => f.type === 'tel');
            const phoneFieldId = phoneField ? phoneField.id : 'phone';
            const rawPhone = formData[phoneFieldId] || "";

            // Normalize: strip leading 0s and duplicate country code
            const cleanPhone = rawPhone.replace(/^0+/, "").replace(countryCode, "");
            const finalPhone = `${countryCode}${cleanPhone}`;

            // 1. Register User in Auth Service with role=ROLE_member (6)
            const res = await api.post("/auth/register", {
                first_name: formData.firstName,
                father_name: formData.fatherName,
                grandfather_name: formData.grandfatherName,
                email: formData.email,
                phone_number: finalPhone,
                password: formData.password,
                region: REGION_MAP_VALUE_TO_ID[formData.region] || 1,
                role: 6,
            });
            
            const generatedId = res.data?.ercsId || res.data?.ercs_id;
            if (generatedId) {
               setMemberId(generatedId);
            }
            setStep(3); // Success! (Mock Payment)
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
      {/* Decorative Background Elements */}
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
            
            {/* Context Side */}
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

            {/* Form Side */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-white p-6 md:p-10 rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 h-fit"
            >
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" {...stepVariants}>
                            <div className="space-y-1 mb-8">
                                <h2 className="text-3xl font-black text-black tracking-tighter">Personal Details</h2>
                                <p className="text-black/60 font-black text-[10px] uppercase tracking-widest bg-gray-50 inline-block px-3 py-1 rounded-full border border-gray-100">Step 1 of 2</p>
                            </div>

                             <form onSubmit={handleSubmit} className="space-y-5">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-left">
                                     {formConfig.map((field: any) => (
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
                                                           field.dataSource === 'REGIONS' 
                                                             ? REGIONS.map(r => ({ label: r.name, value: r.value })) : 
                                                           field.dataSource === 'MEMBERSHIP_TYPES'
                                                             ? membershipPlans.map(p => ({ label: p.name, value: p.short_code })) :
                                                           field.dataSource === 'GENDER'
                                                             ? GENDER_OPTIONS :
                                                           (field.options || [])
                                                         ).map((opt: any, i: number) => (
                                                             <option key={i} value={opt.value}>{opt.label}</option>
                                                         ))}
                                                     </select>
                                                 ) : field.type === 'tel' ? (
                                                     <div className="flex gap-2">
                                                          <select 
                                                             value={countryCode} 
                                                             onChange={(e) => setCountryCode(e.target.value)}
                                                             className="w-32 h-12 rounded-xl bg-gray-50 border-none font-bold text-[10px] text-black focus:ring-2 focus:ring-[#ED1C24]/10 transition-all appearance-none px-3"
                                                          >
                                                              {ALL_COUNTRY_CODES.sort((a, b) => (a.name || "").localeCompare(b.name || "")).map((c, i) => (
                                                                <option key={`${c.code}-${i}`} value={c.code}>{c.name} ({c.code})</option>
                                                              ))}
                                                          </select>
                                                         <Input 
                                                            id={field.id} 
                                                            type={field.type} 
                                                            required={field.required} 
                                                            className="flex-1 h-12 rounded-xl bg-gray-50 border-none font-bold placeholder:text-black/30 text-black focus:ring-2 focus:ring-[#ED1C24]/10 px-6 transition-all" 
                                                            placeholder={field.placeholder} 
                                                            value={formData[field.id] || ""} 
                                                            onChange={handleChange} 
                                                         />
                                                     </div>
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
                                     ))}
                                     
                                     <div className="space-y-2 group">
                                         <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Password</Label>
                                         <div className="relative">
                                             <Input 
                                                type={showPassword ? "text" : "password"} 
                                                id="password" 
                                                required 
                                                className="h-12 rounded-xl bg-gray-50 border-none font-bold text-black focus:ring-2 focus:ring-[#ED1C24]/10 px-6 pr-12 transition-all" 
                                                placeholder="••••••••" 
                                                value={formData.password} 
                                                onChange={handleChange} 
                                             />
                                             <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                                             >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                             </button>
                                         </div>
                                     </div>
                                     <div className="space-y-2 group">
                                         <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Confirm Password</Label>
                                         <div className="relative">
                                             <Input 
                                                type={showConfirmPassword ? "text" : "password"} 
                                                id="confirmPassword" 
                                                required 
                                                className="h-12 rounded-xl bg-gray-50 border-none font-bold text-black focus:ring-2 focus:ring-[#ED1C24]/10 px-6 pr-12 transition-all" 
                                                placeholder="••••••••" 
                                                value={formData.confirmPassword} 
                                                onChange={handleChange} 
                                             />
                                             <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                                             >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                             </button>
                                         </div>
                                     </div>
                                 </div>

                                 {error && (
                                     <div className="bg-red-50 text-[#ED1C24] p-3 rounded-xl text-xs font-bold text-center border border-red-100 italic">
                                         {error}
                                     </div>
                                 )}

                                 <Button type="submit" className="w-full h-14 bg-[#ED1C24] hover:bg-black text-white rounded-2xl text-lg font-black shadow-2xl shadow-red-500/20 transition-all flex items-center justify-center gap-2">
                                     Continue <ChevronRight className="h-5 w-5" />
                                 </Button>
                             </form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" {...stepVariants}>
                            <div className="space-y-1 mb-8 text-center">
                                <h2 className="text-4xl font-black text-black tracking-tighter">Subscription Plan</h2>
                                <p className="text-black/60 font-black text-[10px] uppercase tracking-widest bg-gray-50 inline-block px-3 py-1 rounded-full border border-gray-100">Step 2 of 2</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-4">
                                     <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-black">Select Tier</Label>
                                     
                                     <div className="grid grid-cols-1 gap-4">
                                        {membershipPlans.length === 0 ? (
                                            <div className="text-center py-12 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="inline-block">
                                                    <Plus className="h-6 w-6 text-black/20" />
                                                </motion.div>
                                                <div className="text-xs font-black uppercase tracking-widest text-black/40 mt-3">Fetching premium plans...</div>
                                            </div>
                                        ) : membershipPlans.map((plan) => (
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
                                                       <h3 className="font-black text-xl tracking-tighter leading-none">{plan.name}</h3>
                                                       <p className="text-black/40 text-[10px] font-bold mt-1.5 uppercase tracking-widest">{plan.description}</p>
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
                                    <Button type="button" variant="ghost" className="h-16 rounded-2xl font-black px-8" onClick={() => setStep(1)} disabled={loading}>Back</Button>
                                    <Button type="submit" className="flex-1 h-16 bg-[#ED1C24] hover:bg-black text-white rounded-2xl text-xl font-black shadow-2xl shadow-red-500/20 transition-all flex items-center justify-center gap-3 active:scale-95" disabled={loading}>
                                        {loading ? "Processing..." : <><CreditCard className="h-6 w-6" /> Pay & Join</>}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div 
                            key="step3" 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12 space-y-10"
                        >
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
                                <div className="mx-auto max-w-sm bg-gray-50 border border-gray-100 p-6 rounded-[28px] space-y-2">
                                     <div className="text-[10px] uppercase font-black tracking-widest text-[#ED1C24]">Your Member ID</div>
                                     <div className="text-4xl font-black text-black tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>{memberId}</div>
                                     <div className="text-xs text-gray-500 font-bold">You can login using this ID.</div>
                                </div>
                            )}

                            <Link href="/">
                                <Button className="h-16 bg-black hover:bg-[#ED1C24] text-white rounded-3xl px-16 text-xl font-black shadow-2xl transition-all">
                                    Back to Home
                                </Button>
                            </Link>
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
