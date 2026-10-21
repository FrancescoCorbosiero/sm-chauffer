/**
 * Every photo on the site, in one place. Two kinds of entries:
 *
 *  - Local files ('/fleet/…', '/services/…', '/blog/…') live in `public/`.
 *    To change one, overwrite the file and keep its name.
 *  - Unsplash photos, written as u('<photo id>', <width>). To use your own,
 *    upload it under `public/` (e.g. public/heroes/home.jpg) and replace the
 *    entry with its path: `hero: '/heroes/home.jpg',`.
 *
 * Sizes, crops and the pages each photo appears on: public/README.md.
 */

const u = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  // Home page header (/).
  hero: u('1555215695-3004980ad54e', 1920),

  // Headers of the inner pages that have a photo. The other pages (services,
  // pricing, areas, contact) use a plain dark header.
  pageHeroes: {
    // Same photo as the home header for now.
    fleet: u('1555215695-3004980ad54e', 1920),
    about: u('1494976388531-d1058494cdd8', 1920),
    blog: u('1583121274602-3e2820c69888', 1920),
  },

  // Cut-out car photos on white: fleet cards, /fleet/<id>, the booking
  // wizard, the price estimator and the fleet comparison table.
  fleet: {
    sClass: '/fleet/mercedes-s-class.jpg', // also the /about story image
    eClass: '/fleet/mercedes-e-class.jpg',
    vClass: '/fleet/mercedes-v-class.jpg',
    rangeRover: '/fleet/range-rover.jpg',
    bus18: '/fleet/bus-18.jpg',
  },

  // Header of each /services/<id> page and its tile/thumbnail in the service
  // lists. Some are reused by the SEO landing pages (src/lib/locations.ts,
  // src/lib/intlLandings.ts) and the /areas tiles.
  services: {
    airportTransfer: u('1436491865332-7a61a109cc05', 1200),
    autistaMilano: '/services/duomo-milano.jpg',
    autistaBrianza: '/services/duomo-monza.jpg',
    tourPrivati: u('1572799454088-1f4ad8e3eaca', 1200),
    trasferimentiInternazionali: u('1500627964684-141351970a7f', 1200),
    minibusGruppi: u('1606664890085-5ea3eed02e8b', 1200),
  },

  // Blog article covers (also their link-preview image).
  blog: {
    malpensa: u('1436491865332-7a61a109cc05', 1200), // same photo as airportTransfer
    como: '/blog/lago-di-como.jpg', // also /ncc/como, /areas and the Lake Como landings
    fashion: '/blog/milano-FW.jpg',
    moritz: u('1551524559-8af4e6624178', 1200),
  },
} as const;
