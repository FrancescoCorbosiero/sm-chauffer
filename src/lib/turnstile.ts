/**
 * Server-side Cloudflare Turnstile verification for /api/quote.
 *
 * Enforced only when TURNSTILE_SECRET_KEY is set (runtime env). When it isn't,
 * verification is skipped so the form keeps working with the honeypot + timing
 * guards alone — same optional-by-default pattern as SES.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export function isTurnstileEnforced(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

/** Returns true when the submission is allowed to proceed. */
export async function verifyTurnstile(
  token: unknown,
  ip: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not enforced
  if (typeof token !== 'string' || token.length === 0) return false;

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      // Don't let a slow Cloudflare response hang the request forever.
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // On a verification outage, fail closed (reject) — Turnstile was explicitly
    // enabled, so a silent bypass would defeat the purpose.
    return false;
  }
}
