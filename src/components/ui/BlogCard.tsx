'use client';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/lib/types';
import { useLanguage } from '@/i18n/LanguageProvider';

export default function BlogCard({ post }: { post: BlogPost }) {
  const { locale } = useLanguage();
  const c = post.content[locale] ?? post.content.it;

  return (
    <article className="group flex flex-col bg-white border border-[var(--color-border)] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
      <Link
        href={`/blog/${post.slug}`}
        className="block relative aspect-[5/4] w-full overflow-hidden bg-[var(--color-surface-2)]"
      >
        <Image
          src={post.image}
          alt={c.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute top-4 left-4 bg-white text-[var(--color-ink)] text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-full border border-[var(--color-border)]">
          {c.category}
        </span>
      </Link>
      <div className="p-6 flex-1 flex flex-col">
        <time
          dateTime={post.dateISO}
          className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-faint)] mb-3"
        >
          {c.date}
        </time>
        <h3 className="text-lg font-medium leading-snug mb-3">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-[var(--color-text-muted)] transition-colors"
          >
            {c.title}
          </Link>
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-3 flex-1">
          {c.excerpt}
        </p>
      </div>
    </article>
  );
}
