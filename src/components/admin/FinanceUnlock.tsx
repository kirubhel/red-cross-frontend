"use client";

import { useEffect, useState } from "react";
import { KeyRound, LockKeyhole } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api, { getFinanceToken, setFinanceToken } from "@/lib/api";

interface FinanceUnlockProps {
  children: React.ReactNode;
  onUnlocked?: () => void;
}

export function FinanceUnlock({ children, onUnlocked }: FinanceUnlockProps) {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [unlocked, setUnlocked] = useState(Boolean(getFinanceToken()));
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    api.get("/payment/finance-lock").then(({ data }) => {
      if (active) setConfigured(Boolean(data.configured));
    }).catch(() => { if (active) setError("Could not check the finance lock. Try reloading this page."); });
    const relock = () => { setUnlocked(false); setPassword(""); };
    window.addEventListener("finance-lock-expired", relock);
    return () => { active = false; window.removeEventListener("finance-lock-expired", relock); };
  }, []);

  async function unlock(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/payment/finance-lock/unlock", { password });
      setFinanceToken(data.token);
      setPassword("");
      setUnlocked(true);
      onUnlocked?.();
      const remaining = Math.max(0, data.expires_at * 1000 - Date.now());
      window.setTimeout(() => {
        if (getFinanceToken() === data.token) {
          setFinanceToken(null);
          window.dispatchEvent(new Event("finance-lock-expired"));
        }
      }, remaining);
    } catch (cause: unknown) {
      const response = cause as { response?: { status?: number } };
      setError(response.response?.status === 429 ? "Too many attempts. Try again in 2 minutes." : "Incorrect finance password or finance lock unavailable.");
    } finally { setBusy(false); }
  }

  if (configured === null) return <div className="p-12 text-center text-sm text-gray-500">{error || "Checking finance access…"}</div>;
  if (unlocked && configured) return <>{children}</>;
  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <LockKeyhole className="mb-4 h-9 w-9 text-[#ED1C24]" aria-hidden="true" />
      <h1 className="text-xl font-bold text-gray-900">Payment access locked</h1>
      {!configured ? (
        <p className="mt-3 text-sm text-gray-600">A super admin must set a finance password in <Link href="/admin/settings" className="font-semibold text-[#ED1C24] underline">Settings</Link> → Security before payment records can be opened.</p>
      ) : (
        <form onSubmit={unlock} className="mt-5 space-y-4">
          <label htmlFor="finance-password" className="block text-sm font-semibold text-gray-700">Finance password</label>
          <Input id="finance-password" type="password" autoComplete="off" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={busy || !password} className="w-full bg-[#ED1C24] text-white hover:bg-red-700"><KeyRound className="mr-2 h-4 w-4" />{busy ? "Unlocking…" : "Unlock payments"}</Button>
        </form>
      )}
    </div>
  );
}
