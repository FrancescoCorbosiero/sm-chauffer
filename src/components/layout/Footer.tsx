'use client';
import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { Locale } from '@/i18n/types';
import { LOCALE_NAMES } from '@/i18n/types';
import { SITE } from '@/lib/site';
import { locations } from '@/lib/locations';
import { intlLandingsFor } from '@/lib/intlLandings';
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

// Heading for the city/area landing-page links (one per locale).
const ZONES_LABEL: Record<Locale, string> = {
  it: 'Zone servite',
  en: 'Areas served',
  es: 'Zonas de servicio',
  de: 'Einsatzgebiete',
  fr: 'Zones desservies',
  sq: 'Zonat e shërbimit',
  ru: 'Зоны обслуживания',
};

// Heading for the international (EN/DE) landing-page links (one per locale).
const INTL_LABEL: Record<Locale, string> = {
  it: 'Per ospiti internazionali',
  en: 'For international guests',
  es: 'Para huéspedes internacionales',
  de: 'Für internationale Gäste',
  fr: 'Pour la clientèle internationale',
  sq: 'Për mysafirët ndërkombëtarë',
  ru: 'Для международных гостей',
};

export default function Footer() {
  const { t, locale } = useLanguage();
  const legal = LEGAL[locale] ?? LEGAL.it;
  const zonesLabel = ZONES_LABEL[locale] ?? ZONES_LABEL.it;
  const intlLabel = INTL_LABEL[locale] ?? INTL_LABEL.it;

  // English & German SEO landing pages, grouped by language for internal links.
  const intlGroups = (['en', 'de'] as const).map((lang) => ({
    lang,
    name: LOCALE_NAMES[lang],
    pages: intlLandingsFor(lang),
  }));

  const zoneLinks = locations.map((l) => ({
    href: `/ncc/${l.slug}`,
    label: `NCC ${l.city}`,
  }));

  const navLinks = [
    { href: '/fleet', label: t.nav.fleet },
    { href: '/services', label: t.nav.services },
    { href: '/about', label: t.nav.about },
    { href: '/blog', label: t.nav.blog },
    { href: '/contact', label: t.nav.contact },
  ];

  const serviceLinks = [
    { href: '/services#airport-transfer', label: t.footer.serviceLinks.airport },
    { href: '/services#autista-milano', label: t.footer.serviceLinks.milan },
    { href: '/services#autista-brianza', label: t.footer.serviceLinks.brianza },
    { href: '/services#tour-privati', label: t.footer.serviceLinks.tours },
  ];

  return (
    <footer className="bg-[linear-gradient(180deg,#060606_0%,#0d0d0d_100%)] text-white border-t border-white/8">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="text-2xl sm:text-[1.9rem] font-medium tracking-[0.08em] mb-5">
              CHAUFFEUR SK LUXURY MILANO
            </div>
            <p className="text-sm sm:text-[0.98rem] text-white/72 leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>
            <a
              href={SITE.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram @${SITE.instagram.handle}`}
              className="mt-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Instagram size={16} aria-hidden />
              <span>@{SITE.instagram.handle}</span>
            </a>
          </div>

          <nav aria-label={t.footer.pagesAria} className="lg:col-span-2 text-sm">
            <h4 className="inline-flex items-center gap-3 text-[11px] sm:text-[12px] uppercase tracking-[0.44em] text-white/88 mb-6">
              <span className="h-px w-6 bg-white/30" />
              {t.footer.explore}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[0.98rem] sm:text-[1.02rem] text-white/78 hover:text-white transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footer.servicesAria} className="lg:col-span-2 text-sm">
            <h4 className="inline-flex items-center gap-3 text-[11px] sm:text-[12px] uppercase tracking-[0.44em] text-white/88 mb-6">
              <span className="h-px w-6 bg-white/30" />
              {t.footer.services}
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[0.98rem] sm:text-[1.02rem] text-white/78 hover:text-white transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={zonesLabel} className="lg:col-span-2 text-sm">
            <h4 className="inline-flex items-center gap-3 text-[11px] sm:text-[12px] uppercase tracking-[0.44em] text-white/88 mb-6">
              <span className="h-px w-6 bg-white/30" />
              {zonesLabel}
            </h4>
            <ul className="space-y-3">
              {zoneLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[0.98rem] sm:text-[1.02rem] text-white/78 hover:text-white transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3 text-sm">
            <h4 className="inline-flex items-center gap-3 text-[11px] sm:text-[12px] uppercase tracking-[0.44em] text-white/88 mb-6">
              <span className="h-px w-6 bg-white/30" />
              {t.footer.contacts}
            </h4>
            <ul className="space-y-4 text-white/78">
              <li className="flex items-start gap-3.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-white/55" />
                <span>
                  {t.footer.addressLine1}
                  <br />
                  {t.footer.addressLine2}
                </span>
              </li>
              <li className="flex items-start gap-3.5">
                <Phone size={16} className="mt-0.5 shrink-0 text-white/55" />
                <span className="flex flex-col gap-1.5">
                  <a
                    href={`tel:${SITE.phone}`}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {SITE.phoneDisplay}
                  </a>
                  <a
                    href={`tel:${SITE.phone2}`}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {SITE.phoneDisplay2}
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3.5">
                <Mail size={16} className="mt-0.5 shrink-0 text-white/55" />
                <span className="flex flex-col gap-1.5">
                  <a
                    href={`mailto:${SITE.email}`}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {SITE.email}
                  </a>
                  <a
                    href={`mailto:${SITE.emailBackend}`}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {SITE.emailBackend}
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-10">
          <h4 className="inline-flex items-center gap-3 text-[11px] sm:text-[12px] uppercase tracking-[0.44em] text-white/88 mb-7">
            <span className="h-px w-6 bg-white/30" />
            {intlLabel}
          </h4>
          <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
            {intlGroups.map((group) => (
              <nav key={group.lang} aria-label={group.name} className="text-sm">
                <span className="block text-[11px] uppercase tracking-[0.28em] text-white/55 mb-4">
                  {group.name}
                </span>
                <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
                  {group.pages.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/${p.lang}/${p.slug}`}
                        hrefLang={p.lang}
                        className="text-white/78 hover:text-white transition-colors duration-200"
                      >
                        {p.navLabel}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-white/3">
        <div className="container-x py-6 flex flex-col gap-4 text-[11px] sm:text-xs text-white/55 lg:flex-row lg:items-center lg:justify-between">
          <div>© {new Date().getFullYear()} Chauffeur SK Luxury Milano · {t.footer.rightsReserved}</div>

          <nav aria-label={legal.privacy} className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">{legal.privacy}</Link>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">{legal.cookie}</Link>
            <Link href="/termini" className="hover:text-white transition-colors">{legal.terms}</Link>
            <button type="button" onClick={reopenConsent} className="hover:text-white transition-colors">
              {legal.prefs}
            </button>
          </nav>

          <div>P.IVA {SITE.vatNumber} · {SITE.legalAddress.street}, {SITE.legalAddress.postalCode} {SITE.legalAddress.locality} ({SITE.legalAddress.province})</div>
        </div>
      </div>

      {/* Bot trap: hidden, nofollow, disallowed in robots.txt. Humans and good
          crawlers never follow it; bots that scrape every href get banned. */}
      <a
        href="/api/blackhole"
        rel="nofollow"
        aria-hidden="true"
        tabIndex={-1}
        style={{ display: 'none' }}
      >
        Do not follow this link
      </a>
    </footer>
  );
}
