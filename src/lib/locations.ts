import { IMAGES } from './images';

/**
 * City/area landing pages — dedicated, separately-indexable pages that target
 * the local search intent ("NCC Milano", "autista Monza", "NCC Como", …) that a
 * single /services page can't rank for. Italian is the canonical SEO language,
 * matching the blog and the prerendered metadata strategy.
 *
 * Each entry carries genuinely city-specific copy (routes, landmarks, use
 * cases) — these are real landing pages, not near-duplicate doorway pages.
 */
export interface LocationHighlight {
  title: string;
  description: string;
}

export interface LocationFaq {
  q: string;
  a: string;
}

export interface Location {
  slug: string;
  /** Display name of the city/area, e.g. "Milano". */
  city: string;
  /** schema.org areaServed names for this page's Service JSON-LD. */
  areaServed: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroLabel: string;
  /** The page H1. */
  heroTitle: string;
  heroDescription: string;
  image: string;
  /** Lead paragraphs (rendered as <p>). */
  intro: string[];
  /** "Why here" cards. */
  highlights: LocationHighlight[];
  /** Popular routes / destinations served from this city. */
  routes: string[];
  faq: LocationFaq[];
  /** Slugs of the matching English/German landing pages, for cross-linking. */
  intl?: { en: string; de: string };
}

export const locations: Location[] = [
  {
    slug: 'milano',
    city: 'Milano',
    areaServed: ['Milano', 'Città Metropolitana di Milano', 'Lombardia'],
    metaTitle: 'NCC Milano — Autista Privato e Noleggio con Conducente',
    metaDescription:
      'Servizio NCC a Milano con autista privato: transfer Malpensa e Linate, business, Fashion Week ed eventi. Mercedes, BMW e Range Rover, disponibili 24/7.',
    keywords: [
      'NCC Milano',
      'autista privato Milano',
      'noleggio con conducente Milano',
      'chauffeur Milano',
      'transfer Malpensa Milano',
      'autista Fashion Week Milano',
      'auto con autista Milano',
    ],
    heroLabel: 'NCC Milano',
    heroTitle: 'NCC e Autista Privato a Milano',
    heroDescription:
      'Noleggio con conducente di lusso a Milano: transfer aeroportuali, spostamenti business e servizio dedicato per eventi e moda, con autisti professionisti e una flotta premium.',
    image: IMAGES.services.autistaMilano,
    intro: [
      'Muoversi a Milano richiede puntualità, discrezione e una conoscenza reale della città. Il nostro servizio di Noleggio Con Conducente (NCC) a Milano mette a disposizione autisti professionisti e una flotta di vetture di rappresentanza per ogni esigenza: dal transfer aeroportuale al servizio business a ore, fino agli eventi della Milano Fashion Week e del Salone del Mobile.',
      'Operiamo in tutta la città e nell’hinterland — dal centro e dal Quadrilatero della Moda a CityLife, Porta Nuova, Fiera Milano Rho e i poli congressuali — con tariffe trasparenti e disponibilità 24 ore su 24. Ogni corsa è prenotabile in anticipo con conducente assegnato, così sai sempre chi ti accompagna.',
    ],
    highlights: [
      {
        title: 'Transfer aeroportuali',
        description:
          'Collegamenti dedicati con Malpensa, Linate e Orio al Serio, con monitoraggio del volo e attesa inclusa in caso di ritardo.',
      },
      {
        title: 'Business e congressi',
        description:
          'Servizio a ore per riunioni, fiere e appuntamenti in città, con autista a disposizione e massima riservatezza.',
      },
      {
        title: 'Moda ed eventi',
        description:
          'Vetture e autisti dedicati per Fashion Week, sfilate, cene di gala e serate, con coordinamento sugli orari.',
      },
    ],
    routes: [
      'Milano centro → Aeroporto di Malpensa (MXP)',
      'Milano → Aeroporto di Linate (LIN)',
      'Milano → Aeroporto di Bergamo Orio al Serio (BGY)',
      'Milano → Fiera Milano Rho',
      'Milano → Lago di Como, Bellagio e Cernobbio',
      'Milano → Monza, Villa Reale e Autodromo',
    ],
    faq: [
      {
        q: 'Quanto costa un NCC da Milano a Malpensa?',
        a: 'Il transfer da Milano a Malpensa ha una tariffa fissa concordata in fase di prenotazione, senza sorprese sul tassametro. Contattaci con orario e numero di passeggeri per un preventivo immediato.',
      },
      {
        q: 'Posso prenotare un autista a ore a Milano?',
        a: 'Sì. Offriamo il servizio a disposizione a ore, ideale per riunioni, shopping, fiere ed eventi: l’autista resta a tua disposizione per la durata concordata.',
      },
      {
        q: 'Il servizio NCC a Milano è disponibile di notte?',
        a: 'Sì, siamo operativi 24 ore su 24, voli notturni e trasferimenti early morning compresi. Consigliamo di prenotare in anticipo per garantire la vettura.',
      },
    ],
    intl: { en: 'chauffeur-service-milan', de: 'chauffeur-service-mailand' },
  },
  {
    slug: 'monza',
    city: 'Monza',
    areaServed: ['Monza', 'Monza e Brianza', 'Lombardia'],
    metaTitle: 'NCC Monza — Autista Privato e Noleggio con Conducente',
    metaDescription:
      'NCC a Monza con autista privato: transfer aeroporti, Autodromo e Gran Premio, Villa Reale, business ed eventi. Flotta di lusso, servizio 24/7.',
    keywords: [
      'NCC Monza',
      'autista privato Monza',
      'noleggio con conducente Monza',
      'autista Autodromo Monza',
      'transfer Monza Malpensa',
      'NCC Gran Premio Monza',
    ],
    heroLabel: 'NCC Monza',
    heroTitle: 'NCC e Autista Privato a Monza',
    heroDescription:
      'Noleggio con conducente a Monza per transfer, business ed eventi: dal Gran Premio all’Autodromo Nazionale fino alla Villa Reale, con autisti del territorio e vetture premium.',
    image: IMAGES.services.autistaBrianza,
    intro: [
      'A Monza il nostro servizio NCC unisce la conoscenza del territorio brianzolo a una flotta di rappresentanza. Accompagniamo clienti privati e aziende per transfer aeroportuali, spostamenti business verso Milano e l’hinterland, ed eventi che animano la città — dal Gran Premio d’Italia all’Autodromo Nazionale di Monza fino alle manifestazioni nel Parco e alla Villa Reale.',
      'Prenotando in anticipo hai un autista dedicato che conosce le strade locali e gli accessi nei giorni di evento, quando il traffico attorno all’Autodromo richiede esperienza. Tariffe chiare, vetture sempre in ordine e disponibilità 24/7.',
    ],
    highlights: [
      {
        title: 'Gran Premio e Autodromo',
        description:
          'Trasferimenti dedicati nei weekend di gara, con gestione degli accessi e degli orari attorno all’Autodromo Nazionale di Monza.',
      },
      {
        title: 'Aeroporti e business',
        description:
          'Collegamenti rapidi con Malpensa, Linate e Orio al Serio e servizio a ore per le aziende della Brianza.',
      },
      {
        title: 'Eventi e cerimonie',
        description:
          'Vetture per matrimoni, ricevimenti in Villa Reale e occasioni speciali, con autista in abito formale.',
      },
    ],
    routes: [
      'Monza → Aeroporto di Malpensa (MXP)',
      'Monza → Aeroporto di Linate (LIN)',
      'Monza → Aeroporto di Orio al Serio (BGY)',
      'Monza → Milano centro e Fiera Rho',
      'Monza → Autodromo Nazionale e Parco di Monza',
      'Monza → Lago di Como e Bellagio',
    ],
    faq: [
      {
        q: 'Offrite NCC per il Gran Premio di Monza?',
        a: 'Sì. Nei giorni del Gran Premio d’Italia gestiamo transfer da e per l’Autodromo, hotel e aeroporti, con orari coordinati per evitare le code. Consigliamo di prenotare con largo anticipo.',
      },
      {
        q: 'Quanto dista Monza dall’aeroporto di Malpensa?',
        a: 'Monza dista circa 60 km da Malpensa, con un tempo medio di percorrenza di un’ora salvo traffico. Il transfer è a tariffa fissa concordata in prenotazione.',
      },
      {
        q: 'Servite anche la Villa Reale e gli eventi privati?',
        a: 'Sì, copriamo cerimonie e ricevimenti alla Villa Reale di Monza e nelle ville della Brianza, con vetture e autisti dedicati per l’intera durata dell’evento.',
      },
    ],
  },
  {
    slug: 'brianza',
    city: 'Brianza',
    areaServed: ['Monza e Brianza', 'Brianza', 'Lombardia'],
    metaTitle: 'NCC Brianza — Autista Privato e Noleggio con Conducente',
    metaDescription:
      'NCC in Brianza con autista privato: transfer aeroporti, servizio business per le aziende del distretto, eventi e collegamenti con Milano e il Lago di Como. 24/7.',
    keywords: [
      'NCC Brianza',
      'autista privato Brianza',
      'noleggio con conducente Brianza',
      'transfer Brianza Malpensa',
      'autista aziende Brianza',
      'NCC Monza e Brianza',
    ],
    heroLabel: 'NCC Brianza',
    heroTitle: 'NCC e Autista Privato in Brianza',
    heroDescription:
      'Noleggio con conducente in tutta la Brianza: un servizio pensato per le aziende del distretto, i transfer aeroportuali e i collegamenti con Milano e il Lago di Como.',
    image: IMAGES.services.autistaBrianza,
    intro: [
      'La Brianza è un territorio di imprese, design e ville storiche: il nostro NCC risponde alle esigenze di chi qui lavora e riceve clienti. Serviamo i centri del distretto — da Seregno e Desio a Lissone, Carate, Meda e Cantù — con transfer aeroportuali, servizio business a ore e collegamenti puntuali verso Milano, Como e gli aeroporti lombardi.',
      'Per le aziende offriamo continuità di servizio e fatturazione dedicata; per i privati, vetture di rappresentanza con autista per cerimonie, eventi e spostamenti riservati. La conoscenza capillare delle strade brianzole assicura tempi certi anche fuori dai grandi assi autostradali.',
    ],
    highlights: [
      {
        title: 'Servizio aziende',
        description:
          'Trasferte, accoglienza clienti e servizio a ore per le imprese del distretto del mobile e del design.',
      },
      {
        title: 'Transfer aeroportuali',
        description:
          'Collegamenti con Malpensa, Linate e Orio al Serio da tutti i comuni della Brianza, con monitoraggio voli.',
      },
      {
        title: 'Eventi e ville',
        description:
          'Vetture per matrimoni e ricevimenti nelle ville storiche brianzole, con autista dedicato.',
      },
    ],
    routes: [
      'Brianza → Aeroporto di Malpensa (MXP)',
      'Brianza → Aeroporto di Linate (LIN)',
      'Brianza → Aeroporto di Orio al Serio (BGY)',
      'Brianza → Milano centro e Fiera Rho',
      'Brianza → Lago di Como, Bellagio e Cernobbio',
      'Brianza → Lugano e Svizzera',
    ],
    faq: [
      {
        q: 'Coprite tutti i comuni della Brianza?',
        a: 'Sì, operiamo in tutta la Monza e Brianza — da Seregno, Desio e Lissone a Carate, Meda, Cantù e i centri limitrofi — con prelievo all’indirizzo indicato.',
      },
      {
        q: 'Avete un servizio NCC dedicato alle aziende?',
        a: 'Sì. Offriamo continuità di servizio, autisti riservati e fatturazione dedicata per le imprese della Brianza, con possibilità di accordi su corse ricorrenti.',
      },
      {
        q: 'Posso prenotare un transfer dalla Brianza al Lago di Como?',
        a: 'Certamente. Organizziamo transfer e tour verso il Lago di Como, Bellagio, Cernobbio e Tremezzo, con autista a disposizione per l’intera giornata se desiderato.',
      },
    ],
  },
  {
    slug: 'como',
    city: 'Como',
    areaServed: ['Como', 'Lago di Como', 'Bellagio', 'Cernobbio', 'Tremezzo', 'Lombardia'],
    metaTitle: 'NCC Como e Lago di Como — Autista Privato di Lusso',
    metaDescription:
      'NCC a Como e sul Lago di Como con autista privato: transfer, tour di Bellagio, Cernobbio e Tremezzo, matrimoni e Villa d’Este. Flotta di lusso, servizio 24/7.',
    keywords: [
      'NCC Como',
      'autista privato Como',
      'autista Lago di Como',
      'noleggio con conducente Como',
      'tour Lago di Como con autista',
      'transfer Como Malpensa',
      'auto matrimonio Como',
    ],
    heroLabel: 'NCC Como',
    heroTitle: 'NCC e Autista Privato a Como e sul Lago',
    heroDescription:
      'Noleggio con conducente a Como e sul Lago di Como: transfer dagli aeroporti, tour privati tra Bellagio, Cernobbio e Tremezzo, matrimoni ed eventi nelle ville storiche.',
    image: IMAGES.blog.como,
    intro: [
      'Il Lago di Como è una delle mete più ambite al mondo, e merita un servizio all’altezza. Il nostro NCC a Como accompagna ospiti italiani e internazionali con transfer dagli aeroporti di Milano, tour privati del lago e servizio dedicato per matrimoni ed eventi nelle ville storiche, da Villa d’Este a Cernobbio fino a Villa Carlotta a Tremezzo.',
      'Autisti che parlano inglese e conoscono ogni tornante della Tremezzina e della sponda orientale rendono ogni spostamento sicuro e piacevole. Che si tratti di una giornata tra Bellagio e Varenna o di un transfer in arrivo da Malpensa, la vettura è sempre pronta, con tariffe concordate in anticipo.',
    ],
    highlights: [
      {
        title: 'Tour del lago',
        description:
          'Itinerari privati tra Bellagio, Cernobbio, Tremezzo e Varenna, con soste fotografiche e autista a disposizione.',
      },
      {
        title: 'Matrimoni ed eventi',
        description:
          'Servizio per cerimonie nelle ville del lago — Villa d’Este, Villa Erba, Villa Carlotta — con vetture in ordine impeccabile.',
      },
      {
        title: 'Transfer internazionali',
        description:
          'Collegamenti con Malpensa, Linate, Orio al Serio e Lugano, con accoglienza in arrivo e autista English speaking.',
      },
    ],
    routes: [
      'Aeroporto di Malpensa (MXP) → Como e Cernobbio',
      'Como → Bellagio, Tremezzo e Varenna',
      'Como → Lugano e Svizzera',
      'Milano → Lago di Como (transfer e tour giornaliero)',
      'Como → Villa d’Este e Villa Carlotta',
      'Como → Aeroporto di Linate (LIN)',
    ],
    faq: [
      {
        q: 'Organizzate tour privati del Lago di Como?',
        a: 'Sì. Proponiamo tour giornalieri con autista tra Bellagio, Cernobbio, Tremezzo e Varenna, personalizzabili su soste, pranzi e visite alle ville.',
      },
      {
        q: 'Fate servizio per matrimoni sul Lago di Como?',
        a: 'Sì, siamo specializzati in matrimoni ed eventi nelle ville del lago, con vetture di rappresentanza e autisti in abito formale per gli sposi e gli ospiti.',
      },
      {
        q: 'Gli autisti parlano inglese?',
        a: 'Sì, i nostri autisti parlano inglese fluente, un requisito essenziale per accogliere la clientela internazionale che sceglie il Lago di Como.',
      },
    ],
    intl: { en: 'lake-como-private-driver', de: 'chauffeur-comer-see' },
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}
