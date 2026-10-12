import type { Locale } from '@/i18n/types';

/**
 * Deterministic number formatting for text that is prerendered at build
 * time. `Intl.NumberFormat` is avoided on purpose: Node's ICU and the
 * browser's disagree on some locales (Italian 2000 → "2000" vs "2.000"),
 * which breaks hydration.
 */
const THOUSANDS: Record<Locale, string> = {
  it: '.',
  en: ',',
  es: '.',
  de: '.',
  fr: ' ',
  sq: '.',
  ru: ' ',
};

export function formatInt(n: number, locale: Locale): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS[locale] ?? '.');
}
