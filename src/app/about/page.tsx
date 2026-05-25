'use client';
import { ShieldCheck, Clock, Globe2, Plane, LucideIcon } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useTranslation } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import { IMAGES } from '@/lib/images';

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
        image={IMAGES.pageHeroes.about}
      />

      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-[640px] pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,168,6,0.08),transparent_60%)]"
        />
        <div className="container-x relative">
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
                  <div className="group relative p-7 bg-white border border-[var(--color-border)] rounded-2xl h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.06)] hover:border-[var(--color-ink)]/20">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(255,168,6,0.10),transparent_55%)]"
                    />
                    <div className="relative flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--color-ink)] group-hover:text-white group-hover:rotate-[8deg]">
                        <Icon size={20} aria-hidden />
                      </div>
                      <span className="text-xs text-[var(--color-text-faint)] tabular-nums">
                        {number}
                      </span>
                    </div>
                    <h3 className="relative text-lg font-medium mb-2">{v.title}</h3>
                    <p className="relative text-sm text-[var(--color-text-muted)] leading-relaxed">
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
