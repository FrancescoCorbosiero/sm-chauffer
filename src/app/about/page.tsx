'use client';
import { ShieldCheck, Clock, Globe2, Plane, LucideIcon } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useTranslation } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';

const VALUE_ICONS: LucideIcon[] = [ShieldCheck, Clock, Globe2, Plane];

export default function AboutPage() {
  const t = useTranslation();
  usePageTitle(t.meta.about.title, t.meta.about.description);

  return (
    <>
      <PageHero
        label={t.aboutPage.label}
        title={t.aboutPage.title}
        description={t.aboutPage.description}
        image="https://picsum.photos/seed/about-team-cover/1920/900"
      />

      <section className="py-20 md:py-28 bg-white">
        <div className="container-x">
          <div className="max-w-3xl mx-auto space-y-6 text-[var(--color-text-muted)] leading-relaxed text-base md:text-lg">
            {t.aboutPage.paragraphs.map((p, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <p>{p}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="container-x">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.aboutPage.values.map((v, i) => {
              const Icon = VALUE_ICONS[i] ?? ShieldCheck;
              const number = String(i + 1).padStart(2, '0');
              return (
                <ScrollReveal key={v.title} delay={i * 0.08}>
                  <div className="p-7 bg-white border border-[var(--color-border)] rounded-xl h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center">
                        <Icon size={20} className="text-[var(--color-ink)]" />
                      </div>
                      <span className="text-xs text-[var(--color-text-faint)] tabular-nums">
                        {number}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium mb-2">{v.title}</h3>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                      {v.body}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
