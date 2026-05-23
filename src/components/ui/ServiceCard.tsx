'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Service } from '@/lib/types';
import { useTranslation } from '@/i18n/LanguageProvider';

export default function ServiceCard({ service, index }: { service: Service; index: number }) {
  const t = useTranslation();
  const s = t.services[service.id] ?? { title: service.id, description: '', longDescription: '' };
  const number = String(index + 1).padStart(2, '0');

  return (
    <article
      id={service.id}
      className="group flex flex-col bg-white border border-[var(--color-border)] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-[var(--color-surface-2)]">
        <Image
          src={service.image}
          alt={s.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute top-4 left-4 bg-white text-[var(--color-ink)] text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-full border border-[var(--color-border)] font-medium tabular-nums">
          {number}
        </span>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-medium leading-tight mb-3">{s.title}</h3>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6 flex-1">
          {s.longDescription}
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[var(--color-ink)] hover:text-[var(--color-text-muted)] transition-colors self-start pt-5 border-t border-[var(--color-divider)] w-full"
        >
          {t.serviceCard.requestService} <ArrowUpRight size={14} />
        </Link>
      </div>
    </article>
  );
}
