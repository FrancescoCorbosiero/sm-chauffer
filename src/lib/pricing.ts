import type { Vehicle } from './types';

/**
 * Quote estimation — the single source of truth for the live price calculator.
 *
 * Only what the operator actually quoted is computed here:
 *  - hourly service  → vehicle hourly rate × hours
 *  - Milano–Malpensa → fixed fare
 *  - the 18-seat bus → always on request
 *  - any other route → on request (no per-km rate has been provided)
 *
 * Extend FIXED_FARES / the matchers below as more routes are confirmed.
 */

export type TripType = 'one-way' | 'hourly';

/** Fixed point-to-point fares in EUR. */
export const FIXED_FARES = {
  milanoMalpensa: 150,
} as const;

export type Estimate =
  | { kind: 'incomplete' }
  | { kind: 'hourly'; amount: number; hours: number; rate: number }
  | { kind: 'hourly-rate'; rate: number }
  | { kind: 'fixed'; amount: number; route: 'milano-malpensa' }
  | { kind: 'on-request'; reason: 'bus' | 'custom-route' };

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

/** Recognise the Milano–Malpensa fixed-fare route from free-text fields. */
export function isMilanoMalpensa(from = '', to = ''): boolean {
  return norm(from).includes('malpensa') || norm(to).includes('malpensa');
}

/** Parse an hours value from a free-text field ("4", "4,5", "es. 4"). */
export function parseHours(value: string | undefined | null): number | null {
  if (!value) return null;
  const match = value.replace(',', '.').match(/\d+(\.\d+)?/);
  if (!match) return null;
  const n = Number(match[0]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function estimate(input: {
  tripType: TripType;
  vehicle?: Vehicle | null;
  from?: string;
  to?: string;
  durationHours?: number | null;
}): Estimate {
  const { tripType, vehicle } = input;
  if (!vehicle) return { kind: 'incomplete' };
  if (vehicle.priceOnRequest) return { kind: 'on-request', reason: 'bus' };

  if (tripType === 'hourly') {
    const hours = input.durationHours ?? null;
    if (hours == null) return { kind: 'hourly-rate', rate: vehicle.pricePerHour };
    return {
      kind: 'hourly',
      amount: Math.round(vehicle.pricePerHour * hours),
      hours,
      rate: vehicle.pricePerHour,
    };
  }

  // one-way / transfer
  if (!input.from?.trim() || !input.to?.trim()) return { kind: 'incomplete' };
  if (isMilanoMalpensa(input.from, input.to)) {
    return { kind: 'fixed', amount: FIXED_FARES.milanoMalpensa, route: 'milano-malpensa' };
  }
  return { kind: 'on-request', reason: 'custom-route' };
}
