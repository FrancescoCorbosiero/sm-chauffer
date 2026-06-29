import type { Metadata } from 'next';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import VehiclesJsonLd from '@/components/seo/VehiclesJsonLd';

export const metadata: Metadata = {
  title: 'La nostra flotta — Mercedes, BMW, Range Rover',
  description:
    'Flotta Transfer Luxury Driver: Mercedes Classe S, Classe E, V-Class, BMW Serie 7 e Range Rover. Veicoli premium per transfer, eventi e tour a Milano, Brianza e in tutta Italia.',
  alternates: { canonical: '/fleet' },
  openGraph: {
    title: 'La nostra flotta luxury · Transfer Luxury Driver',
    description:
      'Mercedes, BMW e Range Rover sempre disponibili per i tuoi spostamenti a Milano e Brianza.',
    url: '/fleet',
    type: 'website',
    images: ['/opengraph-image'],
  },
};

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Flotta', path: '/fleet' }]} />
      <VehiclesJsonLd />
      {children}
    </>
  );
}
