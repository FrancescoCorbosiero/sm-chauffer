'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { blogPosts } from '@/lib/data';
import BlogCard from '@/components/ui/BlogCard';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/sections/CtaBand';
import { useLanguage } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import { IMAGES } from '@/lib/images';

export default function BlogPage() {
  const { t, locale } = useLanguage();
  usePageTitle(t.meta.blog.title, t.meta.blog.description);
  const b = t.blogPage;
  const posts = [...blogPosts].sort((x, y) => y.dateISO.localeCompare(x.dateISO));
  const [featured, ...rest] = posts;
  const fc = featured ? (featured.content[locale] ?? featured.content.it) : null;

  return (
    <>
      <PageHero
        crumbs={[{ label: t.nav.home, href: '/' }, { label: b.label }]}
        eyebrow={b.label}
        title={b.title}
        accent={b.accent}
        description={b.description}
        image={IMAGES.pageHeroes.blog}
      />

      <section className="section-y bg-white">
        <div className="container-x">
          {featured && fc && (
            <article className="reveal group relative grid grid-cols-1 overflow-clip rounded-3xl border border-line bg-ivory lg:grid-cols-12">
              <div className="relative aspect-[16/10] overflow-clip bg-ink lg:col-span-7 lg:aspect-auto lg:min-h-[26rem]">
                <Image
                  src={featured.image}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-[1400ms] ease-smooth group-hover:scale-[1.04]"
                />
                <span className="absolute left-5 top-5 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
                  {b.featured}
                </span>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-5 lg:p-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-deep">{fc.category}</p>
                <h2 className="mt-3 text-4xl text-ink">
                  <Link href={`/blog/${featured.slug}`} className="after:absolute after:inset-0 after:content-['']">
                    {fc.title}
                  </Link>
                </h2>
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">{fc.excerpt}</p>
                <p className="mt-6 flex flex-wrap items-center gap-3 text-[13px] text-muted">
                  <time dateTime={featured.dateISO}>{fc.date}</time>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-faint" />
                  <span className="inline-flex items-center gap-1">
                    <Clock size={13} aria-hidden />
                    {featured.readingMinutes} {t.blogPost.readMin}
                  </span>
                </p>
                <span className="link-arrow mt-7 self-start text-sm">
                  {b.readArticle}
                  <ArrowRight size={15} aria-hidden />
                </span>
              </div>
            </article>
          )}

          {rest.length > 0 && (
            <ul className="reveal-stagger mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6">
              {rest.map((p, i) => (
                <li key={p.id} style={{ ['--i' as string]: i }}>
                  <BlogCard post={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
