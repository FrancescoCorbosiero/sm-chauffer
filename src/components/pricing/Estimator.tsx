'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useId, useState } from 'react';
import { ArrowRight, Calculator, Clock, MapPin, Phone, Route } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import SectionHeading from '@/components/ui/SectionHeading';
import Stepper from '@/components/ui/Stepper';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { vehicles } from '@/lib/data';
import { estimate } from '@/lib/pricing';
import { bookingHref } from '@/lib/booking';
import { telHref, whatsappHref } from '@/lib/contact';
import { vehicleName } from '@/lib/fleet';
import { COVERAGE_POINTS, HUB_ID, formatDuration, pointName, type CoverageGroup } from '@/lib/coverage';

type Mode = 'transfer' | 'hourly';

const GROUPS: CoverageGroup[] = ['airport', 'lake', 'city', 'intl'];
const ROUTES = COVERAGE_POINTS.filter((p) => p.id !== HUB_ID);
/** The fixed route fare is quoted for the sedan. */
const SEDAN = vehicles.find((v) => v.id === 'mercedes-e-class') ?? null;
const FROM = 'Milano';
const OTHER = '';

/**
 * Price estimator for /pricing. Uses the same rules as the booking flow
 * (src/lib/pricing.ts): fixed Milan–Malpensa fare, hourly rate × hours,
 * everything else quoted on request.
 */
export default function Estimator() {
  const { t, locale } = useLanguage();
  const p = t.pricingPage;
  const qb = t.quickBook;
  const q = t.quote;
  const fc = t.fleetCard;
  const uid = useId();

  const [mode, setMode] = useState<Mode>('transfer');
  const [routeId, setRouteId] = useState('mxp');
  const [hours, setHours] = useState(3);
  const [carId, setCarId] = useState('mercedes-e-class');

  const route = ROUTES.find((r) => r.id === routeId) ?? null;
  const vehicle = vehicles.find((v) => v.id === carId) ?? null;
  const result =
    mode === 'transfer'
      ? estimate({ tripType: 'one-way', vehicle: SEDAN, from: FROM, to: route?.bookTo ?? '-' })
      : estimate({ tripType: 'hourly', vehicle, durationHours: hours });

  let value: React.ReactNode = fc.onRequest;
  let note = '';
  if (result.kind === 'fixed') {
    value = `€${result.amount}`;
    note = t.pricingTeaser.malpensaNote;
  } else if (result.kind === 'hourly') {
    value = `€${result.amount}`;
    note = `${result.hours} × €${result.rate}${fc.perHour}`;
  } else if (result.kind === 'on-request') {
    note = result.reason === 'bus' ? q.busNote : q.customNote;
  }

  const book =
    mode === 'transfer'
      ? bookingHref({
          type: route?.group === 'airport' ? 'airport-transfer' : 'one-way',
          from: FROM,
          ...(route ? { to: route.bookTo } : {}),
        })
      : bookingHref({ type: 'hourly', hours: String(hours), car: carId });

  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      aria-pressed={mode === m}
      onClick={() => setMode(m)}
      className={`flex-1 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors sm:flex-none ${
        mode === m ? 'bg-ink text-white' : 'text-ink hover:bg-ivory'
      }`}
    >
      {label}
    </button>
  );

  return (
    <section className="section-y bg-white">
      <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-7">
          <SectionHeading
            className="reveal"
            eyebrow={p.estimatorLabel}
            title={p.estimatorTitle}
            accent={p.estimatorAccent}
            description={p.estimatorText}
          />

          <div className="reveal mt-10 rounded-3xl border border-line bg-ivory p-5 sm:p-7">
            <div
              role="group"
              aria-label={qb.tripType}
              className="flex rounded-full border border-line-strong bg-white p-1 sm:inline-flex"
            >
              {tab('transfer', qb.transfer)}
              {tab('hourly', qb.hourly)}
            </div>

            {mode === 'transfer' ? (
              <div className="mt-6 grid gap-4">
                <div className="field">
                  <label htmlFor={`${uid}-route`} className="field-label flex items-center gap-1.5">
                    <MapPin size={14} aria-hidden className="text-gold-deep" />
                    {p.routeLabel}
                  </label>
                  <select
                    id={`${uid}-route`}
                    className="input"
                    value={routeId}
                    onChange={(e) => setRouteId(e.target.value)}
                  >
                    {GROUPS.map((g) => (
                      <optgroup key={g} label={t.coverage.groups[g]}>
                        {ROUTES.filter((r) => r.group === g).map((r) => (
                          <option key={r.id} value={r.id}>
                            {pointName(r, locale)}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                    <option value={OTHER}>{p.otherRoute}</option>
                  </select>
                </div>
                {route && (
                  <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted tabular">
                    <span className="inline-flex items-center gap-1.5">
                      <Route size={14} aria-hidden className="text-gold-deep" />≈ {route.km} km
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} aria-hidden className="text-gold-deep" />≈{' '}
                      {formatDuration(route.minutes, t.coverage.unitMin, t.coverage.unitHour)}
                    </span>
                    <span className="text-faint">{t.coverage.indicative}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-6 grid gap-6">
                <div className="field max-w-xs">
                  <span id={`${uid}-hours`} className="field-label flex items-center gap-1.5">
                    <Clock size={14} aria-hidden className="text-gold-deep" />
                    {qb.duration}
                  </span>
                  <Stepper
                    id={`${uid}-hours-value`}
                    labelledBy={`${uid}-hours`}
                    value={hours}
                    min={1}
                    max={12}
                    onChange={setHours}
                    decLabel={`${qb.duration} −1`}
                    incLabel={`${qb.duration} +1`}
                  />
                </div>
                <fieldset>
                  <legend className="field-label mb-2.5">{t.wizard.vehiclePick}</legend>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {vehicles.map((v) => {
                      const checked = v.id === carId;
                      return (
                        <label
                          key={v.id}
                          className={`relative flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${
                            checked ? 'border-ink' : 'border-line hover:border-line-strong'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`${uid}-car`}
                            value={v.id}
                            checked={checked}
                            onChange={() => setCarId(v.id)}
                            className="sr-only"
                          />
                          <span className="relative h-10 w-16 shrink-0">
                            <Image src={v.image} alt="" fill sizes="64px" className="object-contain" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[15px] font-semibold leading-snug text-ink">
                              {vehicleName(v, t)}
                            </span>
                            <span className="block text-[13px] text-muted tabular">
                              {fc.seats.replace('{n}', String(v.passengers))} ·{' '}
                              {v.priceOnRequest ? fc.onRequest : `€${v.pricePerHour}${fc.perHour}`}
                            </span>
                          </span>
                          <span
                            aria-hidden
                            className={`h-4 w-4 shrink-0 rounded-full border ${
                              checked ? 'border-[5px] border-ink' : 'border-line-strong'
                            }`}
                          />
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
            )}
          </div>
        </div>

        <aside className="min-w-0 self-start lg:sticky lg:top-24 lg:col-span-5 lg:mt-[9.5rem]">
          <div aria-live="polite" className="rounded-3xl bg-ink p-7 text-white sm:p-8">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              <Calculator size={14} aria-hidden />
              {q.estimate}
            </p>
            <p className="mt-4 font-display text-[3.4rem] leading-none text-gold-light tabular">{value}</p>
            {note && <p className="mt-3 text-[15px] leading-relaxed text-white/70">{note}</p>}
            <Link href={book} className="btn btn-gold btn-block mt-7">
              {p.bookWith}
              <ArrowRight size={16} aria-hidden />
            </Link>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              <a href={telHref(1)} className="btn btn-outline-light btn-sm">
                <Phone size={15} aria-hidden />
                {t.actions.call}
              </a>
              <a
                href={whatsappHref(t.actions.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light btn-sm"
              >
                <WhatsAppIcon size={15} />
                WhatsApp
              </a>
            </div>
            <p className="mt-5 border-t border-white/10 pt-4 text-[13px] leading-relaxed text-white/50">{q.disclaimer}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
