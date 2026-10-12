'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ArrowUpRight, ChevronDown, Mail, Map as MapIcon, Menu, Phone, Plane } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import LiveStatus from '@/components/ui/LiveStatus';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { SERVICE_ICONS } from '@/components/ui/serviceIcons';
import { services } from '@/lib/data';
import { locations } from '@/lib/locations';
import { FIXED_FARES } from '@/lib/pricing';
import { SITE } from '@/lib/site';
import { mailHref, phoneLabel, telHref, whatsappHref } from '@/lib/contact';

type PanelKey = 'services' | 'areas';

const AIRPORTS = [
  { code: 'MXP', name: 'Malpensa' },
  { code: 'LIN', name: 'Linate' },
  { code: 'BGY', name: 'Orio al Serio' },
];

/** Which top-level section a pathname belongs to (for the active state). */
function sectionOf(pathname: string): string {
  if (pathname.startsWith('/services')) return 'services';
  if (pathname.startsWith('/fleet')) return 'fleet';
  if (pathname.startsWith('/areas') || pathname.startsWith('/ncc')) return 'areas';
  if (pathname.startsWith('/pricing')) return 'pricing';
  if (pathname.startsWith('/about')) return 'about';
  if (pathname.startsWith('/blog')) return 'blog';
  if (pathname.startsWith('/contact')) return 'contact';
  return 'home';
}

/** Thin utility bar above the header (desktop only): live status + direct lines. */
function TopBar() {
  const { t } = useLanguage();
  return (
    <div className="hidden bg-black text-[13px] text-white/70 lg:block">
      <div className="container-x flex h-10 items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-3">
          <LiveStatus className="text-white/85" />
          <span aria-hidden className="hidden h-3 w-px bg-white/15 xl:block" />
          <span className="hidden truncate xl:block">{t.status.always}</span>
        </div>
        <div className="flex items-center gap-5">
          <a href={telHref(1)} className="inline-flex items-center gap-1.5 tabular transition-colors hover:text-white">
            <Phone size={13} aria-hidden className="text-gold" />
            {phoneLabel(1)}
          </a>
          <a href={telHref(2)} className="inline-flex items-center gap-1.5 tabular transition-colors hover:text-white">
            <Phone size={13} aria-hidden className="text-gold" />
            {phoneLabel(2)}
          </a>
          <a
            href={mailHref()}
            className="hidden items-center gap-1.5 transition-colors hover:text-white xl:inline-flex"
          >
            <Mail size={13} aria-hidden className="text-gold" />
            {SITE.email}
          </a>
          <a
            href={whatsappHref(t.actions.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 transition-colors hover:text-white xl:inline-flex"
          >
            <WhatsAppIcon size={13} className="text-gold" />
            WhatsApp
          </a>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}

export default function SiteHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const section = sectionOf(pathname);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  // Panel / menu state is tied to the path it was opened on, so navigating
  // anywhere closes them without an effect.
  const [panelFor, setPanelFor] = useState<{ key: PanelKey; path: string } | null>(null);
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const panel = panelFor && panelFor.path === pathname ? panelFor.key : null;
  const menuOpen = menuPath === pathname;
  const closeMenu = useCallback(() => setMenuPath(null), []);

  // Solid on scroll; steps aside while reading down, returns on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 48);
      const delta = y - lastY;
      if (Math.abs(delta) > 8) {
        setHidden(delta > 0 && y > 320);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    frame = window.requestAnimationFrame(update);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPanelFor(null);
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setPanelFor(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [panel]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const openPanel = (key: PanelKey) => {
    window.clearTimeout(closeTimer.current);
    setPanelFor({ key, path: pathname });
  };
  const togglePanel = (key: PanelKey) => {
    window.clearTimeout(closeTimer.current);
    setPanelFor(panel === key ? null : { key, path: pathname });
  };
  const closePanel = () => setPanelFor(null);
  // Hover intent for mouse users only (touch taps use the chevron button).
  const onEnter = (key: PanelKey) => (e: ReactPointerEvent) => {
    if (e.pointerType === 'mouse') openPanel(key);
  };
  const onStay = (e: ReactPointerEvent) => {
    if (e.pointerType === 'mouse') window.clearTimeout(closeTimer.current);
  };
  const onLeave = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setPanelFor(null), 180);
  };

  const isHidden = hidden && !panel && !menuOpen;

  const navItem = (key: string) =>
    `relative inline-flex h-10 items-center rounded-full px-3 text-[15px] font-medium transition-colors ${
      section === key ? 'text-white' : 'text-white/70 hover:text-white'
    }`;
  const activeDot = (key: string) =>
    section === key ? (
      <span aria-hidden className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />
    ) : null;

  const links: Array<{ key: string; href: string; label: string; panel?: PanelKey }> = [
    { key: 'services', href: '/services', label: t.nav.services, panel: 'services' },
    { key: 'fleet', href: '/fleet', label: t.nav.fleet },
    { key: 'areas', href: '/areas', label: t.nav.areas, panel: 'areas' },
    { key: 'pricing', href: '/pricing', label: t.nav.pricing },
    { key: 'about', href: '/about', label: t.nav.about },
    { key: 'blog', href: '/blog', label: t.nav.blog },
  ];

  return (
    <>
      <TopBar />
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 transition-transform duration-500 ease-expo has-[:focus-visible]:translate-y-0 ${
          isHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div
          className={`border-b transition-[background-color,border-color,box-shadow] duration-300 ${
            scrolled || panel
              ? 'border-white/10 bg-ink/92 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl'
              : 'border-transparent bg-ink'
          }`}
        >
          <div className="container-x relative flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
            <Logo label={t.nav.homeAria} tagline={t.nav.logoTagline} />

            <nav aria-label={t.nav.mainNavLabel} className="hidden items-center gap-0.5 lg:flex">
              {links.map((l) =>
                l.panel ? (
                  <div
                    key={l.key}
                    className="flex items-center"
                    onPointerEnter={onEnter(l.panel)}
                    onPointerLeave={onLeave}
                  >
                    <Link
                      href={l.href}
                      className={`${navItem(l.key)} pr-1`}
                      aria-current={section === l.key ? 'page' : undefined}
                    >
                      {l.label}
                      {activeDot(l.key)}
                    </Link>
                    <button
                      type="button"
                      onClick={() => togglePanel(l.panel!)}
                      aria-expanded={panel === l.panel}
                      aria-controls={`panel-${l.panel}`}
                      aria-label={`${l.label} — ${t.nav.showMenu}`}
                      className="flex h-8 w-7 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white"
                    >
                      <ChevronDown
                        size={15}
                        aria-hidden
                        className={`transition-transform duration-300 ${panel === l.panel ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                ) : (
                  <Link
                    key={l.key}
                    href={l.href}
                    className={navItem(l.key)}
                    aria-current={section === l.key ? 'page' : undefined}
                  >
                    {l.label}
                    {activeDot(l.key)}
                  </Link>
                ),
              )}
            </nav>

            <div className="flex items-center gap-2 lg:gap-3">
              <a
                href={telHref(1)}
                className="hidden items-center gap-2 rounded-full px-2 text-[14px] font-medium text-white/80 tabular transition-colors hover:text-white xl:inline-flex"
              >
                <Phone size={15} aria-hidden className="text-gold" />
                {phoneLabel(1)}
              </a>
              <Link href="/contact#prenota" className="btn btn-gold btn-sm hidden lg:inline-flex">
                {t.nav.bookNow}
              </Link>
              <div className="lg:hidden">
                <LanguageSwitcher />
              </div>
              <button
                type="button"
                onClick={() => setMenuPath(pathname)}
                aria-label={t.nav.openMenu}
                aria-expanded={menuOpen}
                aria-haspopup="dialog"
                className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
              >
                <Menu size={24} aria-hidden />
              </button>
            </div>

            {/* ---------- Desktop mega panels ---------- */}
            {panel === 'services' && (
              <div
                id="panel-services"
                className="absolute inset-x-0 top-full hidden pt-2 lg:block"
                onPointerEnter={onStay}
                onPointerLeave={onLeave}
              >
                <div className="container-x">
                  <div className="grid grid-cols-[1fr_19rem] gap-3 rounded-2xl border border-line bg-white p-3 text-ink shadow-xl intro">
                    <div className="flex flex-col">
                      <ul className="grid grid-cols-2 gap-1">
                        {services.map((s) => {
                          const Icon = SERVICE_ICONS[s.icon];
                          const copy = t.services[s.id];
                          return (
                            <li key={s.id}>
                              <Link
                                href={`/services/${s.id}`}
                                onClick={closePanel}
                                className="group flex items-start gap-3.5 rounded-xl p-3.5 transition-colors hover:bg-ivory"
                              >
                                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ivory text-gold-deep transition-colors group-hover:bg-ink group-hover:text-gold">
                                  {Icon && <Icon size={18} aria-hidden />}
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-[15px] font-semibold">{copy?.title}</span>
                                  <span className="mt-0.5 block text-sm leading-snug text-muted">
                                    {copy?.description}
                                  </span>
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="mt-auto flex items-center justify-between border-t border-line px-3.5 pt-3 pb-1">
                        <span className="text-sm text-muted">{t.nav.servicesLead}</span>
                        <Link href="/services" onClick={closePanel} className="link-arrow text-sm">
                          {t.nav.allServices} <ArrowRight size={15} aria-hidden />
                        </Link>
                      </div>
                    </div>
                    <div className="ink-panel flex flex-col overflow-clip rounded-xl p-6">
                      <span className="eyebrow eyebrow-light">{t.nav.featuredLabel}</span>
                      <p className="mt-4 font-display text-[1.75rem] leading-tight">Milano ⇄ Malpensa</p>
                      <p className="mt-1 flex items-baseline gap-1.5">
                        <span className="font-display text-5xl text-gold tabular">€{FIXED_FARES.milanoMalpensa}</span>
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-white/70">{t.nav.featuredText}</p>
                      <Link
                        href="/contact?type=airport-transfer&to=Malpensa#prenota"
                        onClick={closePanel}
                        className="btn btn-gold btn-sm mt-auto self-start"
                      >
                        {t.actions.quote} <ArrowRight size={15} aria-hidden />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {panel === 'areas' && (
              <div
                id="panel-areas"
                className="absolute inset-x-0 top-full hidden pt-2 lg:block"
                onPointerEnter={onStay}
                onPointerLeave={onLeave}
              >
                <div className="container-x">
                  <div className="grid grid-cols-[1fr_19rem] gap-3 rounded-2xl border border-line bg-white p-3 text-ink shadow-xl intro">
                    <div className="grid grid-cols-2 gap-6 p-3.5">
                      <div>
                        <p className="eyebrow mb-3">{t.nav.citiesTitle}</p>
                        <ul className="flex flex-col">
                          {locations.map((l) => (
                            <li key={l.slug}>
                              <Link
                                href={`/ncc/${l.slug}`}
                                onClick={closePanel}
                                className="group flex items-center justify-between rounded-lg px-2 py-2.5 text-[15px] font-medium transition-colors hover:bg-ivory"
                              >
                                NCC {l.city}
                                <ArrowUpRight
                                  size={15}
                                  aria-hidden
                                  className="text-gold-deep opacity-0 transition-opacity group-hover:opacity-100"
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="eyebrow mb-3">{t.nav.airportsTitle}</p>
                        <ul className="flex flex-col">
                          {AIRPORTS.map((a) => (
                            <li key={a.code}>
                              <Link
                                href="/services/airport-transfer"
                                onClick={closePanel}
                                className="group flex items-center gap-3 rounded-lg px-2 py-2.5 text-[15px] font-medium transition-colors hover:bg-ivory"
                              >
                                <Plane size={15} aria-hidden className="text-gold-deep" />
                                {a.name}
                                <span className="ml-auto text-xs font-semibold tracking-[0.12em] text-faint">
                                  {a.code}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Link
                      href="/areas"
                      onClick={closePanel}
                      className="ink-panel group flex flex-col overflow-clip rounded-xl p-6"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-gold">
                        <MapIcon size={19} aria-hidden />
                      </span>
                      <span className="mt-5 font-display text-[1.6rem] leading-tight">{t.nav.areasMap}</span>
                      <span className="mt-2 text-sm leading-relaxed text-white/70">{t.nav.areasLead}</span>
                      <span className="link-arrow link-arrow-light mt-auto self-start pt-5 text-sm">
                        {t.common.explore} <ArrowRight size={15} aria-hidden />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
