import { SITE } from './site';
import { vehicles } from './data';
import { estimate, parseHours } from './pricing';

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
  serviceType: 'one-way' | 'hourly' | 'airport-transfer';
  name: string;
  phone: string;
  email: string;
  from: string;
  to: string;
  date: string;
  time: string;
  vehicle: string;
  passengers?: string;
  bags?: string;
  childSeat: boolean;
  notes?: string;
}

export type QuotePayload = BookingPayload | ContactPayload;

interface BuiltMessage {
  subject: string;
  body: string;
}

// Italian-only labels for outgoing messages.
// Whatever language the user is browsing in, the message that lands
// in SM Luxury Chauffeur's inbox / WhatsApp must always be in Italian.
const IT = {
  booking: {
    subject: 'Richiesta di preventivo — SM Luxury Chauffeur',
    intro: 'Nuova richiesta di preventivo dal sito',
    tripType: 'Tipo di viaggio',
    vehicle: 'Veicolo',
    from: 'Partenza',
    to: 'Destinazione',
    duration: 'Durata (ore)',
    date: 'Data',
    time: 'Ora',
  },
  contact: {
    subject: 'Richiesta di contatto — SM Luxury Chauffeur',
    intro: 'Nuova richiesta dal modulo contatti',
    serviceType: 'Tipo di servizio',
    name: 'Nome e cognome',
    phone: 'Telefono',
    email: 'Email',
    from: 'Partenza',
    to: 'Destinazione',
    duration: 'Durata (ore)',
    date: 'Data',
    time: 'Orario di partenza',
    vehicle: 'Veicolo selezionato',
    passengers: 'Passeggeri',
    bags: 'Bagagli',
    childSeat: 'Seggiolino bambini',
    notes: 'Note aggiuntive',
    yes: 'Sì',
    no: 'No',
  },
  serviceType: {
    'one-way': 'Sola andata',
    hourly: 'Servizio a ore',
    'airport-transfer': 'Transfer aeroportuale',
  },
  estimate: 'Stima indicativa',
} as const;

function line(label: string, value: string | undefined | null): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed ? `${label}: ${trimmed}` : null;
}

// A soft, indicative figure for the operator — only when a price is actually
// computable (hourly total or the fixed Malpensa fare). Kept low-key with "~"
// and "(da confermare)" so it never reads as a binding quote.
function estimateLine(payload: QuotePayload): string | null {
  const vehicle = vehicles.find((v) => v.name === payload.vehicle) ?? null;
  const tripType =
    payload.kind === 'booking'
      ? payload.tripType
      : payload.serviceType === 'hourly'
        ? 'hourly'
        : 'one-way';
  const est = estimate({
    tripType,
    vehicle,
    from: payload.from,
    to: tripType === 'one-way' ? payload.to : undefined,
    durationHours: tripType === 'hourly' ? parseHours(payload.to) : undefined,
  });
  if (est.kind === 'hourly' || est.kind === 'fixed') {
    return `${IT.estimate}: ~€${est.amount} (da confermare)`;
  }
  return null;
}

export function buildQuoteMessage(payload: QuotePayload): BuiltMessage {
  if (payload.kind === 'booking') {
    const tripLabel = IT.serviceType[payload.tripType];
    const toLabel = payload.tripType === 'one-way' ? IT.booking.to : IT.booking.duration;

    const lines: string[] = [
      IT.booking.intro,
      '',
      `${IT.booking.tripType}: ${tripLabel}`,
      line(IT.booking.vehicle, payload.vehicle),
      line(IT.booking.from, payload.from),
      line(toLabel, payload.to),
      line(IT.booking.date, payload.date),
      line(IT.booking.time, payload.time),
      estimateLine(payload),
    ].filter((l): l is string => l !== null);

    return { subject: IT.booking.subject, body: lines.join('\n') };
  }

  const lines: string[] = [
    IT.contact.intro,
    '',
    `${IT.contact.serviceType}: ${IT.serviceType[payload.serviceType]}`,
    line(IT.contact.name, payload.name),
    line(IT.contact.email, payload.email),
    line(IT.contact.phone, payload.phone),
    line(IT.contact.from, payload.from),
    line(
      payload.serviceType === 'hourly' ? IT.contact.duration : IT.contact.to,
      payload.to,
    ),
    line(IT.contact.date, payload.date),
    line(IT.contact.time, payload.time),
    line(IT.contact.vehicle, payload.vehicle),
    line(IT.contact.passengers, payload.passengers),
    line(IT.contact.bags, payload.bags),
    `${IT.contact.childSeat}: ${payload.childSeat ? IT.contact.yes : IT.contact.no}`,
    line(IT.contact.notes, payload.notes),
    estimateLine(payload),
  ].filter((l): l is string => l !== null);

  return { subject: IT.contact.subject, body: lines.join('\n') };
}

export function buildMailtoUrl(message: BuiltMessage): string {
  const params = new URLSearchParams({
    subject: message.subject,
    body: message.body,
  });
  // Destination address — single source of truth in src/lib/site.ts.
  // To route bookings to an external inbox, set a forwarding rule on this
  // mailbox in your webmail (recommended), or change SITE.email here.
  return `mailto:${SITE.email}?${params.toString()}`;
}

export function buildWhatsAppUrl(message: BuiltMessage): string {
  const text = `*${message.subject}*\n\n${message.body}`;
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}
