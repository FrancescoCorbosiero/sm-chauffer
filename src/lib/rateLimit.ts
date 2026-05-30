/**
 * Minimal in-memory fixed-window rate limiter for the public /api/quote route.
 *
 * Single-instance only (the standalone Node server) and resets on restart —
 * which is fine at this scale: it's a basic abuse guard alongside the honeypot,
 * not a distributed quota. For multi-instance you'd swap the Map for Redis.
 */

interface Window {
  count: number;
  resetAt: number;
}

const store = new Map<string, Window>();
let lastSweep = 0;

export interface RateLimitResult {
  ok: boolean;
  retryAfterSec: number;
}

export function rateLimit(
  key: string,
  limit = 6,
  windowMs = 10 * 60 * 1000,
): RateLimitResult {
  const now = Date.now();

  // Opportunistic cleanup of expired windows.
  if (now - lastSweep > windowMs) {
    for (const [k, w] of store) {
      if (w.resetAt <= now) store.delete(k);
    }
    lastSweep = now;
  }

  const win = store.get(key);
  if (!win || win.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  if (win.count >= limit) {
    return { ok: false, retryAfterSec: Math.ceil((win.resetAt - now) / 1000) };
  }

  win.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/** Best-effort client IP, trusting the reverse proxy's forwarded headers. */
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}
