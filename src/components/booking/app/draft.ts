import { EMPTY_DRAFT, type BookingDraft } from '@/lib/booking';

/**
 * The booking draft lives in sessionStorage for the tab, so closing the sheet
 * or detouring to the fleet page loses nothing; it is cleared once a request
 * is sent by email.
 */

const STORAGE_KEY = 'tld.booking-draft';

export type Step = 0 | 1 | 2 | 3;
export const STEP_COUNT = 4;

export function readDraft(): Partial<BookingDraft> {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<BookingDraft>) : {};
  } catch {
    return {}; // storage unavailable (private mode, blocked)
  }
}

export function writeDraft(draft: BookingDraft): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // ignore storage failures
  }
}

export function clearDraft(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function tripComplete(d: BookingDraft): boolean {
  return Boolean(d.from.trim() && (d.type === 'hourly' ? d.hours : d.to.trim()) && d.date && d.time);
}

/**
 * Where a session starts: the hand-off (a CTA's query string) wins over the
 * saved draft. A complete trip from the hand-off skips to the vehicle step,
 * or to the details when the vehicle came with it.
 */
export function startFrom(handoff: Partial<BookingDraft>): { draft: BookingDraft; step: Step } {
  const draft: BookingDraft = { ...EMPTY_DRAFT, ...readDraft(), ...handoff };
  const fromHandoff = Object.keys(handoff).length > 0;
  if (fromHandoff && tripComplete(draft)) return { draft, step: draft.car ? 2 : 1 };
  return { draft, step: 0 };
}
