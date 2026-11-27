"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, ShieldOff, Smartphone } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Panel } from "@/components/admin/page-ui";
import { Button } from "@/components/ui/button";

type Setup = { secret: string; qrCodeUrl: string };
type Method = "SMS" | "APP";

const fieldClass =
  "h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/30";

function errorText(err: any, fallback: string): string {
  const data = err?.response?.data;
  if (typeof data === "string" && data.trim()) return data.trim();
  return data?.message || data?.error || fallback;
}

/**
 * Turn two-factor sign-in on or off for the signed-in staff account. Turning it on proves the
 * person can receive codes (SMS or an authenticator app) before it takes effect; turning it off
 * needs the account password.
 */
export function TwoFactorCard() {
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [phone, setPhone] = useState("");

  const [setup, setSetup] = useState<Setup | null>(null);
  const [method, setMethod] = useState<Method>("SMS");
  const [code, setCode] = useState("");
  const [smsSent, setSmsSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const [turningOff, setTurningOff] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get("/auth/me")
      .then((res) => {
        if (cancelled) return;
        setEnabled(Boolean(res.data?.is_mfa_enabled));
        setPhone(res.data?.phone_number || "");
      })
      .catch((err) => !cancelled && toast.error(errorText(err, "Could not load your 2FA status")))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const sendSms = async (secret: string) => {
    try {
      await api.post("/auth/mfa/send-otp", { secret });
      setSmsSent(true);
      toast.success("Code sent to your phone");
    } catch (err) {
      setSmsSent(false);
      toast.error(errorText(err, "Could not send the SMS code. Try again or use an authenticator app."));
    }
  };

  const startSetup = async () => {
    setBusy(true);
    try {
      const res = await api.post("/auth/setup-mfa");
      const next = { secret: res.data.secret as string, qrCodeUrl: res.data.qr_code_url as string };
      if (res.data.phone_number) setPhone(res.data.phone_number);
      setSetup(next);
      setCode("");
      setSmsSent(false);
      // With a phone on the account, send the code straight away so the person is not left waiting.
      const hasPhone = Boolean(res.data.phone_number || phone);
      setMethod(hasPhone ? "SMS" : "APP");
      if (hasPhone) await sendSms(next.secret);
    } catch (err) {
      toast.error(errorText(err, "Could not start 2FA setup"));
    } finally {
      setBusy(false);
    }
  };

  const cancelSetup = () => {
    setSetup(null);
    setCode("");
    setSmsSent(false);
  };

  const confirmSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setup) return;
    setBusy(true);
    try {
      const res = await api.post("/auth/verify-mfa", { code, secret: setup.secret });
      if (res.data?.success) {
        setEnabled(true);
        cancelSetup();
        toast.success("Two-factor authentication is on. You will be asked for a code when you sign in.");
      } else {
        toast.error("That code is not valid. Check it and try again.");
      }
    } catch (err) {
      toast.error(errorText(err, "Could not verify the code"));
    } finally {
      setBusy(false);
    }
  };

  const turnOff = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/auth/mfa/disable", { current_password: password });
      setEnabled(false);
      setTurningOff(false);
      setPassword("");
      toast.success("Two-factor authentication is off");
    } catch (err) {
      const msg = errorText(err, "");
      toast.error(/incorrect/i.test(msg) ? "Your password is incorrect" : msg || "Could not turn off 2FA");
    } finally {
      setBusy(false);
    }
  };

  const Icon = enabled ? ShieldCheck : ShieldOff;

  return (
    <Panel
      title="Two-factor authentication"
      description="Ask for a one-time code, as well as your password, every time you sign in."
      actions={<Icon className={cn("h-4 w-4", enabled ? "text-emerald-600" : "text-gray-300")} aria-hidden />}
    >
      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                  enabled ? "border-green-200 bg-green-50 text-green-700" : "border-gray-200 bg-gray-50 text-gray-500"
                )}
              >
                {enabled ? "On" : "Off"}
              </span>
              <p className="text-sm text-gray-600">
                {enabled ? "You are asked for a code when you sign in." : "Your account is protected by your password only."}
              </p>
            </div>
            {!setup && !turningOff && (
              enabled ? (
                <Button type="button" variant="outline" onClick={() => setTurningOff(true)} className="h-10 rounded-xl border-gray-200 text-[10px] font-black uppercase tracking-widest">
                  Turn off
                </Button>
              ) : (
                <Button type="button" onClick={startSetup} disabled={busy} className="h-10 rounded-xl bg-[#ED1C24] px-5 text-[10px] font-black uppercase tracking-widest text-white">
                  {busy ? "Starting…" : "Turn on"}
                </Button>
              )
            )}
          </div>

          {setup && (
            <form onSubmit={confirmSetup} className="max-w-xl space-y-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
              <div role="tablist" aria-label="How to receive codes" className="inline-flex rounded-xl bg-gray-100 p-1">
                {(["SMS", "APP"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={method === m}
                    onClick={() => setMethod(m)}
                    className={cn("rounded-lg px-4 py-1.5 text-xs font-black transition-colors", method === m ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black")}
                  >
                    {m === "SMS" ? "SMS code" : "Authenticator app"}
                  </button>
                ))}
              </div>

              {method === "SMS" ? (
                <div className="space-y-2">
                  {phone ? (
                    <>
                      <p className="flex items-center gap-2 text-sm text-gray-700">
                        <Smartphone className="h-4 w-4 text-gray-400" aria-hidden />
                        {smsSent ? "We sent a 6-digit code to" : "We will text a 6-digit code to"} <b>{phone}</b>.
                      </p>
                      <button type="button" onClick={() => sendSms(setup.secret)} className="text-xs font-bold text-[#B5121B] hover:underline">
                        {smsSent ? "Send a new code" : "Send the code"}
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-amber-700">There is no phone number on your account. Add one above, or use an authenticator app.</p>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-4">
                  <div className="rounded-xl bg-white p-3">
                    <QRCodeSVG value={setup.qrCodeUrl} size={148} />
                  </div>
                  <div className="min-w-0 space-y-1 text-sm text-gray-600">
                    <p>Scan this with Google Authenticator, Microsoft Authenticator or a similar app. Or type this key in:</p>
                    <code className="block break-all rounded-lg bg-white px-3 py-2 text-xs font-bold text-black">{setup.secret}</code>
                  </div>
                </div>
              )}

              <label className="flex flex-col gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                6-digit code
                <input
                  className={cn(fieldClass, "max-w-[200px] text-center text-lg tracking-[0.4em]")}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  required
                />
              </label>

              <div className="flex gap-2">
                <Button type="submit" disabled={busy || code.length !== 6} className="h-11 rounded-xl bg-[#ED1C24] px-6 text-[10px] font-black uppercase tracking-widest text-white">
                  {busy ? "Checking…" : "Turn on 2FA"}
                </Button>
                <Button type="button" variant="outline" onClick={cancelSetup} className="h-11 rounded-xl border-gray-200 text-[10px] font-black uppercase tracking-widest">
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {turningOff && (
            <form onSubmit={turnOff} className="max-w-md space-y-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
              <label className="flex flex-col gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Enter your password to turn off 2FA
                <input type="password" className={fieldClass} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
              </label>
              <div className="flex gap-2">
                <Button type="submit" disabled={busy || !password} className="h-11 rounded-xl bg-black px-6 text-[10px] font-black uppercase tracking-widest text-white">
                  {busy ? "Turning off…" : "Turn off 2FA"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setTurningOff(false); setPassword(""); }} className="h-11 rounded-xl border-gray-200 text-[10px] font-black uppercase tracking-widest">
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </Panel>
  );
}
