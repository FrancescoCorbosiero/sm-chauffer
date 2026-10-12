'use client';
import { Quote } from 'lucide-react';
import type { Testimonial } from '@/lib/types';
import { useTranslation } from '@/i18n/LanguageProvider';
import Stars from './Stars';

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const t = useTranslation();
  const text = t.testimonials[testimonial.id]?.text ?? '';
  const stars = Math.max(0, Math.min(5, testimonial.rating));

  return (
    <figure className="card flex h-full flex-col p-7">
      <div className="flex items-center justify-between">
        <Stars value={stars} label={t.testimonialsSection.starsAria.replace('{n}', String(stars))} />
        <Quote size={28} aria-hidden className="text-gold/50" />
      </div>
      <blockquote className="mt-5 flex-1 text-[1.0625rem] leading-relaxed text-ink">
        <p>&ldquo;{text}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
        <span className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-display text-lg text-gold"
          >
            {testimonial.name.charAt(0)}
          </span>
          <span className="text-[15px] font-semibold text-ink">{testimonial.name}</span>
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">{testimonial.source}</span>
      </figcaption>
    </figure>
  );
}
