'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import SectionHeading from '@/components/ui/SectionHeading';
import VehicleCard from '@/components/ui/VehicleCard';
import Rail from '@/components/ui/Rail';
import { vehicles } from '@/lib/data';

export default function FleetShowcase() {
  const t = useTranslation();
  const p = t.fleetPreview;
  return (
    <section className="section-y bg-white">
      <div className="container-x">
        <SectionHeading
          className="reveal"
          eyebrow={p.label}
          title={p.title}
          accent={p.accent}
          description={p.description}
          action={
            <Link href="/fleet" className="link-arrow">
              {p.cta}
              <ArrowRight size={16} aria-hidden />
            </Link>
          }
        />
        <div className="reveal mt-12 lg:mt-14">
          <Rail label={p.label}>
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </Rail>
        </div>
      </div>
    </section>
  );
}
