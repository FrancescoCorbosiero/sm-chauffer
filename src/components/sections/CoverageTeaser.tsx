'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import SectionHeading from '@/components/ui/SectionHeading';
import CoverageMap from '@/components/widgets/CoverageMap';

export default function CoverageTeaser() {
  const t = useTranslation();
  const c = t.coverage;
  return (
    <section className="section-y ink-panel on-ink relative overflow-clip">
      <div className="container-x">
        <SectionHeading
          className="reveal"
          tone="dark"
          eyebrow={c.label}
          title={c.title}
          accent={c.accent}
          description={c.description}
          action={
            <Link href="/areas" className="link-arrow link-arrow-light">
              {c.openMap}
              <ArrowRight size={16} aria-hidden />
            </Link>
          }
        />
        <div className="reveal mt-12 lg:mt-14">
          <CoverageMap variant="compact" />
        </div>
      </div>
    </section>
  );
}
