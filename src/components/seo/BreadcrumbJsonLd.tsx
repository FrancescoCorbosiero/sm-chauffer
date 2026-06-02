import { SITE } from '@/lib/site';

type Crumb = { name: string; path: string };

/**
 * Emits a BreadcrumbList JSON-LD for an internal page. "Home" is prepended
 * automatically, so callers pass only the trailing crumbs, e.g.:
 *   <BreadcrumbJsonLd items={[{ name: 'Flotta', path: '/fleet' }]} />
 *
 * Server-rendered into the static HTML so Google can show breadcrumb rich
 * results in the SERP.
 */
export default function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      ...items.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: c.name,
        item: `${SITE.url}${c.path}`,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
