/**
 * Client-safe security config. NEXT_PUBLIC_* is inlined at build time (passed as
 * a Docker build arg), so this is safe to import into client components.
 *
 * Cloudflare Turnstile is a free, privacy-friendly, invisible CAPTCHA. Setup is
 * a single external step: create a Turnstile widget in the Cloudflare dashboard
 * (no need to proxy the site through Cloudflare) to get a site key + secret key.
 * With the site key unset, the widget simply isn't rendered and the form relies
 * on the honeypot + timing trap + rate limiter instead.
 */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Turnstile widget is configured → render it on the form. */
export const hasTurnstile = Boolean(TURNSTILE_SITE_KEY);

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
      reset: (id?: string) => void;
    };
  }
}
