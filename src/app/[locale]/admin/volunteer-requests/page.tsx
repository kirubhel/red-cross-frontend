"use client";

import { useEffect, useState } from "react";
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
  Clock, 
  Users, 
  Eye, 
  X, 
  FileText, 
  UserCheck, 
  CreditCard,
  Briefcase,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type VolunteerRequest = {
  id: string;
  organization_id: string;
  org_name: string;
  headcount: number;
  activities_skills: string;
  status: string;
  created_at: string;
  payment_amount: number;
  payment_status: string;
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  men_count?: number;
  women_count?: number;
  min_experience?: number;
  qualifications?: string;
  activities?: any;
  volunteer_type?: string;
  payment_proof_url?: string;
};

export default function AdminVolunteerRequestsPage() {
  const [requests, setRequests] = useState<VolunteerRequest[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedReq, setSelectedReq] = useState<VolunteerRequest | null>(null);
  const [actionType, setActionType] = useState<"VIEW_DETAILS" | "APPROVE" | "EDIT_PAYMENT" | "VERIFY_PAYMENT" | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedReq) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedReq]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/volunteer-requests");
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      toast.error("Failed to load volunteer requests");
    } finally {
      setLoading(false);
    }
  };

  const submitAction = async () => {
    if (!selectedReq || !actionType || actionType === "VIEW_DETAILS") return;
    setIsProcessing(true);
    try {
      if (actionType === "APPROVE") {
        await api.put(`/admin/volunteer-requests/approve`, { request_id: selectedReq.id });
        toast.success("Request approved — awaiting payment from organization");
      } else if (actionType === "EDIT_PAYMENT") {
        await api.put(`/admin/volunteer-requests/payment`, {
          request_id: selectedReq.id,
          payment_amount: paymentAmount
        });
        toast.success("Payment amount updated successfully");
      } else if (actionType === "VERIFY_PAYMENT") {
        await api.put(`/admin/volunteer-requests/verify-payment`, { request_id: selectedReq.id });
        toast.success("Payment verified — volunteers are being matched!");
      }
      fetchData();
      setSelectedReq(null);
      setActionType(null);
    } catch (err) {
      toast.error("Failed to process request");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredRequests = requests.filter(req => 
    (req.org_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (req.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (req.activities_skills || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest leading-none border border-blue-100">
            <Users className="h-3 w-3" /> Procurement
          </div>
          <h1 className="text-3xl font-black text-black tracking-tighter leading-none">Volunteer <span className="text-blue-600">Requests</span></h1>
          <p className="text-gray-500 font-medium text-sm max-w-2xl">Manage organization requests for volunteers, oversee payments, and approve auto-matching.</p>
        </div>
      </div>

      {/* Actions & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search organizations or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-10 bg-white text-black border border-gray-200 rounded-xl font-bold text-sm focus:border-blue-600/20 focus:ring-0 transition-all shadow-sm shadow-black/5"
            />
        </div>
        <Button onClick={fetchData} className="h-10 px-6 bg-black hover:bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2">
            Refresh Data
        </Button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Organization & Mission</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Headcount & Skills</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Payment Status</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Status</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin" />
                    <p className="font-black uppercase tracking-[0.3em] text-[8px] text-gray-400">Loading Requests...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-[300px] text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-gray-300" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-black text-lg text-black tracking-tight">No requests found</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((req) => (
                <TableRow key={req.id} className="hover:bg-gray-50/50 transition-all duration-300 border-gray-50">
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-black text-black text-sm uppercase">{req.org_name || "Unknown Org"}</span>
                      <span className="text-blue-600 text-xs font-extrabold">{req.title || "Untitled Mission"}</span>
                      <span className="text-gray-400 text-[10px] font-bold">ID: {req.id.substring(0,8)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-black text-xs">{req.headcount} Volunteers</span>
                      <span className="text-gray-500 text-[10px] font-medium line-clamp-1">{req.activities_skills}</span>
                      {req.start_date && req.end_date && (
                        <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {new Date(req.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(req.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-green-600 text-sm">{req.payment_amount || 0} ETB</span>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        req.payment_status === "SUBMITTED" ? "text-amber-500" :
                        req.payment_status === "VERIFIED" ? "text-green-500" : "text-gray-400"
                      )}>{req.payment_status || "PENDING"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className={cn(
                      "px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 w-fit border shadow-sm",
                      req.status === "APPROVED" ? "bg-green-50 text-green-600 border-green-100" : "bg-yellow-50 text-yellow-600 border-yellow-100"
                    )}>
                      {req.status === "APPROVED" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3 animate-pulse" />}
                      {req.status}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right space-x-2">
                    <Button 
                      onClick={() => { setSelectedReq(req); setActionType("VIEW_DETAILS"); }} 
                      variant="outline"
                      className="h-8 px-3 rounded-lg font-black uppercase tracking-widest text-[9px] border-gray-200 text-gray-700 hover:bg-gray-100 flex-inline items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5 text-blue-600" /> Details
                    </Button>
                    <Button 
                      onClick={() => { setSelectedReq(req); setActionType("EDIT_PAYMENT"); setPaymentAmount(req.payment_amount || 0); }} 
                      variant="outline"
                      className="h-8 px-3 rounded-lg font-black uppercase tracking-widest text-[9px]"
                    >
                      Edit Payment
                    </Button>
                    {req.status === "PENDING" && (
                      <Button 
                        onClick={() => { setSelectedReq(req); setActionType("APPROVE"); }} 
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-8 px-3 font-black uppercase tracking-widest text-[9px]"
                      >
                        Approve
                      </Button>
                    )}
                    {req.status === "APPROVED" && req.payment_status === "SUBMITTED" && (
                      <Button 
                        onClick={() => { setSelectedReq(req); setActionType("VERIFY_PAYMENT"); }} 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-8 px-3 font-black uppercase tracking-widest text-[9px]"
                      >
                        Verify Payment
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Details Modal */}
      {selectedReq && actionType === "VIEW_DETAILS" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden border border-gray-100 max-h-[85vh]">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Volunteer Request Details</span>
                <h2 className="text-2xl font-black text-black tracking-tight">{selectedReq.title || selectedReq.activities_skills}</h2>
                <p className="text-xs font-bold text-gray-400">Organization: <span className="text-black font-extrabold">{selectedReq.org_name}</span></p>
              </div>
              <Button variant="ghost" onClick={() => { setSelectedReq(null); setActionType(null); }} className="h-8 w-8 rounded-full p-0 hover:bg-gray-200">
                <X className="h-5 w-5 text-gray-500" />
              </Button>
            </div>

            {/* Body Content */}
            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-left">
              {/* Mission Description */}
              {selectedReq.description && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mission Description</h4>
                  <p className="text-xs font-medium text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed">
                    {selectedReq.description}
                  </p>
                </div>
              )}

              {/* Headcount Breakdown Grid */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Headcount & Gender Split</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Total Needed</span>
                    <p className="text-lg font-black text-blue-700">{selectedReq.headcount} Volunteers</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Men Count</span>
                    <p className="text-lg font-black text-slate-800">{selectedReq.men_count ?? "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Women Count</span>
                    <p className="text-lg font-black text-slate-800">{selectedReq.women_count ?? "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Min Experience</span>
                    <p className="text-lg font-black text-slate-800">{selectedReq.min_experience ? `${selectedReq.min_experience} Yrs` : "None"}</p>
                  </div>
                </div>
              </div>

              {/* Type & Engagement Areas */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Volunteer Type</h4>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 font-bold text-xs text-black">
                    {selectedReq.volunteer_type || "General Volunteer"}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Engagement Areas / Skills</h4>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 font-medium text-xs text-slate-800">
                    {selectedReq.activities_skills}
                  </div>
                </div>
              </div>

              {/* Qualifications */}
              {selectedReq.qualifications && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Specific Qualifications & Requirements</h4>
                  <p className="text-xs font-medium text-slate-700 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    {selectedReq.qualifications}
                  </p>
                </div>
              )}

              {/* Payment Info */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Financial & Payment Status</h4>
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Payment Amount</span>
                    <p className="text-xl font-black text-emerald-900">{selectedReq.payment_amount || 0} ETB</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Payment Status</span>
                    <span className="inline-block px-3 py-1 bg-white rounded-lg text-xs font-black text-emerald-700 border border-emerald-200 mt-0.5">
                      {selectedReq.payment_status || "PENDING"}
                    </span>
                  </div>
                </div>

                {selectedReq.payment_proof_url && (
                  <div className="pt-2">
                    <a 
                      href={selectedReq.payment_proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-black text-blue-600 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> View Payment Proof Document
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <Button onClick={() => { setSelectedReq(null); setActionType(null); }} variant="outline" className="rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px]">
                Close
              </Button>
              {selectedReq.status === "PENDING" && (
                <Button 
                  onClick={() => { setActionType("APPROVE"); }} 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px]"
                >
                  Approve Request
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Details Modal (Approve, Edit Payment, Verify Payment) */}
      {selectedReq && actionType && actionType !== "VIEW_DETAILS" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full flex flex-col overflow-hidden border border-gray-100">
            
            <div className="p-6 border-b bg-gray-50/50">
              <h2 className="text-2xl font-black text-black tracking-tighter">
                {actionType === "APPROVE" ? "Approve Request" : actionType === "VERIFY_PAYMENT" ? "Verify Payment & Match" : "Edit Payment Amount"}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {actionType === "APPROVE" ? (
                <p className="text-sm font-medium text-gray-600">
                  Approve this request from <strong>{selectedReq.org_name}</strong>? The organization will then be notified to submit payment. Volunteer matching will only begin after payment is verified.
                </p>
              ) : actionType === "VERIFY_PAYMENT" ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-600">
                    Confirm that payment from <strong>{selectedReq.org_name}</strong> has been received and verified.
                  </p>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">This will trigger auto-matching</p>
                    <p className="text-sm font-bold text-emerald-900">{selectedReq.headcount} volunteers will be automatically assigned to {selectedReq.org_name}.</p>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-black mb-2 block">
                    Payment Amount (ETB)
                  </label>
                  <Input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="h-12 bg-white text-black border border-gray-200 rounded-xl font-bold"
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <Button onClick={() => setSelectedReq(null)} variant="outline" className="rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px]">Cancel</Button>
              <Button 
                onClick={submitAction}
                disabled={isProcessing}
                className={cn(
                  "text-white rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px]",
                  actionType === "VERIFY_PAYMENT"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-blue-600 hover:bg-blue-700"
                )}
              >
                {isProcessing ? "Processing..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
