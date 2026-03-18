"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  User, 
  ChevronRight,
  Plus,
  Eye,
  EyeOff
} from "lucide-react";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Demo admin bypass
    if (email.toLowerCase().includes("admin") || password === "admin") {
      setTimeout(() => {
        localStorage.setItem("token", "mock-admin-token");
        localStorage.setItem("user_role", "ADMIN"); 
        router.push("/admin");
      }, 1000);
      return;
    }

    try {
      const res = await api.post("/auth/login", { identifier: email, password });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user_role", res.data.role); 
      
      if (res.data.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setError("Those credentials don't look right. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center p-6 md:p-12 gap-16">
        
        {/* Brand Side (Visible on Desktop) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col flex-1 space-y-12"
        >
          <Link href="/" className="inline-flex items-center gap-2 group text-black/40 hover:text-black transition-colors font-black uppercase tracking-widest text-xs">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to home
          </Link>
          
          <div className="space-y-6">
            <div className="bg-[#ED1C24] p-4 rounded-3xl w-fit shadow-2xl shadow-red-500/20">
              <Plus className="h-12 w-12 text-white" strokeWidth={6} />
            </div>
            <h1 className="text-6xl font-black text-black leading-[0.9] tracking-tighter">
              Manage Your <br />
              <span className="text-[#ED1C24]">Mission.</span>
            </h1>
            <p className="text-xl text-black/60 font-medium max-w-md">
              Access the Ethiopia Red Cross Society internal portal to manage volunteers, memberships, and humanitarian impact.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="space-y-3">
              <ShieldCheck className="h-8 w-8 text-[#ED1C24]" />
              <h4 className="font-black uppercase tracking-widest text-[#ED1C24] text-xs">Secure Access</h4>
              <p className="text-sm text-black/60 font-bold">Industry standard encryption for all data.</p>
            </div>
            <div className="space-y-3">
              <Lock className="h-8 w-8 text-[#ED1C24]" />
              <h4 className="font-black uppercase tracking-widest text-[#ED1C24] text-xs">Internal Portal</h4>
              <p className="text-sm text-black/60 font-bold">Authorized personnel and volunteers only.</p>
            </div>
          </div>
        </motion.div>

        {/* Login Form Side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[480px]"
        >
          <div className="bg-white p-8 md:p-12 rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col">
            <div className="lg:hidden flex justify-center mb-8">
               <Image src="/logo.jpg" alt="ERCS Logo" width={80} height={80} className="object-contain" />
            </div>

            <div className="space-y-2 mb-10 text-center lg:text-left">
              <h2 className="text-4xl font-black text-black tracking-tighter">Welcome back.</h2>
              <p className="text-black/60 font-black text-xs uppercase tracking-widest">Sign in to your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest ml-1 text-black/60">Identifier</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40" />
                    <Input
                      id="email"
                      type="text"
                      placeholder="Email or Volunteer ID"
                      className="h-16 pl-12 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-[#ED1C24]/10 transition-all font-bold text-lg placeholder:text-black/30"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center ml-1">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-black/60">Password</Label>
                    <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] hover:opacity-60 transition-opacity">Forgot?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-16 pl-12 pr-12 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-[#ED1C24]/10 transition-all font-bold text-lg placeholder:text-black/30"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-[#ED1C24] p-4 rounded-xl text-sm font-bold text-center border border-red-100"
                >
                  {error}
                </motion.div>
              )}

              <Button 
                type="submit" 
                className="w-full h-16 bg-[#ED1C24] hover:bg-black text-white rounded-2xl text-xl font-black shadow-2xl shadow-red-500/20 transition-all active:scale-95 group overflow-hidden relative"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Plus className="h-5 w-5" />
                    </motion.div>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <p className="text-sm font-bold text-black/40">
                New to the system? <Link href="/join" className="text-[#ED1C24] hover:underline font-black">Join as a volunteer</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute top-20 right-[-5%] w-64 h-64 border-[40px] border-red-50/30 rounded-full opacity-20 pointer-events-none" />
      <div className="absolute bottom-20 left-[-5%] w-64 h-64 border-[40px] border-red-50/30 rounded-full opacity-20 pointer-events-none" />
    </div>
  );
}
