import type { Locale } from './i18n';

/** Pick English or Arabic for bilingual CMS or static copy. */
export function displayText(locale: Locale, en: string, ar: string = ''): string {
  const enVal = (en ?? '').trim();
  const arVal = (ar ?? '').trim();

  if (locale === 'en') return enVal || arVal;
  return arVal || enVal;
}

export function isRtlLocale(locale: Locale): boolean {
  return locale === 'ar';
}

export function dateLocaleForUi(locale: Locale): string {
  return locale === 'ar' ? 'ar-SA' : 'en-US';
}

/** Bilingual string lists (benefits, process steps, etc.). */
export function pickList(locale: Locale, en: readonly string[], ar: readonly string[]): string[] {
  if (locale === 'en') return [...en];
  return ar.length ? [...ar] : [...en];
}
