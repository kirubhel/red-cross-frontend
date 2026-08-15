"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing, CheckCircle2, AlertCircle, Laptop } from "lucide-react";
import { toast } from "sonner";
import {
  isPushNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  showTestDesktopNotification,
} from "@/lib/push-notifications";

export function DesktopPushToggle({ compact = false }: { compact?: boolean }) {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isSupp = isPushNotificationSupported();
    setSupported(isSupp);
    if (isSupp) {
      setPermission(getNotificationPermission());
    }
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    try {
      const res = await requestNotificationPermission();
      setPermission(res);
      if (res === "granted") {
        toast.success("Desktop notifications enabled successfully!");
        await showTestDesktopNotification();
      } else if (res === "denied") {
        toast.error("Notification permission was blocked in your browser settings.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to enable notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    try {
      const ok = await showTestDesktopNotification();
      if (ok) {
        toast.success("Test notification dispatched to your desktop!");
      }
    } catch {
      toast.error("Could not trigger desktop notification.");
    }
  };

  if (!supported) return null;

  if (compact) {
    if (permission === "granted") {
      return (
        <button
          onClick={handleTest}
          title="Desktop Notifications Active — Click to Test"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 text-[10px] font-black uppercase tracking-wider hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          <BellRing className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span>Desktop Push On</span>
        </button>
      );
    }

    return (
      <button
        onClick={handleEnable}
        disabled={loading}
        title="Enable Desktop Notifications"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-[#ED1C24] border border-red-200/60 text-[10px] font-black uppercase tracking-wider hover:bg-red-100 transition-colors cursor-pointer"
      >
        <Laptop className="w-3 h-3 text-[#ED1C24]" />
        <span>{loading ? "Enabling..." : "Enable Desktop Push"}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-100 mb-2">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-700">
          <Laptop className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <p className="text-[11px] font-black text-black leading-none">Desktop & PWA Alerts</p>
          <p className="text-[9px] text-gray-500 font-bold mt-0.5">
            {permission === "granted"
              ? "Receiving broadcast & direct alerts"
              : permission === "denied"
              ? "Blocked in browser settings"
              : "Enable native desktop alerts"}
          </p>
        </div>
      </div>

      {permission === "granted" ? (
        <button
          onClick={handleTest}
          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
        >
          <CheckCircle2 className="w-3 h-3" />
          Test Alert
        </button>
      ) : (
        <button
          onClick={handleEnable}
          disabled={loading || permission === "denied"}
          className="px-2.5 py-1 rounded-lg bg-[#ED1C24] hover:bg-[#c9141b] disabled:opacity-50 text-white text-[10px] font-bold shadow-xs transition-all cursor-pointer"
        >
          {loading ? "Enabling..." : permission === "denied" ? "Blocked" : "Enable"}
        </button>
      )}
    </div>
  );
}
