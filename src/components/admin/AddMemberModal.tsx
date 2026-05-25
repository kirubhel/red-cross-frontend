"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { toast } from "sonner";

interface Region {
  id: number;
  name: string;
  code: string;
}

interface AddMemberModalProps {
  onClose: () => void;
  onSuccess: () => void;
  regions: Region[];
}

export function AddMemberModal({ onClose, onSuccess, regions }: AddMemberModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    father_name: "",
    grandfather_name: "",
    email: "",
    phone_number: "",
    national_id: "",
    gender: "MALE",
    region: "1",
    membership_type: "REGULAR",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Map region integer to proto enum format
      const regionId = parseInt(formData.region) || 1;
      const regionMap: Record<number, string> = {
        1: "REGION_addis_ababa",
        2: "REGION_dire_dawa",
        3: "REGION_tigray",
        4: "REGION_afar",
        5: "REGION_amhara",
        6: "REGION_oromia",
        7: "REGION_somali",
        8: "REGION_benishangul_gumz",
        9: "REGION_central_ethiopia",
        10: "REGION_gambela",
        11: "REGION_harari",
        12: "REGION_sidama",
        13: "REGION_south_west_ethiopia",
        14: "REGION_south_ethiopia"
      };

      const payload = {
        ...formData,
        region: regionMap[regionId] || "REGION_unspecified",
        metadata: "{}"
      };
      
      console.log("Submitting payload:", payload);
      await api.post("/person", payload);
      toast.success("Member added successfully");
      onSuccess();
    } catch (err: any) {
      console.error("Failed to add member:", err.response?.data || err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || "Failed to add member. Please check your network or token.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-gray-50 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-black">Add New Member</h2>
            <p className="text-xs font-bold text-gray-400">Fill in the member details to register them in the system.</p>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-gray-50 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="add-member-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">First Name *</label>
                <Input
                  required
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Father Name *</label>
                <Input
                  required
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleChange}
                  placeholder="Father Name"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Grandfather Name</label>
                <Input
                  name="grandfather_name"
                  value={formData.grandfather_name}
                  onChange={handleChange}
                  placeholder="Grandfather Name"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">National ID</label>
                <Input
                  name="national_id"
                  value={formData.national_id}
                  onChange={handleChange}
                  placeholder="National ID"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Phone Number *</label>
                <Input
                  required
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="+251..."
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-lg bg-white text-black border border-gray-200 font-bold text-xs focus:border-[#ED1C24] transition-all outline-none appearance-none"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Region</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-lg bg-white text-black border border-gray-200 font-bold text-xs focus:border-[#ED1C24] transition-all outline-none appearance-none"
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Membership Type</label>
                <select
                  name="membership_type"
                  value={formData.membership_type}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-lg bg-white text-black border border-gray-200 font-bold text-xs focus:border-[#ED1C24] transition-all outline-none appearance-none"
                >
                  <option value="REGULAR">Regular</option>
                  <option value="INDIVIDUAL_LIFETIME">Lifetime</option>
                  <option value="YOUTH">Youth</option>
                  <option value="CORP_REGULAR">Corp Regular</option>
                  <option value="CORP_HIGH">Corp High</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-50 flex gap-3 shrink-0 bg-gray-50/50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest border-gray-200 bg-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-member-form"
            disabled={loading}
            className="flex-1 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest bg-[#ED1C24] text-white shadow-xl shadow-red-500/20 hover:bg-red-600"
          >
            {loading ? "Adding..." : "Add Member"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
