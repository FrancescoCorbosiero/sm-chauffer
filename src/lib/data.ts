import { Vehicle, Service, Testimonial } from './types';
import { IMAGES } from './images';

// The customer's confirmed fleet. `id` matches the localized copy in
// src/i18n/dictionaries/*.ts (t.vehicles[id]); `pricePerHour` is the quoted
// hourly rate. The 18-seat bus is quoted on request (priceOnRequest).
export const vehicles: Vehicle[] = [
  {
    id: 'mercedes-s-class',
    name: 'Mercedes Classe S',
    category: 'berlina',
    pricePerHour: 140,
    pricePerKm: 0,
    passengers: 3,
    bags: 3,
    image: IMAGES.fleet.sClass,
  },
  {
    id: 'mercedes-e-class',
    name: 'Mercedes Classe E',
    category: 'berlina',
    pricePerHour: 70,
    pricePerKm: 0,
    passengers: 3,
    bags: 3,
    image: IMAGES.fleet.eClass,
  },
  {
    id: 'mercedes-v-class',
    name: 'Mercedes Classe V',
    category: 'van',
    pricePerHour: 80,
    pricePerKm: 0,
    passengers: 7,
    bags: 7,
    image: IMAGES.fleet.vClass,
  },
  {
    id: 'range-rover',
    name: 'Range Rover',
    category: 'suv',
    pricePerHour: 150,
    pricePerKm: 0,
    passengers: 4,
    bags: 4,
    image: IMAGES.fleet.rangeRover,
  },
  {
    id: 'bus-18',
    name: 'Bus 18 Posti',
    category: 'bus',
    pricePerHour: 0,
    pricePerKm: 0,
    priceOnRequest: true,
    passengers: 18,
    bags: 18,
    image: IMAGES.fleet.bus18,
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


export { blogPosts, getPostBySlug } from './blog';
