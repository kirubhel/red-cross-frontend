"use client";

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Printer, Download, CheckCircle2, ShieldCheck, FileText } from "lucide-react";

export interface ReceiptData {
  id: string;
  invoiceNumber: string;
  payerName: string;
  payerPhone?: string;
  payerEmail?: string;
  ercsId?: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  transactionRef?: string;
  description: string;
  issuedAt: string;
  status: string;
}

interface ElectronicReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ReceiptData | null;
}

export function ElectronicReceiptModal({
  isOpen,
  onClose,
  receipt,
}: ElectronicReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const verifyUrl = `https://member.redcrosseth.org/verify/receipt/${receipt.invoiceNumber || receipt.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Action Header (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-bold text-gray-900">Official Electronic Receipt</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div
          ref={receiptRef}
          className="p-8 overflow-y-auto flex-1 text-gray-900 print:p-6 print:overflow-visible"
        >
          {/* Header Banner */}
          <div className="flex items-start justify-between border-b-2 border-red-600 pb-6 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-600 flex items-center justify-center text-red-600 shadow-sm shrink-0">
                {/* Red Cross Emblem */}
                <div className="relative w-7 h-7 flex items-center justify-center">
                  <div className="absolute w-7 h-2.5 bg-red-600 rounded-xs" />
                  <div className="absolute h-7 w-2.5 bg-red-600 rounded-xs" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-gray-900 leading-snug">
                  ETHIOPIAN RED CROSS SOCIETY
                </h1>
                <p className="text-xs font-bold text-red-700 font-sans">
                  የኢትዮጵያ ቀይ መስቀል ማህበር
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Ras Desta Damtew St., P.O. Box 195, Addis Ababa, Ethiopia
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {receipt.status || "PAID"}
              </span>
              <p className="text-xs font-mono font-bold text-gray-900 mt-2">
                {receipt.invoiceNumber}
              </p>
              <p className="text-[11px] text-gray-500">
                Date: {receipt.issuedAt || new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Receipt Info Grid */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-gray-50/80 border border-gray-100 mb-6 text-xs">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Billed To / Payer
              </p>
              <p className="font-bold text-gray-900 text-sm mt-0.5">
                {receipt.payerName || "ERCS Member / Contributor"}
              </p>
              {receipt.ercsId && (
                <p className="text-gray-600 font-mono mt-0.5">ID: {receipt.ercsId}</p>
              )}
              {receipt.payerPhone && (
                <p className="text-gray-600 mt-0.5">Phone: {receipt.payerPhone}</p>
              )}
              {receipt.payerEmail && (
                <p className="text-gray-600 mt-0.5">{receipt.payerEmail}</p>
              )}
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Payment Details
              </p>
              <p className="font-semibold text-gray-900 mt-0.5">
                Method: <span className="font-bold">{receipt.paymentMethod || "Online Payment"}</span>
              </p>
              {receipt.transactionRef && (
                <p className="text-gray-600 font-mono text-[11px] mt-0.5 break-all">
                  Ref: {receipt.transactionRef}
                </p>
              )}
              <p className="text-gray-600 mt-0.5">
                Currency: <span className="font-bold">{receipt.currency || "ETB"}</span>
              </p>
            </div>
          </div>

          {/* Items Breakdown Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Item Description</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-bold text-gray-900">{receipt.description || "ERCS Membership Fee"}</p>
                    <p className="text-[11px] text-gray-500">Official Contribution & Membership Dues</p>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">1</td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900">
                    {receipt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {receipt.currency || "ETB"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals & QR Verification Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            {/* QR Code Validation */}
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white border border-gray-200 rounded-lg shadow-2xs">
                <QRCodeSVG value={verifyUrl} size={64} level="M" />
              </div>
              <div className="text-[11px]">
                <div className="flex items-center gap-1 font-bold text-gray-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Electronic Record
                </div>
                <p className="text-gray-500 text-[10px] leading-tight max-w-[200px] mt-0.5">
                  Scan QR code to verify this receipt on the official ERCS Registry portal.
                </p>
              </div>
            </div>

            {/* Final Total */}
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium">Total Paid</p>
              <p className="text-2xl font-black text-red-600 tracking-tight">
                {receipt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
                <span className="text-xs font-bold text-gray-700">{receipt.currency || "ETB"}</span>
              </p>
            </div>
          </div>

          {/* Legal Note */}
          <div className="mt-8 pt-4 border-t border-gray-100 text-center text-[10px] text-gray-400">
            This is a computer-generated electronic receipt issued by the Ethiopian Red Cross Society (ERCS).
            No physical signature is required.
          </div>
        </div>

        {/* Footer Actions (Hidden in Print) */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            Print Receipt / PDF
          </button>
        </div>
      </div>
    </div>
  );
}
