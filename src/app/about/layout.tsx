import type { Metadata } from 'next';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: 'Chi siamo — SK Luxury Chauffeur',
  description:
    'Dal 2014 SK Luxury Chauffeur è il riferimento per il noleggio con conducente di lusso a Milano e in Brianza. Flotta premium, autisti selezionati e standard del settore luxury hospitality.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'Chi siamo · SK Luxury Chauffeur',
    description:
      'Dieci anni di esperienza nei trasferimenti di lusso a Milano, Brianza e in tutta Italia.',
    url: '/about',
    type: 'website',
    images: ['/opengraph-image'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Chi siamo', path: '/about' }]} />
      {children}
    </>
  );
}
