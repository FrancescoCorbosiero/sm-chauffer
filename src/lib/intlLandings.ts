import { IMAGES } from './images';

/**
 * International (English / German) SEO landing pages.
 *
 * The site's UI is translated client-side, so non-Italian content never
 * reaches the server HTML at a distinct URL and can't be indexed. These pages
 * are server-rendered, language-specific URLs (/en/..., /de/...) that target
 * the high-value, low-competition foreign queries ("Lake Como private driver",
 * "Milan airport transfer", "Chauffeur Comer See", …) — the international,
 * high-budget audience the local Italian competition tends to ignore.
 *
 * Pages that are translations of one another share a `group` and are linked via
 * reciprocal hreflang (en <-> de). `itHref` points to the closest Italian page
 * as a visible cross-link (not as hreflang, to keep clusters reciprocal).
 */
export type IntlLang = 'en' | 'de';

export interface IntlHighlight {
  title: string;
  description: string;
}

export interface IntlFaq {
  q: string;
  a: string;
}

export interface IntlLanding {
  lang: IntlLang;
  slug: string;
  /** Short, keyword-rich anchor text for internal links (footer, cross-links). */
  navLabel: string;
  /** Translation group — entries sharing it are hreflang alternates. */
  group: string;
  /** Closest Italian page, shown as a visible language cross-link. */
  itHref?: string;
  areaServed: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroLabel: string;
  heroTitle: string;
  heroDescription: string;
  image: string;
  intro: string[];
  highlights: IntlHighlight[];
  routes: string[];
  faq: IntlFaq[];
}

/** Per-language UI microcopy for the landing-page chrome. */
export const LANDING_UI: Record<
  IntlLang,
  {
    serviceEyebrow: string;
    serviceTitle: string;
    routesEyebrow: string;
    routesTitle: string;
    faqEyebrow: string;
    faqTitle: string;
    quoteCta: string;
    otherLangs: string;
    fleet: string;
    services: string;
    contact: string;
    langName: Record<'it' | 'en' | 'de', string>;
  }
> = {
  en: {
    serviceEyebrow: 'The service',
    serviceTitle: "What's included",
    routesEyebrow: 'Itineraries',
    routesTitle: 'Popular routes',
    faqEyebrow: 'FAQ',
    faqTitle: 'Frequently asked questions',
    quoteCta: 'Request a quote',
    otherLangs: 'Also available in',
    fleet: 'Our fleet',
    services: 'All services',
    contact: 'Contact',
    langName: { it: 'Italiano', en: 'English', de: 'Deutsch' },
  },
  de: {
    serviceEyebrow: 'Der Service',
    serviceTitle: 'Inklusivleistungen',
    routesEyebrow: 'Routen',
    routesTitle: 'Beliebte Strecken',
    faqEyebrow: 'FAQ',
    faqTitle: 'Häufige Fragen',
    quoteCta: 'Angebot anfordern',
    otherLangs: 'Auch verfügbar auf',
    fleet: 'Unsere Flotte',
    services: 'Alle Leistungen',
    contact: 'Kontakt',
    langName: { it: 'Italiano', en: 'English', de: 'Deutsch' },
  },
};

export const intlLandings: IntlLanding[] = [
  // ─── English ──────────────────────────────────────────────────────────
  {
    lang: 'en',
    slug: 'lake-como-private-driver',
    navLabel: 'Lake Como private driver',
    group: 'lake-como-driver',
    itHref: '/ncc/como',
    areaServed: ['Lake Como', 'Como', 'Bellagio', 'Cernobbio', 'Tremezzo', 'Lombardy'],
    metaTitle: 'Lake Como Private Driver & Chauffeur Service',
    metaDescription:
      'Private driver on Lake Como: airport transfers from Milan, full-day tours of Bellagio, Cernobbio and Varenna, weddings and events. English-speaking chauffeurs, luxury fleet, 24/7.',
    keywords: [
      'Lake Como private driver',
      'Lake Como chauffeur',
      'private driver Como',
      'Lake Como car service',
      'English speaking driver Lake Como',
      'Lake Como wedding car',
    ],
    heroLabel: 'Lake Como',
    heroTitle: 'Your Private Driver on Lake Como',
    heroDescription:
      'A discreet, English-speaking chauffeur for Lake Como — airport transfers from Milan, private lake tours and chauffeured days between Bellagio, Cernobbio and Varenna.',
    image: IMAGES.blog.como,
    intro: [
      'Lake Como is one of the most beautiful destinations in the world, and it deserves a service to match. Our private driver service gives international guests a discreet, English-speaking chauffeur, a luxury Mercedes, BMW or Range Rover, and a driver who knows every hairpin of the Tremezzina and the lake’s eastern shore.',
      'Whether you are arriving from Malpensa, planning a full day between Bellagio, Varenna and Cernobbio, or need elegant transport for a wedding at one of the historic villas, every journey is booked in advance with a fixed, agreed fare — no meters, no surprises.',
    ],
    highlights: [
      {
        title: 'Private lake tours',
        description:
          'Tailored full-day itineraries between Bellagio, Cernobbio, Tremezzo and Varenna, with photo stops and your driver on hand throughout.',
      },
      {
        title: 'Weddings & events',
        description:
          'Chauffeured cars for ceremonies at the lake’s landmark villas — Villa d’Este, Villa Erba, Villa Carlotta — with drivers in formal attire.',
      },
      {
        title: 'Airport transfers',
        description:
          'Door-to-door transfers from Malpensa, Linate, Bergamo and Lugano, with flight monitoring and a meet-and-greet on arrival.',
      },
    ],
    routes: [
      'Malpensa Airport (MXP) → Como & Cernobbio',
      'Milan city centre → Lake Como',
      'Como → Bellagio, Tremezzo & Varenna',
      'Lake Como → Lugano & Switzerland',
      'Como → Villa d’Este and Villa Carlotta',
      'Lake Como → Linate Airport (LIN)',
    ],
    faq: [
      {
        q: 'Do your drivers speak English?',
        a: 'Yes. All our chauffeurs speak fluent English — essential for the international guests who choose Lake Como — and know the lake roads and villas in detail.',
      },
      {
        q: 'Can I book a full-day private tour of Lake Como?',
        a: 'Absolutely. We offer chauffeured full-day tours between Bellagio, Cernobbio, Tremezzo and Varenna, customised around the stops, lunches and villa visits you prefer.',
      },
      {
        q: 'How much is a transfer from Malpensa to Lake Como?',
        a: 'Transfers are quoted as a fixed, agreed fare based on your pickup, destination and number of passengers — never a meter. Send us your flight details for an instant quote.',
      },
    ],
  },
  {
    lang: 'en',
    slug: 'milan-airport-transfer',
    navLabel: 'Milan airport transfer',
    group: 'milan-airport',
    itHref: '/ncc/milano',
    areaServed: ['Milan', 'Malpensa', 'Linate', 'Bergamo Orio al Serio', 'Lombardy'],
    metaTitle: 'Milan Airport Transfer — Malpensa, Linate, Bergamo',
    metaDescription:
      'Private Milan airport transfers with an English-speaking chauffeur: Malpensa, Linate and Bergamo Orio al Serio. Fixed fares, flight monitoring, meet-and-greet, 24/7.',
    keywords: [
      'Milan airport transfer',
      'Malpensa airport transfer',
      'Malpensa to Milan private transfer',
      'Linate airport transfer',
      'Milan chauffeur airport',
      'private transfer Milan airport',
    ],
    heroLabel: 'Airport transfer',
    heroTitle: 'Milan Airport Transfers, Done Properly',
    heroDescription:
      'Private transfers between Milan and Malpensa, Linate and Bergamo with an English-speaking chauffeur, fixed fares, flight monitoring and a meet-and-greet in arrivals.',
    image: IMAGES.services.airportTransfer,
    intro: [
      'Arriving in Milan should be effortless. Our private airport transfer service meets you in the arrivals hall with a name sign, helps with your luggage and takes you directly to your hotel, the city centre or Lake Como in a luxury Mercedes, BMW or Range Rover.',
      'We cover all three Milan-area airports — Malpensa, Linate and Bergamo Orio al Serio — with fixed fares agreed in advance and real-time flight monitoring, so a delayed or early landing is never a problem and the waiting time is included.',
    ],
    highlights: [
      {
        title: 'Meet & greet',
        description:
          'Your chauffeur waits in arrivals with a name sign after baggage claim — no searching the car park, no phone calls.',
      },
      {
        title: 'Flight monitoring',
        description:
          'We track your flight in real time and adjust the pickup automatically. No extra charge for flight delays.',
      },
      {
        title: 'Fixed fares',
        description:
          'Every transfer is quoted as a fixed, all-in price agreed before you travel — no meters and no surprises.',
      },
    ],
    routes: [
      'Malpensa Airport (MXP) → Milan city centre',
      'Malpensa (MXP) → Lake Como, Cernobbio & Bellagio',
      'Linate Airport (LIN) → Milan & Monza',
      'Bergamo Orio al Serio (BGY) → Milan',
      'Milan → Malpensa for departures',
      'Malpensa → Lugano & Switzerland',
    ],
    faq: [
      {
        q: 'What happens if my flight is delayed?',
        a: 'We monitor your flight in real time and adjust the pickup automatically. Waiting time for flight delays is included at no extra cost.',
      },
      {
        q: 'Where will I meet my driver at the airport?',
        a: 'Your chauffeur waits in the arrivals hall with a sign bearing your name, after baggage claim and customs, ready to help with your luggage.',
      },
      {
        q: 'How far is Malpensa from central Milan?',
        a: 'Malpensa is about 50 km from central Milan, roughly a 50-minute drive depending on traffic. The transfer is a fixed, agreed fare.',
      },
    ],
  },
  {
    lang: 'en',
    slug: 'milan-to-lake-como-transfer',
    navLabel: 'Milan to Lake Como transfer',
    group: 'milan-como',
    itHref: '/ncc/como',
    areaServed: ['Milan', 'Lake Como', 'Como', 'Bellagio', 'Cernobbio', 'Lombardy'],
    metaTitle: 'Milan to Lake Como Transfer — Private Car & Driver',
    metaDescription:
      'Private transfer from Milan to Lake Como with an English-speaking driver: from the city centre or Malpensa to Como, Cernobbio, Bellagio and Tremezzo. Fixed fares, 24/7.',
    keywords: [
      'Milan to Lake Como transfer',
      'Milan to Como private transfer',
      'Malpensa to Lake Como',
      'transfer Milan Bellagio',
      'private car Milan Lake Como',
    ],
    heroLabel: 'Milan → Lake Como',
    heroTitle: 'Milan to Lake Como, in Comfort',
    heroDescription:
      'A private car and English-speaking driver from Milan or Malpensa to Lake Como — direct to Como, Cernobbio, Bellagio or your villa, with an agreed fixed fare.',
    image: IMAGES.services.tourPrivati,
    intro: [
      'The drive from Milan to Lake Como takes about an hour, and it should be the relaxing start of your stay — not a struggle with trains and taxis. Our private transfer takes you door to door from central Milan, your hotel or Malpensa straight to Como, Cernobbio, Bellagio or any address on the lake.',
      'Travel in a luxury Mercedes, BMW or Range Rover with a professional, English-speaking chauffeur. The fare is fixed and agreed in advance, and your driver can wait or stay at your disposal if you would like to continue with a tour of the lake.',
    ],
    highlights: [
      {
        title: 'Door to door',
        description:
          'Pickup from central Milan, your hotel or Malpensa and drop-off at any address on Lake Como — luggage handled.',
      },
      {
        title: 'Extend into a tour',
        description:
          'Keep your driver for the day and continue with a private lake tour of Bellagio, Varenna and Cernobbio.',
      },
      {
        title: 'Fixed fare',
        description:
          'A single agreed price for the journey, confirmed before you travel — no meter, no surprises.',
      },
    ],
    routes: [
      'Milan city centre → Como & Cernobbio',
      'Milan → Bellagio & Tremezzo',
      'Malpensa Airport (MXP) → Lake Como',
      'Milan → Varenna & the eastern shore',
      'Hotel pickup in Milan → your villa on the lake',
      'Lake Como → Milan (return transfers)',
    ],
    faq: [
      {
        q: 'How long is the transfer from Milan to Lake Como?',
        a: 'The drive is roughly one hour from central Milan to Como, a little more to Bellagio or Varenna, depending on traffic and your exact destination.',
      },
      {
        q: 'Can the driver pick me up from Malpensa instead of Milan?',
        a: 'Yes. We frequently collect guests directly from Malpensa, Linate or Bergamo and drive them straight to the lake, with flight monitoring included.',
      },
      {
        q: 'Can I turn the transfer into a day on the lake?',
        a: 'Of course. Keep your chauffeur at your disposal and we’ll build a private tour around Bellagio, Cernobbio, Tremezzo and Varenna.',
      },
    ],
  },
  {
    lang: 'en',
    slug: 'chauffeur-service-milan',
    navLabel: 'Chauffeur service Milan',
    group: 'chauffeur-milan',
    itHref: '/ncc/milano',
    areaServed: ['Milan', 'Monza', 'Brianza', 'Lombardy'],
    metaTitle: 'Chauffeur Service Milan — Private Driver & Car Hire',
    metaDescription:
      'Luxury chauffeur service in Milan with an English-speaking private driver: business travel, Fashion Week and events, hourly hire and airport transfers. Premium fleet, 24/7.',
    keywords: [
      'chauffeur service Milan',
      'private driver Milan',
      'car service Milan',
      'Milan chauffeur hire',
      'English speaking driver Milan',
      'Fashion Week driver Milan',
    ],
    heroLabel: 'Chauffeur Milan',
    heroTitle: 'Chauffeur Service in Milan',
    heroDescription:
      'A professional, English-speaking chauffeur in Milan for business, Fashion Week, events and hourly hire — with a premium Mercedes, BMW or Range Rover and complete discretion.',
    image: IMAGES.services.autistaMilano,
    intro: [
      'Getting around Milan calls for punctuality, discretion and a driver who genuinely knows the city. Our chauffeur service provides professional, English-speaking drivers and a fleet of executive cars for everything from airport transfers and business meetings to Fashion Week, the Salone del Mobile and private events.',
      'Book a car by the hour with your driver at your disposal, or arrange point-to-point transfers across the city and beyond — to Monza, the Brianza district or Lake Como. Every booking is confirmed in advance with an assigned chauffeur and a transparent fare.',
    ],
    highlights: [
      {
        title: 'Hourly hire',
        description:
          'A car and driver at your disposal for meetings, shopping, fairs and events, for as long as you need.',
      },
      {
        title: 'Fashion & events',
        description:
          'Dedicated cars and drivers for Fashion Week, runway shows, galas and evenings out, coordinated around your schedule.',
      },
      {
        title: 'Business travel',
        description:
          'Discreet, reliable transport for executives and VIPs, with English-speaking drivers and immaculate vehicles.',
      },
    ],
    routes: [
      'Milan city centre → Malpensa Airport (MXP)',
      'Milan → Linate Airport (LIN)',
      'Milan → Rho Fiera exhibition centre',
      'Milan → Monza & the Autodromo',
      'Milan → Lake Como, Bellagio & Cernobbio',
      'Hourly chauffeur at your disposal in Milan',
    ],
    faq: [
      {
        q: 'Can I hire a chauffeur by the hour in Milan?',
        a: 'Yes. Our hourly service keeps a car and driver at your disposal for meetings, shopping, fairs and events — ideal during Fashion Week and the Salone del Mobile.',
      },
      {
        q: 'Are your chauffeurs English-speaking?',
        a: 'Yes, all our drivers speak fluent English and know Milan in detail, from the Quadrilatero della Moda to Rho Fiera and the ring roads.',
      },
      {
        q: 'Is the service available at night?',
        a: 'We operate 24/7, including night flights and early-morning departures. We recommend booking in advance to guarantee the car.',
      },
    ],
  },
  {
    lang: 'en',
    slug: 'lake-como-private-tour',
    navLabel: 'Lake Como private tour',
    group: 'lake-como-tour',
    itHref: '/ncc/como',
    areaServed: ['Lake Como', 'Bellagio', 'Varenna', 'Cernobbio', 'Tremezzo', 'Lombardy'],
    metaTitle: 'Lake Como Private Tour — Bellagio, Varenna & Cernobbio',
    metaDescription:
      'Private Lake Como tour by car with an English-speaking driver: Bellagio, Varenna, Cernobbio and Tremezzo, villa visits and photo stops. Full or half day, luxury fleet.',
    keywords: [
      'Lake Como private tour',
      'Bellagio private tour',
      'Lake Como tour by car',
      'private tour Como Bellagio Varenna',
      'Lake Como day trip from Milan',
    ],
    heroLabel: 'Private tour',
    heroTitle: 'A Private Tour of Lake Como',
    heroDescription:
      'A chauffeured day around Lake Como — Bellagio, Varenna, Cernobbio and Tremezzo — with villa visits, photo stops and an English-speaking driver who knows the lake.',
    image: IMAGES.services.tourPrivati,
    intro: [
      'See the best of Lake Como without timetables or crowds. Our private tour puts an English-speaking chauffeur and a luxury car at your disposal for the day, with an itinerary built around what you want to see — the gardens of Villa Carlotta, the elegance of Bellagio, the waterfront of Varenna or the grand villas of Cernobbio.',
      'Ideal as a day trip from Milan or a relaxed day during your stay on the lake, the tour moves at your pace, with stops for photos, lunch and visits, and a driver who knows the quiet corners as well as the famous views.',
    ],
    highlights: [
      {
        title: 'Built around you',
        description:
          'A flexible itinerary across Bellagio, Varenna, Cernobbio and Tremezzo, paced to your interests and timings.',
      },
      {
        title: 'Villas & gardens',
        description:
          'Visits to landmark villas and gardens — Villa Carlotta, Villa del Balbianello, Villa d’Este — at your request.',
      },
      {
        title: 'Day trip from Milan',
        description:
          'Door-to-door from your Milan hotel or Malpensa, on the lake within the hour, back whenever you wish.',
      },
    ],
    routes: [
      'Milan or Malpensa → Lake Como (day trip)',
      'Bellagio → Varenna → Menaggio (the lake triangle)',
      'Cernobbio → Villa d’Este & the western shore',
      'Tremezzo → Villa Carlotta & Villa del Balbianello',
      'Como town → funicular to Brunate',
      'Lakeside lunch stops on request',
    ],
    faq: [
      {
        q: 'How long is a private Lake Como tour?',
        a: 'Most guests choose a full day (around 8 hours), but we also arrange half-day tours. The route and pace are entirely yours.',
      },
      {
        q: 'Can we visit the villas and gardens?',
        a: 'Yes. We build the day around visits to Villa Carlotta, Villa del Balbianello, Villa d’Este and others — we’ll advise on opening times and tickets.',
      },
      {
        q: 'Can you collect us from Milan for the day?',
        a: 'Certainly. We collect you from your Milan hotel or directly from Malpensa, spend the day on the lake and return you in the evening.',
      },
    ],
  },

  // ─── German ───────────────────────────────────────────────────────────
  {
    lang: 'de',
    slug: 'chauffeur-comer-see',
    navLabel: 'Privatchauffeur Comer See',
    group: 'lake-como-driver',
    itHref: '/ncc/como',
    areaServed: ['Comer See', 'Como', 'Bellagio', 'Cernobbio', 'Tremezzo', 'Lombardei'],
    metaTitle: 'Privatchauffeur Comer See — Limousinenservice',
    metaDescription:
      'Privatchauffeur am Comer See: Flughafentransfers ab Mailand, private Seetouren nach Bellagio, Cernobbio und Varenna, Hochzeiten und Events. Englischsprachige Fahrer, 24/7.',
    keywords: [
      'Chauffeur Comer See',
      'Privatfahrer Comer See',
      'Limousinenservice Comer See',
      'Transfer Comer See',
      'Comer See Hochzeitsauto',
    ],
    heroLabel: 'Comer See',
    heroTitle: 'Ihr Privatchauffeur am Comer See',
    heroDescription:
      'Ein diskreter, englischsprachiger Chauffeur für den Comer See — Flughafentransfers ab Mailand, private Seetouren und Chauffeurtage zwischen Bellagio, Cernobbio und Varenna.',
    image: IMAGES.blog.como,
    intro: [
      'Der Comer See gehört zu den schönsten Reisezielen der Welt und verdient einen Service auf demselben Niveau. Unser Privatchauffeur-Service bietet internationalen Gästen einen diskreten, englischsprachigen Fahrer, einen luxuriösen Mercedes, BMW oder Range Rover und einen Chauffeur, der jede Kehre der Tremezzina und des Ostufers kennt.',
      'Ob Sie aus Malpensa anreisen, einen ganzen Tag zwischen Bellagio, Varenna und Cernobbio planen oder einen eleganten Transfer für eine Hochzeit in einer der historischen Villen benötigen — jede Fahrt wird im Voraus zu einem festen, vereinbarten Preis gebucht. Ohne Taxameter, ohne Überraschungen.',
    ],
    highlights: [
      {
        title: 'Private Seetouren',
        description:
          'Individuelle Tagestouren zwischen Bellagio, Cernobbio, Tremezzo und Varenna, mit Fotostopps und Ihrem Fahrer den ganzen Tag an Ihrer Seite.',
      },
      {
        title: 'Hochzeiten & Events',
        description:
          'Chauffeurfahrzeuge für Zeremonien in den berühmten Villen des Sees — Villa d’Este, Villa Erba, Villa Carlotta — mit Fahrern in formeller Kleidung.',
      },
      {
        title: 'Flughafentransfers',
        description:
          'Haustür-Transfers ab Malpensa, Linate, Bergamo und Lugano, mit Flugüberwachung und persönlichem Empfang bei der Ankunft.',
      },
    ],
    routes: [
      'Flughafen Malpensa (MXP) → Como & Cernobbio',
      'Mailand Zentrum → Comer See',
      'Como → Bellagio, Tremezzo & Varenna',
      'Comer See → Lugano & Schweiz',
      'Como → Villa d’Este und Villa Carlotta',
      'Comer See → Flughafen Linate (LIN)',
    ],
    faq: [
      {
        q: 'Sprechen Ihre Fahrer Englisch?',
        a: 'Ja. Alle unsere Chauffeure sprechen fließend Englisch — unerlässlich für die internationalen Gäste am Comer See — und kennen die Straßen und Villen des Sees im Detail.',
      },
      {
        q: 'Kann ich eine private Ganztagestour am Comer See buchen?',
        a: 'Selbstverständlich. Wir bieten Chauffeur-Tagestouren zwischen Bellagio, Cernobbio, Tremezzo und Varenna, individuell abgestimmt auf Stopps, Mittagessen und Villenbesuche.',
      },
      {
        q: 'Was kostet ein Transfer von Malpensa zum Comer See?',
        a: 'Transfers werden zu einem festen, vereinbarten Preis kalkuliert — basierend auf Abhol- und Zielort sowie Personenzahl, nie nach Taxameter. Senden Sie uns Ihre Flugdaten für ein sofortiges Angebot.',
      },
    ],
  },
  {
    lang: 'de',
    slug: 'flughafentransfer-mailand',
    navLabel: 'Flughafentransfer Mailand',
    group: 'milan-airport',
    itHref: '/ncc/milano',
    areaServed: ['Mailand', 'Malpensa', 'Linate', 'Bergamo Orio al Serio', 'Lombardei'],
    metaTitle: 'Flughafentransfer Mailand — Malpensa, Linate, Bergamo',
    metaDescription:
      'Privater Flughafentransfer Mailand mit englischsprachigem Chauffeur: Malpensa, Linate und Bergamo Orio al Serio. Festpreise, Flugüberwachung, persönlicher Empfang, 24/7.',
    keywords: [
      'Flughafentransfer Mailand',
      'Transfer Malpensa',
      'Malpensa Mailand Transfer',
      'Flughafentransfer Malpensa',
      'Chauffeur Flughafen Mailand',
    ],
    heroLabel: 'Flughafentransfer',
    heroTitle: 'Flughafentransfer Mailand — zuverlässig',
    heroDescription:
      'Private Transfers zwischen Mailand und Malpensa, Linate und Bergamo mit englischsprachigem Chauffeur, Festpreisen, Flugüberwachung und persönlichem Empfang im Ankunftsbereich.',
    image: IMAGES.services.airportTransfer,
    intro: [
      'Die Ankunft in Mailand sollte mühelos sein. Unser privater Flughafentransfer empfängt Sie mit einem Namensschild in der Ankunftshalle, hilft mit dem Gepäck und bringt Sie direkt zu Ihrem Hotel, ins Zentrum oder an den Comer See — in einem luxuriösen Mercedes, BMW oder Range Rover.',
      'Wir bedienen alle drei Flughäfen der Region Mailand — Malpensa, Linate und Bergamo Orio al Serio — zu im Voraus vereinbarten Festpreisen und mit Flugüberwachung in Echtzeit. Eine verspätete oder frühe Landung ist nie ein Problem, die Wartezeit ist inbegriffen.',
    ],
    highlights: [
      {
        title: 'Persönlicher Empfang',
        description:
          'Ihr Chauffeur erwartet Sie nach der Gepäckausgabe mit Namensschild in der Ankunftshalle — kein Suchen im Parkhaus, keine Anrufe.',
      },
      {
        title: 'Flugüberwachung',
        description:
          'Wir verfolgen Ihren Flug in Echtzeit und passen die Abholung automatisch an. Kein Aufpreis bei Flugverspätungen.',
      },
      {
        title: 'Festpreise',
        description:
          'Jeder Transfer wird vor der Fahrt zu einem festen All-inclusive-Preis vereinbart — kein Taxameter, keine Überraschungen.',
      },
    ],
    routes: [
      'Flughafen Malpensa (MXP) → Mailand Zentrum',
      'Malpensa (MXP) → Comer See, Cernobbio & Bellagio',
      'Flughafen Linate (LIN) → Mailand & Monza',
      'Bergamo Orio al Serio (BGY) → Mailand',
      'Mailand → Malpensa für Abflüge',
      'Malpensa → Lugano & Schweiz',
    ],
    faq: [
      {
        q: 'Was passiert, wenn mein Flug Verspätung hat?',
        a: 'Wir überwachen Ihren Flug in Echtzeit und passen die Abholung automatisch an. Die Wartezeit bei Flugverspätungen ist ohne Aufpreis inbegriffen.',
      },
      {
        q: 'Wo treffe ich meinen Fahrer am Flughafen?',
        a: 'Ihr Chauffeur erwartet Sie nach Gepäckausgabe und Zoll mit einem Namensschild in der Ankunftshalle und hilft Ihnen mit dem Gepäck.',
      },
      {
        q: 'Wie weit ist Malpensa vom Zentrum Mailands entfernt?',
        a: 'Malpensa liegt etwa 50 km vom Zentrum Mailands entfernt, rund 50 Minuten Fahrt je nach Verkehr. Der Transfer erfolgt zu einem festen, vereinbarten Preis.',
      },
    ],
  },
  {
    lang: 'de',
    slug: 'mailand-comer-see-transfer',
    navLabel: 'Transfer Mailand–Comer See',
    group: 'milan-como',
    itHref: '/ncc/como',
    areaServed: ['Mailand', 'Comer See', 'Como', 'Bellagio', 'Cernobbio', 'Lombardei'],
    metaTitle: 'Transfer Mailand–Comer See — Privater Fahrdienst',
    metaDescription:
      'Privater Transfer von Mailand zum Comer See mit englischsprachigem Fahrer: vom Zentrum oder Malpensa nach Como, Cernobbio, Bellagio und Tremezzo. Festpreise, 24/7.',
    keywords: [
      'Transfer Mailand Comer See',
      'Mailand Como Transfer',
      'Malpensa Comer See',
      'Transfer Mailand Bellagio',
      'Privatfahrt Mailand Comer See',
    ],
    heroLabel: 'Mailand → Comer See',
    heroTitle: 'Von Mailand an den Comer See — bequem',
    heroDescription:
      'Privatwagen und englischsprachiger Fahrer von Mailand oder Malpensa an den Comer See — direkt nach Como, Cernobbio, Bellagio oder zu Ihrer Villa, zum vereinbarten Festpreis.',
    image: IMAGES.services.tourPrivati,
    intro: [
      'Die Fahrt von Mailand an den Comer See dauert etwa eine Stunde und sollte der entspannte Auftakt Ihres Aufenthalts sein — kein Kampf mit Zügen und Taxis. Unser privater Transfer bringt Sie von Haustür zu Haustür: vom Mailänder Zentrum, Ihrem Hotel oder Malpensa direkt nach Como, Cernobbio, Bellagio oder zu jeder Adresse am See.',
      'Reisen Sie in einem luxuriösen Mercedes, BMW oder Range Rover mit einem professionellen, englischsprachigen Chauffeur. Der Preis ist fest und im Voraus vereinbart, und Ihr Fahrer kann warten oder Ihnen für eine anschließende Seetour zur Verfügung stehen.',
    ],
    highlights: [
      {
        title: 'Von Tür zu Tür',
        description:
          'Abholung im Zentrum Mailands, an Ihrem Hotel oder in Malpensa und Ankunft an jeder Adresse am Comer See — inklusive Gepäck.',
      },
      {
        title: 'Als Tour verlängern',
        description:
          'Behalten Sie Ihren Fahrer für den Tag und schließen Sie eine private Seetour nach Bellagio, Varenna und Cernobbio an.',
      },
      {
        title: 'Festpreis',
        description:
          'Ein einziger vereinbarter Preis für die Fahrt, vor Reisebeginn bestätigt — kein Taxameter, keine Überraschungen.',
      },
    ],
    routes: [
      'Mailand Zentrum → Como & Cernobbio',
      'Mailand → Bellagio & Tremezzo',
      'Flughafen Malpensa (MXP) → Comer See',
      'Mailand → Varenna & Ostufer',
      'Hotelabholung Mailand → Ihre Villa am See',
      'Comer See → Mailand (Rücktransfer)',
    ],
    faq: [
      {
        q: 'Wie lange dauert der Transfer von Mailand zum Comer See?',
        a: 'Die Fahrt dauert etwa eine Stunde vom Zentrum Mailands nach Como, etwas länger nach Bellagio oder Varenna, je nach Verkehr und Zielort.',
      },
      {
        q: 'Kann der Fahrer mich statt in Mailand in Malpensa abholen?',
        a: 'Ja. Wir holen Gäste regelmäßig direkt in Malpensa, Linate oder Bergamo ab und bringen sie an den See — Flugüberwachung inklusive.',
      },
      {
        q: 'Kann ich den Transfer zu einem Tag am See ausweiten?',
        a: 'Selbstverständlich. Behalten Sie Ihren Chauffeur zur Verfügung, und wir gestalten eine private Tour rund um Bellagio, Cernobbio, Tremezzo und Varenna.',
      },
    ],
  },
  {
    lang: 'de',
    slug: 'chauffeur-service-mailand',
    navLabel: 'Chauffeurservice Mailand',
    group: 'chauffeur-milan',
    itHref: '/ncc/milano',
    areaServed: ['Mailand', 'Monza', 'Brianza', 'Lombardei'],
    metaTitle: 'Chauffeurservice Mailand — Privatfahrer & Limousine',
    metaDescription:
      'Luxuriöser Chauffeurservice in Mailand mit englischsprachigem Privatfahrer: Geschäftsreisen, Fashion Week und Events, stundenweise Buchung und Flughafentransfers. 24/7.',
    keywords: [
      'Chauffeurservice Mailand',
      'Privatfahrer Mailand',
      'Limousinenservice Mailand',
      'Chauffeur Mailand mieten',
      'Fashion Week Fahrer Mailand',
    ],
    heroLabel: 'Chauffeur Mailand',
    heroTitle: 'Chauffeurservice in Mailand',
    heroDescription:
      'Ein professioneller, englischsprachiger Chauffeur in Mailand für Business, Fashion Week, Events und stundenweise Buchung — mit Mercedes, BMW oder Range Rover und absoluter Diskretion.',
    image: IMAGES.services.autistaMilano,
    intro: [
      'Sich in Mailand zu bewegen erfordert Pünktlichkeit, Diskretion und einen Fahrer, der die Stadt wirklich kennt. Unser Chauffeurservice bietet professionelle, englischsprachige Fahrer und eine Flotte von Repräsentationsfahrzeugen — von Flughafentransfers und Geschäftsterminen bis zur Fashion Week, dem Salone del Mobile und privaten Events.',
      'Buchen Sie ein Fahrzeug stundenweise mit Fahrer zu Ihrer Verfügung oder einzelne Transfers durch die Stadt und darüber hinaus — nach Monza, in die Brianza oder an den Comer See. Jede Buchung wird im Voraus mit zugewiesenem Chauffeur und transparentem Preis bestätigt.',
    ],
    highlights: [
      {
        title: 'Stundenweise Buchung',
        description:
          'Fahrzeug und Fahrer zu Ihrer Verfügung für Termine, Shopping, Messen und Events — so lange Sie möchten.',
      },
      {
        title: 'Fashion & Events',
        description:
          'Dedizierte Fahrzeuge und Fahrer für Fashion Week, Modenschauen, Galas und Abendveranstaltungen, abgestimmt auf Ihren Zeitplan.',
      },
      {
        title: 'Geschäftsreisen',
        description:
          'Diskreter, zuverlässiger Transport für Führungskräfte und VIPs, mit englischsprachigen Fahrern und makellosen Fahrzeugen.',
      },
    ],
    routes: [
      'Mailand Zentrum → Flughafen Malpensa (MXP)',
      'Mailand → Flughafen Linate (LIN)',
      'Mailand → Messe Rho Fiera',
      'Mailand → Monza & Autodromo',
      'Mailand → Comer See, Bellagio & Cernobbio',
      'Chauffeur stundenweise in Mailand',
    ],
    faq: [
      {
        q: 'Kann ich in Mailand einen Chauffeur stundenweise buchen?',
        a: 'Ja. Unser Stundenservice hält Fahrzeug und Fahrer zu Ihrer Verfügung — ideal während der Fashion Week und des Salone del Mobile.',
      },
      {
        q: 'Sprechen Ihre Chauffeure Englisch?',
        a: 'Ja, alle unsere Fahrer sprechen fließend Englisch und kennen Mailand im Detail — vom Quadrilatero della Moda bis zur Rho Fiera.',
      },
      {
        q: 'Ist der Service auch nachts verfügbar?',
        a: 'Wir sind rund um die Uhr im Einsatz, inklusive Nachtflügen und frühen Abflügen. Wir empfehlen, im Voraus zu buchen.',
      },
    ],
  },
  {
    lang: 'de',
    slug: 'comer-see-privat-tour',
    navLabel: 'Comer See Privat-Tour',
    group: 'lake-como-tour',
    itHref: '/ncc/como',
    areaServed: ['Comer See', 'Bellagio', 'Varenna', 'Cernobbio', 'Tremezzo', 'Lombardei'],
    metaTitle: 'Comer See Privat-Tour — Bellagio, Varenna & Cernobbio',
    metaDescription:
      'Private Comer-See-Tour mit dem Auto und englischsprachigem Fahrer: Bellagio, Varenna, Cernobbio und Tremezzo, Villenbesuche und Fotostopps. Ganz- oder halbtags.',
    keywords: [
      'Comer See Privat Tour',
      'Bellagio Tour',
      'Comer See Tour mit Auto',
      'Privattour Como Bellagio Varenna',
      'Comer See Tagesausflug Mailand',
    ],
    heroLabel: 'Privat-Tour',
    heroTitle: 'Eine private Tour über den Comer See',
    heroDescription:
      'Ein Chauffeurtag rund um den Comer See — Bellagio, Varenna, Cernobbio und Tremezzo — mit Villenbesuchen, Fotostopps und einem englischsprachigen Fahrer, der den See kennt.',
    image: IMAGES.services.tourPrivati,
    intro: [
      'Erleben Sie das Beste des Comer Sees ohne Fahrpläne und Menschenmassen. Unsere Privat-Tour stellt Ihnen einen englischsprachigen Chauffeur und einen Luxuswagen für den Tag zur Verfügung, mit einer Route nach Ihren Wünschen — die Gärten der Villa Carlotta, die Eleganz von Bellagio, die Uferpromenade von Varenna oder die prächtigen Villen von Cernobbio.',
      'Ideal als Tagesausflug ab Mailand oder als entspannter Tag während Ihres Aufenthalts am See: Die Tour folgt Ihrem Tempo, mit Stopps für Fotos, Mittagessen und Besichtigungen — und einem Fahrer, der die stillen Ecken ebenso kennt wie die berühmten Ausblicke.',
    ],
    highlights: [
      {
        title: 'Ganz nach Ihren Wünschen',
        description:
          'Eine flexible Route über Bellagio, Varenna, Cernobbio und Tremezzo, abgestimmt auf Ihre Interessen und Zeiten.',
      },
      {
        title: 'Villen & Gärten',
        description:
          'Besuche berühmter Villen und Gärten — Villa Carlotta, Villa del Balbianello, Villa d’Este — auf Wunsch.',
      },
      {
        title: 'Tagesausflug ab Mailand',
        description:
          'Von Tür zu Tür ab Ihrem Mailänder Hotel oder Malpensa, innerhalb einer Stunde am See, Rückkehr wann Sie möchten.',
      },
    ],
    routes: [
      'Mailand oder Malpensa → Comer See (Tagesausflug)',
      'Bellagio → Varenna → Menaggio (das Seedreieck)',
      'Cernobbio → Villa d’Este & Westufer',
      'Tremezzo → Villa Carlotta & Villa del Balbianello',
      'Como → Standseilbahn nach Brunate',
      'Mittagsstopps am Seeufer auf Wunsch',
    ],
    faq: [
      {
        q: 'Wie lange dauert eine private Comer-See-Tour?',
        a: 'Die meisten Gäste wählen einen ganzen Tag (etwa 8 Stunden), wir organisieren aber auch Halbtagestouren. Route und Tempo bestimmen Sie.',
      },
      {
        q: 'Können wir die Villen und Gärten besichtigen?',
        a: 'Ja. Wir gestalten den Tag rund um Besuche der Villa Carlotta, Villa del Balbianello, Villa d’Este und weiterer — wir beraten zu Öffnungszeiten und Tickets.',
      },
      {
        q: 'Können Sie uns für den Tag in Mailand abholen?',
        a: 'Selbstverständlich. Wir holen Sie an Ihrem Mailänder Hotel oder direkt in Malpensa ab, verbringen den Tag am See und bringen Sie abends zurück.',
      },
    ],
  },
];

export function getIntlLanding(lang: IntlLang, slug: string): IntlLanding | undefined {
  return intlLandings.find((l) => l.lang === lang && l.slug === slug);
}

export function intlLandingsFor(lang: IntlLang): IntlLanding[] {
  return intlLandings.filter((l) => l.lang === lang);
}

/** Reciprocal hreflang map (en <-> de) plus x-default, keyed by BCP-47 code. */
export function hreflangFor(entry: IntlLanding): Record<string, string> {
  const group = intlLandings.filter((l) => l.group === entry.group);
  const map: Record<string, string> = {};
  for (const g of group) map[g.lang] = `/${g.lang}/${g.slug}`;
  map['x-default'] = map.en ?? `/${entry.lang}/${entry.slug}`;
  return map;
}
