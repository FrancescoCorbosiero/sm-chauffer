'use client';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/lib/types';
import { useTranslation } from '@/i18n/LanguageProvider';

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const t = useTranslation();
  const text = t.testimonials[testimonial.id]?.text ?? '';
  const stars = Math.max(0, Math.min(5, testimonial.rating));
  const starsAria = t.testimonialsSection.starsAria.replace('{n}', String(stars));

  return (
    <article className="group relative flex flex-col h-full p-8 bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.06)] hover:border-[var(--color-ink)]/15">
      <Quote
        aria-hidden
        size={56}
        className="absolute -top-2 -right-2 text-[var(--color-ink)]/[0.06] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
      />
      <div className="relative flex items-center gap-1 mb-5" aria-label={starsAria}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < stars
                ? 'fill-[var(--color-accent)] text-[var(--color-accent)]'
                : 'text-[var(--color-text-faint)]'
            }
          />
        ))}
      </div>
      <p className="relative text-[15px] leading-relaxed text-[var(--color-ink)] flex-1">
        &ldquo;{text}&rdquo;
      </p>
      <footer className="relative mt-6 pt-5 border-t border-[var(--color-divider)] flex items-center justify-between">
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
