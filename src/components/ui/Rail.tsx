'use client';

import { Children, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';

/**
 * Horizontal scroll-snap rail. On phones it bleeds to the screen edges so
 * the next card peeks in (swipe affordance); on desktop it shows three
 * cards with previous/next buttons. `layout="grid-lg"` turns it into a
 * plain three-column grid from the lg breakpoint instead.
 */
export default function Rail({
  children,
  label,
  itemClassName = 'w-[82%] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/3)]',
  arrows = true,
  tone = 'light',
  layout = 'rail',
}: {
  children: ReactNode;
  label: string;
  itemClassName?: string;
  arrows?: boolean;
  tone?: 'light' | 'dark';
  layout?: 'rail' | 'grid-lg';
}) {
  const t = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const start = el.scrollLeft < 8;
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    el.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      el.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const dark = tone === 'dark';
  const btn = `flex h-11 w-11 items-center justify-center rounded-full border transition-colors disabled:pointer-events-none disabled:opacity-30 ${
    dark
      ? 'border-white/20 text-white hover:border-white hover:bg-white hover:text-ink'
      : 'border-line-strong text-ink hover:border-ink hover:bg-ink hover:text-white'
  }`;
  const hasOverflow = !(edges.start && edges.end);
  const gridLg = layout === 'grid-lg';

  return (
    <div>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={`no-scrollbar relative -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-3 pt-1 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:scroll-px-0 lg:gap-6 lg:px-0 ${
          gridLg ? 'lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0' : ''
        }`}
      >
        {Children.map(children, (child) => (
          <div className={`shrink-0 snap-start ${itemClassName} ${gridLg ? 'lg:w-auto' : ''}`}>{child}</div>
        ))}
      </div>
      {arrows && hasOverflow && (
        <div className={`mt-6 hidden items-center justify-end gap-2 md:flex ${gridLg ? 'lg:hidden' : ''}`}>
          <button type="button" onClick={() => go(-1)} disabled={edges.start} aria-label={t.common.previous} className={btn}>
            <ArrowLeft size={18} aria-hidden />
          </button>
          <button type="button" onClick={() => go(1)} disabled={edges.end} aria-label={t.common.next} className={btn}>
            <ArrowRight size={18} aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
