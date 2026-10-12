'use client';

import type { ReactNode } from 'react';
import { CalendarDays, Clock3, Plane } from 'lucide-react';
import { Chip, List, ListInput, Segmented, SegmentedButton } from 'konsta/react';
import { QUICK_DESTINATIONS } from '@/lib/places';
import { looksLikeAirport, type ServiceType } from '@/lib/booking';
import RouteFields from '../RouteFields';
import CountStepper from '../CountStepper';
import { FieldLabel, fieldError, inputClass, listClass } from '../fields';
import type { BookingForm } from '../useBookingForm';

const TYPES: ServiceType[] = ['one-way', 'airport-transfer', 'hourly'];
const isAirportValue = (value: string) => /Aeroporto/.test(value);

/** Step 1: service type, route (or hours), date and time, flight number. */
export default function TripStep({ form, map }: { form: BookingForm; map: ReactNode }) {
  const { t, draft, set, errors, isHourly, isAirport, hours, today, tomorrow } = form;
  const b = t.booking;

  const toAirport = (value: string) => {
    if (draft.type === 'one-way' && isAirportValue(value)) set('type', 'airport-transfer');
  };

  return (
    <div className="grid gap-4">
      {map}

      <Segmented strong rounded role="group" aria-label={t.contactPage.form.serviceType} className="!bg-ivory-2">
        {TYPES.map((type) => (
          <SegmentedButton
            key={type}
            active={draft.type === type}
            aria-pressed={draft.type === type}
            onClick={() => set('type', type)}
            className="!text-[14px]"
          >
            {form.typeLabel(type)}
          </SegmentedButton>
        ))}
      </Segmented>

      <RouteFields
        from={draft.from}
        to={draft.to}
        showTo={!isHourly}
        airportsFirst={isAirport}
        errors={{ from: errors.from, to: errors.to }}
        onChange={(which, value) => {
          set(which, value);
          if (which === 'to' && draft.type === 'one-way' && looksLikeAirport(value)) set('type', 'airport-transfer');
        }}
        onSwap={() => form.setDraft((d) => ({ ...d, from: d.to, to: d.from }))}
        onPicked={(_, place) => {
          if (place.kind === 'airport' && draft.type === 'one-way') set('type', 'airport-transfer');
        }}
        toSlot={
          <div className="flex items-center justify-between gap-3 py-2.5" data-field="hours" tabIndex={-1}>
            <div>
              <p className="text-[12px] font-medium text-muted">{t.quickBook.duration}</p>
              <p className="mt-1 text-[16px] font-medium text-ink tabular">{hours ? form.hoursLabel(hours) : '—'}</p>
              {errors.hours && (
                <p role="alert" className="mt-0.5 text-[12px] font-medium text-[#b42318]">
                  {errors.hours}
                </p>
              )}
            </div>
            <CountStepper
              label={t.quickBook.duration}
              value={hours ?? 0}
              min={1}
              max={12}
              display={hours ? `${hours} h` : '–'}
              onChange={(n) => set('hours', String(Math.max(1, n)))}
            />
          </div>
        }
      />

      {!isHourly && !draft.to && (
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {QUICK_DESTINATIONS.map((q) => (
            <Chip
              key={q.value}
              outline
              component="button"
              onClick={() => {
                set('to', q.value);
                toAirport(q.value);
              }}
              className="!m-0 shrink-0 !border-line-strong !bg-white !text-ink"
              media={isAirportValue(q.value) ? <Plane size={13} aria-hidden /> : undefined}
            >
              {q.label}
            </Chip>
          ))}
        </div>
      )}

      <List strong inset className={listClass}>
        <ListInput
          label={
            <FieldLabel htmlFor={form.fid('date')} icon={<CalendarDays size={13} aria-hidden />}>
              {t.bookingForm.date}
            </FieldLabel>
          }
          error={fieldError(form, 'date')}
          input={
            <input
              id={form.fid('date')}
              data-field="date"
              type="date"
              value={draft.date}
              min={today}
              onChange={(e) => set('date', e.target.value)}
              className={inputClass}
              {...form.aria('date')}
            />
          }
        />
        <ListInput
          label={
            <FieldLabel htmlFor={form.fid('time')} icon={<Clock3 size={13} aria-hidden />}>
              {t.contactPage.form.pickupTime}
            </FieldLabel>
          }
          error={fieldError(form, 'time')}
          input={
            <input
              id={form.fid('time')}
              data-field="time"
              type="time"
              step={300}
              value={draft.time}
              onChange={(e) => set('time', e.target.value)}
              className={inputClass}
              {...form.aria('time')}
            />
          }
        />
        {isAirport && (
          <ListInput
            label={
              <FieldLabel htmlFor={form.fid('flight')} icon={<Plane size={13} aria-hidden />}>
                {b.flight}
              </FieldLabel>
            }
            info={b.flightInfo}
            input={
              <input
                id={form.fid('flight')}
                value={draft.flight}
                onChange={(e) => set('flight', e.target.value.toUpperCase())}
                placeholder={b.flightPlaceholder}
                autoComplete="off"
                autoCapitalize="characters"
                maxLength={12}
                className={inputClass}
              />
            }
          />
        )}
      </List>

      {today && tomorrow && (
        <div className="-mt-1.5 flex gap-2 px-1">
          {[
            { label: b.today, value: today },
            { label: b.tomorrow, value: tomorrow },
          ].map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => set('date', d.value)}
              aria-pressed={draft.date === d.value}
              className={`rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                draft.date === d.value ? 'bg-ink text-white' : 'bg-white text-ink active:bg-ivory-2'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
