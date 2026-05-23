'use client';
import Link from 'next/link';
import ServiceBlock from '@/components/ui/ServiceBlock';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { services } from '@/lib/data';
import { useTranslation } from '@/i18n/LanguageProvider';

export default function ServicesSection() {
  const t = useTranslation();
  return (
    <section className="section-y bg-[var(--color-surface)] border-y border-[var(--color-border)]">
      <div className="container-x">
        <ScrollReveal>
          <SectionHeader
            align="center"
            label={t.servicesPreview.label}
            title={t.servicesPreview.title}
            description={t.servicesPreview.description}
            className="mb-20 md:mb-24"
          />
        </ScrollReveal>

        <div className="space-y-24 md:space-y-32">
          {services.slice(0, 3).map((s, i) => (
            <ScrollReveal key={s.id} delay={i * 0.05}>
              <ServiceBlock service={s} index={i} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-20 text-center">
          <Link href="/services" className="link-arrow">
            {t.servicesPreview.cta}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
