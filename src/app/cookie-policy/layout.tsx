import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'Informativa sui cookie e sulle tecnologie di tracciamento utilizzate da SK Luxury Chauffeur.',
  alternates: { canonical: '/cookie-policy' },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
