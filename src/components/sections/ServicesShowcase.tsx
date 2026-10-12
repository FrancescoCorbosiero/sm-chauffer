'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import SectionHeading from '@/components/ui/SectionHeading';
import ServiceCard from '@/components/ui/ServiceCard';
import Rail from '@/components/ui/Rail';
import { services } from '@/lib/data';

export default function ServicesShowcase() {
  const t = useTranslation();
  const p = t.servicesPreview;
  return (
    <section className="section-y bg-ivory">
      <div className="container-x">
        <SectionHeading
          className="reveal"
          eyebrow={p.label}
          title={p.title}
          accent={p.accent}
          description={p.description}
          action={
            <Link href="/services" className="link-arrow">
              {p.cta}
              <ArrowRight size={16} aria-hidden />
            </Link>
          }
        />
        <div className="reveal mt-12 lg:mt-14">
          <Rail label={p.label} layout="grid-lg">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </Rail>
        </div>
      </div>
    </section>
  );
}
