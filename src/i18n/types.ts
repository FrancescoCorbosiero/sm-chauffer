export const LOCALES = ['it', 'en', 'es', 'de', 'fr', 'sq', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'it';

export const LOCALE_NAMES: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  sq: 'Shqip',
  ru: 'Русский',
};

export const LOCALE_SHORT: Record<Locale, string> = {
  it: 'IT',
  en: 'EN',
  es: 'ES',
  de: 'DE',
  fr: 'FR',
  sq: 'SQ',
  ru: 'RU',
};

export interface Dictionary {
  meta: {
    siteTitle: string;
    siteDescription: string;
    home: { title: string; description: string };
    fleet: { title: string; description: string };
    services: { title: string; description: string };
    about: { title: string; description: string };
    blog: { title: string; description: string };
    contact: { title: string; description: string };
    areas: { title: string; description: string };
  };
  skipToContent: string;
  nav: {
    home: string;
    fleet: string;
    services: string;
    about: string;
    blog: string;
    contact: string;
    bookNow: string;
    bookNowLong: string;
    openMenu: string;
    closeMenu: string;
    mainNavLabel: string;
    homeAria: string;
    areas: string;
    pricing: string;
    showMenu: string;
    menuTitle: string;
    logoTagline: string;
    allServices: string;
    servicesLead: string;
    featuredLabel: string;
    featuredText: string;
    citiesTitle: string;
    airportsTitle: string;
    areasMap: string;
    areasLead: string;
    quickContact: string;
    language: string;
  };
  /** Live availability indicator (top bar, footer, contact page). */
  status: {
    available: string;
    always: string;
    city: string;
    reply: string;
  };
  /** Global call-to-action labels (header, action bar, floating buttons). */
  actions: {
    call: string;
    book: string;
    quote: string;
    backToTop: string;
    whatsappMessage: string;
    writeUs: string;
    chatNow: string;
    barLabel: string;
  };
  common: {
    explore: string;
    learnMore: string;
    previous: string;
    next: string;
  };
  footer: {
    phone24: string;
    fleet: string;
    areas: string;
    company: string;
    compare: string;
    intl: string;
    vatLabel: string;
    registeredOffice: string;
    sdiLabel: string;
    tagline: string;
    explore: string;
    services: string;
    contacts: string;
    rightsReserved: string;
    vat: string;
    addressLine1: string;
    addressLine2: string;
    pagesAria: string;
    servicesAria: string;
    serviceLinks: {
      airport: string;
      milan: string;
      brianza: string;
      tours: string;
    };
  };
  hero: {
    titlePart1: string;
    titlePart2: string;
    description: string;
    trustGoogle: string;
    trustLicensed: string;
    trustFlight: string;
    trust247: string;
  };
  /** Hero quick-booking card. */
  quickBook: {
    title: string;
    subtitle: string;
    tripType: string;
    transfer: string;
    hourly: string;
    fromPlaceholder: string;
    toPlaceholder: string;
    duration: string;
    durationPlaceholder: string;
    /** "1 hour" */
    hourOne: string;
    /** "{n} hours" */
    hourMany: string;
    passengers: string;
    passengersPlaceholder: string;
    submit: string;
    free: string;
    noCard: string;
  };
  /** "How it works" — four booking steps. */
  steps: {
    label: string;
    title: string;
    accent: string;
    description: string;
    items: Array<{ title: string; description: string }>;
  };
  pricingTeaser: {
    label: string;
    title: string;
    accent: string;
    description: string;
    malpensaLabel: string;
    malpensaNote: string;
    hourlyLabel: string;
    hourlyNote: string;
    groupsLabel: string;
    groupsValue: string;
    groupsNote: string;
    cta: string;
  };
  ctaBand: {
    title: string;
    accent: string;
    description: string;
  };
  /** Coverage map widget (home teaser + /areas). */
  coverage: {
    label: string;
    title: string;
    accent: string;
    description: string;
    filterLabel: string;
    filters: { all: string; city: string; lake: string; airport: string; intl: string };
    groups: { city: string; lake: string; airport: string; intl: string; hub: string };
    fromMilan: string;
    distance: string;
    time: string;
    indicative: string;
    book: string;
    discover: string;
    mapLabel: string;
    switzerland: string;
    lakeComo: string;
    lakeMaggiore: string;
    lakeLugano: string;
    listTitle: string;
    onRequest: string;
    openMap: string;
    offMap: string;
    unitMin: string;
    unitHour: string;
  };
  areasPage: {
    title: string;
    accent: string;
    description: string;
    citiesTitle: string;
    citiesAccent: string;
    citiesDescription: string;
    cityCta: string;
    tableTitle: string;
    tableAccent: string;
    tableDescription: string;
    colDestination: string;
  };
  /** Four-step booking wizard on /contact. */
  wizard: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    steps: { trip: string; vehicle: string; details: string; review: string };
    titles: { trip: string; vehicle: string; details: string; review: string };
    /** "Step {n} of {total}" */
    stepOf: string;
    next: string;
    back: string;
    edit: string;
    send: string;
    swap: string;
    quickTo: string;
    typeTransfer: string;
    typeTransferDesc: string;
    typeAirport: string;
    typeAirportDesc: string;
    typeHourly: string;
    typeHourlyDesc: string;
    vehiclePick: string;
    vehicleLabel: string;
    /** "Up to {n} passengers" */
    capacityMax: string;
    childSeatHint: string;
    childSeatShort: string;
    phoneHint: string;
    notesHint: string;
    notesPlaceholder: string;
    privacyBefore: string;
    privacyLink: string;
    privacyAfter: string;
    reviewNote: string;
    errors: { required: string; pastDate: string; phone: string; vehicle: string; capacity: string };
  };
  fleetPreview: {
    label: string;
    title: string;
    accent: string;
    description: string;
    cta: string;
  };
  servicesPreview: {
    label: string;
    title: string;
    accent: string;
    description: string;
    cta: string;
  };
  whyUs: {
    label: string;
    title: string;
    description: string;
    items: Array<{ icon: string; title: string; description: string }>;
  };
  testimonialsSection: {
    ratingLabel: string;
    accent: string;
    label: string;
    title: string;
    description: string;
    starsAria: string;
  };
  blogPreview: {
    label: string;
    title: string;
    accent: string;
    description: string;
    cta: string;
  };
  fleetCard: {
    pax: string;
    bag: string;
    from: string;
    perHour: string;
    /** "{n} seats" */
    seats: string;
    /** "{n} bags" */
    luggage: string;
    book: string;
    onRequest: string;
    categories: { berlina: string; van: string; suv: string; bus: string };
  };
  serviceCard: {
    requestService: string;
    moreDetails: string;
    serviceTag: string;
  };
  bookingForm: {
    eyebrow: string;
    title: string;
    oneWay: string;
    hourly: string;
    vehicle: string;
    vehiclePlaceholder: string;
    from: string;
    fromPlaceholder: string;
    to: string;
    duration: string;
    toPlaceholder: string;
    durationPlaceholder: string;
    date: string;
    time: string;
    submit: string;
  };
  fleetPage: {
    label: string;
    title: string;
    accent: string;
    description: string;
    finderTitle: string;
    finderText: string;
    /** "{n} vehicles fit" */
    matches: string;
    matchOne: string;
    moreThan: string;
    tooSmall: string;
    compareTitle: string;
    compareAccent: string;
    compareText: string;
    colVehicle: string;
    colCategory: string;
    colSeats: string;
    colBags: string;
    colRate: string;
    colIdeal: string;
    standardsLabel: string;
    standardsTitle: string;
    standardsAccent: string;
    standards: Array<{ title: string; text: string }>;
  };
  /** Shared copy of the /fleet/[id] pages. */
  vehicleDetail: {
    specsTitle: string;
    specsAccent: string;
    childSeats: string;
    onRequest: string;
    chauffeur: string;
    chauffeurValue: string;
    availability: string;
    servicesTitle: string;
    servicesAccent: string;
    book: string;
    compareLink: string;
    otherTitle: string;
    otherAccent: string;
  };
  servicesPage: {
    label: string;
    title: string;
    accent: string;
    description: string;
    /** aria-label of the jump-to-service chips. */
    jump: string;
    discover: string;
  };
  /** Shared copy of the /services/[slug] pages. */
  serviceDetail: {
    eyebrow: string;
    book: string;
    factsLabel: string;
    hourlyLabel: string;
    quoteLabel: string;
    paxLabel: string;
    availabilityLabel: string;
    featuresLabel: string;
    featuresTitle: string;
    featuresAccent: string;
    asideTitle: string;
    asideText: string;
    priceLabel: string;
    vehiclesTitle: string;
    vehiclesAccent: string;
    vehiclesText: string;
    zonesLabel: string;
    zonesTitle: string;
    zonesAccent: string;
    zonesText: string;
    otherTitle: string;
    otherAccent: string;
  };
  aboutPage: {
    label: string;
    title: string;
    description: string;
    paragraphs: string[];
    values: Array<{ title: string; body: string }>;
  };
  blogPage: { label: string; title: string; description: string };
  blogPost: {
    back: string;
    readMin: string;
    related: string;
    ctaTitle: string;
    ctaButton: string;
  };
  faq: {
    label: string;
    title: string;
    accent: string;
    description: string;
    ctaTitle: string;
    ctaText: string;
  };
  contactPage: {
    label: string;
    title: string;
    accent: string;
    description: string;
    phoneDesc: string;
    openChat: string;
    emailDesc: string;
    instagramDesc: string;
    asideTitle: string;
    asideItems: string[];
    callTitle: string;
    callText: string;
    companyTitle: string;
    companyOwner: string;
    companyVat: string;
    companyTax: string;
    invoiceNote: string;
    name: string;
    phone: string;
    email: string;
    message: string;
    submit: string;
    infoTitle: string;
    info: {
      address: string;
      addressValue: string;
      phone: string;
      phoneValue: string;
      email: string;
      emailValue: string;
      availability: string;
      availabilityValue: string;
    };
    form: {
      bookingDetails: string;
      serviceType: string;
      airportTransfer: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      phonePlaceholder: string;
      addressPlaceholder: string;
      pickupTime: string;
      selectCarLabel: string;
      selectPlaceholder: string;
      selectCarFirst: string;
      passengers: string;
      bags: string;
      childSeat: string;
      additionalNotes: string;
      notesPlaceholder: string;
      confirmBooking: string;
      yes: string;
      no: string;
    };
  };
  stats: {
    label: string;
    years: string;
    transfers: string;
    googleStars: string;
    availability: string;
  };
  vehicles: Record<
    string,
    {
      /** Localized display name (the Italian data name is what bookings send). */
      name: string;
      badge?: string;
      description: string;
      long: string;
      /** Three short "ideal for" tags. */
      ideal: string[];
    }
  >;
  services: Record<
    string,
    {
      title: string;
      description: string;
      longDescription: string;
      /** Four highlights shown on the service page (and as bullets on /services). */
      features: Array<{ title: string; text: string }>;
    }
  >;
  testimonials: Record<string, { text: string }>;
  whatsapp: { aria: string; label: string };
  languageSwitcher: { aria: string };
  quote: {
    estimate: string;
    fixedMalpensa: string;
    busNote: string;
    customNote: string;
    incomplete: string;
    disclaimer: string;
  };
  emailConfirmation: {
    subject: string;
    preheader: string;
    greeting: string; // contains {name}
    intro: string;
    summaryTitle: string;
    contactTitle: string;
    closing: string;
  };
  quoteModal: {
    title: string;
    description: string;
    sendEmail: string;
    sendWhatsApp: string;
    close: string;
    sending: string;
    sent: string;
    sentBody: string;
  };
  quoteMessage: {
    booking: {
      subject: string;
      intro: string;
      tripType: string;
    };
    contact: {
      subject: string;
      intro: string;
    };
  };
  formErrors: {
    required: string;
    invalidDate: string;
    invalidEmail: string;
  };
}
