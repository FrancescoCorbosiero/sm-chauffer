'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import SectionHeading from '@/components/ui/SectionHeading';
import PriceTiles from '@/components/ui/PriceTiles';

export default function PricingTeaser() {
  const t = useTranslation();
  const p = t.pricingTeaser;

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
            <Link href="/pricing" className="link-arrow">
              {p.cta}
              <ArrowRight size={16} aria-hidden />
            </Link>
          }
        />
        <div className="mt-12 lg:mt-14">
          <PriceTiles />
        </div>
        <p className="mt-6 text-[13px] text-muted">{t.quote.disclaimer}</p>
      </div>
    </section>
  );
}
