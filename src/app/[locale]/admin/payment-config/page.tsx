"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { Landmark, Plus, Pencil, Trash2, KeyRound, Star, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuperAdminGuard } from "@/components/admin/SuperAdminGuard";
import { REGIONS } from "@/lib/constants";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type Purpose = "ALL" | "MEMBERSHIP" | "DONATION";

type Account = {
  id?: string;
  region_id: number;
  branch_id: string;
  zone_name: string;
  purpose: Purpose;
  label: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  is_default: boolean;
  is_active: boolean;
  api_key_set?: boolean;
  api_key_hint?: string;
  api_key?: string;
};

type Branch = { id: string; name: string; region_id: number; zone_id?: string; branch_type: string };

// Banks offered in the dropdown (reference only; ArifPay settles to the account linked to the key).
const BANKS = [
  "Commercial Bank of Ethiopia",
  "Awash Bank",
  "Bank of Abyssinia",
  "Enat Bank",
  "Tsedey Bank",
  "Cooperative Bank of Oromia",
];

const PURPOSE_LABEL: Record<Purpose, string> = {
  ALL: "Membership & Donation",
  MEMBERSHIP: "Membership",
  DONATION: "Donation",
};

// Donations use ONE national account and key (region 0); memberships are per region.
const NATIONAL = 0;

const blank = (regionId: number): Account => ({
  region_id: regionId,
  branch_id: "",
  zone_name: "",
  purpose: regionId === NATIONAL ? "DONATION" : "MEMBERSHIP",
  label: "",
  bank_name: "Commercial Bank of Ethiopia",
  account_number: "",
  account_name: "",
  is_default: false,
  is_active: true,
  api_key: "",
});

const selectClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-200";

export default function PaymentConfigPage() {
  return (
    <SuperAdminGuard>
      <PaymentConfig />
    </SuperAdminGuard>
  );
}

function PaymentConfig() {
  const [regionId, setRegionId] = useState<number>(NATIONAL);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Account | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/payment/accounts");
      setAccounts(res.data?.accounts || []);
    } catch {
      toast.error("Could not load payment accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    api
      .get("/location/branches")
      .then((r) => setBranches(r.data?.branches || r.data || []))
      .catch(() => setBranches([]));
  }, []);

  const byRegion = useMemo(() => {
    const m: Record<number, Account[]> = {};
    accounts.forEach((a) => (m[a.region_id] ||= []).push(a));
    return m;
  }, [accounts]);

  const regionAccounts = byRegion[regionId] || [];
  const regionBranches = branches.filter((b) => b.region_id === regionId);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) await api.put(`/payment/accounts/${editing.id}`, editing);
      else await api.post("/payment/accounts", editing);
      toast.success("Payment account saved");
      setEditing(null);
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (a: Account) => {
    if (!a.id || !confirm(`Delete account ${a.account_number}?`)) return;
    try {
      await api.delete(`/payment/accounts/${a.id}`);
      toast.success("Deleted");
      await load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const hasDefault = (purpose: Purpose) =>
    regionAccounts.some((a) => a.is_active && a.is_default && a.api_key_set && (a.purpose === purpose || a.purpose === "ALL"));
  const keyCount = regionAccounts.filter((a) => a.is_active && a.api_key_set).length;

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black text-slate-900">
            <Landmark className="h-6 w-6 text-[#ED1C24]" /> Payment Configuration
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Choose which bank account and ArifPay API key each region uses for memberships and donations. A member who
            registers in a region is paid to that region&apos;s default account; a zone account is used when the payer&apos;s
            branch matches it.
          </p>
        </div>
        <Button onClick={() => setEditing(blank(regionId))} className="bg-[#ED1C24] text-white hover:bg-red-700">
          <Plus className="mr-1 h-4 w-4" /> Add account
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setRegionId(NATIONAL)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition",
            regionId === NATIONAL ? "border-[#ED1C24] bg-red-50 text-[#ED1C24]" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          )}
        >
          National donations
          <span className={cn("h-2 w-2 rounded-full", (byRegion[NATIONAL] || []).some((a) => a.is_active && a.api_key_set) ? "bg-emerald-500" : "bg-amber-400")} />
        </button>
        {REGIONS.map((r) => {
          const list = byRegion[r.id] || [];
          const active = list.some((a) => a.is_active && a.is_default && a.api_key_set);
          return (
            <button
              key={r.id}
              onClick={() => setRegionId(r.id)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition",
                regionId === r.id ? "border-[#ED1C24] bg-red-50 text-[#ED1C24]" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              {r.name}
              <span className={cn("h-2 w-2 rounded-full", active ? "bg-emerald-500" : "bg-amber-400")} title={active ? "Default account with key set" : "No default account with an API key"} />
            </button>
          );
        })}
      </div>

      {regionId === NATIONAL && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          All donations, from any region, are paid to the one default account below using its single ArifPay API key.
          Region tabs only affect memberships. ArifPay settles to the account linked to the key. An account without its key can&apos;t take online payments.
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-3">
        {((regionId === NATIONAL ? ["DONATION"] : ["MEMBERSHIP"]) as Purpose[]).map((p) => (
          <div key={p} className={cn("rounded-xl border p-4 text-sm", hasDefault(p) ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50")}>
            <div className="font-bold text-slate-800">{p === "MEMBERSHIP" ? "Membership" : "Donation"} routing</div>
            <div className="mt-1 text-slate-600">
              {hasDefault(p) ? "Default account with key configured" : "No default account with a key — online payment is unavailable"}
            </div>
          </div>
        ))}
        <div className={cn("rounded-xl border p-4 text-sm", keyCount ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50")}>
          <div className="font-bold text-slate-800">ArifPay API keys</div>
          <div className="mt-1 text-slate-600">
            {keyCount ? `${keyCount} account(s) with their own key` : "None set — online payment is unavailable for this region"}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Scope</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Bank</th>
              <th className="px-4 py-3">Used for</th>
              <th className="px-4 py-3">API key</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">Loading…</td></tr>
            )}
            {!loading && regionAccounts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  <AlertTriangle className="mx-auto mb-2 h-5 w-5 text-amber-500" />
                  No accounts for this region yet. Add one to route its payments.
                </td>
              </tr>
            )}
            {regionAccounts.map((a) => (
              <tr key={a.id} className={cn("border-t border-slate-100", !a.is_active && "opacity-50")}>
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-800">{a.zone_name || "Regional branch"}</div>
                  {a.branch_id && <div className="text-xs text-slate-400">branch {a.branch_id}</div>}
                </td>
                <td className="px-4 py-3">
                  <div className="font-mono text-slate-800">{a.account_number}</div>
                  <div className="max-w-[260px] truncate text-xs text-slate-500">{a.account_name || a.label}</div>
                </td>
                <td className="px-4 py-3 text-slate-700">{a.bank_name || "—"}</td>
                <td className="px-4 py-3 text-slate-700">{PURPOSE_LABEL[a.purpose]}</td>
                <td className="px-4 py-3">
                  {a.api_key_set ? (
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-slate-700"><KeyRound className="h-3 w-3" />{a.api_key_hint}</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600"><AlertTriangle className="h-3 w-3" />no key</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {a.is_default && <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700"><Star className="h-3 w-3" />Default</span>}
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", a.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                      {a.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => setEditing({ ...a, api_key: "" })} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(a)} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setEditing(null)}>
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">{editing.id ? "Edit" : "Add"} payment account</h2>
              <button onClick={() => setEditing(null)} aria-label="Close"><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {editing.purpose === "MEMBERSHIP" && (<>
              <div>
                <Label>Region</Label>
                <select className={selectClass} value={editing.region_id} onChange={(e) => setEditing({ ...editing, region_id: Number(e.target.value), branch_id: "" })}>
                  {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              </>)}
              <div>
                <Label>Used for</Label>
                <select className={selectClass} value={editing.purpose} onChange={(e) => { const purpose = e.target.value as Purpose; setEditing({ ...editing, purpose, region_id: purpose === "DONATION" ? NATIONAL : editing.region_id || regionId || 1, branch_id: purpose === "DONATION" ? "" : editing.branch_id }); }}>
                  {(["MEMBERSHIP", "DONATION"] as Purpose[]).map((p) => <option key={p} value={p}>{PURPOSE_LABEL[p]}</option>)}
                </select>
              </div>
              {editing.purpose === "MEMBERSHIP" && (
              <div className="sm:col-span-2">
                <Label>Branch (optional — leave empty for the regional default)</Label>
                <select
                  className={selectClass}
                  value={editing.branch_id}
                  onChange={(e) => {
                    const b = regionBranches.find((x) => x.id === e.target.value);
                    setEditing({ ...editing, branch_id: e.target.value, zone_name: b ? b.name : editing.zone_name, is_default: b ? false : editing.is_default });
                  }}
                >
                  <option value="">Regional branch (default)</option>
                  {branches.filter((b) => b.region_id === editing.region_id).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              )}
              <div className="sm:col-span-2">
                <Label>Zone / office name</Label>
                <Input value={editing.zone_name} onChange={(e) => setEditing({ ...editing, zone_name: e.target.value })} placeholder="e.g. Gurage Zone" />
              </div>
              <div>
                <Label>Bank <span className="font-normal text-slate-400">(reference)</span></Label>
                <select
                  className={selectClass}
                  value={BANKS.includes(editing.bank_name) ? editing.bank_name : ""}
                  onChange={(e) => setEditing({ ...editing, bank_name: e.target.value })}
                >
                  <option value="">Other / unknown</option>
                  {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <Label>Account number</Label>
                <Input value={editing.account_number} onChange={(e) => setEditing({ ...editing, account_number: e.target.value })} className="font-mono" />
              </div>
              <div>
                <Label>Account name</Label>
                <Input value={editing.account_name} onChange={(e) => setEditing({ ...editing, account_name: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>ArifPay API key {editing.api_key_set && <span className="font-normal text-slate-400">(current {editing.api_key_hint} — leave empty to keep)</span>}</Label>
                <Input type="password" autoComplete="off" value={editing.api_key || ""} onChange={(e) => setEditing({ ...editing, api_key: e.target.value })} placeholder="Paste the ArifPay key issued for this account (ArifPay settles to the account linked to it)" />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={editing.is_default} onChange={(e) => setEditing({ ...editing, is_default: e.target.checked })} />
                Default for this region &amp; purpose
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
                Active
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-[#ED1C24] text-white hover:bg-red-700">{saving ? "Saving…" : "Save"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
