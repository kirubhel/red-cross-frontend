"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Heart, Shield, Zap, X } from "lucide-react";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = [
  {
    id: "CHAPA",
    name: "Chapa",
    logo: "/images/chapalogo.png",
    description: "Fast and secure local payment provider",
  },
  {
    id: "ETSWITCH",
    name: "EthSwitch",
    logo: "/images/etswitch.png",
    description: "Multi-bank interoperability with local cards",
  }
];

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [amount, setAmount] = useState("100");
  const [customAmount, setCustomAmount] = useState("");
  const [provider, setProvider] = useState("CHAPA");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const finalAmount = customAmount || amount;

  const handleDonate = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      console.log(`Initiating ${finalAmount} ETB via ${provider}`);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 transition-all z-20 group"
            >
              <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {success ? (
              <div className="p-12 text-center space-y-6">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-inner"
                >
                    <CheckCircle2 className="w-12 h-12" />
                </motion.div>
                <h1 className="text-4xl font-black text-black tracking-tighter">Redirecting...</h1>
                <p className="text-gray-500 font-medium">Please wait while we securely connect you to {provider === 'CHAPA' ? 'Chapa' : 'EthSwitch'} to complete your {finalAmount} ETB donation.</p>
                <div className="flex justify-center gap-2 pb-6">
                    <div className="w-2 h-2 bg-ercs-red rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-ercs-red rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-ercs-red rounded-full animate-bounce"></div>
                </div>
              </div>
            ) : (
              <div className="p-6 md:p-8">
                <div className="mb-6 space-y-1">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                       <Heart className="h-2.5 w-2.5 fill-current" /> Impact
                   </div>
                   <h2 className="text-3xl font-black text-black tracking-tighter">
                      Support <span className="text-ercs-red">ERCS</span>
                   </h2>
                </div>

                <div className="space-y-6">
                  {/* Amount Selection */}
                  <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 ml-1">Select Donation Amount</Label>
                      <div className="grid grid-cols-4 gap-3">
                          {["50", "100", "500", "1000"].map((val) => (
                              <button
                                  key={val}
                                  onClick={() => { setAmount(val); setCustomAmount(""); }}
                                  className={cn(
                                      "h-14 rounded-xl border font-black transition-all relative overflow-hidden group",
                                      amount === val && !customAmount
                                          ? "bg-black text-white border-black shadow-lg scale-[1.02] z-10"
                                          : "bg-gray-50/50 text-gray-500 border-transparent hover:border-gray-200"
                                  )}
                              >
                                  <span className={cn(
                                      "relative z-10 uppercase text-[8px] font-black block mb-0.5",
                                      amount === val && !customAmount ? "text-white opacity-60" : "text-gray-400 opacity-60"
                                  )}>ETB</span>
                                  <span className="relative z-10 text-lg">{val}</span>
                                  {amount === val && !customAmount && (
                                      <motion.div 
                                          layoutId="activeAmount-modal" 
                                          className="absolute inset-0 bg-gradient-to-br from-ercs-red to-orange-500"
                                      />
                                  )}
                              </button>
                          ))}
                      </div>
                      
                      <div className="relative group/input">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold tracking-widest text-[9px] z-10 group-focus-within/input:text-black transition-colors uppercase">OTHER Amount (ETB)</span>
                          <Input 
                              placeholder="Amount" 
                              className="h-14 pl-28 pr-6 rounded-2xl bg-gray-50 border-none font-black text-lg text-black focus-visible:ring-1 focus-visible:ring-ercs-red/20 transition-all text-right placeholder:text-gray-200"
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
                                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-2 shrink-0 shadow-sm border border-gray-50">
                                      <Image 
                                        src={method.logo} 
                                        alt={method.name} 
                                        width={32} 
                                        height={32} 
                                        className="object-contain"
                                        unoptimized
                                      />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h3 className={cn(
                                        "font-black text-sm tracking-tight leading-none mb-0.5 truncate",
                                        provider === method.id ? "text-black" : "text-gray-600"
                                      )}>{method.name}</h3>
                                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest truncate">{method.description}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Summary and Pay */}
                  <div className="space-y-4">
                      <div className="flex items-center justify-between px-2 py-2 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                         <div className="space-y-0.5">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Amount</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl font-black text-black tabular-nums">{finalAmount}</span>
                              <span className="text-sm font-black text-ercs-red">ETB</span>
                            </div>
                         </div>
                         <Shield className="w-5 h-5 text-black/5" />
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
                                Initiate Payment
                              </>
                          )}
                      </Button>

                      <div className="flex items-center justify-center gap-4 text-[8px] font-black uppercase tracking-[0.3em] text-black/40">
                         <div className="flex items-center gap-1.5">
                            <Shield className="h-2.5 w-2.5" /> Secure
                         </div>
                         <div className="w-0.5 h-0.5 bg-black/20 rounded-full"></div>
                         <div className="flex items-center gap-1.5">
                            <Zap className="h-2.5 w-2.5" /> Instant
                         </div>
                      </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
