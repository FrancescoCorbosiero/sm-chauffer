import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { LOCALES } from '@/i18n/types';
import { blogPosts } from '@/lib/data';

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
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((r) => ({
    url: r.path === '/' ? base : `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    alternates: { languages },
  }));

  // Individual blog posts (single-language content, so no hreflang alternates).
  const postEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.dateISO),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}
