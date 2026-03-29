"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, Check, RefreshCw, Hash, ShieldAlert } from "lucide-react";
import api from "@/lib/api";

type MemberIDConfig = {
  prefix: string;
  padding: number;
};

export default function SystemSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [memberConfig, setMemberConfig] = useState<MemberIDConfig>({
    prefix: "ERCS-",
    padding: 6,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/system-settings");
      if (res.data.settings?.member_id_config) {
        setMemberConfig(JSON.parse(res.data.settings.member_id_config));
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess(false);
      
      await api.post("/system-settings", {
        key: "member_id_config",
        value_json: JSON.stringify(memberConfig),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
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
    <div className="space-y-10 w-full">
      {/* Header */ }
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
          <Settings className="h-3.5 w-3.5" /> System Configuration
        </div>
        <h1 className="text-5xl font-black text-black tracking-tighter">Global Settings</h1>
        <p className="text-gray-500 font-medium text-lg">Manage core operational behaviors and identifier formatting rules.</p>
      </div>

      {/* Settings Sections */ }
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-10 space-y-10">
          
          <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
            <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#ED1C24]">
              <Hash className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-black tracking-tighter">Member ID Generator</h3>
              <p className="text-gray-400 font-medium">Configure the randomized, unique ERCS ID format generated for new registrations.</p>
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
                  className="h-14 bg-gray-50 border-gray-200 rounded-2xl text-lg font-black focus:ring-red-500 focus:border-red-500"
                />
                <p className="text-xs text-gray-400 font-medium">Prefix added to every ID. End with hyphen if desired.</p>
              </div>

              <div className="space-y-3">
                <Label className="uppercase tracking-widest text-[10px] font-black text-gray-400">Zero Padding</Label>
                <select
                  value={memberConfig.padding}
                  onChange={(e) => setMemberConfig({ ...memberConfig, padding: parseInt(e.target.value) })}
                  className="flex h-14 w-full rounded-2xl bg-gray-50 text-black border border-gray-200 px-4 text-lg font-black focus:ring-2 focus:ring-red-500"
                >
                  <option value={3}>3 Digits (001)</option>
                  <option value={4}>4 Digits (0001)</option>
                  <option value={5}>5 Digits (00001)</option>
                  <option value={6}>6 Digits (000001)</option>
                </select>
                <p className="text-xs text-gray-400 font-medium">The fixed length of the randomly generated numeric suffix.</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col justify-center gap-4 h-full">
                <Label className="uppercase tracking-widest text-[10px] font-black text-gray-400">Preview Layout</Label>
                <div className="text-4xl sm:text-5xl font-black text-black tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {memberConfig.prefix}{Array(memberConfig.padding).fill('X').join('')}
                </div>
                <div className="flex flex-col gap-2 mt-4 text-sm text-gray-500 font-medium">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" /> Generates highly secure, randomized digits
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0" /> Automatically guarantees collision uniqueness
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */ }
        <div className="p-6 bg-gray-50 border-t border-gray-50 flex justify-end gap-4">
          <Button
            variant="ghost"
            onClick={fetchSettings}
            className="hover:bg-white rounded-xl h-12 px-6 font-bold text-gray-500 transition-all gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className={`rounded-xl h-12 px-8 font-black text-white shadow-lg transition-all flex items-center gap-2
              ${success ? "bg-green-500 hover:bg-green-600 shadow-green-500/20" : "bg-black hover:bg-[#ED1C24] shadow-black/10 hover:shadow-red-500/20"}`}
          >
            {saving ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <RefreshCw className="h-5 w-5" />
              </motion.div>
            ) : success ? (
              <><Check className="h-5 w-5" /> Saved</>
            ) : (
              <><Save className="h-5 w-5" /> Save Configuration</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
