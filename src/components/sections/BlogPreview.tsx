'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import SectionHeading from '@/components/ui/SectionHeading';
import BlogCard from '@/components/ui/BlogCard';
import Rail from '@/components/ui/Rail';
import { blogPosts } from '@/lib/data';

export default function BlogPreview() {
  const t = useTranslation();
  const p = t.blogPreview;
  return (
    <section className="section-y bg-white">
      <div className="container-x">
        <SectionHeading
          className="reveal"
          eyebrow={p.label}
          title={p.title}
          accent={p.accent}
          description={p.description}
          action={
            <Link href="/blog" className="link-arrow">
              {p.cta}
              <ArrowRight size={16} aria-hidden />
            </Link>
          }
        />
        <div className="reveal mt-12 lg:mt-14">
          <Rail label={p.label} layout="grid-lg">
            {blogPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </Rail>
        </div>
      </div>
    </section>
  );
}
