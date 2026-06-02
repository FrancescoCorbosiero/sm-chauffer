'use client';

import { useLanguage } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import { LEGAL, type LegalDocKey } from '@/lib/legal';
import { SITE } from '@/lib/site';

/**
 * Renders a legal document (Privacy / Cookie / Terms) in the visitor's language.
 * English is shown for `en`; every other locale falls back to the binding
 * Italian version.
 */
export default function LegalDoc({ docKey }: { docKey: LegalDocKey }) {
  const { locale } = useLanguage();
  const lang = locale === 'en' ? 'en' : 'it';
  const doc = LEGAL[docKey][lang];
  const updatedLabel = lang === 'en' ? 'Last updated' : 'Ultimo aggiornamento';

  usePageTitle(`${doc.title} · ${SITE.name}`);

  return (
    <article className="bg-[var(--color-bg)] pt-32 pb-24 md:pt-40">
      <div className="container-x max-w-3xl">
        <h1 className="text-[clamp(2.2rem,1.4rem+2.5vw,3.4rem)] font-light tracking-tight text-[var(--color-ink)]">
          {doc.title}
        </h1>
        <p className="mt-3 text-sm text-[var(--color-text-faint)]">
          {updatedLabel}: {doc.updated}
        </p>

        {doc.intro.map((p, i) => (
          <p key={i} className="mt-6 leading-relaxed text-[var(--color-text-muted)]">
            {p}
          </p>
        ))}

        {doc.sections.map((s, i) => (
          <section key={i} className="mt-10">
            <h2 className="text-xl font-medium text-[var(--color-ink)]">{s.heading}</h2>
            {s.body.map((p, j) => (
              <p key={j} className="mt-3 leading-relaxed text-[var(--color-text-muted)]">
                {p}
              </p>
            ))}
            {s.list && (
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-[var(--color-text-muted)]">
                {s.list.map((li, k) => (
                  <li key={k}>{li}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
