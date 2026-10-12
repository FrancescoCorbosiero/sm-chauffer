'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { blogPosts } from '@/lib/data';

/** Latest articles as text columns, newspaper-style: no images, no cards. */
export default function BlogPreview() {
  const { t, locale } = useLanguage();
  const p = t.blogPreview;
  const posts = [...blogPosts].sort((a, b) => b.dateISO.localeCompare(a.dateISO)).slice(0, 3);

  return (
    <section className="section-y bg-white">
      <div className="container-x">
        <div className="reveal flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-4xl text-ink">
            {p.title} {p.accent}
          </h2>
          <Link href="/blog" className="link-arrow shrink-0">
            {p.cta}
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <ul className="reveal-stagger mt-10 grid grid-cols-1 gap-x-10 md:grid-cols-3">
          {posts.map((post, i) => {
            const c = post.content[locale] ?? post.content.it;
            return (
              <li key={post.id} style={{ ['--i' as string]: i }} className="border-t-2 border-ink py-7">
                <article className="group relative">
                  <p className="text-sm text-muted">
                    {c.category} · <time dateTime={post.dateISO}>{c.date}</time>
                  </p>
                  <h3 className="mt-3 text-[1.75rem] leading-tight text-ink">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="underline-offset-[6px] after:absolute after:inset-0 after:content-[''] group-hover:underline"
                    >
                      {c.title}
                    </Link>
                  </h3>
                  <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-muted">{c.excerpt}</p>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
