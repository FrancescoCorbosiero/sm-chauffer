'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Clock, Globe2, Plane, ShieldCheck, type LucideIcon } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import PageHero from '@/components/ui/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { SERVICE_ICONS } from '@/components/ui/serviceIcons';
import HowItWorks from '@/components/sections/HowItWorks';
import FaqBlock from '@/components/sections/FaqBlock';
import CtaBand from '@/components/sections/CtaBand';
import PriceValue, { priceCaption } from './PriceValue';
import { services } from '@/lib/data';
import { bookingHref } from '@/lib/booking';
import { whatsappHref } from '@/lib/contact';
import { getServicePage, servicePrice, splitTitle } from '@/lib/servicePages';
import type { Service } from '@/lib/types';

const WHY_ICONS: Record<string, LucideIcon> = { ShieldCheck, Clock, Globe2, Plane };

export default function ServicesIndexView() {
  const t = useTranslation();
  usePageTitle(t.meta.services.title, t.meta.services.description);
  const p = t.servicesPage;
  const why = t.whyUs;
  const [whyHead, whyAccent] = splitTitle(why.title);

  return (
    <>
      <PageHero
        crumbs={[{ label: t.nav.home, href: '/' }, { label: p.label }]}
        eyebrow={p.label}
        title={p.title}
        accent={p.accent}
        description={p.description}
        below={
          <nav aria-label={p.jump} className="intro" style={{ ['--d' as string]: 280 }}>
            <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
              {services.map((s) => {
                const Icon = SERVICE_ICONS[s.icon];
                return (
                  <li key={s.id} className="shrink-0">
                    <a href={`#${s.id}`} className="chip chip-dark">
                      {Icon && <Icon size={15} aria-hidden className="text-gold" />}
                      {t.services[s.id]?.title ?? s.id}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Link href={bookingHref()} className="btn btn-gold">
            {t.actions.book}
            <ArrowRight size={16} aria-hidden />
          </Link>
          <a
            href={whatsappHref(t.actions.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-light"
          >
            <WhatsAppIcon size={16} />
            WhatsApp
          </a>
        </div>
      </PageHero>

      <section className="section-y bg-white">
        <div className="container-x flex flex-col gap-20 md:gap-24 lg:gap-28">
          {services.map((s, i) => (
            <ServiceRow key={s.id} service={s} index={i} />
          ))}
        </div>
      </section>

      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHeading className="reveal" eyebrow={why.label} title={whyHead} accent={whyAccent} description={why.description} />
          <ul className="reveal-stagger mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {why.items.map((item, i) => {
              const Icon = WHY_ICONS[item.icon] ?? ShieldCheck;
              return (
                <li
                  key={item.title}
                  style={{ ['--i' as string]: i }}
                  className="rounded-2xl border border-line bg-white p-6 lg:p-7"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-gold">
                    <Icon size={19} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-[1.5rem] leading-tight text-ink">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <HowItWorks />
      <FaqBlock withJsonLd={false} />
      <CtaBand />
    </>
  );
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const t = useTranslation();
  const s = t.services[service.id];
  const page = getServicePage(service.id);
  if (!s || !page) return null;
  const price = servicePrice(page);
  const Icon = SERVICE_ICONS[service.icon];
  const href = `/services/${service.id}`;
  const reverse = index % 2 === 1;
  const titleId = `${service.id}-title`;

  return (
    <article
      id={service.id}
      aria-labelledby={titleId}
      className="reveal grid scroll-mt-28 grid-cols-1 items-center gap-8 md:gap-10 lg:grid-cols-12 lg:gap-14"
    >
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className={`group relative block aspect-[4/3] overflow-clip rounded-3xl bg-ink lg:col-span-6 ${
          reverse ? 'lg:order-2' : ''
        }`}
      >
        <Image
          src={service.image}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-[1400ms] ease-smooth group-hover:scale-[1.04]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/5 to-transparent" />
        <span className="absolute bottom-5 left-6 font-display text-6xl leading-none text-white/90 tabular md:bottom-7 md:left-8 md:text-7xl">
          {String(index + 1).padStart(2, '0')}
        </span>
        {Icon && (
          <span className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm md:right-7 md:top-7">
            <Icon size={20} aria-hidden />
          </span>
        )}
      </Link>

      <div className="min-w-0 lg:col-span-6">
        <h2 id={titleId} className="text-4xl text-ink">
          <Link href={href} className="transition-colors hover:text-gold-deep">
            {s.title}
          </Link>
        </h2>
        <p className="mt-4 text-lg leading-snug text-ink">{s.description}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-muted md:text-base">{s.longDescription}</p>
        <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {s.features.map((f) => (
            <li key={f.title} className="flex items-start gap-2.5 text-[15px] leading-snug text-ink">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-deep">
                <Check size={12} aria-hidden />
              </span>
              {f.title}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <PriceValue price={price} className="font-display text-[2rem] leading-none text-ink" />
            <p className="mt-1.5 text-sm text-muted">{priceCaption(price, t)}</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href={href} className="btn btn-primary" aria-label={`${t.servicesPage.discover} — ${s.title}`}>
              {t.servicesPage.discover}
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link
              href={bookingHref({ type: page.bookingType })}
              className="btn btn-outline"
              aria-label={`${t.actions.book} — ${s.title}`}
            >
              {t.actions.book}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
