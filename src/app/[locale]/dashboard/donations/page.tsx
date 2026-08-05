"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter, 
  Plus, 
  X,
  TrendingUp,
  Download,
  Calendar,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DonationsPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  
  const [donateForm, setDonateForm] = useState({
    amount: "",
    purpose: "GENERAL", // GENERAL, EMERGENCY, HEALTH
    paymentMethod: "ARIFPAY"
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/donations/my");
      setDonations(res.data.donations || []);
    } catch (err) {
      console.error("Failed to fetch donations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/donations", {
        amount: parseFloat(donateForm.amount),
        purpose: donateForm.purpose,
        payment_method: donateForm.paymentMethod
      });
      const payment = await api.post("/payment/initiate", {
        provider: "ARIFPAY",
        amount: parseFloat(donateForm.amount),
        currency: "ETB",
        email: "donor@redcrosseth.org",
        first_name: "ERCS",
        last_name: "Donor"
      });
      if (!payment.data?.payment_url) {
        throw new Error("ArifPay did not return a payment URL");
      }
      window.location.href = payment.data.payment_url;
    } catch (err) {
      toast.error("Failed to process donation");
    }
  };

  const totalDonated = donations.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Plus className="h-12 w-12 text-[#ED1C24]" strokeWidth={3} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-black">My Donations</h1>
          <p className="text-black/40 font-bold uppercase tracking-widest text-[10px] mt-1">
            Track your contributions to humanitarian causes
          </p>
        </div>
        <Button 
          onClick={() => setIsDonateModalOpen(true)}
          className="bg-[#ED1C24] hover:bg-black text-white px-8 h-14 rounded-2xl font-black tracking-widest uppercase text-xs shadow-xl shadow-red-500/20 transition-all flex items-center gap-2"
        >
          <Heart className="h-4 w-4" /> Make a Donation
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-black rounded-[40px] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-3xl" />
            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-xl border border-white/10">
               <Wallet className="h-6 w-6 text-white" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Lifetime Total</p>
            <div className="flex items-end gap-2">
               <h3 className="text-4xl font-black tracking-tighter">{totalDonated.toLocaleString()}</h3>
               <span className="text-xs font-bold opacity-40 mb-1.5 uppercase">ETB</span>
            </div>
         </div>

         <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
               <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Recent Contribution</p>
            <div className="flex items-end gap-2">
               <h3 className="text-4xl font-black tracking-tighter text-black">
                 {(donations[0]?.amount || 0).toLocaleString()}
               </h3>
               <span className="text-xs font-bold text-gray-400 mb-1.5 uppercase">ETB</span>
            </div>
         </div>

         <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
               <Calendar className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Impact Since</p>
            <h3 className="text-2xl font-black tracking-tighter text-black">
              {donations.length > 0 
                ? new Date(donations[donations.length-1].created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
                : "Join Date"}
            </h3>
         </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between flex-wrap gap-4">
           <h2 className="text-xl font-black tracking-tight">Donation History</h2>
           <div className="flex items-center gap-2">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                 <Input className="h-10 pl-9 w-48 rounded-xl bg-gray-50 border-none text-xs font-bold" placeholder="Search..." />
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl border border-gray-100"><Filter className="h-4 w-4 text-gray-400" /></Button>
              <Button variant="ghost" size="icon" className="rounded-xl border border-gray-100"><Download className="h-4 w-4 text-gray-400" /></Button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Reference / ID</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Purpose</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Method</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                 </tr>
              </thead>
              <tbody>
                 {donations.length > 0 ? (
                   donations.map((d, idx) => (
                     <tr key={d.id} className="border-t border-gray-50 hover:bg-gray-50/30 transition-colors group">
                        <td className="px-8 py-5">
                           <span className="text-xs font-black text-gray-400 group-hover:text-black transition-colors">#{d.id.slice(0, 8).toUpperCase()}</span>
                        </td>
                        <td className="px-8 py-5">
                           <span className="text-xs font-bold text-gray-600">{new Date(d.created_at).toLocaleDateString()}</span>
                        </td>
                        <td className="px-8 py-5">
                           <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-md text-gray-500">
                             {d.purpose || "GENERAL"}
                           </span>
                        </td>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-md overflow-hidden flex items-center justify-center shrink-0 border border-gray-100 bg-white">
                                 <img src="/PaymentProviders/ArifPay.png" alt="ArifPay" className="w-full h-full object-contain p-0.5" />
                              </div>
                              <span className="text-xs font-bold text-gray-600">{d.payment_method || "ArifPay"}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <span className="text-sm font-black text-[#ED1C24]">{d.amount.toLocaleString()} ETB</span>
                        </td>
                     </tr>
                   ))
                 ) : (
                   <tr>
                     <td colSpan={5} className="px-8 py-20 text-center">
                        <p className="text-sm font-bold text-gray-400">No donation records found.</p>
                     </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>

      {/* Donate Modal */}
      <AnimatePresence>
        {isDonateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDonateModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[40px] p-8 shadow-2xl relative z-10 border border-gray-100"
            >
              <button 
                onClick={() => setIsDonateModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>

              <div className="mb-8">
                <h3 className="text-2xl font-black tracking-tighter">Make a Donation</h3>
                <p className="text-sm text-gray-400 font-medium">Your support directly funds life-saving operations.</p>
              </div>

              <form onSubmit={handleDonate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Donation Amount (ETB)</label>
                  <Input 
                    type="number"
                    placeholder="0.00" 
                    className="h-14 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-[#ED1C24]/10 font-black text-xl"
                    value={donateForm.amount}
                    onChange={(e) => setDonateForm({...donateForm, amount: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Select Purpose</label>
                  <div className="grid grid-cols-3 gap-2">
                     {["GENERAL", "EMERGENCY", "HEALTH"].map((p) => (
                       <button
                         key={p}
                         type="button"
                         onClick={() => setDonateForm({...donateForm, purpose: p})}
                         className={cn(
                           "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                           donateForm.purpose === p 
                             ? "bg-[#ED1C24] text-white border-[#ED1C24] shadow-lg shadow-red-500/20" 
                             : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"
                         )}
                       >
                         {p}
                       </button>
                     ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Payment Method</label>
                  <div className="grid grid-cols-1 gap-4">
                     {/* Direct Telebirr and CBE options are disabled; ArifPay presents supported methods at checkout. */}
                     <div className="flex items-center gap-3 p-4 rounded-2xl border bg-red-50 border-red-200">
                        <div className="h-10 w-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-gray-100 bg-white">
                           <img src="/PaymentProviders/ArifPay.png" alt="ArifPay" className="w-full h-full object-contain p-1" />
                        </div>
                        <span className="text-sm font-black text-[#ED1C24]">ArifPay</span>
                     </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all">
                   Confirm Donation
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
