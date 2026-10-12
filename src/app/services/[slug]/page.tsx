import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import ServiceDetailView from '@/components/services/ServiceDetailView';
import it from '@/i18n/dictionaries/it';
import { SITE } from '@/lib/site';
import { SERVICE_PAGES, getService, getServicePage, servicePrice, type ServicePage } from '@/lib/servicePages';

// One statically prerendered page per service; any other slug is a 404.
export function generateStaticParams() {
  return SERVICE_PAGES.map((p) => ({ slug: p.id }));
}

export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

const absolute = (src: string) => (src.startsWith('http') ? src : `${SITE.url}${src}`);

// Italian is the canonical SEO language, as for the /ncc landing pages.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  const service = getService(slug);
  if (!page || !service) return {};
  const url = `/services/${slug}`;
  return {
    title: page.seo.title,
    description: page.seo.description,
    keywords: page.seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: `${page.seo.title} · ${SITE.name}`,
      description: page.seo.description,
      url,
      images: [{ url: service.image, alt: it.services[slug]?.title ?? page.seo.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seo.title,
      description: page.seo.description,
      images: [service.image],
    },
  };
}

function ServiceJsonLd({ page, image }: { page: ServicePage; image: string }) {
  const url = `${SITE.url}/services/${page.id}`;
  const price = servicePrice(page);
  const offers =
    price.kind === 'fixed'
      ? {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          description: it.quote.fixedMalpensa,
          priceSpecification: { '@type': 'PriceSpecification', minPrice: price.amount, priceCurrency: 'EUR' },
        }
      : price.kind === 'hourly'
        ? {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            description: it.serviceDetail.hourlyLabel,
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              minPrice: price.from,
              priceCurrency: 'EUR',
              unitCode: 'HUR',
            },
          }
        : undefined;

  const json = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: it.services[page.id]?.title ?? page.seo.title,
    serviceType: page.seo.serviceType,
    description: page.seo.description,
    url,
    image: absolute(image),
    provider: { '@id': `${SITE.url}/#business` },
    areaServed: page.seo.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
    availableChannel: {
      '@type': 'ServiceChannel',
      servicePhone: SITE.phone,
      serviceUrl: `${SITE.url}/contact`,
    },
    ...(offers ? { offers } : {}),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const page = getServicePage(slug);
  const service = getService(slug);
  if (!page || !service) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Servizi', path: '/services' },
          { name: it.services[slug]?.title ?? page.seo.title, path: `/services/${slug}` },
        ]}
      />
      <ServiceJsonLd page={page} image={service.image} />
      <ServiceDetailView id={slug} />
    </>
  );
}
