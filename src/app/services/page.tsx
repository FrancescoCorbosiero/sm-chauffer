'use client';
import { services } from '@/lib/data';
import ServiceCard from '@/components/ui/ServiceCard';
import PageHero from '@/components/ui/PageHero';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useTranslation } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import { IMAGES } from '@/lib/images';

export default function ServicesPage() {
  const t = useTranslation();
  usePageTitle(t.meta.services.title, t.meta.services.description);

  return (
    <>
      <PageHero
        label={t.servicesPage.label}
        title={t.servicesPage.title}
        description={t.servicesPage.description}
        image={IMAGES.pageHeroes.services}
      />
      <section className="py-20 md:py-24 bg-white">
        <div className="container-x">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((s, i) => (
              <ScrollReveal key={s.id} delay={(i % 3) * 0.08}>
                <ServiceCard service={s} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
