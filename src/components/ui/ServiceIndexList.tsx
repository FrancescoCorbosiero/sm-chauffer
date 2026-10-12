'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import { services } from '@/lib/data';

/** Services as a numbered index of rows with a small photo (home, detail pages). */
export default function ServiceIndexList({
  only,
  exclude,
  className = '',
}: {
  /** Ids to show, in services order; defaults to all. */
  only?: string[];
  exclude?: string;
  className?: string;
}) {
  const t = useTranslation();
  const list = services.filter((s) => (!only || only.includes(s.id)) && s.id !== exclude);
  return (
    <ol className={`border-t border-line-strong ${className}`.trim()}>
      {list.map((s, i) => {
        const copy = t.services[s.id];
        return (
          <li key={s.id} className="border-b border-line-strong">
            <Link
              href={`/services/${s.id}`}
              className="group grid grid-cols-[2.25rem_1fr_auto] items-center gap-4 py-6 sm:grid-cols-[3rem_1fr_7rem_auto] sm:gap-6 sm:py-7"
            >
              <span className="self-start pt-1.5 font-display text-xl text-muted tabular">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[1.9rem] leading-tight text-ink transition-transform duration-500 ease-smooth group-hover:translate-x-1.5 sm:text-[2.3rem]">
                  {copy?.title ?? s.id}
                </span>
                <span className="mt-1.5 block text-[15px] leading-snug text-muted">{copy?.description}</span>
              </span>
              <span className="relative hidden aspect-[4/3] w-28 overflow-clip rounded-lg bg-ink sm:block">
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
              </span>
              <ArrowUpRight
                size={22}
                aria-hidden
                className="text-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
