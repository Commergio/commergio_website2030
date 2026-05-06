'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminTranslations, AdminLocale } from './admin-i18n';

const STORAGE_KEY = 'admin-locale';

type AdminT = Record<string, string>;

interface AdminI18nContextType {
  locale: AdminLocale;
  t: AdminT;
  setLocale: (l: AdminLocale) => void;
  isRTL: boolean;
}

const AdminI18nContext = createContext<AdminI18nContextType>({
  locale: 'en',
  t: adminTranslations.en as AdminT,
  setLocale: () => {},
  isRTL: false,
});

export function AdminI18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>('en');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as AdminLocale | null;
    if (stored === 'en' || stored === 'ar') setLocaleState(stored);
  }, []);

  const setLocale = (l: AdminLocale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  return (
    <AdminI18nContext.Provider value={{
      locale,
      t: adminTranslations[locale] as AdminT,
      setLocale,
      isRTL: locale === 'ar',
    }}>
      {children}
    </AdminI18nContext.Provider>
  );
}

export function useAdminI18n() {
  return useContext(AdminI18nContext);
}
