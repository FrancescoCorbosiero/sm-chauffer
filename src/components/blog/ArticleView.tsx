'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import type { BlogBlock, BlogPost } from '@/lib/types';
import { useLanguage } from '@/i18n/LanguageProvider';

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="mt-12 mb-4 text-2xl md:text-3xl font-light leading-tight text-[var(--color-ink)]">
          {block.text}
        </h2>
      );
    case 'p':
      return (
        <p className="mb-5 text-[17px] leading-[1.75] text-[var(--color-text)]">{block.text}</p>
      );
    case 'ul':
      return (
        <ul className="mb-6 space-y-2.5 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-[17px] leading-[1.7] text-[var(--color-text)]">
              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <blockquote className="my-8 border-l-2 border-[var(--color-accent)] pl-5 text-xl font-light italic leading-relaxed text-[var(--color-ink)]">
          {block.text}
        </blockquote>
      );
  }
}

export default function ArticleView({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  const { locale, t } = useLanguage();
  const c = post.content[locale] ?? post.content.it;
  const b = t.blogPost;

  return (
    <article>
      {/* Hero */}
      <header className="relative h-[58vh] min-h-[420px] w-full overflow-hidden bg-[var(--color-ink)]">
        <Image src={post.image} alt={c.title} fill priority sizes="100vw" className="object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="container-x pb-12 md:pb-16">
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white"
            >
              <ArrowLeft size={14} /> {b.back}
            </Link>
            <span className="block text-[11px] uppercase tracking-[0.28em] text-[var(--color-accent)]">
              {c.category}
            </span>
            <h1 className="mt-3 max-w-3xl text-3xl font-light leading-tight text-white md:text-5xl">
              {c.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/75">
              <span>{post.author}</span>
              <time dateTime={post.dateISO}>{c.date}</time>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} /> {post.readingMinutes} {b.readMin}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="bg-white py-14 md:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-2xl">
            <p className="mb-10 text-lg leading-relaxed text-[var(--color-text-muted)]">{c.excerpt}</p>
            {c.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}

            <div className="mt-14 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 text-center">
              <p className="text-lg font-light text-[var(--color-ink)]">{b.ctaTitle}</p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-ink-soft)]"
              >
                {b.ctaButton}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-14">
          <div className="container-x">
            <h2 className="mb-8 text-sm uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
              {b.related}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {related.map((p) => {
                const rc = p.content[locale] ?? p.content.it;
                return (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group flex gap-4 rounded-xl border border-[var(--color-border)] bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
                  >
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface-2)]">
                      <Image src={p.image} alt={rc.title} fill sizes="112px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-faint)]">
                        {rc.category}
                      </span>
                      <h3 className="mt-1 text-sm font-medium leading-snug text-[var(--color-ink)] group-hover:text-[var(--color-text-muted)]">
                        {rc.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
