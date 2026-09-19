"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, ShieldCheck, CreditCard, Building2, PhoneCall } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import DonationModal from "@/components/DonationModal";
import { Button } from "@/components/ui/button";

export default function DonatePage() {
  const { lang, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Banner */}
      <div className="bg-gray-950 text-white py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-[#ED1C24] text-xs font-black uppercase tracking-widest hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-[#ED1C24] rounded-full text-xs font-black uppercase tracking-widest leading-none mb-4">
            <Heart className="h-3.5 w-3.5 fill-current" /> Humanitarian Support
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
            Empower Life-Saving Aid
          </h1>
          <p className="text-gray-400 mt-4 text-lg font-medium max-w-2xl leading-relaxed">
            Every contribution directly funds emergency relief, clean water, medical assistance, and community resilience programs across Ethiopia.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-6 py-12 flex-1 space-y-10">
        {/* Action Card */}
        <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-black text-black">Make an Instant Online Contribution</h2>
            <p className="text-gray-500 font-medium text-sm">
              Use ArifPay, Telebirr, CBE Birr, or local payment cards for immediate electronic receipt.
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="h-16 px-8 rounded-2xl bg-[#ED1C24] hover:bg-black text-white font-black text-base shadow-xl shadow-red-500/20 transition-all shrink-0"
          >
            <Heart className="h-5 w-5 mr-2 fill-current" /> Donate Now
          </Button>
        </div>

        {/* Bank Transfer Information */}
        <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-[#ED1C24]" />
            <h3 className="text-xl font-black text-black">Official Bank Transfer &amp; Deposit Accounts</h3>
          </div>
          <p className="text-gray-600 text-sm font-medium">
            You can also donate directly via branch deposit or mobile banking transfer to any of our verified bank accounts:
          </p>

          <div className="grid md:grid-cols-2 gap-4 pt-2">
            {[
              { bank: "Commercial Bank of Ethiopia (CBE)", account: "1000000983173", branch: "Finfine Branch" },
              { bank: "Telebirr Merchant Shortcode", account: "1935", branch: "ERCS Official" },
              { bank: "Awash Bank", account: "01304000005400", branch: "Head Office Branch" },
              { bank: "Dashen Bank", account: "001100001001", branch: "Main Branch" },
              { bank: "Bank of Abyssinia", account: "10928340", branch: "Legehar Branch" },
              { bank: "Hibret Bank", account: "1021812140417018", branch: "Central Branch" }
            ].map((acc, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{acc.bank}</span>
                <span className="text-lg font-mono font-black text-black block">{acc.account}</span>
                <span className="text-[11px] text-gray-400 font-medium">Account Name: Ethiopian Red Cross Society ({acc.branch})</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900 text-xs font-medium flex items-center gap-3">
            <PhoneCall className="h-5 w-5 text-amber-600 shrink-0" />
            <span>
              After completing a bank deposit, please email your transaction slip or reference to{" "}
              <strong>info@redcrosseth.org</strong> or call <strong>+251-115-18-01-80</strong> for your official tax-deductible electronic receipt.
            </span>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}



