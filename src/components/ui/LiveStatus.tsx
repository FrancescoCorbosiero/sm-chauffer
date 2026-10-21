'use client';

import { useSyncExternalStore } from 'react';
import { useTranslation } from '@/i18n/LanguageProvider';

/**
 * "Available now · Milan 14:32" — the small "someone is actually there"
 * signal. The service runs 24/7, so the status is always on; the clock is
 * Milan time, read from a tiny external store so the server render (no
 * time) and the client render never disagree during hydration.
 */

const timeFmt = new Intl.DateTimeFormat('it-IT', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Rome',
});

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}

const getTime = () => timeFmt.format(new Date());
const getServerTime = () => null;

export function useMilanTime(): string | null {
  return useSyncExternalStore(subscribe, getTime, getServerTime);
}

export default function LiveStatus({
  showTime = true,
  label,
  className = '',
}: {
  showTime?: boolean;
  /** Override the default "Available now" label. */
  label?: string;
  className?: string;
}) {
  const t = useTranslation();
  const time = useMilanTime();

  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <span className="live-dot" aria-hidden />
      <span>{label ?? t.status.available}</span>
      {showTime && (
        <span className="tabular" suppressHydrationWarning>
          · {t.status.city} {time ?? '--:--'}
        </span>
      )}
    </span>
  );
}
