'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { translations, type Locale } from './i18n';

interface I18nContextValue {
  locale: Locale;
  t: typeof translations[Locale];
  setLocale: (l: Locale) => void;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  t: translations.en,
  setLocale: () => {},
  isRTL: false,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem('commergio-locale') as Locale | null;
    if (stored === 'en' || stored === 'ar') {
      setLocaleState(stored);
    } else {
      const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
      setLocaleState(browserLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('commergio-locale', l);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t: translations[locale], setLocale, isRTL: locale === 'ar' }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
