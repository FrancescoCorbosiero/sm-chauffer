'use client';
import { CalendarCheck, CarFront, Handshake, MessageSquareText } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import SectionHeading from '@/components/ui/SectionHeading';

const ICONS = [MessageSquareText, CalendarCheck, Handshake, CarFront];

/** Four booking steps on an ink band. Reused on the home, services and contact pages. */
export default function HowItWorks({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const t = useTranslation();
  const s = t.steps;
  const dark = tone === 'dark';

  return (
    <section className={`section-y relative overflow-clip ${dark ? 'ink-panel on-ink' : 'bg-white'}`}>
      <div className="container-x">
        <SectionHeading
          className="reveal"
          tone={tone}
          eyebrow={s.label}
          title={s.title}
          accent={s.accent}
          description={s.description}
        />
        <ol className="reveal-stagger mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {s.items.map((item, i) => {
            const Icon = ICONS[i] ?? MessageSquareText;
            return (
              <li
                key={item.title}
                style={{ ['--i' as string]: i }}
                className={`relative flex gap-4 rounded-2xl border p-5 sm:flex-col sm:gap-0 sm:p-6 lg:p-7 ${
                  dark ? 'border-white/10 bg-white/[0.03]' : 'border-line bg-ivory'
                }`}
              >
                <div className="flex shrink-0 items-start justify-between sm:items-center">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full sm:h-12 sm:w-12 ${
                      dark ? 'bg-gold text-on-gold' : 'bg-ink text-gold'
                    }`}
                  >
                    <Icon size={20} aria-hidden />
                  </span>
                  <span
                    aria-hidden
                    data-n={String(i + 1).padStart(2, '0')}
                    className={`hidden font-display text-4xl leading-none tabular before:content-[attr(data-n)] sm:block ${
                      dark ? 'text-white/15' : 'text-ink/15'
                    }`}
                  />
                </div>
                <div>
                  <h3 className={`text-[1.45rem] leading-tight sm:mt-6 sm:text-[1.6rem] ${dark ? 'text-white' : 'text-ink'}`}>
                    <span className="sr-only">{i + 1}. </span>
                    {item.title}
                  </h3>
                  <p className={`mt-1.5 text-[15px] leading-relaxed sm:mt-2.5 ${dark ? 'text-white/65' : 'text-muted'}`}>
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
