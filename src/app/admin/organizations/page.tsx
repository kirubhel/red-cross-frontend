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

  const handleOrgAction = async (id: string, action: "APPROVED" | "REJECTED") => {
    try {
      await api.put(`/organizations/status`, { id, status: action });
      setOrgRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
      toast.success(`Organization ${action.toLowerCase()} successfully`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filteredOrgs = orgRequests.filter(org => 
    org.name.toLowerCase().includes(search.toLowerCase()) ||
    org.contact_person.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 p-6 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-[#ED1C24] rounded-full text-xs font-black uppercase tracking-widest leading-none border border-red-100">
            <Building2 className="h-4 w-4" /> Partner Management
          </div>
          <h1 className="text-6xl font-black text-black tracking-tighter leading-none">Organization <span className="text-[#ED1C24]">Partners</span></h1>
          <p className="text-gray-400 font-medium text-xl max-w-2xl">Manage partnership requests from humanitarian organizations seeking volunteer support through our hub.</p>
        </div>
      </div>

      {/* Actions & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full max-w-xl">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search organizations or contact person..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-20 pl-16 bg-white text-black border-2 border-gray-50 rounded-3xl font-bold text-lg focus:border-[#ED1C24]/20 focus:ring-0 transition-all shadow-xl shadow-black/5"
            />
        </div>
        <Button onClick={fetchData} className="h-20 px-10 bg-black hover:bg-[#ED1C24] text-white rounded-3xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3">
            Refresh Data
        </Button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[48px] border border-gray-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.04)] overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Organization Identity</TableHead>
              <TableHead className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Representative</TableHead>
              <TableHead className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Resource Need</TableHead>
              <TableHead className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Approval Status</TableHead>
              <TableHead className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-[500px] text-center">
                  <div className="flex flex-col items-center gap-6">
                    <div className="h-12 w-12 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin" />
                    <p className="font-black uppercase tracking-[0.3em] text-[10px] text-gray-300">Synchronizing Vault...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredOrgs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-[500px] text-center">
                  <div className="flex flex-col items-center gap-6">
                    <div className="h-24 w-24 bg-gray-50 rounded-[32px] flex items-center justify-center">
                        <Building2 className="h-10 w-10 text-gray-200" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-black text-2xl text-black tracking-tight">No requests found</p>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Verify your search criteria or refresh data</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrgs.map((org) => (
                <TableRow key={org.id} className="hover:bg-gray-50/50 transition-all duration-300 border-gray-50 group">
                  <TableCell className="px-10 py-10">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-[#ED1C24]/5 transition-colors">
                            <Building2 className="h-8 w-8 text-black group-hover:text-[#ED1C24] transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-black text-2xl leading-none tracking-tighter uppercase">{org.name}</span>
                          <span className="text-[#ED1C24] text-[10px] font-black uppercase tracking-[0.2em]">{org.type}</span>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-10">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-black font-black text-sm tracking-tight">
                         <User className="h-4 w-4 text-[#ED1C24]" /> {org.contact_person}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 font-bold text-xs">
                         <Mail className="h-4 w-4" /> {org.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-10">
                    <div className="flex flex-col">
                      <span className="font-black text-black text-3xl tracking-tighter leading-none">{org.volunteers_needed}</span>
                      <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Requested Personnel</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-10">
                    <div className={cn(
                      "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 w-fit border shadow-sm",
                      org.status === "APPROVED" ? "bg-green-50 text-green-600 border-green-100" :
                      org.status === "REJECTED" ? "bg-red-50 text-red-600 border-red-100" :
                      "bg-yellow-50 text-yellow-600 border-yellow-100"
                    )}>
                      {org.status === "PENDING" && <Clock className="h-3.5 w-3.5 animate-pulse" />}
                      {org.status === "APPROVED" && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {org.status === "REJECTED" && <XCircle className="h-3.5 w-3.5" />}
                      {org.status}
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-10 text-right">
                    {org.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                        <Button 
                            onClick={() => handleOrgAction(org.id, "APPROVED")} 
                            className="bg-green-500 hover:bg-black text-white rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-green-500/10"
                        >
                            Approve
                        </Button>
                        <Button 
                            onClick={() => handleOrgAction(org.id, "REJECTED")} 
                            variant="outline" 
                            className="text-red-500 hover:bg-red-50 border-red-100 rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px] transition-all"
                        >
                            Decline
                        </Button>
                      </div>
                    ) : (
                        <div className="flex items-center justify-end gap-2 text-gray-300 font-bold text-xs italic">
                            Processed at {new Date().toLocaleDateString()}
                        </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
