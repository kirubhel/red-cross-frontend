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
import { Search, CreditCard, Clock, CheckCircle2, XCircle, Download } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type Payment = {
  id: string;
  person_id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  created_at: string;
};


export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/payments");
      setPayments(res.data.invoices || []);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      toast.error("Failed to load payments");
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
            <CreditCard className="h-3.5 w-3.5" /> Finance
          </div>
          <h1 className="text-5xl font-black text-black tracking-tighter">Payments Tracking</h1>
          <p className="text-gray-500 font-medium text-lg">Monitor all membership transactions, donations, and event fees.</p>
        </div>

        <Button className="bg-[#ED1C24] hover:bg-black text-white rounded-2xl h-14 px-8 font-black shadow-xl shadow-red-500/10 transition-all flex items-center gap-2">
            <Download className="h-5 w-5" /> Export Report
        </Button>
      </div>

      <div className="flex w-full items-center space-x-2">
        <div className="relative w-full max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by transaction ID or email..."
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
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Transaction ID</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Email</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Type</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Amount</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Status</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin mx-auto mb-4" />
                  <p className="font-bold flex items-center justify-center gap-2 text-gray-400 uppercase tracking-widest text-[10px]">Processing Records...</p>
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
                <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <p className="font-bold text-gray-400">No payment records found.</p>
                </TableCell>
              </TableRow>
            ) : (
                payments.map((p) => (
                    <TableRow key={p.id} className="hover:bg-gray-50/50 transition-colors border-gray-50">
                    <TableCell className="px-8 py-6">
                        <span className="font-black text-black text-lg leading-tight uppercase tracking-tighter">{p.id}</span>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                        <span className="text-sm font-bold text-gray-500">{p.person_id}</span>
                    </TableCell>
                    <TableCell className="px-8 py-6 text-sm font-bold">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-600">
                            {p.description || 'N/A'}
                        </span>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                        <span className="font-black text-lg text-black">{p.amount} <span className="text-xs">{p.currency}</span></span>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                        <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit",
                        p.status === "SUCCESS" || p.status === "PAID" ? "bg-green-100 text-green-600" :
                        p.status === "FAILED" ? "bg-red-100 text-red-600" :
                        "bg-yellow-100 text-yellow-600"
                        )}>
                        {(p.status === "PENDING" || p.status === "UNPAID") && <Clock className="h-3 w-3" />}
                        {(p.status === "SUCCESS" || p.status === "PAID") && <CheckCircle2 className="h-3 w-3" />}
                        {p.status === "FAILED" && <XCircle className="h-3 w-3" />}
                        {p.status}
                        </span>
                    </TableCell>
                    <TableCell className="px-8 py-6 text-right font-bold text-gray-400 text-xs">
                        {p.created_at}
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
