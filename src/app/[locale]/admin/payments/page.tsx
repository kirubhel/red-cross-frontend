"use client";

export const dynamic = 'force-dynamic';

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
import { Search, CreditCard, Clock, CheckCircle2, XCircle, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { ElectronicReceiptModal, ReceiptData } from "@/components/payment/ElectronicReceiptModal";

type Payment = {
  id: string;
  invoice_number?: string;
  person_id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  created_at: string;
  payer_name?: string;
  payer_phone?: string;
  payer_email?: string;
  payment_method?: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

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

  const openReceipt = (p: Payment) => {
    const receipt: ReceiptData = {
      id: p.id,
      invoiceNumber: p.invoice_number || `ERCS-REC-2026-${p.id.slice(0, 8).toUpperCase()}`,
      payerName: p.payer_name || p.person_id || "ERCS Contributor",
      payerPhone: p.payer_phone,
      payerEmail: p.payer_email,
      amount: p.amount,
      currency: p.currency || "ETB",
      paymentMethod: p.payment_method || "Online Gateway",
      transactionRef: p.id,
      description: p.description || "ERCS Membership / Contribution",
      issuedAt: p.created_at ? new Date(p.created_at).toLocaleString() : new Date().toLocaleString(),
      status: p.status || "PAID",
    };
    setSelectedReceipt(receipt);
    setIsReceiptOpen(true);
  };

  const filtered = payments.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      p.id.toLowerCase().includes(s) ||
      (p.invoice_number && p.invoice_number.toLowerCase().includes(s)) ||
      (p.person_id && p.person_id.toLowerCase().includes(s)) ||
      (p.description && p.description.toLowerCase().includes(s))
    );
  });

  return (
    <div className="space-y-6 w-full max-w-full pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-red-100 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
            <CreditCard className="h-3 w-3" /> Finance
          </div>
          <h1 className="text-3xl font-black text-black tracking-tighter">Payments & Electronic Receipts</h1>
          <p className="text-gray-500 font-medium text-sm">Monitor all membership transactions, donations, and pre-numbered electronic receipts.</p>
        </div>

        <Button className="bg-[#ED1C24] hover:bg-black text-white rounded-xl h-10 px-6 font-black shadow-sm transition-all flex items-center gap-2 text-xs">
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="flex w-full items-center space-x-2">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by invoice number, transaction ID, or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-10 bg-gray-50 text-black border-gray-100 rounded-xl font-bold text-sm focus:ring-2 focus:ring-[#ED1C24]/10 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-50">
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black">Receipt No / ID</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black">Payer / ID</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black">Description</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black">Amount</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black">Status</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black">Date</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin mx-auto mb-4" />
                  <p className="font-bold flex items-center justify-center gap-2 text-gray-400 uppercase tracking-widest text-[10px]">Processing Records...</p>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <p className="font-bold text-gray-400">No payment records found.</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id} className="hover:bg-gray-50/50 transition-colors border-gray-50">
                  <TableCell className="px-6 py-4">
                    <span className="font-mono font-bold text-gray-900 text-xs uppercase">
                      {p.invoice_number || p.id.slice(0, 13) + '...'}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-xs font-bold text-gray-700">{p.payer_name || p.person_id}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs font-bold">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-600">
                      {p.description || "Membership Fee"}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="font-black text-sm text-black">
                      {p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-[10px]">{p.currency || "ETB"}</span>
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit",
                        p.status === "SUCCESS" || p.status === "PAID"
                          ? "bg-green-100 text-green-600"
                          : p.status === "FAILED"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      )}
                    >
                      {(p.status === "PENDING" || p.status === "UNPAID") && <Clock className="h-3 w-3" />}
                      {(p.status === "SUCCESS" || p.status === "PAID") && <CheckCircle2 className="h-3 w-3" />}
                      {p.status === "FAILED" && <XCircle className="h-3 w-3" />}
                      {p.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-gray-400 text-[10px]">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openReceipt(p)}
                      className="h-8 px-3 text-xs font-bold border-gray-200 text-gray-700 hover:text-[#ED1C24] hover:bg-red-50 gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Electronic PDF Receipt Modal */}
      <ElectronicReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receipt={selectedReceipt}
      />
    </div>
  );
}
