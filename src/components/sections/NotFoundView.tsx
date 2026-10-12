'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import { SITE } from '@/lib/site';
import { bookingHref } from '@/lib/booking';

/** Branded 404: says what happened and offers the main ways forward. */
export default function NotFoundView() {
  const t = useTranslation();
  const n = t.notFound;
  usePageTitle(`${n.label} · ${SITE.name}`);

  const pages = [
    { href: '/services', label: t.nav.services },
    { href: '/fleet', label: t.nav.fleet },
    { href: '/pricing', label: t.nav.pricing },
    { href: '/areas', label: t.nav.areas },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <section className="ink-panel on-ink relative overflow-clip">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 select-none font-display text-[22rem] leading-none text-white/[0.035] md:block"
      >
        404
      </span>
      <div className="container-x relative flex min-h-[70vh] flex-col justify-center py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="intro eyebrow eyebrow-light">{n.label}</p>
          <h1 className="intro mt-5 text-5xl text-white" style={{ ['--d' as string]: 80 }}>
            {n.title} <span className="title-accent title-accent-light">{n.accent}</span>
          </h1>
          <p className="intro mt-6 text-lg leading-relaxed text-white/70" style={{ ['--d' as string]: 140 }}>
            {n.text}
          </p>
          <div className="intro mt-9 flex flex-wrap gap-3" style={{ ['--d' as string]: 200 }}>
            <Link href="/" className="btn btn-gold">
              {n.home}
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href={bookingHref()} className="btn btn-outline-light">
              {t.actions.book}
            </Link>
          </div>
          <nav aria-label={n.popular} className="intro mt-12" style={{ ['--d' as string]: 260 }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">{n.popular}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {pages.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="chip chip-dark">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
