"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ShieldCheck, Heart, X, Plus, ArrowRight, Globe } from "lucide-react";
import { Language } from "@/lib/translations";

const SESSION_KEY = "ercs_welcome_shown_v1"; // Versioned key

interface PathwayCardProps {
  href: string;
  icon: React.ReactNode;
  accentColor: string;
  bgColor: string;
  label: string;
  headline: string;
  description: string;
  cta: string;
  delay: number;
  onClose: () => void;
}

function PathwayCard({
  href, icon, accentColor, bgColor, label,
  headline, description, cta, delay, onClose,
}: PathwayCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }}
      className="group relative flex flex-col bg-white rounded-[24px] overflow-hidden shadow-lg
                 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100"
    >
      {/* Top accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />

      <div className="flex flex-col flex-grow p-5 sm:p-6">
        {/* Icon & Badge Row */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center
                       transition-transform duration-500 group-hover:rotate-12 shrink-0"
            style={{ backgroundColor: bgColor, color: accentColor }}
          >
            {icon}
          </div>
          <div className="flex flex-col">
            <span
              className="text-[9px] font-black uppercase tracking-[0.2em]"
              style={{ color: accentColor }}
            >
              {label}
            </span>
            <h3 className="text-lg font-black text-black leading-tight tracking-tight">
              {headline}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-[13px] text-black/60 font-medium leading-snug flex-grow line-clamp-3">
          {description}
        </p>

        {/* CTA */}
        <Link href={href} onClick={onClose} className="mt-4 block group/btn">
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-2 font-black text-xs"
            style={{ color: accentColor }}
          >
            {cta}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}

interface WelcomeModalProps {
  lang: Language;
}

const CONTENT = {
  en: {
    badge: "Welcome to ERCS",
    title: "How can you help?",
    subtitle:
      "Join us in our humanitarian mission across Ethiopia.",
    dismiss: "Explore",
    doNotShow: "Don't show again",
    paths: [
      {
        href: "/join/volunteer",
        label: "Volunteer",
        headline: "Volunteer",
        description:
          "Give your time and skills to serve communities in need. Your hands make a difference.",
        cta: "Join now",
        accentColor: "#ED1C24",
        bgColor: "#FFF1F1",
      },
      {
        href: "/join/member",
        label: "Membership",
        headline: "Member",
        description:
          "Become a lifetime member. Gain voting rights and shape our mission.",
        cta: "Join now",
        accentColor: "#0EA5E9",
        bgColor: "#F0F9FF",
      },
      {
        href: "/donate",
        label: "Donation",
        headline: "Donate",
        description:
          "Fund life-saving operations. Your gift supports emergency response and health.",
        cta: "Donate now",
        accentColor: "#DC2626",
        bgColor: "#FFF7ED",
      },
      {
        href: "/organizations",
        label: "Volunteer Request",
        headline: "Organization",
        description:
          "Quick sign up, track active volunteers, explore branch opportunities, and access resources.",
        cta: "Request Support",
        accentColor: "#8B5CF6",
        bgColor: "#F5F3FF",
      },
    ],
  },
  am: {
    badge: "ወደ ቀይ መስቀል እንኳን ደህና መጡ",
    title: "እንዴት ማገልገል ይፈልጋሉ?",
    subtitle: "በሰብአዊ ተግባራችን ላይ አብረውን ይሁኑ።",
    dismiss: "ልቀጥል",
    doNotShow: "ደግመህ አታሳይ",
    paths: [
      {
        href: "/join/volunteer",
        label: "በጎ ፈቃደኝነት",
        headline: "በጎ ፈቃደኛ",
        description: "ጊዜዎን ለሚፈልጉ ማህበረሰቦች ያቅርቡ። ሁሉም ለውጥ ያመጣል።",
        cta: "አሁን ይቀላቀሉ",
        accentColor: "#ED1C24",
        bgColor: "#FFF1F1",
      },
      {
        href: "/join/member",
        label: "አባልነት",
        headline: "አባልነት",
        description: "የቀይ መስቀል አባል ይሁኑ። ሰብአዊ ዓላማዎቻችንን ይወስናሉ።",
        cta: "አሁን ይቀላቀሉ",
        accentColor: "#0EA5E9",
        bgColor: "#F0F9FF",
      },
      {
        href: "/donate",
        label: "ልገሳ",
        headline: "ልገሳ",
        description: "ሕይወት አድን ስራዎችን ይደግፉ። ስጦታዎ ለህብረተሰቡ ጠቃሚ ነው።",
        cta: "አሁን ይለግሱ",
        accentColor: "#DC2626",
        bgColor: "#FFF7ED",
      },
      {
        href: "/organizations",
        label: "በጎ ፈቃደኝነት ጥያቄ",
        headline: "ድርጅት",
        description: "በፍጥነት ይመዝገቡ፣ ንቁ በጎ ፈቃደኞችን ይከታተሉ፣ የቅርንጫፍ እድሎችን ያግኙ።",
        cta: "ጥያቄ አቅርብ",
        accentColor: "#8B5CF6",
        bgColor: "#F5F3FF",
      },
    ],
  },
  om: {
    badge: "Gara ERCS Baga Nagaan Dhuftan",
    title: "Akkamiin gargaaruu barbaaddaa?",
    subtitle: "Ergama keenya irratti nu waliin hirmaadhaa.",
    dismiss: "Itti fufi",
    doNotShow: "Irra deebi'amee hin agarsiisiin",
    paths: [
      {
        href: "/join/volunteer",
        label: "Fedhaan Tajaajiluu",
        headline: "Fedhaan-Laataa",
        description: "Yeroo fi dandeettii keessan hawaasa barbaadaniif kennaa.",
        cta: "Amma Makami",
        accentColor: "#ED1C24",
        bgColor: "#FFF1F1",
      },
      {
        href: "/join/member",
        label: "Miseensummaa",
        headline: "Miseensa",
        description: "Miseensa dhaabbataa ta'aa. Ergama keenya too'adhaa.",
        cta: "Amma Makami",
        accentColor: "#0EA5E9",
        bgColor: "#F0F9FF",
      },
      {
        href: "/donate",
        label: "Arjooma",
        headline: "Arjooma",
        description: "Hojii lubbuu baraaruu maallaqqaan deeggari.",
        cta: "Amma Arjoomi",
        accentColor: "#DC2626",
        bgColor: "#FFF7ED",
      },
      {
        href: "/organizations",
        label: "Gaaffii Fedhaan-laataa",
        headline: "Dhaabbata",
        description: "Saffisaan galmaa'aa, tajaajiltoota sosocho'an hordofaa, carraaqqii dameewwanii argadhaa.",
        cta: "Gaaffii Dhiyeessi",
        accentColor: "#8B5CF6",
        bgColor: "#F5F3FF",
      },
    ],
  },
};

export default function WelcomeModal({ lang }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [doNotShowChecked, setDoNotShowChecked] = useState(false);
  const c = CONTENT[lang] || CONTENT.en;

  const ICONS = [
    <Users key="users" className="h-5 w-5 sm:h-6 sm:w-6" />,
    <ShieldCheck key="shield" className="h-5 w-5 sm:h-6 sm:w-6" />,
    <Heart key="heart" className="h-5 w-5 sm:h-6 sm:w-6" />,
    <Globe key="globe" className="h-5 w-5 sm:h-6 sm:w-6" />,
  ];

  useEffect(() => {
    if (!localStorage.getItem(SESSION_KEY)) {
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    if (doNotShowChecked) {
      localStorage.setItem(SESSION_KEY, "true");
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            key="welcome-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Scrollable Container */}
          <div className="absolute inset-0 overflow-y-auto py-10 px-4 sm:px-6 flex justify-center items-start pointer-events-none">
            {/* Modal */}
            <motion.div
              key="welcome-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl sm:max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden pointer-events-auto my-auto"
            >
              {/* Header strip */}
              <div className="bg-[#ED1C24] px-6 py-8 sm:px-10 sm:py-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-black/10 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                <Plus
                  className="absolute bottom-2 left-6 h-16 w-16 text-white/5 pointer-events-none"
                  strokeWidth={3}
                />

                <div className="relative z-10 pr-10">
                  <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/80 mb-2">
                    <Plus className="h-3 w-3" strokeWidth={4} />
                    {c.badge}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                    {c.title}
                  </h2>
                  <p className="text-white/80 font-medium mt-1.5 max-w-md text-[13px] sm:text-sm">
                    {c.subtitle}
                  </p>
                </div>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  aria-label="Close welcome modal"
                  className="absolute top-6 right-6 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20
                             flex items-center justify-center text-white transition-all duration-200
                             hover:scale-105 cursor-pointer z-20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Cards */}
              <div className="px-6 py-6 sm:px-8 sm:py-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
                {c.paths.map((path, i) => (
                  <PathwayCard
                    key={path.href}
                    {...path}
                    icon={ICONS[i]}
                    delay={0.1 + i * 0.1}
                    onClose={handleClose}
                  />
                ))}
              </div>

              {/* Footer dismiss and Checkbox */}
              <div className="px-6 pb-6 sm:px-8 sm:pb-8 flex flex-row items-center justify-between gap-4">
                <label className="flex items-center gap-2 cursor-pointer group select-none">
                  <div className="relative flex items-center justify-center h-4.5 w-4.5 rounded-[5px] border-[1.5px] border-gray-200 bg-white group-hover:border-[#ED1C24] transition-colors">
                    <input 
                      type="checkbox" 
                      className="peer absolute opacity-0 h-0 w-0 cursor-pointer" 
                      checked={doNotShowChecked}
                      onChange={(e) => setDoNotShowChecked(e.target.checked)}
                    />
                    <svg
                      className={`h-3 w-3 text-[#ED1C24] pointer-events-none transition-all duration-200 ${doNotShowChecked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-black/40 group-hover:text-black/60 transition-colors uppercase tracking-wider">
                    {c.doNotShow}
                  </span>
                </label>

                <button
                  onClick={handleClose}
                  className="text-[10px] font-black text-black/30 hover:text-[#ED1C24] transition-colors uppercase tracking-[0.1em] cursor-pointer"
                >
                  {c.dismiss} →
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
