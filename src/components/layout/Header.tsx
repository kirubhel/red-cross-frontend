"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown,
  Languages,
  ArrowLeft
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  showBackToHome?: boolean;
  minimal?: boolean;
}

export default function Header({ showBackToHome = false, minimal = false }: HeaderProps) {
  const { lang, setLang, t } = useLanguage();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative overflow-hidden rounded-md border border-gray-100 shadow-sm">
            <Image 
              src="/logo.jpg" 
              alt="ERCS Logo" 
              width={32} 
              height={32} 
              className="object-contain transition-transform duration-500 group-hover:scale-110" 
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-black leading-none tracking-tight">ERCS</span>
            <span className="text-[9px] font-bold text-[#ED1C24] uppercase tracking-[0.2em]">Ethiopia</span>
          </div>
        </Link>
        
        {minimal ? (
          <div className="flex-1" />
        ) : !showBackToHome ? (
          <nav className="hidden lg:flex items-center gap-10">
            {[
              { label: t.nav.about, href: "/#about" },
              { label: t.nav.services, href: "/#services" },
              { label: t.nav.impact, href: "/#impact" },
              { label: t.nav.news, href: "/#news" },
              { label: t.nav.organizations, href: "/organizations" }
            ].map((item) => (
              <Link 
                key={item.label} 
                href={item.href}
                className={`${lang === 'en' ? 'text-sm' : 'text-xs'} font-bold text-black hover:text-[#ED1C24] transition-colors relative group`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ED1C24] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        ) : (
          <Link href="/" className="text-sm font-bold text-black hover:text-[#ED1C24] transition-colors flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> {t.nav.backToHome}
          </Link>
        )}

        <div className="flex items-center gap-4">
          <div className="relative" ref={langRef}>
            <button 
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#ED1C24] hover:text-[#ED1C24] transition-all text-xs font-black uppercase tracking-wider cursor-pointer bg-white text-black"
            >
              <Languages className="h-3.5 w-3.5 text-black group-hover:text-[#ED1C24]" />
              {lang === 'en' ? 'English' : lang === 'am' ? 'አማርኛ' : 'Afaan Oromoo'}
              <ChevronDown className={`h-3 w-3 transition-transform duration-300 text-black ${showLangDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showLangDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
                >
                  {[
                    { code: 'en', label: 'English', native: 'English' },
                    { code: 'am', label: 'አማርኛ', native: 'Amharic' },
                    { code: 'om', label: 'Afaan Oromo', native: 'Oromiffa' }
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code as any);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors text-left ${lang === l.code ? 'text-[#ED1C24] bg-red-50/50' : 'text-black'}`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{l.label}</span>
                        <span className="text-[10px] opacity-50 font-medium uppercase tracking-wider">{l.native}</span>
                      </div>
                      {lang === l.code && <div className="h-1.5 w-1.5 rounded-full bg-[#ED1C24]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {!showBackToHome && !minimal && (
            <>
              <div className="h-4 w-px bg-gray-200 hidden sm:block" />
              <Link href="/login" className={`hidden sm:block ${lang === 'en' ? 'text-sm' : 'text-xs'} font-bold text-black hover:text-[#ED1C24] transition-colors`}>
                {t.nav.portal}
              </Link>
              <div className="h-8 w-px bg-gray-200 hidden sm:block" />
              <Link href="/join/volunteer">
                <Button size="sm" className="bg-[#ED1C24] text-white border-2 border-[#ED1C24] hover:bg-white hover:text-[#ED1C24] rounded-full px-6 font-bold shadow-lg shadow-[#ED1C24]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer">
                  {t.nav.join}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
