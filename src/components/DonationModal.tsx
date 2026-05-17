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

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          {/* Scrollable Container */}
          <div className="absolute inset-0 overflow-y-auto py-10 px-4 flex justify-center items-start pointer-events-none">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[28px] shadow-2xl overflow-hidden border border-gray-100 pointer-events-auto my-auto"
            >
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 transition-all z-20 group"
              >
                <X className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {success ? (
                <div className="p-10 text-center space-y-5">
                  <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-inner"
                  >
                      <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <h1 className="text-3xl font-black text-black tracking-tighter">Redirecting...</h1>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">Please wait while we securely connect you to {provider === 'CHAPA' ? 'Chapa' : 'EthSwitch'} to complete your {finalAmount} ETB donation.</p>
                  <div className="flex justify-center gap-2 pb-4">
                      <div className="w-1.5 h-1.5 bg-ercs-red rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-ercs-red rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-ercs-red rounded-full animate-bounce"></div>
                  </div>
                </div>
              ) : (
                <div className="p-6 sm:p-8">
                  <div className="mb-5 space-y-0.5">
                     <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-[#ED1C24] rounded-full text-[8px] font-black uppercase tracking-[0.15em]">
                         <Heart className="h-2 w-2 fill-current" /> Support
                     </div>
                     <h2 className="text-2xl font-black text-black tracking-tighter">
                        Empower <span className="text-ercs-red">Impact</span>
                     </h2>
                  </div>

                  <div className="space-y-5">
                    {/* Amount Selection */}
                    <div className="space-y-3">
                        <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30 ml-1">Choose Amount</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {["50", "100", "500", "1000"].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => { setAmount(val); setCustomAmount(""); }}
                                    className={cn(
                                        "h-12 rounded-xl border font-black transition-all relative overflow-hidden group",
                                        amount === val && !customAmount
                                            ? "bg-black text-white border-black shadow-md scale-[1.02] z-10"
                                            : "bg-gray-50/50 text-gray-500 border-transparent hover:border-gray-200"
                                    )}
                                >
                                    <span className={cn(
                                        "relative z-10 uppercase text-[7px] font-black block",
                                        amount === val && !customAmount ? "text-white opacity-60" : "text-gray-400 opacity-60"
                                    )}>ETB</span>
                                    <span className="relative z-10 text-base">{val}</span>
                                    {amount === val && !customAmount && (
                                        <motion.div 
                                            layoutId="activeAmount-modal" 
                                            className="absolute inset-0 bg-gradient-to-br from-ercs-red to-red-600"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                        
                        <div className="relative group/input">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold tracking-widest text-[8px] z-10 group-focus-within/input:text-black transition-colors uppercase">Custom (ETB)</span>
                            <Input 
                                placeholder="0.00" 
                                className="h-12 pl-24 pr-4 rounded-xl bg-gray-50 border-none font-black text-base text-black focus-visible:ring-1 focus-visible:ring-ercs-red/20 transition-all text-right placeholder:text-gray-200"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                onFocus={() => setAmount("")}
                            />
                        </div>
                    </div>

                    {/* Provider Selection */}
                    <div className="space-y-3">
                        <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30 ml-1">Payment Merchant</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {PAYMENT_METHODS.map((method) => (
                                <div 
                                    key={method.id}
                                    onClick={() => setProvider(method.id)}
                                    className={cn(
                                        "cursor-pointer group relative rounded-xl p-3 border-2 transition-all flex items-center gap-3",
                                        provider === method.id 
                                          ? "bg-white border-black shadow-sm" 
                                          : "bg-gray-50 border-transparent hover:border-gray-100"
                                    )}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1.5 shrink-0 shadow-sm border border-gray-50">
                                        <Image 
                                          src={method.logo} 
                                          alt={method.name} 
                                          width={24} 
                                          height={24} 
                                          className="object-contain"
                                          unoptimized
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={cn(
                                          "font-black text-[13px] tracking-tight leading-none mb-0.5 truncate",
                                          provider === method.id ? "text-black" : "text-gray-600"
                                        )}>{method.name}</h3>
                                        <p className="text-[7px] text-gray-400 font-bold uppercase tracking-widest truncate">{method.description.split(' ')[0]} Payment</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary and Pay */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-100/50">
                           <div className="space-y-0">
                              <span className="text-[8px] font-black uppercase tracking-[0.15em] text-black/30">Total Contribution</span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-black text-black tabular-nums">{finalAmount}</span>
                                <span className="text-xs font-black text-ercs-red">ETB</span>
                              </div>
                           </div>
                           <Shield className="w-4 h-4 text-black/10" />
                        </div>

                        <Button 
                            className="w-full h-14 text-lg font-black bg-ercs-red hover:bg-black rounded-xl shadow-lg shadow-red-500/10 transition-all flex items-center justify-center gap-2 relative overflow-hidden group" 
                            onClick={handleDonate}
                            disabled={loading || !finalAmount}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                   <div className="w-1 h-3 bg-white/20 rounded-full animate-pulse"></div>
                                   <div className="w-1 h-3 bg-white/40 rounded-full animate-pulse [animation-delay:-0.15s] "></div>
                                   <div className="w-1 h-3 bg-white rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                   <span className="text-sm">Processing</span>
                                </div>
                            ) : (
                                <>
                                  <Zap className="h-4 w-4 fill-current text-white/50" />
                                  <span>Donate Now</span>
                                </>
                            )}
                        </Button>

                        <div className="flex items-center justify-center gap-4 text-[7px] font-black uppercase tracking-[0.2em] text-black/30">
                           <div className="flex items-center gap-1">
                              <Shield className="h-2 w-2" /> Secure
                           </div>
                           <div className="w-0.5 h-0.5 bg-black/10 rounded-full"></div>
                           <div className="flex items-center gap-1">
                              <Zap className="h-2 w-2" /> Instant
                           </div>
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
