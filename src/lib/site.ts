export const SITE = {
  name: 'SM Luxury Chauffer',
  legalName: 'SM Luxury Chauffer',
  url: 'https://smchauffer.it',
  email: 'info@smchauffer.it',
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

export const SERVICE_ZONES = ['Milano', 'Como', 'Bellagio', 'Tremezzo'] as const;

export const AREAS_SERVED = [
  'Milano',
  'Como',
  'Bellagio',
  'Tremezzo',
  'Lago di Como',
  'Cernobbio',
  'Menaggio',
  'Varenna',
  'Lombardia',
  'Malpensa',
  'Linate',
  'Orio al Serio',
  'Lugano',
] as const;
