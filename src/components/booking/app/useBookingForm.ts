'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/i18n/LanguageProvider';
import { vehicles } from '@/lib/data';
import { estimate, parseHours, type Estimate } from '@/lib/pricing';
import { matchPlace, routeBetween, type Place } from '@/lib/places';
import { EMPTY_DRAFT, type BookingDraft, type ServiceType } from '@/lib/booking';
import { formatDuration, pointName } from '@/lib/coverage';
import { isoDate } from '@/lib/hooks';
import { mailtoHref, openWhatsApp, sendByEmail } from '@/lib/sendQuote';
import type { ContactPayload } from '@/lib/quoteMessage';
import type { Vehicle } from '@/lib/types';
import { clearDraft, startFrom, writeDraft, type Step } from './draft';
import type { TicketEnd } from './TripTicket';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type Errors = Partial<Record<keyof BookingDraft | 'capacity', string>>;
export type Sent = 'email' | 'mailto' | 'whatsapp';
/** An email the server couldn't send: its error code and the same request as a mailto: link. */
export type SendFailure = { reason: string; mailto: string };
export type BookingForm = ReturnType<typeof useBookingForm>['form'];

const addMinutes = (time: string, minutes: number) => {
  const m = /^(\d{1,2}):(\d{2})/.exec(time);
  if (!m) return null;
  const total = (Number(m[1]) * 60 + Number(m[2]) + minutes) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

/**
 * State and rules of the booking app: the draft (saved for the tab), the
 * step, validation, the derived trip (recognised places, route, prices) and
 * the two ways out (WhatsApp, email). The steps only render `form`; the refs
 * are returned apart (the body, for scrolling and focus; the step title).
 */
export function useBookingForm(handoff: Partial<BookingDraft> | null, variant: 'sheet' | 'inline') {
  const { t, locale } = useLanguage();
  const w = t.wizard;
  const b = t.booking;
  const uid = useId();
  const hydrated = handoff !== null;
  const [{ draft: initialDraft, step: initialStep }] = useState(() =>
    handoff ? startFrom(handoff) : { draft: EMPTY_DRAFT, step: 0 as Step },
  );
  const [draft, setDraft] = useState<BookingDraft>(initialDraft);
  const [step, setStep] = useState<Step>(initialStep);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<Sent | null>(null);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<SendFailure | null>(null);
  // Bumped after a failed send: the review step remounts the Turnstile widget,
  // since a token is single-use and a retry needs a fresh one.
  const [attempt, setAttempt] = useState(0);
  const [company, setCompany] = useState(''); // honeypot
  const [today] = useState(() => (hydrated ? isoDate(new Date()) : undefined));
  const tokenRef = useRef('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (hydrated && !sent) writeDraft(draft);
  }, [draft, hydrated, sent]);

  // A new step starts at its top, with focus on its title.
  useEffect(() => {
    if (!moved.current) return;
    const body = bodyRef.current;
    if (variant === 'sheet') {
      body?.closest('[data-scroll], .react-modal-sheet-content-scroller')?.scrollTo({ top: 0 });
    } else if (body && body.getBoundingClientRect().top < 80) {
      body.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    titleRef.current?.focus({ preventScroll: true });
  }, [step, sent, variant]);

  const set = <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    const capacity = key === 'pax' || key === 'car';
    setErrors((e) => (e[key] || (capacity && e.capacity) ? { ...e, [key]: undefined, capacity: undefined } : e));
  };

  /* ---------------- the trip ---------------- */
  const isHourly = draft.type === 'hourly';
  const isAirport = draft.type === 'airport-transfer';
  const vehicle = vehicles.find((v) => v.id === draft.car) ?? null;
  const pax = Math.max(1, Number(draft.pax) || 1);
  const bags = Math.max(0, Number(draft.bags) || 0);
  const hours = parseHours(draft.hours);
  const fromPlace = useMemo(() => matchPlace(draft.from), [draft.from]);
  const toPlace = useMemo(() => (isHourly ? null : matchPlace(draft.to)), [draft.to, isHourly]);
  const route = fromPlace && toPlace ? routeBetween(fromPlace, toPlace) : null;

  const priceFor = useCallback(
    (v: Vehicle): Estimate =>
      estimate({
        tripType: isHourly ? 'hourly' : 'one-way',
        vehicle: v,
        from: draft.from,
        to: isHourly ? undefined : draft.to,
        durationHours: isHourly ? hours : undefined,
      }),
    [isHourly, draft.from, draft.to, hours],
  );
  const est: Estimate = vehicle ? priceFor(vehicle) : { kind: 'incomplete' };
  const estimateValue = est.kind === 'hourly' || est.kind === 'fixed' ? `€${est.amount}` : null;

  /* ---------------- formatting ---------------- */
  const placeTitle = (p: Place | null, text: string) => {
    if (p?.code) return p.code;
    if (p?.point) return pointName(p.point, locale);
    if (p) return b.places[p.id as keyof typeof b.places] ?? p.value;
    return text.split(',')[0].trim();
  };
  const prettyDate = (iso: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
    try {
      return new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short' }).format(
        new Date(`${iso}T12:00:00`),
      );
    } catch {
      return iso;
    }
  };
  const hoursLabel = (h: number) => (h === 1 ? t.quickBook.hourOne : t.quickBook.hourMany).replace('{n}', String(h));
  const dur = (m: number) => formatDuration(m, t.coverage.unitMin, t.coverage.unitHour);
  const typeLabel = (type: ServiceType) =>
    type === 'hourly' ? w.typeHourly : type === 'airport-transfer' ? w.typeAirport : w.typeTransfer;
  const tomorrow = today ? isoDate(new Date(new Date(`${today}T12:00:00`).getTime() + 86_400_000)) : undefined;

  const fromEnd: TicketEnd = { title: placeTitle(fromPlace, draft.from), detail: draft.from };
  const toEnd: TicketEnd | null = isHourly ? null : { title: placeTitle(toPlace, draft.to), detail: draft.to };
  const arrival = isHourly
    ? hours && draft.time
      ? `${draft.time} → ${addMinutes(draft.time, Math.round(hours * 60))}`
      : null
    : route && draft.time
      ? addMinutes(draft.time, route.minutes)
      : null;
  /** Everything the boarding-pass summary shows. */
  const ticket = {
    kicker: typeLabel(draft.type),
    from: fromEnd,
    to: toEnd,
    dateLabel: prettyDate(draft.date),
    time: draft.time,
    arrival,
    durationLabel: hours ? hoursLabel(hours) : null,
    vehicle,
    pax,
    bags,
    childSeat: draft.childSeat,
    flight: isAirport ? draft.flight.trim() : '',
    estimate: estimateValue,
  };

  /* ---------------- validation & navigation ---------------- */
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
      if (!draft.phone.trim()) e.phone = w.errors.required;
      else if (draft.phone.replace(/\D/g, '').length < 6) e.phone = w.errors.phone;
      if (!draft.email.trim()) e.email = w.errors.required;
      else if (!EMAIL_RE.test(draft.email.trim())) e.email = t.formErrors.invalidEmail;
    }
    return e;
  };

  const goTo = (s: Step) => {
    moved.current = true;
    setErrors({});
    setFailure(null);
    setStep(s);
  };

  const focusFirstError = (e: Errors) => {
    const key = Object.keys(e)[0] === 'capacity' ? 'car' : Object.keys(e)[0];
    const el = bodyRef.current?.querySelector<HTMLElement>(`[data-field="${key}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el?.focus({ preventScroll: true });
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      focusFirstError(e);
      return;
    }
    if (step < 3) goTo((step + 1) as Step);
  };
  const back = () => {
    if (step > 0) goTo((step - 1) as Step);
  };

  /* ---------------- sending ---------------- */
  const buildPayload = (): ContactPayload | null => {
    for (const s of [0, 1, 2] as Step[]) {
      const e = validate(s);
      if (Object.keys(e).length) {
        goTo(s);
        setErrors(e);
        return null;
      }
    }
    if (!vehicle) return null;
    return {
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
      passengers: String(pax),
      bags: String(bags),
      childSeat: draft.childSeat,
      flight: isAirport ? draft.flight.trim() || undefined : undefined,
      notes: draft.notes.trim() || undefined,
    };
  };

  const sendWhatsApp = () => {
    if (company) return; // bot caught by the honeypot
    const payload = buildPayload();
    if (!payload) return;
    openWhatsApp(payload);
    moved.current = true;
    setSent('whatsapp');
  };

  const sendEmail = async () => {
    if (company || sending) return;
    const payload = buildPayload();
    if (!payload) return;
    setSending(true);
    setFailure(null);
    const result = await sendByEmail(payload, {
      locale,
      honeypot: company,
      turnstileToken: () => tokenRef.current,
    });
    tokenRef.current = ''; // single use
    setSending(false);
    if (!result.ok) {
      // Stay on the review: say what happened and offer the other channels.
      setFailure({ reason: result.reason, mailto: mailtoHref(payload) });
      setAttempt((n) => n + 1);
      return;
    }
    moved.current = true;
    setSent('email');
    clearDraft();
    toast.success(t.quoteModal.sent, { description: t.quoteModal.sentBody });
  };

  /** The visitor chose their own mail app (the link itself opens it). */
  const mailAppOpened = () => {
    moved.current = true;
    setFailure(null);
    setSent('mailto');
  };

  /** A new request: the trip starts over, the contact details stay. */
  const restart = () => {
    setDraft((d) => ({ ...EMPTY_DRAFT, name: d.name, phone: d.phone, email: d.email }));
    setSent(null);
    goTo(0);
  };

  // A failure notice scrolls into view next to the action bar and is announced.
  useEffect(() => {
    if (!failure) return;
    const notice = bodyRef.current?.querySelector<HTMLElement>('[data-send-failure]');
    notice?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [failure]);

  const onTurnstile = useCallback((token: string) => {
    tokenRef.current = token;
  }, []);

  /* ---------------- field wiring ---------------- */
  const fid = (name: string) => `${uid}-${name}`;
  const aria = (key: keyof Errors) =>
    errors[key] ? { 'aria-invalid': true as const, 'aria-describedby': `${fid(key)}-error` } : {};

  const form = {
    t,
    locale,
    draft,
    setDraft,
    set,
    step,
    errors,
    setErrors,
    sent,
    sending,
    failure,
    attempt,
    mailAppOpened,
    company,
    setCompany,
    today,
    tomorrow,
    isHourly,
    isAirport,
    vehicle,
    pax,
    bags,
    hours,
    fromPlace,
    toPlace,
    route,
    priceFor,
    est,
    estimateValue,
    ticket,
    prettyDate,
    hoursLabel,
    dur,
    typeLabel,
    next,
    back,
    goTo,
    restart,
    sendWhatsApp,
    sendEmail,
    onTurnstile,
    fid,
    aria,
  };
  return { form, bodyRef, titleRef };
}
