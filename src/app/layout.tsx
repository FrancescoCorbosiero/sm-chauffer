import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import ScrollProgress from '@/components/ui/ScrollProgress';
import JsonLd from '@/components/seo/JsonLd';
import SpeculationRules from '@/components/seo/SpeculationRules';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import SkipLink from '@/components/layout/SkipLink';
import { SITE } from '@/lib/site';
import { LOCALES } from '@/i18n/types';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const description =
  'Noleggio Con Conducente (NCC) di lusso a Milano, in Brianza, sul Lago di Como, a Bellagio e Tremezzo. Flotta Mercedes, BMW e Range Rover. Transfer Malpensa, Linate, Orio al Serio e servizio business 24/7.';

const keywords = [
  'NCC Milano',
  'NCC Brianza',
  'NCC Monza',
  'NCC Como',
  'NCC Bellagio',
  'NCC Tremezzo',
  'autista privato Milano',
  'autista privato Brianza',
  'autista privato Como',
  'autista Lago di Como',
  'noleggio con conducente Milano',
  'noleggio con conducente Brianza',
  'transfer Malpensa Milano',
  'transfer Malpensa Brianza',
  'transfer Linate',
  'transfer Orio al Serio',
  'auto di lusso con autista Milano',
  'chauffeur Milano',
  'chauffeur Lago di Como',
  'servizio NCC Lombardia',
  'Mercedes Classe S con autista',
  'autista Fashion Week Milano',
  'tour Lago di Como con autista',
  'tour Bellagio Tremezzo',
  'transfer Lugano',
  'servizio VIP Milano',
  'auto matrimonio Como',
  'limousine service Milan Brianza Como',
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Chauffeur SK Luxury Milano — NCC e Autista di Lusso a Milano, Brianza e Lago di Como',
    template: '%s · Chauffeur SK Luxury Milano',
  },
  description,
  applicationName: SITE.name,
  generator: 'Next.js',
  keywords,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  category: 'Transportation',
  formatDetection: { telephone: false, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    alternateLocale: ['en_US', 'fr_FR', 'de_DE', 'es_ES', 'ru_RU', 'sq_AL'],
    url: SITE.url,
    siteName: SITE.name,
    title: 'Chauffeur SK Luxury Milano — Autista di lusso a Milano, in Brianza e sul Lago di Como',
    description,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Chauffeur SK Luxury Milano — flotta luxury a Milano, in Brianza e sul Lago di Como',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chauffeur SK Luxury Milano — Autista di lusso a Milano, in Brianza e sul Lago di Como',
    description,
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/',
    languages: Object.fromEntries(LOCALES.map((l) => [l, '/'])),
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <LanguageProvider>
          <SkipLink />
          <ScrollProgress />
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          <WhatsAppButton />
        </LanguageProvider>
        <JsonLd />
        <SpeculationRules />
      </body>
    </html>
  );
}
