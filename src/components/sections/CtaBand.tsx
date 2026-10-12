'use client';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import LiveStatus from '@/components/ui/LiveStatus';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { phoneLabel, telHref, whatsappHref } from '@/lib/contact';

/** Closing call-to-action band, shared by most pages. */
export default function CtaBand({
  title,
  accent,
  description,
  href = '/contact#prenota',
}: {
  title?: string;
  accent?: string;
  description?: string;
  href?: string;
}) {
  const t = useTranslation();
  const c = t.ctaBand;

  return (
    <section className="ink-panel on-ink relative overflow-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full border border-white/[0.06]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-56 -left-24 h-[30rem] w-[30rem] rounded-full border border-white/[0.06]"
      />
      <div className="container-x relative grid grid-cols-1 gap-10 py-20 md:py-24 lg:grid-cols-12 lg:items-end lg:gap-12 lg:py-28">
        <div className="reveal lg:col-span-7">
          <LiveStatus className="text-sm text-white/70" />
          <h2 className="mt-5 text-5xl text-white">
            {title ?? c.title} <span className="title-accent title-accent-light">{accent ?? c.accent}</span>
          </h2>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-white/65">{description ?? c.description}</p>
        </div>
        <div className="reveal flex flex-col gap-3 lg:col-span-5 lg:items-end">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            <Link href={href} className="btn btn-gold btn-lg w-full sm:w-auto">
              {t.actions.quote}
              <ArrowRight size={18} aria-hidden />
            </Link>
            <a
              href={whatsappHref(t.actions.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light btn-lg w-full sm:w-auto"
            >
              <WhatsAppIcon size={18} />
              WhatsApp
            </a>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-white/75 lg:justify-end">
            <a href={telHref(1)} className="inline-flex items-center gap-2 tabular hover:text-white">
              <Phone size={15} aria-hidden className="text-gold" />
              {phoneLabel(1)}
            </a>
            <a href={telHref(2)} className="inline-flex items-center gap-2 tabular hover:text-white">
              <Phone size={15} aria-hidden className="text-gold" />
              {phoneLabel(2)}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
