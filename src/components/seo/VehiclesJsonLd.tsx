import { SITE } from '@/lib/site';
import { vehicles } from '@/lib/data';

// Absolute URL for a local /public asset (skip already-absolute CDN URLs).
const abs = (src: string) => (src.startsWith('http') ? src : `${SITE.url}${src}`);

/**
 * ItemList of the fleet's vehicles as schema.org Vehicle entries, for richer
 * Google results on the fleet page. Hourly-rate vehicles carry an Offer; the
 * on-request bus is listed without a price.
 */
export default function VehiclesJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Flotta Transfer Luxury Driver',
    itemListElement: vehicles.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Vehicle',
        name: v.name,
        image: abs(v.image),
        vehicleSeatingCapacity: v.passengers,
        ...(v.priceOnRequest
          ? {}
          : {
              offers: {
                '@type': 'Offer',
                priceCurrency: 'EUR',
                availability: 'https://schema.org/InStock',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  price: v.pricePerHour,
                  priceCurrency: 'EUR',
                  unitCode: 'HUR',
                  referenceQuantity: {
                    '@type': 'QuantitativeValue',
                    value: 1,
                    unitCode: 'HUR',
                  },
                },
              },
            }),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
