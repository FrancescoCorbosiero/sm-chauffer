'use client';
import Link from 'next/link';
import FleetCard from '@/components/ui/FleetCard';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { vehicles } from '@/lib/data';
import { useTranslation } from '@/i18n/LanguageProvider';

export default function FleetPreviewSection() {
  const t = useTranslation();
  return (
    <section className="section-y bg-white">
      <div className="container-x">
        <ScrollReveal>
          <SectionHeader
            align="center"
            label={t.fleetPreview.label}
            title={t.fleetPreview.title}
            description={t.fleetPreview.description}
            className="mb-14"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {vehicles.slice(0, 3).map((v, i) => (
            <ScrollReveal key={v.id} delay={i * 0.1}>
              <FleetCard vehicle={v} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.2} className="mt-12 text-center">
          <Link href="/fleet" className="link-arrow">
            {t.fleetPreview.cta}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
