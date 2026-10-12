import type { Metadata } from 'next';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import PricingView from '@/components/pricing/PricingView';

export const metadata: Metadata = {
  title: 'Tariffe NCC — Milano–Malpensa a prezzo fisso e servizio a ore',
  description:
    'Tariffe chiare con autista: transfer Milano–Malpensa a prezzo fisso da 150 €, servizio a ore da 70 €/h, preventivi su misura per gruppi e viaggi all’estero. Nessun tassametro.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Tariffe · Transfer Luxury Driver',
    description:
      'Milano–Malpensa a prezzo fisso, servizio a ore con autista e preventivi su misura, concordati prima di partire.',
    url: '/pricing',
    type: 'website',
    images: ['/opengraph-image'],
  },
};

export default function PricingPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Tariffe', path: '/pricing' }]} />
      <PricingView />
    </>
  );
}
