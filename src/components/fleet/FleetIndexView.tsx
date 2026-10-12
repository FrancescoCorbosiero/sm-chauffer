'use client';
import Link from 'next/link';
import { useId, useState } from 'react';
import { ArrowRight, Baby, Briefcase, ShieldCheck, Sparkles, UserRound, Users } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import PageHero from '@/components/ui/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import VehicleCard from '@/components/ui/VehicleCard';
import Stepper from '@/components/ui/Stepper';
import FaqBlock from '@/components/sections/FaqBlock';
import CtaBand from '@/components/sections/CtaBand';
import FleetTable from './FleetTable';
import { vehicles } from '@/lib/data';
import { FAQ } from '@/lib/faq';
import { bookingHref } from '@/lib/booking';
import { fits } from '@/lib/fleet';
import { IMAGES } from '@/lib/images';
import RuledList from '@/components/ui/RuledList';

const STANDARD_ICONS = [Sparkles, UserRound, ShieldCheck, Baby];
/** General FAQ entries relevant to the fleet: vehicles, child seats, fares. */
const FAQ_INDEXES = [2, 4, 5];
const MAX = 18;

export default function FleetIndexView() {
  const { t, locale } = useLanguage();
  usePageTitle(t.meta.fleet.title, t.meta.fleet.description);
  const f = t.fleetPage;
  const uid = useId();
  const [pax, setPax] = useState(1);
  const [bags, setBags] = useState(1);
  const matching = vehicles.filter((v) => fits(v, pax, bags)).length;
  const faqItems = FAQ_INDEXES.map((i) => (FAQ[locale] ?? FAQ.it)[i]).filter(Boolean);

  return (
    <>
      <PageHero
        crumbs={[{ label: t.nav.home, href: '/' }, { label: f.label }]}
        eyebrow={f.label}
        title={f.title}
        accent={f.accent}
        description={f.description}
        image={IMAGES.pageHeroes.fleet}
      >
        <div className="flex flex-wrap gap-3">
          <Link href={bookingHref()} className="btn btn-gold">
            {t.actions.book}
            <ArrowRight size={16} aria-hidden />
          </Link>
          <a href="#compare" className="btn btn-outline-light">
            {t.footer.compare}
          </a>
        </div>
      </PageHero>

      {/* Capacity finder + vehicles */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="reveal rounded-3xl border border-line bg-ivory p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:items-end lg:gap-10">
              <div className="lg:col-span-4">
                <h2 className="text-[2rem] leading-tight text-ink">{f.finderTitle}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.finderText}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:col-span-5">
                <div className="field">
                  <span id={`${uid}-pax`} className="field-label flex items-center gap-1.5">
                    <Users size={14} aria-hidden className="text-gold-deep" />
                    {t.quickBook.passengers}
                  </span>
                  <Stepper
                    id={`${uid}-pax-value`}
                    labelledBy={`${uid}-pax`}
                    value={pax}
                    min={1}
                    max={MAX}
                    onChange={setPax}
                    decLabel={`${t.quickBook.passengers} −1`}
                    incLabel={`${t.quickBook.passengers} +1`}
                  />
                </div>
                <div className="field">
                  <span id={`${uid}-bags`} className="field-label flex items-center gap-1.5">
                    <Briefcase size={14} aria-hidden className="text-gold-deep" />
                    {t.contactPage.form.bags}
                  </span>
                  <Stepper
                    id={`${uid}-bags-value`}
                    labelledBy={`${uid}-bags`}
                    value={bags}
                    min={0}
                    max={MAX}
                    onChange={setBags}
                    decLabel={`${t.contactPage.form.bags} −1`}
                    incLabel={`${t.contactPage.form.bags} +1`}
                  />
                </div>
              </div>
              <p
                aria-live="polite"
                className="tabular flex items-center gap-2.5 font-display text-[1.6rem] leading-tight text-ink lg:col-span-3 lg:justify-end lg:pb-2.5"
              >
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-gold" />
                {matching === 1 ? f.matchOne : f.matches.replace('{n}', String(matching))}
              </p>
            </div>
            <p className="mt-6 border-t border-line pt-4 text-sm text-muted">{f.moreThan}</p>
          </div>

          <ul className="reveal-stagger mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {vehicles.map((v, i) => {
              const ok = fits(v, pax, bags);
              return (
                <li
                  key={v.id}
                  style={{ ['--i' as string]: i }}
                  className={`relative transition-opacity duration-300 ${ok ? '' : 'opacity-45'}`}
                >
                  <VehicleCard vehicle={v} priority={i < 3} booking={{ pax: String(pax) }} />
                  {!ok && (
                    <span className="pointer-events-none absolute right-4 top-4 z-[2] rounded-full bg-ink px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                      {f.tooSmall}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

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
