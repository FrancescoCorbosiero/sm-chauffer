export const SITE = {
  name: 'Chauffeur SK Luxury Milano',
  // Registered sole proprietor (ditta individuale) behind the brand.
  legalName: 'Sikora Maksym',
  url: 'https://chauffeurskmilano.it',
  // Primary, branded address: the `mailto:` target for the forms and the
  // `email` used in JSON-LD. Shown publicly in the footer and contact page.
  email: 'info@chauffeurskmilano.it',
  // Second public contact address, also shown in the footer and contact page,
  // and the owner inbox bookings are forwarded to.
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
  // Real registered identity (Agenzia delle Entrate).
  vatNumber: '12269970963',
  taxCode: 'SKRMSY88R20Z138H',
  // Codice Destinatario for electronic invoicing (SDI).
  sdiCode: 'T9K4ZHO',
  // Full legal/registered address — used in the legal pages and JSON-LD.
  legalAddress: {
    street: 'Viale Umbria 19',
    postalCode: '20811',
    locality: 'Cesano Maderno',
    province: 'MB',
    region: 'Lombardia',
    country: 'IT',
  },
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
