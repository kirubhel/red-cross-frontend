"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  CheckCircle, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Copy, 
  Check, 
  QrCode,
  KeyRound,
  ChevronRight
} from "lucide-react";
import Header from "@/components/layout/Header";
import PhoneNumberInput, { buildFullPhoneNumber } from "@/components/ui/phone-number-input";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Enter Phone, 2: Enter OTP & New Password, 3: Success Card
  const [country, setCountry] = useState("ET");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("123456");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [recoveredErcsId, setRecoveredErcsId] = useState("");
  const [copied, setCopied] = useState(false);

  const fullPhone = buildFullPhoneNumber(country, phoneNumber);

  // Step 1: Request OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.post("/public/forgot-password/request-otp", {
        phone_number: fullPhone
      });

      if (res.data?.success) {
        setSuccessMsg(res.data.message || "OTP code sent successfully!");
        if (res.data?.ercs_id) {
          setRecoveredErcsId(res.data.ercs_id);
        }
        setStep(2);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || "Account not found for this phone number.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Update Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError("Please enter the 6-digit verification OTP code.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.post("/public/forgot-password/reset-password", {
        phone_number: fullPhone,
        otp: otp,
        new_password: newPassword
      });

      if (res.data?.success) {
        if (res.data.ercs_id) {
          setRecoveredErcsId(res.data.ercs_id);
        }
        setStep(3);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || "Failed to reset password. Please check your OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden text-left">
      <Header minimal={true} />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-xl">
          
          {/* Header Back Button */}
          <div className="mb-6">
            <Link href="/login" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black/40 hover:text-[#ED1C24] transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white p-8 rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-gray-100"
          >
            <div className="text-left mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-widest mb-3">
                <KeyRound className="h-3 w-3" /> Account Recovery
              </div>
              <h1 className="text-3xl font-black text-black tracking-tight uppercase">
                Forgot Password & Member ID
              </h1>
              <p className="text-xs text-black/60 font-medium mt-1">
                Enter your registered phone number to receive an OTP code, reset your password, and view your Member ID.
              </p>
              <div className="mt-4 h-1 w-12 bg-[#ED1C24] rounded-full" />
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1: Enter Phone Number */}
              {step === 1 && (
                <motion.form 
                  key="step1" 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleRequestOTP} 
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black/60 ml-1">
                      Registered Phone Number <span className="text-[#ED1C24]">*</span>
                    </Label>
                    <PhoneNumberInput
                      countryCode={country}
                      onCountryChange={(code) => {
                        setCountry(code);
                        setPhoneNumber("");
                      }}
                      localNumber={phoneNumber}
                      onLocalNumberChange={(val) => setPhoneNumber(val)}
                      required
                    />
                    <p className="text-[10px] font-bold text-black/40 ml-1">
                      We will send a 6-digit OTP code to verify ownership of this number.
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-[#ED1C24] p-4 rounded-2xl text-xs font-bold text-center border border-red-100 italic">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 bg-[#ED1C24] hover:bg-black text-white rounded-2xl text-base font-black shadow-lg shadow-red-500/15 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    {loading ? "Verifying Phone..." : "Send OTP Verification Code"}
                  </Button>
                </motion.form>
              )}

              {/* STEP 2: Enter OTP & New Password */}
              {step === 2 && (
                <motion.form 
                  key="step2" 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleResetPassword} 
                  className="space-y-6"
                >
                  <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-xs font-bold border border-green-100 flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    <div>
                      <div>{successMsg}</div>
                      <div className="text-[10px] opacity-75 mt-0.5">Use OTP code: <span className="font-black underline">123456</span></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-[10px] font-black uppercase tracking-widest text-black/60 ml-1">
                      6-Digit OTP Code <span className="text-[#ED1C24]">*</span>
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="h-14 text-center font-black text-xl tracking-[0.4em] bg-gray-50 border-none rounded-2xl text-black"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-[10px] font-black uppercase tracking-widest text-black/60 ml-1">
                        New Password <span className="text-[#ED1C24]">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="h-12 pl-4 pr-10 rounded-xl bg-gray-50 border-none font-bold text-sm text-black"
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-black/60 ml-1">
                        Confirm Password <span className="text-[#ED1C24]">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="h-12 pl-4 pr-10 rounded-xl bg-gray-50 border-none font-bold text-sm text-black"
                          required
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black">
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-[#ED1C24] p-4 rounded-2xl text-xs font-bold text-center border border-red-100 italic">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setStep(1)} 
                      disabled={loading}
                      className="h-14 font-black px-6 text-black/40 hover:text-black"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="flex-1 h-14 bg-[#ED1C24] hover:bg-black text-white rounded-2xl text-base font-black shadow-lg shadow-red-500/15 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      {loading ? "Resetting Password..." : "Verify OTP & Reset Password"}
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* STEP 3: Success & Member ID Display */}
              {step === 3 && (
                <motion.div 
                  key="step3" 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center py-4"
                >
                  <div className="mx-auto h-20 w-20 bg-green-50 rounded-[32px] flex items-center justify-center shadow-inner relative">
                    <CheckCircle className="h-10 w-10 text-green-500" strokeWidth={3} />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-black tracking-tight uppercase">Password Updated!</h2>
                    <p className="text-black/60 font-bold text-sm max-w-sm mx-auto">
                      Your password has been successfully reset. You can now log in using your Member ID or phone number.
                    </p>
                  </div>

                  {/* ERCS Member ID Card */}
                  {recoveredErcsId && (
                    <div className="bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white rounded-[28px] p-6 text-left shadow-2xl relative overflow-hidden border border-white/10 my-6">
                      <div className="absolute top-0 right-0 p-6 opacity-10">
                        <ShieldCheck className="h-32 w-32 text-white" />
                      </div>
                      
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-[#ED1C24] flex items-center justify-center font-black text-white text-xs">
                              ✚
                            </div>
                            <span className="text-[10px] font-black tracking-widest text-white/60 uppercase">Official Member ID</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => copyToClipboard(recoveredErcsId)} 
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold text-white transition-all border border-white/10"
                          >
                            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                            {copied ? "Copied!" : "Copy ID"}
                          </button>
                        </div>

                        <div className="space-y-1 pt-2">
                          <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">Member ID Number</div>
                          <div className="text-2xl font-black tracking-wider text-[#ED1C24] font-mono">
                            {recoveredErcsId}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-bold text-white/60">
                          <span>Phone: {fullPhone}</span>
                          <QrCode className="h-6 w-6 text-white/30" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button 
                      type="button" 
                      onClick={() => router.push(`/login?identifier=${encodeURIComponent(recoveredErcsId || fullPhone)}`)}
                      className="w-full h-14 bg-[#ED1C24] hover:bg-black text-white rounded-2xl text-base font-black shadow-lg shadow-red-500/15 transition-all flex items-center justify-center gap-2"
                    >
                      Log In to Portal Now <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 px-6 py-8 text-center border-t border-gray-50 mt-10">
        <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.4em]">
          Ethiopian Red Cross Society · Alleviating Human Suffering Since 1935
        </p>
      </footer>
    </div>
  );
}
