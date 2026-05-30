import { IMAGES } from '../images';
import type { BlogContent, BlogPost } from '../types';
import { LOCALES, type Locale } from '@/i18n/types';
import { it } from './it';
import { en } from './en';
import { es } from './es';
import { de } from './de';
import { fr } from './fr';
import { sq } from './sq';
import { ru } from './ru';

const localeContent: Record<Locale, Record<string, BlogContent>> = {
  it,
  en,
  es,
  de,
  fr,
  sq,
  ru,
};

interface PostMeta {
  id: string;
  slug: string;
  dateISO: string;
  author: string;
  readingMinutes: number;
  image: string;
}

// Order here is the order shown in the blog list. Italian is canonical.
const POSTS: PostMeta[] = [
  { id: '1', slug: 'guida-transfer-lusso-malpensa', dateISO: '2025-04-15', author: 'Maksym Sikora', readingMinutes: 6, image: IMAGES.blog.malpensa },
  { id: '2', slug: 'milano-lago-como-autista', dateISO: '2025-03-28', author: 'Maksym Sikora', readingMinutes: 7, image: IMAGES.blog.como },
  { id: '3', slug: 'fashion-week-autista-privato', dateISO: '2025-02-10', author: 'Maksym Sikora', readingMinutes: 5, image: IMAGES.blog.fashion },
  { id: '4', slug: 'malpensa-sankt-moritz', dateISO: '2025-01-05', author: 'Maksym Sikora', readingMinutes: 6, image: IMAGES.blog.moritz },
];

export const blogPosts: BlogPost[] = POSTS.map((m) => ({
  ...m,
  content: Object.fromEntries(LOCALES.map((l) => [l, localeContent[l][m.slug]])) as Record<
    Locale,
    BlogContent
  >,
}));

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
