import { NextResponse } from 'next/server';
import { validateQuotePayload } from '@/lib/quoteValidation';
import { isSesConfigured, sendQuoteEmail } from '@/lib/ses';

// Sends real email — must run on the Node server, never statically cached.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid-json' }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success, send nothing.
  if (data && typeof data === 'object' && typeof (data as { company?: unknown }).company === 'string' && (data as { company: string }).company.trim() !== '') {
    return NextResponse.json({ ok: true });
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

  return NextResponse.json({ ok: true });
}
