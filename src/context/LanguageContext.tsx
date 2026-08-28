"use client";

import React, { createContext, useContext, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as Language;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Optionally sync with localStorage if needed
    localStorage.setItem('language', locale);
  }, [locale]);

  const setLang = (newLang: Language) => {
    localStorage.setItem('language', newLang);
    router.replace(pathname, { locale: newLang });
  };

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
