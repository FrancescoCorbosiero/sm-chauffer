'use client';

import Image from 'next/image';
import { Briefcase, Check, Users } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import { vehicles } from '@/lib/data';
import { carFrameStyle, fits, vehicleName } from '@/lib/fleet';
import type { Estimate } from '@/lib/pricing';
import type { Vehicle } from '@/lib/types';

/**
 * "Choose your ride", the way ride apps list it: the car, what fits in it,
 * and the price for this very trip on the right. Cars too small for the
 * party stay visible, dimmed, with the reason.
 */
export default function VehicleOptions({
  value,
  pax,
  bags,
  priceFor,
  onChange,
  error,
}: {
  value: string;
  pax: number;
  bags: number;
  priceFor: (v: Vehicle) => Estimate;
  onChange: (id: string) => void;
  error?: string;
}) {
  const t = useTranslation();
  const b = t.booking;
  const fc = t.fleetCard;

  /** The price for this trip: a total when it can be computed, else the hourly rate. */
  const price = (v: Vehicle): { main: string; unit?: string; note?: string } => {
    if (v.priceOnRequest) return { main: fc.onRequest };
    const e = priceFor(v);
    if (e.kind === 'hourly') return { main: `€${e.amount}`, note: `${e.hours} h × €${e.rate}` };
    if (e.kind === 'fixed') return { main: `€${e.amount}`, note: b.priceFixed };
    return { main: `€${v.pricePerHour}`, unit: fc.perHour };
  };

  return (
    <div>
      <ul role="radiogroup" aria-label={t.wizard.vehiclePick} className="flex flex-col gap-2.5" data-field="car" tabIndex={-1}>
        {vehicles.map((v) => {
          const selected = value === v.id;
          const ok = fits(v, pax, bags);
          const p = price(v);
          const name = vehicleName(v, t);
          return (
            <li key={v.id}>
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(v.id)}
                className={`relative flex w-full items-center gap-3 rounded-3xl bg-white p-2.5 pr-4 text-left transition-[box-shadow,opacity] duration-200 active:scale-[0.99] ${
                  selected ? 'shadow-[0_0_0_2px_var(--color-ink)]' : 'shadow-[0_0_0_1px_rgba(12,12,14,0.06)]'
                } ${ok ? '' : 'opacity-50'}`}
              >
                <span
                  className="car-stage relative h-16 w-[6.5rem] shrink-0 overflow-clip rounded-2xl bg-ivory [--car-w:0.84] [--floor:0.9]"
                  aria-hidden
                >
                  <span className="car-frame" style={carFrameStyle(v, { sized: false })}>
                    <Image src={v.image} alt="" width={240} height={160} sizes="160px" className="mix-blend-multiply" />
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold leading-snug text-ink">{name}</span>
                  <span className="mt-1 flex items-center gap-2.5 text-[13px] text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Users size={13} aria-hidden /> {v.passengers}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Briefcase size={13} aria-hidden /> {v.bags}
                    </span>
                  </span>
                  {!ok && (
                    <span className="mt-1 block text-[12px] font-medium text-[#b42318]">
                      {t.wizard.capacityMax.replace('{n}', String(v.passengers))}
                    </span>
                  )}
                </span>
                <span className="shrink-0 self-start pt-1 text-right">
                  <span
                    className={`block whitespace-nowrap leading-none text-ink tabular ${
                      p.main.startsWith('€') ? 'font-display text-[1.45rem]' : 'pt-1 text-[13px] font-semibold'
                    }`}
                  >
                    {p.main}
                    {p.unit && <span className="font-sans text-[12px] text-muted">{p.unit}</span>}
                  </span>
                  {p.note && <span className="mt-1 block text-[11.5px] text-muted">{p.note}</span>}
                </span>
                {selected && (
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white ring-[3px] ring-ivory">
                    <Check size={13} aria-hidden strokeWidth={3} />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      {error && (
        <p role="alert" className="mt-2.5 px-1 text-[13px] font-medium text-[#b42318]">
          {error}
        </p>
      )}
    </div>
  );
}
