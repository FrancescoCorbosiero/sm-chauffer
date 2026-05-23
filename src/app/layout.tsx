import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import ScrollProgress from '@/components/ui/ScrollProgress';
import JsonLd from '@/components/seo/JsonLd';
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
  'Noleggio Con Conducente (NCC) di lusso a Milano, Monza Brianza e in tutta Italia. Flotta Mercedes, BMW e Range Rover. Transfer Malpensa, Linate, Orio al Serio, tour privati Lago di Como e servizio business 24/7.';

const keywords = [
  'NCC Milano',
  'NCC Monza',
  'NCC Brianza',
  'autista privato Milano',
  'autista privato Brianza',
  'noleggio con conducente Milano',
  'noleggio con autista Milano',
  'transfer Malpensa Milano',
  'transfer Linate',
  'transfer Orio al Serio',
  'auto di lusso con autista Milano',
  'chauffeur Milano',
  'servizio NCC Lombardia',
  'Mercedes Classe S con autista',
  'autista Fashion Week Milano',
  'tour Lago di Como con autista',
  'transfer Sankt Moritz da Milano',
  'servizio VIP Milano',
  'auto matrimonio Milano',
  'limousine service Milan',
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'SM Luxury Chauffer — NCC e Autista di Lusso a Milano, Brianza e in Italia',
    template: '%s · SM Luxury Chauffer',
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
    alternateLocale: ['en_US', 'fr_FR', 'de_DE', 'es_ES', 'ro_RO', 'sq_AL'],
    url: SITE.url,
    siteName: SITE.name,
    title: 'SM Luxury Chauffer — Autista di lusso a Milano e Brianza',
    description,
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'SM Luxury Chauffer — flotta luxury a Milano',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SM Luxury Chauffer — Autista di lusso a Milano e Brianza',
    description,
    images: ['/og.jpg'],
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
      </body>
    </html>
  );
}
