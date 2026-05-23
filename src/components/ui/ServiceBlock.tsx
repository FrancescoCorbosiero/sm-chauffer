'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Service } from '@/lib/types';
import { useTranslation } from '@/i18n/LanguageProvider';

export default function ServiceBlock({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const t = useTranslation();
  const s = t.services[service.id] ?? { title: service.id, description: '', longDescription: '' };
  const isEven = index % 2 === 0;
  const textOrder = isEven ? 'lg:order-2' : 'lg:order-1';
  const imageOrder = isEven ? 'lg:order-1' : 'lg:order-2';
  const number = String(index + 1).padStart(2, '0');

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div className={`flex flex-col ${textOrder}`}>
        <div className="flex items-baseline gap-4 mb-5">
          <span className="text-sm font-medium text-[var(--color-text-faint)] tabular-nums">
            {number}
          </span>
          <span className="h-px flex-1 bg-[var(--color-border)] max-w-[80px]" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
            {t.serviceCard.serviceTag}
          </span>
        </div>
        <h3 className="text-[clamp(1.8rem,1rem+1.8vw,2.5rem)] font-light leading-tight tracking-tight mb-5 text-[var(--color-ink)]">
          {s.title}
        </h3>
        <p className="text-[var(--color-text-muted)] leading-relaxed mb-8 max-w-xl">
          {s.longDescription}
        </p>
        <Link href="/services" className="link-arrow self-start">
          {t.serviceCard.moreDetails} <ArrowRight size={14} />
        </Link>
      </div>
      <div className={imageOrder}>
        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[var(--color-surface-2)]">
          <Image
            src={service.image}
            alt={s.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
