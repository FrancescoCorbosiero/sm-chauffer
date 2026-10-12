'use client';
import { Phone } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { FAQ, type FaqItem } from '@/lib/faq';
import SectionHeading from '@/components/ui/SectionHeading';
import Accordion from '@/components/ui/Accordion';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { phoneLabel, telHref, whatsappHref } from '@/lib/contact';

/**
 * FAQ with a "still have a question?" contact card. Emits FAQPage JSON-LD
 * from the Italian (canonical) items so it matches the prerendered HTML.
 */
export default function FaqBlock({
  items,
  canonical,
  withJsonLd = true,
}: {
  /** Localized items; defaults to the general FAQ. */
  items?: FaqItem[];
  /** Italian items for the structured data; defaults to the general FAQ. */
  canonical?: FaqItem[];
  withJsonLd?: boolean;
}) {
  const { locale, t } = useLanguage();
  const list = items ?? FAQ[locale] ?? FAQ.it;
  const jsonItems = canonical ?? FAQ.it;
  const f = t.faq;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: jsonItems.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };

  return (
    <section className="section-y bg-ivory">
      {withJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="reveal min-w-0 lg:col-span-5">
          <SectionHeading eyebrow={f.label} title={f.title} accent={f.accent} description={f.description} />
          <div className="mt-8 rounded-2xl bg-ink p-7 text-white">
            <p className="font-display text-[1.6rem] leading-tight">{f.ctaTitle}</p>
            <p className="mt-2 text-[15px] text-white/65">{f.ctaText}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappHref(t.actions.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold btn-sm"
              >
                <WhatsAppIcon size={16} />
                WhatsApp
              </a>
              <a href={telHref(1)} className="btn btn-outline-light btn-sm tabular">
                <Phone size={15} aria-hidden />
                {phoneLabel(1)}
              </a>
            </div>
          </div>
        </div>
        <div className="reveal min-w-0 lg:col-span-7">
          <Accordion items={list} />
        </div>
      </div>
    </section>
  );
}
