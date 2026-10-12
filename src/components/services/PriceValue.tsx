'use client';
import { useTranslation } from '@/i18n/LanguageProvider';
import type { Dictionary } from '@/i18n/types';
import type { ServicePrice } from '@/lib/servicePages';

/** A service fare as display text: "€150", "da €70/h" or "Su preventivo". */
export default function PriceValue({ price, className = '' }: { price: ServicePrice; className?: string }) {
  const t = useTranslation();
  const fc = t.fleetCard;
  if (price.kind === 'quote') return <span className={className}>{fc.onRequest}</span>;
  if (price.kind === 'fixed') return <span className={`tabular ${className}`}>€{price.amount}</span>;
  return (
    <span className={`tabular ${className}`}>
      <span className="mr-1.5 align-middle font-sans text-[0.4em] font-semibold uppercase tracking-[0.14em] opacity-70">
        {fc.from}
      </span>
      €{price.from}
      <span className="font-sans text-[0.45em] opacity-70">{fc.perHour}</span>
    </span>
  );
}

/** One-line explanation that goes with the fare. */
export function priceCaption(price: ServicePrice, t: Dictionary): string {
  if (price.kind === 'fixed') return t.quote.fixedMalpensa;
  if (price.kind === 'hourly') return t.serviceDetail.hourlyLabel;
  return t.serviceDetail.quoteLabel;
}
