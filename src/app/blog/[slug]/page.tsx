import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts, getPostBySlug } from '@/lib/data';
import { SITE } from '@/lib/site';
import ArticleView from '@/components/blog/ArticleView';

// Statically generate one page per post.
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

type Params = { params: Promise<{ slug: string }> };

// Metadata uses the Italian (canonical) version — the site serves one set of
// URLs and Italian is the prerendered/canonical language for SEO.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const c = post.content.it;
  const url = `/blog/${post.slug}`;
  return {
    title: c.title,
    description: c.metaDescription,
    keywords: c.keywords,
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: c.title,
      description: c.metaDescription,
      url,
      publishedTime: post.dateISO,
      modifiedTime: post.dateISO,
      authors: [post.author],
      images: [{ url: post.image, alt: c.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: c.title,
      description: c.metaDescription,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const c = post.content.it;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE.url}/blog/${post.slug}#article`,
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
    headline: c.title,
    description: c.metaDescription,
    image: post.image,
    inLanguage: 'it-IT',
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    articleSection: c.category,
    keywords: c.keywords.join(', '),
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.png` },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleView post={post} related={related} />
    </>
  );
}
