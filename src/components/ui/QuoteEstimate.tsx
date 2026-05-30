'use client';
import { useTranslation } from '@/i18n/LanguageProvider';
import type { Estimate } from '@/lib/pricing';

/**
 * Live price estimate shown under the booking/contact forms. Updates as the
 * user fills the form; announces changes politely for screen readers.
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

  const label = (
    <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-faint)]">
      {q.estimate}
    </div>
  );

  let body: React.ReactNode;
  let showDisclaimer = false;

  switch (estimate.kind) {
    case 'incomplete':
      body = <span className="text-sm text-[var(--color-text-muted)]">{q.incomplete}</span>;
      break;
    case 'hourly':
      showDisclaimer = true;
      body = (
        <div className="flex items-baseline justify-between gap-3">
          <div>
            {label}
            <span className="text-2xl font-medium text-[var(--color-ink)]">€{estimate.amount}</span>
          </div>
          <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">
            {estimate.hours} × €{estimate.rate}
            {perHour}
          </span>
        </div>
      );
      break;
    case 'hourly-rate':
      body = (
        <div className="flex items-baseline justify-between gap-3">
          {label}
          <span className="text-lg font-medium text-[var(--color-ink)]">
            {t.fleetCard.from} €{estimate.rate}
            {perHour}
          </span>
        </div>
      );
      break;
    case 'fixed':
      showDisclaimer = true;
      body = (
        <div className="flex items-baseline justify-between gap-3">
          <div>
            {label}
            <span className="text-2xl font-medium text-[var(--color-ink)]">€{estimate.amount}</span>
          </div>
          <span className="text-xs text-[var(--color-text-muted)] text-right">{q.fixedMalpensa}</span>
        </div>
      );
      break;
    case 'on-request':
      body = (
        <div className="flex items-baseline justify-between gap-3">
          {label}
          <span className="text-sm font-medium text-[var(--color-ink)] text-right">
            {estimate.reason === 'bus' ? q.busNote : q.customNote}
          </span>
        </div>
      );
      break;
  }

  return (
    <div
      aria-live="polite"
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 ${className}`}
    >
      {body}
      {showDisclaimer && (
        <p className="mt-1.5 text-[11px] leading-snug text-[var(--color-text-faint)]">
          {q.disclaimer}
        </p>
      )}
    </div>
  );
}
