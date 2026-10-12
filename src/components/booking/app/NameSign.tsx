'use client';

import { useTranslation } from '@/i18n/LanguageProvider';
import { SITE } from '@/lib/site';

/**
 * Meet & greet preview: the tablet the chauffeur holds up at arrivals, with
 * the name being typed. Airport pickups only.
 */
export default function NameSign({ name }: { name: string }) {
  const t = useTranslation();
  const b = t.booking;
  const shown = name.trim() || b.signPlaceholder;

  return (
    <figure className="overflow-clip rounded-3xl bg-ink px-5 pb-5 pt-6 text-white">
      <div className="mx-auto max-w-[19rem] [perspective:900px]">
        <div className="name-sign rounded-[1.1rem] bg-[#1c1c20] p-[7px] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.08)]">
          <div className="flex aspect-[4/3] flex-col items-center justify-between rounded-[0.7rem] bg-white px-4 py-3.5 text-ink">
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-muted">{SITE.name}</span>
            <span
              key={shown}
              className={`step-in block w-full break-words text-center font-display text-[1.9rem] leading-[1.05] ${
                name.trim() ? 'text-ink' : 'text-ink/30'
              }`}
            >
              {shown}
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted">{b.signWelcome}</span>
          </div>
        </div>
      </div>
      <figcaption className="mt-5 text-center text-[13px] leading-snug text-white/70">{b.signCaption}</figcaption>
    </figure>
  );
}
