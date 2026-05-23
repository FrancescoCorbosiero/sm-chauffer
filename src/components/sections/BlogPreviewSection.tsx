'use client';
import Link from 'next/link';
import BlogCard from '@/components/ui/BlogCard';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { blogPosts } from '@/lib/data';
import { useTranslation } from '@/i18n/LanguageProvider';

export default function BlogPreviewSection() {
  const t = useTranslation();
  return (
    <section className="section-y bg-white">
      <div className="container-x">
        <ScrollReveal>
          <SectionHeader
            align="center"
            label={t.blogPreview.label}
            title={t.blogPreview.title}
            description={t.blogPreview.description}
            className="mb-14"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogPosts.slice(0, 3).map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 0.1}>
              <BlogCard post={p} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.2} className="mt-12 text-center">
          <Link href="/blog" className="link-arrow">
            {t.blogPreview.cta}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
