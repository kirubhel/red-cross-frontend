"use client";

import { useState } from "react";
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
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MemberRegistrationPage() {
  const [step, setStep] = useState(1); // 1: Personal, 2: Membership Type/Payment, 3: Success
  const [formData, setFormData] = useState({
    firstName: "",
    fatherName: "",
    email: "",
    phone: "",
    region: "ADDIS_ABABA",
    membershipType: "REGULAR", // REGULAR, LIFE, CORPORATE
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleTypeSelect = (type: string) => {
      setFormData({ ...formData, membershipType: type });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
        setStep(2);
    } else {
        // TODO: Call API to register and initiate payment
        console.log("Submitting Member:", formData);
        setStep(3); // Mock success
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
        <div className="w-full max-w-4xl grid lg:grid-cols-[1fr_480px] gap-12 items-center">
            
            {/* Context Side */}
            <div className="hidden lg:flex flex-col space-y-10">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                        <ShieldCheck className="h-3 w-3 fill-current" /> Official Member
                    </div>
                    <h1 className="text-7xl font-black text-black leading-[0.9] tracking-tighter">
                        Stand With <br />
                        <span className="text-[#ED1C24]">Humanity.</span>
                    </h1>
                    <p className="text-xl text-black/60 font-medium max-w-md">
                        Your membership sustains our critical operations. Join millions of Ethiopians supporting our mission.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-black/40 font-black uppercase tracking-[0.2em] text-[10px]">
                        <span className="h-px flex-1 bg-gray-100"></span>
                        Membership Benefits
                        <span className="h-px flex-1 bg-gray-100"></span>
                    </div>
                    {[
                        { icon: ShieldCheck, text: "Official Membership Credentials" },
                        { icon: User, text: "General Assembly Voting Rights" },
                        { icon: Heart, text: "Direct Impact on Sustainable Aid" }
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
                className="w-full bg-white p-6 md:p-10 rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100"
            >
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" {...stepVariants}>
                            <div className="space-y-1 mb-8">
                                <h2 className="text-3xl font-black text-black tracking-tighter">Personal Details</h2>
                                <p className="text-black/60 font-black text-xs uppercase tracking-widest">Step 1 of 2</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest ml-1 text-black/60">First Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40" />
                                            <Input id="firstName" required className="h-12 pl-12 rounded-xl bg-gray-50 border-none font-bold placeholder:text-black/30" placeholder="e.g. Abebe" value={formData.firstName} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fatherName" className="text-[10px] font-black uppercase tracking-widest ml-1 text-black/60">Father&apos;s Name</Label>
                                        <Input id="fatherName" required className="h-12 rounded-xl bg-gray-50 border-none font-bold placeholder:text-black/30" placeholder="e.g. Kebede" value={formData.fatherName} onChange={handleChange} />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest ml-1 text-black/60">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40" />
                                        <Input id="email" type="email" required className="h-12 pl-12 rounded-xl bg-gray-50 border-none font-bold placeholder:text-black/30" placeholder="abebe@example.com" value={formData.email} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest ml-1 text-black/60">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40" />
                                        <Input id="phone" type="tel" placeholder="+251 9..." required className="h-12 pl-12 rounded-xl bg-gray-50 border-none font-bold placeholder:text-black/30" value={formData.phone} onChange={handleChange} />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="region" className="text-[10px] font-black uppercase tracking-widest ml-1 text-black/60">Region</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40 z-10" />
                                        <select 
                                            id="region" 
                                            className="flex h-12 w-full rounded-xl bg-gray-50 border-none px-12 py-2 text-sm font-bold focus:ring-2 focus:ring-[#ED1C24]/10 appearance-none relative"
                                            value={formData.region}
                                            onChange={handleChange}
                                        >
                                            <option value="ADDIS_ABABA">Addis Ababa</option>
                                            <option value="OROMIA">Oromia</option>
                                            <option value="AMHARA">Amhara</option>
                                            <option value="TIGRAY">Tigray</option>
                                            <option value="SIDAMA">Sidama</option>
                                            <option value="SOMALI">Somali</option>
                                        </select>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-14 bg-[#ED1C24] hover:bg-black text-white rounded-2xl text-lg font-black shadow-2xl shadow-red-500/20 transition-all flex items-center justify-center gap-2">
                                    Continue <ChevronRight className="h-5 w-5" />
                                </Button>
                            </form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" {...stepVariants}>
                            <div className="space-y-1 mb-8">
                                <h2 className="text-3xl font-black text-black tracking-tighter">Membership Details</h2>
                                <p className="text-black/60 font-black text-xs uppercase tracking-widest">Step 2 of 2</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-black/60">Select Tier</Label>
                                    
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { id: "REGULAR", label: "Annual Member", price: "200 ETB / Yr" },
                                            { id: "LIFE", label: "Life Member", price: "5,000 ETB" },
                                            { id: "CORPORATE", label: "Corporate", price: "10k+ ETB / Yr" }
                                        ].map((type) => (
                                            <div 
                                                key={type.id}
                                                onClick={() => handleTypeSelect(type.id)}
                                                className={cn(
                                                    "cursor-pointer rounded-2xl p-4 transition-all flex items-center justify-between border-2",
                                                    formData.membershipType === type.id 
                                                        ? "border-[#ED1C24] bg-red-50" 
                                                        : "border-transparent bg-gray-50 hover:bg-gray-100"
                                                )}
                                            >
                                                <div className="font-bold text-black">{type.label}</div>
                                                <div className="font-black text-[#ED1C24]">{type.price}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-red-50 p-4 rounded-xl text-xs font-bold text-[#ED1C24]">
                                    Note: You will be redirected to our secure payment gateway to complete your registration.
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <Button type="button" variant="ghost" className="h-14 rounded-xl font-black px-6" onClick={() => setStep(1)}>Back</Button>
                                    <Button type="submit" className="flex-1 h-14 bg-[#ED1C24] hover:bg-black text-white rounded-xl text-lg font-black shadow-2xl shadow-red-500/20 transition-all flex items-center justify-center gap-2">
                                        <CreditCard className="h-5 w-5" /> Pay Now
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
                            className="text-center py-8 space-y-8"
                        >
                            <div className="mx-auto h-24 w-24 bg-green-50 rounded-full flex items-center justify-center shadow-inner">
                                <CheckCircle className="h-12 w-12 text-green-500" strokeWidth={3} />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-4xl font-black text-black tracking-tighter">Welcome Aboard.</h2>
                                <p className="text-black/60 font-medium text-lg leading-relaxed">
                                    Your payment was successful and your membership is active! Check your SMS for your Digital ID.
                                </p>
                            </div>
                            <Link href="/">
                                <Button className="h-16 bg-black hover:bg-[#ED1C24] text-white rounded-2xl px-12 text-lg font-black shadow-2xl transition-all">
                                    Back to Home
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
       </main>

       <footer className="relative z-10 px-6 py-8 text-center">
            <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.3em]"> Ethiopian Red Cross Society · Alleviating Human Suffering </p>
       </footer>
    </div>
  );
}
