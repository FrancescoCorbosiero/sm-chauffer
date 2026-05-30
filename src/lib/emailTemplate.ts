import type { ContactPayload } from './quoteMessage';
import type { Locale } from '@/i18n/types';
import { dictionaries } from '@/i18n/dictionaries';
import { SITE } from './site';
import { vehicles } from './data';
import { estimate, parseHours } from './pricing';

/**
 * Renders the elegant confirmation email sent to the customer after a contact
 * submission — a branded recap of exactly what they sent, localized to the
 * language they were browsing in. Labels reuse the site dictionaries; only the
 * email prose lives in the `emailConfirmation` section.
 */

const INK = '#0a0a0a';
const GOLD = '#ffa806';
const MUTED = '#525252';
const FAINT = '#8a8a8a';
const BORDER = '#ececec';
const SURFACE = '#fafafa';

function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export function renderConfirmationEmail(payload: ContactPayload, locale: Locale): RenderedEmail {
  const t = dictionaries[locale] ?? dictionaries.it;
  const e = t.emailConfirmation;
  const f = t.contactPage.form;
  const bf = t.bookingForm;

  const serviceLabel =
    payload.serviceType === 'one-way'
      ? bf.oneWay
      : payload.serviceType === 'hourly'
        ? bf.hourly
        : f.airportTransfer;
  const secondLabel = payload.serviceType === 'hourly' ? bf.duration : bf.to;

  const vehicle = vehicles.find((v) => v.name === payload.vehicle) ?? null;
  const est = estimate({
    tripType: payload.serviceType === 'hourly' ? 'hourly' : 'one-way',
    vehicle,
    from: payload.from,
    to: payload.serviceType === 'hourly' ? undefined : payload.to,
    durationHours: payload.serviceType === 'hourly' ? parseHours(payload.to) : undefined,
  });
  const estimateValue = est.kind === 'hourly' || est.kind === 'fixed' ? `~€${est.amount}` : null;

  const rows: Array<[string, string | undefined]> = [
    [f.serviceType, serviceLabel],
    [bf.vehicle, payload.vehicle],
    [bf.from, payload.from],
    [secondLabel, payload.to],
    [bf.date, payload.date],
    [f.pickupTime, payload.time],
    [f.passengers, payload.passengers],
    [f.bags, payload.bags],
    [f.childSeat, payload.childSeat ? f.yes : f.no],
    [f.additionalNotes, payload.notes],
  ];
  if (estimateValue) rows.push([t.quote.estimate, estimateValue]);
  const visibleRows = rows.filter(([, v]) => v != null && String(v).trim() !== '');

  const firstName = payload.name.trim().split(/\s+/)[0] || payload.name.trim();
  const greetingText = e.greeting.replace('{name}', firstName);
  const greetingHtml = e.greeting.replace('{name}', esc(firstName));

  const rowsHtml = visibleRows
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:10px 16px;font-size:13px;color:${MUTED};border-top:1px solid ${BORDER};vertical-align:top;">${esc(k)}</td>
        <td style="padding:10px 16px;font-size:14px;color:${INK};border-top:1px solid ${BORDER};text-align:right;">${esc(String(v))}</td>
      </tr>`,
    )
    .join('');

  const html = `<!doctype html>
<html lang="${locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(e.subject)}</title></head>
<body style="margin:0;padding:0;background:${SURFACE};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${esc(e.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SURFACE};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid ${BORDER};border-radius:16px;overflow:hidden;">
  <tr><td style="background:${INK};padding:28px 24px;text-align:center;">
    <img src="${SITE.url}/logo.png" width="48" height="48" alt="${esc(SITE.name)}" style="display:inline-block;border:0;outline:none;">
    <div style="margin-top:10px;color:#ffffff;font-size:13px;letter-spacing:3px;text-transform:uppercase;">${esc(SITE.name)}</div>
  </td></tr>
  <tr><td style="padding:28px 24px 6px;">
    <p style="margin:0 0 14px;font-size:16px;color:${INK};">${greetingHtml}</p>
    <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:${MUTED};">${esc(e.intro)}</p>
  </td></tr>
  <tr><td style="padding:0 24px;">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:${GOLD};font-weight:600;margin-bottom:8px;">${esc(e.summaryTitle)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:12px;overflow:hidden;">${rowsHtml}
    </table>
    ${estimateValue ? `<p style="margin:10px 2px 0;font-size:11px;color:${FAINT};">${esc(t.quote.disclaimer)}</p>` : ''}
  </td></tr>
  <tr><td style="padding:24px;">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:${GOLD};font-weight:600;margin-bottom:8px;">${esc(e.contactTitle)}</div>
    <p style="margin:0;font-size:14px;line-height:1.8;color:${INK};">
      <a href="tel:${esc(SITE.phone)}" style="color:${INK};text-decoration:none;">${esc(SITE.phoneDisplay)}</a> &nbsp;·&nbsp;
      <a href="https://wa.me/${esc(SITE.whatsapp)}" style="color:${INK};text-decoration:none;">WhatsApp</a><br>
      <a href="mailto:${esc(SITE.email)}" style="color:${INK};text-decoration:none;">${esc(SITE.email)}</a>
    </p>
  </td></tr>
  <tr><td style="padding:4px 24px 28px;">
    <p style="margin:0;font-size:14px;color:${MUTED};">${esc(e.closing)}<br><strong style="color:${INK};">${esc(SITE.name)}</strong></p>
  </td></tr>
</table>
<p style="max-width:560px;margin:16px auto 0;font-size:11px;color:#9a9a9a;text-align:center;">${esc(SITE.name)} · ${esc(SITE.url.replace(/^https?:\/\//, ''))}</p>
</td></tr>
</table>
</body></html>`;

  const text = [
    greetingText,
    '',
    e.intro,
    '',
    `${e.summaryTitle}:`,
    ...visibleRows.map(([k, v]) => `- ${k}: ${v}`),
    ...(estimateValue ? ['', t.quote.disclaimer] : []),
    '',
    `${e.contactTitle}: ${SITE.phoneDisplay} · ${SITE.email} · wa.me/${SITE.whatsapp}`,
    '',
    e.closing,
    SITE.name,
  ].join('\n');

  return { subject: `${e.subject} — ${SITE.name}`, html, text };
}
