import type { Locale } from '@/i18n/types';

export type VehicleCategory = 'berlina' | 'van' | 'suv' | 'bus';

export interface Vehicle {
  id: string;
  name: string;
  category: VehicleCategory;
  pricePerHour: number;
  pricePerKm: number;
  passengers: number;
  bags: number;
  image: string;
  /** When true the price is quoted on request (e.g. the 18-seat bus). */
  priceOnRequest?: boolean;
}

export interface Service {
  id: string;
  icon: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  source: string;
}

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string };

/** The localizable part of a blog post. */
export interface BlogContent {
  title: string;
  excerpt: string;
  /** SEO meta description (≈150–160 chars). */
  metaDescription: string;
  category: string;
  /** Human display date, localized, e.g. "15 Aprile 2025". */
  date: string;
  keywords: string[];
  body: BlogBlock[];
}

export interface BlogPost {
  id: string;
  slug: string;
  /** ISO date for <time> and structured data, e.g. "2025-04-15". */
  dateISO: string;
  author: string;
  readingMinutes: number;
  image: string;
  /** Per-locale content; Italian (DEFAULT_LOCALE) is the canonical version. */
  content: Record<Locale, BlogContent>;
}

export interface LocalizedVehicle extends Vehicle {
  badge?: string;
  description: string;
  categoryLabel: string;
}

export interface LocalizedService extends Service {
  title: string;
  description: string;
  longDescription: string;
}

export interface LocalizedTestimonial extends Testimonial {
  text: string;
}
