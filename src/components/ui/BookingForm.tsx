'use client';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import QuoteChoiceModal from './QuoteChoiceModal';
import QuoteEstimate from './QuoteEstimate';
import { vehicles } from '@/lib/data';
import { estimate, parseHours } from '@/lib/pricing';
import type { BookingPayload } from '@/lib/quoteMessage';

type TripType = 'one-way' | 'hourly';

const requiredMark = <span aria-hidden className="text-[var(--color-ink)] ml-0.5">*</span>;

export default function BookingForm() {
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<TripType>('one-way');
  const [vehicle, setVehicle] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [hours, setHours] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState(''); // honeypot
  const [modalPayload, setModalPayload] = useState<BookingPayload | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company) return; // bot caught by honeypot
    // On the hourly tab the second field is the duration, not a destination.
    const secondField = activeTab === 'one-way' ? to : hours;
    if (!vehicle.trim() || !from.trim() || !secondField.trim() || !date.trim() || !time.trim()) {
      setError(t.formErrors.required);
      return;
    }
    setError(null);
    setModalPayload({
      kind: 'booking',
      tripType: activeTab,
      vehicle,
      from,
      to: secondField,
      date,
      time,
    });
  };

  // Live estimate. On the hourly tab the second field holds the duration.
  const selectedVehicle = vehicles.find((v) => v.name === vehicle) ?? null;
  const liveEstimate = estimate({
    tripType: activeTab,
    vehicle: selectedVehicle,
    from,
    to: activeTab === 'one-way' ? to : undefined,
    durationHours: activeTab === 'hourly' ? parseHours(hours) : undefined,
  });

  const tabBase =
    'rounded-lg py-2.5 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)]/30';
  const tabActive = 'bg-white text-[var(--color-ink)] shadow-[var(--shadow-sm)]';
  const tabInactive = 'text-[var(--color-text-muted)] hover:text-[var(--color-ink)]';

  const cellClass =
    'block rounded-xl border border-[var(--color-border)] px-4 py-2.5 transition-colors focus-within:border-[var(--color-ink)] hover:border-[var(--color-ink)]/40';
  const cellLabel =
    'block text-[10px] uppercase tracking-[0.28em] text-[var(--color-text-muted)] mb-1';
  const cellInput =
    'block w-full bg-transparent text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-text-faint)] focus:outline-none';

  return (
    <>
      <form
        onSubmit={onSubmit}
        noValidate
        className="bg-white border border-[var(--color-border)] p-6 sm:p-8 rounded-2xl shadow-[var(--shadow-lg)]"
      >
        <div
          role="tablist"
          aria-label={t.bookingForm.title}
          className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-[var(--color-surface-2)] p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'one-way'}
            onClick={() => setActiveTab('one-way')}
            className={`${tabBase} ${activeTab === 'one-way' ? tabActive : tabInactive}`}
          >
            {t.bookingForm.oneWay}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'hourly'}
            onClick={() => setActiveTab('hourly')}
            className={`${tabBase} ${activeTab === 'hourly' ? tabActive : tabInactive}`}
          >
            {t.bookingForm.hourly}
          </button>
        </div>

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

        <div className="space-y-3">
          <label htmlFor="bf-vehicle" className={cellClass}>
            <span className={cellLabel}>
              {t.bookingForm.vehicle}{requiredMark}
            </span>
            <select
              id="bf-vehicle"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              aria-required="true"
              className={`${cellInput} cursor-pointer`}
            >
              <option value="">{t.bookingForm.vehiclePlaceholder}</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label htmlFor="bf-from" className={cellClass}>
              <span className={cellLabel}>
                {t.bookingForm.from}{requiredMark}
              </span>
              <input
                id="bf-from"
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder={t.bookingForm.fromPlaceholder}
                aria-required="true"
                className={cellInput}
              />
            </label>
            {activeTab === 'one-way' ? (
              <label htmlFor="bf-to" className={cellClass}>
                <span className={cellLabel}>
                  {t.bookingForm.to}{requiredMark}
                </span>
                <input
                  id="bf-to"
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder={t.bookingForm.toPlaceholder}
                  aria-required="true"
                  className={cellInput}
                />
              </label>
            ) : (
              <label htmlFor="bf-hours" className={cellClass}>
                <span className={cellLabel}>
                  {t.bookingForm.duration}{requiredMark}
                </span>
                <input
                  id="bf-hours"
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder={t.bookingForm.durationPlaceholder}
                  aria-required="true"
                  className={cellInput}
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label htmlFor="bf-date" className={cellClass}>
              <span className={cellLabel}>
                {t.bookingForm.date}{requiredMark}
              </span>
              <input
                id="bf-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-required="true"
                className={`${cellInput} cursor-pointer`}
              />
            </label>
            <label htmlFor="bf-time" className={cellClass}>
              <span className={cellLabel}>
                {t.bookingForm.time}{requiredMark}
              </span>
              <input
                id="bf-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                aria-required="true"
                className={cellInput}
              />
            </label>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-xs text-red-600 leading-relaxed">
            {error}
          </p>
        )}

        <QuoteEstimate estimate={liveEstimate} className="mt-5" />

        <button
          type="submit"
          className="group w-full mt-6 inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-white rounded-xl py-4 text-sm font-medium uppercase tracking-[0.22em] hover:bg-[var(--color-ink-soft)] transition-colors"
        >
          {t.bookingForm.submit}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>

      <QuoteChoiceModal
        open={modalPayload !== null}
        payload={modalPayload}
        honeypot={company}
        onClose={() => setModalPayload(null)}
      />
    </>
  );
}
