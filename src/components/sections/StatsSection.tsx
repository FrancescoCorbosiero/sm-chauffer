'use client';
import ScrollReveal from '@/components/ui/ScrollReveal';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
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
    <section className="relative py-20 md:py-24 bg-[var(--color-ink)] text-white overflow-hidden isolate">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-50"
      >
        <div className="orb orb-a -left-32 top-1/2 h-72 w-72 bg-[radial-gradient(circle,rgba(255,168,6,0.25),transparent_65%)]" />
        <div className="orb orb-b right-[-10%] top-[-30%] h-96 w-96 bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_70%)]" />
      </div>

      <div className="container-x relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8">
          {stats.map((s, i) => (
            <ScrollReveal
              key={s.label}
              delay={i * 0.08}
              className={`md:px-6 ${i !== 0 ? 'md:border-l md:border-white/15' : ''}`}
            >
              <div className="text-4xl md:text-5xl font-light leading-none tabular-nums">
                <AnimatedCounter value={s.value} />
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
