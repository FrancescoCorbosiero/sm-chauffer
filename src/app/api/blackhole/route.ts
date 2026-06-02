import { ban } from '@/lib/blackhole';
import { clientIp } from '@/lib/rateLimit';

// Honeypot endpoint. It's disallowed in robots.txt and only reachable via a
// hidden, nofollow link in the footer, so legitimate visitors and well-behaved
// crawlers never hit it. Anything that does is a bot ignoring robots.txt — ban
// its IP from the contact API.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function trap(req: Request): Response {
  ban(clientIp(req));
  return new Response(
    '<!doctype html><html><head><meta name="robots" content="noindex"><title>403</title></head>' +
      '<body><h1>403 — Access denied</h1><p>Your access has been blocked.</p></body></html>',
    { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

export const GET = trap;
export const POST = trap;
export const HEAD = trap;
