'use client';
import { Star } from 'lucide-react';
import { Testimonial } from '@/lib/types';
import { useTranslation } from '@/i18n/LanguageProvider';

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const t = useTranslation();
  const text = t.testimonials[testimonial.id]?.text ?? '';
  const stars = Math.max(0, Math.min(5, testimonial.rating));
  const starsAria = t.testimonialsSection.starsAria.replace('{n}', String(stars));

  return (
    <article className="flex flex-col h-full p-8 bg-white border border-[var(--color-border)] rounded-xl">
      <div className="flex items-center gap-1 mb-5" aria-label={starsAria}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < stars
                ? 'fill-[var(--color-ink)] text-[var(--color-ink)]'
                : 'text-[var(--color-text-faint)]'
            }
          />
        ))}
      </div>
      <p className="text-[15px] leading-relaxed text-[var(--color-ink)] flex-1">
        “{text}”
      </p>
      <footer className="mt-6 pt-5 border-t border-[var(--color-divider)] flex items-center justify-between">
        <span className="text-sm text-[var(--color-ink)] font-medium">
          {testimonial.name}
        </span>
        {testimonial.source && (
          <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-faint)]">
            {testimonial.source}
          </span>
        )}
      </footer>
    </article>
  );
}
