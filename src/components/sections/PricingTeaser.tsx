'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import { vehicles } from '@/lib/data';
import { FIXED_FARES } from '@/lib/pricing';
import { bookingHref } from '@/lib/booking';

const hourlyFrom = Math.min(...vehicles.filter((v) => !v.priceOnRequest).map((v) => v.pricePerHour));

/** Prices as a short rate card: one line per way of pricing a ride. */
export default function PricingTeaser() {
  const t = useTranslation();
  const p = t.pricingTeaser;
  const fc = t.fleetCard;

  const rows = [
    {
      label: p.malpensaLabel,
      note: p.malpensaNote,
      value: `€${FIXED_FARES.milanoMalpensa}`,
      href: bookingHref({ type: 'airport-transfer', to: 'Aeroporto di Milano Malpensa (MXP)' }),
    },
    {
      label: p.hourlyLabel,
      note: p.hourlyNote,
      prefix: fc.from,
      value: `€${hourlyFrom}`,
      suffix: fc.perHour,
      href: bookingHref({ type: 'hourly' }),
    },
    {
      label: p.groupsLabel,
      note: p.groupsNote,
      value: p.groupsValue,
      href: bookingHref({ car: 'mercedes-v-class' }),
    },
  ];

  return (
    <section className="section-y bg-ivory">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="reveal min-w-0 lg:col-span-5">
          <p className="eyebrow">{p.label}</p>
          <h2 className="mt-4 text-4xl text-ink">
            {p.title} {p.accent}
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">{p.description}</p>
          <Link href="/pricing" className="btn btn-primary mt-8">
            {p.cta}
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>

        <ul className="reveal min-w-0 lg:col-span-7">
          {rows.map((r) => (
            <li key={r.label} className="border-t border-ink first:border-t-2">
              <Link href={r.href} className="group grid grid-cols-[1fr_auto] items-center gap-6 py-7">
                <span className="min-w-0">
                  <span className="block text-lg font-semibold text-ink">{r.label}</span>
                  <span className="mt-1.5 block text-[15px] leading-relaxed text-muted">{r.note}</span>
                </span>
                <span className="whitespace-nowrap text-right font-display text-[2.6rem] leading-none text-ink tabular sm:text-[3.2rem]">
                  {r.prefix && <span className="mr-2 font-sans text-sm text-muted">{r.prefix}</span>}
                  {r.value}
                  {r.suffix && <span className="font-sans text-base text-muted">{r.suffix}</span>}
                </span>
              </Link>
            </li>
          ))}
          <li className="border-t border-line pt-4 text-[13px] text-muted">{t.quote.disclaimer}</li>
        </ul>
      </div>
    </section>
  );
}
