'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import type { BlogBlock, BlogPost } from '@/lib/types';
import { useLanguage } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import BlogCard from '@/components/ui/BlogCard';
import SectionHeading from '@/components/ui/SectionHeading';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { SITE } from '@/lib/site';
import { bookingHref } from '@/lib/booking';
import { whatsappHref } from '@/lib/contact';

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="mb-4 mt-12 text-[2rem] leading-tight text-ink">{block.text}</h2>;
    case 'p':
      return <p className="mb-6 text-[17px] leading-[1.8] text-ink/85">{block.text}</p>;
    case 'ul':
      return (
        <ul className="mb-7 space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3.5 text-[17px] leading-[1.7] text-ink/85">
              <span aria-hidden className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <blockquote className="my-10 border-l-2 border-gold pl-6 font-display text-[1.75rem] italic leading-snug text-ink">
          {block.text}
        </blockquote>
      );
  }
}

export default function ArticleView({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  const { locale, t } = useLanguage();
  const c = post.content[locale] ?? post.content.it;
  const b = t.blogPost;
  usePageTitle(`${c.title} · ${SITE.name}`, c.metaDescription);

  return (
    <article>
      <header className="ink-panel on-ink relative overflow-clip">
        <div className="container-x pb-32 pt-7 md:pb-44 md:pt-11">
          <div className="intro">
            <Breadcrumbs
              items={[
                { label: t.nav.home, href: '/' },
                { label: t.blogPage.label, href: '/blog' },
                { label: c.category },
              ]}
            />
          </div>
          <div className="mx-auto mt-10 max-w-3xl text-center md:mt-14">
            <p className="intro eyebrow eyebrow-light justify-center" style={{ ['--d' as string]: 40 }}>
              {c.category}
            </p>
            <h1 className="intro mt-5 text-5xl text-white" style={{ ['--d' as string]: 100 }}>
              {c.title}
            </h1>
            <p
              className="intro mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/65"
              style={{ ['--d' as string]: 160 }}
            >
              <span className="font-semibold text-white/85">{post.author}</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-white/30" />
              <time dateTime={post.dateISO}>{c.date}</time>
              <span aria-hidden className="h-1 w-1 rounded-full bg-white/30" />
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} aria-hidden />
                {post.readingMinutes} {b.readMin}
              </span>
            </p>
          </div>
        </div>
      </header>

      <div className="bg-white pb-20 md:pb-28">
        <div className="container-x">
          <div className="intro relative mx-auto -mt-24 aspect-[16/9] max-w-5xl overflow-clip rounded-3xl bg-ink shadow-xl md:-mt-32" style={{ ['--d' as string]: 220 }}>
            <Image src={post.image} alt={c.title} fill priority sizes="(max-width: 1100px) 100vw, 1024px" className="object-cover" />
          </div>

          <div className="mx-auto mt-12 max-w-[42rem] md:mt-16">
            <p className="mb-10 border-b border-line pb-10 text-xl leading-relaxed text-ink">{c.excerpt}</p>
            {c.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}

            <aside className="mt-14 rounded-3xl bg-ink p-7 text-white sm:p-9">
              <p className="font-display text-[1.9rem] leading-tight">{b.ctaTitle}</p>
              <p className="mt-2 text-[15px] text-white/65">{t.status.reply}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={bookingHref()} className="btn btn-gold">
                  {b.ctaButton}
                  <ArrowRight size={16} aria-hidden />
                </Link>
                <a
                  href={whatsappHref(t.actions.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light"
                >
                  <WhatsAppIcon size={16} />
                  WhatsApp
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section-y border-t border-line bg-ivory">
          <div className="container-x">
            <SectionHeading
              className="reveal"
              eyebrow={t.blogPage.label}
              title={b.related}
              action={
                <Link href="/blog" className="link-arrow text-sm">
                  {b.back}
                  <ArrowRight size={15} aria-hidden />
                </Link>
              }
            />
            <ul className="reveal-stagger mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {related.map((p, i) => (
                <li key={p.id} style={{ ['--i' as string]: i }}>
                  <BlogCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
