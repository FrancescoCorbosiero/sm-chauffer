'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  Building2,
  Globe,
  MapPin,
  Plane,
  Route,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Service } from '@/lib/types';
import { useTranslation } from '@/i18n/LanguageProvider';

const ICONS: Record<string, LucideIcon> = { Plane, MapPin, Building2, Route, Globe, Users };

export default function ServiceCard({ service, index }: { service: Service; index: number }) {
  const t = useTranslation();
  const s = t.services[service.id] ?? { title: service.id, description: '', longDescription: '' };
  const number = String(index + 1).padStart(2, '0');
  const Icon = ICONS[service.icon];

  return (
    <article
      id={service.id}
      className="group relative isolate flex min-h-[24rem] flex-col overflow-hidden rounded-[1.4rem] bg-[var(--color-ink)] text-white scroll-mt-28"
    >
      {/* Background photograph — dimmed, slow zoom on hover */}
      <Image
        src={service.image}
        alt={s.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="absolute inset-0 -z-10 object-cover opacity-45 transition-all duration-[1100ms] ease-out group-hover:scale-[1.06] group-hover:opacity-60"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/60 to-[var(--color-ink)]/15"
      />
      {/* Gold hairline that draws across the top edge on hover */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-px w-0 bg-[var(--color-accent)] transition-all duration-500 ease-out group-hover:w-full"
      />

      <div className="relative flex h-full flex-col p-7">
        <div className="flex items-start justify-between">
          <span className="font-display text-5xl font-light leading-none text-white/25 tabular-nums">
            {number}
          </span>
          {Icon && (
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm transition-colors duration-300 group-hover:border-[var(--color-accent)]/60 group-hover:text-[var(--color-accent)]">
              <Icon size={18} aria-hidden />
            </span>
          )}
        </div>

        <div className="mt-auto pt-10">
          <h3 className="text-[1.65rem] font-light leading-tight tracking-tight">{s.title}</h3>
          <span
            aria-hidden
            className="my-4 block h-px w-10 bg-[var(--color-accent)]/70 transition-all duration-500 ease-out group-hover:w-20"
          />
          <p className="text-sm leading-relaxed text-white/70 line-clamp-3">{s.longDescription}</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] text-white/85 transition-colors hover:text-white"
          >
            {t.serviceCard.requestService}
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
