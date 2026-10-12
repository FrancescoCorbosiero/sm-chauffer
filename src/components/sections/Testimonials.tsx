'use client';
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import Stars from '@/components/ui/Stars';
import { testimonials } from '@/lib/data';

/** One review at a time, set large, with the overall rating alongside. */
export default function Testimonials() {
  const t = useTranslation();
  const s = t.testimonialsSection;
  const [i, setI] = useState(0);
  const count = testimonials.length;
  const current = testimonials[i];
  const text = t.testimonials[current.id]?.text ?? '';
  const go = (d: 1 | -1) => setI((n) => (n + d + count) % count);
  const btn =
    'flex h-12 w-12 items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white';

  return (
    <section className="section-y bg-white">
      <div className="container-x">
        <div className="reveal flex flex-wrap items-center justify-between gap-6 border-b border-line-strong pb-6">
          <p className="eyebrow">{s.label}</p>
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl leading-none text-ink tabular">5.0</span>
            <Stars size={16} label={s.starsAria.replace('{n}', '5')} />
            <span className="text-sm text-muted">{s.ratingLabel}</span>
          </div>
        </div>

        <figure className="reveal mt-12 lg:mt-16" aria-live="polite">
          <blockquote key={current.id} className="step-in max-w-5xl">
            <p className="font-display text-[1.9rem] leading-[1.2] text-ink sm:text-[2.6rem] lg:text-[3.1rem]">
              &ldquo;{text}&rdquo;
            </p>
          </blockquote>
          <figcaption className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <span className="text-[15px] text-ink">
              <span className="font-semibold">{current.name}</span>
              <span className="text-muted"> · {current.source}</span>
            </span>
            <span className="flex items-center gap-3">
              <span className="mr-2 text-sm text-muted tabular">
                {i + 1} / {count}
              </span>
              <button type="button" onClick={() => go(-1)} aria-label={t.common.previous} className={btn}>
                <ArrowLeft size={18} aria-hidden />
              </button>
              <button type="button" onClick={() => go(1)} aria-label={t.common.next} className={btn}>
                <ArrowRight size={18} aria-hidden />
              </button>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
