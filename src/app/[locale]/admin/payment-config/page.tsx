"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, KeyRound, Star, X, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuperAdminGuard } from "@/components/admin/SuperAdminGuard";
import { SettlementsPanel } from "@/components/admin/SettlementsPanel";
import { REGIONS } from "@/lib/constants";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

import { PageHeader } from "@/components/admin/page-ui";
import { FinanceUnlock } from "@/components/admin/FinanceUnlock";
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
  split_to_account?: string;
  is_default: boolean;
  is_active: boolean;
  api_key_set?: boolean;
  api_key_hint?: string;
  api_key?: string;
};

type Settings = {
  parent_account_name?: string;
  parent_bank_name?: string;
  parent_account_number?: string;
  parent_api_key_set?: boolean;
  parent_api_key_hint?: string;
  parent_api_key?: string;
  donation_account_id?: string;
};

type Branch = { id: string; name: string; region_id: number; zone_id?: string; branch_type: string };

// Banks offered in the dropdown. These are the banks ArifPay can pay out to; a payout only
// goes to an account whose bank is on this list (Tsedey Bank is kept for older records but
// is not supported for payouts).
const BANKS = [
  "Commercial Bank of Ethiopia",
  "Awash Bank",
  "Bank of Abyssinia",
  "Dashen Bank",
  "Abay Bank",
  "Wegagen Bank",
  "Zamzam Bank",
  "Lion International Bank",
  "Bunna International Bank",
  "Hibret Bank",
  "Zemen Bank",
  "Addis International Bank",
  "Berhan Bank",
  "Tsehay Bank",
  "Amhara Bank",
  "Enat Bank",
  "Cooperative Bank of Oromia",
  "Tsedey Bank",
];

const PURPOSE_LABEL: Record<Purpose, string> = {
  ALL: "Membership & Donation",
  MEMBERSHIP: "Membership",
  DONATION: "Donation",
};

// Donations use ONE national account and key (region 0); memberships are per region.
const NATIONAL = 0;
// Not a region: the tab that shows wallet-to-bank payouts.
const SETTLEMENTS = -1;

const blank = (regionId: number): Account => ({
  region_id: regionId,
  branch_id: "",
  zone_name: "",
  purpose: "MEMBERSHIP",
  label: "",
  bank_name: "Commercial Bank of Ethiopia",
  account_number: "",
  account_name: "",
  split_to_account: "",
  is_default: false,
  is_active: true,
  api_key: "",
});

const selectClass =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200";

// The gateway answers with plain text or a JSON body ({ error, message }); never hand an object to a toast.
function errMsg(e: any, fallback: string): string {
  const d = e?.response?.data;
  if (typeof d === "string") return d.trim() || fallback;
  return d?.message || d?.error || fallback;
}

// Key input with a show/hide eye. Saved keys are never sent back by the server, so the
// eye only reveals what has been typed or pasted in this form.
function SecretInput({ value, onChange, name, id, placeholder }: { value: string; onChange: (v: string) => void; name: string; id?: string; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        name={name}
        autoComplete="new-password"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
        aria-pressed={show}
        aria-label={show ? "Hide key" : "Show key"}
        title={show ? "Hide key" : "Show key"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default function PaymentConfigPage() {
  return <SuperAdminGuard><FinanceUnlock><PaymentConfig /></FinanceUnlock></SuperAdminGuard>;
}

function PaymentConfig() {
  const [regionId, setRegionId] = useState<number>(NATIONAL);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Account | null>(null);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({});
  const [savedSettings, setSavedSettings] = useState<Settings>({});
  const [savingParent, setSavingParent] = useState(false);
  const [formError, setFormError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/payment/accounts");
      setAccounts(res.data?.accounts || []);
    } catch {
      toast.error("Could not load payment accounts");
    }
    try {
      const st = await api.get("/payment/settings");
      const loaded = { ...(st.data?.settings || {}), parent_api_key: "" };
      setSettings(loaded);
      setSavedSettings(loaded);
    } catch {
      toast.error("Could not load the parent account settings (is the gateway up to date?)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("region");
    const r = Number(q);
    if (q === "settlements") setRegionId(SETTLEMENTS);
    else if (r > 0 && REGIONS.some((x) => x.id === r)) setRegionId(r);
    load();
    api
      .get("/location/branches")
      .then((r) => setBranches(r.data?.branches || r.data || []))
      .catch(() => setBranches([]));
  }, []);

  const selectRegion = (id: number) => {
    setRegionId(id);
    const url = new URL(window.location.href);
    if (id === NATIONAL) url.searchParams.delete("region");
    else url.searchParams.set("region", id === SETTLEMENTS ? "settlements" : String(id));
    window.history.replaceState(null, "", url);
  };

  const byRegion = useMemo(() => {
    const m: Record<number, Account[]> = {};
    accounts.forEach((a) => (m[a.region_id] ||= []).push(a));
    return m;
  }, [accounts]);

  const regionAccounts = byRegion[regionId] || [];
  const regionBranches = branches.filter((b) => b.region_id === regionId);

  const save = async () => {
    if (!editing) return;
    const email = (editing.split_to_account || "").trim();
    if (!editing.account_number.trim()) {
      setFormError("Account number is required.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Enter a valid sub-account email, or leave it empty.");
      return;
    }
    setFormError("");
    setSaving(true);
    try {
      if (editing.id) await api.put(`/payment/accounts/${editing.id}`, editing);
      else await api.post("/payment/accounts", editing);
      toast.success("Payment account saved");
      setEditing(null);
      await load();
    } catch (e: any) {
      toast.error(errMsg(e, "Could not save the account"));
    } finally {
      setSaving(false);
    }
  };

  const saveParent = async () => {
    setSavingParent(true);
    try {
      const res = await api.put("/payment/settings", settings);
      const saved = { ...(res.data?.settings || {}), parent_api_key: "" };
      setSettings(saved);
      setSavedSettings(saved);
      toast.success("Parent account saved");
    } catch (e: any) {
      toast.error(errMsg(e, "Could not save the parent account"));
    } finally {
      setSavingParent(false);
    }
  };

  const remove = async (a: Account) => {
    const note = a.id && a.id === settings.donation_account_id ? "\n\nThis is the donation sub-account: donations will settle to the parent account until you pick another." : "";
    if (!a.id || !confirm(`Delete account ${a.account_number}?${note}`)) return;
    try {
      await api.delete(`/payment/accounts/${a.id}`);
      toast.success("Account deleted");
      await load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const closeEditor = () => {
    setEditing(null);
    setFormError("");
  };

  useEffect(() => {
    if (!editing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeEditor();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing]);

  const hasDefault = (purpose: Purpose) =>
    regionAccounts.some((a) => a.is_active && a.is_default && a.api_key_set && (a.purpose === purpose || a.purpose === "ALL"));
  const dirty = JSON.stringify(settings) !== JSON.stringify(savedSettings);
  const regionName = (id: number) => REGIONS.find((r) => r.id === id)?.name || `Region ${id}`;
  const donationCandidates = accounts.filter((a) => a.is_active && a.api_key_set && !!a.split_to_account && a.region_id !== NATIONAL);
  const isDonationAccount = (a: Account) => !!a.id && a.id === settings.donation_account_id;
  const keyCount = regionAccounts.filter((a) => a.is_active && a.api_key_set).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Configuration"
        description={
          <>
            Memberships are paid to the payer&apos;s region account with that account&apos;s own ArifPay key (a zone account when
            the payer&apos;s branch matches it). A region with no account key pays to the parent account, as do all donations
            (National donations tab).
          </>
        }
        actions={
          regionId !== NATIONAL && regionId !== SETTLEMENTS ? (
            <Button onClick={() => setEditing(blank(regionId))} className="h-10 rounded-xl bg-[#ED1C24] px-5 text-xs font-bold text-white transition-colors hover:bg-black">
              <Plus className="mr-1 h-4 w-4" /> Add account
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Payment scope">
        <button
          onClick={() => selectRegion(NATIONAL)}
          aria-pressed={regionId === NATIONAL}
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200",
            regionId === NATIONAL ? "border-[#ED1C24] bg-red-50 text-[#ED1C24]" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          )}
        >
          National donations
          <span className={cn("h-2 w-2 rounded-full", settings.parent_api_key_set ? "bg-emerald-500" : "bg-amber-400")} aria-hidden="true" />
          <span className="sr-only">{settings.parent_api_key_set ? "parent key saved" : "no parent key"}</span>
        </button>
        <button
          onClick={() => selectRegion(SETTLEMENTS)}
          aria-pressed={regionId === SETTLEMENTS}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200",
            regionId === SETTLEMENTS ? "border-[#ED1C24] bg-red-50 text-[#ED1C24]" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          )}
        >
          Settlements
        </button>
        <span className="mx-1 hidden h-5 w-px bg-gray-200 sm:block" aria-hidden="true" />
        <span className="text-xs font-semibold text-gray-400">Regions (memberships)</span>
        {REGIONS.map((r) => {
          const list = byRegion[r.id] || [];
          const active = list.some((a) => a.is_active && a.is_default && a.api_key_set);
          return (
            <button
              key={r.id}
              onClick={() => selectRegion(r.id)}
              aria-pressed={regionId === r.id}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200",
                regionId === r.id ? "border-[#ED1C24] bg-red-50 text-[#ED1C24]" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              )}
            >
              {r.name}
              <span className={cn("h-2 w-2 rounded-full", active ? "bg-emerald-500" : "bg-amber-400")} aria-hidden="true" />
              <span className="sr-only">{active ? "default account with key set" : "no default account with an API key, uses the parent account"}</span>
            </button>
          );
        })}
      </div>

      {regionId === SETTLEMENTS ? (
        <SettlementsPanel />
      ) : regionId === NATIONAL ? (
        <form
          className="rounded-xl border border-gray-200 bg-white"
          onSubmit={(e) => {
            e.preventDefault();
            if (dirty && !savingParent) saveParent();
          }}
        >
          <div className="space-y-6 p-5 md:p-6">
            <p className="max-w-3xl text-sm text-gray-600">
              Every donation is paid with the parent (head-office) ArifPay key. You can link donations to one sub-account; with
              none chosen they settle straight to the parent. Regional keys are never used for donations.
            </p>

            <section className="space-y-3" aria-labelledby="parent-key-h">
              <h2 id="parent-key-h" className="text-sm font-bold text-gray-900">Parent ArifPay key</h2>
              <div
                role="status"
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm",
                  loading
                    ? "border-gray-200 bg-gray-50 text-gray-500"
                    : settings.parent_api_key_set
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-amber-200 bg-amber-50 text-amber-800"
                )}
              >
                {loading
                  ? "Checking the saved key…"
                  : settings.parent_api_key_set
                    ? <>Key saved <span className="font-mono">{settings.parent_api_key_hint}</span>. Online donations are on.</>
                    : "No key saved yet. Online donations are unavailable."}
              </div>
              <div className="max-w-xl">
                <Label htmlFor="parent-key">{settings.parent_api_key_set ? "Replace the key" : "Key"} <span className="font-normal text-gray-400">{settings.parent_api_key_set ? "(leave empty to keep the saved one)" : ""}</span></Label>
                <SecretInput
                  id="parent-key"
                  name="parent-arifpay-key"
                  value={settings.parent_api_key || ""}
                  onChange={(v) => setSettings({ ...settings, parent_api_key: v })}
                  placeholder="Paste the head-office ArifPay key"
                />
              </div>
            </section>

            <section className="space-y-3 border-t border-gray-100 pt-6" aria-labelledby="parent-details-h">
              <div>
                <h2 id="parent-details-h" className="text-sm font-bold text-gray-900">Parent account details</h2>
                <p className="text-xs text-gray-500">For reference only. ArifPay settles to the account linked to the key.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-2 lg:col-span-3">
                  <Label htmlFor="copy-from">Copy from an Addis Ababa account <span className="font-normal text-gray-400">(optional)</span></Label>
                  <select
                    id="copy-from"
                    className={selectClass}
                    value=""
                    onChange={(e) => {
                      const a = (byRegion[1] || []).find((x) => x.id === e.target.value);
                      if (a) {
                        setSettings({
                          ...settings,
                          parent_account_name: a.account_name || a.label,
                          parent_bank_name: a.bank_name,
                          parent_account_number: a.account_number,
                        });
                      }
                    }}
                  >
                    <option value="">Select an account to copy its name, bank and number…</option>
                    {(byRegion[1] || []).filter((a) => a.is_active).map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.zone_name || "Head office"} — {a.account_name || a.label} ({a.account_number})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="parent-name">Account name</Label>
                  <Input id="parent-name" autoComplete="off" name="parent-account-name" value={settings.parent_account_name || ""} onChange={(e) => setSettings({ ...settings, parent_account_name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="parent-number">Account number</Label>
                  <Input id="parent-number" autoComplete="off" inputMode="numeric" name="parent-account-number" className="font-mono tabular-nums" value={settings.parent_account_number || ""} onChange={(e) => setSettings({ ...settings, parent_account_number: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="parent-bank">Bank</Label>
                  <select
                    id="parent-bank"
                    className={selectClass}
                    value={BANKS.includes(settings.parent_bank_name || "") ? settings.parent_bank_name : ""}
                    onChange={(e) => setSettings({ ...settings, parent_bank_name: e.target.value })}
                  >
                    <option value="">Other / unknown</option>
                    {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-3 border-t border-gray-100 pt-6" aria-labelledby="donation-sub-h">
              <div>
                <h2 id="donation-sub-h" className="text-sm font-bold text-gray-900">Donation sub-account <span className="font-normal text-gray-400">(optional, only one)</span></h2>
                <p className="text-xs text-gray-500">
                  Checkout uses the parent key and splits funds to this account&apos;s ArifPay wallet. Settlements use this account&apos;s own key and bank details.
                </p>
              </div>
              <div className="max-w-xl">
                <Label htmlFor="donation-account" className="sr-only">Donation sub-account</Label>
                <select
                  id="donation-account"
                  className={selectClass}
                  value={settings.donation_account_id || ""}
                  onChange={(e) => setSettings({ ...settings, donation_account_id: e.target.value })}
                >
                  <option value="">None: donations go to the parent account</option>
                  {donationCandidates.map((a) => (
                    <option key={a.id} value={a.id}>
                      {regionName(a.region_id)} — {a.zone_name || a.account_name || a.label} · {a.split_to_account}
                    </option>
                  ))}
                  {settings.donation_account_id && !donationCandidates.some((a) => a.id === settings.donation_account_id) && (
                    <option value={settings.donation_account_id}>Current account (inactive, deleted, or missing email or key)</option>
                  )}
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  {donationCandidates.length === 0
                    ? "No active account has both a sub-account email and API key yet. "
                    : "Only active accounts with a sub-account email and API key are listed. "}
                  To add one, open a region tab, edit its account, save its <b>ArifPay API key</b> and set <b>Donation sub-account email</b>.
                </p>
              </div>
            </section>
          </div>

          <div className="flex items-center justify-end gap-3 rounded-b-xl border-t border-gray-100 bg-gray-50 px-5 py-3 md:px-6">
            <span className={cn("text-xs font-medium", dirty ? "text-amber-700" : "text-gray-400")} role="status">
              {dirty ? "Unsaved changes" : "All changes saved"}
            </span>
            <Button type="submit" disabled={!dirty || savingParent || loading} className="bg-[#ED1C24] text-white hover:bg-red-700 disabled:opacity-50">
              {savingParent ? "Saving…" : "Save parent account"}
            </Button>
          </div>
        </form>
      ) : (
        <>
      <div className="grid gap-3 md:grid-cols-3">
        {(["MEMBERSHIP"] as Purpose[]).map((p) => (
          <div key={p} className={cn("rounded-xl border p-4 text-sm", hasDefault(p) ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50")}>
            <div className="font-bold text-gray-800">{p === "MEMBERSHIP" ? "Membership" : "Donation"} routing</div>
            <div className="mt-1 text-gray-600">
              {hasDefault(p) ? "Default account with key configured" : "No default account with a key — members in this region pay to the parent account"}
            </div>
          </div>
        ))}
        {(
          <div className={cn("rounded-xl border p-4 text-sm", regionAccounts.some(isDonationAccount) ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-gray-50")}>
            <div className="font-bold text-gray-800">Donation sub-account</div>
            <div className="mt-1 text-gray-600">
              {regionAccounts.some(isDonationAccount)
                ? "An account here is the donation sub-account: donations are linked to it"
                : "Not the donation sub-account. Pick it on the National donations tab"}
            </div>
          </div>
        )}
        <div className={cn("rounded-xl border p-4 text-sm", keyCount ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50")}>
          <div className="font-bold text-gray-800">ArifPay API keys</div>
          <div className="mt-1 text-gray-600">
            {keyCount ? `${keyCount} account(s) with their own key` : "None set — this region's membership payments use the parent account"}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3">Scope</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Bank</th>
              <th className="px-4 py-3">Used for</th>
              <th className="px-4 py-3">API key</th>
              {regionId !== NATIONAL && <th className="px-4 py-3">Donation sub-account</th>}
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
            )}
            {!loading && regionAccounts.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  <AlertTriangle className="mx-auto mb-2 h-5 w-5 text-amber-500" aria-hidden="true" />
                  <p>No accounts for this region yet. Add one to route its membership payments.</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => setEditing(blank(regionId))}>
                    <Plus className="mr-1 h-4 w-4" /> Add account
                  </Button>
                </td>
              </tr>
            )}
            {regionAccounts.map((a) => (
              <tr key={a.id} className={cn("border-t border-gray-100", !a.is_active && "opacity-50")}>
                <td className="px-4 py-3">
                  <div className="font-semibold text-gray-800">{a.zone_name || "Regional branch"}</div>
                  {a.branch_id && <div className="text-xs text-gray-400">branch {a.branch_id}</div>}
                </td>
                <td className="px-4 py-3">
                  <div className="font-mono text-gray-800">{a.account_number}</div>
                  <div className="max-w-[260px] truncate text-xs text-gray-500">{a.account_name || a.label}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{a.bank_name || "—"}</td>
                <td className="px-4 py-3 text-gray-700">{PURPOSE_LABEL[a.purpose]}</td>
                <td className="px-4 py-3">
                  {a.api_key_set ? (
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-gray-700"><KeyRound className="h-3 w-3" />{a.api_key_hint}</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600"><AlertTriangle className="h-3 w-3" />no key</span>
                  )}
                </td>
                {regionId !== NATIONAL && (
                  <td className="px-4 py-3">
                    {a.split_to_account ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-700">{a.split_to_account}</span>
                        {isDonationAccount(a) && (
                          <span className="w-fit rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">Donation account</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                )}
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {a.is_default && <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700"><Star className="h-3 w-3" />Default</span>}
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", a.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500")}>
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
        </>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeEditor}>
          <div role="dialog" aria-modal="true" aria-labelledby="account-dialog-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 id="account-dialog-title" className="text-lg font-black text-gray-900">{editing.id ? "Edit" : "Add"} payment account</h2>
              <button onClick={closeEditor} aria-label="Close" className="rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {editing.purpose !== "DONATION" && (<>
              <div>
                <Label htmlFor="em-region">Region</Label>
                <select id="em-region" className={selectClass} value={editing.region_id} onChange={(e) => setEditing({ ...editing, region_id: Number(e.target.value), branch_id: "" })}>
                  {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              </>)}
              {editing.purpose !== "DONATION" && (
              <div className="sm:col-span-2">
                <Label htmlFor="em-branch">Branch (optional — leave empty for the regional default)</Label>
                <select
                  id="em-branch"
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
                <Label htmlFor="em-zone">Zone / office name</Label>
                <Input id="em-zone" autoComplete="off" value={editing.zone_name} onChange={(e) => setEditing({ ...editing, zone_name: e.target.value })} placeholder="e.g. Gurage Zone" />
              </div>
              <div>
                <Label htmlFor="em-bank">Bank <span className="font-normal text-gray-400">(reference)</span></Label>
                <select
                  id="em-bank"
                  className={selectClass}
                  value={BANKS.includes(editing.bank_name) ? editing.bank_name : ""}
                  onChange={(e) => setEditing({ ...editing, bank_name: e.target.value })}
                >
                  <option value="">Other / unknown</option>
                  {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="em-number">Account number <span className="font-normal text-red-500">*</span></Label>
                <Input id="em-number" autoComplete="off" inputMode="numeric" required aria-required="true" value={editing.account_number} onChange={(e) => setEditing({ ...editing, account_number: e.target.value })} className="font-mono tabular-nums" />
              </div>
              <div>
                <Label htmlFor="em-name">Account name</Label>
                <Input id="em-name" autoComplete="off" value={editing.account_name} onChange={(e) => setEditing({ ...editing, account_name: e.target.value })} />
              </div>
              {(
              <div className="sm:col-span-2">
                <Label htmlFor="em-email">Donation sub-account email <span className="font-normal text-gray-400">(optional)</span></Label>
                <Input
                  id="em-email"
                  type="email"
                  autoComplete="off"
                  value={editing.split_to_account || ""}
                  onChange={(e) => setEditing({ ...editing, split_to_account: e.target.value })}
                  placeholder="Email of this region's sub-account registered in ArifPay"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Makes this account selectable as the donation sub-account (National donations tab). Donations are then paid with the
                  parent key and linked to this email. Must match a sub-account in the ArifPay merchant dashboard.
                </p>
              </div>
              )}
              <div className="sm:col-span-2">
                <Label htmlFor="em-key">This account&apos;s own ArifPay key {editing.api_key_set && <span className="font-normal text-gray-400">(current {editing.api_key_hint} — leave empty to keep)</span>}</Label>
                <SecretInput id="em-key" name="account-arifpay-key" value={editing.api_key || ""} onChange={(v) => setEditing({ ...editing, api_key: v })} placeholder="This sub-account's own key (memberships and withdrawals)" />
                <p className="mt-1 text-xs text-gray-400">
                  Saved for this account only. Donations never use it: they use the parent key saved on the National tab.
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input type="checkbox" checked={editing.is_default} onChange={(e) => setEditing({ ...editing, is_default: e.target.checked })} />
                Default for this region &amp; purpose
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
                Active
              </label>
            </div>
            {formError && <p role="alert" className="mt-4 text-sm font-medium text-red-600">{formError}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={closeEditor}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-[#ED1C24] text-white hover:bg-red-700">{saving ? "Saving…" : "Save"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
