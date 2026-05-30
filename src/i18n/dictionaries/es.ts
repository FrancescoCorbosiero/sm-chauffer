import type { Dictionary } from '../types';

const es: Dictionary = {
  meta: {
    siteTitle: 'SM Luxury Chauffeur — Chófer de Lujo en Italia',
    siteDescription: 'Servicio de chófer de lujo en Milán, Brianza y el Lago de Como.',
    home: {
      title: 'SM Luxury Chauffeur — Inicio',
      description: 'Servicio de chófer de lujo en Milán, Brianza y el Lago de Como.',
    },
    fleet: {
      title: 'Nuestra Flota | SM Luxury Chauffeur',
      description: 'Descubre nuestra flota de vehículos de lujo: Mercedes, BMW, Range Rover.',
    },
    services: {
      title: 'Servicios | SM Luxury Chauffeur',
      description: 'Traslados al aeropuerto, chófer privado, tours en Italia. Servicio 24/7.',
    },
    about: {
      title: 'Quiénes Somos | SM Luxury Chauffeur',
      description: 'SM Luxury Chauffeur — Milán. Servicio de alquiler con chófer.',
    },
    blog: {
      title: 'Blog | SM Luxury Chauffeur',
      description: 'Artículos y guías sobre traslados de lujo, destinos y lifestyle.',
    },
    contact: {
      title: 'Contacto | SM Luxury Chauffeur',
      description: 'Contáctanos para reservas e información sobre nuestro servicio NCC.',
    },
  },
  skipToContent: 'Saltar al contenido',
  nav: {
    home: 'Inicio',
    fleet: 'Flota',
    services: 'Servicios',
    about: 'Quiénes Somos',
    blog: 'Blog',
    contact: 'Contacto',
    bookNow: 'Reservar',
    bookNowLong: 'Reservar Ahora',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    mainNavLabel: 'Navegación principal',
    homeAria: 'SM Luxury Chauffeur — Inicio',
  },
  footer: {
    tagline:
      'Servicio de chófer de lujo en Milán, Brianza y el Lago de Como. Elegancia, puntualidad y discreción desde 2014.',
    explore: 'Explora',
    services: 'Servicios',
    contacts: 'Contacto',
    rightsReserved: 'Todos los derechos reservados',
    vat: 'NIF en proceso de registro · NCC autorizado',
    addressLine1: 'Milano · Brianza',
    addressLine2: 'Como · Bellagio · Tremezzo',
    pagesAria: 'Páginas',
    servicesAria: 'Servicios',
    serviceLinks: {
      airport: 'Traslado al Aeropuerto',
      milan: 'Chófer en Milán',
      brianza: 'Chófer en Brianza',
      tours: 'Tours Privados',
    },
  },
  hero: {
    eyebrow: 'SM Luxury Chauffeur · Milán',
    titlePart1: 'Chófer de lujo',
    titlePart2: 'en Italia',
    description:
      'Traslados al aeropuerto, tours privados y servicios VIP con chófer dedicado. Disponibles 24/7 en Milán, Brianza y el Lago de Como.',
    ctaBook: 'Reservar Ahora',
    ctaFleet: 'La Flota',
    statsLabels: { years: 'Años', transfers: 'Traslados', google: 'Google' },
    imageAlt: 'Coche de lujo con chófer',
  },
  fleetPreview: {
    label: 'Nuestra Flota',
    title: 'Vehículos de lujo, elegidos uno a uno',
    description:
      'Mercedes, BMW y Range Rover. Cada coche mantenido bajo estándares premium, cada detalle cuidado.',
    cta: 'Ver toda la flota →',
  },
  servicesPreview: {
    label: 'Servicios',
    title: 'Cada viaje, a medida',
    description:
      'Desde traslados al aeropuerto hasta tours privados por los destinos más exclusivos de Italia y Europa.',
    cta: 'Todos los servicios →',
  },
  whyUs: {
    label: 'Por Qué Elegirnos',
    title: 'La excelencia en los detalles',
    description:
      'Diez años de experiencia al servicio de los clientes más exigentes, con estándares que nunca se comprometen.',
    items: [
      {
        icon: 'ShieldCheck',
        title: 'Autorizados y Asegurados',
        description:
          'NCC regular con todas las autorizaciones ministeriales y cobertura de seguro premium.',
      },
      {
        icon: 'Clock',
        title: 'Disponibles 24/7',
        description: 'Nuestro servicio nunca duerme. Reserva con antelación o en el último momento.',
      },
      {
        icon: 'Globe2',
        title: 'Hablamos Inglés',
        description: 'Todos nuestros chóferes hablan inglés fluido para clientes internacionales.',
      },
      {
        icon: 'Plane',
        title: 'Seguimiento de Vuelos',
        description: 'Rastreamos tu vuelo en tiempo real. Sin cargos adicionales por retrasos.',
      },
    ],
  },
  testimonialsSection: {
    label: 'Testimonios',
    title: 'Lo que dicen nuestros clientes',
    description: '5,0 estrellas en Google — reseñas reales de quien eligió SM Luxury Chauffeur.',
    starsAria: '{n} de 5 estrellas',
  },
  blogPreview: {
    label: 'Desde Nuestro Blog',
    title: 'Guías y relatos de viaje',
    description: 'Historias, itinerarios y consejos para vivir Italia con estilo.',
    cta: 'Todos los artículos →',
  },
  fleetCard: {
    pax: 'pax',
    bag: 'maletas',
    from: 'Desde',
    perHour: '/h',
    book: 'Reservar',
    onRequest: 'Bajo petición',
    categories: { berlina: 'Berlina', van: 'Van', suv: 'SUV', bus: 'Autobús' },
  },
  serviceCard: {
    requestService: 'Solicitar Servicio',
    moreDetails: 'Más detalles',
    serviceTag: 'Servicio',
  },
  bookingForm: {
    eyebrow: 'Reserva',
    title: 'Solicita un presupuesto',
    oneWay: 'Solo Ida',
    hourly: 'Por Horas',
    vehicle: 'Vehículo',
    vehiclePlaceholder: 'Selecciona un vehículo',
    from: 'Recogida',
    fromPlaceholder: 'Dirección o aeropuerto',
    to: 'Destino',
    duration: 'Duración (horas)',
    toPlaceholder: 'Dirección de llegada',
    durationPlaceholder: 'ej. 4',
    date: 'Fecha',
    time: 'Hora',
    submit: 'Solicitar Presupuesto',
  },
  fleetPage: {
    label: 'Flota',
    title: 'Nuestra Flota',
    description:
      'Vehículos seleccionados con esmero para ofrecerte el máximo confort, seguridad y estilo.',
  },
  servicesPage: {
    label: 'Servicios',
    title: 'Nuestros Servicios',
    description:
      'Traslados al aeropuerto, chófer privado, tours por Italia y Europa. Cada viaje cuidado al detalle.',
  },
  aboutPage: {
    label: 'Quiénes Somos',
    title: 'SM Luxury Chauffeur — Milán',
    description: 'Desde 2014 al servicio de quien busca un traslado a la altura de sus expectativas.',
    paragraphs: [
      'SM Luxury Chauffeur nace en Milán con un objetivo sencillo: aportar a los traslados privados el mismo nivel de cuidado, elegancia y atención que define la hostelería de alto nivel.',
      'Trabajamos cada día con clientes corporativos, huéspedes de hoteles de cinco estrellas, agencias de viajes de lujo y operadores de moda durante las semanas más importantes del calendario milanés.',
      'Nuestra flota — íntegramente Mercedes, BMW y Range Rover — está mantenida por personal dedicado. Los chóferes, seleccionados con esmero, hablan inglés y conocen los protocolos del sector de lujo.',
    ],
    values: [
      {
        title: 'Fiabilidad',
        body: 'NCC autorizado, cobertura de seguro premium y estándares de seguridad certificados.',
      },
      {
        title: 'Puntualidad',
        body: 'Nuestro compromiso: estar en el lugar adecuado en el momento adecuado, siempre. 24/7.',
      },
      {
        title: 'Discreción',
        body: 'Discreción absoluta para clientes corporativos, celebridades y personalidades de relieve.',
      },
      {
        title: 'Experiencia',
        body: 'Más de diez años en traslados de lujo en Italia y Europa.',
      },
    ],
  },
  blogPage: {
    label: 'Blog',
    title: 'Historias, guías e itinerarios',
    description: 'Profundizaciones sobre viajes, destinos y el arte del traslado de lujo en Italia.',
  },
  contactPage: {
    label: 'Contacto',
    title: 'Ponte en contacto',
    description: 'Respondemos a solicitudes y presupuestos en pocos minutos, 24h.',
    name: 'Nombre y Apellidos',
    phone: 'Teléfono',
    email: 'Email',
    message: 'Mensaje',
    submit: 'Enviar Solicitud',
    infoTitle: 'Información',
    info: {
      address: 'Dirección',
      addressValue: 'Milano · Brianza · Como · Bellagio · Tremezzo',
      phone: 'Teléfono',
      phoneValue: '+39 328 687 1152',
      email: 'Email',
      emailValue: 'info@smchauffeur.it',
      availability: 'Disponibilidad',
      availabilityValue: '24 horas al día, 7 días a la semana',
    },
    form: {
      bookingDetails: 'Detalles de la reserva',
      serviceType: 'Tipo de servicio',
      airportTransfer: 'Traslado al aeropuerto',
      namePlaceholder: 'Juan Pérez',
      emailPlaceholder: 'nombre@ejemplo.com',
      phonePlaceholder: '+34 000 000 000',
      addressPlaceholder: 'Dirección, aeropuerto, hotel...',
      pickupTime: 'Hora de recogida',
      selectCarLabel: 'Elige un coche',
      selectPlaceholder: 'Elegir',
      selectCarFirst: 'Primero elige un coche',
      passengers: 'Pasajeros',
      bags: 'Maletas',
      childSeat: 'Necesito una silla infantil',
      additionalNotes: 'Notas adicionales',
      notesPlaceholder: '¿Algo más que debamos saber?',
      confirmBooking: 'Confirmar reserva',
      yes: 'Sí',
      no: 'No',
    },
  },
  stats: {
    years: 'Años de Experiencia',
    transfers: 'Traslados Completados',
    googleStars: 'Estrellas en Google',
    availability: 'Disponibilidad',
  },
  vehicles: {
    'mercedes-s-class': {
      badge: 'Más Popular',
      description: 'La berlina ejecutiva por excelencia. Confort absoluto para tus traslados.',
    },
    'mercedes-e-class': {
      description: 'Elegancia y tecnología para tus desplazamientos diarios.',
    },
    'mercedes-v-class': {
      badge: 'Grupos',
      description: 'Espacio y lujo para grupos y familias. Ideal para eventos y traslados al aeropuerto.',
    },
    'mercedes-s-class-lwb': {
      badge: 'VIP',
      description: 'El máximo lujo. Distancia entre ejes larga para un espacio interior premium.',
    },
    'bmw-7-series': {
      description: 'Dinamismo y confort de alto nivel para quien no acepta compromisos.',
    },
    'range-rover': {
      badge: 'SUV',
      description: 'El SUV de lujo por excelencia. Perfecto para cualquier terreno y ocasión.',
    },
    'bus-18': {
      badge: '18 Plazas',
      description:
        'Autobús de 18 plazas para grupos, eventos y traslados colectivos. Disponible bajo petición.',
    },
  },
  services: {
    'airport-transfer': {
      title: 'Traslado al Aeropuerto',
      description: 'Malpensa, Bérgamo, Linate — siempre puntuales.',
      longDescription:
        'Monitorizamos tu vuelo en tiempo real. Tu chófer te esperará a la llegada con cartel nominativo, listo para ayudarte con el equipaje. Disponible 24/7, 365 días al año en todos los aeropuertos de Lombardía. Traslado Milán–Malpensa con tarifa fija desde 150€.',
    },
    'autista-milano': {
      title: 'Chófer en Milán',
      description: 'Tu chófer privado en el corazón de la moda.',
      longDescription:
        'Desplazamientos en la ciudad, reuniones de negocios, cenas de gala, Fashion Week. Nuestro servicio de chófer en Milán garantiza discreción, puntualidad y confort en cada ocasión.',
    },
    'autista-brianza': {
      title: 'Chófer en Brianza',
      description: 'Tu chófer privado entre Monza y las villas de Brianza.',
      longDescription:
        'De Monza a Lecco, de las villas históricas de Brianza a destinos premium: nuestro servicio de chófer garantiza puntualidad, discreción y comodidad en cada ocasión.',
    },
    'tour-privati': {
      title: 'Tours Privados por Italia',
      description: 'Lago de Como, Toscana, Amalfi — solo para ti.',
      longDescription:
        'Itinerarios personalizados por los destinos más bellos de Italia. Lago de Como, Langhe, Costa Amalfitana, Cinque Terre. Cada tour a medida, con chófer dedicado y atención al detalle.',
    },
    'trasferimenti-internazionali': {
      title: 'Traslados Internacionales',
      description: 'Italia, Suiza, Francia, Mónaco — sin fronteras.',
      longDescription:
        'Traslados puerta a puerta hacia los principales destinos europeos: Ginebra, Zúrich, Niza, Mónaco, París. Nuestros chóferes conocen las mejores rutas y gestionan todos los trámites fronterizos.',
    },
    'minibus-gruppi': {
      title: 'Minibús y Grupos',
      description: 'Hasta 19 plazas, para eventos y delegaciones.',
      longDescription:
        'Vehículos de gran capacidad para conferencias, eventos corporativos, bodas y tours de grupo. Coordinamos varias flotas para grandes eventos con logística dedicada.',
    },
  },
  testimonials: {
    '1': {
      text:
        'Servicio impecable para mi traslado desde Malpensa. Chófer profesional, coche impecable y puntualidad absoluta. Lo recomiendo a quien busque calidad.',
    },
    '2': {
      text:
        'Usé SM Luxury Chauffeur durante la Milán Fashion Week. Servicio excelente, chófer discreto y la Mercedes Clase S inmaculada. Volveré a reservar la próxima temporada.',
    },
    '3': {
      text:
        'Usé el servicio para un tour privado al Lago de Como. Todo perfecto: recorrido, chófer disponible y profesional, una experiencia de lujo verdadera.',
    },
  },
  whatsapp: { aria: 'Contáctanos por WhatsApp', label: 'WhatsApp' },
  languageSwitcher: { aria: 'Cambiar idioma' },
  quoteModal: {
    title: '¿Cómo prefieres enviar tu solicitud?',
    description: 'Elige el canal preferido: te responderemos lo antes posible.',
    sendEmail: 'Enviar por Email',
    sendWhatsApp: 'Enviar por WhatsApp',
    close: 'Cerrar',
  },
  quoteMessage: {
    booking: {
      subject: 'Solicitud de presupuesto — SM Luxury Chauffeur',
      intro: 'Nueva solicitud de presupuesto',
      tripType: 'Tipo de viaje',
    },
    contact: {
      subject: 'Solicitud de contacto — SM Luxury Chauffeur',
      intro: 'Nueva solicitud de contacto',
    },
  },
  formErrors: {
    required: 'Por favor, completa todos los campos obligatorios antes de enviar la solicitud.',
    invalidDate: 'Fecha no válida. Introduce una fecha existente.',
    invalidEmail: 'Introduce una dirección de correo electrónico válida.',
  },
};

export default es;
