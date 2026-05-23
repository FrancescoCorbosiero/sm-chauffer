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
    <section className="section-y bg-white">
      <div className="container-x">
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
                <div className="p-7 border border-[var(--color-border)] rounded-xl bg-white hover:border-[var(--color-ink)] transition-colors h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center">
                      {Icon && <Icon size={20} className="text-[var(--color-ink)]" />}
                    </div>
                    <span className="text-xs text-[var(--color-text-faint)] font-medium tabular-nums">
                      {number}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium mb-2 leading-snug">{w.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
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
