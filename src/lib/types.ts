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

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
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
