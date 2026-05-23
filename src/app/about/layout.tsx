import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chi siamo — SM Luxury Chauffer Milano',
  description:
    'Dal 2014 SM Luxury Chauffer è il riferimento per il noleggio con conducente di lusso a Milano e in Brianza. Flotta premium, autisti selezionati e standard del settore luxury hospitality.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'Chi siamo · SM Luxury Chauffer',
    description:
      'Dieci anni di esperienza nei trasferimenti di lusso a Milano, Brianza e in tutta Italia.',
    url: '/about',
    type: 'website',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
