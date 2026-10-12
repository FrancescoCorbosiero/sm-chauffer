'use client';

import type { Locale } from '@/i18n/types';
import { hasTurnstile } from './security';
import { buildMailtoUrl, buildQuoteMessage, buildWhatsAppUrl, type QuotePayload } from './quoteMessage';

/**
 * The two ways a request reaches the operator, shared by the booking app.
 * WhatsApp opens a pre-filled chat; email posts to /api/quote (SES) and, if
 * the server cannot send (no SES config, network, captcha), falls back to
 * the visitor's own mail client with the same message.
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

export type EmailResult = 'sent' | 'mailto';

export async function sendByEmail(
  payload: QuotePayload,
  opts: { locale: Locale; honeypot: string; turnstileToken: () => string },
): Promise<EmailResult> {
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
    if (res.ok) return 'sent';
  } catch {
    // network error: fall back to the mail client
  }
  window.location.href = buildMailtoUrl(buildQuoteMessage(payload));
  return 'mailto';
}
