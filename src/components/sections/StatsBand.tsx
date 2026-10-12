'use client';
import { useLanguage } from '@/i18n/LanguageProvider';
import { formatInt } from '@/lib/format';

const BORDERS = [
  '',
  'border-l border-line',
  'border-t border-line lg:border-l lg:border-t-0',
  'border-l border-t border-line lg:border-t-0',
];

/** Four key figures in a calm band right under the hero. */
export default function StatsBand() {
  const { t, locale } = useLanguage();
  const stats = [
    { value: '10+', label: t.stats.years },
    { value: `${formatInt(2000, locale)}+`, label: t.stats.transfers },
    { value: '5.0', label: t.stats.googleStars },
    { value: '24/7', label: t.stats.availability },
  ];

  return (
    <section aria-label={t.stats.label} className="border-b border-line bg-white">
      <div className="container-x">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`flex flex-col gap-2 px-4 py-8 sm:px-8 lg:py-11 ${BORDERS[i]}`}>
              <dt className="order-2 text-[13px] font-medium leading-snug text-muted">{s.label}</dt>
              <dd className="order-1 font-display text-[clamp(2.4rem,1.9rem+1.6vw,3.4rem)] leading-none text-ink tabular">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
