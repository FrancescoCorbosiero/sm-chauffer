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
    'Servizio NCC di lusso con autista a Milano, Monza Brianza e in tutta Italia. Mercedes, BMW e Range Rover. Transfer aeroportuali, tour privati, eventi e servizio business 24/7.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    postalCode: SITE.address.postalCode,
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
    geoRadius: '250000',
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
          name: 'Tour privati Lago di Como',
          areaServed: 'Como, Lombardia',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Trasferimenti internazionali Sankt Moritz',
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
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: SITE.phone,
    contactType: 'reservations',
    availableLanguage: ['Italian', 'English', 'French', 'German', 'Spanish'],
    areaServed: ['IT', 'EU'],
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

export default function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
