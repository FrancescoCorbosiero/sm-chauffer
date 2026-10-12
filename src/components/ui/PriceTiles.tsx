'use client';
import Link from 'next/link';
import { ArrowRight, Clock, Plane, Users } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import { vehicles } from '@/lib/data';
import { FIXED_FARES } from '@/lib/pricing';
import { bookingHref } from '@/lib/booking';

const hourlyFrom = Math.min(...vehicles.filter((v) => !v.priceOnRequest).map((v) => v.pricePerHour));

/**
 * The three ways a ride is priced (fixed Malpensa fare, hourly, groups),
 * each linking to the booking wizard. Light tone for ivory sections, dark
 * tone for ink heroes.
 */
export default function PriceTiles({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const t = useTranslation();
  const p = t.pricingTeaser;
  const fc = t.fleetCard;
  const dark = tone === 'dark';

  const tiles = [
    {
      icon: Plane,
      label: p.malpensaLabel,
      value: `€${FIXED_FARES.milanoMalpensa}`,
      note: p.malpensaNote,
      href: bookingHref({ type: 'airport-transfer', to: 'Aeroporto di Milano Malpensa (MXP)' }),
      featured: true,
    },
    {
      icon: Clock,
      label: p.hourlyLabel,
      value: `€${hourlyFrom}`,
      prefix: fc.from,
      suffix: fc.perHour,
      note: p.hourlyNote,
      href: bookingHref({ type: 'hourly' }),
    },
    {
      icon: Users,
      label: p.groupsLabel,
      value: p.groupsValue,
      note: p.groupsNote,
      href: bookingHref({ car: 'mercedes-v-class' }),
    },
  ];

  return (
    <div className="reveal-stagger grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
      {tiles.map((tile, i) => {
        const Icon = tile.icon;
        const onInk = dark || tile.featured;
        const surface = tile.featured
          ? dark
            ? 'border-gold/45 bg-gold/[0.07] text-white'
            : 'ink-panel border-transparent text-white'
          : dark
            ? 'border-white/10 bg-white/[0.035] text-white'
            : 'border-line bg-white text-ink';
        return (
          <Link
            key={tile.label}
            href={tile.href}
            style={{ ['--i' as string]: i }}
            className={`group relative flex flex-col overflow-clip rounded-2xl border p-7 transition-[transform,box-shadow,border-color] duration-500 ease-smooth hover:-translate-y-1 ${
              dark ? 'hover:border-gold/60' : 'hover:shadow-lg'
            } ${surface}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${onInk ? 'text-white/80' : 'text-muted'}`}>{tile.label}</span>
              <Icon size={20} aria-hidden className={onInk ? 'text-gold' : 'text-gold-deep'} />
            </div>
            <p className="mt-6 flex items-baseline gap-1.5">
              {tile.prefix && <span className={`text-sm ${onInk ? 'text-white/60' : 'text-muted'}`}>{tile.prefix}</span>}
              <span
                className={`font-display text-[3.2rem] leading-none tabular ${
                  tile.featured ? 'text-gold-light' : onInk ? 'text-white' : 'text-ink'
                }`}
              >
                {tile.value}
              </span>
              {tile.suffix && <span className={`text-base ${onInk ? 'text-white/60' : 'text-muted'}`}>{tile.suffix}</span>}
            </p>
            <p className={`mt-4 text-[15px] leading-relaxed ${onInk ? 'text-white/70' : 'text-muted'}`}>{tile.note}</p>
            <span
              className={`mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold ${
                tile.featured ? 'text-gold-light' : onInk ? 'text-white' : 'text-ink'
              }`}
            >
              {t.actions.quote}
              <ArrowRight size={15} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
