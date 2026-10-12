'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { LOCALES, LOCALE_NAMES, LOCALE_SHORT, type Locale } from '@/i18n/types';

/**
 * Language picker. `dropdown` is the compact pill used in the header and
 * top bar (on ink); `grid` lays every language out as tappable pills for
 * the mobile menu.
 */
export default function LanguageSwitcher({
  variant = 'dropdown',
  align = 'right',
  onPick,
}: {
  variant?: 'dropdown' | 'grid';
  align?: 'left' | 'right';
  onPick?: () => void;
}) {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (l: Locale) => {
    setLocale(l);
    setOpen(false);
    onPick?.();
  };

  if (variant === 'grid') {
    return (
      <div role="group" aria-label={t.languageSwitcher.aria} className="grid grid-cols-4 gap-2">
        {LOCALES.map((l) => {
          const active = l === locale;
          return (
            <button
              key={l}
              type="button"
              lang={l}
              onClick={() => pick(l)}
              aria-pressed={active}
              title={LOCALE_NAMES[l]}
              className={`flex h-11 items-center justify-center rounded-full border text-sm font-semibold tracking-wide transition-colors ${
                active
                  ? 'border-gold bg-gold text-ink'
                  : 'border-white/15 text-white/80 hover:border-white/50 hover:text-white'
              }`}
            >
              {LOCALE_SHORT[l]}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${t.languageSwitcher.aria}: ${LOCALE_NAMES[locale]}`}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-2.5 text-[13px] font-semibold tracking-wide text-white/85 transition-colors hover:border-white/40 hover:text-white sm:px-3"
      >
        <Globe size={15} aria-hidden className="hidden sm:block" />
        <span className="tabular">{LOCALE_SHORT[locale]}</span>
        <ChevronDown
          size={14}
          aria-hidden
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={t.languageSwitcher.aria}
          className={`absolute top-full z-[70] mt-2 min-w-[190px] overflow-clip rounded-xl border border-line bg-white py-1.5 text-ink shadow-lg ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {LOCALES.map((l) => {
            const active = l === locale;
            return (
              <li key={l} role="none">
                <button
                  type="button"
                  role="option"
                  lang={l}
                  aria-selected={active}
                  onClick={() => pick(l)}
                  className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm transition-colors ${
                    active ? 'bg-ivory font-semibold' : 'text-muted hover:bg-ivory hover:text-ink'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 text-[11px] font-semibold uppercase tracking-[0.16em] tabular">
                      {LOCALE_SHORT[l]}
                    </span>
                    <span>{LOCALE_NAMES[l]}</span>
                  </span>
                  {active && <Check size={15} aria-hidden className="text-gold-deep" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
