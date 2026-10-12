import type { Metadata } from 'next';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import ServicesIndexView from '@/components/services/ServicesIndexView';

export const metadata: Metadata = {
  title: 'Servizi NCC a Milano e Brianza — transfer, autista, tour',
  description:
    'Transfer aeroportuali Malpensa, Linate e Orio al Serio, autista privato a Milano e Brianza, tour Lago di Como, trasferimenti internazionali e minibus. Servizio NCC 24/7.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Servizi NCC · Transfer Luxury Driver',
    description:
      'Transfer aeroportuali, autista privato a Milano e Brianza, tour del Lago di Como, trasferimenti internazionali e minibus per gruppi.',
    url: '/services',
    type: 'website',
    images: ['/opengraph-image'],
  },
};

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Servizi', path: '/services' }]} />
      <ServicesIndexView />
    </>
  );
}
