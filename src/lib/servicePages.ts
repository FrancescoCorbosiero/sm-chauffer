import type { ServiceType } from './booking';
import { FIXED_FARES } from './pricing';
import { services, vehicles } from './data';
import type { Service, Vehicle } from './types';

/**
 * Per-service configuration for /services and /services/[slug]. The slug is
 * the service id (src/lib/data.ts), which also keys the localized copy in
 * t.services[id]. Italian SEO copy lives here because the pages prerender
 * Italian metadata, like the /ncc and /blog routes.
 */
export interface ServicePage {
  id: string;
  /** Service type preselected in the booking wizard. */
  bookingType: ServiceType;
  /** How the fare is presented: fixed route fare, hourly from-rate or quote. */
  pricing: 'fixed' | 'hourly' | 'quote';
  /** Recommended vehicle ids, in display order. */
  vehicles: string[];
  /** Coverage point ids (src/lib/coverage.ts) listed as typical routes. */
  zones: string[];
  /** Indexes into the general FAQ (src/lib/faq.ts) shown on the page. */
  faq: number[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    serviceType: string;
    areaServed: string[];
  };
}

export const SERVICE_PAGES: ServicePage[] = [
  {
    id: 'airport-transfer',
    bookingType: 'airport-transfer',
    pricing: 'fixed',
    vehicles: ['mercedes-e-class', 'mercedes-s-class', 'mercedes-v-class', 'range-rover'],
    zones: ['mxp', 'lin', 'bgy'],
    faq: [0, 3, 4, 5],
    seo: {
      title: 'Transfer aeroporto Malpensa, Linate e Orio al Serio',
      description:
        'Transfer privato da e per Malpensa, Linate e Orio al Serio: volo monitorato, accoglienza con cartello e tariffa fissa Milano–Malpensa da 150 €. Attivi 24/7.',
      keywords: [
        'transfer Malpensa',
        'transfer Linate',
        'transfer Orio al Serio',
        'NCC aeroporto Milano',
        'transfer aeroporto con autista',
        'Milano Malpensa prezzo fisso',
      ],
      serviceType: 'Transfer aeroportuale con autista',
      areaServed: ['Milano', 'Lombardia'],
    },
  },
  {
    id: 'autista-milano',
    bookingType: 'hourly',
    pricing: 'hourly',
    vehicles: ['mercedes-s-class', 'mercedes-e-class', 'range-rover', 'mercedes-v-class'],
    zones: ['lin', 'mxp', 'monza', 'como'],
    faq: [5, 2, 3, 1],
    seo: {
      title: 'Autista privato a Milano — servizio a ore e business',
      description:
        'Autista privato a Milano per business, Fashion Week ed eventi: servizio a ore da 70 €/h, vetture Mercedes e Range Rover, massima discrezione. Attivi 24/7.',
      keywords: [
        'autista privato Milano',
        'NCC Milano',
        'autista a ore Milano',
        'chauffeur Milano',
        'autista Fashion Week Milano',
      ],
      serviceType: 'Noleggio con conducente (NCC)',
      areaServed: ['Milano', 'Città Metropolitana di Milano'],
    },
  },
  {
    id: 'autista-brianza',
    bookingType: 'hourly',
    pricing: 'hourly',
    vehicles: ['mercedes-e-class', 'mercedes-s-class', 'range-rover', 'mercedes-v-class'],
    zones: ['monza', 'brianza', 'lecco', 'como'],
    faq: [1, 5, 2, 0],
    seo: {
      title: 'Autista privato in Brianza — Monza, Lecco e dintorni',
      description:
        'Autista privato in Brianza per aziende, eventi in villa e Gran Premio di Monza. Collegamenti con Milano e aeroporti, servizio a ore e fatturazione dedicata.',
      keywords: [
        'autista privato Brianza',
        'NCC Brianza',
        'NCC Monza',
        'autista Gran Premio Monza',
        'transfer Brianza Malpensa',
      ],
      serviceType: 'Noleggio con conducente (NCC)',
      areaServed: ['Monza e Brianza', 'Lecco', 'Lombardia'],
    },
  },
  {
    id: 'tour-privati',
    bookingType: 'hourly',
    pricing: 'hourly',
    vehicles: ['mercedes-v-class', 'mercedes-s-class', 'range-rover', 'mercedes-e-class'],
    zones: ['bellagio', 'varenna', 'tremezzo', 'como', 'stmoritz'],
    faq: [5, 4, 1, 2],
    seo: {
      title: 'Tour privati con autista — Lago di Como e Italia',
      description:
        'Tour privati con autista dedicato: Lago di Como, Bellagio, Varenna, Langhe, Cinque Terre e Costiera Amalfitana. Itinerari su misura, Classe V fino a 7 posti.',
      keywords: [
        'tour Lago di Como con autista',
        'tour privato Bellagio',
        'escursione con autista',
        'tour privati Italia',
        'autista per tour',
      ],
      serviceType: 'Tour privato con autista',
      areaServed: ['Lago di Como', 'Lombardia', 'Italia'],
    },
  },
  {
    id: 'trasferimenti-internazionali',
    bookingType: 'one-way',
    pricing: 'quote',
    vehicles: ['mercedes-s-class', 'mercedes-v-class', 'range-rover', 'mercedes-e-class'],
    zones: ['lugano', 'stmoritz', 'zurich', 'geneva', 'nice'],
    faq: [1, 2, 5, 4],
    seo: {
      title: 'Trasferimenti internazionali da Milano con autista',
      description:
        'Transfer porta a porta da Milano a Lugano, St. Moritz, Zurigo, Ginevra, Nizza e Monaco. Autisti esperti delle tratte estere, preventivo chiaro prima di partire.',
      keywords: [
        'transfer Milano Lugano',
        'transfer Milano St. Moritz',
        'transfer Milano Zurigo',
        'transfer Milano Ginevra',
        'transfer Milano Nizza',
        'NCC internazionale',
      ],
      serviceType: 'Trasferimento internazionale con autista',
      areaServed: ['Lombardia', 'Svizzera', 'Francia', 'Principato di Monaco'],
    },
  },
  {
    id: 'minibus-gruppi',
    bookingType: 'one-way',
    pricing: 'quote',
    vehicles: ['bus-18', 'mercedes-v-class'],
    zones: ['mxp', 'lin', 'como', 'bellagio'],
    faq: [2, 4, 5, 1],
    seo: {
      title: 'Minibus con autista per gruppi ed eventi — fino a 18 posti',
      description:
        'Minibus 18 posti e Classe V con autista per gruppi, congressi, eventi aziendali e matrimoni a Milano, in Brianza e sul Lago di Como. Preventivo su misura.',
      keywords: [
        'minibus con autista Milano',
        'noleggio minibus 18 posti',
        'transfer gruppi Milano',
        'navetta eventi',
        'minibus matrimonio',
      ],
      serviceType: 'Noleggio minibus con conducente',
      areaServed: ['Milano', 'Monza e Brianza', 'Como', 'Lombardia'],
    },
  },
];

export function getServicePage(id: string): ServicePage | undefined {
  return SERVICE_PAGES.find((p) => p.id === id);
}

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function serviceVehicles(page: ServicePage): Vehicle[] {
  return page.vehicles
    .map((id) => vehicles.find((v) => v.id === id))
    .filter((v): v is Vehicle => Boolean(v));
}

export type ServicePrice =
  | { kind: 'fixed'; amount: number }
  | { kind: 'hourly'; from: number }
  | { kind: 'quote' };

/** The fare shown for a service, derived from the fleet rates and fixed fares. */
export function servicePrice(page: ServicePage): ServicePrice {
  if (page.pricing === 'fixed') return { kind: 'fixed', amount: FIXED_FARES.milanoMalpensa };
  if (page.pricing === 'hourly') {
    const rates = serviceVehicles(page)
      .filter((v) => !v.priceOnRequest && v.pricePerHour > 0)
      .map((v) => v.pricePerHour);
    if (rates.length) return { kind: 'hourly', from: Math.min(...rates) };
  }
  return { kind: 'quote' };
}

/** Largest passenger capacity among the recommended vehicles. */
export function serviceMaxPassengers(page: ServicePage): number {
  return Math.max(...serviceVehicles(page).map((v) => v.passengers));
}

/** Splits a title so its last word can be set as the italic accent. */
export function splitTitle(title: string): [string, string] {
  const i = title.trim().lastIndexOf(' ');
  return i === -1 ? [title, ''] : [title.slice(0, i), title.slice(i + 1)];
}
