'use client';

import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Mail, RotateCcw, Timer, X } from 'lucide-react';
import { Button, Preloader } from 'konsta/react';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { vehicleName } from '@/lib/fleet';
import type { BookingDraft } from '@/lib/booking';
import { STEP_COUNT, type Step } from './draft';
import { useBookingForm } from './useBookingForm';
import TripMap from './TripMap';
import TripStep from './steps/TripStep';
import VehicleStep from './steps/VehicleStep';
import DetailsStep from './steps/DetailsStep';
import ReviewStep from './steps/ReviewStep';
import SentStep from './steps/SentStep';

export interface FlowParts {
  header: ReactNode;
  body: ReactNode;
  footer: ReactNode;
  /** The live trip (map + car + estimate), for a side column on wide screens. */
  preview: ReactNode;
}

const STEP_KEYS = ['trip', 'vehicle', 'details', 'review'] as const;

/**
 * The booking app: trip → vehicle → contact details → review, then the
 * request goes out on WhatsApp or by email with the same payload as before
 * (so /api/quote, the operator email and the customer confirmation are
 * unchanged). Built from Konsta UI's iOS components; the rules live in
 * useBookingForm, each step in steps/.
 *
 * It renders nothing by itself: the host (bottom sheet on phones, side
 * drawer on desktop, inline card on /contact) receives the header, the
 * scrolling body and the action bar as separate parts and lays them out.
 */
export default function BookingFlow({
  variant,
  handoff,
  mapInBody = true,
  onClose,
  children,
}: {
  variant: 'sheet' | 'inline';
  /** Fields handed over by the link that opened the app; null before hydration. */
  handoff: Partial<BookingDraft> | null;
  /** Show the trip map inside the first step (false when the host shows `preview`). */
  mapInBody?: boolean;
  onClose?: () => void;
  children: (parts: FlowParts) => ReactNode;
}) {
  const { form, bodyRef, titleRef } = useBookingForm(handoff, variant);
  const { t, draft, step, sent, sending, isHourly, hours, vehicle, route, estimateValue } = form;
  const w = t.wizard;
  const b = t.booking;

  const stepLabels = STEP_KEYS.map((k) => w.steps[k]);
  const stepOf = w.stepOf.replace('{n}', String(step + 1)).replace('{total}', String(STEP_COUNT));
  const sentTitle = sent === 'email' ? t.quoteModal.sent : sent === 'whatsapp' ? b.sentWhatsAppTitle : b.sentMailtoTitle;

  const mapHint = !form.fromPlace
    ? draft.from.trim()
      ? b.mapCustom
      : b.mapEmpty
    : !isHourly && !draft.to.trim()
      ? b.mapAddTo
      : b.mapCustom;
  const map = (className: string) => (
    <TripMap from={form.fromPlace} to={form.toPlace} hourly={isHourly} hours={hours} hint={mapHint} className={className} />
  );

  /* ---------------- header: back, title, close, progress ---------------- */
  const progress = (
    <ol className="grid grid-cols-4 gap-1.5" aria-label={stepOf}>
      {stepLabels.map((label, i) => {
        const done = sent ? true : i < step;
        const current = !sent && i === step;
        return (
          <li key={label} className="min-w-0">
            <button
              type="button"
              disabled={Boolean(sent) || i >= step}
              onClick={() => form.goTo(i as Step)}
              aria-current={current ? 'step' : undefined}
              className="group flex w-full flex-col gap-1.5 text-left disabled:cursor-default"
            >
              <span className="relative h-[3px] w-full overflow-clip rounded-full bg-ink/10">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-ink transition-[width] duration-500 ease-smooth"
                  style={{ width: done || current ? '100%' : '0%' }}
                />
              </span>
              <span
                className={
                  variant === 'sheet'
                    ? 'sr-only'
                    : `truncate text-[12.5px] ${
                        current ? 'font-semibold text-ink' : done ? 'text-ink group-enabled:group-hover:underline' : 'text-muted'
                      }`
                }
              >
                {label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );

  const header =
    variant === 'sheet' ? (
      <div className="px-3 pb-3">
        <div className="flex h-12 items-center justify-between gap-2">
          {step > 0 && !sent ? (
            <button type="button" onClick={form.back} aria-label={w.back} className="flow-round-btn">
              <ArrowLeft size={19} aria-hidden />
            </button>
          ) : (
            <span className="w-10" />
          )}
          <div className="min-w-0 text-center">
            <p className="truncate text-[15px] font-semibold text-ink">{t.nav.bookNow}</p>
            <p className="text-[12px] text-muted">{sent ? sentTitle : `${stepLabels[step]} · ${stepOf}`}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t.quoteModal.close} className="flow-round-btn">
            <X size={19} aria-hidden />
          </button>
        </div>
        <div className="mt-2 px-1">{progress}</div>
      </div>
    ) : (
      <div className="px-5 pt-5 sm:px-7 sm:pt-7">{progress}</div>
    );

  /* ---------------- body: the current step ---------------- */
  const steps = [
    <TripStep key="trip" form={form} map={mapInBody ? map('aspect-[4/3] w-full rounded-3xl sm:aspect-[16/11]') : null} />,
    <VehicleStep key="vehicle" form={form} />,
    <DetailsStep key="details" form={form} />,
    <ReviewStep key="review" form={form} />,
  ];

  const body = (
    <div ref={bodyRef} className={variant === 'sheet' ? 'px-4 pb-6 pt-1' : 'px-5 pb-6 pt-6 sm:px-7'}>
      {/* Honeypot — bots fill it, humans never see it. Deliberately not named
          "company"/"organization": browser autofill fills those next to the
          contact fields, which would turn a real visitor into a "bot". */}
      <input
        type="text"
        name="hp_ref_code"
        tabIndex={-1}
        autoComplete="off"
        data-1p-ignore
        data-lpignore="true"
        aria-hidden="true"
        value={form.company}
        onChange={(e) => form.setCompany(e.target.value)}
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />
      {!sent && (
        <h3 ref={titleRef} tabIndex={-1} className="mb-4 text-[2rem] leading-[1.1] text-ink outline-none">
          {w.titles[STEP_KEYS[step]]}
        </h3>
      )}
      <div key={sent ? 'sent' : step} className="step-in">
        {sent ? <SentStep form={form} title={sentTitle} titleRef={titleRef} /> : steps[step]}
      </div>
    </div>
  );

  /* ---------------- footer: what you get, and the next action ---------------- */
  const eyebrow = 'text-[11px] font-semibold uppercase tracking-[0.14em] text-muted';
  let summary: ReactNode = null;
  if (step === 0 || !vehicle) {
    if (route) {
      summary = (
        <>
          <p className={eyebrow}>{b.yourTrip}</p>
          <p className="truncate text-[15px] font-semibold text-ink tabular">
            ≈ {route.km} km · {form.dur(route.minutes)}
          </p>
        </>
      );
    }
  } else if (estimateValue) {
    summary = (
      <>
        <p className={eyebrow}>{b.estimateShort}</p>
        <p className="font-display text-[1.6rem] leading-none text-ink tabular">{estimateValue}</p>
      </>
    );
  } else {
    summary = (
      <>
        <p className={`truncate ${eyebrow}`}>{b.estimateShort}</p>
        <p className="truncate text-[14px] font-medium text-ink">
          {vehicle.priceOnRequest ? t.fleetCard.onRequest : b.priceQuote}
        </p>
      </>
    );
  }

  const footerClass =
    variant === 'sheet'
      ? 'border-t border-line bg-ivory/90 px-4 pt-3 pb-[max(0.85rem,env(safe-area-inset-bottom))] backdrop-blur-xl'
      : 'border-t border-line px-5 py-4 sm:px-7 sm:py-5';

  let footer: ReactNode;
  if (sent) {
    footer = (
      <div className={footerClass}>
        <div className="flex gap-2.5">
          {sent === 'whatsapp' && (
            <Button large rounded outline onClick={form.sendWhatsApp} className="!border-ink/15 !text-ink">
              <WhatsAppIcon size={18} />
              <span className="ml-2">{b.reopenWhatsApp}</span>
            </Button>
          )}
          {variant === 'sheet' ? (
            <Button large rounded onClick={onClose}>
              {t.quoteModal.close}
            </Button>
          ) : (
            <Button large rounded onClick={form.restart}>
              {b.newRequest}
            </Button>
          )}
        </div>
      </div>
    );
  } else if (step < 3) {
    footer = (
      <div className={footerClass}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">{summary}</div>
          {variant === 'inline' && step > 0 && (
            <Button large rounded clear inline onClick={form.back} className="!w-auto !px-4 !text-ink" aria-label={w.back}>
              <ArrowLeft size={18} aria-hidden />
            </Button>
          )}
          <Button large rounded inline onClick={form.next} className="!w-auto shrink-0 !px-6">
            {w.next}
            <ArrowRight size={18} aria-hidden className="ml-2" />
          </Button>
        </div>
      </div>
    );
  } else {
    footer = (
      <div className={footerClass}>
        <p className="mb-2.5 text-center text-[12px] text-muted">{t.quoteModal.title}</p>
        <div className="grid grid-cols-2 gap-2.5">
          <Button large rounded onClick={form.sendWhatsApp} disabled={sending} className="!bg-[#15803d]">
            <WhatsAppIcon size={18} />
            <span className="ml-2">WhatsApp</span>
          </Button>
          <Button large rounded onClick={() => void form.sendEmail()} disabled={sending}>
            {sending ? (
              <Preloader className="!h-5 !w-5 !text-white" />
            ) : form.failure ? (
              <>
                <RotateCcw size={18} aria-hidden />
                <span className="ml-2">{b.retry}</span>
              </>
            ) : (
              <>
                <Mail size={18} aria-hidden />
                <span className="ml-2">Email</span>
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------- preview: the trip so far, for wide screens ---------------- */
  const { from: fromEnd, to: toEnd } = form.ticket;
  const preview = (
    <div className="overflow-clip rounded-3xl bg-ink text-white">
      {map('aspect-[4/3] w-full')}
      <div className="grid gap-1 px-6 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">{b.yourTrip}</p>
        <p className="truncate font-display text-[1.7rem] leading-tight">
          {draft.from || isHourly || draft.to
            ? `${fromEnd.title || '…'} ${isHourly ? '' : `→ ${toEnd?.title || '…'}`}`.trim()
            : b.mapEmpty}
        </p>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-white/70">
          {draft.date && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} aria-hidden /> {form.prettyDate(draft.date)}
            </span>
          )}
          {draft.time && (
            <span className="inline-flex items-center gap-1.5 tabular">
              <Clock3 size={14} aria-hidden /> {draft.time}
            </span>
          )}
          {isHourly && hours && (
            <span className="inline-flex items-center gap-1.5">
              <Timer size={14} aria-hidden /> {form.hoursLabel(hours)}
            </span>
          )}
          {vehicle && <span>{vehicleName(vehicle, t)}</span>}
          {estimateValue && <span className="font-semibold text-white">{estimateValue}</span>}
        </p>
      </div>
    </div>
  );

  return <>{children({ header, body, footer, preview })}</>;
}
