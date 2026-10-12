import type { ReactNode } from 'react';
import type { BookingForm, Errors } from './useBookingForm';

/** A plain input styled like Konsta's ListInput field (passed as its `input`). */
export const inputClass =
  'block h-10 w-full appearance-none bg-transparent text-[16px] text-ink placeholder:text-[#9a9aa2] focus:outline-none';

/** Konsta inset lists inside the flow: no outer margins, tighter rows. */
export const listClass = '!my-0 !mx-0 [&_.k-list-input]:!py-0';

/** A field label with a small leading icon. */
export function IconLabel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      {children}
    </span>
  );
}

/** The error under a field, linked by id to its input's aria-describedby. */
export function fieldError(form: BookingForm, key: keyof Errors) {
  const message = form.errors[key];
  return message ? (
    <span id={`${form.fid(key)}-error`} role="alert">
      {message}
    </span>
  ) : undefined;
}
