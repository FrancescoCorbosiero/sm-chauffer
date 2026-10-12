'use client';
import Link from 'next/link';
import { ArrowRight, Clock, Plane, Users } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import SectionHeading from '@/components/ui/SectionHeading';
import { vehicles } from '@/lib/data';
import { FIXED_FARES } from '@/lib/pricing';
import { bookingHref } from '@/lib/booking';

const hourlyFrom = Math.min(...vehicles.filter((v) => !v.priceOnRequest).map((v) => v.pricePerHour));

export default function PricingTeaser() {
  const t = useTranslation();
  const p = t.pricingTeaser;
  const fc = t.fleetCard;

  const tiles = [
    {
      icon: Plane,
      label: p.malpensaLabel,
      value: `€${FIXED_FARES.milanoMalpensa}`,
      suffix: '',
      note: p.malpensaNote,
      href: bookingHref({ type: 'airport-transfer', to: 'Aeroporto di Milano Malpensa (MXP)' }),
      featured: true,
    },
    {
      icon: Clock,
      label: p.hourlyLabel,
      value: `€${hourlyFrom}`,
      suffix: fc.perHour,
      prefix: fc.from,
      note: p.hourlyNote,
      href: bookingHref({ type: 'hourly' }),
    },
    {
      icon: Users,
      label: p.groupsLabel,
      value: p.groupsValue,
      suffix: '',
      note: p.groupsNote,
      href: bookingHref({ car: 'mercedes-v-class' }),
    },
  ];

  return (
    <section className="section-y bg-ivory">
      <div className="container-x">
        <SectionHeading
          className="reveal"
          eyebrow={p.label}
          title={p.title}
          accent={p.accent}
          description={p.description}
          action={
            <Link href="/pricing" className="link-arrow">
              {p.cta}
              <ArrowRight size={16} aria-hidden />
            </Link>
          }
        />
        <div className="reveal-stagger mt-12 grid gap-4 md:grid-cols-3 lg:mt-14 lg:gap-6">
          {tiles.map((tile, i) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.label}
                href={tile.href}
                style={{ ['--i' as string]: i }}
                className={`group relative flex flex-col overflow-clip rounded-2xl border p-7 transition-[transform,box-shadow] duration-500 ease-smooth hover:-translate-y-1 hover:shadow-lg ${
                  tile.featured ? 'ink-panel border-transparent text-white' : 'border-line bg-white text-ink'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${tile.featured ? 'text-white/80' : 'text-muted'}`}>
                    {tile.label}
                  </span>
                  <Icon size={20} aria-hidden className={tile.featured ? 'text-gold' : 'text-gold-deep'} />
                </div>
                <p className="mt-6 flex items-baseline gap-1.5">
                  {tile.prefix && (
                    <span className={`text-sm ${tile.featured ? 'text-white/60' : 'text-muted'}`}>{tile.prefix}</span>
                  )}
                  <span
                    className={`font-display text-[3.2rem] leading-none tabular ${
                      tile.featured ? 'text-gold-light' : 'text-ink'
                    }`}
                  >
                    {tile.value}
                  </span>
                  {tile.suffix && (
                    <span className={`text-base ${tile.featured ? 'text-white/60' : 'text-muted'}`}>{tile.suffix}</span>
                  )}
                </p>
                <p className={`mt-4 text-[15px] leading-relaxed ${tile.featured ? 'text-white/70' : 'text-muted'}`}>
                  {tile.note}
                </p>
                <span
                  className={`mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold ${
                    tile.featured ? 'text-gold-light' : 'text-ink'
                  }`}
                >
                  {t.actions.quote}
                  <ArrowRight
                    size={15}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            );
          })}
        </div>
        <p className="mt-6 text-[13px] text-muted">{t.quote.disclaimer}</p>
      </div>
    </section>
  );
}
