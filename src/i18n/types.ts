export const LOCALES = ['it', 'en', 'es', 'de', 'fr', 'sq', 'ro'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'it';

export const LOCALE_NAMES: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  sq: 'Shqip',
  ro: 'Română',
};

export const LOCALE_SHORT: Record<Locale, string> = {
  it: 'IT',
  en: 'EN',
  es: 'ES',
  de: 'DE',
  fr: 'FR',
  sq: 'SQ',
  ro: 'RO',
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
  };
  footer: {
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
      rome: string;
      tours: string;
    };
  };
  hero: {
    eyebrow: string;
    titlePart1: string;
    titlePart2: string;
    description: string;
    ctaBook: string;
    ctaFleet: string;
    statsLabels: { years: string; transfers: string; google: string };
    imageAlt: string;
  };
  fleetPreview: {
    label: string;
    title: string;
    description: string;
    cta: string;
  };
  servicesPreview: {
    label: string;
    title: string;
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
    label: string;
    title: string;
    description: string;
    starsAria: string;
  };
  blogPreview: {
    label: string;
    title: string;
    description: string;
    cta: string;
  };
  fleetCard: {
    pax: string;
    bag: string;
    from: string;
    perHour: string;
    book: string;
    categories: { berlina: string; van: string; suv: string };
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
  fleetPage: { label: string; title: string; description: string };
  servicesPage: { label: string; title: string; description: string };
  aboutPage: {
    label: string;
    title: string;
    description: string;
    paragraphs: string[];
    values: Array<{ title: string; body: string }>;
  };
  blogPage: { label: string; title: string; description: string };
  contactPage: {
    label: string;
    title: string;
    description: string;
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
    years: string;
    transfers: string;
    googleStars: string;
    availability: string;
  };
  vehicles: Record<string, { badge?: string; description: string }>;
  services: Record<string, { title: string; description: string; longDescription: string }>;
  testimonials: Record<string, { text: string }>;
  whatsapp: { aria: string; label: string };
  languageSwitcher: { aria: string };
  quoteModal: {
    title: string;
    description: string;
    sendEmail: string;
    sendWhatsApp: string;
    close: string;
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
  };
}
