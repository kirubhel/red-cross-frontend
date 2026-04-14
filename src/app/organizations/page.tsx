"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  User, 
  Users, 
  FileText,
  BadgeCheck,
  Calendar,
  ExternalLink,
  Plus,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import { toast } from "sonner";
import en from 'react-phone-number-input/locale/en.json';
import { cn } from "@/lib/utils";

const ALL_COUNTRY_CODES = getCountries().map(country => ({
  code: `+${getCountryCallingCode(country)}`,
  name: (en as any)[country] || country
}));

type Organization = {
  id: string;
  name: string;
  type: string;
  description: string;
  volunteers_needed: number;
  contact_person: string;
  website: string;
  status: string;
};

export default function OrganizationsPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [countryCode, setCountryCode] = useState("+251");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeTab, setActiveTab] = useState("partners");
  const [orgTypes, setOrgTypes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    orgName: "",
    orgType: "",
    otherOrgType: "",
    contactPerson: "",
    email: "",
    phone: "",
    password: "",
    website: "",
    description: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#register") {
      setActiveTab("register");
    }
  }, []);

  useEffect(() => {
    fetchApprovedOrganizations();
    fetchOrganizationTypes();
  }, []);

  const fetchOrganizationTypes = async () => {
    try {
      const res = await api.get("/organizations/types");
      setOrgTypes(res.data.types || []);
    } catch (err) {
      console.error("Failed to fetch organization types:", err);
    }
  };

  const fetchApprovedOrganizations = async () => {
    try {
      const res = await api.get("/organizations/public");
      setOrganizations(res.data.organizations || []);
    } catch (err) {
      console.error("Failed to fetch organizations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const cleanPhone = formData.phone.replace(/^0+/, "").replace(countryCode, "");
      const finalPhone = `${countryCode}${cleanPhone}`;
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
      toast.success("Organization registration submitted! You can now log in to the portal.");
      
      // Add the new type to the list if it was "other"
      if (formData.orgType === "other" && formData.otherOrgType) {
        fetchOrganizationTypes();
      }

      setFormData({
        orgName: "",
        orgType: "",
        otherOrgType: "",
        contactPerson: "",
        email: "",
        phone: "",
        password: "",
        website: "",
        description: "",
      });

      router.push("/login");
    } catch (err) {
      console.error("Failed to submit organization registration:", err);
      toast.error("Failed to submit registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative overflow-hidden rounded-lg">
              <Image 
                src="/logo.jpg" 
                alt="ERCS Logo" 
                width={40} 
                height={40} 
                className="object-contain transition-transform duration-500 group-hover:scale-110" 
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-black leading-none tracking-tight">ERCS</span>
              <span className="text-[10px] font-bold text-[#ED1C24] uppercase tracking-[0.2em]">Ethiopia</span>
            </div>
          </Link>
          <Link href="/" className="text-sm font-bold text-black hover:text-[#ED1C24] transition-colors flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-black text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ED1C24]/20 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ED1C24]/10 border border-[#ED1C24]/20 rounded-full text-[#ED1C24] text-xs font-black uppercase tracking-widest mb-8">
              <Building2 className="h-3 w-3" /> Request Volunteers
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
                Get <span className="text-[#ED1C24]">Volunteers</span> for Your Mission
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              We connect organizations with dedicated Red Cross volunteers to support humanitarian efforts across Ethiopia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          <div className="flex flex-col items-center gap-6">
            <TabsList className="bg-white p-2 rounded-3xl h-16 shadow-xl shadow-black/5 border border-gray-100 inline-flex items-center overflow-hidden">
                <TabsTrigger value="partners" className="rounded-[20px] px-10 h-full font-black text-sm data-[state=active]:bg-[#ED1C24] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all flex items-center gap-2">
                   <Users className="h-4 w-4" /> Supported Organizations ({organizations.length})
                </TabsTrigger>
                <TabsTrigger value="register" className="rounded-[20px] px-10 h-full font-black text-sm data-[state=active]:bg-[#ED1C24] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all flex items-center gap-2">
                   <Plus className="h-4 w-4" /> Request Volunteers
                </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="partners" className="m-0 focus-visible:ring-0">
            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {[1,2,3].map(i => (
                     <div key={i} className="bg-white rounded-[40px] p-8 h-80 animate-pulse border border-gray-100" />
                   ))}
                </div>
            ) : organizations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                   <Building2 className="h-20 w-20 text-gray-200 mb-6" />
                   <h3 className="text-2xl font-black text-black tracking-tight">No requests processed yet</h3>
                   <p className="text-gray-400 font-medium max-w-sm mx-auto mt-2">If you represent an organization in need of support, submit your first volunteer request!</p>
                   <Button onClick={() => setActiveTab("register")} className="mt-8 bg-black hover:bg-[#ED1C24] text-white rounded-2xl h-14 px-8 font-black transition-all">
                      Request Now
                   </Button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {organizations.map((org) => (
                    <motion.div 
                      key={org.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#ED1C24]/5 transition-all duration-500 relative flex flex-col justify-between overflow-hidden"
                    >
                      {/* Status indicator */}
                      <div className="absolute top-8 right-8">
                        <BadgeCheck className="h-6 w-6 text-green-500" />
                      </div>

                      <div className="space-y-6">
                        <div className="h-16 w-16 bg-gray-50 group-hover:bg-[#ED1C24]/5 rounded-2xl flex items-center justify-center transition-colors">
                            <Building2 className="h-8 w-8 text-black group-hover:text-[#ED1C24] transition-colors" />
                        </div>

                        <div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-3 py-1 bg-gray-100 group-hover:bg-red-50 text-gray-500 group-hover:text-[#ED1C24] text-[9px] font-black uppercase tracking-widest rounded-full transition-colors">
                                    {org.type}
                                </span>
                                <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-full">
                                    Verified
                                </span>
                            </div>
                            <h3 className="text-2xl font-black text-black tracking-tighter leading-tight">{org.name}</h3>
                            <p className="text-gray-500 font-medium text-sm mt-4 line-clamp-3">
                                {org.description}
                            </p>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-gray-50 space-y-4">
                         <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-gray-400">Volunteers Support</span>
                            <span className="text-[#ED1C24]">{org.volunteers_needed}+ active slots</span>
                         </div>
                         <div className="flex items-center gap-3">
                             <Button className="flex-1 bg-black hover:bg-[#ED1C24] text-white rounded-2xl h-12 font-black text-[11px] uppercase tracking-widest transition-all">
                                Participate
                             </Button>
                             {org.website && (
                                <Link href={org.website} target="_blank" className="h-12 w-12 bg-gray-50 hover:bg-[#ED1C24]/5 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#ED1C24] transition-all border border-transparent hover:border-[#ED1C24]/10">
                                    <ExternalLink className="h-4 w-4" />
                                </Link>
                             )}
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
            )}
          </TabsContent>

          <TabsContent value="register" className="m-0 focus-visible:ring-0">
             <div className="max-w-3xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[40px] shadow-2xl shadow-black/5 border border-gray-100 p-8 md:p-12 overflow-hidden relative"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#ED1C24]" />
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-black tracking-tighter mb-2">Volunteer Request Form</h2>
                        <p className="text-gray-400 font-medium">Submit your request to receive Red Cross volunteer support for your organization.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Section 1: Organization Details */}
                        <div className="space-y-8">
                            <h3 className="text-xs font-black text-gray-300 uppercase tracking-[0.3em] flex items-center gap-3">
                                <div className="h-px bg-gray-100 flex-1" /> General Info
                            </h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Organization Name</label>
                                    <input 
                                        type="text" 
                                        name="orgName"
                                        required
                                        value={formData.orgName}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/10 transition-all text-sm font-bold text-black shadow-sm placeholder:text-gray-400"
                                        placeholder="Full legal name"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Organization Type</label>
                                    <select 
                                        name="orgType"
                                        required
                                        value={formData.orgType}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/10 transition-all text-sm font-bold text-black shadow-sm"
                                    >
                                        <option value="" disabled>Select category</option>
                                        {orgTypes.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                        <option value="other">Other (Specify)</option>
                                    </select>
                                </div>
                                {formData.orgType === "other" && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Specify Type</label>
                                        <input 
                                            type="text" 
                                            name="otherOrgType"
                                            required
                                            value={formData.otherOrgType}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/10 transition-all text-sm font-bold text-black shadow-sm placeholder:text-gray-400"
                                            placeholder="Enter organization type"
                                        />
                                    </div>
                                )}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Portal Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/10 transition-all text-sm font-bold text-black shadow-sm placeholder:text-gray-400"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Contact Person</label>
                                    <input 
                                        type="text" 
                                        name="contactPerson"
                                        required
                                        value={formData.contactPerson}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/10 transition-all text-sm font-bold text-black shadow-sm placeholder:text-gray-400"
                                        placeholder="Full name of representative"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Official Email</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/10 transition-all text-sm font-bold text-black shadow-sm placeholder:text-gray-400"
                                        placeholder="contact@org.et"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Organization Website</label>
                                    <input 
                                        type="url" 
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/10 transition-all text-sm font-bold text-black shadow-sm placeholder:text-gray-400"
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Phone Number</label>
                                    <div className="flex gap-2">
                                        <select 
                                            value={countryCode} 
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="w-32 px-3 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/10 transition-all text-[10px] font-bold text-black shadow-sm appearance-none"
                                        >
                                            {ALL_COUNTRY_CODES.sort((a,b) => a.name.localeCompare(b.name)).map((c, i) => (
                                                <option key={`${c.code}-${i}`} value={c.code} className="bg-white text-black">{c.name} ({c.code})</option>
                                            ))}
                                        </select>
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/10 transition-all text-sm font-bold text-black shadow-sm placeholder:text-gray-400"
                                            placeholder="912345678"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Description & Goals</label>
                                <textarea 
                                    name="description"
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/10 transition-all text-sm font-bold text-black resize-none shadow-sm placeholder:text-gray-400"
                                    placeholder="Briefly describe your humanitarian mission..."
                                />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-50">
                            <Button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full bg-[#ED1C24] hover:bg-black text-white rounded-[24px] h-20 text-lg font-black uppercase tracking-widest transition-all shadow-xl shadow-[#ED1C24]/20 cursor-pointer disabled:opacity-50"
                            >
                                {submitting ? "Registering..." : "Register Organization & Access Portal"}
                            </Button>
                        </div>
                    </form>
                </motion.div>
             </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
          <div className="container mx-auto px-6 text-center text-gray-400 font-bold text-sm tracking-tight">
              &copy; {new Date().getFullYear()} Ethiopian Red Cross Society. All rights reserved.
          </div>
      </footer>
    </div>
  );
}
