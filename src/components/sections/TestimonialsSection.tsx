'use client';
import SectionHeader from '@/components/ui/SectionHeader';
import TestimonialCard from '@/components/ui/TestimonialCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { testimonials } from '@/lib/data';
import { useTranslation } from '@/i18n/LanguageProvider';

export default function TestimonialsSection() {
  const t = useTranslation();
  return (
    <section className="section-y bg-[var(--color-surface)] border-y border-[var(--color-border)]">
      <div className="container-x">
        <ScrollReveal>
          <SectionHeader
            align="center"
            label={t.testimonialsSection.label}
            title={t.testimonialsSection.title}
            description={t.testimonialsSection.description}
            className="mb-14"
          />
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((tt, i) => (
            <ScrollReveal key={tt.id} delay={i * 0.1}>
              <TestimonialCard testimonial={tt} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
