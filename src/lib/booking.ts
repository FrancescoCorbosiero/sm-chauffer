/**
 * The booking draft shared by the quick form (home hero), the vehicle and
 * city CTAs and the full booking wizard on /contact. Entry points hand a
 * partial draft to the wizard through the query string, e.g.
 *   /contact?type=hourly&from=Como&hours=4&car=mercedes-s-class#prenota
 */

export type ServiceType = 'one-way' | 'hourly' | 'airport-transfer';

export interface BookingDraft {
  type: ServiceType;
  from: string;
  to: string;
  hours: string;
  date: string;
  time: string;
  pax: string;
  bags: string;
  car: string;
  childSeat: boolean;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export const EMPTY_DRAFT: BookingDraft = {
  type: 'one-way',
  from: '',
  to: '',
  hours: '',
  date: '',
  time: '',
  pax: '',
  bags: '',
  car: '',
  childSeat: false,
  name: '',
  phone: '',
  email: '',
  notes: '',
};

const SERVICE_TYPES: ServiceType[] = ['one-way', 'hourly', 'airport-transfer'];

/** Fields that may travel in the URL (never the customer's personal details). */
const URL_FIELDS = ['from', 'to', 'hours', 'date', 'time', 'pax', 'car'] as const;

const AIRPORT_RX = /aeroport|airport|flughafen|aéroport|aeropuerto|malpensa|linate|orio|\b(mxp|lin|bgy)\b/i;

export function looksLikeAirport(...places: string[]): boolean {
  return places.some((p) => AIRPORT_RX.test(p));
}

export function buildBookingQuery(draft: Partial<BookingDraft>): string {
  const params = new URLSearchParams();
  if (draft.type) params.set('type', draft.type);
  for (const key of URL_FIELDS) {
    const v = draft[key];
    if (typeof v === 'string' && v.trim()) params.set(key, v.trim());
  }
  return params.toString();
}

export function bookingHref(draft: Partial<BookingDraft> = {}): string {
  const qs = buildBookingQuery(draft);
  return `/contact${qs ? `?${qs}` : ''}#prenota`;
}

/** Read a partial draft back from the query string (unknown values ignored). */
export function draftFromParams(params: URLSearchParams): Partial<BookingDraft> {
  const out: Partial<BookingDraft> = {};
  const type = params.get('type');
  if (type && (SERVICE_TYPES as string[]).includes(type)) out.type = type as ServiceType;
  for (const key of URL_FIELDS) {
    const v = params.get(key);
    if (v) out[key] = v.slice(0, 200);
  }
  // Older links used ?from=<city> only; nothing else to migrate.
  return out;
}
