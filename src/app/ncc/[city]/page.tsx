import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LandingLayout, { LandingRelated } from '@/components/landing/LandingLayout';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import LocationJsonLd from '@/components/seo/LocationJsonLd';
import { locations, getLocationBySlug } from '@/lib/locations';
import { bookingHref } from '@/lib/booking';

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
          { name: 'Zone servite', path: '/areas' },
          { name: loc.heroLabel, path: `/ncc/${loc.slug}` },
        ]}
      />
      <LocationJsonLd location={loc} />

      <LandingLayout
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Zone servite', href: '/areas' },
          { label: loc.heroLabel },
        ]}
        eyebrow={loc.heroLabel}
        title={loc.heroTitle}
        description={loc.heroDescription}
        image={loc.image}
        quoteHref={bookingHref({ from: loc.city })}
        copy={{
          quoteCta: 'Richiedi un preventivo',
          serviceEyebrow: 'Il servizio',
          serviceTitle: `Il nostro servizio a ${loc.city}`,
          routesEyebrow: 'Itinerari',
          routesTitle: `Tratte richieste da ${loc.city}`,
          faqEyebrow: 'FAQ',
          faqTitle: 'Domande frequenti',
        }}
        intro={loc.intro}
        highlights={loc.highlights}
        routes={loc.routes}
        faq={loc.faq}
        related={
          <LandingRelated
            label="Altre zone servite"
            chips={[
              ...others.map((o) => ({ href: `/ncc/${o.slug}`, label: `NCC ${o.city}` })),
              { href: '/areas', label: 'Mappa delle zone' },
            ]}
            links={[
              { href: '/services', label: 'Tutti i servizi' },
              { href: '/fleet', label: 'La flotta' },
              { href: '/pricing', label: 'Tariffe' },
              { href: '/contact', label: 'Contatti' },
            ]}
            langs={
              loc.intl
                ? {
                    label: 'Also in',
                    items: [
                      { href: `/en/${loc.intl.en}`, hrefLang: 'en', label: 'English' },
                      { href: `/de/${loc.intl.de}`, hrefLang: 'de', label: 'Deutsch' },
                    ],
                  }
                : undefined
            }
          />
        }
      />
    </>
  );
}
