import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Phone } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import IntlLandingJsonLd from '@/components/seo/IntlLandingJsonLd';
import {
  LANDING_UI,
  hreflangFor,
  intlLandingsFor,
  type IntlLanding,
} from '@/lib/intlLandings';
import { SITE } from '@/lib/site';

export default function IntlLandingView({ entry }: { entry: IntlLanding }) {
  const ui = LANDING_UI[entry.lang];
  const siblings = intlLandingsFor(entry.lang).filter((l) => l.slug !== entry.slug);

  // Visible language cross-links: the paired other-language page + Italian.
  const alternates = hreflangFor(entry);
  const otherLangs = (['it', 'en', 'de'] as const).filter((l) => l !== entry.lang);

  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: entry.heroLabel, path: `/${entry.lang}/${entry.slug}` }]}
      />
      <IntlLandingJsonLd entry={entry} />

      <PageHero
        label={entry.heroLabel}
        title={entry.heroTitle}
        description={entry.heroDescription}
        image={entry.image}
      />

      <section className="py-16 md:py-20 bg-white">
        <div className="container-x">
          <div className="max-w-3xl mx-auto flex flex-col gap-5 text-[var(--color-ink)] leading-relaxed">
            {entry.intro.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-lg' : 'text-[var(--color-text-muted)]'}>
                {p}
              </p>
            ))}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-ink-soft)]"
              >
                {ui.quoteCta} <ArrowRight size={15} />
              </Link>
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface)]"
              >
                <Phone size={15} /> {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="container-x">
          <div className="mb-12 flex flex-col items-center text-center">
            <span className="eyebrow mb-5">{ui.serviceEyebrow}</span>
            <h2 className="text-2xl md:text-3xl font-light text-[var(--color-ink)]">
              {ui.serviceTitle}
            </h2>
          </div>
          <div className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {entry.highlights.map((h, i) => (
              <div
                key={h.title}
                className="gold-edge group relative flex flex-col overflow-hidden rounded-2xl bg-white p-7 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
              >
                <span className="font-display text-4xl font-light leading-none text-[var(--color-text-faint)]/40 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 text-lg font-medium text-[var(--color-ink)]">{h.title}</h3>
                <span
                  aria-hidden
                  className="my-3 block h-px w-8 bg-[var(--color-accent)]/70 transition-all duration-500 ease-out group-hover:w-14"
                />
                <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {h.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container-x">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <span className="eyebrow mb-5">{ui.routesEyebrow}</span>
              <h2 className="text-2xl md:text-3xl font-light text-[var(--color-ink)] mb-8">
                {ui.routesTitle}
              </h2>
              <ol className="flex flex-col">
                {entry.routes.map((r, i) => (
                  <li
                    key={r}
                    className="group flex items-baseline gap-5 border-b border-[var(--color-divider)] py-4 first:border-t"
                  >
                    <span className="font-display text-base font-light text-[var(--color-text-faint)] tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-text-muted)]">
                      {r}
                    </span>
                    <ArrowUpRight
                      size={16}
                      aria-hidden
                      className="shrink-0 text-[var(--color-accent)] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <span className="eyebrow mb-5">{ui.faqEyebrow}</span>
              <h2 className="text-2xl md:text-3xl font-light text-[var(--color-ink)] mb-8">
                {ui.faqTitle}
              </h2>
              <div className="flex flex-col gap-3">
                {entry.faq.map((f) => (
                  <div
                    key={f.q}
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"
                  >
                    <h3 className="flex items-start gap-3 font-medium text-[var(--color-ink)]">
                      <span
                        aria-hidden
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
                      />
                      {f.q}
                    </h3>
                    <p className="mt-2 pl-[1.125rem] text-sm leading-relaxed text-[var(--color-text-muted)]">
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
        <div className="container-x">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-[0.28em] text-[var(--color-text-faint)]">
                {ui.serviceEyebrow}
              </span>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {siblings.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/${o.lang}/${o.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition-colors duration-300 hover:border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white"
                  >
                    {o.heroLabel}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:items-end">
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                <Link href="/fleet" className="group inline-flex items-center gap-1.5 text-[var(--color-ink)]">
                  {ui.fleet}
                  <ArrowUpRight size={14} className="text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link href="/contact" className="group inline-flex items-center gap-1.5 text-[var(--color-ink)]">
                  {ui.contact}
                  <ArrowUpRight size={14} className="text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-text-muted)]">
                <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-faint)]">
                  {ui.otherLangs}
                </span>
                {otherLangs.map((l) => {
                  const href = l === 'it' ? entry.itHref : alternates[l];
                  if (!href) return null;
                  return (
                    <Link
                      key={l}
                      href={href}
                      hrefLang={l}
                      className="font-medium text-[var(--color-ink)] underline-offset-4 hover:underline"
                    >
                      {ui.langName[l]}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
