"use client";

import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { translations, Language } from '@/lib/translations';

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const SUPPORTED_LOCALES: Language[] = ['en', 'am'];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Read locale from URL params — safe during SSR, requires no provider context
  const params = useParams();
  const rawLocale = params?.locale as string | undefined;
  const locale: Language = SUPPORTED_LOCALES.includes(rawLocale as Language)
    ? (rawLocale as Language)
    : 'en';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', locale);
    }
  }, [locale]);

  // Locale switching: always a full page navigation — no router hook needed.
  // Avoids next-intl's useRouter/usePathname which throw during prerender.
  const setLang = useCallback((newLang: Language) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('language', newLang);
    const segments = window.location.pathname.split('/');
    if (segments.length > 1 && SUPPORTED_LOCALES.includes(segments[1] as Language)) {
      segments[1] = newLang;
      window.location.pathname = segments.join('/');
    }
  }, []);

  const t = translations[locale] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang: locale, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
