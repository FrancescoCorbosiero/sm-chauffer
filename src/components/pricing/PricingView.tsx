'use client';
import {
  BadgeEuro,
  Headset,
  PlaneLanding,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import PageHero from '@/components/ui/PageHero';
import PriceTiles from '@/components/ui/PriceTiles';
import SectionHeading from '@/components/ui/SectionHeading';
import FleetTable from '@/components/fleet/FleetTable';
import FaqBlock from '@/components/sections/FaqBlock';
import CtaBand from '@/components/sections/CtaBand';
import Estimator from './Estimator';
import { FAQ } from '@/lib/faq';
import RuledList from '@/components/ui/RuledList';

const INCLUDED_ICONS = [BadgeEuro, PlaneLanding, UserRound, ShieldCheck, ReceiptText, Headset];
/** General FAQ entries about prices: Malpensa fare, route vs hourly, delays, child seats. */
const FAQ_INDEXES = [0, 5, 3, 4];

export default function PricingView() {
  const { t, locale } = useLanguage();
  usePageTitle(t.meta.pricing.title, t.meta.pricing.description);
  const p = t.pricingPage;
  const pt = t.pricingTeaser;
  const faqItems = FAQ_INDEXES.map((i) => (FAQ[locale] ?? FAQ.it)[i]).filter(Boolean);

  return (
    <>
      <PageHero
        crumbs={[{ label: t.nav.home, href: '/' }, { label: pt.label }]}
        eyebrow={pt.label}
        title={pt.title}
        accent={pt.accent}
        description={p.description}
        below={
          <div className="intro" style={{ ['--d' as string]: 260 }}>
            <PriceTiles tone="dark" />
            <p className="mt-5 text-[13px] text-white/50">{t.quote.disclaimer}</p>
          </div>
        }
      />

      <Estimator />

      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHeading
            className="reveal"
            eyebrow={t.nav.fleet}
            title={p.ratesTitle}
            accent={p.ratesAccent}
            description={p.ratesText}
          />
          <div className="reveal mt-10">
            <FleetTable label={`${p.ratesTitle} ${p.ratesAccent}`} showIdeal={false} booking={{ type: 'hourly' }} />
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading
            className="reveal"
            eyebrow={p.includedLabel}
            title={p.includedTitle}
            accent={p.includedAccent}
          />
          <RuledList className="mt-12" cols={3} items={p.included} icons={INCLUDED_ICONS} />
        </div>
      </section>

      <FaqBlock items={faqItems} canonical={FAQ_INDEXES.map((i) => FAQ.it[i])} withJsonLd={false} />
      <CtaBand />
    </>
  );
}
