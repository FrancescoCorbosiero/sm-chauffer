import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Informativa sul trattamento dei dati personali ai sensi del GDPR per Chauffeur SK Luxury Milano.',
  alternates: { canonical: '/privacy-policy' },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
