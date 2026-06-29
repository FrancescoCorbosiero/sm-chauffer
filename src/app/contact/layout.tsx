import type { Metadata } from 'next';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: 'Contatti e prenotazioni — Telefono, WhatsApp, email',
  description:
    'Prenota il tuo NCC di lusso a Milano e in Brianza. Risposta rapida via WhatsApp o email, 24/7. Telefono, mail e modulo di prenotazione.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contatti · Transfer Luxury Driver',
    description:
      'Richiedi un preventivo via WhatsApp o email. Servizio NCC 24/7 a Milano, Brianza e in tutta Italia.',
    url: '/contact',
    type: 'website',
    images: ['/opengraph-image'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Contatti', path: '/contact' }]} />
      {children}
    </>
  );
}
