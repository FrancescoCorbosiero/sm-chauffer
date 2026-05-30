import Link from 'next/link';
import {
  ArrowUpRight,
  Globe,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { SITE } from '@/lib/site';

const links = [
  {
    title: 'Sito web',
    description: 'Vai al sito ufficiale.',
    href: '/',
    icon: Globe,
    external: false,
  },
  {
    title: 'WhatsApp',
    description: 'Scrivici subito per un contatto rapido.',
    href: `https://wa.me/${SITE.whatsapp}`,
    icon: MessageCircle,
    external: true,
  },
  {
    title: 'Telefono',
    description: 'Chiama direttamente, disponibili 24 ore.',
    href: `tel:${SITE.phone}`,
    icon: Phone,
    external: false,
  },
  {
    title: 'Email',
    description: 'Scrivi a info@chauffeurskmilano.it per preventivi e info.',
    href: `mailto:${SITE.email}`,
    icon: Mail,
    external: false,
  },
  {
    title: 'Instagram',
    description: `Seguici su @${SITE.instagram.handle} per la flotta e i dietro le quinte.`,
    href: SITE.instagram.url,
    icon: Instagram,
    external: true,
  },
] as const;

export default function LinksPage() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8f4ec_0%,#ffffff_45%,#f7f2ea_100%)] py-20 md:py-24 min-h-[calc(100vh-0px)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0)_70%)] blur-2xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0)_72%)] blur-2xl" />
      </div>

      <div className="container-x relative">
        <div className="max-w-xl mx-auto">
          <div className="mb-6 rounded-[2rem] border border-[var(--color-border)] bg-white/80 backdrop-blur-md px-6 py-5 shadow-[var(--shadow-sm)]">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--color-text-muted)]">
              SM Luxury Chauffeur
            </p>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--color-ink)]">
                  Links
                </h1>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Milano · Como · Bellagio · Tremezzo
                </p>
              </div>
              <div className="h-14 w-14 rounded-full border border-[var(--color-border)] bg-[linear-gradient(135deg,#ffffff_0%,#f0e6d2_100%)] flex items-center justify-center shadow-[var(--shadow-sm)]">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink)]">SM</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:gap-5">
            {links.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer noopener' : undefined}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-white px-5 sm:px-6 py-4 sm:py-5 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-ink)]/15 hover:shadow-[var(--shadow-md)]"
                >
                  <span className="absolute inset-y-0 left-0 w-1 bg-[linear-gradient(180deg,#111827_0%,#9ca3af_100%)] opacity-70 transition-all duration-300 group-hover:w-1.5 group-hover:opacity-100" />
                  <div className="flex items-center gap-4 pl-2">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] transition-transform duration-300 group-hover:scale-105">
                      <Icon size={20} className="text-[var(--color-ink)]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-medium text-[var(--color-ink)]">
                              {item.title}
                            </h2>
                            <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
                            {item.description}
                          </p>
                        </div>

                        <ArrowUpRight
                          size={16}
                          className="shrink-0 text-[var(--color-text-muted)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
