"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TermsPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-950 text-white py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-[#ED1C24] text-xs font-black uppercase tracking-widest hover:underline mb-4">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-widest leading-none mb-3">
            <FileText className="h-3 w-3" /> Legal Terms
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Terms and Conditions</h1>
          <p className="text-gray-400 mt-2 font-medium">
            Ethiopian Red Cross Society (ERCS) · Effective Date: January 1, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-3xl px-6 py-16 space-y-10 text-gray-800 font-medium leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-black text-black tracking-tight">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Ethiopian Red Cross Society (ERCS) Member and Volunteer Portal, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the system.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-black tracking-tight">2. Membership Rules &amp; Dues</h2>
          <p>
            Membership in the Ethiopian Red Cross Society is open to all individuals and corporate entities supporting humanitarian principles. Annual dues and lifetime contributions must be remitted through authorized payment channels (ArifPay, verified bank transfers, or official branch receipts).
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
            <li>Membership privileges are non-transferable and subject to adherence to the Seven Fundamental Principles.</li>
            <li>Members have the right to participate in general assemblies as specified in the ERCS Constitution.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-black tracking-tight">3. Volunteer Engagement &amp; Conduct</h2>
          <p>
            Volunteers agree to represent the Society with integrity, impartiality, and humanity. All humanitarian deployments, trainings, and field operations must follow official branch directives and safety protocols.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-black tracking-tight">4. Donations &amp; Financial Contributions</h2>
          <p>
            All donations made to ERCS are used exclusively to support disaster risk management, emergency health services, clean water projects, and community resilience programs. Donations are acknowledged through official digital electronic receipts verifiable via our verification portal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-black tracking-tight">5. User Accounts &amp; Security</h2>
          <p>
            You are responsible for safeguarding your login credentials and one-time password (OTP) codes. ERCS will never ask for your password. Any suspicious access should immediately be reported to <a href="mailto:info@redcrosseth.org" className="text-[#ED1C24] underline font-bold">info@redcrosseth.org</a>.
          </p>
        </section>

        <div className="pt-8 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-400">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <span>Ethiopian Red Cross Society – Protecting Humanity Since 1935</span>
        </div>
      </div>
    </div>
  );
}
