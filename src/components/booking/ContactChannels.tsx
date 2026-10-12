'use client';
import { ArrowUpRight, Instagram, Mail, Phone } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { SITE } from '@/lib/site';
import { mailHref, phoneLabel, telHref, whatsappHref } from '@/lib/contact';

/** The four direct channels, as cards on ink (contact page hero). */
export default function ContactChannels() {
  const t = useTranslation();
  const c = t.contactPage;
  const card =
    'group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition-colors duration-300 hover:border-gold/45';
  const icon = 'flex h-11 w-11 items-center justify-center rounded-full bg-gold text-ink';
  const kicker = 'mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold';
  const desc = 'mt-2 text-sm leading-relaxed text-white/60';
  const more = 'mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-white';

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <li className={card}>
        <span className={icon}>
          <Phone size={19} aria-hidden />
        </span>
        <p className={kicker}>{t.footer.phone24}</p>
        <p className={desc}>{c.phoneDesc}</p>
        <div className="mt-auto flex flex-col gap-2 pt-5">
          {([1, 2] as const).map((line) => (
            <a
              key={line}
              href={telHref(line)}
              className="inline-flex items-center justify-between rounded-xl border border-white/12 px-3.5 py-2.5 text-[15px] font-semibold text-white tabular transition-colors hover:border-gold hover:text-gold-light"
            >
              {phoneLabel(line)}
              <Phone size={14} aria-hidden className="text-gold" />
            </a>
          ))}
        </div>
      </li>
      <li>
        <a
          href={whatsappHref(t.actions.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className={card}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white">
            <WhatsAppIcon size={20} />
          </span>
          <p className={kicker}>WhatsApp</p>
          <p className={desc}>{t.status.reply}</p>
          <span className={more}>
            {c.openChat}
            <ArrowUpRight
              size={15}
              aria-hidden
              className="text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </a>
      </li>
      <li className={card}>
        <span className={icon}>
          <Mail size={19} aria-hidden />
        </span>
        <p className={kicker}>Email</p>
        <p className={desc}>{c.emailDesc}</p>
        <div className="mt-auto flex flex-col gap-1.5 pt-5">
          <a
            href={mailHref()}
            className="text-[15px] font-semibold text-white [overflow-wrap:anywhere] hover:text-gold-light"
          >
            {SITE.email.split('@')[0]}@<wbr />
            {SITE.email.split('@')[1]}
          </a>
          <a
            href={mailHref(SITE.emailBackend)}
            className="text-sm text-white/65 [overflow-wrap:anywhere] hover:text-gold-light"
          >
            {SITE.emailBackend}
          </a>
        </div>
      </li>
      <li>
        <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className={card}>
          <span className={icon}>
            <Instagram size={19} aria-hidden />
          </span>
          <p className={kicker}>Instagram</p>
          <p className={desc}>{c.instagramDesc}</p>
          <span className={more}>
            @{SITE.instagram.handle}
            <ArrowUpRight
              size={15}
              aria-hidden
              className="text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </a>
      </li>
    </ul>
  );
}
