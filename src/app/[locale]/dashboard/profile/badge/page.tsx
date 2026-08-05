"use client";

import { useState, useEffect, useRef } from "react";
import { ShieldCheck, Download, QrCode, UserCheck, Calendar, Award } from "lucide-react";

export default function DigitalBadgePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/v1/volunteer/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile || data);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-red-600" /> Digital Credential & Badge
          </h1>
          <p className="text-sm text-gray-500">Official Ethiopian Red Cross Society Volunteer Verification Badge.</p>
        </div>
        <button
          onClick={handlePrint}
          className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-red-700 transition print:hidden"
        >
          <Download className="h-4 w-4" /> Print / Save ID Card
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center text-gray-500 text-sm">
          Loading digital badge...
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center pt-4">
          {/* Printable Card */}
          <div
            ref={badgeRef}
            className="w-full max-w-md bg-gradient-to-br from-red-700 via-red-600 to-red-800 text-white rounded-3xl shadow-2xl overflow-hidden border border-red-500/30 p-6 relative space-y-6"
          >
            {/* Background Branding Overlay */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-red-600 text-xl shadow-md">
                  +
                </div>
                <div>
                  <h2 className="font-extrabold text-sm tracking-wide uppercase">Ethiopian Red Cross</h2>
                  <p className="text-[10px] text-red-100 font-medium">Volunteers & Members Network</p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                VERIFIED
              </span>
            </div>

            {/* Card Body */}
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-2xl bg-white/10 border-2 border-white/30 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                {profile?.photo_url ? (
                  <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserCheck className="h-12 w-12 text-white/70" />
                )}
              </div>
              <div className="space-y-1 overflow-hidden">
                <h3 className="font-bold text-lg leading-tight truncate">
                  {profile?.first_name || "Volunteer"} {profile?.last_name || "Member"}
                </h3>
                <p className="text-xs text-red-100 font-mono">
                  ID: {profile?.ercs_id || `ERCS-${profile?.id?.slice(0, 8)?.toUpperCase() || "2026-VAL"}`}
                </p>
                <div className="pt-1 flex flex-wrap gap-1">
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-medium">
                    {profile?.status || "ACTIVE"} VOLUNTEER
                  </span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-medium">
                    REGION {profile?.region || "HQ"}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code & Validity Footer */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/20 flex items-center justify-between backdrop-blur-md">
              <div className="space-y-1">
                <div className="text-[10px] text-red-100 uppercase tracking-wider font-semibold">Valid Thru</div>
                <div className="text-xs font-mono font-bold flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> DEC 31, 2026
                </div>
                <div className="text-[9px] text-red-200 pt-1">Scan QR code for live registry check.</div>
              </div>

              {/* QR Code Placeholder Representation */}
              <div className="w-16 h-16 bg-white p-1 rounded-xl shadow-lg flex items-center justify-center shrink-0">
                <QrCode className="h-14 w-14 text-gray-900" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
