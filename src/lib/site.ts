export const SITE = {
  name: 'Chauffeur SK Luxury Milano',
  legalName: 'Chauffeur SK Luxury Milano',
  url: 'https://chauffeurskmilano.it',
  // Public, branded address used everywhere (contact page, footer, JSON-LD)
  // and as the `mailto:` target for the booking/contact forms. Bookings are
  // routed to the external inbox below via a forwarding rule set in the domain
  // webmail (info@ → emailBackend) — no backend/SES involved. See DEPLOYMENT.md.
  email: 'info@chauffeurskmilano.it',
  // Where bookings should ultimately land (external owner inbox). Configure the
  // webmail forwarding to this address; it is intentionally not exposed publicly.
  emailBackend: 'maksymnoleggio@gmail.com',
  phone: '+393286871152',
  phoneDisplay: '+39 328 687 1152',
  whatsapp: '393286871152',
  instagram: {
    handle: 'sikoramaxim',
    url: 'https://instagram.com/sikoramaxim',
  },
  address: {
    locality: 'Milano',
    region: 'Lombardia',
    country: 'IT',
  },
  geo: {
    latitude: 45.4642,
    longitude: 9.19,
  },
  founded: '2014',
  vatNumber: 'P.IVA in fase di registrazione',
  rating: { value: '5.0', count: '120' },
} as const;

export const SERVICE_ZONES = [
  'Milano',
  'Brianza',
  'Como',
  'Bellagio',
  'Tremezzo',
] as const;

export const AREAS_SERVED = [
  'Milano',
  'Monza',
  'Brianza',
  'Monza e Brianza',
  'Como',
  'Bellagio',
  'Tremezzo',
  'Lago di Como',
  'Cernobbio',
  'Menaggio',
  'Varenna',
  'Lecco',
  'Lombardia',
  'Malpensa',
  'Linate',
  'Orio al Serio',
  'Lugano',
] as const;
