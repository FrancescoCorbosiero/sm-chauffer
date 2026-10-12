import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import VehicleDetailView from '@/components/fleet/VehicleDetailView';
import it from '@/i18n/dictionaries/it';
import { vehicles } from '@/lib/data';
import { getVehicle } from '@/lib/fleet';
import { VEHICLE_SEO } from '@/lib/fleetSeo';
import { SITE } from '@/lib/site';
import type { Vehicle } from '@/lib/types';

// One statically prerendered page per vehicle; any other id is a 404.
export function generateStaticParams() {
  return vehicles.map((v) => ({ id: v.id }));
}

export const dynamicParams = false;

type Params = { params: Promise<{ id: string }> };

const absolute = (src: string) => (src.startsWith('http') ? src : `${SITE.url}${src}`);

// Italian is the canonical SEO language, as for the /services and /ncc pages.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const vehicle = getVehicle(id);
  const seo = VEHICLE_SEO[id];
  if (!vehicle || !seo) return {};
  const url = `/fleet/${id}`;
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: `${seo.title} · ${SITE.name}`,
      description: seo.description,
      url,
      images: [{ url: vehicle.image, alt: it.vehicles[id]?.name ?? vehicle.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [vehicle.image],
    },
  };
}

function VehicleJsonLd({ vehicle, description }: { vehicle: Vehicle; description: string }) {
  const url = `${SITE.url}/fleet/${vehicle.id}`;
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    '@id': `${url}#vehicle`,
    name: it.vehicles[vehicle.id]?.name ?? vehicle.name,
    description,
    url,
    image: absolute(vehicle.image),
    vehicleSeatingCapacity: vehicle.passengers,
    ...(vehicle.priceOnRequest
      ? {}
      : {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            seller: { '@id': `${SITE.url}/#business` },
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: vehicle.pricePerHour,
              priceCurrency: 'EUR',
              unitCode: 'HUR',
              referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'HUR' },
            },
          },
        }),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

export default async function VehiclePage({ params }: Params) {
  const { id } = await params;
  const vehicle = getVehicle(id);
  const seo = VEHICLE_SEO[id];
  if (!vehicle || !seo) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Flotta', path: '/fleet' },
          { name: it.vehicles[id]?.name ?? vehicle.name, path: `/fleet/${id}` },
        ]}
      />
      <VehicleJsonLd vehicle={vehicle} description={seo.description} />
      <VehicleDetailView id={id} />
    </>
  );
}
