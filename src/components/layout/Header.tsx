"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown,
  Languages,
  ArrowLeft,
  Menu,
  X as CloseIcon
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: t.nav.about, href: "/#about" },
    { label: t.nav.services, href: "/#services" },
    { label: t.nav.impact, href: "/#impact" },
    { label: t.nav.news, href: "/#news" },
    { label: t.nav.organizations, href: "/organizations" }
  ];

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group cursor-pointer shrink-0">
          <div className="relative overflow-hidden rounded-md border border-gray-100 shadow-sm">
            <Image 
              src="/logo.jpg" 
              alt="ERCS Logo" 
              width={28} 
              height={28} 
              className="object-contain transition-transform duration-500 group-hover:scale-110 sm:w-[32px] sm:h-[32px]" 
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold text-black leading-none tracking-tight">ERCS</span>
            <span className="text-[8px] sm:text-[9px] font-bold text-[#ED1C24] uppercase tracking-[0.2em]">Ethiopia</span>
          </div>
        </Link>
        
        {minimal ? (
          <div className="flex-1" />
        ) : !showBackToHome ? (
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((item) => (
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

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative" ref={langRef}>
            <button 
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#ED1C24] hover:text-[#ED1C24] transition-all text-[10px] sm:text-xs font-black uppercase tracking-wider cursor-pointer bg-white text-black"
            >
              <Languages className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-black group-hover:text-[#ED1C24]" />
              <span className="hidden xs:inline">{lang === 'en' ? 'EN' : lang === 'am' ? 'አማ' : 'OM'}</span>
              <span className="xs:hidden">{lang.toUpperCase()}</span>
              <ChevronDown className={`h-2.5 w-2.5 sm:h-3 sm:w-3 transition-transform duration-300 text-black ${showLangDropdown ? 'rotate-180' : ''}`} />
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
              <div className="h-4 w-px bg-gray-200 hidden lg:block" />
              <Link href="/login" className={`hidden lg:block ${lang === 'en' ? 'text-sm' : 'text-xs'} font-bold text-black hover:text-[#ED1C24] transition-colors`}>
                {t.nav.portal}
              </Link>
              <div className="h-8 w-px bg-gray-200 hidden lg:block" />
              <Link href="/join/volunteer" className="hidden lg:block">
                <Button size="sm" className="bg-[#ED1C24] text-white border-2 border-[#ED1C24] hover:bg-white hover:text-[#ED1C24] rounded-full px-6 font-bold shadow-lg shadow-[#ED1C24]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer">
                  {t.nav.join}
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {isMobileMenuOpen ? <CloseIcon className="h-6 w-6 text-black" /> : <Menu className="h-6 w-6 text-black" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 top-16 bg-white z-[60] lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-black text-black hover:text-[#ED1C24] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-gray-100 my-2" />
              <Link 
                href="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-bold text-black"
              >
                {t.nav.portal}
              </Link>
              <Link href="/join/volunteer" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-[#ED1C24] text-white h-14 rounded-2xl text-lg font-black shadow-xl shadow-[#ED1C24]/20">
                  {t.nav.join}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
