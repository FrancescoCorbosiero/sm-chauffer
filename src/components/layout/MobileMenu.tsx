'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Mail, Minus, Phone, Plus, X } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import Logo from './Logo';
import LiveStatus from '@/components/ui/LiveStatus';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { services } from '@/lib/data';
import { locations } from '@/lib/locations';
import { mailHref, phoneLabel, telHref, whatsappHref } from '@/lib/contact';

type Group = 'services' | 'areas' | null;

/**
 * Full-screen mobile navigation. Kept mounted so it can slide in and out;
 * `inert` removes it from the tab order and the accessibility tree while
 * closed. Focus moves in on open, is trapped while open, and returns to the
 * opener on close. Page scroll is locked behind it.
 */
export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState<Group>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      root.style.overflow = prevOverflow;
      if (opener?.isConnected) opener.focus();
    };
  }, [open, onClose]);

  const toggle = (g: Exclude<Group, null>) => setExpanded((cur) => (cur === g ? null : g));

  const rowLink =
    'flex min-h-14 flex-1 items-center font-display text-[1.75rem] leading-none text-white transition-colors';
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const simple = [
    { href: '/', label: t.nav.home },
    { href: '/fleet', label: t.nav.fleet },
    { href: '/pricing', label: t.nav.pricing },
    { href: '/about', label: t.nav.about },
    { href: '/blog', label: t.nav.blog },
    { href: '/contact', label: t.nav.contact },
  ];

  const renderSimple = (l: { href: string; label: string }) => (
    <li key={l.href} className="border-b border-white/10">
      <Link
        href={l.href}
        onClick={onClose}
        aria-current={isActive(l.href) ? 'page' : undefined}
        className={`${rowLink} ${isActive(l.href) ? 'text-gold-light' : 'hover:text-gold-light'}`}
      >
        {l.label}
      </Link>
    </li>
  );

  const renderGroup = (
    g: Exclude<Group, null>,
    href: string,
    label: string,
    items: Array<{ href: string; label: string }>,
  ) => {
    const isOpen = expanded === g;
    return (
      <li key={g} className="border-b border-white/10">
        <div className="flex items-center">
          <Link
            href={href}
            onClick={onClose}
            aria-current={isActive(href) ? 'page' : undefined}
            className={`${rowLink} ${isActive(href) ? 'text-gold-light' : 'hover:text-gold-light'}`}
          >
            {label}
          </Link>
          <button
            type="button"
            onClick={() => toggle(g)}
            aria-expanded={isOpen}
            aria-controls={`mm-${g}`}
            aria-label={`${label} — ${t.nav.showMenu}`}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80"
          >
            {isOpen ? <Minus size={18} aria-hidden /> : <Plus size={18} aria-hidden />}
          </button>
        </div>
        <div
          id={`mm-${g}`}
          className={`grid transition-[grid-template-rows] duration-300 ease-smooth ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <ul className="min-h-0 overflow-hidden" inert={!isOpen}>
            {items.map((it) => (
              <li key={it.href + it.label}>
                <Link
                  href={it.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-2.5 pl-1 text-[15px] text-white/75 transition-colors hover:text-white"
                >
                  {it.label}
                  <ArrowRight size={15} aria-hidden className="text-gold/70" />
                </Link>
              </li>
            ))}
            <li aria-hidden className="h-3" />
          </ul>
        </div>
      </li>
    );
  };

  const serviceItems = [
    ...services.map((s) => ({ href: `/services/${s.id}`, label: t.services[s.id]?.title ?? s.id })),
    { href: '/services', label: t.nav.allServices },
  ];
  const areaItems = [
    ...locations.map((l) => ({ href: `/ncc/${l.slug}`, label: `NCC ${l.city}` })),
    { href: '/areas', label: t.nav.areasMap },
  ];

  const contactCard =
    'flex min-h-[4.5rem] flex-col justify-center gap-1 rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3 transition-colors hover:border-gold/50';

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.menuTitle}
      inert={!open}
      className={`fixed inset-0 z-[60] flex flex-col bg-ink text-white transition-[opacity,transform,visibility] duration-500 ease-expo lg:hidden ${
        open ? 'visible translate-x-0 opacity-100' : 'invisible translate-x-8 opacity-0'
      }`}
    >
      <div className="container-x flex h-16 shrink-0 items-center justify-between gap-4 border-b border-white/10">
        <Logo label={t.nav.homeAria} tagline={t.nav.logoTagline} onClick={onClose} />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.nav.closeMenu}
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
        >
          <X size={24} aria-hidden />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="container-x pb-8 pt-4">
          <nav aria-label={t.nav.mainNavLabel}>
            <ul>
              {renderSimple(simple[0])}
              {renderGroup('services', '/services', t.nav.services, serviceItems)}
              {renderSimple(simple[1])}
              {renderGroup('areas', '/areas', t.nav.areas, areaItems)}
              {simple.slice(2).map(renderSimple)}
            </ul>
          </nav>

          <p className="eyebrow eyebrow-light mt-9">{t.nav.quickContact}</p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <a href={telHref(1)} className={contactCard}>
              <Phone size={17} aria-hidden className="text-gold" />
              <span className="text-[13px] text-white/60">{t.actions.call}</span>
              <span className="text-[15px] font-semibold tabular">{phoneLabel(1)}</span>
            </a>
            <a href={telHref(2)} className={contactCard}>
              <Phone size={17} aria-hidden className="text-gold" />
              <span className="text-[13px] text-white/60">{t.actions.call}</span>
              <span className="text-[15px] font-semibold tabular">{phoneLabel(2)}</span>
            </a>
            <a
              href={whatsappHref(t.actions.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={contactCard}
            >
              <WhatsAppIcon size={17} className="text-gold" />
              <span className="text-[13px] text-white/60">{t.status.reply}</span>
              <span className="text-[15px] font-semibold">WhatsApp</span>
            </a>
            <a href={mailHref()} className={contactCard}>
              <Mail size={17} aria-hidden className="text-gold" />
              <span className="text-[13px] text-white/60">Email</span>
              <span className="text-[15px] font-semibold">{t.actions.writeUs}</span>
            </a>
          </div>

          <p className="eyebrow eyebrow-light mt-9">{t.nav.language}</p>
          <div className="mt-4">
            <LanguageSwitcher variant="grid" />
          </div>

          <LiveStatus className="mt-9 text-sm text-white/70" />
        </div>
      </div>

      <div className="container-x shrink-0 border-t border-white/10 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Link href="/contact#prenota" onClick={onClose} className="btn btn-gold btn-lg btn-block">
          {t.actions.quote} <ArrowRight size={17} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
