'use client';
import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, LucideIcon } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import QuoteChoiceModal from '@/components/ui/QuoteChoiceModal';
import QuoteEstimate from '@/components/ui/QuoteEstimate';
import { useTranslation } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import { vehicles } from '@/lib/data';
import { estimate } from '@/lib/pricing';
import type { ContactPayload } from '@/lib/quoteMessage';
import { SITE } from '@/lib/site';
import { IMAGES } from '@/lib/images';

const fieldShell = 'flex flex-col gap-1';
const labelClass = 'text-sm text-[var(--color-ink)]';
const inputClass =
  'w-full border border-black/10 bg-white px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-text-faint)] transition-colors focus:border-black focus:outline-none rounded-md';
const areaClass =
  'w-full border border-black/10 bg-white px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-text-faint)] transition-colors focus:border-black focus:outline-none resize-y rounded-md';
const chipBase =
  'rounded-full px-4 py-1.5 text-sm leading-none h-[30px] inline-flex items-center justify-center text-black transition-colors border';

const requiredMark = <span aria-hidden className="text-[var(--color-ink)] ml-0.5">*</span>;

// Pragmatic email shape check (the form sets noValidate, so the browser's
// native type="email" validation is intentionally bypassed).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const t = useTranslation();
  usePageTitle(t.meta.contact.title, t.meta.contact.description);

  const [serviceType, setServiceType] = useState<'one-way' | 'hourly' | 'airport-transfer'>('one-way');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [passengers, setPassengers] = useState('');
  const [bags, setBags] = useState('');
  const [childSeat, setChildSeat] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [company, setCompany] = useState(''); // honeypot
  const [modalPayload, setModalPayload] = useState<ContactPayload | null>(null);

  const selectedVehicle = vehicles.find((v) => v.id === vehicleId);
  const maxPassengers = selectedVehicle?.passengers ?? 0;
  const maxBags = selectedVehicle?.bags ?? 0;

  // Live estimate. The contact form has no hours field, so the hourly service
  // shows the vehicle's hourly rate; one-way / airport transfer detects the
  // Milano–Malpensa fixed fare from the addresses.
  const liveEstimate = estimate({
    tripType: serviceType === 'hourly' ? 'hourly' : 'one-way',
    vehicle: selectedVehicle ?? null,
    from,
    to,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const car = params.get('car');
    if (car && vehicles.some((v) => v.id === car)) {
      setVehicleId(car);
    }
  }, []);

  useEffect(() => {
    if (passengers && Number(passengers) > maxPassengers) setPassengers('');
    if (bags && Number(bags) > maxBags) setBags('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleId]);

  const f = t.contactPage.form;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company) return; // bot caught by honeypot
    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !from.trim() ||
      !to.trim() ||
      !date.trim() ||
      !time.trim() ||
      !selectedVehicle
    ) {
      setError(t.formErrors.required);
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError(t.formErrors.invalidEmail);
      return;
    }
    if (dateError) {
      setError(t.formErrors.invalidDate);
      return;
    }
    setError(null);

    setModalPayload({
      kind: 'contact',
      serviceType,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      from: from.trim(),
      to: to.trim(),
      date: date.trim(),
      time: time.trim(),
      vehicle: selectedVehicle.name,
      passengers: passengers.trim() || undefined,
      bags: bags.trim() || undefined,
      childSeat,
      notes: message.trim() || undefined,
    });
  };

  const info: Array<{ icon: LucideIcon; label: string; value: string; href?: string }> = [
    { icon: MapPin, label: t.contactPage.info.address, value: t.contactPage.info.addressValue },
    { icon: Phone, label: t.contactPage.info.phone, value: t.contactPage.info.phoneValue, href: `tel:${SITE.phone}` },
    { icon: Mail, label: t.contactPage.info.email, value: t.contactPage.info.emailValue, href: `mailto:${SITE.email}` },
    { icon: Clock, label: t.contactPage.info.availability, value: t.contactPage.info.availabilityValue },
  ];

  return (
    <>
      <PageHero
        label={t.contactPage.label}
        title={t.contactPage.title}
        description={t.contactPage.description}
        image={IMAGES.pageHeroes.contact}
      />
      <section className="py-12 md:py-16 bg-white">
        <div className="container-x">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
            <form
              onSubmit={onSubmit}
              noValidate
              className="flex flex-col gap-4 max-w-4xl mx-auto w-full bg-white border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-md)]"
            >
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
              />

              <h3 className="text-xl font-medium text-black">{f.bookingDetails}</h3>

              <div>
                <span className="block text-sm text-[var(--color-ink)] mb-1.5">{f.serviceType}</span>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setServiceType('one-way')}
                    className={`${chipBase} ${serviceType === 'one-way' ? 'border-black bg-white' : 'border-black/10 hover:bg-black/5'}`}
                  >
                    {t.bookingForm.oneWay}
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceType('hourly')}
                    className={`${chipBase} ${serviceType === 'hourly' ? 'border-black bg-white' : 'border-black/10 hover:bg-black/5'}`}
                  >
                    {t.bookingForm.hourly}
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceType('airport-transfer')}
                    className={`${chipBase} ${serviceType === 'airport-transfer' ? 'border-black bg-white' : 'border-black/10 hover:bg-black/5'}`}
                  >
                    {f.airportTransfer}
                  </button>
                </div>
              </div>

              <fieldset className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                <label className={fieldShell}>
                  <span className={labelClass}>{t.contactPage.name} {requiredMark}</span>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={f.namePlaceholder}
                    aria-required="true"
                    className={inputClass}
                  />
                </label>
                <label className={fieldShell}>
                  <span className={labelClass}>{t.contactPage.email} {requiredMark}</span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={f.emailPlaceholder}
                    aria-required="true"
                    className={inputClass}
                  />
                </label>
                <label className={`${fieldShell} col-span-2 max-[600px]:col-span-1`}>
                  <span className={labelClass}>{t.contactPage.phone} {requiredMark}</span>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={f.phonePlaceholder}
                    aria-required="true"
                    className={inputClass}
                  />
                </label>
              </fieldset>

              <fieldset className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                <label className={fieldShell}>
                  <span className={labelClass}>{t.bookingForm.from} {requiredMark}</span>
                  <div className="relative w-full">
                    <input
                      id="from"
                      type="text"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      placeholder={f.addressPlaceholder}
                      autoComplete="off"
                      aria-required="true"
                      className={inputClass}
                    />
                  </div>
                </label>
                <label className={fieldShell}>
                  <span className={labelClass}>{t.bookingForm.to} {requiredMark}</span>
                  <div className="relative w-full">
                    <input
                      id="to"
                      type="text"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder={f.addressPlaceholder}
                      autoComplete="off"
                      aria-required="true"
                      className={inputClass}
                    />
                  </div>
                </label>
                <label className={fieldShell}>
                  <span className={labelClass}>{t.bookingForm.date} {requiredMark}</span>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setDateError(e.target.validity.badInput ? t.formErrors.invalidDate : null);
                    }}
                    onBlur={(e) =>
                      setDateError(e.target.validity.badInput ? t.formErrors.invalidDate : null)
                    }
                    aria-required="true"
                    aria-invalid={dateError ? true : undefined}
                    className={`${inputClass} cursor-pointer ${dateError ? 'border-red-600 focus:border-red-600' : ''}`}
                  />
                  {dateError && (
                    <span role="alert" className="text-xs text-red-600 mt-0.5">
                      {dateError}
                    </span>
                  )}
                </label>
                <label className={fieldShell}>
                  <span className={labelClass}>{f.pickupTime} {requiredMark}</span>
                  <input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    aria-required="true"
                    className={inputClass}
                  />
                </label>
              </fieldset>

              <fieldset className="grid grid-cols-3 gap-3 max-[600px]:grid-cols-1">
                <label className={fieldShell}>
                  <span className={labelClass}>{f.selectCarLabel} {requiredMark}</span>
                  <select
                    id="vehicle"
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    aria-required="true"
                      className={`${inputClass} cursor-pointer`}
                  >
                    <option value="">{f.selectPlaceholder}</option>
                    {vehicles.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={fieldShell}>
                  <span className={labelClass}>{f.passengers}</span>
                  <select
                    id="passengers"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    disabled={!selectedVehicle}
                    className={`${inputClass} cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <option value="">{selectedVehicle ? f.selectPlaceholder : f.selectCarFirst}</option>
                    {selectedVehicle &&
                      Array.from({ length: maxPassengers }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                  </select>
                </label>
                <label className={fieldShell}>
                  <span className={labelClass}>{f.bags}</span>
                  <select
                    id="bags"
                    value={bags}
                    onChange={(e) => setBags(e.target.value)}
                    disabled={!selectedVehicle}
                    className={`${inputClass} cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <option value="">{selectedVehicle ? f.selectPlaceholder : f.selectCarFirst}</option>
                    {selectedVehicle &&
                      Array.from({ length: maxBags + 1 }, (_, i) => i).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                  </select>
                </label>
              </fieldset>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  id="childSeat"
                  type="checkbox"
                  checked={childSeat}
                  onChange={(e) => setChildSeat(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-[var(--color-ink)]">{f.childSeat}</span>
              </label>

              <label className={fieldShell}>
                <span className="text-sm text-[var(--color-ink)]">{f.additionalNotes}</span>
                <textarea
                  id="message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={f.notesPlaceholder}
                  className={areaClass}
                />
              </label>

              {error && (
                <p
                  role="alert"
                  className="text-xs text-red-600 leading-relaxed"
                >
                  {error}
                </p>
              )}

              <QuoteEstimate estimate={liveEstimate} />

              <button type="submit" className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--color-ink)] text-white text-sm font-medium transition-colors hover:bg-[var(--color-ink-soft)] self-start disabled:opacity-60">
                {f.confirmBooking}
              </button>
            </form>

            <aside className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 sm:p-6 rounded-xl">
              <h3 className="text-lg font-light mb-5">{t.contactPage.infoTitle}</h3>
              <ul className="space-y-4">
                {info.map((i) => (
                  <li key={i.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center shrink-0">
                      <i.icon size={18} className="text-[var(--color-ink)]" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text-muted)] mb-1">
                        {i.label}
                      </div>
                      {i.href ? (
                        <a href={i.href} className="text-[var(--color-ink)] hover:text-[var(--color-text-muted)] transition-colors">
                          {i.value}
                        </a>
                      ) : (
                        <div className="text-[var(--color-ink)]">{i.value}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <QuoteChoiceModal
        open={modalPayload !== null}
        payload={modalPayload}
        honeypot={company}
        onClose={() => setModalPayload(null)}
      />
    </>
  );
}
