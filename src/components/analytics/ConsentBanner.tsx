'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { Locale } from '@/i18n/types';
import { hasGA, applyConsent, CONSENT_STORAGE_KEY } from '@/lib/analytics';

/**
 * Minimal, on-brand cookie-consent banner. Only rendered when GA4 is configured
 * (the cookieless Umami path needs no consent). The visitor's choice is stored
 * so the banner shows once; GA's Consent Mode v2 stays "denied" until accepted.
 */

type Strings = { message: string; accept: string; decline: string };

const COPY: Record<Locale, Strings> = {
  it: {
    message:
      'Usiamo i cookie per analisi e marketing, per migliorare il sito e le nostre comunicazioni. Puoi accettare o rifiutare.',
    accept: 'Accetta',
    decline: 'Rifiuta',
  },
  en: {
    message:
      'We use cookies for analytics and marketing to improve the site and our communications. You can accept or decline.',
    accept: 'Accept',
    decline: 'Decline',
  },
  es: {
    message:
      'Usamos cookies de análisis y marketing para mejorar el sitio y nuestras comunicaciones. Puedes aceptar o rechazar.',
    accept: 'Aceptar',
    decline: 'Rechazar',
  },
  de: {
    message:
      'Wir verwenden Cookies für Analyse und Marketing, um die Website und unsere Kommunikation zu verbessern. Sie können zustimmen oder ablehnen.',
    accept: 'Akzeptieren',
    decline: 'Ablehnen',
  },
  fr: {
    message:
      'Nous utilisons des cookies d’analyse et de marketing pour améliorer le site et nos communications. Vous pouvez accepter ou refuser.',
    accept: 'Accepter',
    decline: 'Refuser',
  },
  sq: {
    message:
      'Përdorim cookie për analizë dhe marketing, për të përmirësuar faqen dhe komunikimet tona. Mund të pranoni ose refuzoni.',
    accept: 'Prano',
    decline: 'Refuzo',
  },
  ru: {
    message:
      'Мы используем файлы cookie для аналитики и маркетинга, чтобы улучшить сайт и наши коммуникации. Вы можете принять или отклонить.',
    accept: 'Принять',
    decline: 'Отклонить',
  },
};

export default function ConsentBanner() {
  const { locale } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasGA) return;
    if (!localStorage.getItem(CONSENT_STORAGE_KEY)) setVisible(true);
  }, []);

  if (!hasGA || !visible) return null;

  const t = COPY[locale] ?? COPY.it;

  const decide = (choice: 'granted' | 'denied') => {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    applyConsent(choice);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[80] p-4 sm:p-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-white/95 p-5 shadow-[var(--shadow-lg)] backdrop-blur sm:flex-row sm:items-center sm:gap-6">
        <p className="flex-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
          {t.message}
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide('denied')}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-2)]"
          >
            {t.decline}
          </button>
          <button
            type="button"
            onClick={() => decide('granted')}
            className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-ink-soft)]"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
