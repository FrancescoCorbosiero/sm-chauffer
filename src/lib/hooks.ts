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

/** A media query's live result; `false` during prerender. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** Animations may run: `false` during prerender and with reduced motion. */
export const useMotionAllowed = () => useMediaQuery('(prefers-reduced-motion: no-preference)');
