'use client';

import Link from 'next/link';
import { List, ListInput } from 'konsta/react';
import NameSign from '../NameSign';
import { FieldLabel, fieldError, inputClass, listClass } from '../fields';
import type { BookingForm } from '../useBookingForm';

/** Step 3: contact details; airport pickups preview the name sign. */
export default function DetailsStep({ form }: { form: BookingForm }) {
  const { t, draft, set, errors } = form;
  const w = t.wizard;

  return (
    <div className="grid gap-4">
      <List strong inset className={listClass}>
        <ListInput
          label={<FieldLabel htmlFor={form.fid('name')}>{t.contactPage.name}</FieldLabel>}
          error={fieldError(form, 'name')}
          input={
            <input
              id={form.fid('name')}
              data-field="name"
              value={draft.name}
              onChange={(e) => set('name', e.target.value)}
              autoComplete="name"
              enterKeyHint="next"
              placeholder={t.contactPage.form.namePlaceholder}
              className={inputClass}
              {...form.aria('name')}
            />
          }
        />
        <ListInput
          label={<FieldLabel htmlFor={form.fid('phone')}>{t.contactPage.phone}</FieldLabel>}
          error={fieldError(form, 'phone')}
          info={errors.phone ? undefined : w.phoneHint}
          input={
            <input
              id={form.fid('phone')}
              data-field="phone"
              type="tel"
              inputMode="tel"
              value={draft.phone}
              onChange={(e) => set('phone', e.target.value)}
              autoComplete="tel"
              enterKeyHint="next"
              placeholder={t.contactPage.form.phonePlaceholder}
              className={inputClass}
              {...form.aria('phone')}
            />
          }
        />
        <ListInput
          label={<FieldLabel htmlFor={form.fid('email')}>{t.contactPage.email}</FieldLabel>}
          error={fieldError(form, 'email')}
          input={
            <input
              id={form.fid('email')}
              data-field="email"
              type="email"
              inputMode="email"
              value={draft.email}
              onChange={(e) => set('email', e.target.value)}
              autoComplete="email"
              enterKeyHint="next"
              placeholder={t.contactPage.form.emailPlaceholder}
              className={inputClass}
              {...form.aria('email')}
            />
          }
        />
      </List>
      <List strong inset className={listClass}>
        <ListInput
          label={
            <FieldLabel htmlFor={form.fid('notes')}>
              {t.contactPage.form.additionalNotes} · {w.notesHint}
            </FieldLabel>
          }
          input={
            <textarea
              id={form.fid('notes')}
              rows={3}
              value={draft.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder={t.booking.notesPlaceholder}
              className={`${inputClass} h-auto resize-none py-2`}
            />
          }
        />
      </List>

      {form.isAirport && <NameSign name={draft.name} />}

      <p className="px-1 text-[12.5px] leading-relaxed text-muted">
        {w.privacyBefore}{' '}
        <Link href="/privacy-policy" target="_blank" className="font-semibold text-ink underline underline-offset-2">
          {w.privacyLink}
        </Link>
        {w.privacyAfter}
      </p>
    </div>
  );
}
