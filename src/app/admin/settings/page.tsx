"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, Check, RefreshCw, Hash, ShieldAlert, MapPin, Map, Globe, Plus, Trash2, Edit3 } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"id" | "regions" | "zones" | "woredas">("id");
  
  const [regions, setRegions] = useState<Region[]>([]);
  const [locationHierarchy, setLocationHierarchy] = useState<LocationHierarchy>({ zones: [], woredas: [] });
  
  const [memberConfig, setMemberConfig] = useState<MemberIDConfig>({
    prefix: "ERCS-",
    padding: 6,
    useRegionCode: true,
    useZoneCode: true,
  });

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
      
      // Save ID Config
      await api.post("/system-settings", {
        key: "member_id_config",
        value_json: JSON.stringify(memberConfig),
      });

      // Save Location Hierarchy
      await api.post("/system-settings", {
        key: "locations_hierarchy",
        value_json: JSON.stringify(locationHierarchy),
      });

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
    <div className="space-y-10 w-full max-w-7xl mx-auto pb-20">
      {/* Header */ }
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
            <Settings className="h-3.5 w-3.5" /> System Configuration
            </div>
            <h1 className="text-5xl font-black text-black tracking-tighter">Global Settings</h1>
            <p className="text-gray-500 font-medium text-lg">Manage core operational behaviors and identifier formatting rules.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-2xl">
            {(["id", "regions", "zones", "woredas"] as const).map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
                        activeTab === tab 
                        ? "bg-white text-black shadow-sm" 
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                    {tab === "id" ? "Member ID" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
      </div>

      {/* Main Content Area */ }
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-10">
          
          {activeTab === "id" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
                    <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#ED1C24]">
                        <Hash className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-black tracking-tighter">Member ID Generator</h3>
                        <p className="text-gray-400 font-medium">Configure the randomized, unique ERCS ID format.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <Label className="uppercase tracking-widest text-[10px] font-black text-gray-400">Prefix Identifier</Label>
                            <Input
                                value={memberConfig.prefix}
                                onChange={(e) => setMemberConfig({ ...memberConfig, prefix: e.target.value })}
                                placeholder="e.g. ERCS-"
                                className="h-14 bg-gray-50 border-gray-200 rounded-2xl text-lg font-black focus:ring-red-500"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="uppercase tracking-widest text-[10px] font-black text-gray-400">Zero Padding</Label>
                            <select
                                value={memberConfig.padding}
                                onChange={(e) => setMemberConfig({ ...memberConfig, padding: parseInt(e.target.value) })}
                                className="flex h-14 w-full rounded-2xl bg-gray-50 text-black border border-gray-200 px-4 text-lg font-black focus:ring-red-500"
                            >
                                <option value={6}>6 Digits (000001)</option>
                                <option value={8}>8 Digits (00000001)</option>
                            </select>
                        </div>

                        <div className="pt-4 space-y-4">
                            <Label className="uppercase tracking-widest text-[10px] font-black text-gray-400">Dynamic Segment Settings</Label>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-sm font-black text-black">Include Region Code (e.g. AA-)</div>
                                    <input 
                                        type="checkbox" 
                                        className="h-6 w-6 rounded-lg text-red-600 focus:ring-red-500"
                                        checked={!!memberConfig.useRegionCode}
                                        onChange={(e) => setMemberConfig({ ...memberConfig, useRegionCode: e.target.checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-sm font-black text-black">Include Zone Code (e.g. Z01-)</div>
                                    <input 
                                        type="checkbox" 
                                        className="h-6 w-6 rounded-lg text-red-600 focus:ring-red-500"
                                        checked={!!memberConfig.useZoneCode}
                                        onChange={(e) => setMemberConfig({ ...memberConfig, useZoneCode: e.target.checked })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col justify-center gap-4 h-full min-h-[300px]">
                        <Label className="uppercase tracking-widest text-[10px] font-black text-gray-400">Preview Layout</Label>
                        <div className="text-4xl sm:text-5xl font-black text-black tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
                            {memberConfig.useRegionCode ? "AA-" : ""}
                            {memberConfig.useZoneCode ? "Z01-" : ""}
                            {memberConfig.prefix}{Array(memberConfig.padding).fill('X').join('')}
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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#ED1C24]">
                            <Globe className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-black tracking-tighter">Region Management</h3>
                            <p className="text-gray-400 font-medium">Manage top-level organizational regions and their codes.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regions.map((region) => (
                        <div key={region.id} className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 space-y-6 group hover:bg-white hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest">Region ID: {region.id}</span>
                                <div className="h-7 w-12 bg-red-100 text-[#ED1C24] rounded-xl flex items-center justify-center text-[11px] font-black shadow-sm">{region.code}</div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="uppercase tracking-widest text-[9px] font-black text-gray-400 px-1">Display Name</Label>
                                    <Input 
                                        value={region.name} 
                                        className="h-12 text-sm font-black rounded-2xl border-gray-200 bg-white text-black px-4 shadow-sm"
                                        onChange={(e) => {
                                            const newRegions = regions.map(r => r.id === region.id ? { ...r, name: e.target.value } : r);
                                            setRegions(newRegions);
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="uppercase tracking-widest text-[9px] font-black text-gray-400 px-1">Regional Code</Label>
                                    <div className="flex items-center gap-3">
                                        <Input 
                                            value={region.code} 
                                            maxLength={3}
                                            className="h-12 w-24 text-sm font-black rounded-2xl border-gray-200 bg-white text-black px-4 uppercase shadow-sm"
                                            onChange={(e) => {
                                                const newRegions = regions.map(r => r.id === region.id ? { ...r, code: e.target.value.toUpperCase() } : r);
                                                setRegions(newRegions);
                                            }}
                                        />
                                        <Button 
                                            size="icon" 
                                            className="h-12 w-12 rounded-2xl bg-black hover:bg-red-600 text-white shadow-lg transition-all"
                                            onClick={() => updateRegionCode(region)}
                                        >
                                            <Save className="h-5 w-5" />
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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                 <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#ED1C24]">
                            <MapPin className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-black tracking-tighter">Zone Management</h3>
                            <p className="text-gray-400 font-medium">Configure regional zones and administrative areas.</p>
                        </div>
                    </div>
                    <Button onClick={addZone} className="bg-black text-white rounded-2xl h-14 px-8 font-black gap-2">
                        <Plus className="h-5 w-5" /> Add New Zone
                    </Button>
                </div>

                <div className="space-y-4">
                    {locationHierarchy.zones.length === 0 && (
                        <div className="h-40 flex flex-col items-center justify-center text-gray-300 gap-2 font-medium">
                            <MapPin className="h-10 w-10 opacity-20" />
                            No zones created yet.
                        </div>
                    )}
                    <div className="grid gap-4">
                        {locationHierarchy.zones.map((zone) => (
                            <div key={zone.id} className="flex flex-col md:flex-row md:items-end gap-6 p-8 bg-gray-50 rounded-[40px] border border-gray-100 group hover:bg-white transition-all shadow-sm">
                                <div className="w-full md:w-64 space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 px-1">Parent Region</Label>
                                    <select 
                                        value={zone.region_id}
                                        onChange={(e) => {
                                            const newZones = locationHierarchy.zones.map(z => z.id === zone.id ? { ...z, region_id: parseInt(e.target.value) } : z);
                                            setLocationHierarchy({ ...locationHierarchy, zones: newZones });
                                        }}
                                        className="h-12 w-full rounded-2xl bg-white border border-gray-200 px-4 text-sm font-black text-black focus:ring-red-500 shadow-sm"
                                    >
                                        {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 px-1">Zone Name</Label>
                                    <Input 
                                        value={zone.name}
                                        onChange={(e) => {
                                            const newZones = locationHierarchy.zones.map(z => z.id === zone.id ? { ...z, name: e.target.value } : z);
                                            setLocationHierarchy({ ...locationHierarchy, zones: newZones });
                                        }}
                                        className="h-12 bg-white border-gray-200 rounded-2xl font-black text-sm text-black px-4 shadow-sm"
                                    />
                                </div>
                                <div className="w-full md:w-40 space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 px-1">Zone Code</Label>
                                    <div className="flex items-center gap-3">
                                        <Input 
                                            value={zone.code}
                                            onChange={(e) => {
                                                const newZones = locationHierarchy.zones.map(z => z.id === zone.id ? { ...z, code: e.target.value.toUpperCase() } : z);
                                                setLocationHierarchy({ ...locationHierarchy, zones: newZones });
                                            }}
                                            className="h-12 bg-white border-gray-200 rounded-2xl font-black text-sm text-black px-4 uppercase shadow-sm"
                                        />
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-12 w-12 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
                                            onClick={() => {
                                                const newZones = locationHierarchy.zones.filter(z => z.id !== zone.id);
                                                setLocationHierarchy({ ...locationHierarchy, zones: newZones });
                                            }}
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
          )}

          {activeTab === "woredas" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                 <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#ED1C24]">
                            <Map className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-black tracking-tighter">Woreda Management</h3>
                            <p className="text-gray-400 font-medium">Manage district-level woredas linked to zones.</p>
                        </div>
                    </div>
                    <Button onClick={addWoreda} disabled={locationHierarchy.zones.length === 0} className="bg-black text-white rounded-2xl h-14 px-8 font-black gap-2">
                        <Plus className="h-5 w-5" /> Add New Woreda
                    </Button>
                </div>

                <div className="space-y-4">
                    {locationHierarchy.woredas.length === 0 && (
                        <div className="h-40 flex flex-col items-center justify-center text-gray-300 gap-2 font-medium">
                            <Map className="h-10 w-10 opacity-20" />
                            {locationHierarchy.zones.length === 0 ? "Create a Zone first." : "No woredas created yet."}
                        </div>
                    )}
                    <div className="grid gap-4">
                        {locationHierarchy.woredas.map((woreda) => (
                            <div key={woreda.id} className="flex flex-col md:flex-row md:items-end gap-6 p-8 bg-gray-50 rounded-[40px] border border-gray-100 group hover:bg-white transition-all shadow-sm">
                                <div className="w-full md:w-64 space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 px-1">Parent Zone</Label>
                                    <select 
                                        value={woreda.zone_id}
                                        onChange={(e) => {
                                            const newWoredas = locationHierarchy.woredas.map(w => w.id === woreda.id ? { ...w, zone_id: e.target.value } : w);
                                            setLocationHierarchy({ ...locationHierarchy, woredas: newWoredas });
                                        }}
                                        className="h-12 w-full rounded-2xl bg-white border border-gray-200 px-4 text-sm font-black text-black focus:ring-red-500 shadow-sm"
                                    >
                                        {locationHierarchy.zones.map(z => <option key={z.id} value={z.id}>{z.name} ({z.code})</option>)}
                                    </select>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 px-1">Woreda Name</Label>
                                    <Input 
                                        value={woreda.name}
                                        onChange={(e) => {
                                            const newWoredas = locationHierarchy.woredas.map(w => w.id === woreda.id ? { ...w, name: e.target.value } : w);
                                            setLocationHierarchy({ ...locationHierarchy, woredas: newWoredas });
                                        }}
                                        className="h-12 bg-white border-gray-200 rounded-2xl font-black text-sm text-black px-4 shadow-sm"
                                    />
                                </div>
                                <div className="w-full md:w-40 space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 px-1">Woreda Code</Label>
                                    <div className="flex items-center gap-3">
                                        <Input 
                                            value={woreda.code}
                                            onChange={(e) => {
                                                const newWoredas = locationHierarchy.woredas.map(w => w.id === woreda.id ? { ...w, code: e.target.value.toUpperCase() } : w);
                                                setLocationHierarchy({ ...locationHierarchy, woredas: newWoredas });
                                            }}
                                            className="h-12 bg-white border-gray-200 rounded-2xl font-black text-sm text-black px-4 uppercase shadow-sm"
                                        />
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-12 w-12 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
                                            onClick={() => {
                                                const newWoredas = locationHierarchy.woredas.filter(w => w.id !== woreda.id);
                                                setLocationHierarchy({ ...locationHierarchy, woredas: newWoredas });
                                            }}
                                        >
                                            <Trash2 className="h-5 w-5" />
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
        <div className="p-6 bg-gray-50 border-t border-gray-50 flex justify-end gap-4 sticky bottom-0 z-10">
          <Button
            variant="ghost"
            onClick={fetchInitialData}
            className="hover:bg-white rounded-xl h-14 px-8 font-bold text-gray-500 transition-all gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Reset Changes
          </Button>
          <Button
            onClick={handleSaveConfig}
            disabled={saving}
            className={`rounded-2xl h-14 px-10 font-black text-white shadow-2xl transition-all flex items-center gap-2
              ${success ? "bg-green-500 hover:bg-green-600 shadow-green-500/20" : "bg-black hover:bg-[#ED1C24] shadow-black/10 hover:shadow-red-500/20"}`}
          >
            {saving ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <RefreshCw className="h-5 w-5" />
              </motion.div>
            ) : success ? (
              <><Check className="h-5 w-5" /> All Settings Saved</>
            ) : (
              <><Save className="h-5 w-5" /> Save All Configurations</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
