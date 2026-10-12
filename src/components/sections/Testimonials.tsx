'use client';
import { useTranslation } from '@/i18n/LanguageProvider';
import SectionHeading from '@/components/ui/SectionHeading';
import TestimonialCard from '@/components/ui/TestimonialCard';
import Rail from '@/components/ui/Rail';
import Stars from '@/components/ui/Stars';
import { testimonials } from '@/lib/data';

export default function Testimonials() {
  const t = useTranslation();
  const s = t.testimonialsSection;
  const sources = Array.from(new Set(testimonials.map((x) => x.source)));

  return (
    <section className="section-y bg-white">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="reveal min-w-0 lg:col-span-4">
          <SectionHeading eyebrow={s.label} title={s.title} accent={s.accent} description={s.description} />
          <div className="mt-8 rounded-2xl border border-line bg-ivory p-7">
            <div className="flex items-end gap-4">
              <span className="font-display text-6xl leading-none text-ink tabular">5.0</span>
              <Stars size={18} className="mb-1.5" label={s.starsAria.replace('{n}', '5')} />
            </div>
            <p className="mt-3 text-sm text-muted">{s.ratingLabel}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {sources.map((src) => (
                <li key={src} className="chip pointer-events-none">
                  {src}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="reveal min-w-0 lg:col-span-8 lg:pt-2">
          <Rail label={s.label} itemClassName="w-[85%] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-1.5rem)/2)]">
            {testimonials.map((tt) => (
              <TestimonialCard key={tt.id} testimonial={tt} />
            ))}
          </Rail>
        </div>
      </div>
    </section>
  );
}
