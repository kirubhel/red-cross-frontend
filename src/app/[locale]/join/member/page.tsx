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
  Minus,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  Globe,
  QrCode,
  Building2
} from "lucide-react";
import PhoneNumberInput, { buildFullPhoneNumber, ALL_COUNTRIES } from "@/components/ui/phone-number-input";
import DateOfBirthPicker from "@/components/ui/date-of-birth-picker";
import RegistrationDateDisplay from "@/components/ui/registration-date-display";
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
  const [customPaymentAmount, setCustomPaymentAmount] = useState<string>("50");
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
    registrationDate: new Date().toISOString().split("T")[0],
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
            const base = parseFloat(featured.amount) || 50;
            setCustomPaymentAmount(String(base));
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
                const minAmt = parseFloat(featured.amount) || 50;
                setCustomPaymentAmount(prev => {
                  const cur = parseFloat(prev);
                  if (isNaN(cur) || cur < minAmt) return String(minAmt);
                  return prev;
                });
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
    setFormData(prev => ({ ...prev, membershipType: type }));
    const plan = membershipPlans.find(p => p.short_code === type);
    const minAmt = plan ? parseFloat(plan.amount) : 50;
    setCustomPaymentAmount(prev => {
      const cur = parseFloat(prev);
      if (isNaN(cur) || cur < minAmt) return String(minAmt);
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.phoneNumber) {
        setError("Phone number is required.");
        return;
    }

    if (formData.tierType === "CORPORATE") {
      if (!formData.organizationName) {
        setError("Organization Name is required.");
        return;
      }
      if (!formData.organizationType) {
        setError("Organization Sector/Type is required.");
        return;
      }
      // Corporate form stores representative into firstName / fatherName
      if (!formData.firstName) {
        setError("Authorized Representative Name is required.");
        return;
      }
      if (!formData.fatherName) {
        setError("Representative Father Name is required.");
        return;
      }
      if (formData.country === 'ET' && !formData.region) {
        setError("Branch/Region is required.");
        return;
      }
    } else {
      const missingFields = formConfig.filter(f => {
        // Fields in the "Add More Details (Optional)" section must never block progression
        if (isOptionalIndividualField(f)) return false;

        if (f.required && !formData[f.id] && f.type !== 'tel') {
          // If country is not Ethiopia, don't require region fields
          if (formData.country !== 'ET' && (f.dataSource === 'REGIONS' || f.id === 'region')) {
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
    }

    if (formData.country !== 'ET' && !formData.internationalAddress) {
      setError("Please provide your full international address.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    // Step 3: Pay & Join -> Validate custom amount & Register
    const selectedPlan = membershipPlans.find(p => p.short_code === formData.membershipType);
    const basePlanAmount = selectedPlan ? (parseFloat(selectedPlan.amount) || 50) : 50;
    const numCustomAmt = parseFloat(customPaymentAmount);
    if (isNaN(numCustomAmt) || numCustomAmt < basePlanAmount) {
      setError(`Payment amount cannot be less than the required minimum fee of ${basePlanAmount} ETB.`);
      return;
    }

    setLoading(true);
    setError("");
    setShowLoginCTA(false);

    try {
        const getVal = (keyword: string) => {
            const f = formConfig.find(f => f.label.toLowerCase().includes(keyword.toLowerCase()));
            return f ? (formData[f.id] || "") : "";
        };

        const extractedName = getVal("name");
        const extractedEmail = getVal("email");
        const extractedNationalId = getVal("national");
        const dobField = formConfig.find((f: any) => {
            const fid = (f.id || "").toLowerCase();
            const flab = (f.label || "").toLowerCase();
            return fid.includes("birth") || fid.includes("dob") || flab.includes("birth") || flab.includes("dob") || f.type === "date";
        });
        const extractedDOB = dobField ? (formData[dobField.id] || "") : (formData.dateOfBirth || formData.dob || "");
        const regDate = formData.registrationDate || new Date().toISOString().split("T")[0];
        const extractedGender = getVal("gender");
        
        const regionId = formData.country === "ET" ? (REGION_MAP_VALUE_TO_ID[formData.region] || 1) : 14;
        const finalAddress = formData.country === "ET" ? "" : formData.internationalAddress;

        const fullPhone = buildFullPhoneNumber(
            formData.country || "ET",
            formData.phoneNumber
        );

        let tokenVal = "";
        let generatedId = "";

        try {
            // Corporate uses hardcoded fields (firstName/fatherName);
            // Individual uses formConfig-keyed fields via getVal()
            const isCorporate = formData.tierType === "CORPORATE";
            const finalFirstName = isCorporate ? (formData.firstName || "") : extractedName;
            const finalFatherName = isCorporate ? (formData.fatherName || "") : getVal("father");
            const finalGrandName  = isCorporate ? "" : getVal("grandfather");

            // Attempt Registration
            const res = await api.post("/join/member", {
                first_name: finalFirstName,
                father_name: finalFatherName,
                grandfather_name: finalGrandName,
                email: isCorporate ? (formData.email || "") : extractedEmail,
                phone_number: fullPhone,
                national_id: extractedNationalId,
                date_of_birth: extractedDOB,
                registration_date: regDate,
                gender: extractedGender,
                password: formData.password,
                region: regionId,
                role: 6,
                membershipType: formData.membershipType,
                metadata: JSON.stringify({
                    country: formData.country,
                    international_address: finalAddress,
                    zone_id: formData.zone,
                    woreda_id: formData.woreda,
                    registration_date: regDate,
                    custom_payment_amount: numCustomAmt,
                    base_plan_amount: basePlanAmount,
                    // Corporate-specific metadata
                    ...(isCorporate && {
                        organization_name: formData.organizationName,
                        organization_type: formData.organizationType,
                        representative_title: formData.representativeTitle,
                        corporate_website: formData.website,
                        corporate_kebele: formData.kebele,
                        tier_type: "CORPORATE"
                    })
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
      const baseAmount = selectedPlan ? (parseFloat(selectedPlan.amount) || 50) : 50;
      const numAmount = parseFloat(customPaymentAmount);
      if (isNaN(numAmount) || numAmount < baseAmount) {
        setError(`Payment amount cannot be less than the minimum required fee of ${baseAmount} ETB.`);
        setLoading(false);
        return;
      }

      const fullPhone = buildFullPhoneNumber(formData.country || "ET", formData.phoneNumber);
      const cleanPhone = fullPhone.replace(/\D/g, "");

      const payRes = await api.post("/payment/initiate", {
        amount: numAmount,
        currency: selectedPlan?.currency || "ETB",
        provider: "ARIFPAY",
        payer_phone: cleanPhone,
        email: formData.email || "member@redcrosseth.org",
        first_name: formData.name || "Member",
        last_name: "Member"
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

  const hasRegionInConfig = formConfig.some(f => f.dataSource === 'REGIONS' || (f.id || '').toLowerCase() === 'region');
  const hasRegistrationInConfig = formConfig.some(f => 
    (f.id || "").toLowerCase().includes("registration") || 
    (f.label || "").toLowerCase().includes("registration")
  );

  const renderLocationFields = () => (
    <>
      <div key="core-country" className="space-y-1 group md:col-span-1">
        <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
          Country <span className="text-[#ED1C24] text-xs">*</span>
        </Label>
        <select 
          id="country" 
          className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-6 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black"
          value={formData.country || "ET"}
          onChange={handleChange}
        >
          {ALL_COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      {(formData.country === 'ET' || !formData.country) && (
        <div key="core-region" className="space-y-1 group md:col-span-1">
          <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
            Branch / Region <span className="text-[#ED1C24] text-xs">*</span>
          </Label>
          <select 
            id="region" 
            required
            className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-6 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black"
            value={formData.region}
            onChange={handleChange}
          >
            <option value="" disabled>Select Branch / Region</option>
            {REGIONS.map(r => <option key={r.value} value={r.value}>{r.name}</option>)}
          </select>
        </div>
      )}
      {(formData.country === 'ET' || !formData.country) && !formData.region && <div className="hidden md:block" />}

      {(formData.country === 'ET' || !formData.country) && formData.region && (
        <motion.div key="core-zone" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 group md:col-span-1">
          <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
            Zone <span className="text-[#ED1C24] text-xs">*</span>
          </Label>
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
      {(formData.country === 'ET' || !formData.country) && formData.region && !formData.zone && <div className="hidden md:block" />}

      {(formData.country === 'ET' || !formData.country) && formData.zone && (
        <motion.div key="core-woreda" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 group md:col-span-1">
          <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
            Woreda / Sub-City <span className="text-[#ED1C24] text-xs">*</span>
          </Label>
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

      {formData.country && formData.country !== 'ET' && (
        <div key="core-intl" className="space-y-1 group md:col-span-1">
          <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
            Address <span className="text-[#ED1C24] text-xs">*</span>
          </Label>
          <Input id="internationalAddress" className="h-10 rounded-lg bg-gray-50 border-none font-bold text-black px-6 text-xs" value={formData.internationalAddress} onChange={handleChange} required />
        </div>
      )}
    </>
  );

  const isOptionalIndividualField = (field: any) => {
    const fid = (field.id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const flab = (field.label || "").toLowerCase();

    // Primary fields that must ALWAYS be visible in primary section
    if (
      fid.includes("phone") ||
      fid.includes("first") ||
      fid.includes("father") ||
      fid.includes("grand") ||
      fid === "name" ||
      fid.includes("gender") ||
      fid.includes("registration") ||
      fid.includes("birth") ||
      fid.includes("dob") ||
      fid.includes("password") ||
      fid.includes("region") ||
      fid.includes("country") ||
      fid.includes("zone") ||
      fid.includes("woreda")
    ) {
      return false;
    }

    // Known optional fields
    if (
      fid.includes("occupation") ||
      fid.includes("profession") ||
      fid.includes("education") ||
      fid.includes("kebele") ||
      fid.includes("house") ||
      fid.includes("area") ||
      fid.includes("language") ||
      fid.includes("email") ||
      fid.includes("classification") ||
      fid.includes("general") ||
      fid.includes("youth") ||
      fid.includes("leadership")
    ) {
      return true;
    }

    return !field.required;
  };

  const renderFormField = (field: any) => {
    if (field.id === 'password') {
      return (
        <div key={field.id} className="space-y-1 group md:col-span-1">
          <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
            {field.label} {field.required && <span className="text-[#ED1C24] text-xs">*</span>}
          </Label>
          <div className="relative">
            <Input type={showPassword ? "text" : "password"} id="password" required={field.required} className="h-10 rounded-lg bg-gray-50 border-none px-6 pr-12 font-bold text-black text-xs" value={formData.password} onChange={handleChange} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      );
    }
    
    if (field.id === 'confirmPassword') {
      return (
        <div key={field.id} className="space-y-1 group md:col-span-1">
          <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
            {field.label} {field.required && <span className="text-[#ED1C24] text-xs">*</span>}
          </Label>
          <div className="relative">
            <Input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" required={field.required} className="h-10 rounded-lg bg-gray-50 border-none px-6 pr-12 font-bold text-black text-xs" value={formData.confirmPassword} onChange={handleChange} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors">
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      );
    }

    if (field.type === 'tel') {
      return (
        <div key={field.id} className="space-y-1 group md:col-span-1">
          <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
            {field.label} {field.required && <span className="text-[#ED1C24] text-xs">*</span>}
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
      return renderLocationFields();
    }

    const fieldIdLower = (field.id || "").toLowerCase();
    const fieldLabelLower = (field.label || "").toLowerCase();

    // Registration Date (Auto-captured, read-only)
    if (fieldIdLower.includes("registration") || fieldLabelLower.includes("registration")) {
      return (
        <RegistrationDateDisplay 
          key={field.id} 
          label={field.label} 
          dateStr={formData.registrationDate || new Date().toISOString().split("T")[0]} 
        />
      );
    }

    // Date of Birth (Day, Month, Year Date Picker)
    if (
      fieldIdLower.includes("birth") || 
      fieldIdLower.includes("dob") || 
      fieldLabelLower.includes("birth") || 
      fieldLabelLower.includes("dob") || 
      field.type === "date"
    ) {
      return (
        <div key={field.id} className="space-y-1 group md:col-span-1">
          <Label htmlFor={field.id} className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
            {field.label} {field.required && <span className="text-[#ED1C24] text-xs">*</span>}
          </Label>
          <DateOfBirthPicker 
            id={field.id} 
            value={formData[field.id] || ""} 
            required={field.required} 
            onChange={(val) => setFormData((prev: any) => ({ ...prev, [field.id]: val }))} 
          />
        </div>
      );
    }

    return (
      <div key={field.id} className="space-y-1 group md:col-span-1">
        <Label htmlFor={field.id} className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
          {field.label} {field.required && <span className="text-[#ED1C24] text-xs">*</span>}
        </Label>
        <div className="relative">
          {field.type === 'select' ? (
            <select 
              id={field.id} 
              required={field.required} 
              className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-6 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none relative text-black"
              value={formData[field.id] || ""}
              onChange={handleChange}
            >
              <option value="" disabled>{field.placeholder || "Select an option"}</option>
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
              className="h-10 rounded-lg bg-gray-50 border-none font-bold placeholder:text-black/30 text-black focus:ring-2 focus:ring-[#ED1C24]/10 px-6 transition-all text-xs" 
              placeholder={field.placeholder} 
              value={formData[field.id] || ""} 
              onChange={handleChange} 
            />
          )}
        </div>
      </div>
    );
  };

  const renderCorporateFields = () => (
    <>
      <div className="space-y-1 group md:col-span-1">
        <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
          Organization / Company Name <span className="text-[#ED1C24] text-xs">*</span>
        </Label>
        <Input 
          id="organizationName" 
          required 
          className="h-10 rounded-lg bg-gray-50 border-none font-bold placeholder:text-black/30 text-black px-6 text-xs" 
          placeholder="e.g. Commercial Bank of Ethiopia, Ethio Telecom" 
          value={formData.organizationName || ""} 
          onChange={handleChange} 
        />
      </div>

      <div className="space-y-1 group md:col-span-1">
        <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
          Sector / Organization Type <span className="text-[#ED1C24] text-xs">*</span>
        </Label>
        <select
          id="organizationType"
          required
          className="flex h-10 w-full rounded-lg bg-gray-50 border-none px-6 py-2 text-xs font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none text-black"
          value={formData.organizationType || ""}
          onChange={handleChange}
        >
          <option value="" disabled>Select Organization Type</option>
          <option value="CORPORATE">Private Corporation / Business</option>
          <option value="NGO">Non-Governmental Organization (NGO)</option>
          <option value="GOVERNMENT">Government / Public Agency</option>
          <option value="HEALTHCARE">Healthcare &amp; Medical Institution</option>
          <option value="EDUCATIONAL">Educational Institution / University</option>
          <option value="FINANCIAL">Financial Institution / Banking</option>
          <option value="OTHER">Other Enterprise</option>
        </select>
      </div>

      <div className="space-y-1 group md:col-span-1">
        <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
          Representative Name <span className="text-[#ED1C24] text-xs">*</span>
        </Label>
        <Input 
          id="firstName" 
          required 
          className="h-10 rounded-lg bg-gray-50 border-none font-bold placeholder:text-black/30 text-black px-6 text-xs" 
          placeholder="e.g. Abebe" 
          value={formData.firstName || ""} 
          onChange={handleChange} 
        />
      </div>

      <div className="space-y-1 group md:col-span-1">
        <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
          Representative Father Name <span className="text-[#ED1C24] text-xs">*</span>
        </Label>
        <Input 
          id="fatherName" 
          required 
          className="h-10 rounded-lg bg-gray-50 border-none font-bold placeholder:text-black/30 text-black px-6 text-xs" 
          placeholder="e.g. Kebede" 
          value={formData.fatherName || ""} 
          onChange={handleChange} 
        />
      </div>

      <div className="space-y-1 group md:col-span-1">
        <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
          Official Corporate Phone <span className="text-[#ED1C24] text-xs">*</span>
        </Label>
        <div className="relative">
          <PhoneNumberInput
            countryCode={formData.country || "ET"}
            onCountryChange={(code) => setFormData((prev: any) => ({ ...prev, country: code, phoneNumber: "" }))}
            localNumber={formData.phoneNumber}
            onLocalNumberChange={(val) => {
              setFormData((prev: any) => ({ ...prev, phoneNumber: val }));
              if (phoneExists) setPhoneExists(false);
            }}
            onBlur={handlePhoneBlur}
            required={true}
          />
          {checkingPhone && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <span className="text-[9px] font-bold text-black/40">Checking...</span>
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-[#ED1C24] border-t-transparent" />
            </div>
          )}
        </div>
      </div>

      <RegistrationDateDisplay 
        dateStr={formData.registrationDate || new Date().toISOString().split("T")[0]} 
      />

      {renderLocationFields()}

      <div className="space-y-1 group md:col-span-1">
        <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
          Portal Password <span className="text-[#ED1C24] text-xs">*</span>
        </Label>
        <div className="relative">
          <Input 
            type={showPassword ? "text" : "password"} 
            id="password" 
            required 
            className="h-10 rounded-lg bg-gray-50 border-none px-6 pr-12 font-bold text-black text-xs" 
            value={formData.password} 
            onChange={handleChange} 
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1 group md:col-span-1">
        <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
          Confirm Password <span className="text-[#ED1C24] text-xs">*</span>
        </Label>
        <div className="relative">
          <Input 
            type={showConfirmPassword ? "text" : "password"} 
            id="confirmPassword" 
            required 
            className="h-10 rounded-lg bg-gray-50 border-none px-6 pr-12 font-bold text-black text-xs" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors">
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Additional Details Section for Corporate */}
      <div className="md:col-span-2 pt-2">
        <button
          type="button"
          onClick={() => setShowMoreDetails(!showMoreDetails)}
          className={cn(
            "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 text-left cursor-pointer",
            showMoreDetails
              ? "bg-red-50/50 border-[#ED1C24]/30 shadow-sm"
              : "bg-white border-gray-200 hover:border-[#ED1C24]/40 hover:bg-gray-50/60"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0",
              showMoreDetails ? "bg-[#ED1C24] text-white" : "bg-gray-100 text-gray-600"
            )}>
              {showMoreDetails ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-black block">
                  {showMoreDetails ? "Hide Additional Details" : "Add More Details (Optional)"}
                </span>
                {!showMoreDetails && (formData.representativeTitle || formData.email || formData.kebele || formData.website) && (
                  <span className="text-[9px] font-black uppercase bg-red-100 text-[#ED1C24] px-2 py-0.5 rounded-full">
                    Details Entered
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-500 font-medium">
                Designation, Corporate Email, Head Office Kebele &amp; Website
              </span>
            </div>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-200 shrink-0",
            showMoreDetails && "rotate-180 text-[#ED1C24]"
          )} />
        </button>

        <AnimatePresence>
          {showMoreDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 overflow-hidden"
            >
              <div className="space-y-1 group md:col-span-1">
                <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
                  Designation / Role in Organization
                </Label>
                <Input 
                  id="representativeTitle" 
                  className="h-10 rounded-lg bg-gray-50 border-none font-bold placeholder:text-black/30 text-black px-6 text-xs" 
                  placeholder="e.g. Managing Director, CSR Lead" 
                  value={formData.representativeTitle || ""} 
                  onChange={handleChange} 
                />
              </div>

              <div className="space-y-1 group md:col-span-1">
                <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
                  Official Corporate Email (Optional)
                </Label>
                <Input 
                  id="email" 
                  type="email"
                  className="h-10 rounded-lg bg-gray-50 border-none font-bold placeholder:text-black/30 text-black px-6 text-xs" 
                  placeholder="e.g. csr@company.com" 
                  value={formData.email || ""} 
                  onChange={handleChange} 
                />
              </div>

              <div className="space-y-1 group md:col-span-1">
                <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
                  Head Office Kebele / Address
                </Label>
                <Input 
                  id="kebele" 
                  className="h-10 rounded-lg bg-gray-50 border-none font-bold placeholder:text-black/30 text-black px-6 text-xs" 
                  placeholder="e.g. Bole Sub-city, Woreda 03, Building 4" 
                  value={formData.kebele || ""} 
                  onChange={handleChange} 
                />
              </div>

              <div className="space-y-1 group md:col-span-1">
                <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1 group-focus-within:text-[#ED1C24] transition-colors">
                  Official Website (Optional)
                </Label>
                <Input 
                  id="website" 
                  type="url"
                  className="h-10 rounded-lg bg-gray-50 border-none font-bold placeholder:text-black/30 text-black px-6 text-xs" 
                  placeholder="e.g. https://company.com" 
                  value={formData.website || ""} 
                  onChange={handleChange} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );

  const renderIndividualFields = () => {
    const individualConfig = formConfig.filter((field: any) => {
      const fid = (field.id || "").toLowerCase();
      const flab = (field.label || "").toLowerCase();
      if (fid.includes("organization") || flab.includes("organization") || fid === "org" || flab.includes("org name")) return false;
      if (fid === 'country' || fid === 'zone' || fid === 'woreda' || field.dataSource === 'COUNTRIES') return false;
      return true;
    });

    const primaryFields = individualConfig.filter((f: any) => !isOptionalIndividualField(f));
    const optionalFields = individualConfig.filter((f: any) => isOptionalIndividualField(f));

    return (
      <>
        {/* Primary Required Demographic Fields */}
        {primaryFields.map((field: any) => renderFormField(field))}

        {/* Guarantee Registration Date if missing from formConfig */}
        {!hasRegistrationInConfig && (
          <RegistrationDateDisplay 
            dateStr={formData.registrationDate || new Date().toISOString().split("T")[0]} 
          />
        )}

        {/* Guarantee Location (Country, Branch/Region, Zone, Woreda) if missing from formConfig */}
        {!hasRegionInConfig && renderLocationFields()}

        {/* Guarantee Password and Confirm Password if not present in formConfig */}
        {!primaryFields.some((f: any) => f.id === 'password') && renderFormField({ id: 'password', label: 'Password', required: true })}
        {!primaryFields.some((f: any) => f.id === 'confirmPassword') && renderFormField({ id: 'confirmPassword', label: 'Confirm Password', required: true })}

        {/* Collapsible Additional Details Section for Individual */}
        {optionalFields.length > 0 && (
          <div className="md:col-span-2 pt-2">
            <button
              type="button"
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              className={cn(
                "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 text-left cursor-pointer",
                showMoreDetails
                  ? "bg-red-50/50 border-[#ED1C24]/30 shadow-sm"
                  : "bg-white border-gray-200 hover:border-[#ED1C24]/40 hover:bg-gray-50/60"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0",
                  showMoreDetails ? "bg-[#ED1C24] text-white" : "bg-gray-100 text-gray-600"
                )}>
                  {showMoreDetails ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-black block">
                      {showMoreDetails ? "Hide Additional Details" : "Add More Details (Optional)"}
                    </span>
                    {!showMoreDetails && optionalFields.some((f: any) => formData[f.id]) && (
                      <span className="text-[9px] font-black uppercase bg-red-100 text-[#ED1C24] px-2 py-0.5 rounded-full">
                        Details Entered
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Occupation, Education, Kebele, Area, Languages &amp; Email
                  </span>
                </div>
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 text-gray-400 transition-transform duration-200 shrink-0",
                showMoreDetails && "rotate-180 text-[#ED1C24]"
              )} />
            </button>

            <AnimatePresence>
              {showMoreDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 overflow-hidden"
                >
                  {optionalFields.map((field: any) => renderFormField(field))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </>
    );
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

        <div className="w-full text-left mb-8">
  <h1 className="text-2xl md:text-3xl font-black text-black tracking-normal uppercase leading-none">
    Member &nbsp; Registration &nbsp; Form
</h1>
    <div className="mt-3 h-1 w-12 bg-[#ED1C24] rounded-full" />
</div>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" {...stepVariants}>
                            <div className="space-y-0.5 mb-5">
                                <h2 className="text-2xl font-black text-black tracking-tighter">
                                  {formData.tierType === "CORPORATE" ? "Corporate Member Registration" : "Individual Member Registration"}
                                </h2>
                                <p className="text-black/60 font-black text-[9px] uppercase tracking-widest bg-gray-50 inline-block px-2 py-0.5 rounded-full border border-gray-100">Step 1 of 2 · Registration Details</p>
                            </div>

                            {/* Category Selection Tabs: Individual vs Corporate */}
                            <div className="flex bg-gray-100/90 p-1 rounded-2xl gap-1 mb-6 border border-gray-200/60">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, tierType: "INDIVIDUAL" }))}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all",
                                        formData.tierType === "INDIVIDUAL"
                                            ? "bg-white text-black shadow-sm"
                                            : "text-black/40 hover:text-black hover:bg-white/50"
                                    )}
                                >
                                    <User className={cn("h-4 w-4", formData.tierType === "INDIVIDUAL" ? "text-[#ED1C24]" : "text-black/30")} />
                                    <span>Individual Member</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, tierType: "CORPORATE" }))}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all",
                                        formData.tierType === "CORPORATE"
                                            ? "bg-white text-black shadow-sm"
                                            : "text-black/40 hover:text-black hover:bg-white/50"
                                    )}
                                >
                                    <Building2 className={cn("h-4 w-4", formData.tierType === "CORPORATE" ? "text-[#ED1C24]" : "text-black/30")} />
                                    <span>Corporate Member</span>
                                </button>
                            </div>

                             <form onSubmit={(e) => { 
                                 e.preventDefault(); 
                                 if (!formData.phoneNumber) { setError("Phone number is required."); return; }
                                 if ((formData.country === "ET" || !formData.country) && !formData.region) { 
                                   setError("Please select your Branch / Region."); 
                                   return; 
                                 }
                                 if (formData.tierType === "CORPORATE" && !formData.organizationName) { 
                                   setError("Organization Name is required for corporate registration."); 
                                   return; 
                                 }
                                 if (formData.password !== formData.confirmPassword) { 
                                   setError("Passwords do not match."); 
                                   return; 
                                 }
                                 setError("");
                                 setStep(3); 
                             }} className="space-y-5">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-left">
                                      {formData.tierType === "CORPORATE" ? renderCorporateFields() : renderIndividualFields()}
                                 </div>
                                 {error && <div className="text-red-500 text-[10px] font-bold text-center italic">{error}</div>}
                                 <Button type="submit" className="w-full h-12 bg-black hover:bg-[#ED1C24] text-white rounded-xl text-base font-black shadow-lg transition-all flex items-center justify-center gap-2">
                                     Continue to Plans <ChevronRight className="h-4 w-4" />
                                 </Button>
                             </form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="tier-select" {...stepVariants} className="space-y-6">
                            <div className="space-y-0.5 text-center">
                                <h2 className="text-3xl font-black text-black tracking-tighter">Membership Portal</h2>
                                <p className="text-black/40 font-bold uppercase tracking-widest text-[9px]">Step 2 of 3 · Select Category</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <button 
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, tierType: "INDIVIDUAL" }));
                                        setStep(3);
                                    }}
                                    className="group relative p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#ED1C24] hover:shadow-xl hover:shadow-red-500/10 transition-all flex items-center gap-6 text-left h-24"
                                >
                                    <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-[#ED1C24] group-hover:bg-[#ED1C24] group-hover:text-white transition-all shrink-0">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black text-black tracking-tight">Individual</h3>
                                        <p className="text-gray-400 text-xs font-medium">Personal humanitarian commitment.</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 ml-auto text-gray-200 group-hover:text-[#ED1C24] group-hover:translate-x-1 transition-all" />
                                </button>

                                <button 
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, tierType: "CORPORATE" }));
                                        setStep(3);
                                    }}
                                    className="group relative p-4 bg-white border border-gray-100 rounded-2xl hover:border-purple-600 hover:shadow-xl hover:shadow-purple-500/10 transition-all flex items-center gap-6 text-left h-24"
                                >
                                    <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0">
                                        <Globe className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black text-black tracking-tight">Corporate</h3>
                                        <p className="text-gray-400 text-xs font-medium">Organizational humanitarian impact.</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 ml-auto text-gray-200 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                                </button>
                            </div>

                             <div className="flex justify-start">
                                <Button variant="ghost" onClick={() => setStep(1)} className="font-bold flex items-center gap-2 text-black/40 hover:text-black hover:bg-gray-50 px-4 py-2 rounded-lg transition-all text-xs">
                                     <ArrowLeft className="h-3.5 w-3.5" /> Back to My Details
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3-plans" {...stepVariants} className="space-y-6">
                            <div className="space-y-0.5 text-center">
                                <h2 className="text-3xl font-black text-black tracking-tighter">Account Portal</h2>
                                <p className="text-black/40 font-bold uppercase tracking-widest text-[9px]">Step 2 of 2 · Custom Subscription</p>
                            </div>

                            {registeredLoggedIn && (
                              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">✓</div>
                                  <div>
                                    <p className="text-xs font-black text-emerald-900">Account Registered &amp; Auto-Logged In</p>
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
                                        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200/80 gap-1">
                                          <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, tierType: "INDIVIDUAL" }))}
                                            className={cn(
                                              "text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5",
                                              formData.tierType === "INDIVIDUAL"
                                                ? "bg-white text-[#ED1C24] shadow-xs"
                                                : "text-gray-500 hover:text-black"
                                            )}
                                          >
                                            <User className="h-3 w-3" /> Individual
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, tierType: "CORPORATE" }))}
                                            className={cn(
                                              "text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5",
                                              formData.tierType === "CORPORATE"
                                                ? "bg-white text-purple-700 shadow-xs"
                                                : "text-gray-500 hover:text-black"
                                            )}
                                          >
                                            <Building2 className="h-3 w-3" /> Corporate
                                          </button>
                                        </div>
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

                                {/* Custom Membership Payment & Contribution Field */}
                                {(() => {
                                  const selectedPlanObj = membershipPlans.find(p => p.short_code === formData.membershipType);
                                  const basePlanFee = selectedPlanObj ? (parseFloat(selectedPlanObj.amount) || 50) : 50;
                                  const parsedCustomAmt = parseFloat(customPaymentAmount);
                                  const isCustomAmtValid = !isNaN(parsedCustomAmt) && parsedCustomAmt >= basePlanFee;
                                  const extraContributionAmt = isCustomAmtValid && parsedCustomAmt > basePlanFee ? (parsedCustomAmt - basePlanFee) : 0;
                                  const planCurrency = selectedPlanObj?.currency || "ETB";

                                  return (
                                    <div className="bg-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm space-y-4">
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <div>
                                          <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                                            <CreditCard className="h-3.5 w-3.5 text-[#ED1C24]" /> Membership Payment Amount
                                          </label>
                                          <p className="text-[11px] text-gray-500 font-medium">
                                            Enter the amount you wish to contribute. Minimum required fee is {basePlanFee} {planCurrency}.
                                          </p>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-red-50 text-[#ED1C24] rounded-full border border-red-100/60 self-start sm:self-auto">
                                          Min: {basePlanFee} {planCurrency}
                                        </span>
                                      </div>

                                      <div className="space-y-2">
                                        <div className="relative">
                                          <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-sm text-gray-500">
                                            {planCurrency}
                                          </div>
                                          <input
                                            type="number"
                                            min={basePlanFee}
                                            step="any"
                                            value={customPaymentAmount}
                                            onChange={(e) => setCustomPaymentAmount(e.target.value)}
                                            placeholder={String(basePlanFee)}
                                            className={cn(
                                              "w-full h-12 pl-16 pr-4 bg-gray-50 border rounded-xl text-base font-black text-black focus:outline-none transition-all",
                                              !isCustomAmtValid 
                                                ? "border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50/20" 
                                                : "border-gray-200 focus:ring-2 focus:ring-[#ED1C24]/20 focus:border-[#ED1C24]"
                                            )}
                                          />
                                        </div>

                                        {/* Dynamic validation message */}
                                        {!isCustomAmtValid ? (
                                          <p className="text-[11px] font-bold text-[#ED1C24] flex items-center gap-1">
                                            ⚠️ Amount cannot be less than the required minimum plan fee of {basePlanFee} {planCurrency}.
                                          </p>
                                        ) : extraContributionAmt > 0 ? (
                                          <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                            ✓ Base fee: {basePlanFee} {planCurrency} + Extra humanitarian contribution: {extraContributionAmt.toLocaleString()} {planCurrency}! Thank you!
                                          </p>
                                        ) : (
                                          <p className="text-[11px] font-medium text-gray-400">
                                            You can enter a higher amount to make an additional contribution to Ethiopian Red Cross Society humanitarian programs.
                                          </p>
                                        )}

                                        {/* Quick Contribution Suggestion Chips */}
                                        <div className="flex flex-wrap items-center gap-2 pt-1">
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mr-1">Quick Select:</span>
                                          {[
                                            { label: `Base (${basePlanFee})`, value: basePlanFee },
                                            { label: `${basePlanFee + 50}`, value: basePlanFee + 50 },
                                            { label: `${basePlanFee + 150}`, value: basePlanFee + 150 },
                                            { label: `${basePlanFee + 450}`, value: basePlanFee + 450 },
                                            { label: `${basePlanFee + 950}`, value: basePlanFee + 950 },
                                          ].map((chip) => (
                                            <button
                                              key={chip.label}
                                              type="button"
                                              onClick={() => setCustomPaymentAmount(String(chip.value))}
                                              className={cn(
                                                "text-xs font-black px-3 py-1.5 rounded-lg border transition-all cursor-pointer",
                                                parseFloat(customPaymentAmount) === chip.value
                                                  ? "bg-[#ED1C24] text-white border-[#ED1C24] shadow-sm"
                                                  : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                                              )}
                                            >
                                              {chip.label} {planCurrency}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}

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
                                     <Button type="button" variant="ghost" className="h-12 rounded-xl font-black px-6 text-black/40 hover:text-black hover:bg-gray-50 transition-all text-sm" onClick={() => setStep(1)} disabled={loading}>Back to Details</Button>
                                     {(() => {
                                       const selectedPlanObj = membershipPlans.find(p => p.short_code === formData.membershipType);
                                       const basePlanFee = selectedPlanObj ? (parseFloat(selectedPlanObj.amount) || 50) : 50;
                                       const parsedAmt = parseFloat(customPaymentAmount);
                                       const isValid = !isNaN(parsedAmt) && parsedAmt >= basePlanFee;

                                       return (
                                         <Button 
                                           type="submit" 
                                           disabled={loading || !isValid} 
                                           className="flex-1 h-12 bg-[#ED1C24] hover:bg-black text-white rounded-xl text-sm font-black shadow-lg shadow-red-500/15 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
                                         >
                                           {loading ? "Processing..." : registeredLoggedIn ? (
                                             <>⚡ Pay {isValid ? `${parsedAmt.toLocaleString()} ETB` : ""} via ArifPay</>
                                           ) : (
                                             <><CreditCard className="h-4 w-4" /> Register &amp; Proceed to Pay {isValid ? `${parsedAmt.toLocaleString()} ETB` : ""}</>
                                           )}
                                         </Button>
                                       );
                                     })()}
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
