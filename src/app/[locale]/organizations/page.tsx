"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Building2, Mail, Phone, Globe, User, ShieldCheck, 
  CheckCircle2, ArrowRight, Eye, EyeOff, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import PhoneNumberInput, { buildFullPhoneNumber } from "@/components/ui/phone-number-input";
import api from "@/lib/api";
import { toast } from "sonner";

export default function OrganizationsRegisterPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [countryIso, setCountryIso] = useState("ET");
  const [orgTypes, setOrgTypes] = useState<string[]>([
    "NGO / Non-Profit",
    "UN Agency",
    "Community-Based Organization",
    "Government Agency",
    "Educational Institution",
    "Private Sector / CSR"
  ]);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    orgName: "",
    orgType: "NGO / Non-Profit",
    otherOrgType: "",
    contactPerson: "",
    email: "",
    phone: "",
    password: "",
    website: "",
    description: "",
  });

  useEffect(() => {
    fetchOrganizationTypes();
  }, []);

  const fetchOrganizationTypes = async () => {
    try {
      const res = await api.get("/organizations/types");
      if (res.data?.types && Array.isArray(res.data.types) && res.data.types.length > 0) {
        setOrgTypes(res.data.types);
      }
    } catch (err) {
      console.warn("Using default organization types:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orgName.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const finalPhone = buildFullPhoneNumber(countryIso, formData.phone);
      const finalOrgType = formData.orgType === "other" ? formData.otherOrgType : formData.orgType;

      await api.post("/organizations/register", {
        name: formData.orgName,
        type: finalOrgType,
        contact_person: formData.contactPerson,
        email: formData.email,
        phone: finalPhone,
        password: formData.password,
        website: formData.website,
        description: formData.description,
      });

      toast.success("Organization registration submitted successfully!");
      router.push("/login");
    } catch (err: any) {
      console.error("Failed to submit organization registration:", err);
      const errMsg = err?.response?.data?.error || "Failed to submit registration. Please try again.";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen max-h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header minimal={true} />

      <main className="flex-1 container mx-auto px-4 py-3 md:py-4 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-5xl bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-h-[calc(100vh-5rem)]">
          
          {/* Left Brand Panel (Red Cross Identity & Highlights) */}
          <div className="lg:col-span-4 bg-black text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Background red glow accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ED1C24]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#ED1C24]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ED1C24]/20 border border-[#ED1C24]/40 rounded-full text-[#ED1C24] text-[10px] font-black uppercase tracking-widest">
                <Building2 className="h-3 w-3" /> Partner Registration
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                  Mobilize <span className="text-[#ED1C24]">Volunteers</span> for Your Mission
                </h1>
                <p className="text-gray-400 text-xs md:text-sm font-medium mt-2 leading-relaxed">
                  Partner directly with the Ethiopian Red Cross Society to access verified, skilled volunteers nationwide.
                </p>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-gray-800">
                <div className="flex items-start gap-2.5 text-xs text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-[#ED1C24] shrink-0 mt-0.5" />
                  <span>Certified emergency and health volunteers</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-[#ED1C24] shrink-0 mt-0.5" />
                  <span>Direct regional coordination across Ethiopia</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-[#ED1C24] shrink-0 mt-0.5" />
                  <span>Real-time portal for managing requests</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-gray-800/80 text-[11px] text-gray-400 flex items-center justify-between">
              <span>Already registered?</span>
              <Link 
                href="/login" 
                className="text-[#ED1C24] hover:underline font-bold inline-flex items-center gap-1"
              >
                Sign In <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Right Compact Form (No-Scroll Viewport Layout) */}
          <div className="lg:col-span-8 p-5 md:p-8 flex flex-col justify-center overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                Register Organization
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Complete the details below to activate your organizational account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Org Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-600">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    name="orgName"
                    required
                    value={formData.orgName}
                    onChange={handleChange}
                    placeholder="Full legal organization name"
                    className="w-full h-10 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/20 focus:border-[#ED1C24] transition-all"
                  />
                </div>

                {/* Org Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-600">
                    Organization Category *
                  </label>
                  <select
                    name="orgType"
                    required
                    value={formData.orgType}
                    onChange={handleChange}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/20 focus:border-[#ED1C24] transition-all"
                  >
                    {orgTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                    <option value="other">Other (Specify)</option>
                  </select>
                </div>
              </div>

              {formData.orgType === "other" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-600">
                    Specify Category *
                  </label>
                  <input
                    type="text"
                    name="otherOrgType"
                    required
                    value={formData.otherOrgType}
                    onChange={handleChange}
                    placeholder="Describe organization type"
                    className="w-full h-10 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/20 focus:border-[#ED1C24]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Contact Person */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-600">
                    Representative Full Name *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    required
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="Lead contact / Officer"
                    className="w-full h-10 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/20 focus:border-[#ED1C24] transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-600">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="representative@org.et"
                    className="w-full h-10 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/20 focus:border-[#ED1C24] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-600">
                    Phone Number
                  </label>
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
                    inputClassName="h-10 px-3 bg-gray-50 border border-gray-200 rounded-r-xl font-bold text-xs text-black"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-600">
                    Portal Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full h-10 pl-3.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/20 focus:border-[#ED1C24] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Website */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-600">
                    Official Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.org"
                    className="w-full h-10 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/20 focus:border-[#ED1C24] transition-all"
                  />
                </div>

                {/* Mission / Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-600">
                    Brief Mission / Volunteer Need
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="E.g., Medical relief, food distribution, youth outreach"
                    className="w-full h-10 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/20 focus:border-[#ED1C24] transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#ED1C24] hover:bg-black text-white rounded-xl h-11 text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-red-500/20 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Registering..." : "Register Organization & Access Portal"}
                </Button>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
