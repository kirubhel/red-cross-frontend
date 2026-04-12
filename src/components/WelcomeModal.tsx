"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ShieldCheck, Heart, X, Plus, ArrowRight } from "lucide-react";
import { Language } from "@/lib/translations";

const SESSION_KEY = "ercs_welcome_shown";

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
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col bg-white rounded-[28px] overflow-hidden shadow-lg
                 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
    >
      {/* Top accent bar */}
      <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />

      <div className="flex flex-col flex-grow p-8">
        {/* Icon */}
        <div
          className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6
                     transition-transform duration-500 group-hover:rotate-12"
          style={{ backgroundColor: bgColor, color: accentColor }}
        >
          {icon}
        </div>

        {/* Badge */}
        <span
          className="text-[10px] font-black uppercase tracking-[0.25em] mb-2"
          style={{ color: accentColor }}
        >
          {label}
        </span>

        {/* Headline */}
        <h3 className="text-2xl font-black text-black leading-tight tracking-tight mb-3">
          {headline}
        </h3>

        {/* Description */}
        <p className="text-sm text-black/60 font-medium leading-relaxed flex-grow">
          {description}
        </p>

        {/* CTA */}
        <Link href={href} onClick={onClose} className="mt-8 block group/btn">
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-2 font-black text-sm"
            style={{ color: accentColor }}
          >
            {cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
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
    title: "How would you like to help?",
    subtitle:
      "Ethiopian Red Cross Society offers multiple ways to get involved. Choose the path that fits you.",
    dismiss: "Explore on my own",
    paths: [
      {
        href: "/join/volunteer",
        label: "Volunteer",
        headline: "Become a Volunteer",
        description:
          "Give your time and skills to serve communities in need. From disaster response to health outreach — your hands make a difference.",
        cta: "Volunteer now",
        accentColor: "#ED1C24",
        bgColor: "#FFF1F1",
      },
      {
        href: "/join/member",
        label: "Membership",
        headline: "Join as a Member",
        description:
          "Become a lifetime member of the Red Cross. Gain voting rights, participate in general assemblies, and shape our humanitarian mission.",
        cta: "Join membership",
        accentColor: "#0EA5E9",
        bgColor: "#F0F9FF",
      },
      {
        href: "/donate",
        label: "Donation",
        headline: "Make a Donation",
        description:
          "Fund life-saving operations across Ethiopia. Your gift, however large or small, directly supports emergency response, clean water, and health services.",
        cta: "Donate now",
        accentColor: "#DC2626",
        bgColor: "#FFF7ED",
      },
    ],
  },
  am: {
    badge: "ወደ ቀይ መስቀል እንኳን ደህና መጡ",
    title: "እንዴት ማገልገል ይፈልጋሉ?",
    subtitle: "ኢ.ቀ.መ. ለመሳተፍ ብዙ መንገዶችን ያቀርባል፡፡ ለእርስዎ የሚስማማውን ይምረጡ።",
    dismiss: "ብቻዬን ልቃኝ",
    paths: [
      {
        href: "/join/volunteer",
        label: "በጎ ፈቃደኝነት",
        headline: "በጎ ፈቃደኛ ይሁኑ",
        description:
          "ጊዜዎን ለሚፈልጉ ማህበረሰቦች ያቅርቡ። ከአደጋ ምላሽ እስከ የጤና አገልግሎት — ሁሉም ለውጥ ያመጣል።",
        cta: "አሁን ይቀላቀሉ",
        accentColor: "#ED1C24",
        bgColor: "#FFF1F1",
      },
      {
        href: "/join/member",
        label: "አባልነት",
        headline: "አባል ይሁኑ",
        description:
          "የቀይ መስቀል የዕድሜ ልክ አባል ይሁኑ። የመምረጥ መብት ያገኛሉ እና ሰብአዊ ዓላማዎቻችንን ለምርጥ ይወስናሉ።",
        cta: "አባልነትን ይቀላቀሉ",
        accentColor: "#0EA5E9",
        bgColor: "#F0F9FF",
      },
      {
        href: "/donate",
        label: "ልገሳ",
        headline: "ልገሳ ያድርጉ",
        description:
          "በኢትዮጵያ ሕይወት አድን ስራዎችን ይደግፉ። ትንሽ든ትልቅ የሚሆን ስጦታ ለህብረተሰቡ ቀጥተኛ ጠቀሜታ አለው።",
        cta: "አሁን ይለግሱ",
        accentColor: "#DC2626",
        bgColor: "#FFF7ED",
      },
    ],
  },
  om: {
    badge: "Gara ERCS Baga Nagaan Dhuftan",
    title: "Akkamiin gargaaruu barbaaddaa?",
    subtitle:
      "ERCS karaalee hirmaannaa hedduu dhiyeessa. Karaa isinitti ta'u filadhaa.",
    dismiss: "Ofuma ilaala",
    paths: [
      {
        href: "/join/volunteer",
        label: "Fedhaan Tajaajiluu",
        headline: "Fedhaan-Laataa Ta'aa",
        description:
          "Yeroo fi dandeettii keessan hawaasa barbaadaniif kennaati. Deebii balaa irraa hamma tajaajila fayyaa — hojiin keessan jijjiirama fida.",
        cta: "Amma Makami",
        accentColor: "#ED1C24",
        bgColor: "#FFF1F1",
      },
      {
        href: "/join/member",
        label: "Miseensummaa",
        headline: "Miseensa Ta'aa",
        description:
          "Miseensa dhaabbataa Fannoo Diimaa ta'aa. Mirga sagalee qabaadhu, yaa'ii irratti hirmaadhu, ergama keenya too'adhu.",
        cta: "Miseensummaan Makami",
        accentColor: "#0EA5E9",
        bgColor: "#F0F9FF",
      },
      {
        href: "/donate",
        label: "Arjooma",
        headline: "Arjoomaa",
        description:
          "Hojii lubbuu baraaruu Itiyoophiyaa keessatti maallaqqaan deeggari. Kenni kamiyyuu tajaajila ariifachiisaa, bishaan qulqulluu fi fayyaa deeggara.",
        cta: "Amma Arjoomi",
        accentColor: "#DC2626",
        bgColor: "#FFF7ED",
      },
    ],
  },
};

export default function WelcomeModal({ lang }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const c = CONTENT[lang] || CONTENT.en;

  const ICONS = [
    <Users key="users" className="h-7 w-7" />,
    <ShieldCheck key="shield" className="h-7 w-7" />,
    <Heart key="heart" className="h-7 w-7" />,
  ];

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    if (!alreadyShown) {
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(SESSION_KEY, "true");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="welcome-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            key="welcome-modal-content"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-gray-50 rounded-[40px] shadow-2xl overflow-hidden"
          >
            {/* Header strip */}
            <div className="bg-[#ED1C24] px-10 pt-10 pb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-black/10 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              <Plus
                className="absolute bottom-2 left-6 h-20 w-20 text-white/10 pointer-events-none"
                strokeWidth={3}
              />

              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-white/70 mb-3">
                  <Plus className="h-3 w-3" strokeWidth={4} />
                  {c.badge}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                  {c.title}
                </h2>
                <p className="text-white/70 font-medium mt-2 max-w-lg text-sm sm:text-base">
                  {c.subtitle}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                aria-label="Close welcome modal"
                className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/20 hover:bg-white/30
                           flex items-center justify-center text-white transition-all duration-200
                           hover:scale-110 cursor-pointer z-20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cards */}
            <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
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

            {/* Footer dismiss */}
            <div className="pb-6 text-center">
              <button
                onClick={handleClose}
                className="text-xs font-bold text-black/30 hover:text-black/60 transition-colors uppercase tracking-widest cursor-pointer"
              >
                {c.dismiss} →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
