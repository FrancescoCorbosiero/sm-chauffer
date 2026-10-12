'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/lib/types';
import { useTranslation } from '@/i18n/LanguageProvider';
import { SERVICE_ICONS } from './serviceIcons';

export default function ServiceCard({ service, long = false }: { service: Service; long?: boolean }) {
  const t = useTranslation();
  const s = t.services[service.id] ?? { title: service.id, description: '', longDescription: '' };
  const Icon = SERVICE_ICONS[service.icon];
  const href = `/services/${service.id}`;

  return (
    <article className="card card-hover gold-edge group flex h-full flex-col overflow-clip">
      <div className="relative aspect-[16/11] overflow-clip bg-ink">
        <Image
          src={service.image}
          alt=""
          fill
          sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-[1.05]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        {Icon && (
          <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-gold-deep shadow-sm backdrop-blur">
            <Icon size={19} aria-hidden />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[1.6rem] leading-tight text-ink">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {s.title}
          </Link>
        </h3>
        <p className={`mt-2.5 text-[15px] leading-relaxed text-muted ${long ? '' : 'line-clamp-3'}`}>
          {long ? s.longDescription : s.description}
        </p>
        <span className="link-arrow mt-auto self-start pt-5 text-sm">
          {t.common.learnMore}
          <ArrowRight size={15} aria-hidden />
        </span>
      </div>
    </article>
  );
}
