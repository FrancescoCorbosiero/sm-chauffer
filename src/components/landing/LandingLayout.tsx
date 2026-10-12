import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Accordion from '@/components/ui/Accordion';
import CtaBand from '@/components/sections/CtaBand';
import type { Crumb } from '@/components/ui/Breadcrumbs';
import { SITE } from '@/lib/site';
import RuledList from '@/components/ui/RuledList';

export interface LandingCopy {
  quoteCta: string;
  serviceEyebrow: string;
  serviceTitle: string;
  routesEyebrow: string;
  routesTitle: string;
  faqEyebrow: string;
  faqTitle: string;
}

/**
 * Shared layout of the single-language SEO landing pages (/ncc/[city] in
 * Italian, /en/* and /de/*). Server-rendered: all copy arrives as props in
 * the page's own language.
 */
export default function LandingLayout({
  crumbs,
  eyebrow,
  title,
  description,
  image,
  quoteHref,
  copy,
  intro,
  highlights,
  routes,
  faq,
  related,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  quoteHref: string;
  copy: LandingCopy;
  intro: string[];
  highlights: Array<{ title: string; description: string }>;
  routes: string[];
  faq: Array<{ q: string; a: string }>;
  /** Cross-links block (other zones, languages, main pages). */
  related: ReactNode;
}) {
  return (
    <>
      <PageHero size="lg" crumbs={crumbs} eyebrow={eyebrow} title={title} description={description} image={image}>
        <div className="flex flex-wrap gap-3">
          <Link href={quoteHref} className="btn btn-gold">
            {copy.quoteCta}
            <ArrowRight size={16} aria-hidden />
          </Link>
          <a href={`tel:${SITE.phone}`} className="btn btn-outline-light tabular">
            <Phone size={16} aria-hidden />
            {SITE.phoneDisplay}
          </a>
        </div>
      </PageHero>

      <section className="section-y bg-white">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="reveal min-w-0 lg:col-span-7">
            <SectionHeading eyebrow={copy.serviceEyebrow} title={copy.serviceTitle} />
            <div className="mt-8 space-y-5">
              {intro.map((p, i) => (
                <p
                  key={i}
                  className={i === 0 ? 'text-lg leading-relaxed text-ink' : 'text-[1.0625rem] leading-relaxed text-muted'}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
          <RuledList
            className="min-w-0 self-start lg:col-span-5"
            cols={1}
            numbered
            items={highlights.map((h) => ({ title: h.title, text: h.description }))}
          />
        </div>
      </section>

      <section className="section-y bg-ivory">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="reveal min-w-0 lg:col-span-5">
            <SectionHeading eyebrow={copy.routesEyebrow} title={copy.routesTitle} />
            <ol className="mt-8 overflow-clip rounded-2xl border border-line bg-white">
              {routes.map((r, i) => (
                <li key={r} className="flex items-baseline gap-4 border-b border-line px-5 py-4 last:border-0">
                  <span aria-hidden className="font-display text-lg leading-none text-gold-deep tabular">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] leading-snug text-ink">{r}</span>
                </li>
              ))}
            </ol>
            <Link href={quoteHref} className="link-arrow mt-6 text-sm">
              {copy.quoteCta}
              <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
          <div className="reveal min-w-0 lg:col-span-7">
            <SectionHeading eyebrow={copy.faqEyebrow} title={copy.faqTitle} />
            <div className="mt-8">
              <Accordion items={faq} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white py-14 md:py-16">
        <div className="container-x">{related}</div>
      </section>

      <CtaBand />
    </>
  );
}

/** Bottom cross-links of a landing page: sibling pages, main sections, languages. */
export function LandingRelated({
  label,
  chips,
  links,
  langs,
}: {
  label: string;
  chips: Array<{ href: string; label: string }>;
  links: Array<{ href: string; label: string }>;
  langs?: { label: string; items: Array<{ href: string; hrefLang: string; label: string }> };
}) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <p className="eyebrow">{label}</p>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {chips.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                className="chip transition-colors hover:border-ink hover:bg-ink hover:text-white"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex min-w-0 flex-col gap-4 lg:items-end">
        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="link-arrow">
                {l.label}
                <ArrowRight size={14} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        {langs && langs.items.length > 0 && (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">{langs.label}</span>
            {langs.items.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                hrefLang={l.hrefLang}
                className="font-semibold text-ink underline-offset-4 hover:underline"
              >
                {l.label}
              </Link>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
