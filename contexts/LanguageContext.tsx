'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, getDictionary, Dictionary } from '@/lib/i18n/dictionaries';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dictionary: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [dictionary, setDictionary] = useState<Dictionary>(getDictionary('en'));

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['en', 'ja', 'zh'].includes(savedLocale)) {
      setLocaleState(savedLocale);
      setDictionary(getDictionary(savedLocale));
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setDictionary(getDictionary(newLocale));
    localStorage.setItem('locale', newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dictionary }}>
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
