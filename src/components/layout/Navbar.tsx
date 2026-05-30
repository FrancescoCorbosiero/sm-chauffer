'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Navbar() {
  const t = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isOverDarkHero = !isScrolled && !isOpen && pathname !== '/links';

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/fleet', label: t.nav.fleet },
    { href: '/services', label: t.nav.services },
    { href: '/about', label: t.nav.about },
    { href: '/blog', label: t.nav.blog },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]'
          : 'bg-white/0 border-b border-transparent'
      }`}
    >
      <div className="container-x py-5 md:py-6 flex items-center justify-between gap-6">
        <Link href="/" aria-label={t.nav.homeAria} className="shrink-0">
          <Image
            src="/logo.png"
            alt="Chauffeur SK Luxury Milano"
            width={52}
            height={52}
            className="h-11 w-auto"
            priority
          />
        </Link>

        <nav
          aria-label={t.nav.mainNavLabel}
          className="hidden md:flex gap-2 lg:gap-4 items-center"
        >
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-2 py-2 text-[15px] transition-colors ${
                  isOverDarkHero
                    ? isActive
                      ? 'text-white font-medium'
                      : 'text-white/70 hover:text-white'
                    : isActive
                      ? 'text-[var(--color-ink)] font-medium'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-ink)]'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <LanguageSwitcher variant={isOverDarkHero ? 'dark' : 'light'} />
          <Link
            href="/contact"
            className={`ml-3 inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
              isOverDarkHero
                ? 'bg-white text-[var(--color-ink)] hover:bg-white/90'
                : 'bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink-soft)]'
            }`}
          >
            {t.nav.bookNow}
          </Link>
        </nav>

        <div className="md:hidden flex items-center gap-1">
          <LanguageSwitcher variant={isOverDarkHero ? 'dark' : 'light'} />
          <button
            type="button"
            className={`p-2 -mr-2 transition-colors ${isOverDarkHero ? 'text-white' : 'text-[var(--color-ink)]'}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute inset-x-0 top-full bg-white border-t border-[var(--color-border)] shadow-[var(--shadow-md)]">
          <nav className="container-x py-6 flex flex-col gap-1">
            {links.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base py-3 ${
                    isActive
                      ? 'text-[var(--color-ink)] font-medium'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="btn-primary mt-4 w-full"
            >
              {t.nav.bookNowLong}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
