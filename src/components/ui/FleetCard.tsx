'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Briefcase, ArrowUpRight } from 'lucide-react';
import { Vehicle } from '@/lib/types';
import { useTranslation } from '@/i18n/LanguageProvider';
import TiltCard from './TiltCard';

export default function FleetCard({ vehicle }: { vehicle: Vehicle }) {
  const t = useTranslation();
  const v = t.vehicles[vehicle.id] ?? { description: '' };
  const categoryLabel = t.fleetCard.categories[vehicle.category];

  return (
    <TiltCard intensity={5} className="h-full">
      <article className="group relative flex flex-col h-full bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.10)] hover:border-[var(--color-ink)]/15">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(255,168,6,0.10),transparent_50%)]"
        />
        <div className="relative aspect-[5/4] w-full overflow-hidden bg-[var(--color-surface-2)]">
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
          {v.badge && (
            <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[var(--color-ink)] text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-full font-medium border border-[var(--color-border)]">
              {v.badge}
            </span>
          )}
        </div>

        <div className="p-6 flex flex-col flex-1 relative">
          <div className="flex items-baseline justify-between gap-4 mb-3">
            <h3 className="text-xl font-medium leading-tight">{vehicle.name}</h3>
            <span className="text-[10px] text-[var(--color-text-faint)] uppercase tracking-[0.2em] whitespace-nowrap">
              {categoryLabel}
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs text-[var(--color-text-muted)] mb-4">
            <span className="inline-flex items-center gap-1.5">
              <Users size={14} aria-hidden /> {vehicle.passengers} {t.fleetCard.pax}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase size={14} aria-hidden /> {vehicle.bags} {t.fleetCard.bag}
            </span>
          </div>

          <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-6 flex-1">
            {v.description}
          </p>

          <div className="flex items-center justify-between gap-4 pt-5 border-t border-[var(--color-divider)]">
            <div>
              <div className="text-[10px] text-[var(--color-text-faint)] uppercase tracking-[0.22em]">
                {t.fleetCard.from}
              </div>
              {vehicle.priceOnRequest ? (
                <div className="text-[var(--color-ink)] text-lg font-medium">
                  {t.fleetCard.onRequest}
                </div>
              ) : (
                <div className="text-[var(--color-ink)] text-lg font-medium">
                  €{vehicle.pricePerHour}
                  <span className="text-xs text-[var(--color-text-muted)] font-normal">
                    {t.fleetCard.perHour}
                  </span>
                </div>
              )}
            </div>
            <Link
              href={`/contact?car=${vehicle.id}`}
              className="group/cta inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[var(--color-ink)] hover:text-[var(--color-text-muted)] transition-colors"
            >
              {t.fleetCard.book}
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
