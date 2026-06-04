import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Phone } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import LocationJsonLd from '@/components/seo/LocationJsonLd';
import { locations, getLocationBySlug } from '@/lib/locations';
import { SITE } from '@/lib/site';

// One statically prerendered page per city.
export function generateStaticParams() {
  return locations.map((l) => ({ city: l.slug }));
}

type Params = { params: Promise<{ city: string }> };

// Italian is the canonical SEO language for these landing pages, matching the
// blog and the prerendered metadata strategy used across the site.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { city } = await params;
  const loc = getLocationBySlug(city);
  if (!loc) return {};
  const url = `/ncc/${loc.slug}`;
  return {
    title: loc.metaTitle,
    description: loc.metaDescription,
    keywords: loc.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: loc.metaTitle,
      description: loc.metaDescription,
      url,
      images: [{ url: loc.image, alt: loc.heroTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: loc.metaTitle,
      description: loc.metaDescription,
      images: [loc.image],
    },
  };
}

export default async function LocationPage({ params }: Params) {
  const { city } = await params;
  const loc = getLocationBySlug(city);
  if (!loc) notFound();

  const others = locations.filter((l) => l.slug !== loc.slug);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'NCC', path: '/services' },
          { name: loc.city, path: `/ncc/${loc.slug}` },
        ]}
      />
      <LocationJsonLd location={loc} />

      <PageHero
        label={loc.heroLabel}
        title={loc.heroTitle}
        description={loc.heroDescription}
        image={loc.image}
      />

      <section className="py-16 md:py-20 bg-white">
        <div className="container-x">
          <div className="max-w-3xl mx-auto flex flex-col gap-5 text-[var(--color-ink)] leading-relaxed">
            {loc.intro.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-lg' : 'text-[var(--color-text-muted)]'}>
                {p}
              </p>
            ))}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={`/contact?from=${encodeURIComponent(loc.city)}`}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-ink-soft)]"
              >
                Richiedi un preventivo <ArrowRight size={15} />
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
            <span className="eyebrow mb-5">{loc.heroLabel}</span>
            <h2 className="text-2xl md:text-3xl font-light text-[var(--color-ink)]">
              Il nostro servizio a {loc.city}
            </h2>
          </div>
          <div className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loc.highlights.map((h, i) => (
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
              <span className="eyebrow mb-5">Itinerari</span>
              <h2 className="text-2xl md:text-3xl font-light text-[var(--color-ink)] mb-8">
                Tratte richieste da {loc.city}
              </h2>
              <ol className="flex flex-col">
                {loc.routes.map((r, i) => (
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
                      className="shrink-0 translate-x-0 text-[var(--color-accent)] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <span className="eyebrow mb-5">FAQ</span>
              <h2 className="text-2xl md:text-3xl font-light text-[var(--color-ink)] mb-8">
                Domande frequenti
              </h2>
              <div className="flex flex-col gap-3">
                {loc.faq.map((f) => (
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
                Altre zone servite
              </span>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/ncc/${o.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition-colors duration-300 hover:border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white"
                  >
                    NCC {o.city}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <Link href="/fleet" className="group inline-flex items-center gap-1.5 text-[var(--color-ink)]">
                La flotta
                <ArrowUpRight size={14} className="text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link href="/services" className="group inline-flex items-center gap-1.5 text-[var(--color-ink)]">
                Tutti i servizi
                <ArrowUpRight size={14} className="text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link href="/contact" className="group inline-flex items-center gap-1.5 text-[var(--color-ink)]">
                Contatti
                <ArrowUpRight size={14} className="text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
