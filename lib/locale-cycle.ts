import type { Locale } from './i18n';

const CYCLE: Locale[] = ['en', 'ar', 'latn'];

export function nextLocale(current: Locale): Locale {
  const i = CYCLE.indexOf(current);
  return CYCLE[(i + 1) % CYCLE.length];
}

export function localeShortLabel(locale: Locale): string {
  if (locale === 'en') return 'EN';
  if (locale === 'ar') return 'ع';
  return 'Aa';
}

export function localeMenuLabel(locale: Locale, t: { lang: { en: string; ar: string; latn: string } }): string {
  if (locale === 'en') return t.lang.ar;
  if (locale === 'ar') return t.lang.latn;
  return t.lang.en;
}
