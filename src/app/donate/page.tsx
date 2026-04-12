"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, Heart, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = [
  {
    id: "CHAPA",
    name: "Chapa",
    logo: "/images/chapalogo.png",
    description: "Fast and secure local payment provider",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    activeColor: "ring-emerald-500 border-emerald-500 bg-emerald-50/50"
  },
  {
    id: "ETSWITCH",
    name: "EthSwitch",
    logo: "/images/etswitch.png",
    description: "Multi-bank interoperability with local cards",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    activeColor: "ring-blue-500 border-blue-500 bg-blue-50/50"
  }
];

export default function DonatePage() {
  const [amount, setAmount] = useState("100");
  const [customAmount, setCustomAmount] = useState("");
  const [provider, setProvider] = useState("CHAPA");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const finalAmount = customAmount || amount;

  const handleDonate = async () => {
    setLoading(true);
    // Simulate API logic
    setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        // In a real app, this would redirect
        console.log(`Initialting ${finalAmount} ETB via ${provider}`);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6 max-w-sm"
        >
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-black text-black tracking-tighter">Redirecting...</h1>
            <p className="text-gray-500 font-medium">Please wait while we securely connect you to {provider === 'CHAPA' ? 'Chapa' : 'EthSwitch'} to complete your {finalAmount} ETB donation.</p>
            <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-ercs-red rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-ercs-red rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-ercs-red rounded-full animate-bounce"></div>
            </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
       {/* High-end decorative background */}
       <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-50 rounded-full blur-[120px] opacity-30" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[120px] opacity-20" />
       </div>

       <header className="relative z-10 px-6 py-4 md:px-12 flex justify-between items-center bg-white/10 backdrop-blur-sm border-b border-gray-50">
            <Link href="/" className="group flex items-center gap-2 text-black/40 hover:text-black transition-colors font-black uppercase tracking-widest text-[10px]">
                 <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
                <Image src="/logo.jpg" alt="ERCS" width={24} height={24} />
              </div>
              <span className="text-lg font-black text-black tracking-tighter uppercase">ERCS</span>
            </div>
       </header>

       <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-6">
         <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
         >
            <div className="text-center mb-6 space-y-2">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                   <Heart className="h-2.5 w-2.5 fill-current" /> Impact
               </div>
               <h1 className="text-4xl font-black text-black leading-tight tracking-tighter">
                  Make a <span className="text-ercs-red">Humanitarian Impact.</span>
               </h1>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] border border-gray-50 relative overflow-hidden group">
                <div className="p-0 space-y-6">
                    {/* Amount Selection */}
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 ml-1">Select Donation Amount</Label>
                        <div className="grid grid-cols-4 gap-3">
                            {["50", "100", "500", "1000"].map((val, idx) => (
                                <button
                                    key={val}
                                    onClick={() => { setAmount(val); setCustomAmount(""); }}
                                    className={cn(
                                        "h-16 rounded-xl border font-black text-lg transition-all relative overflow-hidden group",
                                        amount === val && !customAmount
                                            ? "bg-black text-white border-black shadow-lg scale-[1.02] z-10"
                                            : "bg-gray-50/50 text-gray-500 border-transparent hover:border-gray-200"
                                    )}
                                >
                                    <span className={cn(
                                        "relative z-10 uppercase text-[8px] font-black block mb-0.5",
                                        amount === val && !customAmount ? "text-white opacity-60" : "text-gray-400 opacity-60"
                                    )}>ETB</span>
                                    <span className="relative z-10 text-xl">{val}</span>
                                    {amount === val && !customAmount && (
                                        <motion.div 
                                            layoutId="activeAmount" 
                                            className="absolute inset-0 bg-gradient-to-br from-ercs-red to-orange-500"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                        
                        <div className="relative group/input">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold tracking-widest text-[10px] z-10 group-focus-within/input:text-black transition-colors uppercase">OTHER Amount (ETB)</span>
                            <Input 
                                placeholder="Enter custom amount" 
                                className="h-16 pl-32 pr-6 rounded-2xl bg-gray-50 border-none font-black text-xl focus-visible:ring-1 focus-visible:ring-ercs-red/20 transition-all text-right placeholder:text-gray-200"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                onFocus={() => setAmount("")}
                            />
                        </div>
                    </div>

                    {/* Provider Selection */}
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 ml-1">Payment Merchant</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {PAYMENT_METHODS.map((method) => (
                                <div 
                                    key={method.id}
                                    onClick={() => setProvider(method.id)}
                                    className={cn(
                                        "cursor-pointer group relative rounded-2xl p-4 border-2 transition-all flex items-center gap-4",
                                        provider === method.id 
                                          ? "bg-white border-black shadow-md" 
                                          : "bg-gray-50 border-transparent hover:border-gray-100"
                                    )}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2 shrink-0 shadow-sm">
                                        <Image 
                                          src={method.logo} 
                                          alt={method.name} 
                                          width={40} 
                                          height={40} 
                                          className="object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={cn(
                                          "font-black text-base tracking-tight leading-none mb-0.5 truncate",
                                          provider === method.id ? "text-black" : "text-gray-600"
                                        )}>{method.name}</h3>
                                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest truncate">{method.description}</p>
                                    </div>
                                    {provider === method.id && (
                                        <div className="absolute top-2 right-2">
                                            <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary and Pay */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2 py-2 bg-gray-50/50 rounded-2xl border border-gray-50">
                           <div className="space-y-0.5">
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/20">Recipient Amount</span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black text-black tabular-nums">{finalAmount}</span>
                                <span className="text-lg font-black text-ercs-red">ETB</span>
                              </div>
                           </div>
                           <Shield className="w-6 h-6 text-black/5" />
                        </div>

                        <Button 
                            className="w-full h-16 text-xl font-black bg-ercs-red hover:bg-black rounded-2xl shadow-xl shadow-red-500/5 transition-all flex items-center justify-center gap-2 relative overflow-hidden group" 
                            onClick={handleDonate}
                            disabled={loading || !finalAmount}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                   <div className="w-1 h-4 bg-white/20 rounded-full animate-pulse"></div>
                                   <div className="w-1 h-4 bg-white/40 rounded-full animate-pulse [animation-delay:-0.15s] "></div>
                                   <div className="w-1 h-4 bg-white rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                   <span>Processing</span>
                                </div>
                            ) : (
                                <>
                                  <Zap className="h-5 w-5 fill-current text-white/50" />
                                  Donate {finalAmount} ETB
                                </>
                            )}
                        </Button>

                        <div className="flex items-center justify-center gap-4 text-[8px] font-black uppercase tracking-[0.3em] text-black/10">
                           <div className="flex items-center gap-1.5 line-clamp-1 truncate">
                              <Shield className="h-2.5 w-2.5" /> Secure
                           </div>
                           <div className="w-0.5 h-0.5 bg-black/5 rounded-full"></div>
                           <div className="flex items-center gap-1.5">
                              <Zap className="h-2.5 w-2.5" /> Instant
                           </div>
                        </div>
                    </div>
                </div>
            </div>
         </motion.div>
       </main>

       <footer className="relative z-10 px-6 py-4 text-center border-t border-gray-50 bg-white/50 backdrop-blur-sm">
            <p className="text-[8px] font-black text-black/10 uppercase tracking-[0.4em]"> Ethiopian Red Cross Society · 1935 - 2026 </p>
       </footer>
    </div>
  );
}

