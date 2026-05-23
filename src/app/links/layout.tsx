import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Links — SM Luxury Chauffer',
  description: 'Pagina linktree con i canali principali del brand.',
  robots: { index: false, follow: false },
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
