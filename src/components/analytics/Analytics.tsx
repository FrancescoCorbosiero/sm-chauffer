'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  GA_ID,
  UMAMI_SRC,
  UMAMI_WEBSITE_ID,
  hasGA,
  hasUmami,
  applyConsent,
  CONSENT_STORAGE_KEY,
  type ConsentChoice,
} from '@/lib/analytics';

/**
 * Loads the analytics scripts and tracks client-side route changes.
 *
 * The scripts are plain server-rendered <script> tags (not next/script) so they
 * land in the static HTML in a guaranteed order: the Consent Mode v2 *default
 * denied* block runs before the GA library loads — the EU-compliant boot
 * sequence. ConsentBanner flips consent to granted on accept; a returning
 * visitor's stored choice is re-applied here on mount. Umami is cookieless and
 * always on. Each tag has a stable id so React 19 deduplicates rather than
 * re-running it across route changes.
 */
export default function Analytics() {
  const pathname = usePathname();

  // Re-apply a returning visitor's saved consent as soon as gtag exists.
  useEffect(() => {
    if (!hasGA) return;
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY) as ConsentChoice | null;
    if (saved === 'granted') applyConsent('granted');
  }, []);

  // GA4 sends the first page_view via `config`; emit one per SPA navigation too.
  useEffect(() => {
    if (!hasGA || typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
    });
  }, [pathname]);

  return (
    <>
      {hasGA && (
        // Single inline script: sets Consent Mode v2 defaults to *denied*, then
        // injects gtag.js itself. Keeping the library load inside this inline
        // script guarantees the consent defaults run first — a separate
        // <script async src> would be hoisted by React 19 and could load GA
        // before consent is set. Inline scripts are never hoisted.
        <script
          id="ga-consent-init"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                wait_for_update: 500
              });
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
              var s = document.createElement('script');
              s.async = true;
              s.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
              document.head.appendChild(s);
            `,
          }}
        />
      )}

      {hasUmami && (
        <script id="umami" async defer src={UMAMI_SRC} data-website-id={UMAMI_WEBSITE_ID} />
      )}
    </>
  );
}
