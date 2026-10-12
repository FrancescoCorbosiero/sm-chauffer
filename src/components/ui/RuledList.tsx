import type { LucideIcon } from 'lucide-react';

/**
 * Points set as typography between hairlines, in 1–4 columns: no boxes, no
 * icon discs. Used instead of card grids for features, values and standards.
 */
export default function RuledList({
  items,
  cols = 2,
  numbered = false,
  icons,
  tone = 'light',
  className = '',
}: {
  items: Array<{ title: string; text: string }>;
  cols?: 1 | 2 | 3 | 4;
  numbered?: boolean;
  icons?: LucideIcon[];
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const dark = tone === 'dark';
  const grid = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[cols];
  const Tag = numbered ? 'ol' : 'ul';

  return (
    <Tag className={`reveal-stagger grid gap-x-10 ${grid} ${className}`.trim()}>
      {items.map((item, i) => {
        const Icon = icons?.[i];
        return (
          <li
            key={item.title}
            style={{ ['--i' as string]: i }}
            className={`border-t py-6 ${dark ? 'border-white/25' : 'border-ink'}`}
          >
            <div className="flex items-baseline gap-3">
              {numbered && (
                <span aria-hidden className={`font-display text-lg tabular ${dark ? 'text-white/50' : 'text-muted'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
              {!numbered && Icon && (
                <Icon size={17} aria-hidden className={`shrink-0 translate-y-0.5 ${dark ? 'text-white/70' : 'text-ink'}`} />
              )}
              <h3 className={`text-[1.55rem] leading-tight ${dark ? 'text-white' : 'text-ink'}`}>{item.title}</h3>
            </div>
            <p className={`mt-2.5 text-[15px] leading-relaxed ${dark ? 'text-white/65' : 'text-muted'}`}>{item.text}</p>
          </li>
        );
      })}
    </Tag>
  );
}
