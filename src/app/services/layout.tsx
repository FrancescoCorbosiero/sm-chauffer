import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servizi NCC a Milano e Brianza — transfer, autista, tour',
  description:
    'Transfer aeroportuali Malpensa, Linate e Orio al Serio, autista privato a Milano e Brianza, tour Lago di Como, trasferimenti internazionali. Servizio NCC 24/7.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Servizi NCC · Chauffeur SK Luxury Milano',
    description:
      'Transfer aeroportuali, autista privato a Milano e Brianza, tour del Lago di Como, trasferimenti internazionali.',
    url: '/services',
    type: 'website',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
