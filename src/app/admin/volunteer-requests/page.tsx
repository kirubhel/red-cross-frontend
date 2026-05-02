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
import { Search, Building2, CheckCircle2, Clock, Users, CreditCard } from "lucide-react";
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
};

export default function AdminVolunteerRequestsPage() {
  const [requests, setRequests] = useState<VolunteerRequest[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedReq, setSelectedReq] = useState<VolunteerRequest | null>(null);
  const [actionType, setActionType] = useState<"APPROVE" | "EDIT_PAYMENT" | null>(null);
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
    return () => { document.body.style.overflow = 'unset'; }
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
    if (!selectedReq || !actionType) return;
    setIsProcessing(true);
    try {
      if (actionType === "APPROVE") {
        await api.put(`/admin/volunteer-requests/approve`, { 
          request_id: selectedReq.id
        });
        toast.success("Request approved and volunteers auto-matched");
      } else if (actionType === "EDIT_PAYMENT") {
        await api.put(`/admin/volunteer-requests/payment`, { 
          request_id: selectedReq.id,
          payment_amount: paymentAmount
        });
        toast.success("Payment amount updated successfully");
      }
      fetchData(); // Refresh list to get updated status/amounts
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
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Organization</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Requirements</TableHead>
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
                      <span className="text-gray-500 text-[10px] font-bold">Req ID: {req.id.substring(0,8)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-black text-xs">{req.headcount} Volunteers</span>
                      <span className="text-gray-500 text-[10px] font-medium line-clamp-1">{req.activities_skills}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-green-600 text-sm">{req.payment_amount} ETB</span>
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
                        onClick={() => { setSelectedReq(req); setActionType("EDIT_PAYMENT"); setPaymentAmount(req.payment_amount); }} 
                        variant="outline"
                        className="h-8 px-4 rounded-lg font-black uppercase tracking-widest text-[9px]"
                    >
                        Edit Payment
                    </Button>
                    {req.status === "PENDING" && (
                        <Button 
                            onClick={() => { setSelectedReq(req); setActionType("APPROVE"); }} 
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-8 px-4 font-black uppercase tracking-widest text-[9px]"
                        >
                            Approve Match
                        </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Action Details Modal */}
      {selectedReq && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full flex flex-col overflow-hidden border border-gray-100">
            
            <div className="p-6 border-b bg-gray-50/50">
              <h2 className="text-2xl font-black text-black tracking-tighter">
                {actionType === "APPROVE" ? "Approve & Match" : "Edit Payment Amount"}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {actionType === "APPROVE" ? (
                <p className="text-sm font-medium text-gray-600">
                  Are you sure you want to approve this request? This will automatically match <strong>{selectedReq.headcount}</strong> volunteers with matching skills and assign them to <strong>{selectedReq.org_name}</strong>.
                </p>
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
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px]"
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
