'use client';
import { Minus, Plus } from 'lucide-react';

/** Numeric −/+ control with a live value (booking wizard, fleet finder). */
export default function Stepper({
  id,
  value,
  min,
  max,
  onChange,
  decLabel,
  incLabel,
  labelledBy,
}: {
  id: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  decLabel: string;
  incLabel: string;
  /** id of the visible label, announced with the value. */
  labelledBy?: string;
}) {
  const btn =
    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line-strong text-ink transition-colors hover:border-ink disabled:opacity-35 disabled:hover:border-line-strong';
  return (
    <div className="flex items-center gap-2">
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={decLabel}>
        <Minus size={16} aria-hidden />
      </button>
      <output
        id={id}
        aria-live="polite"
        aria-labelledby={labelledBy}
        className="flex h-12 min-w-14 flex-1 items-center justify-center rounded-xl bg-ivory font-display text-2xl text-ink tabular"
      >
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={incLabel}>
        <Plus size={16} aria-hidden />
      </button>
    </div>
  );
}
