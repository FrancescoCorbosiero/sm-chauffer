import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import IntlLandingJsonLd from '@/components/seo/IntlLandingJsonLd';
import LandingLayout, { LandingRelated } from './LandingLayout';
import { LANDING_UI, hreflangFor, intlLandingsFor, type IntlLanding } from '@/lib/intlLandings';
import { bookingHref } from '@/lib/booking';

export default function IntlLandingView({ entry }: { entry: IntlLanding }) {
  const ui = LANDING_UI[entry.lang];
  const siblings = intlLandingsFor(entry.lang).filter((l) => l.slug !== entry.slug);

  // Visible language cross-links: the paired other-language page + Italian.
  const alternates = hreflangFor(entry);
  const langItems = (['it', 'en', 'de'] as const)
    .filter((l) => l !== entry.lang)
    .map((l) => ({ l, href: l === 'it' ? entry.itHref : alternates[l] }))
    .filter((x): x is { l: 'it' | 'en' | 'de'; href: string } => Boolean(x.href))
    .map(({ l, href }) => ({ href, hrefLang: l, label: ui.langName[l] }));

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: entry.heroLabel, path: `/${entry.lang}/${entry.slug}` }]} />
      <IntlLandingJsonLd entry={entry} />

      <LandingLayout
        crumbs={[{ label: 'Home', href: '/' }, { label: entry.heroLabel }]}
        eyebrow={entry.heroLabel}
        title={entry.heroTitle}
        description={entry.heroDescription}
        image={entry.image}
        quoteHref={bookingHref()}
        copy={ui}
        intro={entry.intro}
        highlights={entry.highlights}
        routes={entry.routes}
        faq={entry.faq}
        related={
          <LandingRelated
            label={ui.serviceEyebrow}
            chips={siblings.map((o) => ({ href: `/${o.lang}/${o.slug}`, label: o.heroLabel }))}
            links={[
              { href: '/services', label: ui.services },
              { href: '/fleet', label: ui.fleet },
              { href: '/contact', label: ui.contact },
            ]}
            langs={{ label: ui.otherLangs, items: langItems }}
          />
        }
      />
    </>
  );
}
