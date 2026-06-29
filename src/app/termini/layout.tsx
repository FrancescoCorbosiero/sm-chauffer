import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termini e Condizioni',
  description:
    'Termini e condizioni del servizio di noleggio con conducente (NCC) di Transfer Luxury Driver.',
  alternates: { canonical: '/termini' },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
