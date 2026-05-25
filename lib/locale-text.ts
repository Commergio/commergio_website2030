import type { Locale } from './i18n';
import { transliterateArabic } from './arabic-translit';

/** Pick EN / Arabic script / Arabic in Latin letters for bilingual CMS or static copy. */
export function displayText(locale: Locale, en: string, ar: string = ''): string {
  const enVal = (en ?? '').trim();
  const arVal = (ar ?? '').trim();

  if (locale === 'en') return enVal || arVal;
  if (locale === 'ar') return arVal || enVal;
  return transliterateArabic(arVal || enVal);
}

export function isRtlLocale(locale: Locale): boolean {
  return locale === 'ar';
}

export function usesArabicSource(locale: Locale): boolean {
  return locale === 'ar' || locale === 'latn';
}

export function dateLocaleForUi(locale: Locale): string {
  if (locale === 'ar') return 'ar-SA';
  return 'en-US';
}

/** Bilingual string lists (benefits, process steps, etc.). */
export function pickList(locale: Locale, en: readonly string[], ar: readonly string[]): string[] {
  if (locale === 'en') return [...en];
  if (locale === 'ar') return ar.length ? [...ar] : [...en];
  const source = ar.length ? ar : en;
  return source.map((item, i) => transliterateArabic(item || en[i] || ''));
}
