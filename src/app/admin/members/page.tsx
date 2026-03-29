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
import { Search, Users, Plus } from "lucide-react";
import api from "@/lib/api";

type Member = {
  id: string;
  firstName: string;
  fatherName: string;
  region: string;
  status: string;
  ercsId: string;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchMembers();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [search, page]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/person?page=${page}&page_size=${pageSize}&search=${search}`);
      setMembers(res.data.people || []);
      setTotalItems(res.data.pagination?.total_items || 0);
      setTotalPages(res.data.pagination?.total_pages || 1);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
            <Users className="h-3.5 w-3.5" /> Registry
          </div>
          <h1 className="text-5xl font-black text-black tracking-tighter">Member Directory</h1>
          <p className="text-gray-500 font-medium text-lg">Manage all registered members, hierarchy, and status across all regions.</p>
        </div>

        <Button className="bg-[#ED1C24] hover:bg-black text-white rounded-2xl h-14 px-8 font-black shadow-xl shadow-red-500/10 transition-all flex items-center gap-2">
            <Plus className="h-5 w-5" /> Add New Member
        </Button>
      </div>

      <div className="flex w-full items-center space-x-2">
        <div className="relative w-full max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, ERCS ID, or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 pl-12 bg-black text-white border-none rounded-2xl font-bold text-lg focus:ring-2 focus:ring-[#ED1C24]/10 transition-all shadow-xl"
            />
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-50">
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">ERCS ID</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">First Name</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Father Name</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Region</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Status</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                     <div className="h-10 w-10 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin" />
                     <p className="text-xs font-black uppercase tracking-widest text-gray-400">Syncing Registry...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                   <p className="text-sm font-bold text-gray-400">No members found matching your search.</p>
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id} className="hover:bg-gray-50/50 transition-colors border-gray-50">
                  <TableCell className="px-8 py-6 font-black text-black text-xs">{member.ercsId}</TableCell>
                  <TableCell className="px-8 py-6 font-bold text-gray-700">{member.firstName}</TableCell>
                  <TableCell className="px-8 py-6 font-bold text-gray-700">{member.fatherName}</TableCell>
                  <TableCell className="px-8 py-6 font-black text-[10px] uppercase tracking-wider text-gray-400">{member.region ? member.region.toString().replace('_', ' ') : 'N/A'}</TableCell>
                  <TableCell className="px-8 py-6">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                        member.status === "Active" || !member.status
                          ? "bg-[#ECFDF5] text-[#065F46] border border-[#10B981]/10"
                          : member.status === "Inactive"
                          ? "bg-[#FEF2F2] text-[#ED1C24] border border-[#ED1C24]/10"
                          : "bg-[#FFFBEB] text-[#92400E] border border-[#F59E0B]/10"
                      )}
                    >
                      {member.status || "Active"}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    <Button variant="ghost" className="h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all bg-gray-50 underline-offset-4 hover:no-underline">
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
           <p className="text-xs font-bold text-gray-400">
             Showing <span className="text-black font-black">{(page-1)*pageSize + 1}</span> to <span className="text-black font-black">{Math.min(page*pageSize, totalItems)}</span> of <span className="text-black font-black">{totalItems}</span> members
           </p>

           <div className="flex items-center gap-2">
             <Button 
               disabled={page === 1 || loading}
               onClick={() => setPage(page - 1)}
               variant="outline" 
               className="h-10 rounded-xl px-4 font-black text-[10px] uppercase tracking-widest disabled:opacity-30"
             >
               Previous
             </Button>
             <div className="flex items-center justify-center h-10 w-10 bg-white border border-gray-200 rounded-xl text-xs font-black text-black">
                {page}
             </div>
             <Button 
               disabled={page >= totalPages || loading}
               onClick={() => setPage(page + 1)}
               variant="outline" 
               className="h-10 rounded-xl px-4 font-black text-[10px] uppercase tracking-widest disabled:opacity-30"
             >
               Next
             </Button>
           </div>
        </div>
      </div>
    </div>
  );
}

// Utility class for badge colors (could be moved to global css or utils)
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
