'use client';

import { Suspense, useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Baby,
  Briefcase,
  CalendarDays,
  Car,
  Check,
  Clock3,
  Flag,
  MapPin,
  Pencil,
  Plane,
  Route,
  Send,
  Timer,
  UserRound,
  Users,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import QuoteChoiceModal from '@/components/ui/QuoteChoiceModal';
import Stepper from '@/components/ui/Stepper';
import QuoteEstimate from '@/components/ui/QuoteEstimate';
import { vehicles } from '@/lib/data';
import { vehicleName } from '@/lib/fleet';
import { estimate, parseHours } from '@/lib/pricing';
import { POPULAR_PLACES, QUICK_DESTINATIONS } from '@/lib/places';
import { EMPTY_DRAFT, draftFromParams, type BookingDraft, type ServiceType } from '@/lib/booking';
import type { ContactPayload } from '@/lib/quoteMessage';
import { isoDate } from '@/lib/hooks';

const STORAGE_KEY = 'tld.booking-draft';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const STEP_COUNT = 4;

type Step = 0 | 1 | 2 | 3;
type Errors = Partial<Record<keyof BookingDraft | 'capacity', string>>;

/* ------------------------------------------------------------------ */
/* Draft restore: URL params (explicit intent) win over the saved draft. */

function readInitial(search: string): { draft: BookingDraft; step: Step } {
  let saved: Partial<BookingDraft> = {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) saved = JSON.parse(raw) as Partial<BookingDraft>;
  } catch {
    // storage unavailable (private mode, blocked) — start fresh
  }
  const fromUrl = draftFromParams(new URLSearchParams(search));
  const draft: BookingDraft = { ...EMPTY_DRAFT, ...saved, ...fromUrl };
  // A quick-form handoff (route + date + time) jumps straight to the vehicle step.
  const tripDone = Boolean(
    draft.from && (draft.type === 'hourly' ? draft.hours : draft.to) && draft.date && draft.time,
  );
  const fromHandoff = Object.keys(fromUrl).length > 0;
  return { draft, step: fromHandoff && tripDone ? (draft.car ? 2 : 1) : 0 };
}

/**
 * Four-step booking request: trip → vehicle → contact details → review.
 * Emits the same ContactPayload as the old contact form, so /api/quote,
 * the operator email and the customer confirmation are unchanged.
 *
 * The prerendered HTML holds the empty form (the Suspense fallback); on the
 * client it is replaced by one that restores the hand-off from the query
 * string (quick form, vehicle and city CTAs) and the tab's saved draft.
 */
export default function BookingWizard() {
  return (
    <Suspense fallback={<WizardInner search={null} />}>
      <WizardFromParams />
    </Suspense>
  );
}

function WizardFromParams() {
  const search = useSearchParams().toString();
  // A new hand-off (different query) starts a fresh wizard.
  return <WizardInner key={search || 'client'} search={search} />;
}

/* ------------------------------------------------------------------ */

function Field({
  id,
  label,
  icon,
  error,
  hint,
  action,
  children,
  className = '',
}: {
  id: string;
  label: string;
  icon?: ReactNode;
  error?: string;
  hint?: string;
  /** Small control shown at the end of the label row. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`field ${className}`.trim()}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="field-label flex items-center gap-1.5">
          {icon && <span className="text-gold-deep">{icon}</span>}
          {label}
        </label>
        {action}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function WizardInner({ search }: { search: string | null }) {
  const hydrated = search !== null;
  const { t, locale } = useLanguage();
  const w = t.wizard;
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [{ draft: initialDraft, step: initialStep }] = useState(() =>
    search !== null ? readInitial(search) : { draft: EMPTY_DRAFT, step: 0 as Step },
  );
  const [draft, setDraft] = useState<BookingDraft>(initialDraft);
  const [step, setStep] = useState<Step>(initialStep);
  const [errors, setErrors] = useState<Errors>({});
  const [company, setCompany] = useState(''); // honeypot
  const [payload, setPayload] = useState<ContactPayload | null>(null);
  const [today] = useState(() => (hydrated ? isoDate(new Date()) : undefined));
  const moved = useRef(false);

  // Keep the draft for this tab so a detour to the fleet page loses nothing.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // ignore storage failures
    }
  }, [draft, hydrated]);

  // After a step change, bring the wizard into view and move focus to the step title.
  useEffect(() => {
    if (!moved.current) return;
    const root = rootRef.current;
    if (root && root.getBoundingClientRect().top < 0) {
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const set = <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const vehicle = vehicles.find((v) => v.id === draft.car) ?? null;
  const pax = Number(draft.pax) || 1;
  const bags = Number(draft.bags) || 0;
  const isHourly = draft.type === 'hourly';

  const liveEstimate = estimate({
    tripType: isHourly ? 'hourly' : 'one-way',
    vehicle,
    from: draft.from,
    to: isHourly ? undefined : draft.to,
    durationHours: isHourly ? parseHours(draft.hours) : undefined,
  });

  /* ---------------- validation ---------------- */
  const validate = (s: Step): Errors => {
    const e: Errors = {};
    if (s === 0) {
      if (!draft.from.trim()) e.from = w.errors.required;
      if (isHourly ? !draft.hours : !draft.to.trim()) e[isHourly ? 'hours' : 'to'] = w.errors.required;
      if (!draft.date) e.date = w.errors.required;
      else if (today && draft.date < today) e.date = w.errors.pastDate;
      if (!draft.time) e.time = w.errors.required;
    }
    if (s === 1) {
      if (!vehicle) e.car = w.errors.vehicle;
      else if (pax > vehicle.passengers) e.capacity = w.errors.capacity;
    }
    if (s === 2) {
      if (!draft.name.trim()) e.name = w.errors.required;
      const digits = draft.phone.replace(/\D/g, '');
      if (!draft.phone.trim()) e.phone = w.errors.required;
      else if (digits.length < 6) e.phone = w.errors.phone;
      if (!draft.email.trim()) e.email = w.errors.required;
      else if (!EMAIL_RE.test(draft.email.trim())) e.email = t.formErrors.invalidEmail;
    }
    return e;
  };

  const goTo = useCallback((s: Step) => {
    moved.current = true;
    setStep(s);
  }, []);

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      // Focus the first invalid control.
      const first = Object.keys(e)[0];
      const el = rootRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
      el?.focus();
      return;
    }
    if (step < 3) goTo((step + 1) as Step);
  };

  const back = () => {
    setErrors({});
    if (step > 0) goTo((step - 1) as Step);
  };

  const submit = () => {
    if (company) return; // bot caught by the honeypot
    for (const s of [0, 1, 2] as Step[]) {
      const e = validate(s);
      if (Object.keys(e).length) {
        setErrors(e);
        goTo(s);
        return;
      }
    }
    if (!vehicle) return;
    setPayload({
      kind: 'contact',
      serviceType: draft.type,
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      email: draft.email.trim(),
      from: draft.from.trim(),
      to: isHourly ? draft.hours : draft.to.trim(),
      date: draft.date,
      time: draft.time,
      vehicle: vehicle.name,
      passengers: draft.pax || undefined,
      bags: draft.bags || undefined,
      childSeat: draft.childSeat,
      notes: draft.notes.trim() || undefined,
    });
  };

  const onSent = useCallback(() => {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);
  const closeModal = useCallback(() => setPayload(null), []);

  /* ---------------- shared bits ---------------- */
  const listId = `${uid}-places`;
  const fid = (name: string) => `${uid}-${name}`;
  const invalid = (k: keyof Errors) =>
    errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': `${fid(k)}-error` } : {};

  const stepLabels = [w.steps.trip, w.steps.vehicle, w.steps.details, w.steps.review];
  const typeOptions: Array<{ value: ServiceType; label: string; desc: string; icon: ReactNode }> = [
    { value: 'one-way', label: w.typeTransfer, desc: w.typeTransferDesc, icon: <Route size={18} aria-hidden /> },
    { value: 'airport-transfer', label: w.typeAirport, desc: w.typeAirportDesc, icon: <Plane size={18} aria-hidden /> },
    { value: 'hourly', label: w.typeHourly, desc: w.typeHourlyDesc, icon: <Timer size={18} aria-hidden /> },
  ];
  const typeLabel = typeOptions.find((o) => o.value === draft.type)?.label ?? '';
  const prettyDate = (iso: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
    try {
      return new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }).format(
        new Date(`${iso}T12:00:00`),
      );
    } catch {
      return iso;
    }
  };
  const hoursLabel = (h: number) => (h === 1 ? t.quickBook.hourOne : t.quickBook.hourMany).replace('{n}', String(h));

  /* ---------------- steps ---------------- */
  const stepTrip = (
    <div className="grid gap-6">
      <fieldset>
        <legend className="field-label mb-2.5">{t.contactPage.form.serviceType}</legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {typeOptions.map((o) => {
            const checked = draft.type === o.value;
            return (
              <label
                key={o.value}
                className={`relative flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors sm:flex-col sm:items-start sm:gap-2 ${
                  checked ? 'border-ink bg-ink text-white' : 'border-line-strong bg-white text-ink hover:border-ink/50'
                } has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold`}
              >
                <input
                  type="radio"
                  name={`${uid}-type`}
                  value={o.value}
                  checked={checked}
                  onChange={() => set('type', o.value)}
                  className="sr-only"
                />
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    checked ? 'bg-gold text-on-gold' : 'bg-ivory text-gold-deep'
                  }`}
                >
                  {o.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold">{o.label}</span>
                  <span className={`block text-[13px] ${checked ? 'text-white/65' : 'text-muted'}`}>{o.desc}</span>
                </span>
                {checked && <Check size={16} aria-hidden className="ml-auto text-gold sm:absolute sm:right-4 sm:top-4" />}
              </label>
            );
          })}
        </div>
      </fieldset>

      <datalist id={listId}>
        {POPULAR_PLACES.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>

      <div className="grid gap-4">
        <Field id={fid('from')} label={t.bookingForm.from} icon={<MapPin size={14} aria-hidden />} error={errors.from}>
          <input
            id={fid('from')}
            data-field="from"
            className="input"
            value={draft.from}
            onChange={(e) => set('from', e.target.value)}
            list={listId}
            autoComplete="off"
            placeholder={t.quickBook.fromPlaceholder}
            {...invalid('from')}
          />
        </Field>

        {isHourly ? (
          <Field id={fid('hours')} label={t.quickBook.duration} icon={<Timer size={14} aria-hidden />} error={errors.hours}>
            <select
              id={fid('hours')}
              data-field="hours"
              className="input"
              value={draft.hours}
              onChange={(e) => set('hours', e.target.value)}
              {...invalid('hours')}
            >
              <option value="">{t.quickBook.durationPlaceholder}</option>
              {HOURS.map((h) => (
                <option key={h} value={String(h)}>
                  {hoursLabel(h)}
                </option>
              ))}
            </select>
          </Field>
        ) : (
          <>
            <Field
              id={fid('to')}
              label={t.bookingForm.to}
              icon={<Flag size={14} aria-hidden />}
              error={errors.to}
              action={
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, from: d.to, to: d.from }))}
                  title={w.swap}
                  className="-my-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-semibold text-ink transition-colors hover:bg-ivory"
                >
                  <ArrowUpDown size={14} aria-hidden />
                  <span className="sr-only sm:not-sr-only">{w.swap}</span>
                </button>
              }
            >
              <input
                id={fid('to')}
                data-field="to"
                className="input"
                value={draft.to}
                onChange={(e) => set('to', e.target.value)}
                list={listId}
                autoComplete="off"
                placeholder={t.quickBook.toPlaceholder}
                {...invalid('to')}
              />
            </Field>
            <div>
              <p className="mb-2 text-[13px] text-muted">{w.quickTo}</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_DESTINATIONS.map((q) => (
                  <button
                    key={q.value}
                    type="button"
                    onClick={() => {
                      set('to', q.value);
                      if (/Aeroporto/.test(q.value) && draft.type === 'one-way') set('type', 'airport-transfer');
                    }}
                    aria-pressed={draft.to === q.value}
                    className="chip text-[13px]"
                  >
                    {/Aeroporto/.test(q.value) && <Plane size={13} aria-hidden />}
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field id={fid('date')} label={t.bookingForm.date} icon={<CalendarDays size={14} aria-hidden />} error={errors.date}>
          <input
            id={fid('date')}
            data-field="date"
            type="date"
            className="input"
            value={draft.date}
            min={today}
            onChange={(e) => set('date', e.target.value)}
            {...invalid('date')}
          />
        </Field>
        <Field id={fid('time')} label={t.contactPage.form.pickupTime} icon={<Clock3 size={14} aria-hidden />} error={errors.time}>
          <input
            id={fid('time')}
            data-field="time"
            type="time"
            className="input"
            value={draft.time}
            onChange={(e) => set('time', e.target.value)}
            {...invalid('time')}
          />
        </Field>
      </div>
    </div>
  );

  const stepVehicle = (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="field">
          <span className="field-label flex items-center gap-1.5" id={`${fid('pax')}-label`}>
            <Users size={14} aria-hidden className="text-gold-deep" />
            {t.quickBook.passengers}
          </span>
          <Stepper
            id={fid('pax')}
            value={pax}
            min={1}
            max={18}
            onChange={(n) => set('pax', String(n))}
            decLabel={`${t.quickBook.passengers} −1`}
            incLabel={`${t.quickBook.passengers} +1`}
          />
        </div>
        <div className="field">
          <span className="field-label flex items-center gap-1.5">
            <Briefcase size={14} aria-hidden className="text-gold-deep" />
            {t.contactPage.form.bags}
          </span>
          <Stepper
            id={fid('bags')}
            value={bags}
            min={0}
            max={18}
            onChange={(n) => set('bags', String(n))}
            decLabel={`${t.contactPage.form.bags} −1`}
            incLabel={`${t.contactPage.form.bags} +1`}
          />
        </div>
      </div>

      <fieldset>
        <legend className="field-label mb-2.5 flex items-center gap-1.5">
          <Car size={14} aria-hidden className="text-gold-deep" />
          {w.vehiclePick}
        </legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2" data-field="car" tabIndex={-1}>
          {vehicles.map((v) => {
            const checked = draft.car === v.id;
            const tooSmall = pax > v.passengers;
            return (
              <label
                key={v.id}
                className={`relative flex cursor-pointer items-center gap-4 rounded-2xl border p-3 pr-4 transition-colors ${
                  checked ? 'border-ink bg-ivory ring-1 ring-ink' : 'border-line-strong bg-white hover:border-ink/50'
                } ${tooSmall ? 'opacity-55' : ''} has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold`}
              >
                <input
                  type="radio"
                  name={`${uid}-car`}
                  value={v.id}
                  checked={checked}
                  onChange={() => set('car', v.id)}
                  className="sr-only"
                />
                <span className="relative h-16 w-24 shrink-0 overflow-clip rounded-xl bg-white">
                  <Image src={v.image} alt="" fill sizes="96px" className="object-contain p-1" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-ink">{vehicleName(v, t)}</span>
                  <span className="mt-0.5 flex items-center gap-3 text-[13px] text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Users size={13} aria-hidden /> {v.passengers}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Briefcase size={13} aria-hidden /> {v.bags}
                    </span>
                  </span>
                  <span className="mt-1 block text-[13px] font-semibold text-ink">
                    {v.priceOnRequest
                      ? t.fleetCard.onRequest
                      : `${t.fleetCard.from} €${v.pricePerHour}${t.fleetCard.perHour}`}
                  </span>
                  {tooSmall && (
                    <span className="mt-1 block text-xs font-medium text-[#b42318]">
                      {w.capacityMax.replace('{n}', String(v.passengers))}
                    </span>
                  )}
                </span>
                <span
                  aria-hidden
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    checked ? 'border-ink bg-ink text-gold' : 'border-line-strong'
                  }`}
                >
                  {checked && <Check size={14} />}
                </span>
              </label>
            );
          })}
        </div>
        {(errors.car || errors.capacity) && (
          <p id={`${fid('car')}-error`} className="field-error mt-2.5" role="alert">
            {errors.car ?? errors.capacity}
          </p>
        )}
      </fieldset>

      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-line-strong bg-white p-4 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold">
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory text-gold-deep">
            <Baby size={18} aria-hidden />
          </span>
          <span>
            <span className="block text-[15px] font-semibold text-ink">{t.contactPage.form.childSeat}</span>
            <span className="block text-[13px] text-muted">{w.childSeatHint}</span>
          </span>
        </span>
        <input
          type="checkbox"
          checked={draft.childSeat}
          onChange={(e) => set('childSeat', e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="relative h-7 w-12 shrink-0 rounded-full bg-line-strong transition-colors after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-ink peer-checked:after:translate-x-5"
        />
      </label>

      <QuoteEstimate estimate={liveEstimate} />
    </div>
  );

  const stepDetails = (
    <div className="grid gap-5">
      <Field id={fid('name')} label={t.contactPage.name} icon={<UserRound size={14} aria-hidden />} error={errors.name}>
        <input
          id={fid('name')}
          data-field="name"
          className="input"
          value={draft.name}
          onChange={(e) => set('name', e.target.value)}
          autoComplete="name"
          placeholder={t.contactPage.form.namePlaceholder}
          {...invalid('name')}
        />
      </Field>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id={fid('phone')} label={t.contactPage.phone} error={errors.phone} hint={w.phoneHint}>
          <input
            id={fid('phone')}
            data-field="phone"
            type="tel"
            inputMode="tel"
            className="input"
            value={draft.phone}
            onChange={(e) => set('phone', e.target.value)}
            autoComplete="tel"
            placeholder={t.contactPage.form.phonePlaceholder}
            {...invalid('phone')}
          />
        </Field>
        <Field id={fid('email')} label={t.contactPage.email} error={errors.email}>
          <input
            id={fid('email')}
            data-field="email"
            type="email"
            inputMode="email"
            className="input"
            value={draft.email}
            onChange={(e) => set('email', e.target.value)}
            autoComplete="email"
            placeholder={t.contactPage.form.emailPlaceholder}
            {...invalid('email')}
          />
        </Field>
      </div>
      <Field id={fid('notes')} label={t.contactPage.form.additionalNotes} hint={w.notesHint}>
        <textarea
          id={fid('notes')}
          className="input"
          rows={4}
          value={draft.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder={w.notesPlaceholder}
        />
      </Field>
      <p className="text-[13px] leading-relaxed text-muted">
        {w.privacyBefore}{' '}
        <Link href="/privacy-policy" className="font-semibold text-ink underline underline-offset-2">
          {w.privacyLink}
        </Link>
        {w.privacyAfter}
      </p>
    </div>
  );

  const summaryRow = (label: string, value: ReactNode) =>
    value ? (
      <div className="flex justify-between gap-4 py-2 text-[15px]">
        <dt className="text-muted">{label}</dt>
        <dd className="text-right font-medium text-ink">{value}</dd>
      </div>
    ) : null;

  const summaryBlock = (title: string, target: Step, rows: ReactNode) => (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="mb-1 flex items-center justify-between">
        <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep">{title}</h4>
        <button
          type="button"
          onClick={() => goTo(target)}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-semibold text-ink transition-colors hover:bg-ivory"
        >
          <Pencil size={13} aria-hidden />
          {w.edit}
        </button>
      </div>
      <dl className="divide-y divide-line">{rows}</dl>
    </div>
  );

  const stepReview = (
    <div className="grid gap-4">
      {summaryBlock(
        w.steps.trip,
        0,
        <>
          {summaryRow(t.contactPage.form.serviceType, typeLabel)}
          {summaryRow(t.bookingForm.from, draft.from)}
          {isHourly
            ? summaryRow(t.quickBook.duration, draft.hours ? hoursLabel(Number(draft.hours)) : '')
            : summaryRow(t.bookingForm.to, draft.to)}
          {summaryRow(t.bookingForm.date, prettyDate(draft.date))}
          {summaryRow(t.contactPage.form.pickupTime, draft.time)}
        </>,
      )}
      {summaryBlock(
        w.steps.vehicle,
        1,
        <>
          {summaryRow(w.vehicleLabel, vehicle ? vehicleName(vehicle, t) : undefined)}
          {summaryRow(t.quickBook.passengers, String(pax))}
          {summaryRow(t.contactPage.form.bags, String(bags))}
          {draft.childSeat && summaryRow(w.childSeatShort, t.contactPage.form.yes)}
        </>,
      )}
      {summaryBlock(
        w.steps.details,
        2,
        <>
          {summaryRow(t.contactPage.name, draft.name)}
          {summaryRow(t.contactPage.phone, draft.phone)}
          {summaryRow(t.contactPage.email, draft.email)}
          {summaryRow(t.contactPage.form.additionalNotes, draft.notes)}
        </>,
      )}
      <QuoteEstimate estimate={liveEstimate} />
      <p className="flex items-start gap-2 text-[13px] leading-relaxed text-muted">
        <Check size={15} aria-hidden className="mt-0.5 shrink-0 text-gold-deep" />
        {w.reviewNote}
      </p>
    </div>
  );

  const content = [stepTrip, stepVehicle, stepDetails, stepReview][step];
  const progress = ((step + 1) / STEP_COUNT) * 100;

  return (
    <div ref={rootRef} className="scroll-mt-28 rounded-3xl border border-line bg-white p-5 shadow-md sm:p-8">
      {/* Honeypot — bots fill it, humans never see it. Deliberately not named
          "company"/"organization": browser autofill fills those, which would
          flag a real visitor as a bot. */}
      <input
        type="text"
        name="hp_ref_code"
        tabIndex={-1}
        autoComplete="off"
        data-1p-ignore
        data-lpignore="true"
        aria-hidden="true"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      {/* Progress */}
      <div className="mb-7">
        <div className="flex items-center justify-between gap-4 sm:hidden">
          <p className="text-sm font-semibold text-ink">{stepLabels[step]}</p>
          <p className="text-[13px] text-muted">
            {w.stepOf.replace('{n}', String(step + 1)).replace('{total}', String(STEP_COUNT))}
          </p>
        </div>
        <div className="mt-3 h-1 overflow-clip rounded-full bg-ivory-2 sm:hidden">
          <div className="h-full rounded-full bg-gold transition-[width] duration-500 ease-smooth" style={{ width: `${progress}%` }} />
        </div>
        <ol className="hidden grid-cols-4 gap-3 sm:grid">
          {stepLabels.map((label, i) => {
            const state = i < step ? 'done' : i === step ? 'current' : 'todo';
            return (
              <li key={label}>
                <button
                  type="button"
                  disabled={i >= step}
                  onClick={() => goTo(i as Step)}
                  aria-current={state === 'current' ? 'step' : undefined}
                  className="group flex w-full flex-col gap-2 text-left disabled:cursor-default"
                >
                  <span
                    className={`h-1 w-full rounded-full transition-colors ${
                      state === 'todo' ? 'bg-ivory-2' : 'bg-gold'
                    }`}
                  />
                  <span className="flex items-center gap-2 text-[13px]">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                        state === 'done'
                          ? 'bg-ink text-gold'
                          : state === 'current'
                            ? 'bg-gold text-on-gold'
                            : 'bg-ivory text-muted'
                      }`}
                    >
                      {state === 'done' ? <Check size={12} aria-hidden /> : i + 1}
                    </span>
                    <span className={state === 'todo' ? 'text-muted' : 'font-semibold text-ink group-enabled:group-hover:underline'}>
                      {label}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <section aria-labelledby={`${uid}-step-title`}>
        <h3
          id={`${uid}-step-title`}
          ref={headingRef}
          tabIndex={-1}
          className="text-[1.9rem] leading-tight text-ink outline-none"
        >
          {[w.titles.trip, w.titles.vehicle, w.titles.details, w.titles.review][step]}
        </h3>
        <div key={step} className="step-in mt-6">
          {content}
        </div>
      </section>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
        {step > 0 ? (
          <button type="button" onClick={back} className="btn btn-ghost shrink-0 px-3 sm:px-4">
            <ArrowLeft size={17} aria-hidden />
            <span className="sr-only sm:not-sr-only">{w.back}</span>
          </button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <button type="button" onClick={next} className="btn btn-primary btn-lg min-w-0 flex-1 sm:flex-none">
            {w.next}
            <ArrowRight size={17} aria-hidden />
          </button>
        ) : (
          <button type="button" onClick={submit} className="btn btn-gold btn-lg min-w-0 flex-1 sm:flex-none">
            <Send size={17} aria-hidden />
            {w.send}
          </button>
        )}
      </div>

      <QuoteChoiceModal open={payload !== null} payload={payload} honeypot={company} onClose={closeModal} onSent={onSent} />
    </div>
  );
}
