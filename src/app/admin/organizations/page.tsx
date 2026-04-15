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
import { Search, Building2, CheckCircle2, XCircle, Clock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type OrganizationRequest = {
  id: string;
  name: string;
  type: string;
  contact_person: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  volunteers_needed: number;
  requirements: string;
  status: string;
  created_at: string;
};

export default function AdminOrganizationsPage() {
  const [orgRequests, setOrgRequests] = useState<OrganizationRequest[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedOrg, setSelectedOrg] = useState<OrganizationRequest | null>(null);
  const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [remarks, setRemarks] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const orgRes = await api.get("/organizations");
      setOrgRequests(orgRes.data.organizations || []);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const submitAction = async () => {
    if (!selectedOrg || !actionType) return;
    setIsProcessing(true);
    try {
      await api.put(`/organizations/status`, { 
        id: selectedOrg.id, 
        status: actionType,
        remarks: remarks 
      });
      setOrgRequests(prev => prev.map(req => req.id === selectedOrg.id ? { ...req, status: actionType } : req));
      toast.success(`Organization ${actionType.toLowerCase()} successfully`);
      setSelectedOrg(null);
      setActionType(null);
      setRemarks("");
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredOrgs = orgRequests.filter(org => 
    org.name.toLowerCase().includes(search.toLowerCase()) ||
    org.contact_person.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-red-100 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-widest leading-none border border-red-100">
            <Building2 className="h-3 w-3" /> Partner Management
          </div>
          <h1 className="text-3xl font-black text-black tracking-tighter leading-none">Organization <span className="text-[#ED1C24]">Partners</span></h1>
          <p className="text-gray-500 font-medium text-sm max-w-2xl">Manage partnership requests from humanitarian organizations seeking volunteer support through our hub.</p>
        </div>
      </div>

      {/* Actions & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search organizations or contact person..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-10 bg-white text-black border border-gray-200 rounded-xl font-bold text-sm focus:border-[#ED1C24]/20 focus:ring-0 transition-all shadow-sm shadow-black/5"
            />
        </div>
        <Button onClick={fetchData} className="h-10 px-6 bg-black hover:bg-[#ED1C24] text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2">
            Refresh Data
        </Button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Organization Identity</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Representative</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Resource Need</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Approval Status</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin" />
                    <p className="font-black uppercase tracking-[0.3em] text-[8px] text-gray-400">Synchronizing Vault...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredOrgs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-[300px] text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-gray-300" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-black text-lg text-black tracking-tight">No requests found</p>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Verify your search criteria or refresh data</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrgs.map((org) => (
                <TableRow key={org.id} className="hover:bg-gray-50/50 transition-all duration-300 border-gray-50 group">
                  <TableCell className="px-6 py-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-[#ED1C24]/5 transition-colors">
                            <Building2 className="h-6 w-6 text-black group-hover:text-[#ED1C24] transition-colors" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-black text-black text-lg leading-none tracking-tighter uppercase">{org.name}</span>
                          <span className="text-[#ED1C24] text-[9px] font-black uppercase tracking-[0.2em]">{org.type}</span>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-black font-black text-xs tracking-tight">
                         <User className="h-3.5 w-3.5 text-[#ED1C24]" /> {org.contact_person}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 font-bold text-[11px]">
                         <Mail className="h-3.5 w-3.5" /> {org.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-black text-2xl tracking-tighter leading-none">{org.volunteers_needed}</span>
                      <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest mt-1">Requested Personnel</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-6">
                    <div className={cn(
                      "px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 w-fit border shadow-sm",
                      org.status === "APPROVED" ? "bg-green-50 text-green-600 border-green-100" :
                      org.status === "REJECTED" ? "bg-red-50 text-red-600 border-red-100" :
                      "bg-yellow-50 text-yellow-600 border-yellow-100"
                    )}>
                      {org.status === "PENDING" && <Clock className="h-3 w-3 animate-pulse" />}
                      {org.status === "APPROVED" && <CheckCircle2 className="h-3 w-3" />}
                      {org.status === "REJECTED" && <XCircle className="h-3 w-3" />}
                      {org.status}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-6 text-right">
                    {org.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-2 transition-all duration-300">
                        <Button 
                            onClick={() => { setSelectedOrg(org); setActionType("APPROVED"); setRemarks(""); }} 
                            className="bg-green-500 hover:bg-green-600 text-white rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[9px] transition-all shadow-sm"
                        >
                            Approve
                        </Button>
                        <Button 
                            onClick={() => { setSelectedOrg(org); setActionType("REJECTED"); setRemarks(""); }} 
                            variant="outline" 
                            className="text-red-500 hover:bg-red-50 border-gray-200 hover:border-red-200 rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[9px] transition-all"
                        >
                            Decline
                        </Button>
                      </div>
                    ) : (
                        <div className="flex items-center justify-end gap-2 text-gray-400 font-bold text-[10px] italic">
                            Processed on {new Date().toLocaleDateString()}
                        </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Action Details Modal */}
      {selectedOrg && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className={`p-6 border-b flex items-start gap-4 ${actionType === 'APPROVED' ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${actionType === 'APPROVED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-black tracking-tighter leading-none mb-1">
                  {actionType === 'APPROVED' ? 'Approve' : 'Decline'} Partnership
                </h2>
                <p className="text-gray-500 font-bold text-xs">
                  Review organization details and provide actionable remarks.
                </p>
              </div>
            </div>

            {/* Modal Content - Action Details */}
            <div className="p-6 overflow-y-auto max-h-[50vh] space-y-6">
              
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Organization</div>
                  <div className="font-black text-black text-sm">{selectedOrg.name}</div>
                  <div className="text-[#ED1C24] text-[10px] font-bold mt-0.5">{selectedOrg.type}</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Contact Needs</div>
                  <div className="font-black text-black text-sm">{selectedOrg.volunteers_needed} Personnel</div>
                  <div className="text-gray-600 text-[10px] font-bold mt-0.5 border w-fit px-2 py-0.5 rounded-md bg-white border-gray-200">{selectedOrg.requirements || 'No specific requirements listed'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Description</div>
                  <div className="font-bold text-gray-700 text-xs leading-relaxed">{selectedOrg.description || 'No detailed description provided.'}</div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-black mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#ED1C24] rounded-full"></span>
                  Processing Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={`Enter your remarks for ${actionType.toLowerCase()}...`}
                  className="w-full min-h-[120px] p-4 bg-gray-50 text-black border border-gray-200 rounded-2xl font-bold text-sm focus:border-[#ED1C24]/30 focus:ring-0 transition-all shadow-inner resize-none"
                />
                <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mt-2 ml-2">These remarks will be securely attached to the organizational record.</p>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <Button 
                onClick={() => setSelectedOrg(null)}
                variant="outline"
                className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] border-gray-200 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button 
                onClick={submitAction}
                disabled={isProcessing}
                className={`h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] text-white shadow-lg ${
                  actionType === 'APPROVED' ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' : 'bg-[#ED1C24] hover:bg-[#ED1C24]/90 shadow-red-500/20'
                }`}
              >
                {isProcessing ? 'Processing...' : `Confirm ${actionType === 'APPROVED' ? 'Approval' : 'Decline'}`}
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
