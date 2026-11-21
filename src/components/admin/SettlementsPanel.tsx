"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Play, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type PayoutSettings = {
  enabled?: boolean;
  dry_run?: boolean;
  interval_minutes?: number;
  fee_percent?: number;
  start_at?: string;
  last_run_at?: string;
  last_run_summary?: string;
};

type Payout = {
  id: string;
  invoice_number: string;
  purpose: string;
  amount_gross: number;
  fee_percent: number;
  amount_net: number;
  currency: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  status: string;
  reason?: string;
  attempts?: number;
  created_at?: string;
  completed_at?: string;
};

const INTERVALS = [5, 10, 15, 30, 60];
const PAGE = 25;
const STATUSES = ["", "SUCCESS", "SUBMITTED", "PENDING", "FAILED", "UNKNOWN", "SKIPPED"];

const STATUS_STYLE: Record<string, string> = {
  SUCCESS: "bg-emerald-100 text-emerald-700",
  SUBMITTED: "bg-sky-100 text-sky-700",
  PENDING: "bg-slate-100 text-slate-600",
  SUBMITTING: "bg-slate-100 text-slate-600",
  FAILED: "bg-red-100 text-red-700",
  UNKNOWN: "bg-amber-100 text-amber-800",
  SKIPPED: "bg-slate-100 text-slate-500",
};

const STATUS_LABEL: Record<string, string> = {
  SUCCESS: "Paid out",
  SUBMITTED: "Sent, awaiting bank",
  PENDING: "Queued",
  SUBMITTING: "Sending",
  FAILED: "Failed",
  UNKNOWN: "Needs a check",
  SKIPPED: "Skipped",
};

const selectClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-200";

function errMsg(e: any, fallback: string): string {
  const d = e?.response?.data;
  if (typeof d === "string") return d.trim() || fallback;
  return d?.message || d?.error || fallback;
}

const money = (n: number, cur: string) => `${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${cur}`;
const when = (iso?: string) => (iso ? new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "—");

export function SettlementsPanel() {
  const [saved, setSaved] = useState<PayoutSettings>({});
  const [form, setForm] = useState<PayoutSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [busyId, setBusyId] = useState("");

  const loadSettings = useCallback(async () => {
    try {
      const res = await api.get("/payment/settings");
      const p: PayoutSettings = res.data?.settings?.payout || {};
      setSaved(p);
      setForm(p);
    } catch {
      toast.error("Could not load the settlement settings");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPayouts = useCallback(
    async (offset = 0) => {
      try {
        const res = await api.get("/payment/payouts", { params: { status: filter || undefined, limit: PAGE, offset } });
        const rows: Payout[] = res.data?.payouts || [];
        setPayouts((prev) => (offset === 0 ? rows : [...prev, ...rows]));
        setTotal(res.data?.total || 0);
      } catch {
        toast.error("Could not load payouts");
      }
    },
    [filter]
  );

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    loadPayouts(0);
  }, [loadPayouts]);

  const enabled = !!form.enabled;
  const dryRun = form.dry_run !== false; // the server default is on
  const interval = form.interval_minutes || 10;
  const fee = form.fee_percent || 0;
  const dirty =
    !!form.enabled !== !!saved.enabled ||
    (form.dry_run !== false) !== (saved.dry_run !== false) ||
    interval !== (saved.interval_minutes || 10) ||
    fee !== (saved.fee_percent || 0);
  const feeValid = Number.isFinite(fee) && fee >= 0 && fee <= 50;
  const example = Math.floor(100 * (100 - fee)) / 100;

  const mode = !saved.enabled ? "off" : saved.dry_run !== false ? "dry" : "live";

  const save = async () => {
    if (!feeValid) return;
    // Switching to real transfers moves money, so make that a deliberate step.
    const goingLive = enabled && !dryRun && (mode !== "live");
    if (goingLive && !confirm(
      `Turn on real payouts?\n\nFrom now on, every donation and membership payment confirmed after this moment is sent from the ArifPay wallet to its bank account every ${interval} minutes, minus ${fee}%.\n\nPayments received before now are never paid out automatically.\n\nTip: run in test mode first and check what it would pay.`
    )) return;
    setSaving(true);
    try {
      const res = await api.put("/payment/payout-settings", {
        enabled,
        dry_run: dryRun,
        interval_minutes: interval,
        fee_percent: fee,
      });
      const p: PayoutSettings = res.data?.settings || {};
      setSaved(p);
      setForm(p);
      toast.success("Settlement settings saved");
    } catch (e: any) {
      toast.error(errMsg(e, "Could not save the settings"));
    } finally {
      setSaving(false);
    }
  };

  const runNow = async () => {
    setRunning(true);
    try {
      const res = await api.post("/payment/payouts/run");
      toast.success(res.data?.summary || "Run finished");
      await Promise.all([loadSettings(), loadPayouts(0)]);
    } catch (e: any) {
      toast.error(errMsg(e, "The run failed"));
    } finally {
      setRunning(false);
    }
  };

  const retry = async (p: Payout) => {
    const again = p.status === "SKIPPED";
    // An unanswered transfer is repeated under the same reference, which ArifPay de-duplicates.
    // A failed one is sent as a brand-new transfer, so it could be paid twice if the first did go through.
    const newReference = p.status === "FAILED";
    const warning = again
      ? `Check ${p.invoice_number} again?\n\nIt is looked at again on the next run, using the bank details now on record.`
      : newReference
        ? `Send ${money(p.amount_net, p.currency)} to ${p.account_name || p.account_number} again as a new transfer?\n\nOpen the ArifPay dashboard first and make sure the first attempt did not go through. A second transfer cannot be undone.`
        : `Send ${money(p.amount_net, p.currency)} to ${p.account_name || p.account_number} again?\n\nThe first attempt got no answer from ArifPay. Check the ArifPay dashboard first. It is repeated under the same reference, so ArifPay will not pay twice if it already went through.`;
    if (!confirm(warning)) return;
    setBusyId(p.id);
    try {
      await api.post(`/payment/payouts/${p.id}/retry`, { new_reference: newReference });
      toast.success(again ? "Will be checked on the next run" : "Queued for the next run");
      await loadPayouts(0);
    } catch (e: any) {
      toast.error(errMsg(e, "Could not retry"));
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="space-y-6">
      <div
        role="status"
        className={cn(
          "rounded-xl border px-4 py-3 text-sm",
          loading
            ? "border-slate-200 bg-slate-50 text-slate-500"
            : mode === "live"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : mode === "dry"
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-slate-200 bg-slate-50 text-slate-600"
        )}
      >
        {loading ? (
          "Loading…"
        ) : mode === "live" ? (
          <>Payouts are <b>live</b>. Checked every {saved.interval_minutes || 10} minutes. Last run: {when(saved.last_run_at)}.</>
        ) : mode === "dry" ? (
          <>Test mode. Each run reports what <b>would</b> be paid and sends nothing. Last run: {when(saved.last_run_at)}.</>
        ) : (
          <>Payouts are <b>off</b>. Payments stay in the ArifPay wallet until you turn this on.</>
        )}
        {!loading && saved.last_run_summary && <div className="mt-1 text-xs opacity-80">{saved.last_run_summary}</div>}
      </div>

      <form
        className="rounded-xl border border-slate-200 bg-white"
        onSubmit={(e) => {
          e.preventDefault();
          if (dirty && !saving && feeValid) save();
        }}
      >
        <div className="space-y-6 p-5 md:p-6">
          <p className="max-w-3xl text-sm text-slate-600">
            When a payment is confirmed, its money lands in the ArifPay wallet. Every few minutes the system sends each confirmed
            payment from the wallet to the bank account that payment belongs to: one transfer per payment, minus ArifPay&apos;s fee.
          </p>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Payout settings">
            <label className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-sm">
              <input type="checkbox" className="mt-0.5 h-4 w-4" checked={enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
              <span>
                <span className="block font-semibold text-slate-800">Send payouts automatically</span>
                <span className="text-xs text-slate-500">Off means nothing is checked or sent.</span>
              </span>
            </label>
            <label className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-sm">
              <input type="checkbox" className="mt-0.5 h-4 w-4" checked={dryRun} onChange={(e) => setForm({ ...form, dry_run: e.target.checked })} />
              <span>
                <span className="block font-semibold text-slate-800">Test mode</span>
                <span className="text-xs text-slate-500">Report what would be paid. Sends nothing.</span>
              </span>
            </label>
            <div>
              <Label htmlFor="po-interval">Check every</Label>
              <select id="po-interval" className={selectClass} value={interval} onChange={(e) => setForm({ ...form, interval_minutes: Number(e.target.value) })}>
                {INTERVALS.map((m) => (
                  <option key={m} value={m}>{m} minutes</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="po-fee">ArifPay fee (%)</Label>
              <Input
                id="po-fee"
                type="number"
                inputMode="decimal"
                min={0}
                max={50}
                step="0.01"
                className="tabular-nums"
                aria-invalid={!feeValid}
                value={form.fee_percent ?? ""}
                onChange={(e) => setForm({ ...form, fee_percent: e.target.value === "" ? 0 : Number(e.target.value) })}
              />
              <p className={cn("mt-1 text-xs", feeValid ? "text-slate-500" : "text-red-600")}>
                {feeValid ? `A 100.00 payment sends ${example.toFixed(2)}.` : "Enter a number from 0 to 50."}
              </p>
            </div>
          </section>

          <p className="text-xs text-slate-500">
            {saved.start_at
              ? <>Only payments confirmed after <b>{when(saved.start_at)}</b> are paid out. Earlier ones are left alone.</>
              : "The first time you turn this on, that moment becomes the start: earlier payments are never paid out automatically."}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 rounded-b-xl border-t border-slate-100 bg-slate-50 px-5 py-3 md:px-6">
          <span className={cn("mr-auto text-xs font-medium", dirty ? "text-amber-700" : "text-slate-400")} role="status">
            {dirty ? "Unsaved changes" : "All changes saved"}
          </span>
          <Button type="button" variant="outline" onClick={runNow} disabled={running || dirty || !saved.enabled} title={dirty ? "Save your changes first" : !saved.enabled ? "Turn payouts on first" : undefined}>
            <Play className="mr-1 h-4 w-4" /> {running ? "Running…" : saved.dry_run !== false ? "Run a test now" : "Run now"}
          </Button>
          <Button type="submit" disabled={!dirty || saving || loading || !feeValid} className="bg-[#ED1C24] text-white hover:bg-red-700 disabled:opacity-50">
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </div>
      </form>

      <section className="space-y-3" aria-labelledby="payouts-h">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="payouts-h" className="text-sm font-bold text-slate-900">
            Payouts <span className="font-normal text-slate-400">({total})</span>
          </h2>
          <div className="flex items-center gap-2">
            <Label htmlFor="po-filter" className="sr-only">Filter by status</Label>
            <select id="po-filter" className={cn(selectClass, "h-9 w-auto")} value={filter} onChange={(e) => setFilter(e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s ? STATUS_LABEL[s] : "All statuses"}</option>
              ))}
            </select>
            <Button variant="ghost" size="sm" onClick={() => loadPayouts(0)} aria-label="Refresh payouts">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-right">Received</th>
                <th className="px-4 py-3 text-right">Sent (after fee)</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {payouts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    {filter ? "Nothing with this status." : "No payouts yet. Payments confirmed after you turn payouts on appear here."}
                  </td>
                </tr>
              )}
              {payouts.map((p) => (
                <tr key={p.id} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3">
                    <div className="font-mono text-slate-800">{p.invoice_number}</div>
                    <div className="text-xs text-slate-400">{p.purpose === "MEMBERSHIP" ? "Membership" : "Donation"} · {when(p.created_at)}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-700">{money(p.amount_gross, p.currency)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-800">
                    {p.amount_net ? money(p.amount_net, p.currency) : "—"}
                    {!!p.fee_percent && !!p.amount_net && <div className="text-xs text-slate-400">{p.fee_percent}% fee</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-slate-800">{p.account_number || "—"}</div>
                    <div className="max-w-[220px] truncate text-xs text-slate-500">{[p.account_name, p.bank_name].filter(Boolean).join(" · ")}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", STATUS_STYLE[p.status] || STATUS_STYLE.PENDING)}>
                      {STATUS_LABEL[p.status] || p.status}
                    </span>
                    {p.reason && (
                      <div className="mt-1 flex max-w-[300px] items-start gap-1 text-xs text-slate-500">
                        {(p.status === "FAILED" || p.status === "UNKNOWN") && <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" aria-hidden="true" />}
                        <span>{p.reason}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {(p.status === "FAILED" || p.status === "UNKNOWN" || p.status === "SKIPPED") && (
                      <Button variant="outline" size="sm" disabled={busyId === p.id} onClick={() => retry(p)}>
                        {p.status === "SKIPPED" ? "Check again" : "Retry"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payouts.length < total && (
          <div className="text-center">
            <Button variant="outline" size="sm" onClick={() => loadPayouts(payouts.length)}>Show more</Button>
          </div>
        )}
      </section>
    </div>
  );
}
