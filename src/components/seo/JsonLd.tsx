import { SITE, AREAS_SERVED } from '@/lib/site';

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'LimousineService'],
  '@id': `${SITE.url}/#business`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
  image: `${SITE.url}/og.jpg`,
  telephone: SITE.phone,
  email: SITE.email,
  priceRange: '€€€',
  foundingDate: SITE.founded,
  description:
    'Servizio NCC di lusso con autista a Milano, in Brianza, sul Lago di Como, a Bellagio e Tremezzo. Mercedes, BMW e Range Rover. Transfer aeroportuali, tour del Lago di Como, eventi e servizio business 24/7.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    addressCountry: SITE.address.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: SITE.geo.latitude,
    longitude: SITE.geo.longitude,
  },
  areaServed: AREAS_SERVED.map((name) => ({
    '@type': 'AdministrativeArea',
    name,
  })),
  serviceArea: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    geoRadius: '120000',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '00:00',
    closes: '23:59',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: SITE.rating.value,
    reviewCount: SITE.rating.count,
    bestRating: '5',
    worstRating: '1',
  },
  sameAs: [SITE.instagram.url],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servizi NCC',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Transfer Aeroporto Malpensa',
          areaServed: 'Milano, Brianza, Lombardia',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Autista privato Milano',
          areaServed: 'Milano',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Autista privato Brianza',
          areaServed: 'Monza e Brianza',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Tour privati Lago di Como — Bellagio e Tremezzo',
          areaServed: 'Lago di Como',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Trasferimenti internazionali Lugano',
          areaServed: 'Europa',
        },
      },
    ],
  },
};

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
  email: SITE.email,
  telephone: SITE.phone,
  sameAs: [SITE.instagram.url],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: SITE.phone,
    email: SITE.email,
    contactType: 'reservations',
    availableLanguage: ['Italian', 'English', 'French', 'German', 'Spanish', 'Russian'],
    areaServed: ['IT', 'EU'],
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
  },
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  inLanguage: 'it-IT',
  publisher: { '@id': `${SITE.url}/#organization` },
};

// Each script gets a stable id so React 19 deduplicates the element across
// re-renders (HMR, route changes) instead of warning about a "client-rendered
// script that won't execute" — JSON-LD doesn't need to execute, it just sits
// in the DOM for crawlers.
export default function JsonLd() {
  return (
    <>
      <script
        id="ld-localbusiness"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        id="ld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        id="ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
