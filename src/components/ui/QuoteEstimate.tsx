'use client';
import { Calculator } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import type { Estimate } from '@/lib/pricing';

/**
 * Live price estimate shown in the booking flow. Updates as the visitor
 * fills the form; announces changes politely for screen readers.
 */
export default function QuoteEstimate({
  estimate,
  className = '',
}: {
  estimate: Estimate;
  className?: string;
}) {
  const t = useTranslation();
  const q = t.quote;
  const perHour = t.fleetCard.perHour;

  let value: React.ReactNode = null;
  let note: string | null = null;
  let showDisclaimer = false;

  switch (estimate.kind) {
    case 'incomplete':
      note = q.incomplete;
      break;
    case 'hourly':
      showDisclaimer = true;
      value = `€${estimate.amount}`;
      note = `${estimate.hours} × €${estimate.rate}${perHour}`;
      break;
    case 'hourly-rate':
      value = (
        <>
          <span className="mr-1.5 font-sans text-sm font-medium text-muted">{t.fleetCard.from}</span>€{estimate.rate}
          <span className="font-sans text-sm text-muted">{perHour}</span>
        </>
      );
      break;
    case 'fixed':
      showDisclaimer = true;
      value = `€${estimate.amount}`;
      note = q.fixedMalpensa;
      break;
    case 'on-request':
      note = estimate.reason === 'bus' ? q.busNote : q.customNote;
      break;
  }

  return (
    <div aria-live="polite" className={`rounded-2xl border border-line bg-ivory px-5 py-4 ${className}`.trim()}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-deep">
            <Calculator size={14} aria-hidden />
            {q.estimate}
          </p>
          {note && <p className="mt-1.5 text-sm text-muted">{note}</p>}
        </div>
        {value && <p className="shrink-0 font-display text-[2rem] leading-none text-ink tabular">{value}</p>}
      </div>
      {showDisclaimer && <p className="mt-2.5 text-xs leading-snug text-faint">{q.disclaimer}</p>}
    </div>
  );
}
