'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/i18n/LanguageProvider';
import { vehicles } from '@/lib/data';
import { bookingHref, type BookingDraft } from '@/lib/booking';
import { vehicleName } from '@/lib/fleet';

/**
 * The fleet as a table: capacity and hourly rate per vehicle, with a book
 * link per row. Scrolls sideways on phones with the vehicle column pinned.
 * Used for the comparison on /fleet and the rate card on /pricing.
 */
export default function FleetTable({
  label,
  showIdeal = true,
  booking,
}: {
  /** Accessible name of the scroll region. */
  label: string;
  showIdeal?: boolean;
  /** Extra booking fields for the row links (e.g. hourly service). */
  booking?: Partial<BookingDraft>;
}) {
  const t = useTranslation();
  const f = t.fleetPage;
  const fc = t.fleetCard;

  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="relative overflow-x-auto rounded-2xl border border-line bg-white"
    >
      <table className={`w-full border-collapse text-left text-[15px] ${showIdeal ? 'min-w-[50rem]' : 'min-w-[36rem]'}`}>
        <thead>
          <tr className="whitespace-nowrap border-b border-line text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            <th scope="col" className="sticky left-0 z-[1] bg-white px-5 py-4 font-semibold">
              {f.colVehicle}
            </th>
            <th scope="col" className="px-4 py-4 font-semibold">{f.colCategory}</th>
            <th scope="col" className="px-4 py-4 font-semibold">{f.colSeats}</th>
            <th scope="col" className="px-4 py-4 font-semibold">{f.colBags}</th>
            <th scope="col" className="px-4 py-4 font-semibold">{f.colRate}</th>
            {showIdeal && <th scope="col" className="px-4 py-4 font-semibold">{f.colIdeal}</th>}
            <th scope="col" className="px-5 py-4">
              <span className="sr-only">{t.actions.book}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => {
            const name = vehicleName(v, t);
            return (
              <tr key={v.id} className="border-b border-line last:border-0">
                <th scope="row" className="sticky left-0 z-[1] bg-white px-5 py-3.5 font-semibold text-ink">
                  <Link href={`/fleet/${v.id}`} className="flex items-center gap-3 hover:text-gold-deep">
                    <span className="relative hidden h-10 w-16 shrink-0 sm:block">
                      <Image src={v.image} alt="" fill sizes="64px" className="object-contain" />
                    </span>
                    <span className="whitespace-nowrap">{name}</span>
                  </Link>
                </th>
                <td className="px-4 py-3.5 text-muted">{fc.categories[v.category]}</td>
                <td className="px-4 py-3.5 text-ink tabular">{v.passengers}</td>
                <td className="px-4 py-3.5 text-ink tabular">{v.bags}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-ink">
                  {v.priceOnRequest ? (
                    fc.onRequest
                  ) : (
                    <span className="font-semibold tabular">
                      €{v.pricePerHour}
                      <span className="font-normal text-muted">{fc.perHour}</span>
                    </span>
                  )}
                </td>
                {showIdeal && (
                  <td className="min-w-[15rem] px-4 py-3.5 text-sm leading-snug text-muted">
                    {t.vehicles[v.id]?.ideal.join(' · ')}
                  </td>
                )}
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href={bookingHref({ ...booking, car: v.id })}
                    className="btn btn-outline btn-sm"
                    aria-label={`${t.actions.book} — ${name}`}
                  >
                    {t.actions.book}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
