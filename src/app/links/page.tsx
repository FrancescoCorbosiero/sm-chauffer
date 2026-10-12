'use client';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, CalendarCheck, Instagram, Mail, Phone } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import LiveStatus from '@/components/ui/LiveStatus';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { SITE } from '@/lib/site';
import { bookingHref } from '@/lib/booking';
import { mailHref, phoneLabel, telHref, whatsappHref } from '@/lib/contact';

/** Link-in-bio page for Instagram: every direct channel, one tap away. */
export default function LinksPage() {
  const t = useTranslation();

  const channels: Array<{ href: string; icon: ReactNode; title: string; text: string; external?: boolean }> = [
    {
      href: whatsappHref(t.actions.whatsappMessage),
      icon: <WhatsAppIcon size={20} />,
      title: 'WhatsApp',
      text: t.status.reply,
      external: true,
    },
    {
      href: telHref(1),
      icon: <Phone size={19} aria-hidden />,
      title: `${t.actions.call} · ${phoneLabel(1)}`,
      text: t.hero.trust247,
    },
    {
      href: telHref(2),
      icon: <Phone size={19} aria-hidden />,
      title: `${t.actions.call} · ${phoneLabel(2)}`,
      text: t.hero.trust247,
    },
    {
      href: mailHref(),
      icon: <Mail size={19} aria-hidden />,
      title: 'Email',
      text: SITE.email,
    },
    {
      href: SITE.instagram.url,
      icon: <Instagram size={19} aria-hidden />,
      title: 'Instagram',
      text: `@${SITE.instagram.handle}`,
      external: true,
    },
  ];

  const pages = [
    { href: '/services', label: t.nav.services },
    { href: '/fleet', label: t.nav.fleet },
    { href: '/pricing', label: t.nav.pricing },
    { href: '/areas', label: t.nav.areas },
  ];

  return (
    <section className="ink-panel on-ink relative overflow-clip">
      <div className="mx-auto flex max-w-md flex-col items-center px-5 pb-20 pt-12 text-center sm:pt-16">
        <span className="relative block h-20 w-20 overflow-hidden rounded-full bg-ink ring-1 ring-gold/50">
          <Image src="/logo.png" alt="" fill sizes="80px" priority className="scale-[1.48] object-cover" />
        </span>
        <h1 className="mt-5 text-[2.4rem] leading-tight text-white">{SITE.name}</h1>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">{t.nav.logoTagline}</p>
        <LiveStatus className="mt-4 justify-center text-sm text-white/70" />

        <Link href={bookingHref()} className="btn btn-gold btn-lg btn-block mt-8">
          <CalendarCheck size={18} aria-hidden />
          {t.actions.book}
          <ArrowRight size={17} aria-hidden />
        </Link>
        <p className="mt-2 text-[13px] text-white/50">{t.quickBook.subtitle}</p>

        <ul className="mt-6 w-full space-y-3 text-left">
          {channels.map((c) => (
            <li key={c.href}>
              <a
                href={c.href}
                target={c.external ? '_blank' : undefined}
                rel={c.external ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 transition-colors hover:border-gold/50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-on-gold">
                  {c.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-white tabular">{c.title}</span>
                  <span className="block truncate text-sm text-white/55">{c.text}</span>
                </span>
                <ArrowUpRight
                  size={16}
                  aria-hidden
                  className="shrink-0 text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </li>
          ))}
        </ul>

        <ul className="mt-6 grid w-full grid-cols-2 gap-2.5">
          {pages.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="flex h-12 items-center justify-center rounded-xl border border-white/10 text-sm font-semibold text-white/85 transition-colors hover:border-white/40 hover:text-white"
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-xs leading-relaxed text-white/55">
          {SITE.legalName} · {t.contactPage.companyVat} {SITE.vatNumber}
        </p>
      </div>
    </section>
  );
}
