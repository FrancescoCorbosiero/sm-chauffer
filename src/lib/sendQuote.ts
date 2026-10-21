'use client';

import type { Locale } from '@/i18n/types';
import { hasTurnstile } from './security';
import { buildMailtoUrl, buildQuoteMessage, buildWhatsAppUrl, type QuotePayload } from './quoteMessage';

/**
 * The ways a request reaches the operator, shared by the booking app.
 * WhatsApp opens a pre-filled chat; email posts to /api/quote (SES). If the
 * server cannot send (no SES config, rate limit, captcha, network), the app
 * says so and offers the other channels: the visitor's own mail client opens
 * only when they ask for it (mailtoHref).
 */

export function openWhatsApp(payload: QuotePayload): void {
  window.open(buildWhatsAppUrl(buildQuoteMessage(payload)), '_blank', 'noopener,noreferrer');
}

/**
 * Turnstile loads asynchronously, so a fast click can come before its token:
 * wait for it briefly (up to ~8 s) instead of posting an empty token that the
 * server would reject.
 */
async function waitForToken(read: () => string): Promise<string> {
  if (!hasTurnstile || read()) return read();
  const deadline = Date.now() + 8000;
  while (!read() && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 100));
  }
  return read();
}

/** The same message as a mailto: link, for the visitor's own mail app. */
export function mailtoHref(payload: QuotePayload): string {
  return buildMailtoUrl(buildQuoteMessage(payload));
}

/** `reason` is the API's error code (e.g. 'rate-limited'), or 'network'. */
export type EmailResult = { ok: true } | { ok: false; reason: string };

export async function sendByEmail(
  payload: QuotePayload,
  opts: { locale: Locale; honeypot: string; turnstileToken: () => string },
): Promise<EmailResult> {
  let reason = 'network';
  try {
    const turnstileToken = await waitForToken(opts.turnstileToken);
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        company: opts.honeypot,
        locale: opts.locale,
        // Anti-bot signals: time spent on the page (scripted posts are
        // instant) and the Turnstile token.
        elapsedMs: Math.round(performance.now()),
        turnstileToken,
      }),
    });
    if (res.ok) return { ok: true };
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    reason = body?.error ?? `http-${res.status}`;
  } catch {
    // network error: reason stays 'network'
  }
  console.warn('[quote] email delivery failed:', reason);
  return { ok: false, reason };
}
