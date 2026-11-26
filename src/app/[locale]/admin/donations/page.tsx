"use client";

import { useEffect, useMemo, useState } from "react";
import { HeartHandshake, RefreshCw, Search, Users, Wallet, Clock3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateFilterControls } from "@/components/admin/DateFilterControls";
import { FinanceUnlock } from "@/components/admin/FinanceUnlock";
import { PageHeader, Panel, TableCard } from "@/components/admin/page-ui";
import { StatTile } from "@/components/admin/analytics/widgets";
import { dateBounds, localDate, validLocalDate, type DatePreset } from "@/lib/date-filters";
import { getUserScope } from "@/lib/auth-scope";

interface Donation {
  id: string;
  invoice_number?: string;
  payer_name?: string;
  payer_phone?: string;
  amount: number;
  currency?: string;
  status: string;
  created_at: string;
  paid_at?: string;
}

const PAGE_SIZE = 200;
const TABLE_SIZE = 20;
const isPaid = (donation: Donation) => donation.status === "PAID" || donation.status === "SUCCESS";
const donationDate = (donation: Donation) => donation.paid_at || donation.created_at;

function money(amount: number, currency: string) {
  return `${amount.toLocaleString("en-ET", { maximumFractionDigits: 2 })} ${currency || "ETB"}`;
}

function totalsByCurrency(donations: Donation[]) {
  const totals = new Map<string, number>();
  donations.forEach((donation) => {
    const currency = (donation.currency || "ETB").toUpperCase();
    totals.set(currency, (totals.get(currency) || 0) + Number(donation.amount || 0));
  });
  return [...totals].sort(([a], [b]) => a === "ETB" ? -1 : b === "ETB" ? 1 : a.localeCompare(b))
    .map(([currency, amount]) => money(amount, currency)).join(" + ") || "0 ETB";
}

interface DonationLedgerProps {
  donations: Donation[];
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

function DonationLedger({ donations, loading, page, onPageChange }: DonationLedgerProps) {
  const pages = Math.max(1, Math.ceil(donations.length / TABLE_SIZE));
  const visible = donations.slice((page - 1) * TABLE_SIZE, page * TABLE_SIZE);
  return (
    <TableCard title="Donor ledger" description="Donor details and payment amounts for the selected filters"
      footer={<div className="flex items-center justify-between gap-3 text-xs text-gray-500">
        <span>{donations.length.toLocaleString()} records</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => onPageChange(page - 1)}>Previous</Button>
          <span className="tabular-nums">{page} / {pages}</span>
          <Button variant="outline" size="sm" disabled={page >= pages || loading} onClick={() => onPageChange(page + 1)}>Next</Button>
        </div>
      </div>}>
      <Table>
        <TableHeader><TableRow>
          <TableHead>Donor</TableHead><TableHead>Phone number</TableHead><TableHead>Amount</TableHead>
          <TableHead>Payment date</TableHead><TableHead>Status</TableHead><TableHead>Reference</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {loading ? <TableRow><TableCell colSpan={6} className="h-32 text-center text-gray-500">Loading donations…</TableCell></TableRow>
            : visible.length === 0 ? <TableRow><TableCell colSpan={6} className="h-32 text-center text-gray-500">No donations match these filters.</TableCell></TableRow>
            : visible.map((donation) => {
              const when = donationDate(donation);
              return <TableRow key={donation.id}>
                <TableCell className="font-semibold text-gray-900">{donation.payer_name || "Anonymous donor"}</TableCell>
                <TableCell className="whitespace-nowrap text-gray-600">{donation.payer_phone || "Not recorded"}</TableCell>
                <TableCell className="whitespace-nowrap font-bold tabular-nums text-gray-900">{money(Number(donation.amount || 0), (donation.currency || "ETB").toUpperCase())}</TableCell>
                <TableCell className="whitespace-nowrap text-gray-600">{when && !Number.isNaN(Date.parse(when)) ? new Date(when).toLocaleDateString("en-ET", { day: "numeric", month: "short", year: "numeric" }) : "—"}</TableCell>
                <TableCell><span className={isPaid(donation) ? "font-semibold text-emerald-700" : donation.status === "FAILED" ? "font-semibold text-red-700" : "font-semibold text-amber-700"}>{donation.status || "Unknown"}</span></TableCell>
                <TableCell className="text-gray-500">{donation.invoice_number || "—"}</TableCell>
              </TableRow>;
            })}
        </TableBody>
      </Table>
    </TableCard>
  );
}

interface DonationTrendProps { donations: Donation[]; }

function DonationTrend({ donations }: DonationTrendProps) {
  const paid = donations.filter(isPaid);
  const latest = paid.reduce((max, donation) => Math.max(max, Date.parse(donationDate(donation)) || 0), 0);
  const end = latest ? new Date(latest) : new Date();
  const counts = new Map<string, number>();
  paid.forEach((donation) => {
    const date = new Date(donationDate(donation));
    if (!Number.isNaN(date.getTime())) {
      const key = localDate(date);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  });
  const data = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 6 + index);
    return { date: date.toLocaleDateString("en-ET", { month: "short", day: "numeric" }), gifts: counts.get(localDate(date)) || 0 };
  });
  return <Panel title="Donation activity" description="Confirmed gifts during the latest seven days in the selected period">
    <div className="h-48" role="img" aria-label={`Confirmed gifts by day: ${data.map((day) => `${day.date}: ${day.gifts}`).join(", ")}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={11} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} />
          <Tooltip formatter={(value) => [`${value} gifts`, "Confirmed"]} />
          <Bar dataKey="gifts" fill="#ED1C24" radius={[4, 4, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Panel>;
}

function DonationsContent() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [preset, setPreset] = useState<DatePreset>("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("PAID");
  const [page, setPage] = useState(1);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);
  const [limitedScope, setLimitedScope] = useState(false);

  useEffect(() => {
    setLimitedScope(!getUserScope().isSuperAdmin);
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("date");
    if (initial === "today" || initial === "last7" || initial === "range") setPreset(initial);
    const initialFrom = params.get("from") || "";
    const initialTo = params.get("to") || "";
    setFrom(validLocalDate(initialFrom) ? initialFrom : "");
    setTo(validLocalDate(initialTo) ? initialTo : "");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    if (preset) url.searchParams.set("date", preset);
    else url.searchParams.delete("date");
    if (preset === "range" && from) url.searchParams.set("from", from);
    else url.searchParams.delete("from");
    if (preset === "range" && to) url.searchParams.set("to", to);
    else url.searchParams.delete("to");
    window.history.replaceState(null, "", url);
  }, [ready, preset, from, to]);

  useEffect(() => {
    if (!ready) return;
    const bounds = dateBounds(preset, from, to);
    if (preset === "range" && !bounds) {
      setDonations([]);
      setError(false);
      setLoading(false);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const all: Donation[] = [];
        for (let batchPage = 1; ; batchPage++) {
          const params: Record<string, string | number> = { purpose: "DONATION", page: batchPage, page_size: PAGE_SIZE };
          if (bounds) { params.paid_from = bounds.from; params.paid_before = bounds.before; }
          const response = await api.get("/payments", { params });
          if (cancelled) return;
          const batch: Donation[] = response.data.invoices || [];
          all.push(...batch);
          const total = Number(response.data.pagination?.total_items ?? all.length);
          if (batch.length < PAGE_SIZE || all.length >= total) break;
        }
        if (!cancelled) { setDonations(all); setPage(1); }
      } catch (caught) {
        console.error("Failed to load donations", caught);
        if (!cancelled) { setDonations([]); setError(true); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [ready, preset, from, to, reload]);

  const filtered = useMemo(() => donations.filter((donation) => {
    if (status === "PAID" && !isPaid(donation)) return false;
    if (status === "PENDING" && donation.status !== "PENDING" && donation.status !== "UNPAID") return false;
    if (status === "FAILED" && donation.status !== "FAILED") return false;
    const query = search.trim().toLowerCase();
    return !query || [donation.payer_name, donation.payer_phone, donation.invoice_number].some((field) => (field || "").toLowerCase().includes(query));
  }).sort((a, b) => (Date.parse(donationDate(b)) || 0) - (Date.parse(donationDate(a)) || 0)), [donations, search, status]);
  const paid = donations.filter(isPaid);
  const donorPhones = new Set(paid.map((donation) => donation.payer_phone?.trim()).filter(Boolean)).size;
  const pending = donations.filter((donation) => donation.status === "PENDING" || donation.status === "UNPAID").length;
  const changeFilter = (value: DatePreset) => { setPreset(value); setPage(1); };

  return <div className="space-y-6">
    <PageHeader title="Donations" description="See who donated, how to contact them, and how much they gave."
      actions={<Button variant="outline" disabled={loading} onClick={() => setReload((value) => value + 1)} className="gap-2"><RefreshCw className="h-4 w-4" />Refresh</Button>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile label="Received" value={loading ? "…" : totalsByCurrency(paid)} hint="Confirmed donations" icon={Wallet} />
      <StatTile label="Confirmed gifts" value={loading ? "…" : paid.length.toLocaleString()} hint="Payments completed" icon={HeartHandshake} />
      <StatTile label="Donor phones" value={loading ? "…" : donorPhones.toLocaleString()} hint="Unique recorded phone numbers" icon={Users} />
      <StatTile label="Awaiting payment" value={loading ? "…" : pending.toLocaleString()} hint="Pending donation attempts" icon={Clock3} />
    </div>
    {limitedScope && <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Donation payments are recorded nationally. This view only shows records available to your account&apos;s payment scope.</p>}
    {ready && <DonationTrend donations={donations} />}
    <Panel title="Filter donations" description="Dates use the donation payment date when available.">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_12rem] lg:items-end">
        <div><label htmlFor="donation-search" className="mb-1 block text-xs font-semibold text-gray-600">Search donor</label>
          <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input id="donation-search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Name, phone or reference" className="h-10 pl-9" /></div></div>
        <DateFilterControls id="donations-date" label="Donation date" value={preset} from={from} to={to}
          onValueChange={changeFilter} onFromChange={(value) => { setFrom(value); setPage(1); }} onToChange={(value) => { setTo(value); setPage(1); }} />
        <div><label htmlFor="donation-status" className="mb-1 block text-xs font-semibold text-gray-600">Payment status</label>
          <select id="donation-status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-800">
            <option value="PAID">Confirmed</option><option value="ALL">All statuses</option><option value="PENDING">Pending</option><option value="FAILED">Failed</option>
          </select></div>
      </div>
      {preset === "range" && !dateBounds(preset, from, to) && <p className="mt-3 text-xs text-amber-700">Choose a valid start and end date.</p>}
      {error && <p className="mt-3 text-sm text-red-700">Donations could not be loaded. Use Refresh to try again.</p>}
    </Panel>
    <DonationLedger donations={filtered} loading={loading} page={page} onPageChange={setPage} />
  </div>;
}

export default function DonationsPage() {
  return <FinanceUnlock><DonationsContent /></FinanceUnlock>;
}
