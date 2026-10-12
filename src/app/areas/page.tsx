'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import PageHero from '@/components/ui/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import CoverageMap from '@/components/widgets/CoverageMap';
import CtaBand from '@/components/sections/CtaBand';
import { locations } from '@/lib/locations';
import { COVERAGE_POINTS, HUB_ID, formatDuration, pointName, type CoverageGroup } from '@/lib/coverage';
import { bookingHref } from '@/lib/booking';

const GROUPS: CoverageGroup[] = ['city', 'lake', 'airport', 'intl'];

export default function AreasPage() {
  const { t, locale } = useLanguage();
  usePageTitle(t.meta.areas.title, t.meta.areas.description);
  const c = t.coverage;
  const a = t.areasPage;
  const dur = (m: number) => formatDuration(m, c.unitMin, c.unitHour);

  return (
    <>
      <PageHero
        crumbs={[{ label: t.nav.home, href: '/' }, { label: c.label }]}
        eyebrow={c.label}
        title={a.title}
        accent={a.accent}
        description={a.description}
        below={<CoverageMap variant="full" />}
      />

      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading
            className="reveal"
            eyebrow={t.nav.citiesTitle}
            title={a.citiesTitle}
            accent={a.citiesAccent}
            description={a.citiesDescription}
          />
          <div className="reveal-stagger mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {locations.map((l, i) => {
              const point = COVERAGE_POINTS.find((p) => p.id === l.slug);
              return (
                <Link
                  key={l.slug}
                  href={`/ncc/${l.slug}`}
                  style={{ ['--i' as string]: i }}
                  className="card card-hover gold-edge group relative flex flex-col overflow-clip"
                >
                  <div className="relative aspect-[4/3] overflow-clip bg-ink">
                    <Image
                      src={l.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-[1.6rem] leading-tight text-ink">NCC {l.city}</h3>
                    {point && (
                      <p className="mt-2 text-[15px] leading-relaxed text-muted">{point.desc[locale] ?? point.desc.it}</p>
                    )}
                    <span className="link-arrow mt-auto self-start pt-5 text-sm">
                      {a.cityCta}
                      <ArrowRight size={15} aria-hidden />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHeading
            className="reveal"
            eyebrow={c.listTitle}
            title={a.tableTitle}
            accent={a.tableAccent}
            description={a.tableDescription}
          />
          <div className="reveal mt-10 overflow-clip rounded-2xl border border-line bg-white">
            <table className="w-full text-left text-[15px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-[0.16em] text-muted">
                  <th scope="col" className="px-4 py-4 font-semibold sm:px-6">
                    {a.colDestination}
                  </th>
                  <th scope="col" className="hidden px-4 py-4 font-semibold sm:table-cell">
                    {c.distance}
                  </th>
                  <th scope="col" className="hidden px-4 py-4 font-semibold sm:table-cell">
                    {c.time}
                  </th>
                  <th scope="col" className="px-4 py-4 sm:px-6">
                    <span className="sr-only">{t.actions.book}</span>
                  </th>
                </tr>
              </thead>
              {GROUPS.map((g) => (
                <tbody key={g}>
                  <tr className="border-t border-line bg-ivory/70">
                    <th
                      scope="colgroup"
                      colSpan={4}
                      className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:px-6"
                    >
                      {c.filters[g]}
                    </th>
                  </tr>
                  {COVERAGE_POINTS.filter((p) => p.group === g && p.id !== HUB_ID).map((p) => {
                    const href = bookingHref(
                      p.group === 'airport' ? { type: 'airport-transfer', to: p.bookTo } : { to: p.bookTo },
                    );
                    return (
                      <tr key={p.id} className="border-t border-line">
                        <th scope="row" className="px-4 py-3.5 font-semibold text-ink sm:px-6">
                          {pointName(p, locale)}
                          <span className="mt-0.5 block text-[13px] font-normal text-muted tabular sm:hidden">
                            ≈ {p.km} km · ≈ {dur(p.minutes)}
                          </span>
                        </th>
                        <td className="hidden px-4 py-3.5 text-muted tabular sm:table-cell">≈ {p.km} km</td>
                        <td className="hidden px-4 py-3.5 text-muted tabular sm:table-cell">≈ {dur(p.minutes)}</td>
                        <td className="px-4 py-3.5 text-right sm:px-6">
                          <Link
                            href={href}
                            aria-label={`${t.actions.book} — ${pointName(p, locale)}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                          >
                            <span className="hidden sm:inline">{t.actions.book}</span>
                            <ArrowRight size={15} aria-hidden />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              ))}
            </table>
          </div>
          <p className="mt-5 text-[13px] text-muted">{c.onRequest}</p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
