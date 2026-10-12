'use client';

import { Check, Pencil } from 'lucide-react';
import TurnstileWidget from '@/components/security/TurnstileWidget';
import TripTicket from '../TripTicket';
import type { BookingForm } from '../useBookingForm';

/** Step 4: the boarding pass, the contact details, then WhatsApp or email (footer). */
export default function ReviewStep({ form }: { form: BookingForm }) {
  const { t, draft, est } = form;
  const w = t.wizard;

  const row = (label: string, value: string) =>
    value ? (
      <div className="flex justify-between gap-4 px-4 py-3 text-[15px]">
        <dt className="text-muted">{label}</dt>
        <dd className="min-w-0 break-words text-right font-medium text-ink">{value}</dd>
      </div>
    ) : null;

  return (
    <div className="grid gap-4">
      <div>
        <TripTicket {...form.ticket} />
        <div className="mt-2 flex justify-end gap-1">
          <button type="button" onClick={() => form.goTo(0)} className="review-edit">
            <Pencil size={12} aria-hidden />
            {w.steps.trip}
          </button>
          <button type="button" onClick={() => form.goTo(1)} className="review-edit">
            <Pencil size={12} aria-hidden />
            {w.steps.vehicle}
          </button>
        </div>
      </div>

      <div className="overflow-clip rounded-3xl bg-white">
        <div className="flex items-center justify-between px-4 pb-1 pt-3.5">
          <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{w.steps.details}</h4>
          <button type="button" onClick={() => form.goTo(2)} className="review-edit">
            <Pencil size={12} aria-hidden />
            {w.edit}
          </button>
        </div>
        <dl className="divide-y divide-line">
          {row(t.contactPage.name, draft.name)}
          {row(t.contactPage.phone, draft.phone)}
          {row(t.contactPage.email, draft.email)}
          {row(t.contactPage.form.additionalNotes, draft.notes)}
        </dl>
      </div>

      {(est.kind === 'hourly' || est.kind === 'fixed') && <p className="px-1 text-[12px] text-faint">{t.quote.disclaimer}</p>}
      <p className="flex items-start gap-2 px-1 text-[13px] leading-relaxed text-muted">
        <Check size={15} aria-hidden className="mt-0.5 shrink-0 text-ink" />
        {w.reviewNote}
      </p>
      <TurnstileWidget onVerify={form.onTurnstile} />
    </div>
  );
}
