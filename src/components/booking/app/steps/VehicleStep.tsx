'use client';

import { Baby, Briefcase, Users } from 'lucide-react';
import { List, ListItem, Toggle } from 'konsta/react';
import { vehicles } from '@/lib/data';
import { fits } from '@/lib/fleet';
import VehicleOptions from '../VehicleOptions';
import CountStepper from '../CountStepper';
import { listClass } from '../fields';
import type { BookingForm } from '../useBookingForm';

/** Step 2: who travels, and in which car (priced for this trip). */
export default function VehicleStep({ form }: { form: BookingForm }) {
  const { t, draft, set, errors, pax, bags } = form;
  const w = t.wizard;

  return (
    <div className="grid gap-4">
      <List strong inset className={listClass}>
        <ListItem
          title={
            <span className="inline-flex items-center gap-2">
              <Users size={16} aria-hidden className="text-muted" />
              {t.quickBook.passengers}
            </span>
          }
          after={
            <CountStepper label={t.quickBook.passengers} value={pax} min={1} max={18} onChange={(n) => set('pax', String(n))} />
          }
        />
        <ListItem
          title={
            <span className="inline-flex items-center gap-2">
              <Briefcase size={16} aria-hidden className="text-muted" />
              {t.contactPage.form.bags}
            </span>
          }
          after={
            <CountStepper label={t.contactPage.form.bags} value={bags} min={0} max={18} onChange={(n) => set('bags', String(n))} />
          }
        />
      </List>

      <VehicleOptions
        value={draft.car}
        pax={pax}
        bags={bags}
        priceFor={form.priceFor}
        onChange={(id) => {
          set('car', id);
          const v = vehicles.find((x) => x.id === id);
          if (v && !fits(v, pax, bags)) form.setErrors((e) => ({ ...e, capacity: w.errors.capacity }));
        }}
        error={errors.car ?? errors.capacity}
      />

      <List strong inset className={listClass}>
        <ListItem
          label
          title={
            <span className="inline-flex items-center gap-2">
              <Baby size={16} aria-hidden className="text-muted" />
              {t.contactPage.form.childSeat}
            </span>
          }
          text={w.childSeatHint}
          after={<Toggle checked={draft.childSeat} onChange={() => set('childSeat', !draft.childSeat)} />}
        />
      </List>
    </div>
  );
}
