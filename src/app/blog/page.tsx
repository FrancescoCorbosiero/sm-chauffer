'use client';
import { blogPosts } from '@/lib/data';
import BlogCard from '@/components/ui/BlogCard';
import PageHero from '@/components/ui/PageHero';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useTranslation } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';

export default function BlogPage() {
  const t = useTranslation();
  usePageTitle(t.meta.blog.title, t.meta.blog.description);

  return (
    <>
      <PageHero
        label={t.blogPage.label}
        title={t.blogPage.title}
        description={t.blogPage.description}
        image="https://picsum.photos/seed/blog-luxury-cover/1920/900"
      />
      <section className="py-20 md:py-24 bg-white">
        <div className="container-x">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogPosts.map((p, i) => (
              <ScrollReveal key={p.id} delay={(i % 3) * 0.08}>
                <BlogCard post={p} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
