"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, Check, RefreshCw, Hash, ShieldAlert, MapPin, Map, Globe, Plus, Trash2, Edit3, MessageCircle } from "lucide-react";
import api from "@/lib/api";

type MemberIDConfig = {
  prefix: string;
  padding: number;
  useRegionCode?: boolean;
  useZoneCode?: boolean;
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
  const [activeTab, setActiveTab] = useState<"id" | "regions" | "zones" | "woredas" | "assets" | "system">("id");
  
  const [regions, setRegions] = useState<Region[]>([]);
  const [locationHierarchy, setLocationHierarchy] = useState<LocationHierarchy>({ zones: [], woredas: [] });
  
  const [memberConfig, setMemberConfig] = useState<MemberIDConfig>({
    prefix: "ERCS-",
    padding: 6,
    useRegionCode: true,
    useZoneCode: true,
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
      const res = await api.get("/system-settings");
      const settings = res.data.settings || {};

      if (settings.member_id_config) {
        setMemberConfig(JSON.parse(settings.member_id_config));
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

    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
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
    const newZone: Zone = {
      id: Math.random().toString(36).substr(2, 9),
      region_id: regions[0]?.id || 1,
      name: "New Zone",
      code: "Z00"
    };
    setLocationHierarchy({ ...locationHierarchy, zones: [...locationHierarchy.zones, newZone] });
  };

  const addWoreda = () => {
    if (locationHierarchy.zones.length === 0) return;
    const newWoreda: Woreda = {
      id: Math.random().toString(36).substr(2, 9),
      zone_id: locationHierarchy.zones[0].id,
      name: "New Woreda",
      code: "W00"
    };
    setLocationHierarchy({ ...locationHierarchy, woredas: [...locationHierarchy.woredas, newWoreda] });
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Settings className="h-10 w-10 text-gray-200" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-10">
      {/* Header */ }
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-red-100 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
            <Settings className="h-3 w-3" /> System Configuration
            </div>
            <h1 className="text-3xl font-black text-black tracking-tighter">Global Settings</h1>
            <p className="text-gray-500 font-medium text-sm">Manage core operational behaviors and identifier formatting rules.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
            {(["id", "regions", "zones", "woredas", "assets", "system"] as const).map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-black transition-all ${
                        activeTab === tab 
                        ? "bg-white text-black shadow-sm" 
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                    {tab === "id" ? "Member ID" : tab === "assets" ? "ID Assets" : tab === "system" ? "Connectivity" : tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                 <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-[#ED1C24]">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-black tracking-tighter">Zone Management</h3>
                            <p className="text-gray-400 font-medium text-xs">Configure regional zones and administrative areas.</p>
                        </div>
                    </div>
                    <Button onClick={addZone} className="bg-black text-white rounded-xl h-10 px-6 font-black gap-2 text-xs">
                        <Plus className="h-4 w-4" /> Add Zone
                    </Button>
                </div>

                <div className="space-y-3">
                    {locationHierarchy.zones.length === 0 && (
                        <div className="h-32 flex flex-col items-center justify-center text-gray-300 gap-2 font-medium text-sm">
                            <MapPin className="h-8 w-8 opacity-20" />
                            No zones created yet.
                        </div>
                    )}
                    <div className="grid gap-3">
                        {locationHierarchy.zones.map((zone) => (
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
                 <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-[#ED1C24]">
                            <Map className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-black tracking-tighter">Woreda Management</h3>
                            <p className="text-gray-400 font-medium text-xs">Manage district-level woredas linked to zones.</p>
                        </div>
                    </div>
                    <Button onClick={addWoreda} disabled={locationHierarchy.zones.length === 0} className="bg-black text-white rounded-xl h-10 px-6 font-black gap-2 text-xs">
                        <Plus className="h-4 w-4" /> Add Woreda
                    </Button>
                </div>

                <div className="space-y-3">
                    {locationHierarchy.woredas.length === 0 && (
                        <div className="h-32 flex flex-col items-center justify-center text-gray-300 gap-2 font-medium text-sm">
                            <Map className="h-8 w-8 opacity-20" />
                            {locationHierarchy.zones.length === 0 ? "Create a Zone first." : "No woredas created yet."}
                        </div>
                    )}
                    <div className="grid gap-3">
                        {locationHierarchy.woredas.map((woreda) => (
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
  );
}
