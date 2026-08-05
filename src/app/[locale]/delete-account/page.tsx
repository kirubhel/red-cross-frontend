"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Trash2, Loader2, ArrowLeft, ShieldOff, Eye, EyeOff, User, Lock } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [noPassword, setNoPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const canSubmit = identifier.trim() !== "" && (noPassword || password !== "");

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      setLoading(true);
      await api.delete("/auth/me", {
        data: { identifier: identifier.trim(), password: noPassword ? "" : password },
      });
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("ercs_id");
      setDeleted(true);
      setTimeout(() => router.push("/"), 4000);
    } catch (err: any) {
      const raw = err?.response?.data;
      const msg = typeof raw === "string" ? raw : raw?.error ?? "Please check your credentials and try again.";
      toast.error("Could not delete account", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  if (deleted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="h-20 w-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
            <ShieldOff className="h-9 w-9 text-green-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Account Deleted</h1>
          <p className="text-gray-400 font-medium leading-relaxed">
            Your account and all associated personal data have been permanently removed. You will be redirected to the home page shortly.
          </p>
          <p className="text-xs font-black uppercase tracking-widest text-gray-600">Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg space-y-8">
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest group"
        >
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
          Back to Profile
        </Link>

        <div className="bg-gray-900 border border-gray-800 rounded-[32px] p-8 md:p-10 space-y-8">
          {/* Title */}
          <div className="flex items-start gap-5">
            <div className="h-14 w-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-6 w-6 text-[#ED1C24]" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-white tracking-tighter">Delete Account</h1>
              <p className="text-gray-400 text-sm font-medium">
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>

          {/* What gets deleted */}
          <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-[#ED1C24]">What will be deleted</p>
            <ul className="space-y-2 text-sm text-gray-400 font-medium">
              {[
                "Your ERCS account and login credentials",
                "Your personal profile and membership data",
                "Your volunteer history and engagement records",
                "Your digital membership card and ERCS ID",
                "Your donation and payment history references",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#ED1C24] mt-0.5">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Per our{" "}
            <Link href="/privacy" className="text-[#ED1C24] underline underline-offset-2">
              Privacy Policy
            </Link>
            , your data will be removed within 30 days. Some records may be retained where required by law.
          </p>

          {/* Credential form */}
          <form onSubmit={handleDelete} className="space-y-5">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">
              Confirm your identity to proceed
            </p>

            {/* Identifier */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Email, Phone, or Membership ID
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="ERCS-AA-Z01-0001 / email / phone"
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl h-14 pl-12 pr-5 font-bold text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all"
                />
              </div>
            </div>

            {/* No-password toggle (Members only) */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="noPassword"
                checked={noPassword}
                onChange={(e) => {
                  setNoPassword(e.target.checked);
                  if (e.target.checked) setPassword("");
                }}
                className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-[#ED1C24] focus:ring-[#ED1C24]"
              />
              <label htmlFor="noPassword" className="text-xs font-bold text-gray-400 cursor-pointer">
                I am a Member — use Membership ID only (no password)
              </label>
            </div>

            {/* Password */}
            <div className={`space-y-2 transition-opacity duration-200 ${noPassword ? "opacity-30 pointer-events-none" : ""}`}>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={noPassword}
                  required={!noPassword}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl h-14 pl-12 pr-12 font-bold text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="flex-1 h-14 rounded-2xl bg-[#ED1C24] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-700 transition-all shadow-lg shadow-red-500/10"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Permanently Delete
              </button>
              <Link
                href="/dashboard/profile"
                className="sm:w-44 h-14 rounded-2xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-black text-xs uppercase tracking-widest flex items-center justify-center transition-all"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        <p className="text-center text-[10px] text-gray-600 font-medium">
          Need help instead?{" "}
          <a href="mailto:mattathiasabraham@gmail.com" className="text-gray-400 hover:text-white transition-colors underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
