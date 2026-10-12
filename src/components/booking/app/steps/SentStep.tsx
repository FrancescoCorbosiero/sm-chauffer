'use client';

import type { Ref } from 'react';
import TripTicket from '../TripTicket';
import type { BookingForm } from '../useBookingForm';

/** After sending: the tick draws itself, then what happens next and the trip. */
export default function SentStep({
  form,
  title,
  titleRef,
}: {
  form: BookingForm;
  title: string;
  /** Focus lands here once the request is out. */
  titleRef: Ref<HTMLHeadingElement>;
}) {
  const b = form.t.booking;
  const body = form.sent === 'email' ? b.sentEmailBody : form.sent === 'whatsapp' ? b.sentWhatsAppBody : b.sentMailtoBody;

  return (
    <div className="flex flex-col items-center px-2 pb-4 pt-6 text-center" aria-live="polite">
      <svg viewBox="0 0 72 72" className="h-20 w-20" aria-hidden>
        <circle cx="36" cy="36" r="33" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-ink/12" />
        <circle
          cx="36"
          cy="36"
          r="33"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          pathLength={1}
          className="sent-ring text-ink"
        />
        <path
          d="M23 37.5l8.5 8.5L50 27.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          className="sent-tick text-ink"
        />
      </svg>
      <h3 ref={titleRef} tabIndex={-1} className="mt-6 text-[2.1rem] leading-tight text-ink outline-none">
        {title}
      </h3>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">{body}</p>
      <div className="mt-7 w-full max-w-sm text-left">
        <TripTicket {...form.ticket} />
      </div>
    </div>
  );
}
