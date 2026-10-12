import type { Metadata } from 'next';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: 'Zone servite — Milano, Brianza, Lago di Como e aeroporti',
  description:
    'Mappa delle zone servite dal nostro NCC: Milano, Monza e Brianza, Como e Lago di Como (Bellagio, Tremezzo, Varenna), aeroporti di Malpensa, Linate e Orio al Serio, Lugano e Svizzera. Distanze e tempi indicativi.',
  alternates: { canonical: '/areas' },
  openGraph: {
    title: 'Zone servite · Transfer Luxury Driver',
    description:
      'Da Milano al Lago di Como e oltre confine: la mappa interattiva delle zone servite, con distanze e tempi indicativi.',
    url: '/areas',
    type: 'website',
    images: ['/opengraph-image'],
  },
};

export default function AreasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Zone servite', path: '/areas' }]} />
      {children}
    </>
  );
}
