import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { LOCALES } from '@/i18n/types';
import { blogPosts } from '@/lib/data';
import { locations } from '@/lib/locations';
import { intlLandings, hreflangFor } from '@/lib/intlLandings';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = SITE.url;

  const languages = Object.fromEntries(LOCALES.map((l) => [l, base])) as Record<
    string,
    string
  >;

  const routes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  }> = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/fleet', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/privacy-policy', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/cookie-policy', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/termini', priority: 0.2, changeFrequency: 'yearly' },
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((r) => ({
    url: r.path === '/' ? base : `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    alternates: { languages },
  }));

  // City/area landing pages (Italian-canonical, like the blog posts).
  const locationEntries: MetadataRoute.Sitemap = locations.map((loc) => ({
    url: `${base}/ncc/${loc.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // International (English / German) landing pages, with reciprocal hreflang.
  const intlEntries: MetadataRoute.Sitemap = intlLandings.map((entry) => ({
    url: `${base}/${entry.lang}/${entry.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
    alternates: {
      languages: Object.fromEntries(
        Object.entries(hreflangFor(entry)).map(([lang, path]) => [lang, `${base}${path}`]),
      ),
    },
  }));

  // Individual blog posts (single-language content, so no hreflang alternates).
  const postEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.dateISO),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [...staticEntries, ...locationEntries, ...intlEntries, ...postEntries];
}
