'use client';
import { ShieldCheck, Clock, Globe2, Plane, LucideIcon } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useTranslation } from '@/i18n/LanguageProvider';

const ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  Clock,
  Globe2,
  Plane,
};

export default function WhyUsSection() {
  const t = useTranslation();
  return (
    <section className="section-y bg-white relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 -top-32 h-64 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,168,6,0.08),transparent_60%)]"
      />
      <div className="container-x relative">
        <ScrollReveal>
          <SectionHeader
            align="center"
            label={t.whyUs.label}
            title={t.whyUs.title}
            description={t.whyUs.description}
            className="mb-14"
          />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.whyUs.items.map((w, i) => {
            const Icon = ICONS[w.icon];
            const number = String(i + 1).padStart(2, '0');
            return (
              <ScrollReveal key={w.title} delay={i * 0.08}>
                <div className="group relative p-7 border border-[var(--color-border)] rounded-2xl bg-white hover:border-[var(--color-ink)]/30 hover:shadow-[0_24px_60px_rgba(0,0,0,0.06)] transition-all duration-300 h-full overflow-hidden">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(255,168,6,0.12),transparent_55%)]"
                  />
                  <div className="relative flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--color-ink)] group-hover:text-white group-hover:rotate-[8deg]">
                      {Icon && <Icon size={20} aria-hidden />}
                    </div>
                    <span className="text-xs text-[var(--color-text-faint)] font-medium tabular-nums">
                      {number}
                    </span>
                  </div>
                  <h3 className="relative text-lg font-medium mb-2 leading-snug">
                    {w.title}
                  </h3>
                  <p className="relative text-sm text-[var(--color-text-muted)] leading-relaxed">
                    {w.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
