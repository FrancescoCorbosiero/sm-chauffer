import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, MapPin, Phone } from 'lucide-react';
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

      <section className="py-16 md:py-20 bg-[var(--color-surface)]">
        <div className="container-x">
          <h2 className="text-2xl md:text-3xl font-light text-[var(--color-ink)] mb-10 text-center">
            Il nostro NCC a {loc.city}
          </h2>
          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loc.highlights.map((h) => (
              <div
                key={h.title}
                className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-white p-6"
              >
                <h3 className="text-lg font-medium text-[var(--color-ink)]">{h.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {h.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-[var(--color-ink)] mb-6">
                Tratte richieste da {loc.city}
              </h2>
              <ul className="flex flex-col gap-3">
                {loc.routes.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-[var(--color-ink)]">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-[var(--color-text-muted)]" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-light text-[var(--color-ink)] mb-6">
                Domande frequenti
              </h2>
              <div className="flex flex-col divide-y divide-[var(--color-divider)] border-y border-[var(--color-divider)]">
                {loc.faq.map((f) => (
                  <div key={f.q} className="py-4">
                    <h3 className="font-medium text-[var(--color-ink)] mb-1.5">{f.q}</h3>
                    <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
        <div className="container-x">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className="text-[var(--color-text-muted)]">Altre zone servite:</span>
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/ncc/${o.slug}`}
                  className="inline-flex items-center gap-1 font-medium text-[var(--color-ink)] underline-offset-4 hover:underline"
                >
                  NCC {o.city}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/fleet" className="inline-flex items-center gap-1 text-[var(--color-ink)] hover:text-[var(--color-text-muted)]">
                La flotta <ArrowUpRight size={14} />
              </Link>
              <Link href="/services" className="inline-flex items-center gap-1 text-[var(--color-ink)] hover:text-[var(--color-text-muted)]">
                Tutti i servizi <ArrowUpRight size={14} />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-1 text-[var(--color-ink)] hover:text-[var(--color-text-muted)]">
                Contatti <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
