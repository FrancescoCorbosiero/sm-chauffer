/**
 * "Blackhole" bot trap — the equivalent of WordPress's Blackhole for Bad Bots.
 *
 * A hidden link (disallowed in robots.txt, rel="nofollow", visually hidden)
 * points at /api/blackhole. Well-behaved crawlers and humans never follow it;
 * a bot that ignores robots.txt and scrapes every href trips the trap and its
 * IP is banned from the contact API.
 *
 * In-memory + single-instance (resets on container restart), like the rate
 * limiter — a deterrent, not a distributed firewall. Swap the Set for Redis if
 * you ever run multiple instances.
 */

const banned = new Map<string, number>(); // ip -> bannedUntil (epoch ms)
const BAN_MS = 24 * 60 * 60 * 1000; // 24h

export function ban(ip: string): void {
  if (!ip || ip === 'unknown') return;
  banned.set(ip, Date.now() + BAN_MS);
}

export function isBanned(ip: string): boolean {
  const until = banned.get(ip);
  if (until === undefined) return false;
  if (until <= Date.now()) {
    banned.delete(ip);
    return false;
  }
  return true;
}
