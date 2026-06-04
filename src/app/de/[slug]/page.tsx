import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import IntlLandingView from '@/components/landing/IntlLandingView';
import { getIntlLanding, hreflangFor, intlLandingsFor } from '@/lib/intlLandings';

export const dynamicParams = false;

export function generateStaticParams() {
  return intlLandingsFor('de').map((l) => ({ slug: l.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = getIntlLanding('de', slug);
  if (!entry) return {};
  const url = `/de/${entry.slug}`;
  return {
    title: entry.metaTitle,
    description: entry.metaDescription,
    keywords: entry.keywords,
    alternates: { canonical: url, languages: hreflangFor(entry) },
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      title: entry.metaTitle,
      description: entry.metaDescription,
      url,
      images: [{ url: entry.image, alt: entry.heroTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.metaTitle,
      description: entry.metaDescription,
      images: [entry.image],
    },
  };
}

export default async function DeLandingPage({ params }: Params) {
  const { slug } = await params;
  const entry = getIntlLanding('de', slug);
  if (!entry) notFound();
  return <IntlLandingView entry={entry} />;
}
