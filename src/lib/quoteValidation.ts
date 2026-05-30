import type { QuotePayload, BookingPayload, ContactPayload } from './quoteMessage';

/**
 * Server-side validation for the public /api/quote endpoint. Never trust the
 * client: re-validate the structured payload here (the email body is rebuilt
 * server-side from these fields, not from any client-provided text).
 */

const MAX = { short: 200, long: 4000 };

function reqStr(v: unknown, max = MAX.short): string | null {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= max ? v.trim() : null;
}
function optStr(v: unknown, max = MAX.long): string | undefined | false {
  if (v == null || v === '') return undefined;
  return typeof v === 'string' && v.length <= max ? v.trim() : false;
}

const TRIP_TYPES = ['one-way', 'hourly'] as const;
const SERVICE_TYPES = ['one-way', 'hourly', 'airport-transfer'] as const;

export function validateQuotePayload(data: unknown): QuotePayload | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;

  if (d.kind === 'booking') {
    const tripType = d.tripType;
    if (typeof tripType !== 'string' || !(TRIP_TYPES as readonly string[]).includes(tripType)) return null;
    const vehicle = reqStr(d.vehicle);
    const from = reqStr(d.from);
    const to = reqStr(d.to);
    const date = reqStr(d.date, 40);
    const time = reqStr(d.time, 20);
    if (!vehicle || !from || !to || !date || !time) return null;
    const payload: BookingPayload = {
      kind: 'booking',
      tripType: tripType as BookingPayload['tripType'],
      vehicle, from, to, date, time,
    };
    return payload;
  }

  if (d.kind === 'contact') {
    const serviceType = d.serviceType;
    if (typeof serviceType !== 'string' || !(SERVICE_TYPES as readonly string[]).includes(serviceType)) return null;
    const name = reqStr(d.name);
    const phone = reqStr(d.phone, 60);
    const email = reqStr(d.email, 120);
    const from = reqStr(d.from);
    const to = reqStr(d.to);
    const date = reqStr(d.date, 40);
    const time = reqStr(d.time, 20);
    const vehicle = reqStr(d.vehicle);
    if (!name || !phone || !email || !from || !to || !date || !time || !vehicle) return null;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
    const passengers = optStr(d.passengers, 20);
    const bags = optStr(d.bags, 20);
    const notes = optStr(d.notes);
    if (passengers === false || bags === false || notes === false) return null;
    const payload: ContactPayload = {
      kind: 'contact',
      serviceType: serviceType as ContactPayload['serviceType'],
      name, phone, email, from, to, date, time, vehicle,
      passengers, bags, notes,
      childSeat: d.childSeat === true,
    };
    return payload;
  }

  return null;
}
