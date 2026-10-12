'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Baby, BadgeEuro, Briefcase, Clock, Phone, UserRound, Users } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SectionHeading from '@/components/ui/SectionHeading';
import Rail from '@/components/ui/Rail';
import VehicleCard from '@/components/ui/VehicleCard';
import LiveStatus from '@/components/ui/LiveStatus';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import CtaBand from '@/components/sections/CtaBand';
import { services, vehicles } from '@/lib/data';
import { SITE } from '@/lib/site';
import { bookingHref } from '@/lib/booking';
import { phoneLabel, telHref, whatsappHref } from '@/lib/contact';
import { getVehicle, splitName, vehicleName } from '@/lib/fleet';
import { SERVICE_PAGES } from '@/lib/servicePages';
import ServiceIndexList from '@/components/ui/ServiceIndexList';

export default function VehicleDetailView({ id }: { id: string }) {
  const { t } = useLanguage();
  const vehicle = getVehicle(id)!;
  const copy = t.vehicles[id];
  const name = vehicleName(vehicle, t);
  const [head, accent] = splitName(name);
  const d = t.vehicleDetail;
  const f = t.fleetPage;
  const fc = t.fleetCard;
  usePageTitle(`${name} · ${SITE.name}`, copy?.description);

  const book = bookingHref({ car: id });
  const related = services.filter((s) => SERVICE_PAGES.some((p) => p.id === s.id && p.vehicles.includes(id)));
  const others = vehicles.filter((v) => v.id !== id);
  const rate = vehicle.priceOnRequest ? (
    fc.onRequest
  ) : (
    <>
      €{vehicle.pricePerHour}
      <span className="font-sans text-[0.5em] opacity-70">{fc.perHour}</span>
    </>
  );

  const quick = [
    { label: f.colSeats, value: vehicle.passengers },
    { label: f.colBags, value: vehicle.bags },
    { label: f.colRate, value: rate },
  ];

  const specs = [
    { icon: Users, label: f.colSeats, value: fc.seats.replace('{n}', String(vehicle.passengers)) },
    { icon: Briefcase, label: f.colBags, value: fc.luggage.replace('{n}', String(vehicle.bags)) },
    {
      icon: BadgeEuro,
      label: f.colRate,
      value: vehicle.priceOnRequest ? fc.onRequest : `€${vehicle.pricePerHour}${fc.perHour}`,
    },
    { icon: UserRound, label: d.chauffeur, value: d.chauffeurValue },
    { icon: Baby, label: d.childSeats, value: d.onRequest },
    { icon: Clock, label: d.availability, value: '24/7' },
  ];

  return (
    <>
      <section className="ink-panel on-ink relative isolate overflow-clip">
        <div className="container-x pb-14 pt-7 md:pb-20 md:pt-11">
          <div className="intro">
            <Breadcrumbs
              items={[
                { label: t.nav.home, href: '/' },
                { label: t.nav.fleet, href: '/fleet' },
                { label: name },
              ]}
            />
          </div>
          <div className="mt-8 grid grid-cols-1 items-center gap-9 md:mt-12 lg:grid-cols-12 lg:gap-14">
            <div className="intro min-w-0 lg:order-2 lg:col-span-7" style={{ ['--d' as string]: 60 }}>
              <div className="relative isolate aspect-[16/11] overflow-clip rounded-[1.75rem] bg-[radial-gradient(120%_95%_at_50%_30%,#ffffff_0%,#f1f1f3_55%,#dcdce1_100%)]">
                <Image
                  src={vehicle.image}
                  alt={name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  className="object-contain p-6 mix-blend-multiply sm:p-10"
                />
                {copy?.badge && (
                  <span className="absolute left-5 top-5 rounded-full bg-ink px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                    {copy.badge}
                  </span>
                )}
              </div>
            </div>

            <div className="min-w-0 lg:order-1 lg:col-span-5">
              <p className="intro eyebrow eyebrow-light" style={{ ['--d' as string]: 40 }}>
                {fc.categories[vehicle.category]}
              </p>
              <h1 className="intro mt-5 text-5xl text-white" style={{ ['--d' as string]: 100 }}>
                {head}
                {accent && (
                  <>
                    {' '}
                    <span className="title-accent title-accent-light">{accent}</span>
                  </>
                )}
              </h1>
              <p
                className="intro mt-6 text-[1.0625rem] leading-relaxed text-white/70 md:text-lg"
                style={{ ['--d' as string]: 160 }}
              >
                {copy?.long}
              </p>
              {copy?.ideal && (
                <ul className="intro mt-6 flex flex-wrap gap-2" style={{ ['--d' as string]: 200 }}>
                  {copy.ideal.map((tag) => (
                    <li key={tag} className="rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/80">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
              <dl
                className="intro mt-8 grid grid-cols-3 divide-x divide-white/10 overflow-clip rounded-2xl border border-white/10"
                style={{ ['--d' as string]: 240 }}
              >
                {quick.map((q) => (
                  <div key={q.label} className="flex min-w-0 flex-col gap-1.5 px-4 py-4 sm:px-5">
                    <dt className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
                      {q.label}
                    </dt>
                    <dd className="font-display text-[1.7rem] leading-none text-white tabular">{q.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="intro mt-8 flex flex-wrap gap-3" style={{ ['--d' as string]: 280 }}>
                <Link href={book} className="btn btn-gold">
                  {d.book}
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
            </div>
          </div>
        </div>
      </section>

      {/* Specs + booking card */}
      <section className="section-y bg-white">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="min-w-0 lg:col-span-7 xl:col-span-8">
            <SectionHeading className="reveal" eyebrow={name} title={d.specsTitle} accent={d.specsAccent} />
            <dl className="reveal mt-10 grid grid-cols-1 gap-x-10 border-t-2 border-ink sm:grid-cols-2">
              {specs.map((s) => (
                <div key={s.label} className="flex items-baseline justify-between gap-6 border-b border-line-strong py-4">
                  <dt className="text-[15px] text-muted">{s.label}</dt>
                  <dd className="text-right text-[1.0625rem] font-semibold text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
            <Link href="/fleet#compare" className="link-arrow mt-8 text-sm">
              {d.compareLink}
              <ArrowRight size={15} aria-hidden />
            </Link>
          </div>

          <aside className="min-w-0 self-start lg:sticky lg:top-24 lg:col-span-5 xl:col-span-4">
            <div className="rounded-3xl bg-ink p-7 text-white">
              <LiveStatus className="text-sm text-white/70" />
              <h2 className="mt-4 text-[1.75rem] leading-tight">{t.serviceDetail.asideTitle}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-white/65">{t.serviceDetail.asideText}</p>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">{f.colRate}</p>
                <p className="mt-2 font-display text-[2.1rem] leading-none text-white tabular">{rate}</p>
              </div>
              <Link href={book} className="btn btn-gold btn-block mt-6">
                {d.book}
                <ArrowRight size={16} aria-hidden />
              </Link>
              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <a href={telHref(1)} className="btn btn-outline-light btn-sm" aria-label={`${t.actions.call} ${phoneLabel(1)}`}>
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

      {related.length > 0 && (
        <section className="section-y bg-ivory">
          <div className="container-x">
            <SectionHeading
              className="reveal"
              eyebrow={t.nav.services}
              title={d.servicesTitle}
              accent={d.servicesAccent}
              action={
                <Link href="/services" className="link-arrow text-sm">
                  {t.nav.allServices}
                  <ArrowRight size={15} aria-hidden />
                </Link>
              }
            />
            <div className="reveal mt-12">
              <ServiceIndexList only={related.map((s) => s.id)} />
            </div>
          </div>
        </section>
      )}

      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading
            className="reveal"
            eyebrow={t.nav.fleet}
            title={d.otherTitle}
            accent={d.otherAccent}
            action={
              <Link href="/fleet" className="link-arrow text-sm">
                {t.fleetPreview.cta}
                <ArrowRight size={15} aria-hidden />
              </Link>
            }
          />
          <div className="reveal mt-12">
            <Rail label={`${d.otherTitle} ${d.otherAccent}`}>
              {others.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </Rail>
          </div>
        </div>
      </section>

      <CtaBand href={book} />
    </>
  );
}
