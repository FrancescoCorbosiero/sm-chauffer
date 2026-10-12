'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { whatsappHref } from '@/lib/contact';

/** Desktop-only floating WhatsApp button + back-to-top (phones use the action bar). */
export default function FloatingActions() {
  const t = useTranslation();
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setShowTop(window.scrollY > 900);
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

  if (pathname === '/links') return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-3 lg:flex">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={t.actions.backToTop}
        title={t.actions.backToTop}
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
        className={`flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-md transition-all duration-300 hover:border-ink ${
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
        }`}
      >
        <ArrowUp size={18} aria-hidden />
      </button>
      <a
        href={whatsappHref(t.actions.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.whatsapp.aria}
        className="group flex h-[3.25rem] items-center gap-2.5 rounded-full bg-ink pl-2 pr-5 text-white shadow-xl ring-1 ring-white/10 transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-ink-3"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform duration-300 group-hover:scale-105">
          <WhatsAppIcon size={18} />
        </span>
        <span className="text-sm font-semibold">{t.whatsapp.label}</span>
      </a>
    </div>
  );
}
