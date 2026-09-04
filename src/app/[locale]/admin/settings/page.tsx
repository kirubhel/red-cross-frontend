"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, Check, RefreshCw, Hash, ShieldAlert, MapPin, Map, Globe, Plus, Trash2, Edit3, MessageCircle, ShieldCheck, Key, Smartphone, Copy, CheckCircle2, MessageSquare, Send, Radio } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import api from "@/lib/api";
import { SuperAdminGuard } from "@/components/admin/SuperAdminGuard";

type MemberIDConfig = {
  prefix: string;
  padding: number;
  useRegionCode?: boolean;
  useZoneCode?: boolean;
};

export type VolunteerRatesConfig = {
  dailyRatePerVolunteer: number;
  accommodationDailyCost: number;
  mealDailyCost: number;
  transportAllowance: number;
  insuranceFeePerVolunteer: number;
  minMissionDays: number;
  adminFeePercent: number;
};

type Region = {
  id: number;
  name: string;
  code: string;
};

type Zone = {
  id: string; // generated
  region_id: number;
  name: string;
  code: string;
};

type Woreda = {
  id: string;
  zone_id: string;
  name: string;
  code: string;
};

type LocationHierarchy = {
  zones: Zone[];
  woredas: Woreda[];
};

export default function SystemSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"id" | "volunteer_rates" | "regions" | "zones" | "woredas" | "assets" | "system" | "security">("id");
  
  const [regions, setRegions] = useState<Region[]>([]);
  const [locationHierarchy, setLocationHierarchy] = useState<LocationHierarchy>({ zones: [], woredas: [] });
  
  // Filtering states
  const [zoneRegionFilter, setZoneRegionFilter] = useState<number | "all">("all");
  const [woredaRegionFilter, setWoredaRegionFilter] = useState<number | "all">("all");
  const [woredaZoneFilter, setWoredaZoneFilter] = useState<string | "all">("all");
  
  const [memberConfig, setMemberConfig] = useState<MemberIDConfig>({
    prefix: "ERCS-",
    padding: 6,
    useRegionCode: true,
    useZoneCode: true,
  });

  const [volunteerRates, setVolunteerRates] = useState<VolunteerRatesConfig>({
    dailyRatePerVolunteer: 500,
    accommodationDailyCost: 350,
    mealDailyCost: 250,
    transportAllowance: 150,
    insuranceFeePerVolunteer: 50,
    minMissionDays: 1,
    adminFeePercent: 5
  });

  const [idAssets, setIdAssets] = useState({
    stampUrl: "",
    signature1Url: "",
    signature2Url: "",
  });

  const [systemConfig, setSystemConfig] = useState({
    smsToken: "************************************",
    smsApiUrl: "https://api.geezsms.com/api/v1/sms/send",
    whatsappToken: "************************************",
    whatsappApiUrl: "https://graph.facebook.com/v21.0/528356777028058/messages",
    telegramToken: "************************************",
    serverUiPort: "4200",
    serverApiPort: "5267",
    serverPaymentPort: "8080",
    serverIp: "138.201.190.62"
  });

  // 2FA Setup states
  const [currentUserId, setCurrentUserId] = useState("");
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [mfaSetup, setMfaSetup] = useState<{ secret: string; qrCodeUrl: string } | null>(null);
  const [mfaMethod, setMfaMethod] = useState<"SMS" | "APP">("SMS");
  const [setupCode, setSetupCode] = useState("");
  const [setupSuccess, setSetupSuccess] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [sendingSmsOtp, setSendingSmsOtp] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentAssetKey, setCurrentAssetKey] = useState<string | null>(null);

  const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentAssetKey) return;

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("file", file);
      
      // Use the general storage upload endpoint
      const res = await api.post("/storage/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      if (res.data.url) {
        setIdAssets(prev => ({ ...prev, [currentAssetKey]: res.data.url }));
        // Reset input
        e.target.value = '';
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload asset. Please try again.");
    } finally {
      setSaving(false);
      setCurrentAssetKey(null);
    }
  };

  const triggerUpload = (key: string) => {
    setCurrentAssetKey(key);
    fileInputRef.current?.click();
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch system settings and current user profile in parallel
      const [res, meRes] = await Promise.allSettled([
        api.get("/system-settings"),
        api.get("/auth/me")
      ]);

      if (res.status === "fulfilled") {
        const settings = res.value.data.settings || {};

        if (settings.member_id_config) {
          setMemberConfig(JSON.parse(settings.member_id_config));
        }

        if (settings.volunteer_rates) {
          try {
            setVolunteerRates(JSON.parse(settings.volunteer_rates));
          } catch (_) {}
        }

        if (settings.id_assets) {
          setIdAssets(JSON.parse(settings.id_assets));
        }

        if (settings.system_config) {
          setSystemConfig(JSON.parse(settings.system_config));
        }

        if (settings.all_regions) {
          setRegions(JSON.parse(settings.all_regions));
        }

        if (settings.locations_hierarchy) {
          setLocationHierarchy(JSON.parse(settings.locations_hierarchy));
        }
      }

      if (meRes.status === "fulfilled" && meRes.value.data) {
        setIs2faEnabled(!!meRes.value.data.is_mfa_enabled);
        if (meRes.value.data.id) {
          setCurrentUserId(meRes.value.data.id);
        }
        if (meRes.value.data.phone_number) {
          setUserPhone(meRes.value.data.phone_number);
        }
      }

    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const startMfaSetup = async () => {
    try {
      setSetupLoading(true);
      const res = await api.post("/auth/setup-mfa");
      setMfaSetup({
        secret: res.data.secret,
        qrCodeUrl: res.data.qr_code_url
      });
      if (res.data.phone_number) {
        setUserPhone(res.data.phone_number);
      }
      setSmsSent(false);
    } catch (err) {
      console.error("MFA Setup failed", err);
      alert("Failed to initialize 2FA setup.");
    } finally {
      setSetupLoading(false);
    }
  };

  const sendSmsVerification = async () => {
    if (!mfaSetup?.secret) return;
    try {
      setSendingSmsOtp(true);
      await api.post("/auth/mfa/send-otp", { 
        user_id: currentUserId,
        secret: mfaSetup.secret 
      });
      setSmsSent(true);
    } catch (err: any) {
      console.error("Failed to send SMS OTP", err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      alert(`Failed to send SMS verification code: ${serverMsg}`);
    } finally {
      setSendingSmsOtp(false);
    }
  };

  const disableMfa = async () => {
    if (!confirm("Are you sure you want to disable Two-Factor Authentication (2FA) for your account?")) return;
    try {
      setSetupLoading(true);
      await api.post("/auth/mfa/disable");
      setIs2faEnabled(false);
      setSetupSuccess(false);
      setMfaSetup(null);
      alert("Two-Factor Authentication has been disabled.");
    } catch (err) {
      console.error("Failed to disable MFA", err);
      alert("Failed to disable 2FA.");
    } finally {
      setSetupLoading(false);
    }
  };

  const verifyMfaSetup = async () => {
    try {
      setSetupLoading(true);
      if (!mfaSetup) return;

      const res = await api.post("/auth/verify-mfa", { 
        code: setupCode,
        secret: mfaSetup.secret
      });

      if (res.data.success) {
        setSetupSuccess(true);
        setIs2faEnabled(true);
        setMfaSetup(null);
        setSetupCode("");
      } else {
        alert("Invalid code. Please try again.");
      }
    } catch (err) {
      console.error("MFA Verification failed", err);
      alert("Verification failed. Please double check the 6-digit code.");
    } finally {
      setSetupLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      setSaving(true);
      setSuccess(false);
      
      // Save all configs in parallel
      await Promise.all([
        api.post("/system-settings", {
          key: "member_id_config",
          value_json: JSON.stringify(memberConfig),
        }),
        api.post("/system-settings", {
          key: "volunteer_rates",
          value_json: JSON.stringify(volunteerRates),
        }),
        api.post("/system-settings", {
          key: "locations_hierarchy",
          value_json: JSON.stringify(locationHierarchy),
        }),
        api.post("/system-settings", {
          key: "id_assets",
          value_json: JSON.stringify(idAssets),
        }),
        api.post("/system-settings", {
          key: "system_config",
          value_json: JSON.stringify(systemConfig),
        })
      ]);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const updateRegionCode = async (region: Region) => {
    try {
      await api.post("/system-settings", {
        key: "region_update",
        value_json: JSON.stringify(region),
      });
      fetchInitialData();
    } catch (err) {
      console.error("Failed to update region:", err);
    }
  };

  const addZone = () => {
    const defaultRegionId = zoneRegionFilter !== "all" ? zoneRegionFilter : (regions[0]?.id || 1);
    const newZone: Zone = {
      id: Math.random().toString(36).substr(2, 9),
      region_id: defaultRegionId,
      name: "New Zone",
      code: "Z00"
    };
    setLocationHierarchy({ ...locationHierarchy, zones: [...locationHierarchy.zones, newZone] });
  };

  const addWoreda = () => {
    if (locationHierarchy.zones.length === 0) return;
    
    let defaultZoneId = locationHierarchy.zones[0].id;
    if (woredaZoneFilter !== "all") {
      defaultZoneId = woredaZoneFilter;
    } else if (woredaRegionFilter !== "all") {
      const regionZones = locationHierarchy.zones.filter(z => z.region_id === woredaRegionFilter);
      if (regionZones.length > 0) {
        defaultZoneId = regionZones[0].id;
      }
    }

    const newWoreda: Woreda = {
      id: Math.random().toString(36).substr(2, 9),
      zone_id: defaultZoneId,
      name: "New Woreda",
      code: "W00"
    };
    setLocationHierarchy({ ...locationHierarchy, woredas: [...locationHierarchy.woredas, newWoreda] });
  };

  if (loading) {
    return (
      <SuperAdminGuard>
        <div className="h-96 flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
            <Settings className="h-10 w-10 text-gray-200" />
          </motion.div>
        </div>
      </SuperAdminGuard>
    );
  }

  return (
    <SuperAdminGuard>
      <div className="space-y-6 w-full max-w-7xl mx-auto pb-10">
      {/* Header */ }
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-red-100 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
            <Settings className="h-3 w-3" /> System Configuration
            </div>
            <h1 className="text-3xl font-black text-black tracking-tighter">Global Settings</h1>
            <p className="text-gray-500 font-medium text-sm">Manage core operational behaviors, volunteer pricing rates, and identifier formatting rules.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl flex-wrap">
            {(["id", "volunteer_rates", "regions", "zones", "woredas", "assets", "system", "security"] as const).map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-black transition-all ${
                        activeTab === tab 
                        ? "bg-white text-black shadow-sm" 
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                    {tab === "id" ? "Member ID" : tab === "volunteer_rates" ? "Volunteer Rates" : tab === "assets" ? "ID Assets" : tab === "system" ? "Connectivity" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
      </div>

      {/* Main Content Area */ }
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6">
          
            {/* Hidden File Input for Assets */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAssetUpload} 
                className="hidden" 
                accept="image/png,image/jpeg,image/svg+xml"
            />

          {activeTab === "id" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
                    <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-[#ED1C24]">
                        <Hash className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-black tracking-tighter">Member ID Generator</h3>
                        <p className="text-gray-400 font-medium text-xs">Configure the randomized, unique ERCS ID format.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="uppercase tracking-widest text-[9px] font-black text-gray-400">Prefix Identifier</Label>
                            <Input
                                value={memberConfig.prefix}
                                onChange={(e) => setMemberConfig({ ...memberConfig, prefix: e.target.value })}
                                placeholder="e.g. ERCS-"
                                className="h-10 bg-gray-50 border-gray-200 rounded-xl text-sm font-black focus:ring-red-500"
                            />
                        </div>

                        <div className="pt-2 space-y-3">
                            <Label className="uppercase tracking-widest text-[9px] font-black text-gray-400">Dynamic Segment Settings</Label>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="text-xs font-black text-black">Include Region Code (e.g. AA-)</div>
                                    <input 
                                        type="checkbox" 
                                        className="h-5 w-5 rounded-md text-red-600 focus:ring-red-500"
                                        checked={!!memberConfig.useRegionCode}
                                        onChange={(e) => setMemberConfig({ ...memberConfig, useRegionCode: e.target.checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="text-xs font-black text-black">Include Zone Code (e.g. Z01-)</div>
                                    <input 
                                        type="checkbox" 
                                        className="h-5 w-5 rounded-md text-red-600 focus:ring-red-500"
                                        checked={!!memberConfig.useZoneCode}
                                        onChange={(e) => setMemberConfig({ ...memberConfig, useZoneCode: e.target.checked })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="uppercase tracking-widest text-[9px] font-black text-gray-400">Zero Padding</Label>
                            <select
                                value={memberConfig.padding}
                                onChange={(e) => setMemberConfig({ ...memberConfig, padding: parseInt(e.target.value) })}
                                className="flex h-10 w-full rounded-xl bg-gray-50 text-black border border-gray-200 px-3 text-sm font-black focus:ring-red-500 outline-none"
                            >
                                <option value={6}>6 Digits (000001)</option>
                                <option value={8}>8 Digits (00000001)</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-center gap-3 h-full min-h-[250px]">
                        <Label className="uppercase tracking-widest text-[9px] font-black text-gray-400">Preview Layout</Label>
                        <div className="text-3xl sm:text-4xl font-black text-black tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
                            {memberConfig.prefix}
                            {memberConfig.useRegionCode ? "AA-" : ""}
                            {memberConfig.useZoneCode ? "Z01-" : ""}
                            {Array(memberConfig.padding).fill('X').join('')}
                        </div>
                        <div className="flex flex-col gap-2 mt-4 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4 text-amber-500" /> Secure, collision-free unique identifiers
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
          )}

          {activeTab === "volunteer_rates" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-[#ED1C24]">
                            <Settings className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-black tracking-tighter">Volunteer Request Cost & Rate Settings</h3>
                            <p className="text-gray-400 font-medium text-xs">Set global default per-day and per-volunteer unit rates for organization missions.</p>
                        </div>
                    </div>
                    <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl font-black text-xs uppercase tracking-wider border border-emerald-200">
                        Active Rate Policy
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="uppercase tracking-widest text-[9px] font-black text-gray-500">Base Daily Rate per Volunteer (ETB/day)</Label>
                            <Input
                                type="number"
                                value={volunteerRates.dailyRatePerVolunteer}
                                onChange={(e) => setVolunteerRates({ ...volunteerRates, dailyRatePerVolunteer: Number(e.target.value) })}
                                className="h-11 bg-gray-50 border-gray-200 rounded-xl text-sm font-black focus:ring-red-500 text-black"
                            />
                            <p className="text-[10px] text-gray-400 font-semibold">Standard daily allowance rate paid or credited to the volunteer.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="uppercase tracking-widest text-[9px] font-black text-gray-500">Accommodation (ETB/day)</Label>
                                <Input
                                    type="number"
                                    value={volunteerRates.accommodationDailyCost}
                                    onChange={(e) => setVolunteerRates({ ...volunteerRates, accommodationDailyCost: Number(e.target.value) })}
                                    className="h-11 bg-gray-50 border-gray-200 rounded-xl text-sm font-black focus:ring-red-500 text-black"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="uppercase tracking-widest text-[9px] font-black text-gray-500">Meals & Per Diem (ETB/day)</Label>
                                <Input
                                    type="number"
                                    value={volunteerRates.mealDailyCost}
                                    onChange={(e) => setVolunteerRates({ ...volunteerRates, mealDailyCost: Number(e.target.value) })}
                                    className="h-11 bg-gray-50 border-gray-200 rounded-xl text-sm font-black focus:ring-red-500 text-black"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="uppercase tracking-widest text-[9px] font-black text-gray-500">Transport Allowance (ETB/day)</Label>
                                <Input
                                    type="number"
                                    value={volunteerRates.transportAllowance}
                                    onChange={(e) => setVolunteerRates({ ...volunteerRates, transportAllowance: Number(e.target.value) })}
                                    className="h-11 bg-gray-50 border-gray-200 rounded-xl text-sm font-black focus:ring-red-500 text-black"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="uppercase tracking-widest text-[9px] font-black text-gray-500">Insurance Fee (ETB/vol)</Label>
                                <Input
                                    type="number"
                                    value={volunteerRates.insuranceFeePerVolunteer}
                                    onChange={(e) => setVolunteerRates({ ...volunteerRates, insuranceFeePerVolunteer: Number(e.target.value) })}
                                    className="h-11 bg-gray-50 border-gray-200 rounded-xl text-sm font-black focus:ring-red-500 text-black"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1.5">
                                <Label className="uppercase tracking-widest text-[9px] font-black text-gray-500">Min Duration (Days)</Label>
                                <Input
                                    type="number"
                                    value={volunteerRates.minMissionDays}
                                    onChange={(e) => setVolunteerRates({ ...volunteerRates, minMissionDays: Number(e.target.value) })}
                                    className="h-11 bg-gray-50 border-gray-200 rounded-xl text-sm font-black focus:ring-red-500 text-black"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="uppercase tracking-widest text-[9px] font-black text-gray-500">ERCS Admin Surcharge (%)</Label>
                                <Input
                                    type="number"
                                    value={volunteerRates.adminFeePercent}
                                    onChange={(e) => setVolunteerRates({ ...volunteerRates, adminFeePercent: Number(e.target.value) })}
                                    className="h-11 bg-gray-50 border-gray-200 rounded-xl text-sm font-black focus:ring-red-500 text-black"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[#ED1C24]">Live Pricing Formula</span>
                                    <h4 className="text-xl font-black tracking-tight">Mission Cost Simulation</h4>
                                </div>
                                <span className="text-xs bg-white/10 px-3 py-1 rounded-lg font-bold">5 Volunteers · 3 Days</span>
                            </div>

                            <div className="mt-4 space-y-2.5 text-xs font-semibold">
                                <div className="flex justify-between text-slate-300">
                                    <span>Base Daily Allowance (5 × 3 × {volunteerRates.dailyRatePerVolunteer} ETB):</span>
                                    <span className="font-bold text-white">{(5 * 3 * (volunteerRates.dailyRatePerVolunteer || 0)).toLocaleString()} ETB</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                    <span>Accommodations (5 × 3 × {volunteerRates.accommodationDailyCost} ETB):</span>
                                    <span className="font-bold text-white">{(5 * 3 * (volunteerRates.accommodationDailyCost || 0)).toLocaleString()} ETB</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                    <span>Meals & Per Diem (5 × 3 × {volunteerRates.mealDailyCost} ETB):</span>
                                    <span className="font-bold text-white">{(5 * 3 * (volunteerRates.mealDailyCost || 0)).toLocaleString()} ETB</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                    <span>Transport (5 × 3 × {volunteerRates.transportAllowance} ETB):</span>
                                    <span className="font-bold text-white">{(5 * 3 * (volunteerRates.transportAllowance || 0)).toLocaleString()} ETB</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                    <span>Medical Insurance (5 × {volunteerRates.insuranceFeePerVolunteer} ETB):</span>
                                    <span className="font-bold text-white">{(5 * (volunteerRates.insuranceFeePerVolunteer || 0)).toLocaleString()} ETB</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                    <span>Admin Fee ({volunteerRates.adminFeePercent || 0}%):</span>
                                    <span className="font-bold text-white">
                                        {Math.round(((5 * 3 * ((volunteerRates.dailyRatePerVolunteer || 0) + (volunteerRates.accommodationDailyCost || 0) + (volunteerRates.mealDailyCost || 0) + (volunteerRates.transportAllowance || 0))) + (5 * (volunteerRates.insuranceFeePerVolunteer || 0))) * ((volunteerRates.adminFeePercent || 0) / 100)).toLocaleString()} ETB
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Calculated Estimate</span>
                                <div className="text-3xl font-black text-white tracking-tighter">
                                    {Math.round(
                                        ((5 * 3 * ((volunteerRates.dailyRatePerVolunteer || 0) + (volunteerRates.accommodationDailyCost || 0) + (volunteerRates.mealDailyCost || 0) + (volunteerRates.transportAllowance || 0))) + (5 * (volunteerRates.insuranceFeePerVolunteer || 0))) * (1 + ((volunteerRates.adminFeePercent || 0) / 100))
                                    ).toLocaleString()} <span className="text-sm text-[#ED1C24] font-bold">ETB</span>
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold italic">Applied to all new org requests</span>
                        </div>
                    </div>
                </div>
            </motion.div>
          )}

          {activeTab === "regions" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-[#ED1C24]">
                            <Globe className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-black tracking-tighter">Region Management</h3>
                            <p className="text-gray-400 font-medium text-xs">Manage top-level organizational regions and their codes.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {regions.map((region) => (
                        <div key={region.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 hover:bg-white hover:shadow-sm transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Region ID: {region.id}</span>
                                <div className="h-6 w-10 bg-red-100 text-[#ED1C24] rounded-lg flex items-center justify-center text-[10px] font-black">{region.code}</div>
                            </div>
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label className="uppercase tracking-widest text-[9px] font-black text-gray-400 px-1">Display Name</Label>
                                    <Input 
                                        value={region.name} 
                                        className="h-10 text-xs font-black rounded-xl border-gray-200 bg-white text-black px-3"
                                        onChange={(e) => {
                                            const newRegions = regions.map(r => r.id === region.id ? { ...r, name: e.target.value } : r);
                                            setRegions(newRegions);
                                        }}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="uppercase tracking-widest text-[9px] font-black text-gray-400 px-1">Regional Code</Label>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            value={region.code} 
                                            maxLength={3}
                                            className="h-10 w-20 text-xs font-black rounded-xl border-gray-200 bg-white text-black px-3 uppercase"
                                            onChange={(e) => {
                                                const newRegions = regions.map(r => r.id === region.id ? { ...r, code: e.target.value.toUpperCase() } : r);
                                                setRegions(newRegions);
                                            }}
                                        />
                                        <Button 
                                            size="icon" 
                                            className="h-10 w-10 rounded-xl bg-black hover:bg-[#ED1C24] text-white transition-all"
                                            onClick={() => updateRegionCode(region)}
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
          )}

          {activeTab === "zones" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                 <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-50 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-[#ED1C24]">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-black tracking-tighter">Zone Management</h3>
                            <p className="text-gray-400 font-medium text-xs">Configure regional zones and administrative areas.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Label className="text-[10px] font-black uppercase text-gray-400">Filter Region:</Label>
                            <select 
                                value={zoneRegionFilter}
                                onChange={(e) => setZoneRegionFilter(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                                className="h-10 rounded-xl bg-gray-50 border border-gray-200 px-3 text-xs font-black text-black focus:ring-red-500 outline-none"
                            >
                                <option value="all">All Regions</option>
                                {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>
                        <Button onClick={addZone} className="bg-black text-white rounded-xl h-10 px-6 font-black gap-2 text-xs">
                            <Plus className="h-4 w-4" /> Add Zone
                        </Button>
                    </div>
                </div>

                <div className="space-y-3">
                    {locationHierarchy.zones.length === 0 ? (
                        <div className="h-32 flex flex-col items-center justify-center text-gray-300 gap-2 font-medium text-sm">
                            <MapPin className="h-8 w-8 opacity-20" />
                            No zones created yet.
                        </div>
                    ) : (
                        (() => {
                            const filteredZones = locationHierarchy.zones.filter(z => zoneRegionFilter === "all" || z.region_id === zoneRegionFilter);
                            if (filteredZones.length === 0) {
                                return (
                                    <div className="h-32 flex flex-col items-center justify-center text-gray-400 gap-2 font-medium text-sm">
                                        No zones found for the selected region.
                                    </div>
                                );
                            }
                            return (
                                <div className="grid gap-3">
                                    {filteredZones.map((zone) => (
                            <div key={zone.id} className="flex flex-col md:flex-row md:items-end gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white transition-all shadow-sm">
                                <div className="w-full md:w-56 space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase text-gray-400 px-1">Parent Region</Label>
                                    <select 
                                        value={zone.region_id}
                                        onChange={(e) => {
                                            const newZones = locationHierarchy.zones.map(z => z.id === zone.id ? { ...z, region_id: parseInt(e.target.value) } : z);
                                            setLocationHierarchy({ ...locationHierarchy, zones: newZones });
                                        }}
                                        className="h-10 w-full rounded-xl bg-white border border-gray-200 px-3 text-xs font-black text-black focus:ring-red-500 outline-none"
                                    >
                                        {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase text-gray-400 px-1">Zone Name</Label>
                                    <Input 
                                        value={zone.name}
                                        onChange={(e) => {
                                            const newZones = locationHierarchy.zones.map(z => z.id === zone.id ? { ...z, name: e.target.value } : z);
                                            setLocationHierarchy({ ...locationHierarchy, zones: newZones });
                                        }}
                                        className="h-10 bg-white border-gray-200 rounded-xl font-black text-xs text-black px-3"
                                    />
                                </div>
                                <div className="w-full md:w-32 space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase text-gray-400 px-1">Code</Label>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            value={zone.code}
                                            onChange={(e) => {
                                                const newZones = locationHierarchy.zones.map(z => z.id === zone.id ? { ...z, code: e.target.value.toUpperCase() } : z);
                                                setLocationHierarchy({ ...locationHierarchy, zones: newZones });
                                            }}
                                            className="h-10 bg-white border-gray-200 rounded-xl font-black text-xs text-black px-3 uppercase"
                                        />
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-10 w-10 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
                                            onClick={() => {
                                                const newZones = locationHierarchy.zones.filter(z => z.id !== zone.id);
                                                setLocationHierarchy({ ...locationHierarchy, zones: newZones });
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                                </div>
                            );
                        })()
                    )}
                </div>
            </motion.div>
          )}

          {activeTab === "assets" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
                    <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-[#ED1C24]">
                        <Edit3 className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-black tracking-tighter">ID Card Branding Assets</h3>
                        <p className="text-gray-400 font-medium text-xs">Manage official stamps and authorized signatures for member identification.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { label: "Official Organization Stamp", key: "stampUrl", desc: "Used on the back of all ID cards" },
                        { label: "Primary Authorized Signature", key: "signature1Url", desc: "Main signatory (e.g. Secretary General)" },
                        { label: "Secondary Authorized Signature", key: "signature2Url", desc: "Optional second signatory" }
                    ].map((asset, i) => (
                        <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                            <Label className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none">{asset.label}</Label>
                            <div className="h-32 bg-white rounded-xl border border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group">
                                {idAssets[asset.key as keyof typeof idAssets] ? (
                                    <img src={idAssets[asset.key as keyof typeof idAssets]} alt={asset.label} className="h-full object-contain" />
                                ) : (
                                    <button 
                                        onClick={() => triggerUpload(asset.key)}
                                        disabled={saving}
                                        className="flex flex-col items-center gap-2 text-gray-300 hover:text-red-400 transition-colors"
                                    >
                                        <Plus className="h-8 w-8" />
                                        <span className="text-[10px] font-bold uppercase tracking-tight">Upload PNG</span>
                                    </button>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <Button 
                                        variant="outline" 
                                        className="text-white border-white hover:bg-white hover:text-black h-8 px-4 rounded-lg text-[10px] font-black uppercase"
                                        onClick={() => triggerUpload(asset.key)}
                                        disabled={saving}
                                    >
                                        {saving && currentAssetKey === asset.key ? <RefreshCw className="h-3 w-3 animate-spin mr-2" /> : "Change Asset"}
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black text-gray-400 uppercase">Asset URL / Storage Path</Label>
                                <Input 
                                    value={idAssets[asset.key as keyof typeof idAssets]}
                                    onChange={(e) => setIdAssets({ ...idAssets, [asset.key]: e.target.value })}
                                    className="h-10 bg-white border-gray-200 rounded-xl text-[10px] font-medium"
                                    placeholder="https://..."
                                />
                            </div>
                            <p className="text-[10px] font-medium text-gray-400 italic">{asset.desc}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
          )}

          {activeTab === "system" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
                    <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-[#ED1C24]">
                        <RefreshCw className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-black tracking-tighter">Connectivity & Gateways</h3>
                        <p className="text-gray-400 font-medium text-xs">Configure communication APIs and infrastructure parameters.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* SMS Gateway */}
                    <div className="space-y-4 p-6 bg-gray-50 rounded-[24px] border border-gray-100">
                        <h4 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                           <MessageCircle className="h-4 w-4 text-green-600" /> SMS Gateway
                        </h4>
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase text-gray-400">SMS Token</Label>
                                <div className="flex gap-2">
                                    <Input value={systemConfig.smsToken} onChange={(e) => setSystemConfig({...systemConfig, smsToken: e.target.value})} className="h-10 bg-white border-gray-200 rounded-xl text-xs font-medium" />
                                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-green-600 hover:bg-green-700 text-white border-none rounded-xl"><Save className="h-4 w-4"/></Button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase text-gray-400">SMS API URL</Label>
                                <div className="flex gap-2">
                                    <Input value={systemConfig.smsApiUrl} onChange={(e) => setSystemConfig({...systemConfig, smsApiUrl: e.target.value})} className="h-10 bg-white border-gray-200 rounded-xl text-xs font-medium" />
                                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-green-600 hover:bg-green-700 text-white border-none rounded-xl"><Save className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp API */}
                    <div className="space-y-4 p-6 bg-gray-50 rounded-[24px] border border-gray-100">
                        <h4 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                           <MessageCircle className="h-4 w-4 text-green-500" /> WhatsApp API
                        </h4>
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase text-gray-400">WhatsApp Token</Label>
                                <div className="flex gap-2">
                                    <Input value={systemConfig.whatsappToken} onChange={(e) => setSystemConfig({...systemConfig, whatsappToken: e.target.value})} className="h-10 bg-white border-gray-200 rounded-xl text-xs font-medium" />
                                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-green-600 hover:bg-green-700 text-white border-none rounded-xl"><Save className="h-4 w-4"/></Button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase text-gray-400">WhatsApp API URL</Label>
                                <div className="flex gap-2">
                                    <Input value={systemConfig.whatsappApiUrl} onChange={(e) => setSystemConfig({...systemConfig, whatsappApiUrl: e.target.value})} className="h-10 bg-white border-gray-200 rounded-xl text-xs font-medium" />
                                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-green-600 hover:bg-green-700 text-white border-none rounded-xl"><Save className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Telegram Bot */}
                    <div className="space-y-4 p-6 bg-gray-50 rounded-[24px] border border-gray-100">
                        <h4 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                           <MessageCircle className="h-4 w-4 text-blue-400" /> Telegram Bot
                        </h4>
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-black uppercase text-gray-400">Telegram Token</Label>
                            <div className="flex gap-2">
                                <Input value={systemConfig.telegramToken} onChange={(e) => setSystemConfig({...systemConfig, telegramToken: e.target.value})} className="h-10 bg-white border-gray-200 rounded-xl text-xs font-medium" />
                                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-blue-400 hover:bg-blue-500 text-white border-none rounded-xl"><Save className="h-4 w-4"/></Button>
                            </div>
                        </div>
                    </div>

                    {/* Infrastructure */}
                    <div className="space-y-4 p-6 bg-gray-50 rounded-[24px] border border-gray-100">
                        <h4 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                           <Globe className="h-4 w-4 text-amber-500" /> Infrastructure
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase text-gray-400">Server UI Port</Label>
                                <div className="flex gap-2">
                                    <Input value={systemConfig.serverUiPort} onChange={(e) => setSystemConfig({...systemConfig, serverUiPort: e.target.value})} className="h-10 bg-white border-gray-200 rounded-xl text-xs font-black" />
                                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-amber-500 hover:bg-amber-600 text-white border-none rounded-xl"><Save className="h-4 w-4"/></Button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase text-gray-400">Server API Port</Label>
                                <div className="flex gap-2">
                                    <Input value={systemConfig.serverApiPort} onChange={(e) => setSystemConfig({...systemConfig, serverApiPort: e.target.value})} className="h-10 bg-white border-gray-200 rounded-xl text-xs font-black" />
                                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-amber-500 hover:bg-amber-600 text-white border-none rounded-xl"><Save className="h-4 w-4"/></Button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase text-gray-400">Server Payment Port</Label>
                                <div className="flex gap-2">
                                    <Input value={systemConfig.serverPaymentPort} onChange={(e) => setSystemConfig({...systemConfig, serverPaymentPort: e.target.value})} className="h-10 bg-white border-gray-200 rounded-xl text-xs font-black" />
                                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-amber-500 hover:bg-amber-600 text-white border-none rounded-xl"><Save className="h-4 w-4"/></Button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase text-gray-400">Server IP</Label>
                                <div className="flex gap-2">
                                    <Input value={systemConfig.serverIp} onChange={(e) => setSystemConfig({...systemConfig, serverIp: e.target.value})} className="h-10 bg-white border-gray-200 rounded-xl text-xs font-black" />
                                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-amber-500 hover:bg-amber-600 text-white border-none rounded-xl"><Save className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
          )}

          {activeTab === "woredas" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                 <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-50 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-[#ED1C24]">
                            <Map className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-black tracking-tighter">Woreda Management</h3>
                            <p className="text-gray-400 font-medium text-xs">Manage district-level woredas linked to zones.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Label className="text-[10px] font-black uppercase text-gray-400">Region:</Label>
                            <select 
                                value={woredaRegionFilter}
                                onChange={(e) => {
                                    setWoredaRegionFilter(e.target.value === "all" ? "all" : parseInt(e.target.value));
                                    setWoredaZoneFilter("all"); // Reset zone filter
                                }}
                                className="h-10 rounded-xl bg-gray-50 border border-gray-200 px-3 text-xs font-black text-black focus:ring-red-500 outline-none"
                            >
                                <option value="all">All Regions</option>
                                {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label className="text-[10px] font-black uppercase text-gray-400">Zone:</Label>
                            <select 
                                value={woredaZoneFilter}
                                onChange={(e) => setWoredaZoneFilter(e.target.value)}
                                className="h-10 rounded-xl bg-gray-50 border border-gray-200 px-3 text-xs font-black text-black focus:ring-red-500 outline-none w-40"
                            >
                                <option value="all">All Zones</option>
                                {locationHierarchy.zones
                                    .filter(z => woredaRegionFilter === "all" || z.region_id === woredaRegionFilter)
                                    .map(z => <option key={z.id} value={z.id}>{z.name}</option>)
                                }
                            </select>
                        </div>
                        <Button onClick={addWoreda} disabled={locationHierarchy.zones.length === 0} className="bg-black text-white rounded-xl h-10 px-6 font-black gap-2 text-xs">
                            <Plus className="h-4 w-4" /> Add Woreda
                        </Button>
                    </div>
                </div>

                <div className="space-y-3">
                    {locationHierarchy.woredas.length === 0 ? (
                        <div className="h-32 flex flex-col items-center justify-center text-gray-300 gap-2 font-medium text-sm">
                            <Map className="h-8 w-8 opacity-20" />
                            {locationHierarchy.zones.length === 0 ? "Create a Zone first." : "No woredas created yet."}
                        </div>
                    ) : (
                        (() => {
                            const filteredWoredas = locationHierarchy.woredas.filter(w => {
                                if (woredaZoneFilter !== "all") {
                                    return w.zone_id === woredaZoneFilter;
                                }
                                if (woredaRegionFilter !== "all") {
                                    const zone = locationHierarchy.zones.find(z => z.id === w.zone_id);
                                    return zone && zone.region_id === woredaRegionFilter;
                                }
                                return true;
                            });

                            if (filteredWoredas.length === 0) {
                                return (
                                    <div className="h-32 flex flex-col items-center justify-center text-gray-400 gap-2 font-medium text-sm">
                                        No woredas found for the selected filters.
                                    </div>
                                );
                            }

                            const displayedWoredas = filteredWoredas.slice(0, 200);

                            return (
                                <div className="space-y-3">
                                    <div className="text-xs text-gray-500 font-medium px-1">
                                        Showing {displayedWoredas.length} {filteredWoredas.length > 200 ? `of ${filteredWoredas.length} ` : ''}woredas
                                    </div>
                                    <div className="grid gap-3">
                                        {displayedWoredas.map((woreda) => (
                            <div key={woreda.id} className="flex flex-col md:flex-row md:items-end gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white transition-all shadow-sm">
                                <div className="w-full md:w-56 space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase text-gray-400 px-1">Parent Zone</Label>
                                    <select 
                                        value={woreda.zone_id}
                                        onChange={(e) => {
                                            const newWoredas = locationHierarchy.woredas.map(w => w.id === woreda.id ? { ...w, zone_id: e.target.value } : w);
                                            setLocationHierarchy({ ...locationHierarchy, woredas: newWoredas });
                                        }}
                                        className="h-10 w-full rounded-xl bg-white border border-gray-200 px-3 text-xs font-black text-black focus:ring-red-500 outline-none"
                                    >
                                        {locationHierarchy.zones.map(z => <option key={z.id} value={z.id}>{z.name} ({z.code})</option>)}
                                    </select>
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase text-gray-400 px-1">Woreda Name</Label>
                                    <Input 
                                        value={woreda.name}
                                        onChange={(e) => {
                                            const newWoredas = locationHierarchy.woredas.map(w => w.id === woreda.id ? { ...w, name: e.target.value } : w);
                                            setLocationHierarchy({ ...locationHierarchy, woredas: newWoredas });
                                        }}
                                        className="h-10 bg-white border-gray-200 rounded-xl font-black text-xs text-black px-3"
                                    />
                                </div>
                                <div className="w-full md:w-32 space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase text-gray-400 px-1">Code</Label>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            value={woreda.code}
                                            onChange={(e) => {
                                                const newWoredas = locationHierarchy.woredas.map(w => w.id === woreda.id ? { ...w, code: e.target.value.toUpperCase() } : w);
                                                setLocationHierarchy({ ...locationHierarchy, woredas: newWoredas });
                                            }}
                                            className="h-10 bg-white border-gray-200 rounded-xl font-black text-xs text-black px-3 uppercase"
                                        />
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-10 w-10 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
                                            onClick={() => {
                                                const newWoredas = locationHierarchy.woredas.filter(w => w.id !== woreda.id);
                                                setLocationHierarchy({ ...locationHierarchy, woredas: newWoredas });
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                                    </div>
                                </div>
                            );
                        })()
                    )}
                </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
                    <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-[#ED1C24]">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-black tracking-tighter">Security & Authentication</h3>
                        <p className="text-gray-400 font-medium text-xs">Enhance account security with Two-Factor Authentication (2FA) via SMS OTP or Authenticator App.</p>
                    </div>
                </div>

                {is2faEnabled && !mfaSetup ? (
                    <div className="p-8 bg-green-50/50 rounded-3xl border border-green-200/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="h-16 w-16 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 shrink-0">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    <ShieldCheck className="h-3 w-3" /> 2FA Active & Protected
                                </div>
                                <h4 className="text-lg font-black text-black tracking-tight">Two-Factor Authentication is Enabled</h4>
                                <p className="text-xs text-gray-600 font-medium">
                                    Your account requires a 6-digit verification code delivered via SMS{userPhone ? ` to (${userPhone})` : ""} or from your Authenticator app on sign-in.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button 
                                onClick={startMfaSetup}
                                variant="outline"
                                className="h-11 px-5 rounded-xl font-black text-xs uppercase tracking-wider border-gray-300 hover:bg-white"
                            >
                                Reconfigure
                            </Button>
                            <Button 
                                onClick={disableMfa}
                                disabled={setupLoading}
                                className="h-11 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/15"
                            >
                                {setupLoading ? "Processing..." : "Disable 2FA"}
                            </Button>
                        </div>
                    </div>
                ) : !mfaSetup && !setupSuccess ? (
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h4 className="text-lg font-black text-black tracking-tight flex items-center gap-2">
                                    <Key className="h-5 w-5 text-[#ED1C24]" /> Two-Factor Authentication
                                </h4>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                    Protect your administrative account by requiring a 6-digit verification code from your mobile device via SMS text or Authenticator app.
                                </p>
                            </div>
                            
                            <div className="bg-red-50 p-4 rounded-2xl border border-red-100/50 space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black text-[#ED1C24] uppercase tracking-widest">
                                    <ShieldAlert className="h-3.5 w-3.5" /> High Security Recommended
                                </div>
                                <p className="text-[11px] text-[#ED1C24]/70 font-bold">
                                    Admins are required to maintain the highest security standards. Enabling 2FA protects sensitive member and volunteer records.
                                </p>
                            </div>

                            <Button 
                                onClick={startMfaSetup} 
                                disabled={setupLoading}
                                className="bg-black hover:bg-[#ED1C24] text-white rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-black/5"
                            >
                                {setupLoading ? "Initializing..." : "Enable 2FA Now"}
                            </Button>
                        </div>
                        <div className="hidden md:flex justify-center">
                            <div className="relative w-64 h-64">
                                <div className="absolute inset-0 bg-red-50 rounded-full blur-3xl opacity-50" />
                                <div className="relative h-full w-full bg-white rounded-[40px] border border-gray-100 shadow-xl flex items-center justify-center">
                                    <Smartphone className="h-32 w-32 text-gray-200" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : setupSuccess ? (
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        className="flex flex-col items-center justify-center py-12 text-center space-y-6"
                    >
                        <div className="h-24 w-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/10">
                            <CheckCircle2 className="h-12 w-12" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-black tracking-tight">2FA Successfully Enabled</h3>
                            <p className="text-gray-500 font-medium text-sm max-w-sm">
                                Your account is now protected. You will be asked for an SMS OTP or Authenticator code during sign-in.
                            </p>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={() => setSetupSuccess(false)}
                            className="h-10 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] border-gray-200"
                        >
                            Done
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xl space-y-6"
                    >
                        {/* Tab Selector */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                                <button
                                    type="button"
                                    onClick={() => setMfaMethod("SMS")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                        mfaMethod === "SMS" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
                                    }`}
                                >
                                    <MessageSquare className="h-4 w-4 text-[#ED1C24]" /> SMS Phone Verification
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMfaMethod("APP")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                        mfaMethod === "APP" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
                                    }`}
                                >
                                    <Smartphone className="h-4 w-4 text-[#ED1C24]" /> Authenticator App (QR)
                                </button>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setMfaSetup(null)}
                                className="text-xs font-bold text-gray-400 hover:text-black"
                            >
                                Cancel
                            </Button>
                        </div>

                        {mfaMethod === "SMS" ? (
                            <div className="grid md:grid-cols-2 gap-8 items-center pt-2">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <h4 className="font-black text-black text-sm uppercase tracking-tight">Step 1: Send SMS Verification Code</h4>
                                        <p className="text-xs text-gray-500 font-medium">
                                            We will send a 6-digit SMS OTP code to your registered mobile number: <strong className="text-black">{userPhone || "Account Phone"}</strong>
                                        </p>
                                    </div>
                                    <Button
                                        onClick={sendSmsVerification}
                                        disabled={sendingSmsOtp}
                                        className="h-11 px-6 bg-black hover:bg-[#ED1C24] text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2"
                                    >
                                        <Send className="h-4 w-4" /> {sendingSmsOtp ? "Sending SMS..." : smsSent ? "Resend SMS Code" : "Send Verification SMS"}
                                    </Button>
                                    {smsSent && (
                                        <p className="text-[11px] text-green-600 font-bold flex items-center gap-1.5">
                                            <CheckCircle2 className="h-3.5 w-3.5" /> Code sent! Please check your phone SMS inbox.
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="space-y-1">
                                        <h4 className="font-black text-black text-sm uppercase tracking-tight">Step 2: Enter 6-Digit Code</h4>
                                        <p className="text-xs text-gray-500 font-medium">Enter the 6-digit code received via SMS to activate 2FA.</p>
                                    </div>
                                    <Input 
                                        value={setupCode}
                                        onChange={(e) => setSetupCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="000000"
                                        className="h-12 bg-white border-gray-200 rounded-xl text-center text-2xl font-black tracking-[0.4em] focus:ring-[#ED1C24]/10"
                                    />
                                    <Button 
                                        onClick={verifyMfaSetup}
                                        disabled={setupLoading || setupCode.length !== 6}
                                        className="w-full h-12 bg-[#ED1C24] hover:bg-black text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/10"
                                    >
                                        {setupLoading ? "Activating..." : "Verify & Activate 2FA"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-12 pt-2">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center text-[10px] font-black italic">1</div>
                                            <h4 className="font-black text-black text-sm uppercase tracking-tight">Scan QR Code</h4>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium leading-relaxed pl-11">
                                            Open your authenticator app (Google Authenticator, Authy, Microsoft Authenticator) and scan the QR code.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center text-[10px] font-black italic">2</div>
                                            <h4 className="font-black text-black text-sm uppercase tracking-tight">Enter Verification Code</h4>
                                        </div>
                                        <div className="pl-11 space-y-4">
                                            <Input 
                                                value={setupCode}
                                                onChange={(e) => setSetupCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                placeholder="000000"
                                                className="h-12 bg-gray-50 border-gray-200 rounded-xl text-center text-xl font-black tracking-[0.4em] focus:ring-[#ED1C24]/10"
                                            />
                                            <Button 
                                                onClick={verifyMfaSetup}
                                                disabled={setupLoading || setupCode.length !== 6}
                                                className="w-full h-12 bg-[#ED1C24] hover:bg-black text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/10"
                                            >
                                                {setupLoading ? "Verifying..." : "Complete Setup"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-6">
                                    <div className="p-6 bg-white rounded-[32px] shadow-2xl shadow-black/5 border border-gray-100 flex items-center justify-center">
                                        <QRCodeSVG value={mfaSetup?.qrCodeUrl || "https://ercs.org/mfa-setup"} size={180} />
                                    </div>
                                    <div className="w-full max-w-xs space-y-2 text-center">
                                        <Label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Manual Setup Key</Label>
                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between gap-2 overflow-hidden">
                                            <code className="text-[10px] font-black text-black truncate">{mfaSetup?.secret}</code>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-7 w-7 shrink-0 text-gray-400 hover:text-black"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(mfaSetup?.secret || "");
                                                    alert("Secret copied to clipboard!");
                                                }}
                                            >
                                                <Copy className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>
          )}

        </div>

        {/* Action Footer */ }
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 z-10">
          <Button
            variant="ghost"
            onClick={fetchInitialData}
            className="hover:bg-white rounded-xl h-10 px-6 font-bold text-gray-500 text-xs transition-all gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reset Changes
          </Button>
          <Button
            onClick={handleSaveConfig}
            disabled={saving}
            className={`rounded-xl h-10 px-6 font-black text-white text-xs shadow-md transition-all flex items-center gap-2
              ${success ? "bg-green-500 hover:bg-green-600" : "bg-black hover:bg-[#ED1C24]"}`}
          >
            {saving ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <RefreshCw className="h-4 w-4" />
              </motion.div>
            ) : success ? (
              <><Check className="h-4 w-4" /> All Settings Saved</>
            ) : (
              <><Save className="h-4 w-4" /> Save All Configurations</>
            )}
          </Button>
        </div>
      </div>
    </div>
    </SuperAdminGuard>
  );
}
