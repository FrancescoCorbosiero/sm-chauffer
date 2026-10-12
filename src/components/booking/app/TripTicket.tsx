'use client';

import Image from 'next/image';
import { Baby, Briefcase, CarFront, Plane, Users } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import { carFrameStyle, vehicleName } from '@/lib/fleet';
import type { Vehicle } from '@/lib/types';

export interface TicketEnd {
  /** Big label: a place name or IATA code. */
  title: string;
  /** What was typed / chosen. */
  detail: string;
}

/** What was typed under the place name; kept as a blank line when it only repeats it. */
function Detail({ end }: { end: TicketEnd }) {
  const same = end.detail.trim().toLowerCase() === end.title.trim().toLowerCase();
  return (
    <p aria-hidden={same || undefined} className={`mt-1.5 truncate text-[12.5px] leading-snug text-muted ${same ? 'invisible' : ''}`}>
      {same ? '–' : end.detail}
    </p>
  );
}

/**
 * The review as a boarding pass: route on top, the car under the
 * perforation. Purely presentational; the booking flow computes the values.
 */
export default function TripTicket({
  kicker,
  from,
  to,
  dateLabel,
  time,
  arrival,
  durationLabel,
  vehicle,
  pax,
  bags,
  childSeat,
  flight,
  estimate,
}: {
  kicker: string;
  from: TicketEnd;
  /** Null for hourly service (durationLabel is shown instead). */
  to: TicketEnd | null;
  dateLabel: string;
  time: string;
  arrival?: string | null;
  durationLabel?: string | null;
  vehicle: Vehicle | null;
  pax: number;
  bags: number;
  childSeat: boolean;
  flight?: string;
  estimate?: string | null;
}) {
  const t = useTranslation();
  const b = t.booking;

  return (
    <div className="ticket relative rounded-3xl bg-white text-ink">
      <div className="px-5 pb-5 pt-4">
        <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          <span className="truncate">{kicker}</span>
          <span className="shrink-0 tabular">{dateLabel}</span>
        </div>

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-3">
          <div className="min-w-0">
            <p className="ticket-place">{from.title}</p>
            <Detail end={from} />
            <p className="mt-2 text-[15px] font-semibold tabular">{time}</p>
          </div>
          <div aria-hidden className="flex w-16 flex-col items-center pt-2.5 text-ink">
            <div className="relative flex w-full items-center">
              <span className="h-1.5 w-1.5 rounded-full border border-ink" />
              <span className="mx-1 h-px flex-1 border-t border-dashed border-ink/40" />
              <span className="h-1.5 w-1.5 rounded-[2px] bg-ink" />
            </div>
            <CarFront size={16} className="mt-1.5" />
          </div>
          <div className="min-w-0 text-right">
            {to ? (
              <>
                <p className="ticket-place">{to.title}</p>
                <Detail end={to} />
                {arrival && <p className="mt-2 text-[15px] font-semibold text-muted tabular">≈ {arrival}</p>}
              </>
            ) : (
              <>
                <p className="ticket-place">{durationLabel}</p>
                <p className="mt-1.5 truncate text-[12.5px] leading-snug text-muted">{b.atDisposal}</p>
                {arrival && <p className="mt-2 text-[15px] font-semibold text-muted tabular">{arrival}</p>}
              </>
            )}
          </div>
        </div>

        {flight && (
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ivory px-3 py-1 text-[12.5px] font-semibold">
            <Plane size={13} aria-hidden />
            {flight}
          </p>
        )}
      </div>

      {/* Perforation */}
      <div aria-hidden className="ticket-tear relative h-5">
        <span className="absolute inset-x-5 top-1/2 border-t-2 border-dotted border-ink/15" />
      </div>

      <div className="flex items-center gap-4 px-5 pb-5 pt-3">
        {vehicle && (
          <span aria-hidden className="car-stage relative h-[4.25rem] w-[6.75rem] shrink-0 overflow-clip rounded-2xl bg-ivory [--car-w:0.84] [--floor:0.9]">
            <span className="car-frame" style={carFrameStyle(vehicle, { sized: false })}>
              <Image src={vehicle.image} alt="" width={240} height={160} sizes="160px" className="mix-blend-multiply" />
            </span>
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15.5px] font-semibold">{vehicle ? vehicleName(vehicle, t) : '—'}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] text-muted">
            <span className="inline-flex items-center gap-1">
              <Users size={13} aria-hidden /> {pax}
            </span>
            <span className="inline-flex items-center gap-1">
              <Briefcase size={13} aria-hidden /> {bags}
            </span>
            {childSeat && (
              <span className="inline-flex items-center gap-1">
                <Baby size={13} aria-hidden /> {t.wizard.childSeatShort}
              </span>
            )}
          </p>
        </div>
        {estimate && (
          <div className="shrink-0 text-right">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">{b.estimateShort}</p>
            <p className="mt-1 font-display text-[1.6rem] leading-none tabular">{estimate}</p>
          </div>
        )}
      </div>
    </div>
  );
}
