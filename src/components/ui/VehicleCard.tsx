'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Briefcase, Users } from 'lucide-react';
import type { Vehicle } from '@/lib/types';
import { useTranslation } from '@/i18n/LanguageProvider';
import { bookingHref } from '@/lib/booking';

export default function VehicleCard({ vehicle, priority = false }: { vehicle: Vehicle; priority?: boolean }) {
  const t = useTranslation();
  const copy = t.vehicles[vehicle.id] ?? { description: '' };
  const fc = t.fleetCard;
  const href = `/fleet/${vehicle.id}`;

  return (
    <article className="card card-hover gold-edge group relative flex h-full flex-col overflow-clip">
      <div className="relative aspect-[16/10] bg-white">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-5 transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
        />
        {copy.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
            {copy.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col border-t border-line p-6">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-deep">
          {fc.categories[vehicle.category]}
        </span>
        <h3 className="mt-1.5 text-[1.6rem] leading-tight text-ink">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {vehicle.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted">{copy.description}</p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink">
          <li className="inline-flex items-center gap-1.5">
            <Users size={16} aria-hidden className="text-gold-deep" />
            {fc.seats.replace('{n}', String(vehicle.passengers))}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Briefcase size={16} aria-hidden className="text-gold-deep" />
            {fc.luggage.replace('{n}', String(vehicle.bags))}
          </li>
        </ul>
        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <span className="block text-xs font-medium text-muted">{fc.from}</span>
            {vehicle.priceOnRequest ? (
              <span className="text-lg font-semibold text-ink">{fc.onRequest}</span>
            ) : (
              <span className="font-display text-[2rem] leading-none text-ink tabular">
                €{vehicle.pricePerHour}
                <span className="font-sans text-sm text-muted">{fc.perHour}</span>
              </span>
            )}
          </div>
          <Link
            href={bookingHref({ car: vehicle.id })}
            className="btn btn-primary btn-sm relative z-[1]"
            aria-label={`${t.actions.book} — ${vehicle.name}`}
          >
            {t.actions.book}
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
