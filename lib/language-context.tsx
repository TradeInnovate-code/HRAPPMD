'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { translations, Language } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get stored language preference
    const stored = (localStorage.getItem('hri-language') as Language) || 'en';
    setLanguageState(stored);
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('hri-language', lang);
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang } }));
  };

  // Translation function that supports nested paths like "nav.dashboard"
  const t = (path: string, defaultValue?: string): string => {
    const keys = path.split('.');
    let value: any = translations[language];

    for (const key of keys) {
      value = value?.[key];
    }

    return typeof value === 'string' ? value : defaultValue || path;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
