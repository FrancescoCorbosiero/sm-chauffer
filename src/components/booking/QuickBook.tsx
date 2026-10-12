'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CalendarDays, Check, Clock3, Flag, MapPin, Timer, Users } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import { POPULAR_PLACES } from '@/lib/places';
import { bookingHref, looksLikeAirport } from '@/lib/booking';
import { useToday } from '@/lib/hooks';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const PAX = Array.from({ length: 18 }, (_, i) => i + 1);

function Cell({
  icon,
  label,
  htmlFor,
  children,
}: {
  icon: ReactNode;
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="group relative flex flex-col gap-1 rounded-xl border border-line-strong bg-white px-4 pb-2.5 pt-2 transition-[border-color,box-shadow] duration-200 focus-within:border-ink focus-within:shadow-[0_0_0_3px_var(--color-gold-soft)] hover:border-ink/40">
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
      >
        <span className="text-gold-deep">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full min-w-0 appearance-none bg-transparent text-[16px] leading-6 text-ink placeholder:text-[#9a9aa2] focus:outline-none';

/**
 * Hero quick-booking card: trip type, route, date and time. It never
 * blocks — whatever is filled in travels to the full wizard on /contact,
 * which picks up from the first missing step.
 */
export default function QuickBook() {
  const t = useTranslation();
  const q = t.quickBook;
  const router = useRouter();
  const today = useToday();
  const uid = useId();
  const [type, setType] = useState<'one-way' | 'hourly'>('one-way');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [hours, setHours] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [pax, setPax] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const isHourly = type === 'hourly';
    router.push(
      bookingHref({
        type: isHourly ? 'hourly' : looksLikeAirport(from, to) ? 'airport-transfer' : 'one-way',
        from,
        to: isHourly ? '' : to,
        hours: isHourly ? hours : '',
        date,
        time,
        pax,
      }),
    );
  };

  const tab = (value: 'one-way' | 'hourly', label: string) => (
    <button
      type="button"
      role="radio"
      aria-checked={type === value}
      onClick={() => setType(value)}
      className={`h-10 rounded-full text-sm font-semibold transition-colors ${
        type === value ? 'bg-ink text-white shadow-sm' : 'text-muted hover:text-ink'
      }`}
    >
      {label}
    </button>
  );

  const listId = `${uid}-places`;

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl bg-white p-5 text-ink shadow-xl ring-1 ring-black/5 sm:p-7"
      aria-labelledby={`${uid}-title`}
    >
      <h2 id={`${uid}-title`} className="text-[1.75rem] leading-tight">
        {q.title}
      </h2>
      <p className="mt-1 text-sm text-muted">{q.subtitle}</p>

      <div role="radiogroup" aria-label={q.tripType} className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-ivory p-1">
        {tab('one-way', q.transfer)}
        {tab('hourly', q.hourly)}
      </div>

      <datalist id={listId}>
        {POPULAR_PLACES.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>

      <div className="mt-4 grid gap-2.5">
        <Cell icon={<MapPin size={13} aria-hidden />} label={t.bookingForm.from} htmlFor={`${uid}-from`}>
          <input
            id={`${uid}-from`}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            list={listId}
            autoComplete="off"
            placeholder={q.fromPlaceholder}
            className={inputClass}
          />
        </Cell>
        {type === 'one-way' ? (
          <Cell icon={<Flag size={13} aria-hidden />} label={t.bookingForm.to} htmlFor={`${uid}-to`}>
            <input
              id={`${uid}-to`}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              list={listId}
              autoComplete="off"
              placeholder={q.toPlaceholder}
              className={inputClass}
            />
          </Cell>
        ) : (
          <Cell icon={<Timer size={13} aria-hidden />} label={q.duration} htmlFor={`${uid}-hours`}>
            <select
              id={`${uid}-hours`}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">{q.durationPlaceholder}</option>
              {HOURS.map((h) => (
                <option key={h} value={String(h)}>
                  {(h === 1 ? q.hourOne : q.hourMany).replace('{n}', String(h))}
                </option>
              ))}
            </select>
          </Cell>
        )}
        <div className="grid grid-cols-2 gap-2.5">
          <Cell icon={<CalendarDays size={13} aria-hidden />} label={t.bookingForm.date} htmlFor={`${uid}-date`}>
            <input
              id={`${uid}-date`}
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            />
          </Cell>
          <Cell icon={<Clock3 size={13} aria-hidden />} label={t.bookingForm.time} htmlFor={`${uid}-time`}>
            <input
              id={`${uid}-time`}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            />
          </Cell>
        </div>
        <Cell icon={<Users size={13} aria-hidden />} label={q.passengers} htmlFor={`${uid}-pax`}>
          <select
            id={`${uid}-pax`}
            value={pax}
            onChange={(e) => setPax(e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">{q.passengersPlaceholder}</option>
            {PAX.map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
        </Cell>
      </div>

      <button type="submit" className="btn btn-primary btn-lg btn-block mt-5">
        {q.submit}
        <ArrowRight size={18} aria-hidden />
      </button>

      <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[13px] text-muted">
        {[q.free, q.noCard, t.status.reply].map((item) => (
          <li key={item} className="inline-flex items-center gap-1.5">
            <Check size={14} aria-hidden className="text-gold-deep" />
            {item}
          </li>
        ))}
      </ul>
    </form>
  );
}
