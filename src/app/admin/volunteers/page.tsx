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
import { Search, HandHeart, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type Volunteer = {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  region: string;
  hoursSpent: number;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
};


export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/volunteers");
      // Map PB internal structure to UI structure if needed
      setVolunteers(res.data.volunteers || []);
    } catch (err) {
      console.error("Failed to fetch volunteers:", err);
      toast.error("Failed to load volunteers");
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
            <HandHeart className="h-3.5 w-3.5" /> Volunteers System
          </div>
          <h1 className="text-5xl font-black text-black tracking-tighter">Volunteer Registry</h1>
          <p className="text-gray-500 font-medium text-lg">Manage all field volunteers, track hours, and coordinate field activities.</p>
        </div>

        <Button className="bg-[#ED1C24] hover:bg-black text-white rounded-2xl h-14 px-8 font-black shadow-xl shadow-red-500/10 transition-all flex items-center gap-2">
            <Plus className="h-5 w-5" /> Add Field Member
        </Button>
      </div>

      <div className="flex w-full items-center space-x-2">
        <div className="relative w-full max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, region or phone..."
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
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Volunteer Identity</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Contact</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Location</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Contribution</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volunteers.map((v) => (
                <TableRow key={v.id} className="hover:bg-gray-50/50 transition-colors border-gray-50">
                <TableCell className="px-8 py-6">
                    <span className="font-black text-black text-lg leading-tight uppercase tracking-tighter">{v.first_name} {v.last_name}</span>
                </TableCell>
                <TableCell className="px-8 py-6">
                    <span className="text-sm font-bold text-gray-500">{v.phone_number}</span>
                </TableCell>

                <TableCell className="px-8 py-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-full">{v.region}</span>
                </TableCell>
                <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-2">
                        <span className="font-black text-lg text-[#ED1C24]">{v.hoursSpent} <span className="text-[10px] uppercase font-black opacity-40">Hrs</span></span>
                        {v.hoursSpent > 100 && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                    </div>
                </TableCell>
                <TableCell className="px-8 py-6 text-right">
                    <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        v.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                    )}>
                        {v.status}
                    </span>
                </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
