'use client';
import { ArrowRight, Baby, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import PageHero from '@/components/ui/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import FaqBlock from '@/components/sections/FaqBlock';
import CtaBand from '@/components/sections/CtaBand';
import FleetTable from './FleetTable';
import Showroom from './Showroom';
import { FAQ } from '@/lib/faq';
import RuledList from '@/components/ui/RuledList';

const STANDARD_ICONS = [Sparkles, UserRound, ShieldCheck, Baby];
/** General FAQ entries relevant to the fleet: vehicles, child seats, fares. */
const FAQ_INDEXES = [2, 4, 5];

export default function FleetIndexView() {
  const { t, locale } = useLanguage();
  usePageTitle(t.meta.fleet.title, t.meta.fleet.description);
  const f = t.fleetPage;
  const faqItems = FAQ_INDEXES.map((i) => (FAQ[locale] ?? FAQ.it)[i]).filter(Boolean);

  return (
    <>
      <PageHero
        crumbs={[{ label: t.nav.home, href: '/' }, { label: f.label }]}
        eyebrow={f.label}
        title={f.title}
        accent={f.accent}
        description={f.description}
        below={<Showroom finder intro="load" priority />}
      >
        <a href="#compare" className="link-arrow link-arrow-light">
          {t.footer.compare}
          <ArrowRight size={16} aria-hidden />
        </a>
      </PageHero>

      {/* Comparison */}
      <section id="compare" className="section-y scroll-mt-16 bg-ivory">
        <div className="container-x">
          <SectionHeading
            className="reveal"
            eyebrow={t.nav.fleet}
            title={f.compareTitle}
            accent={f.compareAccent}
            description={f.compareText}
          />
          <div className="reveal mt-10">
            <FleetTable label={`${f.compareTitle} ${f.compareAccent}`} />
          </div>
        </div>
      </section>

      {/* Service standards */}
      <section className="section-y bg-white">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <SectionHeading
            className="reveal lg:col-span-4"
            eyebrow={f.standardsLabel}
            title={f.standardsTitle}
            accent={f.standardsAccent}
          />
          <RuledList className="min-w-0 lg:col-span-8" items={f.standards} icons={STANDARD_ICONS} />
        </div>
      </section>

      <FaqBlock items={faqItems} canonical={FAQ_INDEXES.map((i) => FAQ.it[i])} withJsonLd={false} />
      <CtaBand />
    </>
  );
}
