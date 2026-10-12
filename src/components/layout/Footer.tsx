'use client';
import Link from 'next/link';
import { ArrowUpRight, Instagram, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { Locale } from '@/i18n/types';
import { LOCALE_NAMES } from '@/i18n/types';
import Logo from './Logo';
import LiveStatus from '@/components/ui/LiveStatus';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { SITE } from '@/lib/site';
import { services, vehicles } from '@/lib/data';
import { vehicleName } from '@/lib/fleet';
import { locations } from '@/lib/locations';
import { intlLandingsFor } from '@/lib/intlLandings';
import { mailHref, phoneLabel, telHref, whatsappHref } from '@/lib/contact';
import { reopenConsent } from '@/components/analytics/ConsentBanner';

// Legal/footer labels kept local (short strings, 7 langs) to avoid bloating the
// shared dictionaries. Falls back to Italian for any unmapped locale.
const LEGAL: Record<Locale, { privacy: string; cookie: string; terms: string; prefs: string }> = {
  it: { privacy: 'Privacy Policy', cookie: 'Cookie Policy', terms: 'Termini e Condizioni', prefs: 'Preferenze cookie' },
  en: { privacy: 'Privacy Policy', cookie: 'Cookie Policy', terms: 'Terms & Conditions', prefs: 'Cookie preferences' },
  es: { privacy: 'Política de Privacidad', cookie: 'Política de Cookies', terms: 'Términos y Condiciones', prefs: 'Preferencias de cookies' },
  de: { privacy: 'Datenschutz', cookie: 'Cookie-Richtlinie', terms: 'AGB', prefs: 'Cookie-Einstellungen' },
  fr: { privacy: 'Confidentialité', cookie: 'Politique de cookies', terms: 'Conditions générales', prefs: 'Préférences cookies' },
  sq: { privacy: 'Privatësia', cookie: 'Politika e Cookie-ve', terms: 'Kushtet', prefs: 'Preferencat e cookie-ve' },
  ru: { privacy: 'Политика конфиденциальности', cookie: 'Политика cookie', terms: 'Условия', prefs: 'Настройки cookie' },
};

interface FootLink {
  href: string;
  label: string;
  hrefLang?: string;
}

function LinkColumn({
  title,
  links,
  groups,
  className = '',
}: {
  title: string;
  links?: FootLink[];
  groups?: Array<{ title: string; links: FootLink[] }>;
  className?: string;
}) {
  const linkClass = 'text-[15px] text-white/70 transition-colors duration-200 hover:text-white';
  const list = (items: FootLink[]) => (
    <ul className="space-y-3">
      {items.map((l) => (
        <li key={l.href + l.label}>
          <Link href={l.href} hrefLang={l.hrefLang} className={linkClass}>
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
  return (
    <nav aria-label={title} className={className}>
      <h2 className="mb-5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{title}</h2>
      {links && list(links)}
      {groups && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-1">
          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
                {g.title}
              </h3>
              {list(g.links)}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}

export default function Footer() {
  const { t, locale } = useLanguage();
  const legal = LEGAL[locale] ?? LEGAL.it;
  const f = t.footer;

  const intl = (lang: 'en' | 'de'): FootLink[] =>
    intlLandingsFor(lang).map((p) => ({ href: `/${p.lang}/${p.slug}`, label: p.navLabel, hrefLang: p.lang }));

  const card =
    'group flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-colors duration-300 hover:border-gold/40';

  return (
    <footer className="bg-ink pb-[calc(4.5rem+env(safe-area-inset-bottom))] text-white lg:pb-0">
      <div className="container-x pt-16 md:pt-20">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Logo label={t.nav.homeAria} tagline={t.nav.logoTagline} size="lg" />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/60">{f.tagline}</p>
            <LiveStatus className="mt-6 text-sm text-white/75" />
            <div className="mt-6 flex items-center gap-2.5">
              <a
                href={SITE.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram @${SITE.instagram.handle}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-gold hover:text-gold"
              >
                <Instagram size={17} aria-hidden />
              </a>
              <a
                href={whatsappHref(t.actions.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.whatsapp.aria}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-gold hover:text-gold"
              >
                <WhatsAppIcon size={17} />
              </a>
              <span className="ml-1 text-sm text-white/50">@{SITE.instagram.handle}</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:col-span-8">
            <div className={card}>
              <Phone size={18} aria-hidden className="mb-2 text-gold" />
              <span className="text-[13px] text-white/50">{f.phone24}</span>
              <a href={telHref(1)} className="text-[15px] font-semibold tabular hover:text-gold-light">
                {phoneLabel(1)}
              </a>
              <a href={telHref(2)} className="text-[15px] font-semibold tabular hover:text-gold-light">
                {phoneLabel(2)}
              </a>
            </div>
            <a
              href={whatsappHref(t.actions.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={card}
            >
              <WhatsAppIcon size={18} className="mb-2 text-gold" />
              <span className="text-[13px] text-white/50">{t.status.reply}</span>
              <span className="text-[15px] font-semibold">WhatsApp</span>
              <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm text-gold-light">
                {t.actions.chatNow}
                <ArrowUpRight
                  size={14}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </a>
            <div className={card}>
              <Mail size={18} aria-hidden className="mb-2 text-gold" />
              <span className="text-[13px] text-white/50">Email</span>
              <a href={mailHref()} className="text-[15px] font-semibold [overflow-wrap:anywhere] hover:text-gold-light">
                {SITE.email.split('@')[0]}@<wbr />
                {SITE.email.split('@')[1]}
              </a>
              <a
                href={mailHref(SITE.emailBackend)}
                className="text-[14px] text-white/70 [overflow-wrap:anywhere] hover:text-gold-light"
              >
                {SITE.emailBackend}
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 border-b border-white/10 py-14 md:grid-cols-3 xl:grid-cols-5">
          <LinkColumn
            title={f.services}
            links={services.map((s) => ({ href: `/services/${s.id}`, label: t.services[s.id]?.title ?? s.id }))}
          />
          <LinkColumn
            title={f.fleet}
            links={[
              ...vehicles.map((v) => ({ href: `/fleet/${v.id}`, label: vehicleName(v, t) })),
              { href: '/fleet#compare', label: f.compare },
            ]}
          />
          <LinkColumn
            title={f.areas}
            links={[
              ...locations.map((l) => ({ href: `/ncc/${l.slug}`, label: `NCC ${l.city}` })),
              { href: '/areas', label: t.nav.areasMap },
            ]}
          />
          <LinkColumn
            title={f.company}
            links={[
              { href: '/about', label: t.nav.about },
              { href: '/pricing', label: t.nav.pricing },
              { href: '/contact', label: t.nav.contact },
              { href: '/blog', label: t.nav.blog },
            ]}
          />
          <LinkColumn
            title={f.intl}
            className="col-span-2 md:col-span-1"
            groups={[
              { title: LOCALE_NAMES.en, links: intl('en') },
              { title: LOCALE_NAMES.de, links: intl('de') },
            ]}
          />
        </div>

        <div className="flex flex-col gap-5 py-8 text-[13px] text-white/50 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name} · {f.rightsReserved}
          </p>
          <nav aria-label={legal.privacy} className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              {legal.privacy}
            </Link>
            <Link href="/cookie-policy" className="transition-colors hover:text-white">
              {legal.cookie}
            </Link>
            <Link href="/termini" className="transition-colors hover:text-white">
              {legal.terms}
            </Link>
            <button type="button" onClick={reopenConsent} className="transition-colors hover:text-white">
              {legal.prefs}
            </button>
          </nav>
        </div>
        <p className="border-t border-white/10 py-6 text-[12px] leading-relaxed text-white/55">
          {SITE.legalName} · {f.vatLabel} {SITE.vatNumber} · {f.registeredOffice}: {SITE.legalAddress.street},{' '}
          {SITE.legalAddress.postalCode} {SITE.legalAddress.locality} ({SITE.legalAddress.province}) · {f.sdiLabel}{' '}
          {SITE.sdiCode}
        </p>
      </div>

      {/* Bot trap: hidden, nofollow, disallowed in robots.txt. Humans and good
          crawlers never follow it; bots that scrape every href get banned. */}
      <a href="/api/blackhole" rel="nofollow" aria-hidden="true" tabIndex={-1} style={{ display: 'none' }}>
        Do not follow this link
      </a>
    </footer>
  );
}
