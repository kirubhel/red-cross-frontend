"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/page-ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Users, Plus, Filter, Download, FileText, Table as TableIcon, X, Upload, ArrowUpRight, CreditCard, Phone, Mail, MapPin, Info, Copy, Check, Printer, Lock, UserPlus } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { AddMemberModal } from "@/components/admin/AddMemberModal";
import { ImportReviewDialog } from "@/components/admin/ImportReviewDialog";
import { useImportFlow } from "@/components/admin/useImportFlow";
import { buildTemplateWorkbook, downloadWorkbook } from "@/lib/excel-import";
import { memberImportConfig } from "@/lib/import-columns";
import { getUserScope, type UserScope } from "@/lib/auth-scope";
import { DateFilterControls } from "@/components/admin/DateFilterControls";
import { dateBounds, validLocalDate, type DatePreset } from "@/lib/date-filters";
import { memberPaymentChannel, registrationSource } from "@/lib/payment-source";
import { ETHIOPIA_LOCATION_DATA, REGIONS as REGION_CATALOG, getWoredasForZone } from "@/lib/constants";

type Member = {
  id: string;
  first_name: string;
  father_name: string;
  grandfather_name?: string;
  email?: string;
  phone_number?: string;
  national_id?: string;
  gender?: string;
  region: any;
  status: string;
  ercs_id: string;
  membership_type?: string;
  metadata?: string;
  zone_id?: string;
  woreda_id?: string;
  created_at?: string;
  registration_source?: string;
  /** Method of the latest paid invoice (MANUAL, ARIFPAY); absent when nothing is paid yet. */
  payment_method?: string;
};

const filterLabel = "mb-1 block text-xs font-semibold text-gray-600";
const filterSelect =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

/** "Manually added" for admin entries and Excel imports; nothing for unknown origins. */
function SourceBadge({ source }: { source?: string }) {
  const tag = registrationSource(source);
  if (!tag) return null;
  return (
    <span
      title={tag.detail}
      className={cn(
        "mt-0.5 inline-flex w-fit items-center rounded px-1.5 py-0.5 text-[9px] font-bold",
        tag.manual ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-gray-50 text-gray-500 border border-gray-200"
      )}
    >
      {tag.label}
    </span>
  );
}

/** Manual or ArifPay, from how the member's fee was settled; a dash while the fee is still owed. */
function PaymentMethodBadge({ method, status }: { method?: string; status?: string }) {
  const channel = memberPaymentChannel(method, status);
  if (!channel) return <span className="text-xs text-gray-300">—</span>;
  const manual = channel === "MANUAL";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider",
        manual ? "border-amber-200 bg-amber-50 text-amber-700" : "border-blue-200 bg-blue-50 text-blue-700"
      )}
    >
      {manual ? "Manual" : "ArifPay"}
    </span>
  );
}

type Region = {
    id: number;
    name: string;
    code: string;
};

const DEFAULT_REGIONS: Region[] = [
  { id: 1, name: "Addis Ababa", code: "AA" },
  { id: 2, name: "Dire Dawa", code: "DD" },
  { id: 3, name: "Tigray", code: "TG" },
  { id: 4, name: "Afar", code: "AF" },
  { id: 5, name: "Amhara", code: "AM" },
  { id: 6, name: "Oromia", code: "OR" },
  { id: 7, name: "Somali", code: "SM" },
  { id: 8, name: "Benishangul Gumz", code: "BG" },
  { id: 9, name: "Central Ethiopia", code: "CE" },
  { id: 10, name: "Gambela", code: "GM" },
  { id: 11, name: "Harari", code: "HR" },
  { id: 12, name: "Sidama", code: "SD" },
  { id: 13, name: "South West Ethiopia", code: "SW" },
  { id: 14, name: "South Ethiopia", code: "SE" },
  { id: 16, name: "Moyale Special Woreda", code: "MY" },
  { id: 17, name: "Humera Special Woreda", code: "HM" }
];

// Page numbers to show: first, last, and a window around the current page.
function pageWindow(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = Array.from(pages).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [regions, setRegions] = useState<Region[]>(DEFAULT_REGIONS);
  const [search, setSearch] = useState("");
  const [searchReady, setSearchReady] = useState(false);
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [mainCategory, setMainCategory] = useState<string>("");
  const [paymentFilter, setPaymentFilter] = useState<string>("");
  const [zoneFilter, setZoneFilter] = useState<string>("");
  const [woredaFilter, setWoredaFilter] = useState<string>("");
  const [registrationFilter, setRegistrationFilter] = useState<DatePreset>("");
  const [registeredFrom, setRegisteredFrom] = useState("");
  const [registeredTo, setRegisteredTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({ first_name: "", father_name: "", grandfather_name: "", phone_number: "", email: "", gender: "", date_of_birth: "" });

  const startEditing = (m: Member) => {
    setEditForm({
      first_name: m.first_name || "",
      father_name: m.father_name || "",
      grandfather_name: m.grandfather_name || "",
      phone_number: m.phone_number || "",
      email: m.email || "",
      gender: (m.gender || "").toUpperCase(),
      date_of_birth: String((m as any).date_of_birth || "").slice(0, 10),
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!selectedMember) return;
    if (!editForm.first_name.trim() || !editForm.father_name.trim()) {
      toast.error("First name and father name are required");
      return;
    }
    setSavingEdit(true);
    try {
      // The server only changes fields that are sent non-empty.
      const payload: Record<string, string> = {};
      (Object.keys(editForm) as (keyof typeof editForm)[]).forEach((k) => {
        const v = editForm[k].trim();
        if (v) payload[k] = v;
      });
      const res = await api.put(`/person/${selectedMember.id}`, payload);
      const p = res.data?.person || {};
      // Merge only what this form edits; the response encodes region as an enum name.
      const updated = {
        first_name: p.first_name ?? editForm.first_name,
        father_name: p.father_name ?? editForm.father_name,
        grandfather_name: p.grandfather_name ?? editForm.grandfather_name,
        phone_number: p.phone_number ?? editForm.phone_number,
        email: p.email ?? editForm.email,
        gender: p.gender ?? editForm.gender,
        date_of_birth: p.date_of_birth ?? editForm.date_of_birth,
      };
      setSelectedMember({ ...selectedMember, ...updated });
      setMembers((prev) => prev.map((m) => (m.id === selectedMember.id ? { ...m, ...updated } : m)));
      toast.success("Profile updated");
      setEditing(false);
    } catch (err: any) {
      toast.error(typeof err?.response?.data === "string" ? err.response.data : err?.response?.data?.message || "Could not update this profile");
    } finally {
      setSavingEdit(false);
    }
  };
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userScope, setUserScope] = useState<UserScope | null>(null);
  const [isRegionLocked, setIsRegionLocked] = useState(false);
  const requestIdRef = useRef(0);
  // Zones and woredas come from the same catalogue the registration form uses, so the values
  // match what is stored on each person.
  const zoneOptions = ETHIOPIA_LOCATION_DATA[REGION_CATALOG.find((r) => String(r.id) === regionFilter)?.value || ""]?.zones || [];
  const woredaOptions = zoneFilter ? getWoredasForZone(zoneFilter) : [];
  const [pageSize, setPageSize] = useState(10);
  // Selected members can span pages, so keep their records here for copy/export.
  const selectedCache = useRef<Map<string, Member>>(new Map());
  const [selectingAll, setSelectingAll] = useState(false);

  const copyToClipboard = (text: string, label: string = "Member ID", e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success(`Copied ${label}: ${text}`);
    setTimeout(() => {
      setCopiedId(prev => (prev === text ? null : prev));
    }, 2000);
  };

  const displayedMembers = useMemo(() => {
    if (userScope && !userScope.isSuperAdmin && userScope.regionNumber > 0) {
      return members.filter(m => !m.region || Number(m.region) === userScope.regionNumber);
    }
    return members;
  }, [members, userScope]);

  const isAllSelected = displayedMembers.length > 0 && displayedMembers.every(m => selectedMemberIds.has(m.id));
  const isSomeSelected = displayedMembers.some(m => selectedMemberIds.has(m.id)) && !isAllSelected;

  const toggleSelectAll = () => {
    const next = new Set(selectedMemberIds);
    if (isAllSelected) {
      displayedMembers.forEach(m => { next.delete(m.id); selectedCache.current.delete(m.id); });
    } else {
      displayedMembers.forEach(m => { next.add(m.id); selectedCache.current.set(m.id, m); });
    }
    setSelectedMemberIds(next);
  };

  const toggleSelectMember = (member: Member, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const next = new Set(selectedMemberIds);
    if (next.has(member.id)) {
      next.delete(member.id);
      selectedCache.current.delete(member.id);
    } else {
      next.add(member.id);
      selectedCache.current.set(member.id, member);
    }
    setSelectedMemberIds(next);
  };

  const clearSelection = () => {
    selectedCache.current.clear();
    setSelectedMemberIds(new Set());
  };

  const getSelectedMembers = () =>
    Array.from(selectedMemberIds).map(id => selectedCache.current.get(id)).filter((m): m is Member => Boolean(m));

  // Selects every member matching the current search/filters, across all pages.
  const selectAllMatching = async () => {
    setSelectingAll(true);
    const toastId = "select-all-matching";
    toast.loading(`Selecting ${totalItems} records...`, { id: toastId });
    try {
      const CHUNK = 500;
      const all: Member[] = [];
      for (let p = 1; ; p++) {
        const res = await api.get(`/person?${buildMemberParams(p, CHUNK).toString()}`);
        const batch: Member[] = res.data.people || [];
        all.push(...batch);
        const pages = res.data.pagination?.total_pages || 1;
        if (p >= pages || batch.length === 0) break;
      }
      const scoped = userScope && !userScope.isSuperAdmin && userScope.regionNumber > 0
        ? all.filter(m => !m.region || Number(m.region) === userScope.regionNumber)
        : all;
      const next = new Set<string>();
      scoped.forEach(m => { next.add(m.id); selectedCache.current.set(m.id, m); });
      setSelectedMemberIds(next);
      toast.success(`Selected all ${next.size} matching records`, { id: toastId });
    } catch (err) {
      console.error("Select all matching error:", err);
      toast.error("Could not select all records", { id: toastId });
    } finally {
      setSelectingAll(false);
    }
  };

  const copySelectedIDs = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const ids = getSelectedMembers()
      .map(m => m.ercs_id)
      .filter(Boolean)
      .join("\n");
    if (!ids) {
      toast.error("No valid IDs selected");
      return;
    }
    navigator.clipboard.writeText(ids);
    toast.success(`Copied ${selectedMemberIds.size} Member IDs to clipboard`);
  };

  const copySelectedPhones = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const phones = getSelectedMembers()
      .map(m => m.phone_number)
      .filter(Boolean)
      .join("\n");
    if (!phones) {
      toast.error("No phone numbers in selection");
      return;
    }
    navigator.clipboard.writeText(phones);
    toast.success(`Copied ${phones.split("\n").length} phone numbers to clipboard`);
  };

  const exportSelected = async (format: "xlsx" | "csv" = "xlsx") => {
    const selectedList = getSelectedMembers();
    if (selectedList.length === 0) {
      toast.error("No members selected for export");
      return;
    }
    toast.loading(`Exporting ${selectedList.length} members...`, { id: "export-selected" });
    try {
      const { exportMembersReport } = await import("@/lib/report-export");
      await exportMembersReport(selectedList, format);
      toast.success(`Exported ${selectedList.length} members successfully`, { id: "export-selected" });
    } catch (err) {
      console.error("Export selected error:", err);
      toast.error("Failed to export selected members", { id: "export-selected" });
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("search") || "");
    const dateFilter = params.get("registered");
    if (dateFilter === "today" || dateFilter === "last7" || dateFilter === "range") {
      setRegistrationFilter(dateFilter);
      setShowFilters(true);
    }
    const from = params.get("registeredFrom") || "";
    const to = params.get("registeredTo") || "";
    setRegisteredFrom(validLocalDate(from) ? from : "");
    setRegisteredTo(validLocalDate(to) ? to : "");
    setSearchReady(true);
    const scope = getUserScope();
    setUserScope(scope);

    const hasRegionalLock = !scope.isSuperAdmin && Boolean(scope.regionId);
    setIsRegionLocked(hasRegionalLock);
    if (hasRegionalLock && scope.regionId) {
      setRegionFilter(scope.regionId);
    }

    fetchRegions();
  }, []);

  useEffect(() => {
    if (!searchReady) return;
    const url = new URL(window.location.href);
    if (registrationFilter) url.searchParams.set("registered", registrationFilter);
    else url.searchParams.delete("registered");
    if (registrationFilter === "range" && registeredFrom) url.searchParams.set("registeredFrom", registeredFrom);
    else url.searchParams.delete("registeredFrom");
    if (registrationFilter === "range" && registeredTo) url.searchParams.set("registeredTo", registeredTo);
    else url.searchParams.delete("registeredTo");
    window.history.replaceState(null, "", url);
  }, [searchReady, registrationFilter, registeredFrom, registeredTo]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setEditing(false);
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [showModal]);

  useEffect(() => {
    if (!searchReady) return;
    requestIdRef.current += 1;
    if (registrationFilter === "range" && !dateBounds(registrationFilter, registeredFrom, registeredTo)) {
      setMembers([]);
      setTotalItems(0);
      setTotalPages(1);
      setLoading(false);
      return;
    }
    const timer = setTimeout(() => {
        fetchMembers();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [searchReady, search, page, pageSize, regionFilter, statusFilter, typeFilter, zoneFilter, woredaFilter, mainCategory, paymentFilter, userScope, registrationFilter, registeredFrom, registeredTo]);

  // A selection belongs to the search/filters it was made under. Drop it when they
  // change so a bulk action never reaches records that are no longer on screen.
  useEffect(() => {
    selectedCache.current.clear();
    setSelectedMemberIds(new Set());
    setPage(1);
  }, [search, pageSize, regionFilter, statusFilter, typeFilter, zoneFilter, woredaFilter, mainCategory, paymentFilter, registrationFilter, registeredFrom, registeredTo]);

  const fetchRegions = async () => {
    try {
        const res = await api.get("/system-settings");
        if (res.data && res.data.settings && res.data.settings.all_regions) {
            const parsed = JSON.parse(res.data.settings.all_regions);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setRegions(parsed);
            }
        }
    } catch (err) {
        console.error("Failed to fetch regions:", err);
    }
  };

  // Query for the members matching the current search and filters.
  const buildMemberParams = (pageNum: number, size: number) => {
    const scope = userScope || getUserScope();
    const effectiveRegion = (!scope.isSuperAdmin && scope.regionId) ? scope.regionId : regionFilter;
    const params = new URLSearchParams({ page: String(pageNum), page_size: String(size), members_only: "true", search: search.trim(), region: effectiveRegion, status: statusFilter, type: typeFilter, zone: zoneFilter, woreda: woredaFilter, category: mainCategory, payment_method: paymentFilter });
    const bounds = dateBounds(registrationFilter, registeredFrom, registeredTo);
    if (bounds) {
      params.set("registered_from", bounds.from);
      params.set("registered_before", bounds.before);
    }
    return params;
  };

  const fetchMembers = async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      const url = `/person?${buildMemberParams(page, pageSize).toString()}&include=payment_method`;
      const res = await api.get(url);
      if (requestId !== requestIdRef.current) return;
      setMembers(res.data.people || []);
      setTotalItems(res.data.pagination?.total_items || 0);
      setTotalPages(res.data.pagination?.total_pages || 1);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      console.error("Failed to fetch members:", err);
      toast.error("Failed to sync member directory");
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  };

  // A member who registered but has not paid has no Member ID. An admin who received the
  // fee in cash (or waives it) settles it here; the member then gets their ID and an SMS.
  const [markingPaidId, setMarkingPaidId] = useState<string | null>(null);
  const markAsPaid = async (member: Member) => {
    const name = `${member.first_name} ${member.father_name}`.trim();
    if (!window.confirm(`Record ${name}'s membership fee as collected manually? It will show on the Payments page as manually collected, and they will get their Member ID and an SMS.`)) return;
    setMarkingPaidId(member.id);
    try {
      const res = await api.post(`/admin/members/${member.id}/mark-paid`);
      toast.success(`${name} is now a member${res.data?.ercs_id ? `: ${res.data.ercs_id}` : ""}`);
      await fetchMembers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.response?.data || "Could not mark this member as paid");
    } finally {
      setMarkingPaidId(null);
    }
  };

  const exportToExcel = async () => {
    if (displayedMembers.length === 0) {
      toast.error("No data to export");
      return;
    }
    try {
      toast.loading("Exporting members directory to Excel...", { id: "export-members" });
      const { exportMembersReport } = await import("@/lib/report-export");
      // Export all available members or active view
      await exportMembersReport(displayedMembers, "xlsx");
      toast.success("Members Excel report generated successfully", { id: "export-members" });
    } catch (err) {
      console.error("Excel export error:", err);
      toast.error("Failed to export Excel report", { id: "export-members" });
    }
  };

  const exportToCSV = async () => {
    if (displayedMembers.length === 0) {
      toast.error("No data to export");
      return;
    }
    try {
      toast.loading("Exporting members CSV...", { id: "export-members" });
      const { exportMembersReport } = await import("@/lib/report-export");
      await exportMembersReport(displayedMembers, "csv");
      toast.success("CSV Report Generated", { id: "export-members" });
    } catch (err) {
      console.error("CSV export error:", err);
      toast.error("Failed to export CSV", { id: "export-members" });
    }
  };
  
  const importRegions = useMemo(
    () => regions.map((r) => ({ id: Number(r.id), name: r.name })),
    [regions]
  );

  // A regional admin imports into their own region only, so the template has no Region column.
  const buildMemberConfig = () => {
    const lockedId = isRegionLocked && userScope ? Number(userScope.regionNumber || userScope.regionId) : 0;
    const locked = lockedId
      ? { id: lockedId, name: importRegions.find((r) => r.id === lockedId)?.name || userScope?.regionName || `Region ${lockedId}` }
      : null;
    return memberImportConfig(importRegions, locked);
  };

  const importFlow = useImportFlow({
    getConfig: buildMemberConfig,
    regions: importRegions,
    fileLabel: "member_import",
    batchSize: 25,
    submit: async (batch) => {
      const lockedId = isRegionLocked && userScope ? Number(userScope.regionNumber || userScope.regionId) : 0;
      const people = batch.map(({ clean }) => ({
        first_name: clean.firstName,
        father_name: clean.fatherName,
        grandfather_name: clean.grandfatherName || "",
        email: clean.email || "",
        phone_number: clean.phone,
        national_id: clean.nationalId || "",
        date_of_birth: clean.dob || "",
        gender: clean.gender || "",
        region: Number(clean.region) || lockedId,
        membership_type: clean.membershipType,
        metadata: "{}",
      }));
      const res = await api.post("/person/bulk", people);
      return (res.data as { success: boolean; error?: string }[]).map((r) => (r.success ? null : r.error || "Could not save this row."));
    },
    onFinished: () => fetchMembers(),
  });

  const downloadTemplate = async () => {
    try {
      const wb = await buildTemplateWorkbook(buildMemberConfig());
      await downloadWorkbook(wb, "ercs_member_import_template.xlsx");
      toast.success("Template downloaded. Open the Instructions sheet first.");
    } catch (err) {
      console.error("Template generation failed:", err);
      toast.error("Failed to generate Excel template.");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) await importFlow.openFile(file);
  };

  const exportToPDF = () => {
    // For a clean PDF without external heavy libs, we use the browser's print capability
    // with a dedicated report view. For actual PDF generation in background, 
    // jspdf would be used as: import { jsPDF } from "jspdf"; ...
    window.print();
    toast.info("Preparing PDF Report...");
  };

  const resetFilters = () => {
    setRegionFilter("");
    setZoneFilter("");
    setWoredaFilter("");
    setMainCategory("");
    setPaymentFilter("");
    setStatusFilter("");
    setTypeFilter("");
    setRegistrationFilter("");
    setRegisteredFrom("");
    setRegisteredTo("");
    setSearch("");
    setPage(1);
  };

  return (
    <div className="space-y-6 print:p-0">
      <PageHeader
        title="Member Directory"
        description="Manage hierarchy and status across all regions."
        actions={
          <>
            <Button 
                onClick={downloadTemplate}
                variant="outline" 
                className="rounded-xl h-10 px-4 font-bold border-gray-200 flex items-center gap-2 text-xs"
            >
                <Download className="h-4 w-4" /> Template
            </Button>
            <Button 
                onClick={exportToExcel}
                variant="outline" 
                className="rounded-xl h-10 px-4 font-bold border-gray-200 flex items-center gap-2 text-xs text-[#ED1C24] hover:bg-red-50 cursor-pointer"
            >
                <Download className="h-4 w-4" /> Excel
            </Button>
            <Button 
                onClick={exportToCSV}
                variant="outline" 
                className="rounded-xl h-10 px-4 font-bold border-gray-200 flex items-center gap-2 text-xs cursor-pointer"
            >
                <TableIcon className="h-4 w-4" /> CSV
            </Button>
            <div className="relative">
                <Input 
                    type="file" 
                    accept=".xlsx" 
                    onChange={handleImport} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <Button 
                    variant="outline" 
                    className="rounded-xl h-10 px-4 font-bold border-gray-200 flex items-center gap-2 text-xs"
                >
                    <Upload className="h-4 w-4" /> Import
                </Button>
            </div>
            <Button 
                onClick={exportToPDF}
                variant="outline" 
                className="rounded-xl h-10 px-4 font-bold border-gray-200 flex items-center gap-2 text-xs"
            >
                <FileText className="h-4 w-4" /> PDF
            </Button>
            <Button 
                onClick={() => setShowAddMemberModal(true)}
                className="rounded-xl h-10 px-5 font-bold flex items-center gap-2 bg-[#ED1C24] hover:bg-black text-white text-xs transition-colors"
            >
                <Plus className="h-4 w-4" /> Add Member
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-3 print:hidden">
        <div className="flex w-full items-center justify-between gap-3">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#ED1C24]" />
                <Input
                placeholder="Search Identity..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="h-10 pl-10 bg-white text-black border border-gray-200 rounded-xl font-black text-xs focus:ring-4 focus:ring-[#ED1C24]/10 transition-all shadow-sm"
                />
            </div>

            <Button 
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "default" : "outline"}
                className={`h-10 px-6 rounded-xl font-black transition-all flex items-center gap-2 text-[10px] uppercase tracking-widest ${showFilters ? 'bg-white text-black border border-gray-200 shadow-sm' : 'border border-gray-200 bg-transparent text-gray-500 hover:bg-gray-50'}`}
            >
                <Filter className="h-4 w-4" /> 
                {showFilters ? 'Hide' : 'Filters'}
            </Button>
        </div>

        {showFilters && (
          <section aria-label="Member filters" className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="mf-category" className={filterLabel}>Category</label>
                <select id="mf-category" value={mainCategory} onChange={(e) => { setMainCategory(e.target.value); setTypeFilter(""); }} className={filterSelect}>
                  <option value="">All groups</option>
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="CORPORATE">Corporate</option>
                </select>
              </div>
              <div>
                <label htmlFor="mf-type" className={filterLabel}>Type</label>
                <select id="mf-type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} disabled={!mainCategory} className={filterSelect}>
                  <option value="">{mainCategory ? "All types" : "Choose a category first"}</option>
                  {mainCategory === "INDIVIDUAL" && (
                    <>
                      <option value="ANNUAL">Annual</option>
                      <option value="LIFE">Lifetime</option>
                      <option value="YOUTH">Youth</option>
                    </>
                  )}
                  {mainCategory === "CORPORATE" && (
                    <>
                      <option value="SILVER">Silver</option>
                      <option value="GOLD">Gold</option>
                      <option value="PLATINUM">Platinum</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label htmlFor="mf-status" className={filterLabel}>Status</label>
                <select id="mf-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={filterSelect}>
                  <option value="">All statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="PENDING">Pending</option>
                  <option value="PENDING_PAYMENT">Unpaid (no Member ID yet)</option>
                </select>
              </div>
              <div>
                <label htmlFor="mf-payment" className={filterLabel}>Payment method</label>
                <select id="mf-payment" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className={filterSelect}>
                  <option value="">All methods</option>
                  <option value="MANUAL">Manual</option>
                  <option value="ARIFPAY">ArifPay</option>
                </select>
              </div>

              <div>
                <label htmlFor="mf-region" className={cn(filterLabel, "flex items-center gap-1")}>
                  {isRegionLocked && <Lock className="h-3 w-3 text-[#ED1C24]" />}
                  Region
                </label>
                <select
                  id="mf-region"
                  value={regionFilter}
                  onChange={(e) => { setRegionFilter(e.target.value); setZoneFilter(""); setWoredaFilter(""); }}
                  disabled={isRegionLocked}
                  className={filterSelect}
                >
                  {isRegionLocked ? (
                    <option value={regionFilter}>{userScope?.regionName} (locked)</option>
                  ) : (
                    <>
                      <option value="">All regions</option>
                      {regions.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              <div>
                <label htmlFor="mf-zone" className={filterLabel}>Zone / sub-city</label>
                <select
                  id="mf-zone"
                  value={zoneFilter}
                  onChange={(e) => { setZoneFilter(e.target.value); setWoredaFilter(""); }}
                  disabled={!regionFilter || zoneOptions.length === 0}
                  className={filterSelect}
                >
                  <option value="">{!regionFilter ? "Choose a region first" : zoneOptions.length === 0 ? "No zones listed" : "All zones"}</option>
                  {zoneOptions.map((z) => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="mf-woreda" className={filterLabel}>Woreda</label>
                <select id="mf-woreda" value={woredaFilter} onChange={(e) => setWoredaFilter(e.target.value)} disabled={!zoneFilter} className={filterSelect}>
                  <option value="">{zoneFilter ? "All woredas" : "Choose a zone first"}</option>
                  {woredaOptions.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="max-w-3xl">
                <DateFilterControls id="members-registered" label="Registered date" value={registrationFilter} from={registeredFrom} to={registeredTo}
                  onValueChange={(value) => { setRegistrationFilter(value); setSelectedMemberIds(new Set()); setPage(1); }}
                  onFromChange={(value) => { setRegisteredFrom(value); setSelectedMemberIds(new Set()); setPage(1); }}
                  onToChange={(value) => { setRegisteredTo(value); setSelectedMemberIds(new Set()); setPage(1); }} />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1 text-xs font-bold text-[#B5121B] hover:underline">
                <X className="h-3.5 w-3.5" /> Reset filters
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedMemberIds.size > 0 && (
        <div className="bg-white border-2 border-[#ED1C24] rounded-2xl px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-red-500/10 animate-in fade-in slide-in-from-top-2 duration-200 print:hidden">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center px-3 py-1 bg-[#ED1C24] text-white rounded-full text-[10px] font-black tracking-wider uppercase shadow-sm">
              {selectedMemberIds.size} Selected
            </span>
            {totalItems > selectedMemberIds.size && selectedMemberIds.size >= displayedMembers.length && isAllSelected ? (
              <p className="text-xs font-bold text-gray-700">
                All {displayedMembers.length} on this page are selected.{" "}
                <button
                  type="button"
                  onClick={selectAllMatching}
                  disabled={selectingAll}
                  className="text-[#ED1C24] underline underline-offset-2 font-black disabled:opacity-50"
                >
                  {selectingAll ? "Selecting..." : `Select all ${totalItems} matching records`}
                </button>
              </p>
            ) : selectedMemberIds.size >= totalItems && totalItems > displayedMembers.length ? (
              <p className="text-xs font-bold text-gray-700">
                All {totalItems} matching records are selected.
              </p>
            ) : (
              <p className="text-xs font-bold text-gray-700 hidden sm:block">
                Perform bulk actions on selected members:
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={copySelectedIDs}
              size="sm"
              variant="outline"
              className="h-8 px-3 rounded-xl bg-white border-gray-200 text-black font-black text-[10px] uppercase tracking-wider hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
            >
              <Copy className="h-3.5 w-3.5 text-gray-600" /> Copy IDs
            </Button>
            <Button
              onClick={copySelectedPhones}
              size="sm"
              variant="outline"
              className="h-8 px-3 rounded-xl bg-white border-gray-200 text-black font-black text-[10px] uppercase tracking-wider hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
            >
              <Phone className="h-3.5 w-3.5 text-gray-600" /> Copy Phones
            </Button>
            <Button
              onClick={() => exportSelected("xlsx")}
              size="sm"
              variant="outline"
              className="h-8 px-3 rounded-xl bg-white border-gray-200 text-[#ED1C24] font-black text-[10px] uppercase tracking-wider hover:bg-red-50 flex items-center gap-1.5 shadow-sm"
            >
              <Download className="h-3.5 w-3.5" /> Export Excel
            </Button>
            <Button
              onClick={() => exportSelected("csv")}
              size="sm"
              variant="outline"
              className="h-8 px-3 rounded-xl bg-white border-gray-200 text-gray-700 font-black text-[10px] uppercase tracking-wider hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button
              onClick={clearSelection}
              size="sm"
              variant="ghost"
              className="h-8 px-2.5 rounded-xl text-gray-400 hover:text-black font-black text-[10px] uppercase tracking-wider"
            >
              <X className="h-3.5 w-3.5 mr-1" /> Deselect All
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto print:shadow-none print:border-none print:rounded-none">
        <Table>
          <TableHeader className="print:bg-transparent">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 print:hidden">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  aria-label="Select all members"
                  className={cn(
                    "h-5 w-5 rounded-md border flex items-center justify-center transition-all cursor-pointer",
                    isAllSelected
                      ? "bg-[#ED1C24] border-[#ED1C24] text-white shadow-sm"
                      : isSomeSelected
                      ? "bg-red-50 border-[#ED1C24] text-[#ED1C24]"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  )}
                >
                  {isAllSelected && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
                  {isSomeSelected && <div className="h-2 w-2 rounded-sm bg-[#ED1C24]" />}
                </button>
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Full Identity</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Payment method</TableHead>
              <TableHead>Registered date</TableHead>
              <TableHead>
                <div className="flex items-center gap-1.5 group relative cursor-help">
                  <span>Status</span>
                  <Info className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-600 transition-colors" />
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50 w-64 p-3 bg-gray-900 text-white text-[11px] font-medium rounded-xl shadow-xl border border-gray-800 pointer-events-none normal-case tracking-normal">
                    <p className="font-bold text-white mb-1">ERCS Membership Status:</p>
                    <p className="text-gray-300 mb-1"><span className="text-emerald-400 font-semibold">ACTIVE:</span> Annual membership contribution fee paid for current cycle & identity verified.</p>
                    <p className="text-gray-300 mb-1"><span className="text-amber-400 font-semibold">INACTIVE:</span> Annual renewal overdue (over 12 months) or explicitly marked inactive.</p>
                    <p className="text-gray-300"><span className="text-blue-400 font-semibold">PENDING:</span> New registration undergoing branch review or pending initial payment.</p>
                  </div>
                </div>
              </TableHead>
              <TableHead className="text-right print:hidden">Audit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                     <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin" />
                     <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Syncing Registry...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : displayedMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-64 text-center">
                   <p className="text-sm font-bold text-gray-400">{registrationFilter === "range" && !dateBounds(registrationFilter, registeredFrom, registeredTo) ? "Choose a valid start and end date." : "No members found matching your filters."}</p>
                </TableCell>
              </TableRow>
            ) : (
              displayedMembers.map((member) => (
                <TableRow 
                  key={member.id} 
                  className={cn(
                    "transition-colors border-gray-50",
                    selectedMemberIds.has(member.id) 
                      ? "bg-red-50/40 hover:bg-red-50/60" 
                      : "hover:bg-[#ED1C24]/5"
                  )}
                >
                  <TableCell className="w-12 px-4 print:hidden">
                    <button
                      type="button"
                      onClick={(e) => toggleSelectMember(member, e)}
                      aria-label={`Select member ${member.ercs_id}`}
                      className={cn(
                        "h-5 w-5 rounded-md border flex items-center justify-center transition-all cursor-pointer",
                        selectedMemberIds.has(member.id)
                          ? "bg-[#ED1C24] border-[#ED1C24] text-white shadow-sm"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      )}
                    >
                      {selectedMemberIds.has(member.id) && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
                    </button>
                  </TableCell>
                  <TableCell className="font-black text-black text-[11px]">
                    <div className="flex items-center gap-2 group">
                      {!member.ercs_id ? (
                        <span className="text-[10px] font-bold text-gray-400 normal-case tracking-normal">Issued on payment</span>
                      ) : null}
                      <span 
                        onClick={(e) => copyToClipboard(member.ercs_id, "Member ID", e)}
                        className="cursor-pointer hover:text-[#ED1C24] transition-colors"
                        title="Click to copy ID"
                        hidden={!member.ercs_id}
                      >
                        {member.ercs_id}
                      </span>
                      <button
                        type="button"
                        hidden={!member.ercs_id}
                        onClick={(e) => copyToClipboard(member.ercs_id, "Member ID", e)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
                        title="Copy Member ID"
                      >
                        {copiedId === member.ercs_id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-xs">{member.first_name} {member.father_name}</span>
                        <SourceBadge source={member.registration_source} />
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-[9px] uppercase tracking-wider text-gray-400">
                    {(regions || DEFAULT_REGIONS).find(r => String(r.id) === String(member.region))?.name || String(member.region)}
                  </TableCell>
                  <TableCell className="font-bold text-[11px] text-gray-500">
                    {(member as any).membership_type || (member as any).membershipType || "REGULAR"}
                  </TableCell>
                  <TableCell>
                    <PaymentMethodBadge method={member.payment_method} status={member.status} />
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-xs text-gray-500">
                    {member.created_at && !Number.isNaN(Date.parse(member.created_at))
                      ? new Date(member.created_at).toLocaleDateString("en-ET", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </TableCell>

                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                        member.status === "ACTIVE" || !member.status
                          ? "bg-green-50 text-green-600 border border-green-200"
                          : member.status === "INACTIVE"
                          ? "bg-gray-100 text-gray-500 border border-gray-200"
                          : member.status === "EXPIRED"
                          ? "bg-red-50 text-[#ED1C24] border border-red-200"
                          : "bg-amber-50 text-amber-600 border border-amber-200"
                      )}
                    >
                      {member.status === "PENDING_PAYMENT" ? "UNPAID" : member.status || "ACTIVE"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right print:hidden">
                    <div className="flex items-center justify-end gap-1">
                      {member.status === "PENDING_PAYMENT" ? (
                        <button
                          type="button"
                          disabled={markingPaidId === member.id}
                          onClick={() => markAsPaid(member)}
                          className="mr-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
                          title="Fee received or waived: issue the Member ID"
                        >
                          {markingPaidId === member.id ? "Saving…" : "Mark paid"}
                        </button>
                      ) : null}
                      <button 
                        type="button"
                        hidden={!member.ercs_id}
                        onClick={(e) => copyToClipboard(member.ercs_id, "Member ID", e)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors"
                        title="Copy ID"
                      >
                        {copiedId === member.ercs_id ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setSelectedMember(member); setShowModal(true); }}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#ED1C24] transition-colors group"
                        title="View Audit Details"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Member Detail Modal */}
        {showModal && selectedMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100"
                >
                    <div className="p-8 border-b border-gray-50 flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest">Member Audit Log</p>
                            <h2 className="text-2xl font-black tracking-tight text-black">
                                {selectedMember.first_name} {selectedMember.father_name} {selectedMember.grandfather_name}
                            </h2>
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-gray-400">{selectedMember.ercs_id}</p>
                                <button
                                    type="button"
                                    onClick={(e) => copyToClipboard(selectedMember.ercs_id, "Member ID", e)}
                                    className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
                                    title="Copy Member ID"
                                >
                                    {copiedId === selectedMember.ercs_id ? (
                                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                                    ) : (
                                        <Copy className="h-3.5 w-3.5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowModal(false)}
                            className="h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-gray-50 transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>

                    <div className="p-8 grid grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">Identity Details</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Users className="h-4 w-4 text-gray-400" /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Gender</p>
                                            <p className="text-xs font-bold text-black">{selectedMember.gender || "Not Specified"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><FileText className="h-4 w-4 text-gray-400" /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">National ID</p>
                                            <p className="text-xs font-bold text-black">{selectedMember.national_id || "N/A"}</p>
                                        </div>
                                    </div>
                                    {registrationSource(selectedMember.registration_source) && (
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><UserPlus className="h-4 w-4 text-gray-400" /></div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase">Registered</p>
                                                <p className="text-xs font-bold text-gray-900">
                                                    {registrationSource(selectedMember.registration_source)!.label}
                                                    {registrationSource(selectedMember.registration_source)!.detail ? ` · ${registrationSource(selectedMember.registration_source)!.detail}` : ""}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><CreditCard className="h-4 w-4 text-gray-400" /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Category</p>
                                            <p className="text-xs font-bold text-[#ED1C24]">
                                                {(selectedMember as any).membership_type || (selectedMember as any).membershipType || "REGULAR"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">Contact & Location</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Phone className="h-4 w-4 text-gray-400" /></div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase">Phone</p>
                                                <p className="text-xs font-bold text-black">{selectedMember.phone_number || "No Phone"}</p>
                                            </div>
                                        </div>
                                        {selectedMember.phone_number && (
                                            <button
                                                type="button"
                                                onClick={(e) => copyToClipboard(selectedMember.phone_number!, "Phone Number", e)}
                                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
                                                title="Copy Phone Number"
                                            >
                                                {copiedId === selectedMember.phone_number ? (
                                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                                ) : (
                                                    <Copy className="h-3.5 w-3.5" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Mail className="h-4 w-4 text-gray-400" /></div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase">Email</p>
                                                <p className="text-xs font-bold text-black">{selectedMember.email || "No Email"}</p>
                                            </div>
                                        </div>
                                        {selectedMember.email && (
                                            <button
                                                type="button"
                                                onClick={(e) => copyToClipboard(selectedMember.email!, "Email", e)}
                                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
                                                title="Copy Email"
                                            >
                                                {copiedId === selectedMember.email ? (
                                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                                ) : (
                                                    <Copy className="h-3.5 w-3.5" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><MapPin className="h-4 w-4 text-gray-400" /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Location Hierarchy</p>
                                            <p className="text-xs font-bold text-black">
                                                {(regions || DEFAULT_REGIONS).find(r => String(r.id) === String(selectedMember.region))?.name || "Unknown Region"}
                                                {((selectedMember as any).zone_id || (selectedMember as any).zoneId) && ` • ${(selectedMember as any).zone_id || (selectedMember as any).zoneId}`}
                                                {((selectedMember as any).woreda_id || (selectedMember as any).woredaId) && ` • ${(selectedMember as any).woreda_id || (selectedMember as any).woredaId}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 pb-8">
                        {editing && (
                            <form
                                onSubmit={(e) => { e.preventDefault(); saveEdit(); }}
                                className="mb-6 p-6 rounded-2xl border border-gray-200 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                <h4 className="sm:col-span-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">Edit Profile</h4>
                                {([
                                    ["first_name", "First name", "text"],
                                    ["father_name", "Father name", "text"],
                                    ["grandfather_name", "Grandfather name", "text"],
                                    ["phone_number", "Phone", "tel"],
                                    ["email", "Email", "email"],
                                    ["date_of_birth", "Date of birth", "date"],
                                ] as const).map(([key, label, type]) => (
                                    <label key={key} className="flex flex-col gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {label}
                                        <input
                                            type={type}
                                            value={editForm[key]}
                                            onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                                            className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs font-bold text-black normal-case tracking-normal"
                                        />
                                    </label>
                                ))}
                                <label className="flex flex-col gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Gender
                                    <select
                                        value={editForm.gender}
                                        onChange={(e) => setEditForm((f) => ({ ...f, gender: e.target.value }))}
                                        className="h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs font-bold text-black normal-case tracking-normal"
                                    >
                                        <option value="">Select</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                    </select>
                                </label>
                                <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                                    <Button type="button" variant="outline" onClick={() => setEditing(false)} className="rounded-xl h-10 font-black text-[10px] uppercase tracking-widest border-gray-200">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={savingEdit} className="rounded-xl h-10 bg-[#ED1C24] text-white font-black text-[10px] uppercase tracking-widest">
                                        {savingEdit ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        )}
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">System Metadata</h4>
                            <pre className="text-[10px] font-mono text-gray-500 overflow-auto max-h-48">
                                {JSON.stringify(selectedMember, null, 2)}
                            </pre>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <Button className="flex-1 bg-black text-white rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest">
                                Print Audit Record
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => (editing ? setEditing(false) : startEditing(selectedMember))}
                                className="flex-1 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest border-gray-200"
                            >
                                {editing ? "Cancel Edit" : "Edit Profile"}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between print:hidden">
           <div className="flex items-center gap-4">
             <p className="text-[10px] font-black text-black/30 uppercase tracking-widest">
               {totalItems === 0 ? "0" : <><span className="text-black">{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalItems)}</span> of <span className="text-black">{totalItems}</span></>} Records
             </p>
             <label className="flex items-center gap-2 text-[10px] font-black text-black/30 uppercase tracking-widest">
               Per page
               <select
                 value={pageSize}
                 onChange={(e) => setPageSize(Number(e.target.value))}
                 className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-[11px] font-black text-black"
               >
                 {[10, 25, 50, 100].map((n) => (
                   <option key={n} value={n}>{n}</option>
                 ))}
               </select>
             </label>
           </div>

           <nav aria-label="Pagination" className="flex items-center gap-1">
             <Button
               disabled={page === 1 || loading}
               onClick={() => setPage(1)}
               variant="outline"
               aria-label="First page"
               className="h-8 px-2 rounded-lg border-gray-200 bg-white text-[11px] font-black"
             >
               «
             </Button>
             <Button
               disabled={page === 1 || loading}
               onClick={() => setPage(page - 1)}
               variant="outline"
               aria-label="Previous page"
               className="h-8 px-2 rounded-lg border-gray-200 bg-white text-[11px] font-black"
             >
               ‹
             </Button>
             {pageWindow(page, totalPages).map((entry, i) =>
               entry === "…" ? (
                 <span key={`gap-${i}`} className="px-1 text-[11px] font-black text-gray-400">…</span>
               ) : (
                 <Button
                   key={entry}
                   disabled={loading}
                   onClick={() => setPage(entry)}
                   variant={entry === page ? "default" : "outline"}
                   aria-current={entry === page ? "page" : undefined}
                   className={`h-8 min-w-8 px-2 rounded-lg text-[11px] font-black ${entry === page ? "bg-black text-white" : "border-gray-200 bg-white text-black"}`}
                 >
                   {entry}
                 </Button>
               )
             )}
             <Button
               disabled={page >= totalPages || loading}
               onClick={() => setPage(page + 1)}
               variant="outline"
               aria-label="Next page"
               className="h-8 px-2 rounded-lg border-gray-200 bg-white text-[11px] font-black"
             >
               ›
             </Button>
             <Button
               disabled={page >= totalPages || loading}
               onClick={() => setPage(totalPages)}
               variant="outline"
               aria-label="Last page"
               className="h-8 px-2 rounded-lg border-gray-200 bg-white text-[11px] font-black"
             >
               »
             </Button>
           </nav>
        </div>
      </div>

      {/* Print-only Report Header */}
      <div className="hidden print:block mb-8">
          <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-black">Member Registry Report</h1>
                <p className="text-gray-500 font-bold">Ethiopian Red Cross Society</p>
                <div className="mt-4 grid grid-cols-2 gap-x-12 gap-y-2 text-xs">
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Region:</span> {(regions || DEFAULT_REGIONS).find(r => String(r.id) === regionFilter)?.name || "All"}</div>
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Status:</span> {statusFilter || "All"}</div>
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Generated:</span> {isMounted ? new Date().toLocaleString() : ""}</div>
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Total Count:</span> {totalItems}</div>
                </div>
              </div>
              <div className="bg-ercs-red text-white p-4 font-black text-2xl">ERCS</div>
          </div>
      </div>
      
      <ImportReviewDialog
        state={importFlow.state}
        noun="members"
        onImportValid={importFlow.importValid}
        onDownloadErrors={() => importFlow.downloadErrors()}
        onClose={importFlow.close}
      />

      {showAddMemberModal && (
        <AddMemberModal 
            onClose={() => setShowAddMemberModal(false)} 
            onSuccess={() => {
                setShowAddMemberModal(false);
                fetchMembers();
            }}
            regions={regions}
            defaultRegion={userScope?.regionId}
            isRegionLocked={isRegionLocked}
        />
      )}
    </div>
  );
}

// Utility class for badge colors
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
