'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import type { BlogPost } from '@/lib/types';
import { useLanguage } from '@/i18n/LanguageProvider';

export default function BlogCard({ post }: { post: BlogPost }) {
  const { locale, t } = useLanguage();
  const c = post.content[locale] ?? post.content.it;

  return (
    <article className="card card-hover gold-edge group relative flex h-full flex-col overflow-clip">
      <div className="relative aspect-[16/10] overflow-clip bg-ivory-2">
        <Image
          src={post.image}
          alt=""
          fill
          sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-[1.05]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
          {c.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-3 text-[13px] text-muted">
          <time dateTime={post.dateISO}>{c.date}</time>
          <span aria-hidden className="h-1 w-1 rounded-full bg-faint" />
          <span className="inline-flex items-center gap-1">
            <Clock size={13} aria-hidden />
            {post.readingMinutes} {t.blogPost.readMin}
          </span>
        </p>
        <h3 className="mt-3 text-[1.45rem] leading-snug text-ink">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {c.title}
          </Link>
        </h3>
        <p className="mt-2.5 line-clamp-3 text-[15px] leading-relaxed text-muted">{c.excerpt}</p>
      </div>
    </article>
  );
}
