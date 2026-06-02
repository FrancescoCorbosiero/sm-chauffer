import { NextResponse } from 'next/server';
import { validateQuotePayload } from '@/lib/quoteValidation';
import { isSesConfigured, sendQuoteEmail, sendHtmlEmail } from '@/lib/ses';
import { renderConfirmationEmail } from '@/lib/emailTemplate';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { isBanned } from '@/lib/blackhole';
import { verifyTurnstile } from '@/lib/turnstile';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/i18n/types';

// Minimum plausible time a human spends on the page before submitting. Scripted
// POSTs are effectively instant, so anything faster is treated as a bot.
const MIN_ELAPSED_MS = 2000;

function pickLocale(value: unknown): Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
    ? (value as Locale)
    : DEFAULT_LOCALE;
}

// Sends real email — must run on the Node server, never statically cached.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const ip = clientIp(req);

  // Blackhole: IPs that tripped the bot trap (/api/blackhole) are refused.
  if (isBanned(ip)) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  // Basic abuse guard: cap submissions per IP (the proxy sets X-Forwarded-For).
  const limit = rateLimit(`quote:${ip}`);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'rate-limited' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid-json' }, { status: 400 });
  }

  const d = (data ?? {}) as Record<string, unknown>;

  // Honeypot: bots fill hidden fields. Pretend success, send nothing.
  if (typeof d.company === 'string' && d.company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  // Timing trap: a real visitor takes seconds to fill the form; an instant
  // submit is a bot. Pretend success so the bot can't probe the threshold.
  if (typeof d.elapsedMs === 'number' && d.elapsedMs < MIN_ELAPSED_MS) {
    return NextResponse.json({ ok: true });
  }

  // Cloudflare Turnstile (only enforced when TURNSTILE_SECRET_KEY is set).
  if (!(await verifyTurnstile(d.turnstileToken, ip))) {
    return NextResponse.json({ ok: false, error: 'captcha-failed' }, { status: 403 });
  }

  const payload = validateQuotePayload(data);
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'invalid-payload' }, { status: 422 });
  }

  if (!isSesConfigured()) {
    // Let the client fall back to the WhatsApp / mailto handoff.
    return NextResponse.json({ ok: false, error: 'unconfigured' }, { status: 503 });
  }

  const replyTo = payload.kind === 'contact' ? payload.email : undefined;
  const result = await sendQuoteEmail(payload, replyTo);
  if (!result.ok) {
    const status = result.reason === 'unconfigured' ? 503 : 502;
    return NextResponse.json({ ok: false, error: result.reason }, { status });
  }

  // Best-effort customer confirmation (contact form only — it carries an email).
  // A failure here must not fail the request: the operator already has it.
  if (payload.kind === 'contact') {
    const locale = pickLocale((data as { locale?: unknown }).locale);
    const { subject, html, text } = renderConfirmationEmail(payload, locale);
    await sendHtmlEmail(payload.email, subject, html, text);
  }

  return NextResponse.json({ ok: true });
}
