"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Heart, 
  ArrowRight, 
  Calendar, 
  Hash, 
  User, 
  Mail, 
  ShieldCheck, 
  Download,
  FileText,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ElectronicReceiptModal, ReceiptData } from "@/components/payment/ElectronicReceiptModal";
import PostPaymentFlow from "@/components/payment/PostPaymentFlow";
import api from "@/lib/api";

type CheckState = "checking" | "paid" | "pending" | "failed" | "notfound";

// The redirect back from ArifPay proves nothing: ask the server, which asks ArifPay.
const CHECK_EVERY_MS = 3000;
const CHECK_FOR_MS = 60000;

function PaymentDetails() {
  const searchParams = useSearchParams();
  
  const [amount, setAmount] = useState("0");
  const [currency, setCurrency] = useState("ETB");
  const [email, setEmail] = useState("");
  const [txRef, setTxRef] = useState("");
  const [check, setCheck] = useState<CheckState>("checking");
  const [purpose, setPurpose] = useState("");
  const [memberId, setMemberId] = useState("");
  const [checkRound, setCheckRound] = useState(0);
  const [firstName, setFirstName] = useState("Contributor");
  const [lastName, setLastName] = useState("");
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isPostPaymentOpen, setIsPostPaymentOpen] = useState(false);
  const autoOpenedRef = useRef(false);

  useEffect(() => {
    const amt = searchParams.get("amount");
    const curr = searchParams.get("currency");
    const em = searchParams.get("email");
    const ref = searchParams.get("tx_ref") || searchParams.get("invoice_id");
    const fn = searchParams.get("first_name");
    const ln = searchParams.get("last_name");

    if (amt) setAmount(amt);
    if (curr) setCurrency(curr);
    if (em) setEmail(em);
    if (ref) setTxRef(ref);
    if (fn) setFirstName(fn);
    if (ln) setLastName(ln);
    if (!ref) setCheck("notfound");
  }, [searchParams]);

  // Confirm the payment with the server; keep checking for a minute while ArifPay settles.
  useEffect(() => {
    if (!txRef) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const startedAt = Date.now();
    setCheck("checking");

    const run = async () => {
      let next: CheckState = "pending";
      try {
        const res = await api.get(`/payment/verify/${encodeURIComponent(txRef)}`);
        const d = res.data || {};
        if (d.amount) setAmount(String(d.amount));
        if (d.currency) setCurrency(d.currency);
        if (d.purpose) setPurpose(d.purpose);
        if (d.ercs_id) setMemberId(d.ercs_id);
        if (d.status === "SUCCESS") next = "paid";
        else if (d.status === "FAILED") next = "failed";
      } catch (err: any) {
        if (err?.response?.status === 404) next = "notfound";
      }
      if (cancelled) return;
      if (next === "pending" && Date.now() - startedAt < CHECK_FOR_MS) {
        timer = setTimeout(run, CHECK_EVERY_MS);
        return;
      }
      setCheck(next);
    };
    run();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [txRef, checkRound]);

  const isMembership = purpose === "MEMBERSHIP";
  const isOrgRequest = purpose === "ORG_REQUEST";

  // A paid membership shows the receipt straight away; closing it leads to the photo and ID card steps.
  useEffect(() => {
    if (check === "paid" && isMembership && !autoOpenedRef.current) {
      autoOpenedRef.current = true;
      setIsReceiptModalOpen(true);
    }
  }, [check, isMembership]);

  const closeReceipt = () => {
    setIsReceiptModalOpen(false);
    if (isMembership) setIsPostPaymentOpen(true);
  };

  const receiptData: ReceiptData = {
    id: txRef,
    invoiceNumber: `INV-${txRef.slice(0, 10).toUpperCase()}`,
    payerName: `${firstName} ${lastName}`.trim() || "ERCS Contributor",
    payerEmail: email,
    ercsId: memberId || undefined,
    amount: parseFloat(amount) || 0,
    currency: currency || "ETB",
    paymentMethod: "ArifPay Electronic Payment",
    transactionRef: txRef,
    description: isOrgRequest ? "Ethiopian Red Cross Society volunteer request payment" : "Ethiopian Red Cross Society Membership / Contribution",
    issuedAt: new Date().toLocaleDateString(undefined, { dateStyle: "long" }),
    status: "PAID",
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      setIsReceiptModalOpen(true);
    }
  };

  if (check !== "paid") {
    const copy: Record<Exclude<CheckState, "paid">, { title: string; body: string }> = {
      checking: { title: "Confirming your payment…", body: "Please keep this page open while we confirm with ArifPay." },
      pending: { title: "We're still confirming your payment", body: "This can take a few minutes. If you were charged, you'll get an SMS as soon as it is confirmed. You can check again below." },
      failed: { title: "The payment was not completed", body: "You have not been charged for this attempt. You can go back and try again." },
      notfound: { title: "We couldn't find this payment", body: "The payment link may be incomplete. If you were charged, please contact support with your receipt from ArifPay." },
    };
    const c = copy[check];
    return (
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-12 flex items-center justify-center max-w-2xl relative z-10">
        <div className="w-full bg-white p-8 sm:p-12 rounded-[40px] border border-gray-100 shadow-sm text-center space-y-5" role="status" aria-live="polite">
          {check === "checking" ? (
            <div className="mx-auto w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          ) : null}
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">{c.title}</h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-md mx-auto">{c.body}</p>
          {check === "pending" ? (
            <Button onClick={() => setCheckRound((n) => n + 1)} className="bg-black hover:bg-[#ED1C24] text-white rounded-2xl px-8 h-12 font-black uppercase text-xs tracking-widest">
              Check again
            </Button>
          ) : null}
          {check === "failed" || check === "notfound" ? (
            <Link href="/home" className="inline-block text-xs font-black uppercase tracking-widest text-black hover:text-[#ED1C24] transition-colors">
              Back to Home
            </Link>
          ) : null}
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-12 flex items-center justify-center max-w-2xl relative z-10 print:p-0 print:max-w-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-white p-6 sm:p-10 md:p-12 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-2xl transition-all duration-500 text-center space-y-7"
        >
          {/* ERCS Official Logo Header Banner on Receipt */}
          <div className="flex items-center justify-center gap-3.5 pb-5 border-b border-gray-100">
            <div className="h-14 w-14 rounded-2xl bg-red-50/50 p-1.5 flex items-center justify-center border border-red-100 shrink-0">
              <Image 
                src="/logo.png" 
                alt="ERCS Logo" 
                width={48} 
                height={48} 
                className="object-contain" 
                unoptimized
              />
            </div>
            <div className="text-left">
              <h3 className="text-base font-black text-gray-900 tracking-tight leading-tight uppercase">
                Ethiopian Red Cross Society
              </h3>
              <p className="text-xs font-bold text-[#ED1C24] leading-tight font-sans">
                የኢትዮጵያ ቀይ መስቀል ማህበር
              </p>
              <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                Official Electronic Payment Receipt
              </p>
            </div>
          </div>

          {/* Animated Success Checkmark */}
          <div className="relative inline-flex">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
              className="h-20 w-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border-4 border-white shadow-md"
            >
              <CheckCircle2 className="h-10 w-10" />
            </motion.div>
            
            {/* Double red heart badge showing support */}
            <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-[#ED1C24] text-white rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
              <Heart className="h-3.5 w-3.5 fill-white" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black tracking-[0.2em] text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">
              PAYMENT COMPLETED SUCCESSFULLY
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black tracking-tight leading-none pt-1">
              {isOrgRequest ? "Payment Received" : "Thank You for Your Support!"}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed max-w-md mx-auto">
              {isOrgRequest
                ? "Your payment for the volunteer request is confirmed. Volunteers are being assigned to your request now; open your partner portal to see them."
                : <>{isMembership ? "Welcome to the Ethiopian Red Cross Society. We've sent your Member ID to your phone by SMS. " : ""}Your contribution fuels emergency relief, medical supplies, WASH programs, and volunteer mobilization across Ethiopia.</>}
            </p>
          </div>

          {/* Detailed Transaction Receipt Card with Red Cross Branding */}
          <div className="bg-gray-50/80 border border-gray-100 rounded-[32px] p-6 sm:p-7 text-left space-y-3.5 relative overflow-hidden">
            {/* Subtle background red cross watermark */}
            <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
              <Image 
                src="/logo.png" 
                alt="ERCS Watermark" 
                width={120} 
                height={120} 
                className="object-contain" 
                unoptimized
              />
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contributor</span>
              <span className="text-sm font-black text-black flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-gray-400" />
                {firstName} {lastName}
              </span>
            </div>

            {isMembership && memberId ? (
              <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Member ID</span>
                <span className="text-sm font-mono font-black text-[#ED1C24]">{memberId}</span>
              </div>
            ) : null}

            {email ? (
            <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</span>
              <span className="text-sm font-bold text-black flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                {email}
              </span>
            </div>
            ) : null}

            <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction Reference</span>
              <span className="text-xs font-mono font-black text-slate-800 flex items-center gap-1.5 break-all">
                <Hash className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                {txRef}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Channel</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                ArifPay Verified
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</span>
              <span className="text-sm font-bold text-black flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                {new Date().toLocaleDateString(undefined, { dateStyle: "medium" })}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-black text-[#ED1C24] uppercase tracking-wider">{isOrgRequest ? "Total Paid" : "Total Contribution"}</span>
              <span className="text-2xl font-black text-black flex items-center gap-1">
                <span className="text-xs font-bold text-gray-400">{currency}</span>
                {parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 print:hidden">
            <Link href={isOrgRequest ? "/organization/portal" : "/dashboard"} className="w-full sm:w-auto">
              <Button 
                className="w-full sm:w-auto bg-black hover:bg-[#ED1C24] text-white rounded-2xl px-8 h-13 font-black uppercase text-xs tracking-widest shadow-xl shadow-black/10 flex items-center justify-center gap-2 group transition"
              >  Back to Portal
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button 
              onClick={handlePrint}
              variant="outline" 
              className="w-full sm:w-auto border-gray-200 hover:border-[#ED1C24] rounded-2xl px-7 h-13 font-black uppercase text-xs tracking-widest cursor-pointer hover:bg-red-50/50 hover:text-[#ED1C24] flex items-center justify-center gap-2 transition"
            >
              <FileText className="h-4 w-4 text-[#ED1C24]" />
              Official Receipt
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-4 text-xs font-bold text-gray-400 border-t border-gray-100">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Secure Ethiopian Red Cross Society Contribution Verification</span>
          </div>
        </motion.div>
      </main>

      {/* Official Electronic Receipt Modal */}
      <ElectronicReceiptModal 
        isOpen={isReceiptModalOpen}
        onClose={closeReceipt}
        receipt={receiptData}
      />

      <PostPaymentFlow
        isOpen={isPostPaymentOpen}
        memberId={memberId}
        onClose={() => setIsPostPaymentOpen(false)}
      />
    </>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans justify-between relative overflow-hidden print:bg-white print:min-h-0">
      {/* Decorative radial gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10 print:hidden" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10 print:hidden" />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 print:hidden">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="ERCS Logo" 
              width={40} 
              height={40} 
              className="object-contain" 
              unoptimized
            />
            <div className="flex flex-col">
              <span className="text-xl font-black text-black leading-none tracking-tight">ERCS</span>
              <span className="text-[10px] font-bold text-[#ED1C24] uppercase tracking-[0.2em]">Ethiopia</span>
            </div>
          </Link>
          <Link href="/home" className="text-xs font-black uppercase tracking-widest text-black hover:text-[#ED1C24] transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      <Suspense fallback={<div className="flex-grow flex items-center justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>}>
        <PaymentDetails />
      </Suspense>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12 border-t border-slate-900 print:hidden">
        <div className="container mx-auto px-6 max-w-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-500">
          <span>ERCS Core Services</span>
          <span>© {new Date().getFullYear()} Ethiopian Red Cross Society</span>
        </div>
      </footer>
    </div>
  );
}
