'use client';
import { vehicles } from '@/lib/data';
import FleetCard from '@/components/ui/FleetCard';
import PageHero from '@/components/ui/PageHero';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useTranslation } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';

export default function FleetPage() {
  const t = useTranslation();
  usePageTitle(t.meta.fleet.title, t.meta.fleet.description);

  return (
    <>
      <PageHero
        label={t.fleetPage.label}
        title={t.fleetPage.title}
        description={t.fleetPage.description}
        image="https://picsum.photos/seed/fleet-luxury-cars-cover/1920/900"
      />
      <section className="py-20 md:py-24 bg-white">
        <div className="container-x">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {vehicles.map((v, i) => (
              <ScrollReveal key={v.id} delay={(i % 3) * 0.08}>
                <FleetCard vehicle={v} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
