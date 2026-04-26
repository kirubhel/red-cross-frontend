"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, AlertCircle, ShieldCheck, User, MapPin, Award, Calendar } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function VerificationPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyMember = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/public/verify?id=${id}`);
        setMember(res.data);
      } catch (err: any) {
        console.error("Verification failed:", err);
        setError(err.response?.data?.error || "Member not found or invalid ID");
      } finally {
        setLoading(false);
      }
    };

    if (id) verifyMember();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Verifying Identity</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-[40px] p-10 text-center shadow-xl border border-red-100">
          <div className="h-20 w-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter mb-2">Verification Failed</h1>
          <p className="text-gray-500 mb-8">{error}</p>
          <a href="/" className="inline-block px-8 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest">
            Back to Portal
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 py-20">
      <div className="max-w-xl w-full space-y-8">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center gap-4 mb-10">
           <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
              <Image src="/logo.jpg" alt="ERCS" width={48} height={48} unoptimized />
           </div>
           <div className="text-center">
              <h2 className="text-lg font-black tracking-tight uppercase">Ethiopia Red Cross Society</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Official Verification Portal</p>
           </div>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-[48px] overflow-hidden shadow-2xl shadow-gray-200 border border-gray-100 relative">
           
           {/* Success Banner */}
           <div className="bg-green-500 p-6 text-white flex items-center justify-center gap-3">
              <CheckCircle2 className="h-6 w-6" />
              <span className="text-sm font-black uppercase tracking-widest">Verified Active Member</span>
           </div>

           <div className="p-10 space-y-10">
              
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center gap-6">
                 <div className="h-40 w-40 rounded-[48px] border-4 border-green-50 overflow-hidden bg-gray-50 shadow-inner relative">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt="Member" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <User className="h-20 w-20" />
                      </div>
                    )}
                 </div>
                 <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter">{member.first_name} {member.father_name}</h1>
                    <p className="text-red-600 font-mono font-bold tracking-tight text-lg">{member.ercs_id}</p>
                 </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-gray-50 p-6 rounded-[32px] space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <MapPin className="h-3 w-3" /> Region
                    </p>
                    <p className="font-black text-gray-900">{member.region_name || "Addis Ababa"}</p>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-[32px] space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <Award className="h-3 w-3" /> Type
                    </p>
                    <p className="font-black text-gray-900">{member.membership_type || "REGULAR"}</p>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-[32px] space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <Calendar className="h-3 w-3" /> Joined
                    </p>
                    <p className="font-black text-gray-900">
                       {member.created_at ? new Date(member.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "N/A"}
                    </p>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-[32px] space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <ShieldCheck className="h-3 w-3" /> Status
                    </p>
                    <p className="font-black text-green-600 uppercase">ACTIVE</p>
                 </div>
              </div>

              {/* Legal Note */}
              <div className="pt-6 border-t border-gray-100 text-center">
                 <p className="text-[9px] text-gray-400 font-medium leading-relaxed italic">
                    This document is a digital representation of the official membership of the Ethiopia Red Cross Society. 
                    Any unauthorized alteration or misuse of this information is strictly prohibited and subject to legal action.
                 </p>
              </div>
           </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
           © {new Date().getFullYear()} Ethiopia Red Cross Society • All Rights Reserved
        </p>

      </div>
    </div>
  );
}
