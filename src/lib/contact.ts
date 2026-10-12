import { SITE } from './site';

/**
 * Contact-channel helpers — the one place that turns SITE data into the
 * hrefs used by the header, the mobile action bar, the footer and the
 * contact page.
 */

export type PhoneLine = 1 | 2;

export function telHref(line: PhoneLine = 1): string {
  return `tel:${line === 1 ? SITE.phone : SITE.phone2}`;
}

export function phoneLabel(line: PhoneLine = 1): string {
  return line === 1 ? SITE.phoneDisplay : SITE.phoneDisplay2;
}

/** wa.me deep link, optionally with a pre-filled message. */
export function whatsappHref(text?: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function mailHref(address: string = SITE.email, subject?: string): string {
  return subject ? `mailto:${address}?subject=${encodeURIComponent(subject)}` : `mailto:${address}`;
}
