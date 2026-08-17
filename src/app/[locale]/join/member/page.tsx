"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  ChevronDown,
  ChevronUp,
  CreditCard,
  Eye,
  EyeOff,
  Globe,
  QrCode
} from "lucide-react";
import PhoneNumberInput, { buildFullPhoneNumber, ALL_COUNTRIES } from "@/components/ui/phone-number-input";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { REGIONS, REGION_MAP_VALUE_TO_ID, GENDER_OPTIONS, ETHIOPIA_LOCATION_DATA, ZONE_WOREDA_DATA, getWoredasForZone } from "@/lib/constants";

const REGION_ABBR: Record<string, string> = {
  "REGION_addis_ababa": "AA",
  "REGION_dire_dawa": "DD",
  "REGION_tigray": "TG",
  "REGION_afar": "AF",
  "REGION_amhara": "AM",
  "REGION_oromia": "OR",
  "REGION_somali": "SM",
  "REGION_benishangul_gumz": "BG",
  "REGION_central_ethiopia": "CE",
  "REGION_gambela": "GM",
  "REGION_harari": "HR",
  "REGION_sidama": "SD",
  "REGION_south_west_ethiopia": "SW",
  "REGION_south_ethiopia": "SE",
};



import Header from "@/components/layout/Header";

function MemberRegistrationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1); // 1: Details, 2: Category Selection, 3: Plans, 4: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginCTA, setShowLoginCTA] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [registeredLoggedIn, setRegisteredLoggedIn] = useState(false);
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
  const [showMoreDetails, setShowMoreDetails] = useState(false);
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
        setShowLoginCTA(true);
      } else {
        setPhoneExists(false);
        if (error && error.includes("already registered")) {
          setError("");
          setShowLoginCTA(false);
        }
      }
    } catch (err) {
      console.error("Error checking phone number:", err);
    } finally {
      setCheckingPhone(false);
    }
  };

  // Check if returning from successful payment
  useEffect(() => {
    const paymentSuccess = searchParams.get("payment_success") === "true" || searchParams.get("status") === "SUCCESS";
    const ercsIdParam = searchParams.get("ercs_id");
    if (ercsIdParam) setMemberId(ercsIdParam);

    if (paymentSuccess || ercsIdParam) {
      setStep(4);
    }
  }, [searchParams]);

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
           if (f.id !== 'registrationDate' && f.id !== 'dateOfRegistration' && initialData[f.id] === undefined) {
             initialData[f.id] = "";
           }
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
        if (res.data?.zones && res.data.zones.length > 0) {
          setZones(res.data.zones);
        } else {
          setZones(ETHIOPIA_LOCATION_DATA[formData.region]?.zones || []);
        }
      }).catch(err => {
        console.error("Failed to fetch zones:", err);
        setZones(ETHIOPIA_LOCATION_DATA[formData.region]?.zones || []);
      });
    } else {
      setZones([]);
    }
  }, [formData.region, formData.country]);

  // Fetch Woredas
  useEffect(() => {
    if (formData.zone && formData.country === "ET") {
      api.get(`/location/woredas?zone_id=${formData.zone}`).then(res => {
        if (res.data?.woredas && res.data.woredas.length > 0) {
          setWoredas(res.data.woredas);
        } else {
          setWoredas(getWoredasForZone(formData.zone));
        }
      }).catch(err => {
        console.error("Failed to fetch woredas:", err);
        setWoredas(getWoredasForZone(formData.zone));
      });
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

    if (!formData.phoneNumber) {
        setError("Phone number is required.");
        return;
    }

    if (formData.country === 'ET') {
        if (!formData.region) {
            setError("Region is required.");
            return;
        }
        if (!formData.zone) {
            setError("Zone is required.");
            return;
        }
    } else if (!formData.internationalAddress) {
        setError("Please provide your full international address.");
        return;
    }

    const isCorp = formData.tierType === "CORPORATE";
    const missingFields = formConfig.filter(f => {
        if (f.id === 'registrationDate' || f.id === 'dateOfRegistration') return false;
        if (isCorp && (f.audience === 'INDIVIDUAL' || f.id === 'fatherName' || f.id === 'grandfatherName' || f.id === 'gender' || f.id === 'dateOfBirth')) {
            return false;
        }
        if (!isCorp && (f.audience === 'CORPORATE' || f.id === 'organizationName' || f.id === 'organizationType')) {
            return false;
        }
        if (f.required && !formData[f.id] && f.type !== 'tel') {
            if (formData.country !== 'ET' && (f.dataSource === 'REGIONS' || f.id === 'region' || f.id === 'zone')) {
                return false;
            }
            // Only validate required fields in the front main section if not optional
            if (f.id === 'dateOfBirth' || f.id === 'email' || f.id === 'occupation' || f.id === 'kebele' || f.id === 'woreda' || f.id === 'organizationType') {
                return false;
            }
            return true;
        }
        return false;
    });

    if (missingFields.length > 0) {
        setError(`Please fill in: ${missingFields.map(f => f.label).join(", ")}`);
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    if (step === 1) {
      setStep(3);
      return;
    }

    // Step 3: Pay & Join -> Register & Auto-login first, then allow plan selection and ArifPay payment!
    setLoading(true);
    setError("");
    setShowLoginCTA(false);

    try {
        const isCorp = formData.tierType === "CORPORATE";
        const extractedFirstName = isCorp
          ? (formData.organizationName || formData.name || formData.firstName || "Corporate Member")
          : (formData.name || formData.firstName || "");
        const extractedFatherName = isCorp ? "" : (formData.fatherName || formData.father_name || "");
        const extractedGrandfatherName = isCorp ? "" : (formData.grandfatherName || formData.last_name || "");
        const extractedEmail = formData.email || "";
        const extractedNationalId = isCorp ? (formData.taxNumber || formData.tin || "") : (formData.nationalId || "");
        const extractedDOB = isCorp ? "" : (formData.dateOfBirth || "");
        const extractedGender = isCorp ? "OTHER" : (formData.gender || "");
        
        const regionId = formData.country === "ET" ? (REGION_MAP_VALUE_TO_ID[formData.region] || 1) : 14;
        const finalAddress = formData.country === "ET" ? "" : formData.internationalAddress;

        const fullPhone = buildFullPhoneNumber(
            formData.country || "ET",
            formData.phoneNumber
        );

        let tokenVal = "";
        let generatedId = "";

        try {
            // Attempt Registration
            const res = await api.post("/join/member", {
                first_name: extractedFirstName,
                father_name: extractedFatherName,
                grandfather_name: extractedGrandfatherName,
                email: extractedEmail,
                phone_number: fullPhone,
                national_id: extractedNationalId,
                date_of_birth: extractedDOB,
                gender: extractedGender,
                password: formData.password,
                region: regionId,
                role: 6,
                membershipType: formData.membershipType,
                metadata: JSON.stringify({
                    tier_type: formData.tierType,
                    is_corporate: isCorp,
                    organization_name: isCorp ? extractedFirstName : "",
                    organization_type: formData.organizationType || "",
                    contact_person: formData.contactPerson || "",
                    country: formData.country,
                    international_address: finalAddress,
                    zone_id: formData.zone,
                    woreda_id: formData.woreda,
                    kebele: formData.kebele || "",
                    occupation: formData.occupation || "",
                    education_level: formData.educationLevel || "",
                    area: formData.area || "",
                    languages: formData.languages || ""
                })
            });

            generatedId = res.data?.ercsId || res.data?.ercs_id || "";
            tokenVal = res.data?.access_token || res.data?.accessToken || "";
        } catch (regErr: any) {
            const errMsg = regErr.response?.data?.message || regErr.response?.data?.error || regErr.message || "";
            const isDuplicate = /already|exist|duplicate|used|registered/i.test(errMsg) || regErr.response?.status === 409 || regErr.response?.status === 400;

            if (isDuplicate) {
                // Try logging in with the phone and password provided
                try {
                    const loginRes = await api.post("/auth/login", { identifier: fullPhone, password: formData.password });
                    tokenVal = loginRes.data?.access_token || loginRes.data?.accessToken || "";
                    generatedId = loginRes.data?.ercs_id || loginRes.data?.ercsId || "";

                    if (tokenVal) {
                        localStorage.setItem("token", tokenVal);
                        localStorage.setItem("access_token", tokenVal);
                        localStorage.setItem("user_role", "MEMBER");
                        if (generatedId) localStorage.setItem("ercs_id", generatedId);
                    }
                } catch (loginErr: any) {
                    setError("This phone number is already registered. If you need to complete payment or access your account, please log in with your password.");
                    setShowLoginCTA(true);
                    setLoading(false);
                    return;
                }
            } else {
                throw regErr;
            }
        }

        // AUTO-LOGIN USER IMMEDIATELY
        if (tokenVal) {
            localStorage.setItem("token", tokenVal);
            localStorage.setItem("access_token", tokenVal);
            localStorage.setItem("user_role", "MEMBER");
            if (generatedId) {
                setMemberId(generatedId);
                localStorage.setItem("ercs_id", generatedId);
            }
        }

        // Set state to indicate registered & logged in, ready for ArifPay payment!
        setRegisteredLoggedIn(true);
    } catch (err: any) {
         console.error("Registration error:", err);
         setError(err.response?.data?.message || err.message || "Failed to complete registration. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  // Dedicated ArifPay payment trigger after auto-login & plan selection
  const handlePayWithArifPay = async () => {
    setLoading(true);
    setError("");
    try {
      const selectedPlan = membershipPlans.find(p => p.short_code === formData.membershipType);
      const planAmount = selectedPlan ? parseFloat(selectedPlan.amount) : 50;

      const fullPhone = buildFullPhoneNumber(formData.country || "ET", formData.phoneNumber);
      const cleanPhone = fullPhone.replace(/\D/g, "");

      const isCorp = formData.tierType === "CORPORATE";
      const payRes = await api.post("/payment/initiate", {
        amount: planAmount,
        currency: "ETB",
        provider: "ARIFPAY",
        payer_phone: cleanPhone,
        email: formData.email || "member@redcrosseth.org",
        first_name: isCorp ? (formData.organizationName || formData.name || "Corporate Member") : (formData.name || formData.firstName || "Member"),
        last_name: isCorp ? "Corporate" : (formData.grandfatherName || formData.last_name || "Member")
      }).catch(() => null);

      if (payRes?.data?.payment_url) {
        window.location.href = payRes.data.payment_url;
        return;
      }

      // If gateway direct simulation / success:
      setStep(4); // Move to Step 4 (Verified Member ID Card reveal)
    } catch (err: any) {
      setError(err.message || "Failed to start ArifPay payment. Please try again.");
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
      <Header minimal={true} />


       <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-7xl grid lg:grid-cols-[1fr_640px] gap-20 items-start pt-10">
            
            <div className="hidden lg:flex flex-col space-y-6 sticky top-20">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                        <ShieldCheck className="h-2.5 w-2.5 fill-current" /> Official Member
                    </div>
                    <h1 className="text-6xl font-black text-black leading-[0.8] tracking-tighter">
                        Stand With <br />
                        <span className="text-[#ED1C24]">Humanity.</span>
                    </h1>
                    <p className="text-lg text-black/60 font-medium max-w-sm">
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
                className="w-full bg-white p-6 md:p-8 rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-gray-100 h-fit"
            >

        <div className="w-full text-left mb-8"> {/* Increased space below the header block */}
  <h1 className="text-2xl md:text-3xl font-black text-black tracking-normal uppercase leading-none">
    Member &nbsp; Registration &nbsp; Form
</h1>
    <div className="mt-3 h-1 w-12 bg-[#ED1C24] rounded-full" /> {/* Added space above the accent line */}
</div>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" {...stepVariants}>
                            <div className="space-y-0.5 mb-6">
                                <h2 className="text-2xl font-black text-black tracking-tighter">Registration Details</h2>
                                <p className="text-black/60 font-black text-[9px] uppercase tracking-widest bg-gray-50 inline-block px-2 py-0.5 rounded-full border border-gray-100">Step 1 of 3</p>
                            </div>

                                 {/* Category Selection Toggle (Individual vs Corporate) */}
                                 <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100/80 rounded-2xl mb-6">
                                     <button
                                         type="button"
                                         onClick={() => {
                                             setFormData(prev => ({ ...prev, tierType: "INDIVIDUAL" }));
                                             setError("");
                                         }}
                                         className={cn(
                                             "flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all",
                                             formData.tierType === "INDIVIDUAL" 
                                                 ? "bg-white text-black shadow-md border border-gray-200/50" 
                                                 : "text-gray-500 hover:text-black"
                                         )}
                                     >
                                         <User className="h-4 w-4 text-[#ED1C24]" /> Individual
                                     </button>
                                     <button
                                         type="button"
                                         onClick={() => {
                                             setFormData(prev => ({ ...prev, tierType: "CORPORATE" }));
                                             setError("");
                                         }}
                                         className={cn(
                                             "flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all",
                                             formData.tierType === "CORPORATE" 
                                                 ? "bg-white text-purple-700 shadow-md border border-gray-200/50" 
                                                 : "text-gray-500 hover:text-black"
                                         )}
                                     >
                                         <Globe className="h-4 w-4 text-purple-600" /> Corporate / Org
                                     </button>
                                 </div>

                                 <form onSubmit={(e) => { 
                                     e.preventDefault(); 
                                     const isCorp = formData.tierType === "CORPORATE";
                                     if (!formData.phoneNumber) { 
                                         setError(isCorp ? "Organization mobile/phone is required." : "Phone number is required."); 
                                         return; 
                                     }
                                     if (isCorp) {
                                         if (!formData.organizationName && !formData.name && !formData.firstName) {
                                             setError("Organization name is required.");
                                             return;
                                         }
                                     } else {
                                         if (!formData.name && !formData.firstName) { setError("First name is required."); return; }
                                         if (!formData.fatherName && !formData.father_name) { setError("Father name is required."); return; }
                                         if (!formData.grandfatherName && !formData.last_name) { setError("Last name is required."); return; }
                                         if (!formData.gender) { setError("Gender is required."); return; }
                                     }
                                     if (formData.country === 'ET') {
                                         if (!formData.region) { setError("Region is required."); return; }
                                         if (!formData.zone) { setError("Zone is required."); return; }
                                     } else if (!formData.internationalAddress) {
                                         setError("Please provide your full international address.");
                                         return;
                                     }
                                     if (formData.password !== formData.confirmPassword) { setError("Passwords do not match."); return; }
                                     setStep(3); 
                                 }} className="space-y-5">
                                     {/* Primary Required Fields Grid */}
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-left">
                                         {/* Mobile / Organization Mobile */}
                                         <div className="space-y-1 group">
                                             <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
                                                 {formData.tierType === "CORPORATE" ? "Organization Mobile / Phone" : "Mobile"} <span className="text-[#ED1C24] text-xs">*</span>
                                             </Label>
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
                                                     required
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

                                         {/* Name / Organization Name */}
                                         <div className={cn("space-y-1 group", formData.tierType === "CORPORATE" && "md:col-span-1")}>
                                             <Label htmlFor="name" className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
                                                 {formData.tierType === "CORPORATE" ? "Organization Name" : "First Name"} <span className="text-[#ED1C24] text-xs">*</span>
                                             </Label>
                                             <Input 
                                                 id="name" 
                                                 required 
                                                 className="h-10 rounded-lg bg-gray-50 border-none font-bold placeholder:text-black/30 text-black focus:ring-2 focus:ring-[#ED1C24]/10 px-6 transition-all text-xs" 
                                                 placeholder={formData.tierType === "CORPORATE" ? "e.g. Commercial Bank of Ethiopia" : "e.g. Abebe"} 
                                                 value={formData.organizationName || formData.name || formData.firstName || ""} 
                                                 onChange={(e) => setFormData({ ...formData, organizationName: e.target.value, name: e.target.value, firstName: e.target.value })} 
                                             />
                                         </div>

                                         {/* Father Name (Individual Only) */}
                                         {formData.tierType !== "CORPORATE" && (
                                             <div className="space-y-1 group">
                                                 <Label htmlFor="fatherName" className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Father Name <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                 <Input id="fatherName" required className="h-10 rounded-lg bg-gray-50 border-none font-bold placeholder:text-black/30 text-black focus:ring-2 focus:ring-[#ED1C24]/10 px-6 transition-all text-xs" placeholder="e.g. Kebede" value={formData.fatherName || formData.father_name || ""} onChange={(e) => setFormData({ ...formData, fatherName: e.target.value, father_name: e.target.value })} />
                                             </div>
                                         )}

                                         {/* Last Name (Individual Only) */}
                                         {formData.tierType !== "CORPORATE" && (
                                             <div className="space-y-1 group">
                                                 <Label htmlFor="grandfatherName" className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Last Name <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                 <Input id="grandfatherName" required className="h-10 rounded-lg bg-gray-50 border-none font-bold placeholder:text-black/30 text-black focus:ring-2 focus:ring-[#ED1C24]/10 px-6 transition-all text-xs" placeholder="e.g. Tadesse" value={formData.grandfatherName || formData.last_name || ""} onChange={(e) => setFormData({ ...formData, grandfatherName: e.target.value, last_name: e.target.value })} />
                                             </div>
                                         )}

                                         {/* Gender (Individual Only) */}
                                         {formData.tierType !== "CORPORATE" && (
                                             <div className="space-y-1 group">
                                                 <Label htmlFor="gender" className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Gender <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                 <select id="gender" required className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-6 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black" value={formData.gender || ""} onChange={handleChange}>
                                                     <option value="" disabled>Select Gender</option>
                                                     {GENDER_OPTIONS.map(opt => (
                                                         <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                     ))}
                                                 </select>
                                             </div>
                                         )}

                                         {/* Country */}
                                         <div className="space-y-1 group">
                                             <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Country <span className="text-[#ED1C24] text-xs">*</span></Label>
                                             <select id="country" className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-6 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black" value={formData.country || "ET"} onChange={handleChange}>
                                                 {ALL_COUNTRIES.map(c => (
                                                     <option key={c.code} value={c.code}>{c.name}</option>
                                                 ))}
                                             </select>
                                         </div>

                                         {/* Region (if Ethiopia) */}
                                         {formData.country === 'ET' && (
                                             <div className="space-y-1 group">
                                                 <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Region <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                 <select id="region" required className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-6 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black" value={formData.region || ""} onChange={handleChange}>
                                                     <option value="" disabled>Select Region</option>
                                                     {REGIONS.map(r => <option key={r.value} value={r.value}>{r.name}</option>)}
                                                 </select>
                                             </div>
                                         )}

                                         {/* Zone (if Ethiopia) */}
                                         {formData.country === 'ET' && (
                                             <div className="space-y-1 group">
                                                 <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Zone <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                 <select id="zone" required className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-6 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black" value={formData.zone || ""} onChange={handleChange}>
                                                     <option value="">Select Zone</option>
                                                     {zones.map(z => (
                                                         <option key={z.id} value={z.id}>{z.name}</option>
                                                     ))}
                                                 </select>
                                             </div>
                                         )}

                                         {/* International Address (if outside ET) */}
                                         {formData.country !== 'ET' && (
                                             <div className="space-y-1 group md:col-span-2">
                                                 <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">International Address <span className="text-[#ED1C24] text-xs">*</span></Label>
                                                 <Input id="internationalAddress" className="h-10 rounded-lg bg-gray-50 border-none font-bold text-black px-6 text-xs" value={formData.internationalAddress || ""} onChange={handleChange} required />
                                             </div>
                                         )}

                                         {/* Password */}
                                         <div className="space-y-1 group">
                                             <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Create Password <span className="text-[#ED1C24] text-xs">*</span></Label>
                                             <div className="relative">
                                                 <Input type={showPassword ? "text" : "password"} id="password" required className="h-10 rounded-lg bg-gray-50 border-none px-6 pr-12 font-bold text-black text-xs" value={formData.password} onChange={handleChange} placeholder="••••••••" />
                                                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors">
                                                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                 </button>
                                             </div>
                                         </div>

                                         {/* Confirm Password */}
                                         <div className="space-y-1 group">
                                             <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Confirm Password <span className="text-[#ED1C24] text-xs">*</span></Label>
                                             <div className="relative">
                                                 <Input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" required className="h-10 rounded-lg bg-gray-50 border-none px-6 pr-12 font-bold text-black text-xs" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
                                                 <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors">
                                                     {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                 </button>
                                             </div>
                                         </div>
                                     </div>

                                     {/* Expandable Optional Details Section */}
                                     <div className="pt-2 text-left">
                                         <button
                                             type="button"
                                             onClick={() => setShowMoreDetails(!showMoreDetails)}
                                             className="inline-flex items-center gap-2 text-xs font-black text-[#ED1C24] hover:text-black transition-colors py-2 px-1 rounded-lg"
                                         >
                                             {showMoreDetails ? (
                                                 <>
                                                     <ChevronUp className="h-4 w-4" /> Hide Additional Details
                                                 </>
                                             ) : (
                                                 <>
                                                     <Plus className="h-4 w-4" /> Add More Details (Optional)
                                                 </>
                                             )}
                                         </button>

                                         {showMoreDetails && (
                                             <motion.div
                                                 initial={{ opacity: 0, height: 0 }}
                                                 animate={{ opacity: 1, height: "auto" }}
                                                 exit={{ opacity: 0, height: 0 }}
                                                 className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-gray-100 mt-2 text-left"
                                             >
                                                 {/* Woreda / Sub-City */}
                                                 {formData.country === 'ET' && (
                                                     <div className="space-y-1 group">
                                                         <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Woreda / Sub-City</Label>
                                                         <select id="woreda" className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-6 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black" value={formData.woreda || ""} onChange={handleChange}>
                                                             <option value="">Select Woreda</option>
                                                             {woredas.map(w => (
                                                                 <option key={w.id} value={w.id}>{w.name}</option>
                                                             ))}
                                                         </select>
                                                     </div>
                                                 )}

                                                 {/* Kebele */}
                                                 <div className="space-y-1 group">
                                                     <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Kebele / House No.</Label>
                                                     <Input id="kebele" className="h-10 rounded-lg bg-gray-50 border-none font-bold text-black px-6 text-xs" placeholder="e.g. 03 / House 123" value={formData.kebele || ""} onChange={handleChange} />
                                                 </div>

                                                 {/* Email */}
                                                 <div className="space-y-1 group">
                                                     <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
                                                         {formData.tierType === "CORPORATE" ? "Official Organization Email" : "Email Address"}
                                                     </Label>
                                                     <Input id="email" type="email" className="h-10 rounded-lg bg-gray-50 border-none font-bold text-black px-6 text-xs" placeholder={formData.tierType === "CORPORATE" ? "e.g. info@organization.org" : "e.g. abebe@example.com"} value={formData.email || ""} onChange={handleChange} />
                                                 </div>

                                                 {/* Date of Birth (Individual Only) */}
                                                 {formData.tierType !== "CORPORATE" && (
                                                     <div className="space-y-1 group">
                                                         <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Date of Birth (Eth)</Label>
                                                         <Input id="dateOfBirth" type="text" className="h-10 rounded-lg bg-gray-50 border-none font-bold text-black px-6 text-xs" placeholder="DD/MM/YYYY (Ethiopian Calendar)" value={formData.dateOfBirth || ""} onChange={handleChange} />
                                                     </div>
                                                 )}

                                                 {/* Occupation (Individual Only) */}
                                                 {formData.tierType !== "CORPORATE" && (
                                                     <div className="space-y-1 group">
                                                         <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Occupation</Label>
                                                         <Input id="occupation" className="h-10 rounded-lg bg-gray-50 border-none font-bold text-black px-6 text-xs" placeholder="Enter Occupation" value={formData.occupation || ""} onChange={handleChange} />
                                                     </div>
                                                 )}

                                                 {/* Organization Type (Corporate Only) */}
                                                 {formData.tierType === "CORPORATE" && (
                                                     <div className="space-y-1 group">
                                                         <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Organization Type</Label>
                                                         <select id="organizationType" className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-6 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black" value={formData.organizationType || ""} onChange={handleChange}>
                                                             <option value="">Select Organization Type</option>
                                                             <option value="Government">Government</option>
                                                             <option value="NGO">NGO / Humanitarian</option>
                                                             <option value="Private">Private Enterprise</option>
                                                             <option value="Association">Association / Cooperative</option>
                                                             <option value="Other">Other</option>
                                                         </select>
                                                     </div>
                                                 )}

                                                 {/* Contact Person Name (Corporate Only) */}
                                                 {formData.tierType === "CORPORATE" && (
                                                     <div className="space-y-1 group">
                                                         <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Focal Contact Person</Label>
                                                         <Input id="contactPerson" className="h-10 rounded-lg bg-gray-50 border-none font-bold text-black px-6 text-xs" placeholder="e.g. Contact Person Full Name" value={formData.contactPerson || ""} onChange={handleChange} />
                                                     </div>
                                                 )}

                                                 {/* Education Level (Individual Only) */}
                                                 {formData.tierType !== "CORPORATE" && (
                                                     <div className="space-y-1 group">
                                                         <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Education Level</Label>
                                                         <select id="educationLevel" className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-6 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black" value={formData.educationLevel || ""} onChange={handleChange}>
                                                             <option value="">Select Education Level</option>
                                                             <option value="Below Primary School">Below Primary School</option>
                                                             <option value="Primary School Completed">Primary School Completed</option>
                                                             <option value="High School Completed">High School Completed</option>
                                                             <option value="Degree">Degree</option>
                                                             <option value="Masters">Masters</option>
                                                             <option value="PHD">PHD</option>
                                                         </select>
                                                     </div>
                                                 )}

                                                 {/* Area */}
                                                 <div className="space-y-1 group">
                                                     <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Area</Label>
                                                     <select id="area" className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-6 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black" value={formData.area || ""} onChange={handleChange}>
                                                         <option value="">Select Area</option>
                                                         <option value="URBAN">URBAN</option>
                                                         <option value="RURAL">RURAL</option>
                                                     </select>
                                                 </div>

                                                 {/* Languages */}
                                                 <div className="space-y-1 group md:col-span-2">
                                                     <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">Languages</Label>
                                                     <Input id="languages" className="h-10 rounded-lg bg-gray-50 border-none font-bold text-black px-6 text-xs" placeholder="e.g. Amharic, English" value={formData.languages || ""} onChange={handleChange} />
                                                 </div>
                                             </motion.div>
                                         )}
                                     </div>

                                     {error && <div className="text-red-500 text-[10px] font-bold text-center italic">{error}</div>}
                                     <Button type="submit" className="w-full h-12 bg-black hover:bg-[#ED1C24] text-white rounded-xl text-base font-black shadow-lg transition-all flex items-center justify-center gap-2">
                                         Continue to Membership Plans <ChevronRight className="h-4 w-4" />
                                     </Button>
                                 </form>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3-plans" {...stepVariants} className="space-y-6">
                            <div className="space-y-0.5 text-center">
                                <h2 className="text-3xl font-black text-black tracking-tighter">Membership Plans</h2>
                                <p className="text-black/40 font-bold uppercase tracking-widest text-[9px]">Step 2 of 2 · {formData.tierType} Subscription</p>
                            </div>

                            {registeredLoggedIn && (
                              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">✓</div>
                                  <div>
                                    <p className="text-xs font-black text-emerald-900">Account Registered & Auto-Logged In</p>
                                    <p className="text-[10px] text-emerald-600 font-semibold">Select your plan below and complete payment to obtain your official Member ID card.</p>
                                  </div>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-wider bg-white text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">Session Active</span>
                              </div>
                            )}

                            <form onSubmit={registeredLoggedIn ? (e) => { e.preventDefault(); handlePayWithArifPay(); } : handleSubmit} className="space-y-8">
                                <div className="space-y-4">
                                     <div className="flex justify-between items-center px-1">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select or Change Plan</span>
                                        <span className="text-[10px] font-black text-[#ED1C24] uppercase tracking-wider">{formData.tierType} Membership</span>
                                     </div>
                                     <div className="grid grid-cols-1 gap-3">
                                        {membershipPlans.length === 0 ? (
                                            <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                                <div className="text-[9px] font-black uppercase tracking-widest text-black/40 mt-3">Fetching premium plans...</div>
                                            </div>
                                        ) : membershipPlans
                                            .filter(p => p.tier_type === formData.tierType)
                                            .map((plan) => (
                                            <label 
                                                key={plan.short_code}
                                                className={cn(
                                                    "group relative p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between",
                                                    formData.membershipType === plan.short_code ? "border-[#ED1C24] bg-red-50/30 shadow-lg scale-[1.01] z-10" : "border-gray-50 bg-gray-50/50 hover:border-gray-300"
                                                )}
                                            >
                                                <input type="radio" name="membershipType" className="sr-only" checked={formData.membershipType === plan.short_code} onChange={() => handleTypeSelect(plan.short_code)} />
                                                {plan.is_featured && <div className="absolute top-0 right-0 px-3 py-1 bg-[#ED1C24] text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl shadow-md">Featured</div>}
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                                                        formData.membershipType === plan.short_code ? "bg-[#ED1C24] text-white" : "bg-white text-[#ED1C24] border border-gray-100 shadow-sm"
                                                    )}>
                                                        <CreditCard className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                       <h3 className="font-black text-lg tracking-tighter leading-none text-black">{plan.name}</h3>
                                                       <p className="text-black/60 text-[9px] font-bold mt-1 uppercase tracking-widest">{plan.description}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                   <div className="text-xl font-black text-black tracking-tighter">{plan.amount} <span className="text-[10px] font-bold text-black/30 tracking-normal">{plan.currency}</span></div>
                                                   <div className="text-[8px] font-black text-[#ED1C24] uppercase tracking-widest">per {plan.subscription_type.toLowerCase()}</div>
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

                                <div className="bg-red-50 p-4 rounded-2xl text-[10px] font-bold text-[#ED1C24] leading-relaxed border border-red-100/50 flex items-start gap-3">
                                    <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm"><ShieldCheck className="h-3 w-3" /></div>
                                    Secure Payment Notice: Member ID & digital cards are issued immediately after completing payment via encrypted ArifPay gateway.
                                </div>

                                {error && (
                                    <div className="space-y-3">
                                        <div className="bg-red-50 text-[#ED1C24] p-3 rounded-xl text-xs font-bold text-center border border-red-100 italic">
                                            {error}
                                        </div>
                                        {showLoginCTA && (
                                            <Button
                                                type="button"
                                                onClick={() => router.push("/login")}
                                                className="w-full h-12 bg-black hover:bg-[#ED1C24] text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg"
                                            >
                                                Log In to Portal Now
                                            </Button>
                                        )}
                                    </div>
                                )}

                                 <div className="flex gap-3 pt-1">
                                     <Button type="button" variant="ghost" className="h-12 rounded-xl font-black px-6 text-black/40 hover:text-black hover:bg-gray-50 transition-all text-sm" onClick={() => setStep(1)} disabled={loading}>Back</Button>
                                    <Button type="submit" className="flex-1 h-12 bg-[#ED1C24] hover:bg-black text-white rounded-xl text-base font-black shadow-lg shadow-red-500/15 transition-all flex items-center justify-center gap-2 active:scale-95" disabled={loading}>
                                        {loading ? "Processing..." : registeredLoggedIn ? <>⚡ Pay via ArifPay</> : <><CreditCard className="h-4 w-4" /> Register & Proceed to Payment</>}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div key="step5-success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-6">
                            <div className="mx-auto h-20 w-20 bg-green-50 rounded-[32px] flex items-center justify-center shadow-inner relative">
                                <CheckCircle className="h-10 w-10 text-green-500" strokeWidth={3} />
                                <div className="absolute -inset-2 rounded-[36px] border-2 border-green-100 animate-ping opacity-20" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-3xl font-black text-black tracking-tighter">Welcome Aboard.</h2>
                                <p className="text-black/60 font-medium text-base leading-relaxed max-w-xs mx-auto">
                                    Your humanitarian journey has officially begun! Check your phone for your temporary credentials.
                                </p>
                            </div>
                            {memberId && (
                                <div className="mx-auto max-w-sm p-6 bg-gradient-to-br from-gray-900 to-black rounded-[32px] shadow-2xl relative overflow-hidden group text-left">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ED1C24]/10 blur-3xl rounded-full -mr-16 -mt-16" />
                                    <div className="relative z-10 space-y-5">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-white p-1 rounded-lg">
                                                    <Image src="/logo.jpg" alt="ERCS" width={18} height={18} unoptimized />
                                                </div>
                                                <span className="text-white font-black text-[9px] uppercase tracking-widest italic opacity-60">Verified Member</span>
                                            </div>
                                            <ShieldCheck className="h-5 w-5 text-[#ED1C24]" />
                                        </div>
                                        
                                        <div className="space-y-0.5">
                                            <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Membership ID</div>
                                            <div className="text-2xl font-black text-white tracking-tighter" style={{ fontVariantNumeric: "tabular-nums" }}>
                                                {memberId}
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-white/5 flex justify-between items-end">
                                            <div className="space-y-0.5">
                                                <div className="text-[7px] font-black text-white/20 uppercase tracking-widest">Type</div>
                                                <div className="text-[10px] font-bold text-white uppercase">{formData.tierType}</div>
                                            </div>
                                            <QrCode className="h-8 w-8 text-white/20" />
                                        </div>
                                    </div>
                                </div>
                            )}
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

export default function MemberRegistrationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#ED1C24] border-t-transparent" />
      </div>
    }>
      <MemberRegistrationContent />
    </Suspense>
  );
}
