'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { Locale } from '@/i18n/types';
import { hasGA, applyConsent, CONSENT_STORAGE_KEY } from '@/lib/analytics';

/**
 * GDPR / Garante-compliant cookie-consent banner. Only rendered when GA4 is
 * configured (the cookieless Umami path needs no consent). GA boots with
 * Consent Mode v2 "denied" and stays denied until the visitor accepts here, so
 * no profiling cookies are set before consent. Accept and Reject are given
 * equal prominence (Garante guideline), and the choice is reversible from the
 * footer "Cookie preferences" link via reopenConsent().
 */

const REOPEN_EVENT = 'sk:reopen-consent';

/** Re-open the banner so the visitor can change their choice (footer link). */
export function reopenConsent() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(REOPEN_EVENT));
}

type Strings = { message: string; accept: string; decline: string; policy: string };

const COPY: Record<Locale, Strings> = {
  it: {
    message:
      'Usiamo cookie tecnici e, previo consenso, cookie di analisi e marketing per migliorare il sito. Puoi accettare o rifiutare liberamente.',
    accept: 'Accetta',
    decline: 'Rifiuta',
    policy: 'Cookie Policy',
  },
  en: {
    message:
      'We use technical cookies and, with your consent, analytics and marketing cookies to improve the site. You may freely accept or decline.',
    accept: 'Accept',
    decline: 'Decline',
    policy: 'Cookie Policy',
  },
  es: {
    message:
      'Usamos cookies técnicas y, con tu consentimiento, cookies de análisis y marketing para mejorar el sitio. Puedes aceptar o rechazar libremente.',
    accept: 'Aceptar',
    decline: 'Rechazar',
    policy: 'Política de Cookies',
  },
  de: {
    message:
      'Wir verwenden technische Cookies und – mit Ihrer Einwilligung – Analyse- und Marketing-Cookies. Sie können frei zustimmen oder ablehnen.',
    accept: 'Akzeptieren',
    decline: 'Ablehnen',
    policy: 'Cookie-Richtlinie',
  },
  fr: {
    message:
      'Nous utilisons des cookies techniques et, avec votre consentement, des cookies d’analyse et de marketing. Vous pouvez accepter ou refuser librement.',
    accept: 'Accepter',
    decline: 'Refuser',
    policy: 'Politique de cookies',
  },
  sq: {
    message:
      'Përdorim cookie teknike dhe, me pëlqimin tuaj, cookie analitike e marketingu. Mund të pranoni ose refuzoni lirisht.',
    accept: 'Prano',
    decline: 'Refuzo',
    policy: 'Politika e Cookie-ve',
  },
  ru: {
    message:
      'Мы используем технические cookie и, с вашего согласия, аналитические и маркетинговые. Вы можете свободно принять или отклонить.',
    accept: 'Принять',
    decline: 'Отклонить',
    policy: 'Политика cookie',
  },
};

export default function ConsentBanner() {
  const { locale } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasGA) return;
    if (!localStorage.getItem(CONSENT_STORAGE_KEY)) setVisible(true);
    const reopen = () => setVisible(true);
    window.addEventListener(REOPEN_EVENT, reopen);
    return () => window.removeEventListener(REOPEN_EVENT, reopen);
  }, []);

  if (!hasGA || !visible) return null;

  const t = COPY[locale] ?? COPY.it;

  const decide = (choice: 'granted' | 'denied') => {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    applyConsent(choice);
    setVisible(false);
  };

  const btn =
    'flex-1 rounded-full px-5 py-2.5 text-sm font-medium transition-colors sm:flex-none';

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[80] p-4 sm:p-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-white/95 p-5 shadow-[var(--shadow-lg)] backdrop-blur sm:flex-row sm:items-center sm:gap-6">
        <p className="flex-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
          {t.message}{' '}
          <Link href="/cookie-policy" className="underline hover:text-[var(--color-ink)]">
            {t.policy}
          </Link>
        </p>
        {/* Equal-prominence Accept / Reject (Garante requirement). */}
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide('denied')}
            className={`${btn} border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]`}
          >
            {t.decline}
          </button>
          <button
            type="button"
            onClick={() => decide('granted')}
            className={`${btn} bg-[var(--color-ink)] text-[var(--color-text-inverse)] hover:bg-[var(--color-ink-soft)]`}
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
