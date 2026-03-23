"use client";

import { useState } from "react";
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
  FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrganizationsPage() {
  const [formData, setFormData] = useState({
    orgName: "",
    orgType: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    volunteersNeeded: "",
    requirements: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting registration:", formData);
    // Add API call here when backend is ready
    alert("Registration submitted! (Demo)");
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
      <section className="bg-ercs-red text-white py-24 relative overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Register Your Organization
            </h1>
            <p className="text-white/80 text-lg font-medium">
              Partner with the Ethiopian Red Cross Society to create a greater impact in communities across Ethiopia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Container */}
      <div className="container mx-auto px-6 -mt-16 pb-32 relative z-20 max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Section 1: Organization Details */}
            <div>
              <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#ED1C24]" /> Organization Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/70">Organization Name *</label>
                  <input 
                    type="text" 
                    name="orgName"
                    required
                    value={formData.orgName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24] focus:bg-white transition-all text-sm"
                    placeholder="Enter organization name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/70">Organization Type *</label>
                  <select 
                    name="orgType"
                    required
                    value={formData.orgType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24] focus:bg-white transition-all text-sm text-black"
                  >
                    <option value="" disabled>Select type</option>
                    <option value="corporate">Corporate / Business</option>
                    <option value="ngo">NGO / Non-Profit</option>
                    <option value="government">Government Institution</option>
                    <option value="educational">Educational Institution</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/70">Contact Person *</label>
                  <input 
                    type="text" 
                    name="contactPerson"
                    required
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24] focus:bg-white transition-all text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/70">Email Address *</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24] focus:bg-white transition-all text-sm"
                    placeholder="org@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/70">Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24] focus:bg-white transition-all text-sm"
                    placeholder="+251 ..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/70">Website (Optional)</label>
                  <input 
                    type="url" 
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24] focus:bg-white transition-all text-sm"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <label className="text-sm font-bold text-black/70">Organization Mission/Description *</label>
                <textarea 
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24] focus:bg-white transition-all text-sm resize-none"
                  placeholder="Describe your organization's mission and purpose..."
                />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Section 2: Volunteer Requirements */}
            <div>
              <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-[#ED1C24]" /> Volunteer Requirements
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/70">Number of Volunteers Needed *</label>
                  <input 
                    type="number" 
                    name="volunteersNeeded"
                    required
                    min="1"
                    value={formData.volunteersNeeded}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24] focus:bg-white transition-all text-sm"
                    placeholder="e.g. 10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/70">Required Skills & Activities *</label>
                  <textarea 
                    name="requirements"
                    required
                    rows={6}
                    value={formData.requirements}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24] focus:bg-white transition-all text-sm resize-none"
                    placeholder="Describe the type of volunteers you need, required skills, time commitment, and specific activities expected..."
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-[#ED1C24] hover:bg-black text-white rounded-xl h-12 px-10 text-base font-bold transition-all shadow-lg shadow-[#ED1C24]/10 cursor-pointer"
              >
                Submit Registration
              </Button>
              <Link href="/">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full sm:w-auto h-12 px-10 rounded-xl font-bold text-black border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
