'use client';

import { Minus, Plus } from 'lucide-react';

/** iOS-style −/+ pill for small counts (passengers, bags, hours). */
export default function CountStepper({
  value,
  min,
  max,
  onChange,
  label,
  display,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  /** Accessible name, e.g. "Passengers". */
  label: string;
  /** What is shown between the buttons (defaults to the number). */
  display?: string;
}) {
  const btn =
    'flex h-9 w-10 items-center justify-center text-ink transition-[background-color,opacity] active:bg-black/[0.06] disabled:opacity-30';
  return (
    <div role="group" aria-label={label} className="inline-flex shrink-0 items-center rounded-full bg-ivory">
      <button
        type="button"
        className={`${btn} rounded-l-full`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`${label} −1`}
      >
        <Minus size={16} aria-hidden />
      </button>
      <output aria-live="polite" className="min-w-8 text-center text-[16px] font-semibold text-ink tabular">
        {display ?? value}
      </output>
      <button
        type="button"
        className={`${btn} rounded-r-full`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`${label} +1`}
      >
        <Plus size={16} aria-hidden />
      </button>
    </div>
  );
}
