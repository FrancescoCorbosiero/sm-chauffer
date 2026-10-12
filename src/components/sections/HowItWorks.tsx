'use client';
import { useTranslation } from '@/i18n/LanguageProvider';
import SectionHeading from '@/components/ui/SectionHeading';

/**
 * The four booking steps as a timeline: a rule with numbered stops, no
 * boxes. Reused on the home, services and contact pages.
 */
export default function HowItWorks({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const t = useTranslation();
  const s = t.steps;
  const dark = tone === 'dark';

  return (
    <section className={`section-y relative overflow-clip ${dark ? 'ink-panel on-ink' : 'bg-white'}`}>
      <div className="container-x">
        <SectionHeading
          className="reveal"
          layout="split"
          tone={tone}
          eyebrow={s.label}
          title={s.title}
          accent={s.accent}
          description={s.description}
        />
        <ol className="reveal-stagger relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-8">
          <span
            aria-hidden
            className={`absolute left-0 right-0 top-[0.55rem] hidden h-px lg:block ${dark ? 'bg-white/20' : 'bg-line-strong'}`}
          />
          {s.items.map((item, i) => (
            <li key={item.title} style={{ ['--i' as string]: i }} className="relative">
              <span
                aria-hidden
                className={`relative block h-[1.1rem] w-[1.1rem] rounded-full border-2 ${
                  dark ? 'border-white bg-ink' : 'border-ink bg-white'
                }`}
              />
              <p
                aria-hidden
                className={`mt-6 font-display text-6xl leading-none tabular ${dark ? 'text-white/25' : 'text-ink/20'}`}
              >
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className={`mt-4 text-[1.7rem] leading-tight ${dark ? 'text-white' : 'text-ink'}`}>
                <span className="sr-only">{i + 1}. </span>
                {item.title}
              </h3>
              <p className={`mt-2.5 text-[15px] leading-relaxed ${dark ? 'text-white/65' : 'text-muted'}`}>
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
