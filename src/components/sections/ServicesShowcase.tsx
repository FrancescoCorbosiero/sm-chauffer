'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import ServiceIndexList from '@/components/ui/ServiceIndexList';

/**
 * Services as an editorial index: the heading stays put on the left while a
 * numbered list of services scrolls by on the right.
 */
export default function ServicesShowcase() {
  const t = useTranslation();
  const p = t.servicesPreview;

  return (
    <section className="section-y bg-ivory">
      <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="reveal min-w-0 lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">{p.label}</p>
            <h2 className="mt-4 text-4xl text-ink">
              {p.title} {p.accent}
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">{p.description}</p>
            <Link href="/services" className="link-arrow mt-7">
              {p.cta}
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>

        <ServiceIndexList className="reveal min-w-0 lg:col-span-8" />
      </div>
    </section>
  );
}
