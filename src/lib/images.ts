/**
 * Centralised image references. All photos are hosted on Unsplash CDN and
 * can be swapped by replacing the photo ID portion. The format is:
 *   https://images.unsplash.com/photo-<ID>?<query params>
 *
 * To replace an image: open https://unsplash.com/it/s/foto/<keyword>,
 * pick a photo, click "Share → Image URL" and replace the ID below.
 */

const u = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  // Main homepage hero — dark/cinematic luxury Mercedes S-Class at night
  hero: u('1555215695-3004980ad54e', 1920),

  // Page heroes (top of internal pages)
  pageHeroes: {
    fleet: u('1492144534655-ae79c964c9d7', 1920),
    services: u('1605559424843-9e4c228bf1c2', 1920),
    about: u('1494976388531-d1058494cdd8', 1920),
    blog: u('1583121274602-3e2820c69888', 1920),
    contact: u('1606664515524-ed2f786a0bd6', 1920),
  },

  // Fleet vehicle photos
  fleet: {
    one: u('1606664515524-ed2f786a0bd6', 1200),
    two: u('1583121274602-3e2820c69888', 1200),
    three: u('1494976388531-d1058494cdd8', 1200),
    four: u('1551836022-deb4988cc6c0', 1200),
    five: u('1502877338535-766e1452684a', 1200),
  },

  // Service block photos
  services: {
    airportTransfer: u('1436491865332-7a61a109cc05', 1200),
    autistaMilano: u('1518730518541-d0843268c287', 1200),
    autistaBrianza: u('1525874684015-58379d421a52', 1200),
    tourPrivati: u('1572799454088-1f4ad8e3eaca', 1200),
    trasferimentiInternazionali: u('1500627964684-141351970a7f', 1200),
    minibusGruppi: u('1606664890085-5ea3eed02e8b', 1200),
  },

  // Blog post cover images
  blog: {
    malpensa: u('1436491865332-7a61a109cc05', 1200),
    como: u('1572799454088-1f4ad8e3eaca', 1200),
    fashion: u('1518730518541-d0843268c287', 1200),
    moritz: u('1551524559-8af4e6624178', 1200),
  },
} as const;
