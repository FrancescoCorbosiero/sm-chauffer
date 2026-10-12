'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import PageHero from '@/components/ui/PageHero';
import { LEGAL, type LegalDocKey } from '@/lib/legal';
import { SITE } from '@/lib/site';

const DOC_HREF: Record<LegalDocKey, string> = {
  privacy: '/privacy-policy',
  cookie: '/cookie-policy',
  terms: '/termini',
};

const UI = {
  it: { eyebrow: 'Informazioni legali', updated: 'Ultimo aggiornamento', toc: 'Indice', others: 'Altri documenti' },
  en: { eyebrow: 'Legal information', updated: 'Last updated', toc: 'Contents', others: 'Other documents' },
} as const;

/**
 * Renders a legal document (Privacy / Cookie / Terms) in the visitor's language.
 * English is shown for `en`; every other locale falls back to the binding
 * Italian version.
 */
export default function LegalDoc({ docKey }: { docKey: LegalDocKey }) {
  const { locale, t } = useLanguage();
  const lang = locale === 'en' ? 'en' : 'it';
  const doc = LEGAL[docKey][lang];
  const ui = UI[lang];
  const others = (Object.keys(DOC_HREF) as LegalDocKey[]).filter((k) => k !== docKey);

  usePageTitle(`${doc.title} · ${SITE.name}`);

  return (
    <>
      <PageHero
        crumbs={[{ label: t.nav.home, href: '/' }, { label: doc.title }]}
        eyebrow={ui.eyebrow}
        title={doc.title}
        description={`${ui.updated}: ${doc.updated}`}
      />

      <div className="section-y bg-white">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          <aside className="min-w-0 lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <nav aria-label={ui.toc} className="rounded-2xl border border-line bg-ivory p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-deep">{ui.toc}</p>
                <ol className="mt-4 space-y-2.5 text-[15px]">
                  {doc.sections.map((s, i) => (
                    <li key={s.heading} className="flex gap-3">
                      <span aria-hidden className="text-faint tabular">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <a href={`#s-${i + 1}`} className="leading-snug text-ink hover:text-gold-deep">
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <div className="mt-4 rounded-2xl border border-line p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-deep">{ui.others}</p>
                <ul className="mt-3 space-y-2 text-[15px]">
                  {others.map((k) => (
                    <li key={k}>
                      <Link href={DOC_HREF[k]} className="text-ink underline-offset-4 hover:underline">
                        {LEGAL[k][lang].title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <article className="min-w-0 max-w-[46rem] lg:col-span-8">
            {doc.intro.map((p, i) => (
              <p key={i} className={`${i === 0 ? 'text-lg text-ink' : 'mt-5 text-[1.0625rem] text-muted'} leading-relaxed`}>
                {p}
              </p>
            ))}

            {doc.sections.map((s, i) => (
              <section key={s.heading} id={`s-${i + 1}`} className="mt-12 scroll-mt-28 border-t border-line pt-10">
                <h2 className="text-[1.75rem] leading-tight text-ink">
                  <span aria-hidden className="mr-3 text-gold-deep tabular">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.heading}
                </h2>
                {s.body.map((p, j) => (
                  <p key={j} className="mt-4 text-[1.0625rem] leading-relaxed text-ink/80">
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="mt-4 space-y-2.5">
                    {s.list.map((li, k) => (
                      <li key={k} className="flex gap-3 text-[1.0625rem] leading-relaxed text-ink/80">
                        <span aria-hidden className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>
        </div>
      </div>
    </>
  );
}
