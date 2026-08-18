"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, 
  ChevronDown, 
  ExternalLink,
  MessageCircleQuestion
} from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  lang: Language;
  content?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    items?: FAQItem[];
  };
}

/**
 * Parses and renders text with clickable links and formatted bullet items.
 */
function FormattedAnswer({ text }: { text: string }) {
  if (!text) return null;

  // Split by line breaks
  const lines = text.split("\n");

  const renderFormattedLine = (line: string, lineIdx: number) => {
    const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-");
    const cleanLine = isBullet ? line.trim().replace(/^[•\-]\s*/, "") : line;

    // Regex to match URLs (https://... or x.com/..., tiktok.com/...)
    const urlRegex = /(https?:\/\/[^\s]+|x\.com\/[^\s]+|tiktok\.com\/[^\s]+)/g;
    const parts = cleanLine.split(urlRegex);

    const formattedContent = parts.map((part, idx) => {
      if (part.match(urlRegex)) {
        const href = part.startsWith("http") ? part : `https://${part}`;
        return (
          <a
            key={idx}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ED1C24] hover:text-red-700 underline font-semibold inline-flex items-center gap-0.5 transition-colors mx-0.5 break-all"
          >
            {part}
            <ExternalLink className="h-3 w-3 inline-block shrink-0 ml-0.5" />
          </a>
        );
      }
      return <span key={idx}>{part}</span>;
    });

    if (isBullet) {
      return (
        <li key={lineIdx} className="flex items-start gap-2.5 my-1.5 text-gray-600 font-medium">
          <span className="h-2 w-2 rounded-full bg-[#ED1C24] shrink-0 mt-2" />
          <span className="flex-1 leading-relaxed">{formattedContent}</span>
        </li>
      );
    }

    if (!line.trim()) {
      return <div key={lineIdx} className="h-2" />;
    }

    return (
      <p key={lineIdx} className="text-gray-600 font-medium leading-relaxed my-1">
        {formattedContent}
      </p>
    );
  };

  const hasBullets = lines.some(l => l.trim().startsWith("•") || l.trim().startsWith("-"));

  if (hasBullets) {
    return (
      <ul className="space-y-1 my-2">
        {lines.map((line, idx) => renderFormattedLine(line, idx))}
      </ul>
    );
  }

  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => renderFormattedLine(line, idx))}
    </div>
  );
}

export default function FAQSection({ lang, content }: FAQSectionProps) {
  const fallback = translations[lang]?.faq || translations.en.faq;
  const badge = content?.badge || fallback.badge;
  const title = content?.title || fallback.title;
  const subtitle = content?.subtitle || fallback.subtitle;
  const items = (content?.items && content.items.length > 0) ? content.items : fallback.items;

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-4 sm:px-6 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden" id="faq">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-[#ED1C24] text-xs font-black uppercase tracking-widest shadow-sm">
            <HelpCircle className="h-4 w-4" />
            <span>{badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-[1.15]">
            {title}
          </h2>

          {subtitle && (
            <p className="text-base sm:text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? "bg-white border-[#ED1C24]/30 shadow-[0_12px_30px_-8px_rgba(237,28,36,0.12)] ring-1 ring-[#ED1C24]/10" 
                    : "bg-white/80 hover:bg-white border-gray-200/80 shadow-sm hover:shadow-md"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full py-5 px-6 sm:px-8 flex items-center justify-between gap-4 text-left transition-colors group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <span 
                      className={`h-9 w-9 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                        isOpen 
                          ? "bg-[#ED1C24] text-white shadow-md shadow-red-500/20" 
                          : "bg-gray-100 text-gray-600 group-hover:bg-red-50 group-hover:text-[#ED1C24]"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className={`text-base sm:text-lg font-bold transition-colors ${
                      isOpen ? "text-[#ED1C24]" : "text-gray-900 group-hover:text-black"
                    }`}>
                      {item.question}
                    </span>
                  </div>

                  <div 
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen 
                        ? "bg-red-50 text-[#ED1C24] rotate-180" 
                        : "bg-gray-50 text-gray-400 group-hover:text-gray-700"
                    }`}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 sm:px-8 pb-6 pt-2 border-t border-gray-100 text-sm sm:text-base">
                        <FormattedAnswer text={item.answer} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Help Callout */}
        <div className="mt-12 text-center p-6 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="h-10 w-10 rounded-2xl bg-red-100 text-[#ED1C24] flex items-center justify-center shrink-0">
              <MessageCircleQuestion className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Still have questions?</p>
              <p className="text-xs text-gray-500 font-medium">We are here to help and answer any questions you might have.</p>
            </div>
          </div>
          <a 
            href="#contact" 
            className="px-5 py-2.5 rounded-2xl bg-black hover:bg-[#ED1C24] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shrink-0"
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </section>
  );
}
