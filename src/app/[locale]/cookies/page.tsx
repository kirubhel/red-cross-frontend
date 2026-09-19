"use client";

import Link from "next/link";
import { ArrowLeft, Cookie, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CookiesPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-950 text-white py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-[#ED1C24] text-xs font-black uppercase tracking-widest hover:underline mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-widest leading-none mb-3">
            <Cookie className="h-3 w-3" /> Privacy &amp; Tracking
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            Cookie Policy
          </h1>
          <p className="text-gray-400 mt-2 font-medium">
            Ethiopian Red Cross Society (ERCS) · Effective Date: January 1, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-3xl px-6 py-16 space-y-10 text-gray-800 font-medium leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-black text-black tracking-tight">
            1. What Are Cookies?
          </h2>
          <p>
            Cookies are small data files placed on your device when you browse our
            humanitarian portal. They help us remember your session, preserve your
            preferred language (Amharic, Afaan Oromoo, Tigrinya, or English), and
            secure portal interactions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-black tracking-tight">
            2. How We Use Cookies
          </h2>
          <p>
            The Ethiopian Red Cross Society uses only essential and functional
            cookies:
          </p>
          <div className="space-y-3 pt-2">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-black font-bold block">
                  Strictly Necessary Cookies
                </strong>
                <span className="text-sm text-gray-600">
                  Required for authentication, session verification, and secure
                  processing of membership and donation transactions.
                </span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-black font-bold block">
                  Preference &amp; Localization Cookies
                </strong>
                <span className="text-sm text-gray-600">
                  Store your chosen interface language and theme settings across
                  page reloads.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-black tracking-tight">
            3. Third-Party Services
          </h2>
          <p>
            When completing donations or membership dues, our authorized payment
            gateways (such as ArifPay and partner banking APIs) may issue session
            tokens to securely validate financial transactions. ERCS does not store
            payment card numbers or banking passwords.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-black tracking-tight">
            4. Managing Your Preferences
          </h2>
          <p>
            You can modify your browser settings to decline non-essential cookies.
            However, disabling essential cookies may impact your ability to log in
            to the member portal or complete online contributions.
          </p>
        </section>

        <div className="pt-8 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-400">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <span>
            Ethiopian Red Cross Society – Protecting Privacy &amp; Humanity
          </span>
        </div>
      </div>
    </div>
  );
}
