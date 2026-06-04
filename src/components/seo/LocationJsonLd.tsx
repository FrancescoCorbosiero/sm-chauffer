import { SITE } from '@/lib/site';
import type { Location } from '@/lib/locations';

/**
 * Per-city structured data for the /ncc/[city] landing pages:
 *  - a `Service` (NCC) bound to the page's `areaServed`, linked back to the
 *    main LocalBusiness so Google ties the offering to the verified entity;
 *  - a `FAQPage` built from the city's Q&A for eligible rich results.
 *
 * Server-rendered into the static HTML.
 */
export default function LocationJsonLd({ location }: { location: Location }) {
  const url = `${SITE.url}/ncc/${location.slug}`;

  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    serviceType: 'Noleggio con conducente (NCC)',
    name: location.heroTitle,
    description: location.metaDescription,
    url,
    provider: { '@id': `${SITE.url}/#business` },
    areaServed: location.areaServed.map((name) => ({
      '@type': 'AdministrativeArea',
      name,
    })),
    availableChannel: {
      '@type': 'ServiceChannel',
      servicePhone: SITE.phone,
      serviceUrl: `${SITE.url}/contact`,
    },
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: location.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
