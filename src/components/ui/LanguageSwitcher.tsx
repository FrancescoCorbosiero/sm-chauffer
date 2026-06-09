'use client';

import { useEffect, useRef, useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { LOCALES, LOCALE_NAMES, LOCALE_SHORT, type Locale } from '@/i18n/types';

export default function LanguageSwitcher({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handlePick = (l: Locale) => {
    setLocale(l);
    setOpen(false);
  };

  const isDark = variant === 'dark';
  const buttonClass = isDark
    ? 'border-white/40 text-white hover:bg-white/10'
    : 'border-[var(--color-border)] text-[var(--color-ink)] hover:bg-[var(--color-surface)]';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.languageSwitcher.aria}
        title={t.languageSwitcher.aria}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium tracking-wide transition-colors ${buttonClass}`}
      >
        <Globe size={16} aria-hidden />
        <span className="tabular-nums">{LOCALE_SHORT[locale]}</span>
        <ChevronDown
          size={14}
          aria-hidden
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 min-w-[180px] z-[60] bg-white border border-[var(--color-border)] rounded-lg shadow-[var(--shadow-lg)] py-1.5"
        >
          {LOCALES.map((l) => {
            const active = l === locale;
            return (
              <li key={l}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => handlePick(l)}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2 text-sm transition-colors ${
                    active
                      ? 'text-[var(--color-ink)] bg-[var(--color-surface)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[11px] uppercase tracking-[0.2em] tabular-nums w-6 text-left">
                      {LOCALE_SHORT[l]}
                    </span>
                    <span>{LOCALE_NAMES[l]}</span>
                  </span>
                  {active && <Check size={14} aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
