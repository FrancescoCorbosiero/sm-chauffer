import type { Dictionary } from '@/i18n/types';
import { vehicles } from './data';
import type { Vehicle } from './types';

/**
 * Fleet helpers. Vehicle ids match the localized copy in t.vehicles[id].
 * Kept free of heavy imports: the footer and vehicle cards use it on every page.
 */

export function getVehicle(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

/** Localized display name. Bookings keep sending the Italian data name. */
export function vehicleName(v: Vehicle, t: Dictionary): string {
  return t.vehicles[v.id]?.name ?? v.name;
}

/** "Mercedes" + "Classe S": the first word, then the rest for the italic accent. */
export function splitName(name: string): [string, string] {
  const i = name.indexOf(' ');
  return i === -1 ? [name, ''] : [name.slice(0, i), name.slice(i + 1)];
}

export function fits(v: Vehicle, passengers: number, bags: number): boolean {
  return v.passengers >= passengers && v.bags >= bags;
}
