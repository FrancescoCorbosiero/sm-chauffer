'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarCheck, Phone } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { telHref, whatsappHref } from '@/lib/contact';

const FIELD_SELECTOR =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, select';

/**
 * Sticky bottom bar on phones and tablets: call, WhatsApp, book — the three
 * things a visitor on the move actually wants. It slides away while a form
 * field has focus so it never floats above the on-screen keyboard.
 */
export default function MobileActionBar() {
  const t = useTranslation();
  const pathname = usePathname();
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const isField = (el: EventTarget | null) => el instanceof Element && el.matches(FIELD_SELECTOR);
    const onIn = (e: FocusEvent) => {
      if (isField(e.target)) setTyping(true);
    };
    const onOut = (e: FocusEvent) => {
      if (isField(e.target)) setTyping(false);
    };
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => {
      document.removeEventListener('focusin', onIn);
      document.removeEventListener('focusout', onOut);
    };
  }, []);

  if (pathname === '/links') return null;

  const item =
    'flex h-12 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold tracking-wide text-white/85 transition-colors active:bg-white/10';

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-smooth lg:hidden ${
        typing ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <nav
        aria-label={t.actions.barLabel}
        className="border-t border-white/10 bg-ink/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl"
      >
        <div className="mx-auto grid max-w-lg grid-cols-[1fr_1fr_1.4fr] gap-2">
          <a href={telHref(1)} className={item}>
            <Phone size={18} aria-hidden className="text-gold" />
            {t.actions.call}
          </a>
          <a
            href={whatsappHref(t.actions.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className={item}
          >
            <WhatsAppIcon size={18} className="text-gold" />
            WhatsApp
          </a>
          <Link href="/contact#prenota" className="btn btn-gold h-12 min-h-0 rounded-xl px-3 text-[14px]">
            <CalendarCheck size={17} aria-hidden />
            {t.actions.book}
          </Link>
        </div>
      </nav>
    </div>
  );
}
