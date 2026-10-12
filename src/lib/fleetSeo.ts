/**
 * Italian SEO copy for the /fleet/[id] pages (the site prerenders Italian
 * metadata, like the /ncc and /services routes). Server-only usage.
 */
export const VEHICLE_SEO: Record<string, { title: string; description: string; keywords: string[] }> = {
  'mercedes-s-class': {
    title: 'Mercedes Classe S con autista a Milano',
    description:
      'Noleggio con conducente in Mercedes Classe S, l’ammiraglia per business, ospiti VIP ed eventi a Milano, in Brianza e sul Lago di Como. Da 140 €/h, attivi 24/7.',
    keywords: ['Mercedes Classe S con autista', 'noleggio Classe S con conducente', 'auto di lusso con autista Milano', 'NCC Classe S'],
  },
  'mercedes-e-class': {
    title: 'Mercedes Classe E con autista a Milano',
    description:
      'Mercedes Classe E con autista per transfer aeroportuali e spostamenti business a Milano, in Brianza e sul Lago di Como. Da 70 €/h, fino a 3 passeggeri.',
    keywords: ['Mercedes Classe E con autista', 'noleggio Classe E con conducente', 'transfer Malpensa Classe E', 'NCC Milano berlina'],
  },
  'mercedes-v-class': {
    title: 'Mercedes Classe V con autista — fino a 7 posti',
    description:
      'Van di lusso Mercedes Classe V con autista per famiglie e gruppi fino a 7 persone: transfer Malpensa e Linate, tour del Lago di Como. Da 80 €/h.',
    keywords: ['Mercedes Classe V con autista', 'van 7 posti con autista', 'transfer gruppi Malpensa', 'NCC van Milano'],
  },
  'range-rover': {
    title: 'Range Rover con autista a Milano e sul Lago di Como',
    description:
      'SUV di lusso Range Rover con autista per eventi, matrimoni e viaggi verso la Svizzera e le località alpine. Da 150 €/h, fino a 4 passeggeri.',
    keywords: ['Range Rover con autista', 'SUV di lusso con autista', 'transfer St. Moritz Range Rover', 'auto matrimonio Range Rover'],
  },
  'bus-18': {
    title: 'Minibus 18 posti con autista per gruppi',
    description:
      'Minibus da 18 posti con autista per gruppi, congressi, eventi aziendali e matrimoni a Milano, in Brianza e sul Lago di Como. Preventivo su misura.',
    keywords: ['minibus 18 posti con autista', 'noleggio minibus con conducente', 'bus per gruppi Milano', 'navetta eventi'],
  },
};
