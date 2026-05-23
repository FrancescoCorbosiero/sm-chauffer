'use client';
import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import { SITE } from '@/lib/site';

export default function Footer() {
  const t = useTranslation();

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
    { href: '/services#autista-roma', label: t.footer.serviceLinks.rome },
    { href: '/services#tour-privati', label: t.footer.serviceLinks.tours },
  ];

  return (
    <footer className="bg-[linear-gradient(180deg,#060606_0%,#0d0d0d_100%)] text-white border-t border-white/8">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="text-2xl sm:text-[1.9rem] font-medium tracking-[0.08em] mb-5">
              SM LUXURY CHAUFFER
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

          <nav aria-label={t.footer.servicesAria} className="lg:col-span-3 text-sm">
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
              <li className="flex items-center gap-3.5">
                <Phone size={16} className="shrink-0 text-white/55" />
                <a
                  href={`tel:${SITE.phone}`}
                  className="hover:text-white transition-colors duration-200"
                >
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3.5">
                <Mail size={16} className="shrink-0 text-white/55" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="hover:text-white transition-colors duration-200"
                >
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-white/3">
        <div className="container-x py-6 flex flex-wrap items-center justify-between gap-3 text-[11px] sm:text-xs text-white/55">
          <div>© {new Date().getFullYear()} SM Luxury Chauffer · {t.footer.rightsReserved}</div>
          <div>{t.footer.vat}</div>
        </div>
      </div>
    </footer>
  );
}
