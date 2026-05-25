import { Vehicle, Service, Testimonial, BlogPost } from './types';
import { IMAGES } from './images';

export const vehicles: Vehicle[] = [
  {
    id: 'placeholder-1',
    name: 'Auto 1',
    category: 'berlina',
    pricePerHour: 0,
    pricePerKm: 0,
    passengers: 3,
    bags: 2,
    image: IMAGES.fleet.one,
  },
  {
    id: 'placeholder-2',
    name: 'Auto 2',
    category: 'berlina',
    pricePerHour: 0,
    pricePerKm: 0,
    passengers: 3,
    bags: 3,
    image: IMAGES.fleet.two,
  },
  {
    id: 'placeholder-3',
    name: 'Auto 3',
    category: 'suv',
    pricePerHour: 0,
    pricePerKm: 0,
    passengers: 4,
    bags: 4,
    image: IMAGES.fleet.three,
  },
  {
    id: 'placeholder-4',
    name: 'Auto 4',
    category: 'van',
    pricePerHour: 0,
    pricePerKm: 0,
    passengers: 6,
    bags: 5,
    image: IMAGES.fleet.four,
  },
  {
    id: 'placeholder-5',
    name: 'Auto 5',
    category: 'van',
    pricePerHour: 0,
    pricePerKm: 0,
    passengers: 7,
    bags: 7,
    image: IMAGES.fleet.five,
  },
];

export const services: Service[] = [
  { id: 'airport-transfer', icon: 'Plane', image: IMAGES.services.airportTransfer },
  { id: 'autista-milano', icon: 'MapPin', image: IMAGES.services.autistaMilano },
  { id: 'autista-brianza', icon: 'Building2', image: IMAGES.services.autistaBrianza },
  { id: 'tour-privati', icon: 'Route', image: IMAGES.services.tourPrivati },
  { id: 'trasferimenti-internazionali', icon: 'Globe', image: IMAGES.services.trasferimentiInternazionali },
  { id: 'minibus-gruppi', icon: 'Users', image: IMAGES.services.minibusGruppi },
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
    excerpt: "Tutto quello che devi sapere per organizzare un transfer di lusso dall'Aeroporto di Malpensa verso Milano, la Brianza e le destinazioni del Lago di Como.",
    category: 'Guida',
    date: '15 Aprile 2025',
    image: IMAGES.blog.malpensa,
  },
  {
    id: '2',
    slug: 'milano-lago-como-autista',
    title: 'Da Milano al Lago di Como con Autista Privato: Bellagio e Tremezzo',
    excerpt: "Un itinerario esclusivo per scoprire le ville liberty di Bellagio, i giardini di Tremezzo e le acque cristalline del Lago di Como a bordo di un'auto di lusso.",
    category: 'Destinazione',
    date: '28 Marzo 2025',
    image: IMAGES.blog.como,
  },
  {
    id: '3',
    slug: 'fashion-week-autista-privato',
    title: 'Perché i Professionisti della Milano Fashion Week Si Affidano agli Autisti Privati',
    excerpt: 'Durante la Fashion Week milanese, tempo e immagine sono tutto. Scopri perché i top buyer, gli stilisti e i giornalisti scelgono il noleggio con autista.',
    category: 'Lifestyle',
    date: '10 Febbraio 2025',
    image: IMAGES.blog.fashion,
  },
  {
    id: '4',
    slug: 'malpensa-sankt-moritz',
    title: 'Da Milano a Sankt Moritz con Autista Privato',
    excerpt: 'Il trasferimento più richiesto dalle destinazioni alpine. Come organizzare il viaggio perfetto verso le nevi svizzere partendo da Milano o dalla Brianza.',
    category: 'Viaggio',
    date: '5 Gennaio 2025',
    image: IMAGES.blog.moritz,
  },
];
