'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { FAQ } from '@/lib/faq';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function FaqSection() {
  const { locale, t } = useLanguage();
  const items = FAQ[locale] ?? FAQ.it;
  const [open, setOpen] = useState(0);

  // FAQPage structured data — built from the Italian (canonical) FAQ so it
  // matches the prerendered HTML that search engines read.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.it.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };

  return (
    <section className="section-y bg-[var(--color-surface)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-x">
        <ScrollReveal>
          <SectionHeader align="center" label={t.faq.label} title={t.faq.title} className="mb-12" />
        </ScrollReveal>
        <ScrollReveal>
          <div className="mx-auto max-w-3xl">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="border-b border-[var(--color-border)]">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="text-base font-medium text-[var(--color-ink)]">
                        {item.q}
                      </span>
                      <Plus
                        size={18}
                        aria-hidden
                        className={`shrink-0 text-[var(--color-text-muted)] transition-transform duration-300 ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                      />
                    </button>
                  </h3>
                  {/* grid-rows trick: smooth height animation, answer stays in the
                      DOM (good for SEO) even when visually collapsed. */}
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 pr-8 text-[15px] leading-relaxed text-[var(--color-text-muted)]">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
