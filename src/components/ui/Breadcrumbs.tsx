import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

/** Visible breadcrumb trail (the JSON-LD version lives in BreadcrumbJsonLd). */
export default function Breadcrumbs({ items, tone = 'dark' }: { items: Crumb[]; tone?: 'dark' | 'light' }) {
  const dark = tone === 'dark';
  return (
    <nav aria-label="Breadcrumb" className="text-[13px]">
      <ol className={`flex flex-wrap items-center gap-x-1.5 gap-y-1 ${dark ? 'text-white/55' : 'text-muted'}`}>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="inline-flex items-center gap-1.5">
              {c.href && !last ? (
                <Link href={c.href} className={`transition-colors ${dark ? 'hover:text-white' : 'hover:text-ink'}`}>
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={dark ? 'text-white/85' : 'text-ink'}>
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight size={13} aria-hidden className="opacity-60" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
