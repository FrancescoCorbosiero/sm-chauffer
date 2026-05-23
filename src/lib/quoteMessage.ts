import type { Dictionary } from '@/i18n/types';

export const CONTACT_EMAIL = 'info@eliteroyalcars.it';
export const CONTACT_WHATSAPP = '390209952588';

export interface BookingPayload {
  kind: 'booking';
  tripType: 'one-way' | 'hourly';
  vehicle: string;
  from: string;
  to: string;
  date: string;
  time: string;
}

export interface ContactPayload {
  kind: 'contact';
  name: string;
  phone: string;
  email: string;
  message: string;
}

export type QuotePayload = BookingPayload | ContactPayload;

interface BuiltMessage {
  subject: string;
  body: string;
}

function line(label: string, value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? `${label}: ${trimmed}` : null;
}

export function buildQuoteMessage(payload: QuotePayload, t: Dictionary): BuiltMessage {
  if (payload.kind === 'booking') {
    const tripLabel =
      payload.tripType === 'one-way' ? t.bookingForm.oneWay : t.bookingForm.hourly;
    const toLabel = payload.tripType === 'one-way' ? t.bookingForm.to : t.bookingForm.duration;

    const lines: string[] = [
      t.quoteMessage.booking.intro,
      '',
      `${t.quoteMessage.booking.tripType}: ${tripLabel}`,
      line(t.bookingForm.vehicle, payload.vehicle),
      line(t.bookingForm.from, payload.from),
      line(toLabel, payload.to),
      line(t.bookingForm.date, payload.date),
      line(t.bookingForm.time, payload.time),
    ].filter((l): l is string => l !== null);

    return {
      subject: t.quoteMessage.booking.subject,
      body: lines.join('\n'),
    };
  }

  return {
    subject: t.quoteMessage.contact.subject,
    body: payload.message.trim(),
  };
}

export function buildMailtoUrl(message: BuiltMessage): string {
  const params = new URLSearchParams({
    subject: message.subject,
    body: message.body,
  });
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}

export function buildWhatsAppUrl(message: BuiltMessage): string {
  const text = `*${message.subject}*\n\n${message.body}`;
  return `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(text)}`;
}
