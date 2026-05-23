import { Vehicle, Service, Testimonial, BlogPost } from './types';

export const vehicles: Vehicle[] = [
  {
    id: 'placeholder-1',
    name: 'Auto 1',
    category: 'berlina',
    pricePerHour: 0,
    pricePerKm: 0,
    passengers: 3,
    bags: 2,
    image: 'https://picsum.photos/seed/placeholder-car-1/800/500',
  },
  {
    id: 'placeholder-2',
    name: 'Auto 2',
    category: 'berlina',
    pricePerHour: 0,
    pricePerKm: 0,
    passengers: 3,
    bags: 3,
    image: 'https://picsum.photos/seed/placeholder-car-2/800/500',
  },
  {
    id: 'placeholder-3',
    name: 'Auto 3',
    category: 'suv',
    pricePerHour: 0,
    pricePerKm: 0,
    passengers: 4,
    bags: 4,
    image: 'https://picsum.photos/seed/placeholder-car-3/800/500',
  },
  {
    id: 'placeholder-4',
    name: 'Auto 4',
    category: 'van',
    pricePerHour: 0,
    pricePerKm: 0,
    passengers: 6,
    bags: 5,
    image: 'https://picsum.photos/seed/placeholder-car-4/800/500',
  },
  {
    id: 'placeholder-5',
    name: 'Auto 5',
    category: 'van',
    pricePerHour: 0,
    pricePerKm: 0,
    passengers: 7,
    bags: 7,
    image: 'https://picsum.photos/seed/placeholder-car-5/800/500',
  },
];

export const services: Service[] = [
  { id: 'airport-transfer', icon: 'Plane', image: 'https://picsum.photos/seed/airport-transfer-luxury/700/500' },
  { id: 'autista-milano', icon: 'MapPin', image: 'https://picsum.photos/seed/milan-luxury-driver/700/500' },
  { id: 'autista-roma', icon: 'Building2', image: 'https://picsum.photos/seed/rome-luxury-car/700/500' },
  { id: 'tour-privati', icon: 'Route', image: 'https://picsum.photos/seed/italy-tour-luxury/700/500' },
  { id: 'trasferimenti-internazionali', icon: 'Globe', image: 'https://picsum.photos/seed/europe-transfer-luxury/700/500' },
  { id: 'minibus-gruppi', icon: 'Users', image: 'https://picsum.photos/seed/minibus-group-transfer/700/500' },
];

export const testimonials: Testimonial[] = [
  { id: '1', name: 'Marco Ferretti', rating: 5, source: 'Google' },
  { id: '2', name: 'Sophie Laurent', rating: 5, source: 'Google' },
  { id: '3', name: 'Alessandro Ricci', rating: 5, source: 'Google' },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'guida-transfer-lusso-malpensa',
    title: 'La Guida Definitiva ai Transfer di Lusso a Malpensa',
    excerpt: "Tutto quello che devi sapere per organizzare un transfer di lusso dall'Aeroporto di Malpensa verso Milano e le principali destinazioni lombarde.",
    category: 'Guida',
    date: '15 Aprile 2025',
    image: 'https://picsum.photos/seed/malpensa-airport-guide/600/400',
  },
  {
    id: '2',
    slug: 'milano-lago-como-autista',
    title: 'Da Milano al Lago di Como con Autista Privato: La Gita Perfetta',
    excerpt: "Un itinerario esclusivo per scoprire le ville liberty, i borghi pittoreschi e le acque cristalline del Lago di Como a bordo di un'auto di lusso.",
    category: 'Destinazione',
    date: '28 Marzo 2025',
    image: 'https://picsum.photos/seed/lake-como-villa/600/400',
  },
  {
    id: '3',
    slug: 'fashion-week-autista-privato',
    title: 'Perché i Professionisti della Milano Fashion Week Si Affidano agli Autisti Privati',
    excerpt: 'Durante la Fashion Week milanese, tempo e immagine sono tutto. Scopri perché i top buyer, gli stilisti e i giornalisti scelgono il noleggio con autista.',
    category: 'Lifestyle',
    date: '10 Febbraio 2025',
    image: 'https://picsum.photos/seed/milan-fashion-luxury/600/400',
  },
  {
    id: '4',
    slug: 'malpensa-sankt-moritz',
    title: 'Da Malpensa a Sankt Moritz con Autista Privato',
    excerpt: 'Il trasferimento più richiesto dalle destinazioni alpine. Come organizzare il viaggio perfetto verso le nevi svizzere dalla Lombardia.',
    category: 'Viaggio',
    date: '5 Gennaio 2025',
    image: 'https://picsum.photos/seed/alpine-road-winter/600/400',
  },

];
