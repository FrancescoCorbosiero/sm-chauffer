'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import PageHero from '@/components/ui/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import StatsBand from '@/components/sections/StatsBand';
import Testimonials from '@/components/sections/Testimonials';
import CtaBand from '@/components/sections/CtaBand';
import { IMAGES } from '@/lib/images';
import { SITE } from '@/lib/site';
import RuledList from '@/components/ui/RuledList';


export default function AboutPage() {
  const t = useTranslation();
  usePageTitle(t.meta.about.title, t.meta.about.description);
  const a = t.aboutPage;
  const c = t.contactPage;
  const addr = SITE.legalAddress;

  const company: Array<[string, string]> = [
    [c.companyOwner, SITE.legalName],
    [c.companyVat, SITE.vatNumber],
    [c.companyTax, SITE.taxCode],
    [t.footer.sdiLabel, SITE.sdiCode],
    [t.footer.registeredOffice, `${addr.street}, ${addr.postalCode} ${addr.locality} (${addr.province})`],
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: t.nav.home, href: '/' }, { label: a.label }]}
        eyebrow={a.label}
        title={a.title}
        accent={a.accent}
        description={a.description}
        image={IMAGES.pageHeroes.about}
      />

      <StatsBand />

      {/* Story */}
      <section className="section-y bg-white">
        <div className="container-x grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal min-w-0 lg:col-span-6">
            <SectionHeading eyebrow={a.storyLabel} title={a.storyTitle} accent={a.storyAccent} />
            <div className="mt-8 space-y-5">
              {a.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={i === 0 ? 'text-lg leading-relaxed text-ink' : 'text-[1.0625rem] leading-relaxed text-muted'}
                >
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/fleet" className="btn btn-primary">
                {t.fleetPreview.cta}
                <ArrowRight size={16} aria-hidden />
              </Link>
              <Link href="/services" className="btn btn-outline">
                {t.nav.allServices}
              </Link>
            </div>
          </div>

          <div className="reveal relative min-w-0 lg:col-span-6">
            <div className="relative isolate aspect-[4/3] overflow-clip rounded-[1.75rem] bg-[radial-gradient(120%_95%_at_50%_30%,#ffffff_0%,#f1f1f3_55%,#dcdce1_100%)]">
              <Image
                src={IMAGES.fleet.sClass}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-8 mix-blend-multiply sm:p-12"
              />
            </div>
            <div className="absolute -bottom-6 left-5 rounded-2xl bg-ink px-6 py-5 text-white shadow-lg sm:left-8">
              <p className="font-display text-[2.4rem] leading-none text-gold-light tabular">
                {a.since.replace('{year}', SITE.founded)}
              </p>
              <p className="mt-1.5 text-sm text-white/65">{t.nav.logoTagline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHeading className="reveal" eyebrow={a.valuesLabel} title={a.valuesTitle} accent={a.valuesAccent} />
          <RuledList
            className="mt-12"
            cols={4}
            numbered
            items={a.values.map((v) => ({ title: v.title, text: v.body }))}
          />
        </div>
      </section>

      {/* Company identity */}
      <section className="section-y bg-white">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="reveal min-w-0 lg:col-span-5">
            <SectionHeading
              eyebrow={a.identityLabel}
              title={a.identityTitle}
              accent={a.identityAccent}
              description={a.identityText.replace('{owner}', SITE.legalName)}
            />
          </div>
          <div className="reveal min-w-0 lg:col-span-7">
            <div className="rounded-3xl border border-line bg-ivory p-6 sm:p-8">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep">
                {c.companyTitle}
              </h3>
              <dl className="mt-4 divide-y divide-line">
                {company.map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-0.5 py-3.5 sm:flex-row sm:justify-between sm:gap-6">
                    <dt className="text-sm text-muted">{k}</dt>
                    <dd className="font-semibold text-ink sm:text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[13px] leading-relaxed text-muted">{c.invoiceNote}</p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <CtaBand />
    </>
  );
}
