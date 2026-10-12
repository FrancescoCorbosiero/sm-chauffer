import type { Metadata } from 'next';
import NotFoundView from '@/components/sections/NotFoundView';

export const metadata: Metadata = {
  title: 'Pagina non trovata',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundView />;
}
