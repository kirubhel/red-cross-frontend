"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Save, 
  Star, 
  Check, 
  Settings2,
  Calendar,
  DollarSign,
  Type,
  FileText,
  BadgeInfo,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

type MembershipPlan = {
  id: string;
  name: string;
  short_code: string;
  subscription_type: string;
  counter: number;
  amount: number;
  currency: string;
  description: string;
  icon: string;
  is_featured: boolean;
  plan_features: string;
  is_active: boolean;
};

export default function MembershipPlansPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/config/membership");
      setPlans(res.data.plans || []);
      if (res.data.plans?.length > 0 && !selectedPlan) {
        setSelectedPlan(res.data.plans[0]);
      }
    } catch (err) {
      console.error("Failed to fetch membership plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updates: Partial<MembershipPlan>) => {
    if (!selectedPlan) return;
    const updated = { ...selectedPlan, ...updates };
    setSelectedPlan(updated);
    setPlans(plans.map(p => p.id === updated.id ? updated : p));
  };

  const handleSave = async () => {
    if (!selectedPlan) return;
    setSaving(true);
    try {
      await api.post("/config/membership", { plan: selectedPlan });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchPlans();
    } catch (err) {
      console.error("Failed to save plan:", err);
    } finally {
      setSaving(false);
    }
  };

  const createNewPlan = () => {
    const newPlan: MembershipPlan = {
      id: "",
      name: "New Membership Tier",
      short_code: "NEW_" + Date.now().toString().slice(-4),
      subscription_type: "YEARLY",
      counter: 1,
      amount: 0,
      currency: "ETB",
      description: "Briefly describe the new plan...",
      icon: "ShieldCheck",
      is_featured: false,
      plan_features: "Benefit 1, Benefit 2",
      is_active: true
    };
    setSelectedPlan(newPlan);
    setPlans([newPlan, ...plans]);
  };

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
            <Settings2 className="h-10 w-10 text-gray-200" />
        </motion.div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
            <Layers className="h-3.5 w-3.5" /> Plan Management
          </div>
          <h1 className="text-5xl font-black text-black tracking-tighter">Membership Tiers</h1>
          <p className="text-gray-500 font-medium text-lg">Define subscription cycles, pricing models, and featured benefits.</p>
        </div>

        <Button onClick={createNewPlan} className="bg-black hover:bg-[#ED1C24] text-white rounded-2xl h-14 px-8 font-black shadow-xl shadow-red-500/10 transition-all flex items-center gap-2">
            <Plus className="h-5 w-5" /> Create New Tier
        </Button>
      </div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-10">
        
        {/* Plans List Column */}
        <div className="space-y-5">
           <h3 className="font-black text-black uppercase tracking-widest text-xs px-2">Active Plans</h3>
           <div className="space-y-3">
             <AnimatePresence mode="popLayout">
               {plans.map((plan) => (
                 <motion.div 
                   key={plan.short_code}
                   layout
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   onClick={() => setSelectedPlan(plan)}
                   className={cn(
                     "group cursor-pointer p-6 rounded-[28px] border transition-all relative overflow-hidden",
                     selectedPlan?.short_code === plan.short_code 
                       ? "bg-white border-[#ED1C24] shadow-[0_20px_50px_rgba(237,28,36,0.1)]" 
                       : "bg-gray-50/50 border-gray-100 hover:border-gray-300"
                   )}
                 >
                   {plan.is_featured && (
                      <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#ED1C24] text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl shadow-sm">Featured</div>
                   )}
                   
                   <div className="flex items-center justify-between gap-4">
                     <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{plan.short_code}</div>
                        <h4 className="text-xl font-black text-black tracking-tighter leading-tight">{plan.name}</h4>
                        <div className="flex items-center gap-2 pt-1">
                           <span className="text-sm font-black text-[#ED1C24]">{plan.amount} {plan.currency}</span>
                           <span className="text-[10px] font-bold text-gray-400">/ {plan.subscription_type.toLowerCase()}</span>
                        </div>
                     </div>
                     <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
                        selectedPlan?.short_code === plan.short_code ? "bg-red-50 text-[#ED1C24]" : "bg-gray-100 text-gray-400 group-hover:bg-red-50 group-hover:text-[#ED1C24]"
                     )}>
                        <CreditCard className="h-6 w-6" />
                     </div>
                   </div>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
        </div>

        {/* Editor Column */}
        <AnimatePresence mode="wait">
          {selectedPlan ? (
             <motion.div 
               key={selectedPlan.short_code}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="bg-white rounded-[40px] border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden"
             >
                <div className="p-10 space-y-10">
                   <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
                      <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#ED1C24]">
                         <Settings2 className="h-8 w-8" />
                      </div>
                      <div>
                         <h3 className="text-3xl font-black text-black tracking-tighter">Plan Editor</h3>
                         <p className="text-gray-400 font-medium">Fine-tune the parameters for {selectedPlan.name}.</p>
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                      {/* Basic Info */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            <Type className="h-3 w-3" /> Plan Name
                        </Label>
                        <Input 
                            value={selectedPlan.name} 
                            onChange={(e) => handleUpdate({ name: e.target.value })}
                            className="h-14 rounded-2xl bg-black text-white border-none font-bold text-lg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            <BadgeInfo className="h-3 w-3" /> Short Code (ID)
                        </Label>
                        <Input 
                            value={selectedPlan.short_code} 
                            onChange={(e) => handleUpdate({ short_code: e.target.value })}
                            className="h-14 rounded-2xl bg-black text-white border-none font-bold text-lg uppercase"
                        />
                      </div>

                      {/* Pricing */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            <DollarSign className="h-3 w-3" /> Price Amount
                        </Label>
                        <Input 
                            type="number"
                            value={selectedPlan.amount} 
                            onChange={(e) => handleUpdate({ amount: parseFloat(e.target.value) })}
                            className="h-14 rounded-2xl bg-black text-white border-none font-bold text-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            <Calendar className="h-3 w-3" /> Subscription Type
                        </Label>
                        <select 
                          value={selectedPlan.subscription_type}
                          onChange={(e) => handleUpdate({ subscription_type: e.target.value })}
                          className="flex h-14 w-full rounded-2xl bg-black text-white border-none px-6 py-2 text-lg font-bold focus:ring-1 focus:ring-red-500/10 appearance-none"
                        >
                          <option value="WEEKLY">Weekly</option>
                          <option value="MONTHLY">Monthly</option>
                          <option value="YEARLY">Yearly</option>
                          <option value="ONE_TIME">One-Time (Life)</option>
                        </select>
                      </div>

                      {/* Features & Description */}
                      <div className="space-y-2 md:col-span-2">
                        <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            <FileText className="h-3 w-3" /> Description
                        </Label>
                        <Input 
                            value={selectedPlan.description} 
                            onChange={(e) => handleUpdate({ description: e.target.value })}
                            className="h-14 rounded-2xl bg-black text-white border-none font-bold text-lg"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            <Star className="h-3 w-3" /> Plan Features (Comma-separated)
                        </Label>
                        <textarea 
                            value={selectedPlan.plan_features} 
                            onChange={(e) => handleUpdate({ plan_features: e.target.value })}
                            className="w-full min-h-[100px] rounded-2xl bg-black text-white border-none p-6 font-bold"
                            placeholder="e.g. Benefit A, Benefit B, Benefit C"
                        />
                      </div>

                      {/* Toggles */}
                      <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                         <div className="space-y-1">
                            <div className="font-black text-black">Featured Plan</div>
                            <div className="text-xs font-bold text-gray-400">Highlights this plan during signup.</div>
                         </div>
                         <div 
                           onClick={() => handleUpdate({ is_featured: !selectedPlan.is_featured })}
                           className={cn(
                             "w-14 h-8 rounded-full transition-all cursor-pointer relative shadow-inner",
                             selectedPlan.is_featured ? "bg-[#ED1C24]" : "bg-gray-200"
                           )}
                         >
                           <div className={cn(
                             "absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md",
                             selectedPlan.is_featured ? "left-7" : "left-1"
                           )} />
                         </div>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                         <div className="space-y-1">
                            <div className="font-black text-black">Plan Visibility</div>
                            <div className="text-xs font-bold text-gray-400">Enable or disable this tier entirely.</div>
                         </div>
                         <div 
                           onClick={() => handleUpdate({ is_active: !selectedPlan.is_active })}
                           className={cn(
                             "w-14 h-8 rounded-full transition-all cursor-pointer relative shadow-inner",
                             selectedPlan.is_active ? "bg-green-500" : "bg-gray-200"
                           )}
                         >
                           <div className={cn(
                             "absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md",
                             selectedPlan.is_active ? "left-7" : "left-1"
                           )} />
                         </div>
                      </div>
                   </div>
                </div>
                
                <div className="p-10 border-t border-gray-50 bg-gray-50/30 flex justify-end">
                  <Button 
                      onClick={handleSave} 
                      disabled={saving}
                      className={cn(
                          "h-16 rounded-3xl px-12 font-black transition-all text-xl text-white shadow-2xl flex items-center gap-3",
                          success ? "bg-green-500" : "bg-black hover:bg-[#ED1C24] shadow-red-500/20 active:scale-95"
                      )}
                  >
                      {saving ? "Deploying..." : success ? <><Check className="h-6 w-6" /> Updated Successfully</> : <><Save className="h-6 w-6" /> Save Changes</>}
                  </Button>
                </div>
             </motion.div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] flex flex-col items-center justify-center p-20 text-center space-y-4">
                <CreditCard className="h-12 w-12 text-gray-300" />
                <div className="text-gray-400 font-black uppercase tracking-widest text-xs">Select a plan to edit its details</div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
