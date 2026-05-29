'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { translations, type Locale, LOCALES } from './i18n';
import { displayText, isRtlLocale } from './locale-text';

interface I18nContextValue {
  locale: Locale;
  t: typeof translations[Locale];
  setLocale: (l: Locale) => void;
  isRTL: boolean;
  pick: (en: string, ar?: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  t: translations.en,
  setLocale: () => {},
  isRTL: false,
  pick: (en) => en,
});

function isLocale(value: string | null): value is Locale {
  return value !== null && LOCALES.includes(value as Locale);
}

function normalizeStoredLocale(value: string | null): Locale | null {
  if (value === 'latn') return 'ar';
  return isLocale(value) ? value : null;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = normalizeStoredLocale(localStorage.getItem('commergio-locale'));
    if (stored) {
      setLocaleState(stored);
      if (localStorage.getItem('commergio-locale') === 'latn') {
        localStorage.setItem('commergio-locale', 'ar');
      }
    } else {
      const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
      setLocaleState(browserLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtlLocale(locale) ? 'rtl' : 'ltr';
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('commergio-locale', l);
  }, []);

  const pick = useCallback(
    (en: string, ar?: string) => displayText(locale, en, ar ?? ''),
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      t: translations[locale],
      setLocale,
      isRTL: isRtlLocale(locale),
      pick,
    }),
    [locale, setLocale, pick]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
