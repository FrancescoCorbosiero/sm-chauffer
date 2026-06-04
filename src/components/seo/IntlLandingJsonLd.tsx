import { SITE } from '@/lib/site';
import type { IntlLanding } from '@/lib/intlLandings';

const LANG_TAG: Record<IntlLanding['lang'], string> = { en: 'en', de: 'de' };

/**
 * Structured data for the international (/en, /de) landing pages: a `Service`
 * bound to the page's areaServed and the main LocalBusiness, plus a `FAQPage`,
 * both tagged with `inLanguage` so Google attributes them to the right locale.
 */
export default function IntlLandingJsonLd({ entry }: { entry: IntlLanding }) {
  const url = `${SITE.url}/${entry.lang}/${entry.slug}`;
  const inLanguage = LANG_TAG[entry.lang];

  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    serviceType: 'Chauffeur / private car service',
    name: entry.heroTitle,
    description: entry.metaDescription,
    url,
    inLanguage,
    provider: { '@id': `${SITE.url}/#business` },
    areaServed: entry.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
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
    inLanguage,
    mainEntity: entry.faq.map((f) => ({
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
