"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api, { setFinanceToken } from "@/lib/api";

export function FinancePasswordSettings() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { api.get("/payment/finance-lock").then(({ data }) => setConfigured(Boolean(data.configured))).catch(() => toast.error("Could not check finance password status")); }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (next !== confirm) { toast.error("New passwords do not match"); return; }
    if (next.length < 12 || next.length > 128) { toast.error("Use 12 to 128 characters"); return; }
    setBusy(true);
    try {
      await api.put("/payment/finance-lock/password", { current_password: current, new_password: next });
      setFinanceToken(null);
      window.dispatchEvent(new Event("finance-lock-expired"));
      setCurrent(""); setNext(""); setConfirm(""); setConfigured(true);
      toast.success("Finance password saved. Existing payment unlocks have expired.");
    } catch (cause: unknown) {
      const response = cause as { response?: { status?: number } };
      toast.error(response.response?.status === 429 ? "Too many attempts. Try again in 2 minutes." : "Could not save finance password. Check the current password or try later.");
    }
    finally { setBusy(false); }
  }

  return <section className="rounded-2xl border border-gray-200 p-6">
    <h4 className="text-lg font-bold text-gray-900">Payment access password</h4>
    <p className="mt-1 text-sm text-gray-500">A separate shared password is required to open Payments and Payment Configuration. Only super admins can set it.</p>
    <p className="mt-2 text-xs font-semibold text-gray-600">Status: {configured === null ? "Checking…" : configured ? "Set" : "Not set"}</p>
    <form onSubmit={save} className="mt-5 max-w-md space-y-3">
      {configured && <Input aria-label="Current finance password" type="password" autoComplete="current-password" placeholder="Current finance password" value={current} onChange={e => setCurrent(e.target.value)} required />}
      <Input aria-label="New finance password" type="password" autoComplete="new-password" placeholder="New finance password (12+ characters)" value={next} onChange={e => setNext(e.target.value)} required minLength={12} maxLength={128} />
      <Input aria-label="Confirm finance password" type="password" autoComplete="new-password" placeholder="Confirm new finance password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
      <Button type="submit" disabled={busy || configured === null} className="bg-[#ED1C24] text-white hover:bg-red-700">{busy ? "Saving…" : configured ? "Change finance password" : "Set finance password"}</Button>
    </form>
  </section>;
}
