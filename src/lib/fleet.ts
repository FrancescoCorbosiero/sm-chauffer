import type { CSSProperties } from 'react';
import type { Dictionary } from '@/i18n/types';
import { vehicles } from './data';
import { FLEET_PHOTOS } from './fleetPhotos';
import type { Vehicle, VehicleCategory } from './types';

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

/** Relative size on a shared stage: a van reads bigger than a saloon. */
const STAGE_SCALE: Record<VehicleCategory, number> = { berlina: 1, suv: 1, van: 1.05, bus: 1.2 };

/**
 * CSS custom properties that frame a vehicle photo inside a `.car-stage`
 * (globals.css): whatever the photo's margins, the car spans `--car-w` of the
 * stage width (times its relative size, at most `--car-h` of its height),
 * centred, tyres on the `--floor` line. The measurements come from
 * scripts/prepare-fleet-photos.mjs.
 */
export function carFrameStyle(v: Vehicle, { sized = true } = {}): CSSProperties {
  const photo = FLEET_PHOTOS[v.image];
  const [x0, y0, x1, y1] = photo?.box ?? [0.05, 0.1, 0.95, 0.9];
  return {
    '--x0': x0,
    '--bw': x1 - x0,
    '--bh': y1 - y0,
    '--y1': y1,
    '--ar': photo ? photo.height / photo.width : 0.75,
    '--s': sized ? STAGE_SCALE[v.category] : 1,
  } as CSSProperties;
}
