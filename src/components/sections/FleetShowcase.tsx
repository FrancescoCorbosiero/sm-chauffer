'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import SectionHeading from '@/components/ui/SectionHeading';
import Showroom from '@/components/fleet/Showroom';

/** Home page fleet: the showroom, the first car pulling in as it scrolls into view. */
export default function FleetShowcase() {
  const t = useTranslation();
  const p = t.fleetPreview;
  return (
    <section className="section-y ink-panel on-ink relative overflow-clip">
      <div className="container-x">
        <Showroom
          intro="scroll"
          heading={
            <SectionHeading
              className="reveal mb-12 lg:mb-14"
              tone="dark"
              eyebrow={p.label}
              title={p.title}
              accent={p.accent}
              description={p.description}
              action={
                <Link href="/fleet" className="link-arrow link-arrow-light">
                  {p.cta}
                  <ArrowRight size={16} aria-hidden />
                </Link>
              }
            />
          }
        />
      </div>
    </section>
  );
}
