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
import { Search, Building2, CheckCircle2, XCircle, Clock, Mail, User, Globe, Phone, ExternalLink, Eye, Calendar, FileText, X } from "lucide-react";
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
  const [viewingOrg, setViewingOrg] = useState<OrganizationRequest | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationRequest | null>(null);
  const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [remarks, setRemarks] = useState("");
  const [ratePerVolunteer, setRatePerVolunteer] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedOrg || viewingOrg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedOrg, viewingOrg]);

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
      if (actionType === "APPROVED") {
        await api.put(`/organizations/approve-rate`, { 
          organization_id: selectedOrg.id, 
          rate_per_volunteer: ratePerVolunteer
        });
      } else {
        await api.put(`/organizations/status`, { 
          id: selectedOrg.id, 
          status: actionType,
          remarks: remarks 
        });
      }
      setOrgRequests(prev => prev.map(req => req.id === selectedOrg.id ? { ...req, status: actionType } : req));
      toast.success(`Organization ${actionType.toLowerCase()} successfully`);
      setSelectedOrg(null);
      setActionType(null);
      setRemarks("");
      setRatePerVolunteer(0);
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
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-red-100 text-[#ED1C24] rounded-full text-[10px] font-bold uppercase tracking-wider leading-none border border-red-100">
            <Building2 className="h-3.5 w-3.5" /> Partner Management
          </div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight leading-none">Organization <span className="text-[#ED1C24]">Partners</span></h1>
          <p className="text-gray-500 font-medium text-sm max-w-2xl">Manage partnership requests from humanitarian organizations seeking volunteer support through our hub.</p>
        </div>
      </div>

      {/* Actions & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full max-w-md">
             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search organizations or contact person..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-10 bg-white text-black border border-gray-200 rounded-xl font-medium text-sm focus:border-[#ED1C24]/30 focus:ring-0 transition-all shadow-sm"
            />
        </div>
        <Button onClick={fetchData} className="h-10 px-5 bg-black hover:bg-[#ED1C24] text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2">
            Refresh Data
        </Button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Organization Identity</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Representative</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Resource Need</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Approval Status</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin" />
                    <p className="font-bold uppercase tracking-widest text-xs text-gray-400">Loading requests...</p>
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
                        <p className="font-bold text-lg text-black tracking-tight">No requests found</p>
                        <p className="text-gray-400 font-medium text-xs">Verify your search criteria or refresh data</p>
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
                          <span className="font-bold text-gray-900 text-base leading-none uppercase">{org.name}</span>
                          <span className="text-[#ED1C24] text-[10px] font-semibold uppercase tracking-wider">{org.type}</span>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-gray-900 font-bold text-xs tracking-tight">
                         <User className="h-3.5 w-3.5 text-[#ED1C24]" /> {org.contact_person}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 font-medium text-xs">
                         <Mail className="h-3.5 w-3.5" /> {org.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-black text-xl leading-none">{org.volunteers_needed}</span>
                      <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mt-1">Volunteers Needed</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-6">
                    <div className={cn(
                      "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit border shadow-sm",
                      org.status === "APPROVED" ? "bg-green-50 text-green-700 border-green-200" :
                      org.status === "REJECTED" ? "bg-red-50 text-red-700 border-red-200" :
                      "bg-yellow-50 text-yellow-700 border-yellow-200"
                    )}>
                      {org.status === "PENDING" && <Clock className="h-3.5 w-3.5 animate-pulse" />}
                      {org.status === "APPROVED" && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {org.status === "REJECTED" && <XCircle className="h-3.5 w-3.5" />}
                      {org.status}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        onClick={() => setViewingOrg(org)}
                        variant="outline"
                        className="h-9 px-3.5 border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        <Eye className="h-3.5 w-3.5 text-gray-500" />
                        View Details
                      </Button>

                      {org.status === "PENDING" ? (
                        <>
                          <Button 
                              onClick={() => { setSelectedOrg(org); setActionType("APPROVED"); setRemarks(""); setRatePerVolunteer(0); }} 
                              className="bg-green-600 hover:bg-green-700 text-white rounded-xl h-9 px-4 font-bold uppercase tracking-wider text-[10px] transition-all shadow-sm"
                          >
                              Approve
                          </Button>
                          <Button 
                              onClick={() => { setSelectedOrg(org); setActionType("REJECTED"); setRemarks(""); setRatePerVolunteer(0); }} 
                              variant="outline" 
                              className="text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300 rounded-xl h-9 px-4 font-bold uppercase tracking-wider text-[10px] transition-all"
                          >
                              Decline
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Organization Full Details Modal */}
      {viewingOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[#ED1C24]/10 text-[#ED1C24] flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none">
                      {viewingOrg.name}
                    </h2>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      viewingOrg.status === "APPROVED" ? "bg-green-50 text-green-700 border-green-200" :
                      viewingOrg.status === "REJECTED" ? "bg-red-50 text-red-700 border-red-200" :
                      "bg-yellow-50 text-yellow-700 border-yellow-200"
                    )}>
                      {viewingOrg.status}
                    </span>
                  </div>
                  <p className="text-gray-500 font-medium text-xs mt-1">
                    Organization Type: <span className="text-[#ED1C24] font-semibold">{viewingOrg.type}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setViewingOrg(null)}
                className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content - Full Organization Details */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Key Meta Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-[#ED1C24]" /> Representative
                  </span>
                  <p className="font-bold text-gray-900 text-sm">{viewingOrg.contact_person}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#ED1C24]" /> Resource Request
                  </span>
                  <p className="font-bold text-gray-900 text-sm">{viewingOrg.volunteers_needed} Volunteers Needed</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#ED1C24]" /> Application Date
                  </span>
                  <p className="font-bold text-gray-900 text-sm">
                    {viewingOrg.created_at ? new Date(viewingOrg.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Contact Information & Links */}
              <div className="p-5 bg-white rounded-2xl border border-gray-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#ED1C24]" /> Contact Details & Website
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                    <a href={`mailto:${viewingOrg.email}`} className="font-semibold text-[#ED1C24] hover:underline break-all">
                      {viewingOrg.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                    <a href={`tel:${viewingOrg.phone}`} className="font-semibold text-gray-900 hover:text-[#ED1C24]">
                      {viewingOrg.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Official Website</p>
                    {viewingOrg.website ? (
                      <a 
                        href={viewingOrg.website.startsWith('http') ? viewingOrg.website : `https://${viewingOrg.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-semibold text-[#ED1C24] hover:underline"
                      >
                        {viewingOrg.website} <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-gray-400 font-medium italic text-xs">No website provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Requirements & Description */}
              <div className="space-y-4">
                <div className="p-5 bg-white rounded-2xl border border-gray-200 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#ED1C24]" /> Qualification & Volunteer Requirements
                  </h3>
                  <p className="text-gray-800 text-sm font-medium leading-relaxed bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                    {viewingOrg.requirements || 'Standard volunteer deployment requirements apply.'}
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-gray-200 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#ED1C24]" /> Organization Mission & Project Description
                  </h3>
                  <p className="text-gray-800 text-sm font-medium leading-relaxed bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 whitespace-pre-line">
                    {viewingOrg.description || 'No detailed mission description provided.'}
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-medium text-gray-500">
                {viewingOrg.status === "PENDING" ? "Review all details above before taking an approval action." : `This request is currently ${viewingOrg.status.toLowerCase()}.`}
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button 
                  onClick={() => setViewingOrg(null)}
                  variant="outline"
                  className="h-11 px-5 rounded-xl font-bold uppercase tracking-wider text-xs border-gray-200 text-gray-600 hover:bg-gray-100 flex-1 sm:flex-initial"
                >
                  Close
                </Button>

                {viewingOrg.status === "PENDING" && (
                  <>
                    <Button 
                      onClick={() => {
                        const target = viewingOrg;
                        setViewingOrg(null);
                        setSelectedOrg(target);
                        setActionType("REJECTED");
                        setRemarks("");
                        setRatePerVolunteer(0);
                      }}
                      variant="outline"
                      className="h-11 px-5 rounded-xl font-bold uppercase tracking-wider text-xs text-red-600 border-red-200 hover:bg-red-50 flex-1 sm:flex-initial flex items-center gap-1.5"
                    >
                      <XCircle className="h-4 w-4" /> Decline
                    </Button>
                    <Button 
                      onClick={() => {
                        const target = viewingOrg;
                        setViewingOrg(null);
                        setSelectedOrg(target);
                        setActionType("APPROVED");
                        setRemarks("");
                        setRatePerVolunteer(0);
                      }}
                      className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-xs text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20 flex-1 sm:flex-initial flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Approve Partner
                    </Button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

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
                <h2 className="text-2xl font-extrabold text-black tracking-tight leading-none mb-1">
                  {actionType === 'APPROVED' ? 'Approve' : 'Decline'} Partnership
                </h2>
                <p className="text-gray-500 font-medium text-xs">
                  Review organization details and provide actionable remarks.
                </p>
              </div>
            </div>

            {/* Modal Content - Action Details */}
            <div className="p-6 overflow-y-auto max-h-[50vh] space-y-6">
              
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" /> Organization
                  </div>
                  <div className="font-extrabold text-black text-base tracking-tight uppercase">{selectedOrg.name}</div>
                  <div className="text-[#ED1C24] text-[10px] font-bold uppercase tracking-wider mt-1">{selectedOrg.type}</div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-2">
                    <User className="h-3.5 w-3.5" /> Representative
                  </div>
                  <div className="font-bold text-black text-sm">{selectedOrg.contact_person}</div>
                  <div className="flex flex-col gap-1 mt-1.5">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-600 lowercase">
                      <Mail className="h-3.5 w-3.5 text-[#ED1C24]" /> {selectedOrg.email}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-600">
                      <Phone className="h-3.5 w-3.5 text-[#ED1C24]" /> {selectedOrg.phone}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5" /> Digital Presence
                  </div>
                  {selectedOrg.website ? (
                    <a 
                      href={selectedOrg.website.startsWith('http') ? selectedOrg.website : `https://${selectedOrg.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-[#ED1C24] uppercase tracking-wider hover:bg-gray-50 transition-colors group"
                    >
                      Visit Website <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  ) : (
                    <div className="text-gray-400 text-xs font-medium italic">No website provided</div>
                  )}
                </div>

                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" /> Personnel Request
                  </div>
                  <div className="font-bold text-black text-sm">{selectedOrg.volunteers_needed} Volunteers Needed</div>
                  <div className="text-gray-600 text-[10px] font-semibold uppercase tracking-wider mt-1.5 border w-fit px-2 py-1 rounded-md bg-white border-gray-200 shadow-sm">
                    {selectedOrg.requirements || 'Standard requirements apply'}
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Mission Description</div>
                  <div className="font-medium text-gray-700 text-xs leading-relaxed bg-white/50 p-3 rounded-xl border border-gray-100">
                    {selectedOrg.description || 'No detailed mission description provided.'}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-black mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#ED1C24] rounded-full"></span>
                  Processing Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={`Enter your remarks for ${actionType.toLowerCase()}...`}
                  className="w-full min-h-[120px] p-4 bg-gray-50 text-black border border-gray-200 rounded-2xl font-medium text-sm focus:border-[#ED1C24]/30 focus:ring-0 transition-all shadow-inner resize-none"
                />
                <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wider mt-2 ml-2">These remarks will be securely attached to the organizational record.</p>
              </div>

              {actionType === "APPROVED" && (
                <div className="pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#ED1C24] rounded-full"></span>
                    Rate Per Volunteer (ETB)
                  </label>
                  <Input
                    type="number"
                    value={ratePerVolunteer}
                    onChange={(e) => setRatePerVolunteer(Number(e.target.value))}
                    placeholder="Enter rate amount..."
                    className="h-12 bg-white text-black border border-gray-200 rounded-xl font-medium text-sm focus:border-[#ED1C24]/20 focus:ring-0 transition-all shadow-sm"
                  />
                  <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wider mt-2 ml-2">This is the default rate per volunteer charged to this organization.</p>
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <Button 
                onClick={() => setSelectedOrg(null)}
                variant="outline"
                className="h-12 px-6 rounded-xl font-bold uppercase tracking-wider text-xs border-gray-200 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button 
                onClick={submitAction}
                disabled={isProcessing}
                className={`h-12 px-8 rounded-xl font-bold uppercase tracking-wider text-xs text-white shadow-lg ${
                  actionType === 'APPROVED' ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20' : 'bg-[#ED1C24] hover:bg-[#ED1C24]/90 shadow-red-500/20'
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

