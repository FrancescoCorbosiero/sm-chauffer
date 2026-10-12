'use client';
import { Check, Phone } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import PageHero from '@/components/ui/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import LiveStatus from '@/components/ui/LiveStatus';
import BookingWizard from '@/components/booking/BookingWizard';
import ContactChannels from '@/components/booking/ContactChannels';
import FaqBlock from '@/components/sections/FaqBlock';
import { SITE } from '@/lib/site';
import { phoneLabel, telHref } from '@/lib/contact';

export default function ContactPage() {
  const t = useTranslation();
  usePageTitle(t.meta.contact.title, t.meta.contact.description);
  const c = t.contactPage;
  const w = t.wizard;
  const addr = SITE.legalAddress;

  const company: Array<[string, string]> = [
    [c.companyOwner, SITE.legalName],
    [c.companyVat, SITE.vatNumber],
    [c.companyTax, SITE.taxCode],
    [t.footer.sdiLabel, SITE.sdiCode],
    [t.footer.registeredOffice, `${addr.street}, ${addr.postalCode} ${addr.locality} (${addr.province})`],
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: t.nav.home, href: '/' }, { label: c.label }]}
        eyebrow={c.label}
        title={c.title}
        accent={c.accent}
        description={c.description}
        below={<ContactChannels />}
      />

      <section id="prenota" className="section-y scroll-mt-16 bg-ivory">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="min-w-0 lg:col-span-8">
            <SectionHeading eyebrow={w.eyebrow} title={w.title} accent={w.accent} description={w.description} />
            <div className="mt-10">
              <BookingWizard />
            </div>
          </div>

          <aside className="flex min-w-0 flex-col gap-4 self-start lg:sticky lg:top-24 lg:col-span-4 lg:mt-[10.5rem]">
            <div className="rounded-3xl bg-ink p-7 text-white">
              <LiveStatus className="text-sm text-white/70" />
              <h2 className="mt-4 text-[1.75rem] leading-tight">{c.asideTitle}</h2>
              <ul className="mt-5 space-y-3">
                {c.asideItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-white/80">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                      <Check size={12} aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-line bg-white p-7">
              <h2 className="text-[1.6rem] leading-tight text-ink">{c.callTitle}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.callText}</p>
              <div className="mt-5 flex flex-col gap-2.5">
                {([1, 2] as const).map((line) => (
                  <a key={line} href={telHref(line)} className="btn btn-outline btn-block tabular">
                    <Phone size={16} aria-hidden />
                    {phoneLabel(line)}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-white p-7">
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep">
                {c.companyTitle}
              </h2>
              <dl className="mt-4 divide-y divide-line text-sm">
                {company.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-right font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[13px] leading-relaxed text-muted">{c.invoiceNote}</p>
            </div>
          </aside>
        </div>
      </section>

      <FaqBlock />
    </>
  );
}
