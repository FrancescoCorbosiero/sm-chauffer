import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Guide, destinazioni e lifestyle del trasferimento luxury',
  description:
    'Guide ai transfer di lusso da Malpensa, itinerari nel Lago di Como, consigli per la Milano Fashion Week e racconti dal mondo del noleggio con conducente.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog · SM Luxury Chauffer',
    description:
      'Approfondimenti su transfer di lusso, destinazioni e cultura del servizio NCC.',
    url: '/blog',
    type: 'website',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
