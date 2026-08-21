"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  User, 
  Globe, 
  Phone, 
  ExternalLink, 
  Eye, 
  Calendar, 
  FileText, 
  X,
  CreditCard,
  Star,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Award,
  ThumbsUp,
  ShieldCheck,
  MapPin,
  Activity,
  Receipt,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  Briefcase,
  Utensils,
  Car,
  Shield,
  Info,
  Users,
  Layers,
  Sparkles,
  Check
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { getRegionName, getZoneName } from "@/lib/constants";

type Organization = {
  id: string;
  name: string;
  type: string;
  contact_person: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  volunteers_needed?: number;
  requirements: string;
  status: string;
  created_at: string;
  rate_per_volunteer?: number;
};

type VolunteerRequest = {
  id: string;
  organization_id: string;
  headcount: number;
  activities_skills: string;
  status: string;
  created_at: string;
  men_count?: number;
  women_count?: number;
  min_experience?: number;
  qualifications?: string;
  payment_amount?: number;
  payment_status?: string;
  activities?: { name: string; count: number }[];
  volunteer_type?: string;
  title?: string;
  description?: string;
  payment_proof_url?: string;
  region_id?: number;
  zone_id?: string;
  region_name?: string;
  zone_name?: string;
  duration_days?: number;
  mission_status?: string;
  org_name?: string;
  org_type?: string;
};

type Assignment = {
  id: string;
  volunteer_name?: string;
  volunteer_id: string;
  vol_first_name?: string;
  vol_father_name?: string;
  volFirstName?: string;
  volFatherName?: string;
  vol_phone?: string;
  volPhone?: string;
  vol_email?: string;
  volEmail?: string;
  status: string;
  assigned_at: string;
  hours_worked?: number;
  rating?: number;
  feedback?: string;
  evaluated_at?: string;
  evaluation?: {
    punctuality: number;
    skills: number;
    teamwork: number;
    conduct: number;
    overall: number;
    hours: number;
    outcome: string;
    notes: string;
  };
};

const parseMissionScope = (rawDesc?: string, rawSkills?: string) => {
  if (!rawDesc && !rawSkills) {
    return {
      title: "",
      description: "Standard mission scope.",
      durationDays: undefined,
      regionName: "",
      zoneName: "",
      perks: null as any,
      breakdown: null as any,
      notes: ""
    };
  }

  if (rawDesc && (rawDesc.trim().startsWith("{") || rawDesc.trim().startsWith("["))) {
    try {
      const parsed = JSON.parse(rawDesc);
      if (parsed && typeof parsed === "object") {
        return {
          title: parsed.title || "",
          description: parsed.description || "",
          durationDays: parsed.duration_days,
          regionName: parsed.region_name || "",
          zoneName: parsed.zone_name || "",
          perks: parsed.perks || null,
          breakdown: parsed.breakdown || null,
          notes: parsed.perks?.notes || parsed.notes || ""
        };
      }
    } catch {
      // Fallback
    }
  }

  return {
    title: "",
    description: rawDesc || rawSkills || "Standard mission scope.",
    durationDays: undefined,
    regionName: "",
    zoneName: "",
    perks: null as any,
    breakdown: null as any,
    notes: ""
  };
};

export default function AdminOrganizationsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  // Main Navigation Tab
  const [activeTab, setActiveTab] = useState<"organizations" | "requests">(
    tabParam === "requests" ? "requests" : "organizations"
  );

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab === "requests") {
      setActiveTab("requests");
    } else if (currentTab === "organizations") {
      setActiveTab("organizations");
    }
  }, [searchParams]);

  // Organizations State
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [orgSearch, setOrgSearch] = useState("");
  const [orgStatusFilter, setOrgStatusFilter] = useState("ALL");
  const [orgLoading, setOrgLoading] = useState(true);
  const [orgPage, setOrgPage] = useState(1);
  const orgPageSize = 10;

  // Volunteer Need Requests State
  const [requests, setRequests] = useState<VolunteerRequest[]>([]);
  const [reqSearch, setReqSearch] = useState("");
  const [reqStatusFilter, setReqStatusFilter] = useState("ALL");
  const [reqLoading, setReqLoading] = useState(false);
  const [reqPage, setReqPage] = useState(1);
  const reqPageSize = 10;

  // Rich Organization Details Modal State
  const [richOrg, setRichOrg] = useState<Organization | null>(null);
  const [richOrgTab, setRichOrgTab] = useState<"overview" | "requests" | "payments" | "reviews">("overview");
  const [richOrgRequests, setRichOrgRequests] = useState<VolunteerRequest[]>([]);
  const [richOrgReviews, setRichOrgReviews] = useState<{ assignment: Assignment; requestTitle: string }[]>([]);
  const [richOrgLoading, setRichOrgLoading] = useState(false);

  // Single Request Inspection Modal State
  const [inspectingReq, setInspectingReq] = useState<VolunteerRequest | null>(null);
  const [inspectingAssignments, setInspectingAssignments] = useState<Assignment[]>([]);
  const [inspectingLoading, setInspectingLoading] = useState(false);

  // Approval / Rejection Modal State
  const [actionOrg, setActionOrg] = useState<Organization | null>(null);
  const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [remarks, setRemarks] = useState("");
  const [ratePerVolunteer, setRatePerVolunteer] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Lock body scroll on modal
  useEffect(() => {
    if (richOrg || inspectingReq || actionOrg) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [richOrg, inspectingReq, actionOrg]);

  // Fetch Organizations
  const fetchOrganizations = useCallback(async () => {
    setOrgLoading(true);
    try {
      const res = await api.get("/organizations?page=1&page_size=100");
      setOrganizations(res.data.organizations || (Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      console.error("Failed to fetch organizations:", err);
      toast.error("Failed to load organizations");
    } finally {
      setOrgLoading(false);
    }
  }, []);

  // Fetch All Volunteer Need Requests
  const fetchRequests = useCallback(async () => {
    setReqLoading(true);
    try {
      let rawRequests: VolunteerRequest[] = [];
      try {
        const res = await api.get("/admin/volunteer-requests?page=1&page_size=100");
        rawRequests = res.data?.requests || (Array.isArray(res.data) ? res.data : []);
      } catch {
        const res = await api.get("/organizations/requests?page=1&page_size=100");
        rawRequests = res.data?.requests || (Array.isArray(res.data) ? res.data : []);
      }
      setRequests(rawRequests);
    } catch (err) {
      console.error("Failed to fetch volunteer requests:", err);
      toast.error("Failed to load volunteer requests");
    } finally {
      setReqLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
    fetchRequests();
  }, [fetchOrganizations, fetchRequests]);

  // Open Rich Organization Details
  const handleOpenRichOrg = async (org: Organization) => {
    setRichOrg(org);
    setRichOrgTab("overview");
    setRichOrgLoading(true);
    try {
      const reqRes = await api.get(`/organizations/requests?organization_id=${org.id}`);
      const orgReqs: VolunteerRequest[] = reqRes.data.requests || [];
      setRichOrgRequests(orgReqs);

      // Fetch reviews/assignments across all requests of this org
      const reviewsList: { assignment: Assignment; requestTitle: string }[] = [];
      await Promise.all(
        orgReqs.map(async (r) => {
          try {
            const assignRes = await api.get(`/organizations/requests/assignments?request_id=${r.id}`);
            const assigns: Assignment[] = assignRes.data.assignments || [];
            assigns.forEach((a) => {
              if (a.rating || a.feedback || a.evaluation?.overall || a.evaluation?.notes) {
                reviewsList.push({
                  assignment: a,
                  requestTitle: r.title || r.activities_skills || `Request #${r.id.slice(0, 8)}`,
                });
              }
            });
          } catch (e) {
            console.warn(`Failed to load assignments for request ${r.id}`, e);
          }
        })
      );
      setRichOrgReviews(reviewsList);
    } catch (err) {
      console.error("Failed to load rich organization data:", err);
      toast.error("Could not load organization activity details");
    } finally {
      setRichOrgLoading(false);
    }
  };

  // Open Request Inspector
  const handleInspectRequest = async (req: VolunteerRequest) => {
    setInspectingReq(req);
    setInspectingLoading(true);
    try {
      const res = await api.get(`/organizations/requests/assignments?request_id=${req.id}`);
      setInspectingAssignments(res.data.assignments || []);
    } catch (err) {
      console.error("Failed to load request assignments:", err);
      setInspectingAssignments([]);
    } finally {
      setInspectingLoading(false);
    }
  };

  // Submit Approval / Decline Action
  const submitAction = async () => {
    if (!actionOrg || !actionType) return;
    setIsProcessing(true);
    try {
      if (actionType === "APPROVED") {
        await api.put(`/organizations/approve-rate`, {
          organization_id: actionOrg.id,
          rate_per_volunteer: ratePerVolunteer,
        });
      } else {
        await api.put(`/organizations/status`, {
          id: actionOrg.id,
          status: actionType,
          remarks: remarks,
        });
      }
      setOrganizations((prev) =>
        prev.map((o) => (o.id === actionOrg.id ? { ...o, status: actionType, rate_per_volunteer: ratePerVolunteer } : o))
      );
      if (richOrg && richOrg.id === actionOrg.id) {
        setRichOrg((prev) => (prev ? { ...prev, status: actionType, rate_per_volunteer: ratePerVolunteer } : null));
      }
      toast.success(`Organization ${actionType.toLowerCase()} successfully`);
      setActionOrg(null);
      setActionType(null);
      setRemarks("");
      setRatePerVolunteer(0);
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update organization status");
    } finally {
      setIsProcessing(false);
    }
  };

  // Organization helper lookup by ID
  const orgMap = useMemo(() => {
    const map = new Map<string, Organization>();
    organizations.forEach((o) => map.set(o.id, o));
    return map;
  }, [organizations]);

  // Filtered Organizations
  const filteredOrgs = useMemo(() => {
    return organizations.filter((org) => {
      const matchSearch =
        org.name.toLowerCase().includes(orgSearch.toLowerCase()) ||
        org.contact_person.toLowerCase().includes(orgSearch.toLowerCase()) ||
        org.email.toLowerCase().includes(orgSearch.toLowerCase()) ||
        (org.type && org.type.toLowerCase().includes(orgSearch.toLowerCase()));
      const matchStatus = orgStatusFilter === "ALL" || org.status === orgStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [organizations, orgSearch, orgStatusFilter]);

  // Paginated Organizations
  const paginatedOrgs = useMemo(() => {
    const start = (orgPage - 1) * orgPageSize;
    return filteredOrgs.slice(start, start + orgPageSize);
  }, [filteredOrgs, orgPage]);

  const totalOrgPages = Math.ceil(filteredOrgs.length / orgPageSize) || 1;

  // Filtered Need Requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const org = orgMap.get(req.organization_id);
      const orgName = org?.name || req.org_name || "";
      const title = req.title || req.activities_skills || "";
      const matchSearch =
        title.toLowerCase().includes(reqSearch.toLowerCase()) ||
        orgName.toLowerCase().includes(reqSearch.toLowerCase()) ||
        (req.volunteer_type && req.volunteer_type.toLowerCase().includes(reqSearch.toLowerCase()));
      const matchStatus = reqStatusFilter === "ALL" || req.status === reqStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [requests, reqSearch, reqStatusFilter, orgMap]);

  // Paginated Need Requests
  const paginatedRequests = useMemo(() => {
    const start = (reqPage - 1) * reqPageSize;
    return filteredRequests.slice(start, start + reqPageSize);
  }, [filteredRequests, reqPage]);

  const totalReqPages = Math.ceil(filteredRequests.length / reqPageSize) || 1;

  // Computed Organization Rich KPIs
  const richOrgKPIs = useMemo(() => {
    const totalReqs = richOrgRequests.length;
    const totalVolunteersRequested = richOrgRequests.reduce((sum, r) => sum + (r.headcount || 0), 0);
    const totalPayments = richOrgRequests.reduce((sum, r) => sum + (r.payment_amount || 0), 0);
    const paidPayments = richOrgRequests
      .filter((r) => r.payment_status === "PAID")
      .reduce((sum, r) => sum + (r.payment_amount || 0), 0);

    const ratings = richOrgReviews
      .map((rev) => rev.assignment.evaluation?.overall || rev.assignment.rating || 0)
      .filter((r) => r > 0);
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "N/A";

    return {
      totalReqs,
      totalVolunteersRequested,
      totalPayments,
      paidPayments,
      totalReviews: richOrgReviews.length,
      avgRating,
    };
  }, [richOrgRequests, richOrgReviews]);

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-red-50 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-wider border border-red-100">
            <Building2 className="h-3.5 w-3.5" /> Partner & Resource Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight leading-none">
            Organization <span className="text-[#ED1C24]">Partners</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm max-w-2xl">
            Manage partner registrations, verify organization applications, review volunteer need requests, and track engagements.
          </p>
        </div>

        {/* Global Summary Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">Partners</p>
              <p className="text-base font-black text-black leading-tight">{organizations.length}</p>
            </div>
          </div>

          <div className="px-4 py-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-red-50 flex items-center justify-center text-[#ED1C24]">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">Need Requests</p>
              <p className="text-base font-black text-[#ED1C24] leading-tight">{requests.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("organizations")}
          className={cn(
            "pb-3.5 px-4 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 border-b-2",
            activeTab === "organizations"
              ? "border-[#ED1C24] text-[#ED1C24]"
              : "border-transparent text-gray-400 hover:text-gray-700"
          )}
        >
          <Building2 className="h-4 w-4" />
          Partner Organizations ({organizations.length})
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={cn(
            "pb-3.5 px-4 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 border-b-2",
            activeTab === "requests"
              ? "border-[#ED1C24] text-[#ED1C24]"
              : "border-transparent text-gray-400 hover:text-gray-700"
          )}
        >
          <Layers className="h-4 w-4" />
          Volunteer Need Requests ({requests.length})
        </button>
      </div>

      {/* TAB 1: PARTNER ORGANIZATIONS */}
      {activeTab === "organizations" && (
        <div className="space-y-4">
          {/* Actions & Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by organization, contact person, or email..."
                  value={orgSearch}
                  onChange={(e) => {
                    setOrgSearch(e.target.value);
                    setOrgPage(1);
                  }}
                  className="h-10 pl-10 bg-gray-50/70 text-black border-gray-200 rounded-xl text-xs font-semibold focus:border-[#ED1C24]"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {["ALL", "APPROVED", "PENDING", "REJECTED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setOrgStatusFilter(st);
                      setOrgPage(1);
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                      orgStatusFilter === st
                        ? "bg-black text-white shadow-sm"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={fetchOrganizations}
              variant="outline"
              className="h-10 px-4 rounded-xl text-xs font-black uppercase tracking-wider border-gray-200 flex items-center gap-2 text-gray-700 hover:bg-gray-100"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", orgLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>

          {/* Organizations Table Container */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/60">
                <TableRow className="border-gray-100">
                  <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Organization Identity
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Representative & Contact
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Rate per Vol.
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Registered Date
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Approval Status
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orgLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin" />
                        <p className="font-black uppercase tracking-widest text-xs text-gray-400">Loading organizations...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedOrgs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                          <Building2 className="h-7 w-7 text-gray-300" />
                        </div>
                        <p className="font-bold text-gray-800 text-base">No partner organizations found</p>
                        <p className="text-gray-400 text-xs">Try adjusting your search criteria or filter.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrgs.map((org) => (
                    <TableRow key={org.id} className="hover:bg-gray-50/60 transition-colors border-gray-100 group">
                      {/* Identity */}
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-3.5">
                          <div className="h-11 w-11 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700 group-hover:bg-[#ED1C24]/10 group-hover:text-[#ED1C24] transition-colors shrink-0">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-black text-gray-900 text-sm leading-tight uppercase tracking-tight">
                              {org.name}
                            </span>
                            <span className="text-[#ED1C24] text-[9px] font-black uppercase tracking-wider">
                              {org.type || "PARTNER ORG"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Representative */}
                      <TableCell className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-gray-900 font-bold text-xs">
                            <User className="h-3.5 w-3.5 text-[#ED1C24]" />
                            {org.contact_person || "Representative"}
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-medium">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {org.email}
                          </div>
                          {org.phone && (
                            <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-medium">
                              <Phone className="h-3 w-3 text-gray-400" />
                              {org.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Rate */}
                      <TableCell className="px-6 py-5">
                        <span className="font-black text-xs text-gray-800">
                          {org.rate_per_volunteer ? `${org.rate_per_volunteer} ETB` : "Not Configured"}
                        </span>
                      </TableCell>

                      {/* Created At */}
                      <TableCell className="px-6 py-5">
                        <span className="text-xs font-semibold text-gray-600">
                          {org.created_at
                            ? new Date(org.created_at).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "Recent"}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-6 py-5">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border",
                            org.status === "APPROVED"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : org.status === "REJECTED"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          )}
                        >
                          {org.status === "APPROVED" && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                          {org.status === "PENDING" && <Clock className="h-3 w-3 text-amber-600 animate-pulse" />}
                          {org.status === "REJECTED" && <XCircle className="h-3 w-3 text-red-600" />}
                          {org.status}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => handleOpenRichOrg(org)}
                            variant="outline"
                            className="h-9 px-3.5 rounded-xl text-xs font-bold border-gray-200 text-gray-700 hover:bg-black hover:text-white transition-colors flex items-center gap-1.5"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Details
                          </Button>

                          {org.status === "PENDING" && (
                            <>
                              <Button
                                onClick={() => {
                                  setActionOrg(org);
                                  setActionType("APPROVED");
                                  setRatePerVolunteer(org.rate_per_volunteer || 0);
                                }}
                                className="h-9 px-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider"
                              >
                                Approve
                              </Button>
                              <Button
                                onClick={() => {
                                  setActionOrg(org);
                                  setActionType("REJECTED");
                                }}
                                variant="outline"
                                className="h-9 px-3.5 border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-[10px] font-black uppercase tracking-wider"
                              >
                                Decline
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {filteredOrgs.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50">
                <span className="text-xs font-semibold text-gray-500">
                  Showing {(orgPage - 1) * orgPageSize + 1} to{" "}
                  {Math.min(orgPage * orgPageSize, filteredOrgs.length)} of {filteredOrgs.length} organizations
                </span>

                {totalOrgPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    <Button
                      disabled={orgPage <= 1}
                      onClick={() => setOrgPage((p) => Math.max(1, p - 1))}
                      variant="outline"
                      className="h-8 px-2.5 rounded-lg border-gray-200 text-xs font-bold gap-1 hover:bg-gray-100"
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalOrgPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setOrgPage(pageNum)}
                          className={cn(
                            "h-8 min-w-8 px-2 rounded-lg text-xs font-black transition-all cursor-pointer",
                            orgPage === pageNum
                              ? "bg-[#ED1C24] text-white shadow-sm"
                              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                          )}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <Button
                      disabled={orgPage >= totalOrgPages}
                      onClick={() => setOrgPage((p) => Math.min(totalOrgPages, p + 1))}
                      variant="outline"
                      className="h-8 px-2.5 rounded-lg border-gray-200 text-xs font-bold gap-1 hover:bg-gray-100"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: VOLUNTEER NEED REQUESTS WITH PAGINATION */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          {/* Actions & Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search requests by title, organization, or volunteer type..."
                  value={reqSearch}
                  onChange={(e) => {
                    setReqSearch(e.target.value);
                    setReqPage(1);
                  }}
                  className="h-10 pl-10 bg-gray-50/70 text-black border-gray-200 rounded-xl text-xs font-semibold focus:border-[#ED1C24]"
                />
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {["ALL", "PENDING", "APPROVED", "IN_PROGRESS", "COMPLETED", "REJECTED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setReqStatusFilter(st);
                      setReqPage(1);
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                      reqStatusFilter === st
                        ? "bg-black text-white shadow-sm"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={fetchRequests}
              variant="outline"
              className="h-10 px-4 rounded-xl text-xs font-black uppercase tracking-wider border-gray-200 flex items-center gap-2 text-gray-700 hover:bg-gray-100"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", reqLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>

          {/* Requests Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/60">
                <TableRow className="border-gray-100">
                  <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Request Title & Org
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Personnel Needed
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Target Location
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Payment & Invoice
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Mission Status
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reqLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin" />
                        <p className="font-black uppercase tracking-widest text-xs text-gray-400">Loading volunteer requests...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                          <Layers className="h-7 w-7 text-gray-300" />
                        </div>
                        <p className="font-bold text-gray-800 text-base">No volunteer need requests found</p>
                        <p className="text-gray-400 text-xs">Verify your search or filter settings.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRequests.map((req) => {
                    const org = orgMap.get(req.organization_id);
                    return (
                      <TableRow key={req.id} className="hover:bg-gray-50/60 transition-colors border-gray-100 group">
                        {/* Title & Organization */}
                        <TableCell className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="font-black text-gray-900 text-sm leading-tight">
                              {req.title || req.activities_skills || `Volunteer Request #${req.id.slice(0, 8)}`}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 text-xs font-bold flex items-center gap-1">
                                <Building2 className="h-3 w-3 text-[#ED1C24]" />
                                {org?.name || req.org_name || "Partner Organization"}
                              </span>
                              {req.volunteer_type && (
                                <span className="px-2 py-0.5 bg-gray-100 rounded-md text-[9px] font-black uppercase text-gray-600">
                                  {req.volunteer_type}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Personnel Needed */}
                        <TableCell className="px-6 py-5">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-black text-sm text-black">
                              {req.headcount} Volunteers
                            </span>
                            {(req.men_count || req.women_count) ? (
                              <span className="text-[10px] font-bold text-gray-400">
                                👨 {req.men_count || 0} • 👩 {req.women_count || 0}
                              </span>
                            ) : null}
                          </div>
                        </TableCell>

                        {/* Location */}
                        <TableCell className="px-6 py-5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                            <MapPin className="h-3.5 w-3.5 text-[#ED1C24] shrink-0" />
                            <span>
                              {req.region_name || getRegionName(req.region_id)}
                              {req.zone_name ? ` • ${req.zone_name}` : req.zone_id ? ` • ${getZoneName(req.zone_id)}` : ""}
                            </span>
                          </div>
                        </TableCell>

                        {/* Payment & Invoice */}
                        <TableCell className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="font-black text-xs text-gray-900">
                              {req.payment_amount ? `${req.payment_amount} ETB` : "0 ETB"}
                            </span>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider w-fit border",
                                req.payment_status === "PAID"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : req.payment_status === "PENDING_VERIFICATION" || req.payment_proof_url
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              )}
                            >
                              {req.payment_status || "PENDING"}
                            </span>
                          </div>
                        </TableCell>

                        {/* Mission Status */}
                        <TableCell className="px-6 py-5">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border",
                              req.status === "APPROVED" || req.status === "FULFILLED"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : req.status === "IN_PROGRESS"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : req.status === "REJECTED"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            )}
                          >
                            {req.status}
                          </span>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-6 py-5 text-right">
                          <Button
                            onClick={() => handleInspectRequest(req)}
                            variant="outline"
                            className="h-9 px-3.5 rounded-xl text-xs font-bold border-gray-200 text-gray-700 hover:bg-black hover:text-white transition-colors flex items-center gap-1.5"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Inspect
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {filteredRequests.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50">
                <span className="text-xs font-semibold text-gray-500">
                  Showing {(reqPage - 1) * reqPageSize + 1} to{" "}
                  {Math.min(reqPage * reqPageSize, filteredRequests.length)} of {filteredRequests.length} requests
                </span>

                {totalReqPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    <Button
                      disabled={reqPage <= 1}
                      onClick={() => setReqPage((p) => Math.max(1, p - 1))}
                      variant="outline"
                      className="h-8 px-2.5 rounded-lg border-gray-200 text-xs font-bold gap-1 hover:bg-gray-100"
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalReqPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setReqPage(pageNum)}
                          className={cn(
                            "h-8 min-w-8 px-2 rounded-lg text-xs font-black transition-all cursor-pointer",
                            reqPage === pageNum
                              ? "bg-[#ED1C24] text-white shadow-sm"
                              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                          )}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <Button
                      disabled={reqPage >= totalReqPages}
                      onClick={() => setReqPage((p) => Math.min(totalReqPages, p + 1))}
                      variant="outline"
                      className="h-8 px-2.5 rounded-lg border-gray-200 text-xs font-bold gap-1 hover:bg-gray-100"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RICH ORGANIZATION DETAILS MODAL ("RICH DATA PAGE") */}
      {richOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-5xl w-full flex flex-col overflow-hidden border border-gray-100 max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-[#ED1C24]/10 text-[#ED1C24] flex items-center justify-center shrink-0 border border-[#ED1C24]/20 shadow-sm">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight uppercase">
                      {richOrg.name}
                    </h2>
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                        richOrg.status === "APPROVED"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : richOrg.status === "REJECTED"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}
                    >
                      {richOrg.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-semibold mt-1">
                    <span className="text-[#ED1C24] font-black uppercase tracking-wider">{richOrg.type}</span>
                    <span>•</span>
                    <span>Representative: {richOrg.contact_person}</span>
                    <span>•</span>
                    <span>Rate: {richOrg.rate_per_volunteer ? `${richOrg.rate_per_volunteer} ETB / Vol` : "Standard"}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setRichOrg(null)}
                className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 4 Rich KPI Summary Cards */}
            <div className="p-6 border-b border-gray-100 bg-white grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Need Requests</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{richOrgKPIs.totalReqs}</p>
                <p className="text-[10px] font-bold text-gray-500 mt-0.5">Campaigns registered</p>
              </div>

              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Volunteers Requested</p>
                <p className="text-2xl font-black text-[#ED1C24] mt-1">{richOrgKPIs.totalVolunteersRequested}</p>
                <p className="text-[10px] font-bold text-gray-500 mt-0.5">Total personnel headcount</p>
              </div>

              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Payments</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{richOrgKPIs.totalPayments} ETB</p>
                <p className="text-[10px] font-bold text-green-600 mt-0.5">{richOrgKPIs.paidPayments} ETB Verified</p>
              </div>

              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Reviews & Rating</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span className="text-2xl font-black text-gray-900">{richOrgKPIs.avgRating}</span>
                </div>
                <p className="text-[10px] font-bold text-gray-500 mt-0.5">{richOrgKPIs.totalReviews} Feedback reviews</p>
              </div>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex items-center gap-2 px-6 border-b border-gray-100 bg-gray-50/40">
              <button
                onClick={() => setRichOrgTab("overview")}
                className={cn(
                  "py-3 px-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5",
                  richOrgTab === "overview"
                    ? "border-[#ED1C24] text-[#ED1C24]"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                )}
              >
                <Building2 className="h-4 w-4" />
                Profile & Contacts
              </button>

              <button
                onClick={() => setRichOrgTab("requests")}
                className={cn(
                  "py-3 px-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5",
                  richOrgTab === "requests"
                    ? "border-[#ED1C24] text-[#ED1C24]"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                )}
              >
                <Layers className="h-4 w-4" />
                Need Requests ({richOrgRequests.length})
              </button>

              <button
                onClick={() => setRichOrgTab("payments")}
                className={cn(
                  "py-3 px-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5",
                  richOrgTab === "payments"
                    ? "border-[#ED1C24] text-[#ED1C24]"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                )}
              >
                <CreditCard className="h-4 w-4" />
                Payments & Financials ({richOrgRequests.filter((r) => r.payment_amount).length})
              </button>

              <button
                onClick={() => setRichOrgTab("reviews")}
                className={cn(
                  "py-3 px-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5",
                  richOrgTab === "reviews"
                    ? "border-[#ED1C24] text-[#ED1C24]"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                )}
              >
                <Star className="h-4 w-4" />
                Volunteer Reviews ({richOrgReviews.length})
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto max-h-[55vh] space-y-6">
              {/* SUB-TAB A: OVERVIEW & CONTACTS */}
              {richOrgTab === "overview" && (
                <div className="space-y-6">
                  {/* Contact Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Representative</p>
                      <p className="font-bold text-gray-900 text-sm">{richOrg.contact_person}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Email Address</p>
                      <a href={`mailto:${richOrg.email}`} className="font-bold text-[#ED1C24] text-sm hover:underline break-all">
                        {richOrg.email}
                      </a>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Phone Number</p>
                      <a href={`tel:${richOrg.phone}`} className="font-bold text-gray-900 text-sm hover:text-[#ED1C24]">
                        {richOrg.phone || "Not provided"}
                      </a>
                    </div>
                  </div>

                  {/* Digital Presence & Registration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-2xl border border-gray-200">
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-[#ED1C24]" /> Official Website
                      </p>
                      {richOrg.website ? (
                        <a
                          href={richOrg.website.startsWith("http") ? richOrg.website : `https://${richOrg.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#ED1C24] text-sm hover:underline inline-flex items-center gap-1"
                        >
                          {richOrg.website} <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <p className="text-gray-400 text-xs font-semibold italic">No website provided</p>
                      )}
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-gray-200">
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#ED1C24]" /> Application Date
                      </p>
                      <p className="font-bold text-gray-900 text-sm">
                        {richOrg.created_at
                          ? new Date(richOrg.created_at).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })
                          : "Recent"}
                      </p>
                    </div>
                  </div>

                  {/* Description & Requirements */}
                  <div className="space-y-4">
                    <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100">
                      <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[#ED1C24]" /> Organization Mandate & Mission
                      </h4>
                      <p className="text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-line">
                        {richOrg.description || "No specific mission description provided."}
                      </p>
                    </div>

                    <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100">
                      <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#ED1C24]" /> Volunteer Qualification Standards
                      </h4>
                      <p className="text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-line">
                        {richOrg.requirements || "Standard Red Cross volunteer deployment requirements apply."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB B: NEED REQUESTS */}
              {richOrgTab === "requests" && (
                <div className="space-y-4">
                  {richOrgLoading ? (
                    <div className="py-12 text-center">
                      <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading requests...</p>
                    </div>
                  ) : richOrgRequests.length === 0 ? (
                    <div className="py-12 text-center bg-gray-50 rounded-2xl border border-gray-100">
                      <Layers className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="font-bold text-gray-800 text-sm">No volunteer requests submitted yet</p>
                      <p className="text-gray-400 text-xs mt-0.5">This organization has not registered any volunteer campaigns.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {richOrgRequests.map((req) => (
                        <div
                          key={req.id}
                          className="p-5 bg-gray-50/60 hover:bg-gray-50 rounded-2xl border border-gray-100 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-black text-gray-900 text-sm">
                                {req.title || req.activities_skills || `Request #${req.id.slice(0, 8)}`}
                              </span>
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border",
                                  req.status === "APPROVED" || req.status === "FULFILLED"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                )}
                              >
                                {req.status}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
                              <span className="flex items-center gap-1 text-black font-black">
                                <Users className="h-3.5 w-3.5 text-[#ED1C24]" />
                                {req.headcount} Volunteers
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-[#ED1C24]" />
                                {req.region_name || getRegionName(req.region_id)}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                {new Date(req.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <p className="text-xs font-black text-gray-900">{req.payment_amount || 0} ETB</p>
                              <p className="text-[10px] font-bold text-gray-400">{req.payment_status || "PENDING"}</p>
                            </div>
                            <Button
                              onClick={() => handleInspectRequest(req)}
                              variant="outline"
                              className="h-9 px-3.5 rounded-xl text-xs font-bold border-gray-200 text-gray-700 hover:bg-black hover:text-white transition-colors"
                            >
                              Inspect
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB C: PAYMENTS & FINANCIALS */}
              {richOrgTab === "payments" && (
                <div className="space-y-4">
                  {richOrgRequests.length === 0 ? (
                    <div className="py-12 text-center bg-gray-50 rounded-2xl border border-gray-100">
                      <CreditCard className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="font-bold text-gray-800 text-sm">No payment records found</p>
                      <p className="text-gray-400 text-xs mt-0.5">No invoices generated for this organization.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {richOrgRequests.map((req) => (
                        <div
                          key={req.id}
                          className="p-5 bg-gray-50/80 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Receipt className="h-4 w-4 text-[#ED1C24]" />
                              <span className="font-black text-gray-900 text-sm">
                                Invoice for {req.title || req.activities_skills || `Request #${req.id.slice(0, 8)}`}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 font-semibold">
                              Headcount: {req.headcount} Volunteers • Created: {new Date(req.created_at).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-base font-black text-black">{req.payment_amount || 0} ETB</p>
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider inline-block border",
                                  req.payment_status === "PAID"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : req.payment_proof_url
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                )}
                              >
                                {req.payment_status || "PENDING"}
                              </span>
                            </div>

                            {req.payment_proof_url && (
                              <a
                                href={req.payment_proof_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-9 px-3.5 bg-white border border-gray-200 hover:border-[#ED1C24] text-xs font-bold text-[#ED1C24] rounded-xl flex items-center gap-1.5 transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5" /> Proof Receipt
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB D: VOLUNTEER REVIEWS & EVALUATIONS */}
              {richOrgTab === "reviews" && (
                <div className="space-y-4">
                  {richOrgReviews.length === 0 ? (
                    <div className="py-12 text-center bg-gray-50 rounded-2xl border border-gray-100">
                      <Star className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="font-bold text-gray-800 text-sm">No volunteer reviews logged yet</p>
                      <p className="text-gray-400 text-xs mt-0.5">The organization has not submitted evaluations for assigned volunteers.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {richOrgReviews.map((rev, idx) => {
                        const evalData = rev.assignment.evaluation;
                        const rating = evalData?.overall || rev.assignment.rating || 5;
                        return (
                          <div key={idx} className="p-5 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
                              <div>
                                <p className="font-black text-gray-900 text-sm">
                                  Volunteer: {rev.assignment.volunteer_name || "Valued Volunteer"}
                                </p>
                                <p className="text-xs font-semibold text-gray-500">
                                  Campaign: {rev.requestTitle} • Assigned: {new Date(rev.assignment.assigned_at).toLocaleDateString()}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg w-fit">
                                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                <span className="font-black text-amber-800 text-xs">{rating} / 5</span>
                              </div>
                            </div>

                            {evalData && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                                <div className="p-2 bg-white rounded-lg border border-gray-100">
                                  <span className="text-gray-400 text-[10px] block">Punctuality</span>
                                  <span className="text-black font-black">{evalData.punctuality || 5}/5</span>
                                </div>
                                <div className="p-2 bg-white rounded-lg border border-gray-100">
                                  <span className="text-gray-400 text-[10px] block">Skills</span>
                                  <span className="text-black font-black">{evalData.skills || 5}/5</span>
                                </div>
                                <div className="p-2 bg-white rounded-lg border border-gray-100">
                                  <span className="text-gray-400 text-[10px] block">Teamwork</span>
                                  <span className="text-black font-black">{evalData.teamwork || 5}/5</span>
                                </div>
                                <div className="p-2 bg-white rounded-lg border border-gray-100">
                                  <span className="text-gray-400 text-[10px] block">Conduct</span>
                                  <span className="text-black font-black">{evalData.conduct || 5}/5</span>
                                </div>
                              </div>
                            )}

                            {(evalData?.notes || rev.assignment.feedback) && (
                              <p className="text-xs font-medium text-gray-700 bg-white p-3 rounded-xl border border-gray-100 italic">
                                &ldquo;{evalData?.notes || rev.assignment.feedback}&rdquo;
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-medium text-gray-500">
                Registered ID: {richOrg.id}
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  onClick={() => setRichOrg(null)}
                  variant="outline"
                  className="h-11 px-5 rounded-xl font-bold uppercase tracking-wider text-xs border-gray-200 text-gray-600 hover:bg-gray-100 flex-1 sm:flex-initial"
                >
                  Close
                </Button>

                {richOrg.status === "PENDING" && (
                  <>
                    <Button
                      onClick={() => {
                        const target = richOrg;
                        setRichOrg(null);
                        setActionOrg(target);
                        setActionType("REJECTED");
                      }}
                      variant="outline"
                      className="h-11 px-5 rounded-xl font-bold uppercase tracking-wider text-xs text-red-600 border-red-200 hover:bg-red-50 flex-1 sm:flex-initial"
                    >
                      Decline
                    </Button>
                    <Button
                      onClick={() => {
                        const target = richOrg;
                        setRichOrg(null);
                        setActionOrg(target);
                        setActionType("APPROVED");
                        setRatePerVolunteer(target.rate_per_volunteer || 0);
                      }}
                      className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-xs text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20 flex-1 sm:flex-initial"
                    >
                      Approve Partner
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE REQUEST INSPECTION MODAL */}
      {inspectingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-3xl w-full flex flex-col overflow-hidden border border-gray-100 max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">
                    {inspectingReq.title || inspectingReq.activities_skills || `Volunteer Request #${inspectingReq.id.slice(0, 8)}`}
                  </h3>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                      inspectingReq.status === "APPROVED" || inspectingReq.status === "FULFILLED"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    )}
                  >
                    {inspectingReq.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-500 mt-1">
                  Submitted by {orgMap.get(inspectingReq.organization_id)?.name || inspectingReq.org_name || "Partner Organization"}
                </p>
              </div>

              <button
                onClick={() => setInspectingReq(null)}
                className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-black uppercase text-gray-400">Headcount</span>
                  <p className="text-base font-black text-black mt-0.5">{inspectingReq.headcount} Volunteers</p>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-black uppercase text-gray-400">Gender Split</span>
                  <p className="text-xs font-bold text-black mt-1">
                    👨 {inspectingReq.men_count || 0} • 👩 {inspectingReq.women_count || 0}
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-black uppercase text-gray-400">Location</span>
                  <p className="text-xs font-bold text-black mt-1 truncate">
                    {inspectingReq.region_name || getRegionName(inspectingReq.region_id)}
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-black uppercase text-gray-400">Billing</span>
                  <p className="text-base font-black text-black mt-0.5">{inspectingReq.payment_amount || 0} ETB</p>
                </div>
              </div>

              {/* Description & Mission Scope Details */}
              {(() => {
                const parsedScope = parseMissionScope(inspectingReq.description, inspectingReq.activities_skills);
                return (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2">Request Mission & Scope</h4>
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                        {parsedScope.title && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                              Mission Objective
                            </span>
                            <span className="text-xs font-bold text-gray-900">{parsedScope.title}</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-700 leading-relaxed font-medium">
                          {parsedScope.description || "Standard mission scope and humanitarian activities."}
                        </p>
                      </div>
                    </div>

                    {/* Logistics & Perks Summary */}
                    {parsedScope.perks && (
                      <div className="space-y-2">
                        <h5 className="text-[11px] font-black uppercase tracking-wider text-gray-500">Logistics & Volunteer Provisions</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {parsedScope.perks.meals && (
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5">
                              <Utensils className="h-4 w-4 text-[#ED1C24] shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[9px] font-black uppercase text-gray-400">Meals</span>
                                <p className="text-xs font-bold text-gray-900 mt-0.5">{parsedScope.perks.meals}</p>
                              </div>
                            </div>
                          )}
                          {parsedScope.perks.transport && (
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5">
                              <Car className="h-4 w-4 text-[#ED1C24] shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[9px] font-black uppercase text-gray-400">Transport</span>
                                <p className="text-xs font-bold text-gray-900 mt-0.5">{parsedScope.perks.transport}</p>
                              </div>
                            </div>
                          )}
                          {parsedScope.perks.accommodation && (
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5">
                              <Building2 className="h-4 w-4 text-[#ED1C24] shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[9px] font-black uppercase text-gray-400">Lodging</span>
                                <p className="text-xs font-bold text-gray-900 mt-0.5">{parsedScope.perks.accommodation}</p>
                              </div>
                            </div>
                          )}
                          {parsedScope.perks.safety_gear && (
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5">
                              <Shield className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[9px] font-black uppercase text-gray-400">Safety Gear</span>
                                <p className="text-xs font-bold text-green-700 mt-0.5">Equipped & Provided</p>
                              </div>
                            </div>
                          )}
                          {parsedScope.perks.certificate && (
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5">
                              <Award className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[9px] font-black uppercase text-gray-400">Certificates</span>
                                <p className="text-xs font-bold text-amber-700 mt-0.5">ERCS Official Issued</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Cost Breakdown */}
                    {parsedScope.breakdown && (
                      <div className="space-y-2">
                        <h5 className="text-[11px] font-black uppercase tracking-wider text-gray-500">Billing & Breakdown</h5>
                        <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          {parsedScope.breakdown.dailyBase !== undefined && (
                            <div>
                              <span className="text-[9px] font-bold text-gray-400 uppercase">Daily Base</span>
                              <p className="font-bold text-gray-900">{parsedScope.breakdown.dailyBase} ETB</p>
                            </div>
                          )}
                          {parsedScope.breakdown.meals !== undefined && (
                            <div>
                              <span className="text-[9px] font-bold text-gray-400 uppercase">Meals</span>
                              <p className="font-bold text-gray-900">{parsedScope.breakdown.meals} ETB</p>
                            </div>
                          )}
                          {parsedScope.breakdown.transport !== undefined && (
                            <div>
                              <span className="text-[9px] font-bold text-gray-400 uppercase">Transport</span>
                              <p className="font-bold text-gray-900">{parsedScope.breakdown.transport} ETB</p>
                            </div>
                          )}
                          {parsedScope.breakdown.insurance !== undefined && (
                            <div>
                              <span className="text-[9px] font-bold text-gray-400 uppercase">Insurance</span>
                              <p className="font-bold text-gray-900">{parsedScope.breakdown.insurance} ETB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {parsedScope.notes && (
                      <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs flex gap-2 items-start">
                        <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[9px] font-black uppercase text-amber-800 tracking-wider">Special Notes</span>
                          <p className="text-amber-900 font-medium mt-0.5">{parsedScope.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Assigned Volunteers List */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#ED1C24]" />
                  Assigned Volunteers ({inspectingAssignments.length})
                </h4>

                {inspectingLoading ? (
                  <div className="py-6 text-center">
                    <div className="h-6 w-6 border-2 border-red-50 border-t-[#ED1C24] rounded-full animate-spin mx-auto mb-1" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading roster...</p>
                  </div>
                ) : inspectingAssignments.length === 0 ? (
                  <div className="py-6 text-center bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-500">No volunteers assigned to this request yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {inspectingAssignments.map((a) => {
                      const name = a.vol_first_name 
                        ? `${a.vol_first_name} ${a.vol_father_name || ""}`.trim()
                        : (a.volFirstName ? `${a.volFirstName} ${a.volFatherName || ""}`.trim() : (a.volunteer_name || `Volunteer #${a.volunteer_id?.slice(0, 8) || "Assigned"}`));
                      const phone = a.vol_phone || a.volPhone;
                      const email = a.vol_email || a.volEmail;

                      return (
                        <div
                          key={a.id}
                          className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-[#ED1C24]" />
                              <span className="font-extrabold text-gray-900">{name}</span>
                              {a.hours_worked !== undefined && a.hours_worked > 0 && (
                                <span className="text-[10px] text-gray-500 font-bold">
                                  ({a.hours_worked} hrs logged)
                                </span>
                              )}
                            </div>
                            {(phone || email) && (
                              <div className="flex items-center gap-3 text-[11px] text-gray-500 pl-6">
                                {phone && (
                                  <a href={`tel:${phone}`} className="flex items-center gap-1 hover:text-black">
                                    <Phone className="h-3 w-3 text-gray-400" />
                                    <span>{phone}</span>
                                  </a>
                                )}
                                {email && (
                                  <a href={`mailto:${email}`} className="flex items-center gap-1 hover:text-black">
                                    <Mail className="h-3 w-3 text-gray-400" />
                                    <span className="truncate max-w-[180px]">{email}</span>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>

                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border shrink-0 self-start sm:self-auto",
                              a.status === "COMPLETED" || a.status === "ONBOARDED"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-white text-gray-700 border-gray-200"
                            )}
                          >
                            {a.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <Button
                onClick={() => setInspectingReq(null)}
                variant="outline"
                className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-xs border-gray-200 text-gray-600 hover:bg-gray-100"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* APPROVE / DECLINE ACTION MODAL */}
      {actionOrg && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden border border-gray-100">
            <div
              className={`p-6 border-b flex items-start gap-4 ${
                actionType === "APPROVED" ? "bg-green-50/50 border-green-100" : "bg-red-50/50 border-red-100"
              }`}
            >
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                  actionType === "APPROVED" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}
              >
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-black tracking-tight leading-none mb-1">
                  {actionType === "APPROVED" ? "Approve" : "Decline"} Partnership
                </h2>
                <p className="text-gray-500 font-medium text-xs">
                  {actionOrg.name} ({actionOrg.type})
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-black mb-2 block">
                  Processing Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={`Enter your remarks for ${actionType.toLowerCase()}...`}
                  className="w-full min-h-[100px] p-4 bg-gray-50 text-black border border-gray-200 rounded-2xl font-medium text-sm focus:border-[#ED1C24] focus:ring-0 transition-all resize-none"
                />
              </div>

              {actionType === "APPROVED" && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-black mb-2 block">
                    Rate Per Volunteer (ETB)
                  </label>
                  <Input
                    type="number"
                    value={ratePerVolunteer}
                    onChange={(e) => setRatePerVolunteer(Number(e.target.value))}
                    placeholder="Enter rate amount..."
                    className="h-11 bg-white text-black border border-gray-200 rounded-xl font-medium text-sm focus:border-[#ED1C24]"
                  />
                  <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wider mt-1.5">
                    Default rate per volunteer charged to this organization.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <Button
                onClick={() => setActionOrg(null)}
                variant="outline"
                className="h-11 px-5 rounded-xl font-bold uppercase tracking-wider text-xs border-gray-200 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={submitAction}
                disabled={isProcessing}
                className={cn(
                  "h-11 px-7 rounded-xl font-bold uppercase tracking-wider text-xs text-white shadow-lg",
                  actionType === "APPROVED"
                    ? "bg-green-600 hover:bg-green-700 shadow-green-600/20"
                    : "bg-[#ED1C24] hover:bg-[#ED1C24]/90 shadow-red-500/20"
                )}
              >
                {isProcessing ? "Processing..." : `Confirm ${actionType === "APPROVED" ? "Approval" : "Decline"}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
