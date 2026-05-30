import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { buildQuoteMessage, type QuotePayload } from './quoteMessage';

/**
 * Server-side email routing through AWS SES — the equivalent of routing mail
 * via SES the way the WP Mail SMTP plugin does on WordPress.
 *
 * Configured entirely via environment variables (see .env.example):
 *   AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY  (SDK credential chain)
 *   SES_FROM_EMAIL  — a verified SES sending identity (e.g. info@chauffeurskmilano.it)
 *   SES_TO_EMAIL    — where bookings land (any address; e.g. the owner's inbox)
 *
 * If the vars are absent the sender reports `unconfigured` and the form falls
 * back to the WhatsApp / mailto handoff, so the site keeps working with no SES.
 */

export type SesResult =
  | { ok: true }
  | { ok: false; reason: 'unconfigured' | 'send-failed' };

interface SesConfig {
  region: string;
  from: string;
  to: string[];
}

function getConfig(): SesConfig | null {
  const region = process.env.AWS_REGION;
  const from = process.env.SES_FROM_EMAIL;
  const toRaw = process.env.SES_TO_EMAIL;
  if (!region || !from || !toRaw) return null;
  // SES_TO_EMAIL may list several recipients, comma- or semicolon-separated,
  // e.g. "info@chauffeurskmilano.it,maksymnoleggio@gmail.com".
  const to = toRaw
    .split(/[,;]/)
    .map((addr) => addr.trim())
    .filter(Boolean);
  if (to.length === 0) return null;
  return { region, from, to };
}

export function isSesConfigured(): boolean {
  return getConfig() !== null;
}

// Reuse one client across warm invocations.
let cachedClient: SESv2Client | null = null;
function client(region: string): SESv2Client {
  if (!cachedClient) cachedClient = new SESv2Client({ region });
  return cachedClient;
}

export async function sendQuoteEmail(
  payload: QuotePayload,
  replyTo?: string,
): Promise<SesResult> {
  const cfg = getConfig();
  if (!cfg) return { ok: false, reason: 'unconfigured' };

  const { subject, body } = buildQuoteMessage(payload);

  try {
    await client(cfg.region).send(
      new SendEmailCommand({
        FromEmailAddress: cfg.from,
        Destination: { ToAddresses: cfg.to },
        ReplyToAddresses: replyTo ? [replyTo] : undefined,
        Content: {
          Simple: {
            Subject: { Data: subject, Charset: 'UTF-8' },
            Body: { Text: { Data: body, Charset: 'UTF-8' } },
          },
        },
      }),
    );
    return { ok: true };
  } catch (err) {
    console.error('[ses] send failed:', err);
    return { ok: false, reason: 'send-failed' };
  }
}
