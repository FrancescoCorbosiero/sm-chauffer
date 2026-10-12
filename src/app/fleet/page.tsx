import type { Metadata } from 'next';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import VehiclesJsonLd from '@/components/seo/VehiclesJsonLd';
import FleetIndexView from '@/components/fleet/FleetIndexView';

export const metadata: Metadata = {
  title: 'La flotta — Mercedes Classe S, E, V, Range Rover e minibus',
  description:
    'Flotta Transfer Luxury Driver: Mercedes Classe S, Classe E e Classe V, Range Rover e minibus da 18 posti, sempre con autista. Capienza e tariffe orarie a confronto.',
  alternates: { canonical: '/fleet' },
  openGraph: {
    title: 'La flotta · Transfer Luxury Driver',
    description:
      'Mercedes Classe S, E e V, Range Rover e minibus da 18 posti con autista a Milano, in Brianza e sul Lago di Como.',
    url: '/fleet',
    type: 'website',
    images: ['/opengraph-image'],
  },
};

export default function FleetPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Flotta', path: '/fleet' }]} />
      <VehiclesJsonLd />
      <FleetIndexView />
    </>
  );
}
