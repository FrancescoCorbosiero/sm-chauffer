import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /api/* is non-content; /api/blackhole is the bot trap — well-behaved
        // crawlers obey this and never trip it.
        disallow: ['/links', '/api/'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
