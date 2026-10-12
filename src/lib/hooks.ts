'use client';

import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

/** Local calendar date as YYYY-MM-DD. */
export function isoDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * Today's date on the client, `undefined` during prerender — pages are
 * built statically, so a server-computed "today" would be the build date.
 */
export function useToday(): string | undefined {
  return useSyncExternalStore(noopSubscribe, () => isoDate(new Date()), () => undefined);
}
