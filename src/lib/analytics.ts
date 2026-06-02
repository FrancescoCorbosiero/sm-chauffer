/**
 * Analytics configuration. All values are optional — with none set, no tracking
 * scripts are emitted and the site stays banner-free.
 *
 * Two complementary providers:
 *   - GA4 (NEXT_PUBLIC_GA_ID): full Google ecosystem for Ads/marketing. Loaded
 *     with Consent Mode v2 *denied by default* and only granted after the
 *     visitor accepts the cookie banner — the EU-compliant setup.
 *   - Umami (NEXT_PUBLIC_UMAMI_*): cookieless, GDPR-friendly baseline traffic.
 *     Needs no consent banner, so it runs immediately for every visitor.
 *
 * IMPORTANT: these are NEXT_PUBLIC_* vars, inlined at *build* time. In Docker
 * they must be passed as build args (see Dockerfile / docker-compose.yml), not
 * just runtime env, or they resolve to undefined in the bundle.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SRC;
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

/** GA4 is configured → it needs a consent banner before it may set cookies. */
export const hasGA = Boolean(GA_ID);

/** Umami is configured → cookieless, always on, no banner required. */
export const hasUmami = Boolean(UMAMI_SRC && UMAMI_WEBSITE_ID);

/** Key under which the visitor's banner choice is persisted. */
export const CONSENT_STORAGE_KEY = 'sk-consent';

export type ConsentChoice = 'granted' | 'denied';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer?: any[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Push a Consent Mode v2 update to GA once the visitor decides. */
export function applyConsent(choice: ConsentChoice) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  const value = choice === 'granted' ? 'granted' : 'denied';
  window.gtag('consent', 'update', {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
}
