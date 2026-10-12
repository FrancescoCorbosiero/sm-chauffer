'use client';

import { useId, useRef, useState, type ReactNode } from 'react';
import { ArrowUpDown, Building2, Landmark, MapPin, Plane, TrainFront, Waves, Globe2, X } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { pointName } from '@/lib/coverage';
import { searchPlaces, type Place, type PlaceKind } from '@/lib/places';

const KIND_ICON: Record<PlaceKind, typeof MapPin> = {
  airport: Plane,
  station: TrainFront,
  venue: Landmark,
  city: Building2,
  lake: Waves,
  intl: Globe2,
};

type Which = 'from' | 'to';

/**
 * Pickup and destination as one card, the way ride apps draw them: a ring
 * for the pickup, a square for the destination, a line between, the swap
 * button on the side. Free text is always accepted; while a field has focus
 * a list of known places (airports first for airport transfers) fills it in
 * one tap.
 */
export default function RouteFields({
  from,
  to,
  showTo,
  airportsFirst,
  errors,
  onChange,
  onSwap,
  onPicked,
  toSlot,
}: {
  from: string;
  to: string;
  /** False for hourly service: the second row is `toSlot` instead. */
  showTo: boolean;
  airportsFirst: boolean;
  errors: { from?: string; to?: string };
  onChange: (which: Which, value: string) => void;
  onSwap: () => void;
  /** A suggestion was chosen. */
  onPicked?: (which: Which, place: Place) => void;
  toSlot?: ReactNode;
}) {
  const { t, locale } = useLanguage();
  const b = t.booking;
  const uid = useId();
  const [focus, setFocus] = useState<Which | null>(null);
  const blurTimer = useRef<number | undefined>(undefined);
  const inputs = { from: useRef<HTMLInputElement>(null), to: useRef<HTMLInputElement>(null) };

  const query = focus === 'from' ? from : focus === 'to' ? to : '';
  const suggestions = focus ? searchPlaces(query, { airportsFirst, limit: 6 }) : [];
  const listId = `${uid}-suggestions`;

  const placeName = (p: Place) => (p.point ? pointName(p.point, locale) : (b.places[p.id as keyof typeof b.places] ?? p.value));

  const pick = (which: Which, p: Place) => {
    onChange(which, p.value);
    setFocus(null);
    onPicked?.(which, p);
    // Pickup chosen, destination still empty: carry on there.
    if (which === 'from' && showTo && !to) window.setTimeout(() => inputs.to.current?.focus(), 0);
  };

  const onFocus = (which: Which) => {
    window.clearTimeout(blurTimer.current);
    setFocus(which);
  };
  // Let a tap on a suggestion land before the list closes.
  const onBlur = () => {
    blurTimer.current = window.setTimeout(() => setFocus(null), 120);
  };

  const field = (which: Which, label: string, placeholder: string, value: string, error?: string) => {
    const id = `${uid}-${which}`;
    return (
      <div className="min-w-0 flex-1 py-2.5">
        <label htmlFor={id} className="block text-[12px] font-medium text-muted">
          {label}
        </label>
        <div className="relative">
          <input
            ref={inputs[which]}
            id={id}
            data-field={which}
            value={value}
            onChange={(e) => onChange(which, e.target.value)}
            onFocus={() => onFocus(which)}
            onBlur={onBlur}
            placeholder={placeholder}
            autoComplete="off"
            enterKeyHint="next"
            role="combobox"
            aria-expanded={focus === which && suggestions.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className="block h-9 w-full appearance-none bg-transparent pr-7 text-[16px] text-ink placeholder:text-[#9a9aa2] focus:outline-none"
          />
          {value && focus === which && (
            <button
              type="button"
              tabIndex={-1}
              aria-label={b.clear}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(which, '');
                inputs[which].current?.focus();
              }}
              className="absolute right-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white"
            >
              <X size={13} aria-hidden />
            </button>
          )}
        </div>
        {error && (
          <p id={`${id}-error`} role="alert" className="mt-0.5 text-[12px] font-medium text-[#b42318]">
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="relative flex rounded-3xl bg-white pl-4 pr-2 shadow-[0_1px_0_rgba(12,12,14,0.04)]">
        {/* Ring → line → square */}
        <div aria-hidden className="flex w-5 shrink-0 flex-col items-center pt-[1.9rem] pb-[1.65rem]">
          <span className="h-3 w-3 rounded-full border-[3px] border-ink" />
          <span className="my-1 w-px flex-1 border-l-2 border-dotted border-ink/30" />
          {showTo ? <span className="h-3 w-3 rounded-[3px] bg-ink" /> : <span className="h-3 w-3 rounded-full bg-ink" />}
        </div>
        <div className="min-w-0 flex-1 pl-3">
          {field('from', t.bookingForm.from, t.quickBook.fromPlaceholder, from, errors.from)}
          <div className="hairline-b relative" />
          {showTo ? field('to', t.bookingForm.to, t.quickBook.toPlaceholder, to, errors.to) : toSlot}
        </div>
        {showTo && (
          <div className="flex shrink-0 items-center pl-1">
            <button
              type="button"
              onClick={onSwap}
              aria-label={t.wizard.swap}
              title={t.wizard.swap}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory text-ink transition-colors active:bg-ivory-2"
            >
              <ArrowUpDown size={17} aria-hidden />
            </button>
          </div>
        )}
      </div>

      {focus && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          aria-label={b.suggestions}
          className="step-in mt-2 overflow-clip rounded-3xl bg-white py-1"
        >
          {suggestions.map((p) => {
            const Icon = KIND_ICON[p.kind];
            return (
              <li key={p.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(focus, p)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors active:bg-ivory hover:bg-ivory/70"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory text-ink">
                    <Icon size={16} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium text-ink">{placeName(p)}</span>
                    <span className="block truncate text-[12.5px] text-muted">
                      {b.kinds[p.kind]}
                      {p.code ? ` · ${p.code}` : ''}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
