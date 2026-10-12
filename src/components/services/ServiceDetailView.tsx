'use client';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeEuro,
  Briefcase,
  Building2,
  Bus,
  Check,
  Clock,
  Flag,
  Globe,
  HeartHandshake,
  Landmark,
  Luggage,
  MapPin,
  MountainSnow,
  Network,
  Phone,
  Plane,
  PlaneLanding,
  Presentation,
  ReceiptText,
  Route,
  ShieldCheck,
  Sparkles,
  Stamp,
  Timer,
  UserRound,
  Users,
  Waves,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import PageHero from '@/components/ui/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Rail from '@/components/ui/Rail';
import VehicleCard from '@/components/ui/VehicleCard';
import ServiceCard from '@/components/ui/ServiceCard';
import LiveStatus from '@/components/ui/LiveStatus';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import HowItWorks from '@/components/sections/HowItWorks';
import FaqBlock from '@/components/sections/FaqBlock';
import CtaBand from '@/components/sections/CtaBand';
import PriceValue, { priceCaption } from './PriceValue';
import { services } from '@/lib/data';
import { FAQ } from '@/lib/faq';
import { SITE } from '@/lib/site';
import { bookingHref } from '@/lib/booking';
import { phoneLabel, telHref, whatsappHref } from '@/lib/contact';
import { COVERAGE_POINTS, formatDuration, pointName, type CoverageGroup } from '@/lib/coverage';
import {
  getService,
  getServicePage,
  serviceMaxPassengers,
  servicePrice,
  serviceVehicles,
  splitTitle,
} from '@/lib/servicePages';

/** Icons for the four highlights of each service (same order as t.services[id].features). */
const FEATURE_ICONS: Record<string, LucideIcon[]> = {
  'airport-transfer': [PlaneLanding, Luggage, BadgeEuro, Clock],
  'autista-milano': [Briefcase, Sparkles, Timer, ShieldCheck],
  'autista-brianza': [Building2, Flag, Landmark, Plane],
  'tour-privati': [Route, Waves, UserRound, Users],
  'trasferimenti-internazionali': [Globe, Stamp, MountainSnow, ReceiptText],
  'minibus-gruppi': [Bus, Presentation, HeartHandshake, Network],
};

const GROUP_ICONS: Record<CoverageGroup, LucideIcon> = {
  city: MapPin,
  lake: Waves,
  airport: Plane,
  intl: Globe,
};

export default function ServiceDetailView({ id }: { id: string }) {
  const { t, locale } = useLanguage();
  const page = getServicePage(id)!;
  const service = getService(id)!;
  const s = t.services[id];
  const d = t.serviceDetail;
  const selfHref = `/services/${id}`;

  usePageTitle(`${s.title} · ${SITE.name}`, s.description);

  const [head, accent] = splitTitle(s.title);
  const price = servicePrice(page);
  const fleet = serviceVehicles(page);
  const icons = FEATURE_ICONS[id] ?? [];
  const book = bookingHref({ type: page.bookingType });
  const zones = page.zones
    .map((z) => COVERAGE_POINTS.find((p) => p.id === z))
    .filter((p): p is (typeof COVERAGE_POINTS)[number] => Boolean(p));
  const others = services.filter((o) => o.id !== id);
  const faqItems = page.faq.map((i) => (FAQ[locale] ?? FAQ.it)[i]).filter(Boolean);
  const dur = (m: number) => formatDuration(m, t.coverage.unitMin, t.coverage.unitHour);

  const facts = [
    { value: <PriceValue price={price} />, label: priceCaption(price, t) },
    { value: `1–${serviceMaxPassengers(page)}`, label: d.paxLabel },
    { value: '24/7', label: d.availabilityLabel },
  ];

  return (
    <>
      <PageHero
        size="lg"
        image={service.image}
        crumbs={[
          { label: t.nav.home, href: '/' },
          { label: t.nav.services, href: '/services' },
          { label: s.title },
        ]}
        eyebrow={d.eyebrow}
        title={head}
        accent={accent}
        description={s.longDescription}
        below={
          <dl
            aria-label={d.factsLabel}
            className="intro grid grid-cols-1 overflow-clip rounded-2xl border border-white/10 bg-ink/40 backdrop-blur-sm sm:grid-cols-3"
            style={{ ['--d' as string]: 280 }}
          >
            {facts.map((f, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 px-5 py-4 sm:flex-col sm:items-start sm:gap-2 sm:px-7 sm:py-6 ${
                  i > 0 ? 'border-t border-white/10 sm:border-l sm:border-t-0' : ''
                }`}
              >
                <dt className="order-2 text-sm leading-snug text-white/60 sm:order-none">{f.label}</dt>
                <dd className="order-1 min-w-[5.5rem] shrink-0 font-display text-[1.9rem] leading-none text-white tabular sm:order-first sm:text-[2.4rem]">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Link href={book} className="btn btn-gold">
            {d.book}
            <ArrowRight size={16} aria-hidden />
          </Link>
          <a href={telHref(1)} className="btn btn-outline-light tabular">
            <Phone size={16} aria-hidden />
            {phoneLabel(1)}
          </a>
        </div>
      </PageHero>

      {/* What's included + booking card */}
      <section className="section-y bg-white">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="min-w-0 lg:col-span-7 xl:col-span-8">
            <SectionHeading className="reveal" eyebrow={d.featuresLabel} title={d.featuresTitle} accent={d.featuresAccent} />
            <ul className="reveal-stagger mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
              {s.features.map((f, i) => {
                const Icon = icons[i] ?? Check;
                return (
                  <li
                    key={f.title}
                    style={{ ['--i' as string]: i }}
                    className="rounded-2xl border border-line bg-ivory p-6 lg:p-7"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-gold">
                      <Icon size={19} aria-hidden />
                    </span>
                    <h3 className="mt-5 text-[1.5rem] leading-tight text-ink">{f.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.text}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="min-w-0 self-start lg:sticky lg:top-24 lg:col-span-5 xl:col-span-4">
            <div className="rounded-3xl bg-ink p-7 text-white">
              <LiveStatus className="text-sm text-white/70" />
              <h2 className="mt-4 text-[1.75rem] leading-tight">{d.asideTitle}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-white/65">{d.asideText}</p>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">{d.priceLabel}</p>
                <PriceValue price={price} className="mt-2 block font-display text-[2.1rem] leading-none text-white" />
                <p className="mt-2 text-sm leading-snug text-white/60">{priceCaption(price, t)}</p>
              </div>
              <Link href={book} className="btn btn-gold btn-block mt-6">
                {d.book}
                <ArrowRight size={16} aria-hidden />
              </Link>
              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <a href={telHref(1)} className="btn btn-outline-light btn-sm">
                  <Phone size={15} aria-hidden />
                  {t.actions.call}
                </a>
                <a
                  href={whatsappHref(t.actions.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light btn-sm"
                >
                  <WhatsAppIcon size={15} />
                  WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Recommended vehicles */}
      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHeading
            className="reveal"
            eyebrow={t.nav.fleet}
            title={d.vehiclesTitle}
            accent={d.vehiclesAccent}
            description={d.vehiclesText}
            action={
              <Link href="/fleet" className="link-arrow text-sm">
                {t.fleetPreview.cta}
                <ArrowRight size={15} aria-hidden />
              </Link>
            }
          />
          <div className="reveal mt-12">
            <Rail label={`${d.vehiclesTitle} ${d.vehiclesAccent}`}>
              {fleet.map((v) => (
                <VehicleCard key={v.id} vehicle={v} booking={{ type: page.bookingType }} />
              ))}
            </Rail>
          </div>
        </div>
      </section>

      {/* Typical routes */}
      <section className="section-y bg-white">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="reveal min-w-0 lg:col-span-5">
            <SectionHeading eyebrow={d.zonesLabel} title={d.zonesTitle} accent={d.zonesAccent} description={d.zonesText} />
            <Link href="/areas" className="link-arrow mt-8 text-sm">
              {t.coverage.openMap}
              <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
          <ul className="reveal min-w-0 divide-y divide-line border-y border-line lg:col-span-7">
            {zones.map((p) => {
              const Icon = GROUP_ICONS[p.group];
              const name = pointName(p, locale);
              const href = bookingHref(
                p.group === 'airport' ? { type: 'airport-transfer', to: p.bookTo } : { type: 'one-way', to: p.bookTo },
              );
              return (
                <li key={p.id} className="flex items-center gap-4 py-4 sm:gap-5 sm:py-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ivory text-gold-deep">
                    <Icon size={17} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug text-ink">
                      {p.href && p.href !== selfHref ? (
                        <Link href={p.href} className="underline-offset-4 hover:text-gold-deep hover:underline">
                          {name}
                        </Link>
                      ) : (
                        name
                      )}
                    </p>
                    <p className="mt-0.5 text-sm text-muted tabular">
                      ≈ {p.km} km · ≈ {dur(p.minutes)}
                    </p>
                  </div>
                  <Link
                    href={href}
                    className="btn btn-outline btn-sm shrink-0"
                    aria-label={`${t.actions.book} — ${name}`}
                  >
                    {t.actions.book}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <HowItWorks />

      <FaqBlock items={faqItems} canonical={page.faq.map((i) => FAQ.it[i])} withJsonLd={false} />

      {/* Other services */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading
            className="reveal"
            eyebrow={t.nav.services}
            title={d.otherTitle}
            accent={d.otherAccent}
            action={
              <Link href="/services" className="link-arrow text-sm">
                {t.nav.allServices}
                <ArrowRight size={15} aria-hidden />
              </Link>
            }
          />
          <div className="reveal mt-12">
            <Rail label={`${d.otherTitle} ${d.otherAccent}`}>
              {others.map((o) => (
                <ServiceCard key={o.id} service={o} />
              ))}
            </Rail>
          </div>
        </div>
      </section>

      <CtaBand href={book} />
    </>
  );
}
