'use client';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useTranslation } from '@/i18n/LanguageProvider';

export default function StatsSection() {
  const t = useTranslation();
  const stats = [
    { value: '10+', label: t.stats.years },
    { value: '2.000+', label: t.stats.transfers },
    { value: '5.0', label: t.stats.googleStars },
    { value: '24/7', label: t.stats.availability },
  ];

  return (
    <section className="py-20 md:py-24 bg-[var(--color-ink)] text-white">
      <div className="container-x">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8">
          {stats.map((s, i) => (
            <ScrollReveal
              key={s.label}
              delay={i * 0.08}
              className={`md:px-6 ${
                i !== 0 ? 'md:border-l md:border-white/15' : ''
              }`}
            >
              <div className="text-4xl md:text-5xl font-light leading-none">
                {s.value}
              </div>
              <div className="mt-3 text-[11px] uppercase tracking-[0.25em] text-white/60">
                {s.label}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
