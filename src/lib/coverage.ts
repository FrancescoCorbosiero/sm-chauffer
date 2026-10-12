import type { Locale } from '@/i18n/types';
import { GEO_FRAME } from './coverageGeo';

/**
 * Destinations shown on the coverage map (/areas, home teaser). Distances
 * and drive times are from central Milan and indicative, in regular
 * traffic — the UI says so next to them.
 */

export type CoverageGroup = 'city' | 'lake' | 'airport' | 'intl';

type L10n = Record<Locale, string>;

export interface CoveragePoint {
  id: string;
  group: CoverageGroup;
  lat: number;
  lon: number;
  /** Road distance from Milan, km (0 for the hub). */
  km: number;
  /** Indicative drive time from Milan, minutes. */
  minutes: number;
  /** Display name; one string when it is the same in every language. */
  name: string | L10n;
  desc: L10n;
  /** Value pre-filled as destination in the booking wizard (Italian). */
  bookTo: string;
  /** Related page, if any. */
  href?: string;
  /** Label hidden on small screens (crowded areas); still listed. */
  minor?: boolean;
  /** Which side of the pin the label sits on. */
  label?: 'left' | 'right' | 'top' | 'bottom';
  /** Off-map chips only: override the edge position (map units) to avoid a collision. */
  edge?: { x?: number; y?: number };
}

const same = (name: string, ru: string): L10n => ({ it: name, en: name, es: name, de: name, fr: name, sq: name, ru });

export const HUB_ID = 'milano';

export const COVERAGE_POINTS: CoveragePoint[] = [
  {
    id: 'milano',
    group: 'city',
    lat: 45.4642,
    lon: 9.19,
    km: 0,
    minutes: 0,
    name: { it: 'Milano', en: 'Milan', es: 'Milán', de: 'Mailand', fr: 'Milan', sq: 'Milano', ru: 'Милан' },
    desc: {
      it: 'La nostra base: centro, Fiera Rho, CityLife e Porta Nuova, 24 ore su 24.',
      en: 'Our base: city centre, Fiera Rho, CityLife and Porta Nuova, around the clock.',
      es: 'Nuestra base: centro, Fiera Rho, CityLife y Porta Nuova, las 24 horas.',
      de: 'Unsere Basis: Zentrum, Fiera Rho, CityLife und Porta Nuova – rund um die Uhr.',
      fr: 'Notre base : centre-ville, Fiera Rho, CityLife et Porta Nuova, 24h/24.',
      sq: 'Baza jonë: qendra, Fiera Rho, CityLife dhe Porta Nuova, 24 orë në ditë.',
      ru: 'Наша база: центр, Fiera Rho, CityLife и Порта-Нуова — круглосуточно.',
    },
    bookTo: 'Milano centro',
    href: '/ncc/milano',
    label: 'bottom',
  },
  {
    id: 'monza',
    group: 'city',
    lat: 45.5845,
    lon: 9.2744,
    km: 20,
    minutes: 30,
    name: same('Monza', 'Монца'),
    desc: {
      it: 'Autodromo Nazionale, Villa Reale e il Gran Premio d’Italia.',
      en: 'The National Autodrome, Villa Reale and the Italian Grand Prix.',
      es: 'El Autódromo Nacional, la Villa Real y el Gran Premio de Italia.',
      de: 'Nationales Autodrom, Villa Reale und der Große Preis von Italien.',
      fr: 'L’Autodrome national, la Villa Reale et le Grand Prix d’Italie.',
      sq: 'Autodromi Kombëtar, Villa Reale dhe Çmimi i Madh i Italisë.',
      ru: 'Национальный автодром, Королевская вилла и Гран-при Италии.',
    },
    bookTo: 'Monza',
    href: '/ncc/monza',
    label: 'right',
  },
  {
    id: 'brianza',
    group: 'city',
    lat: 45.672,
    lon: 9.235,
    km: 30,
    minutes: 35,
    name: same('Brianza', 'Брианца'),
    desc: {
      it: 'Seregno, Desio, Lissone, Carate, Meda e Cantù: aziende e privati.',
      en: 'Seregno, Desio, Lissone, Carate, Meda and Cantù: businesses and private clients.',
      es: 'Seregno, Desio, Lissone, Carate, Meda y Cantù: empresas y particulares.',
      de: 'Seregno, Desio, Lissone, Carate, Meda und Cantù: Unternehmen und Privatkunden.',
      fr: 'Seregno, Desio, Lissone, Carate, Meda et Cantù : entreprises et particuliers.',
      sq: 'Seregno, Desio, Lissone, Carate, Meda dhe Cantù: biznese dhe privatë.',
      ru: 'Сереньо, Дезио, Лиссоне, Карате, Меда и Канту: компании и частные клиенты.',
    },
    bookTo: 'Brianza',
    href: '/ncc/brianza',
    label: 'right',
  },
  {
    id: 'como',
    group: 'city',
    lat: 45.8081,
    lon: 9.0852,
    km: 50,
    minutes: 50,
    name: same('Como', 'Комо'),
    desc: {
      it: 'La città e Villa Olmo, porta d’ingresso al lago.',
      en: 'The city and Villa Olmo, gateway to the lake.',
      es: 'La ciudad y Villa Olmo, puerta de entrada al lago.',
      de: 'Die Stadt und Villa Olmo, das Tor zum See.',
      fr: 'La ville et la Villa Olmo, porte d’entrée du lac.',
      sq: 'Qyteti dhe Villa Olmo, porta e hyrjes në liqen.',
      ru: 'Город и вилла Ольмо — ворота к озеру.',
    },
    bookTo: 'Como',
    href: '/ncc/como',
    label: 'left',
  },
  {
    id: 'lecco',
    group: 'city',
    lat: 45.8566,
    lon: 9.3977,
    km: 55,
    minutes: 55,
    name: same('Lecco', 'Лекко'),
    desc: {
      it: 'Il ramo orientale del lago, verso Varenna e la Valtellina.',
      en: 'The eastern branch of the lake, towards Varenna and Valtellina.',
      es: 'El brazo oriental del lago, hacia Varenna y la Valtellina.',
      de: 'Der östliche Seearm, Richtung Varenna und Veltlin.',
      fr: 'La branche orientale du lac, vers Varenna et la Valteline.',
      sq: 'Dega lindore e liqenit, drejt Varennës dhe Valtellinës.',
      ru: 'Восточный рукав озера, в сторону Варенны и Вальтеллины.',
    },
    bookTo: 'Lecco',
    label: 'right',
  },
  {
    id: 'cernobbio',
    group: 'lake',
    lat: 45.8417,
    lon: 9.0739,
    km: 55,
    minutes: 55,
    name: same('Cernobbio', 'Черноббио'),
    desc: {
      it: 'Villa d’Este e Villa Erba, tra eventi e matrimoni.',
      en: 'Villa d’Este and Villa Erba, for events and weddings.',
      es: 'Villa d’Este y Villa Erba, entre eventos y bodas.',
      de: 'Villa d’Este und Villa Erba – für Events und Hochzeiten.',
      fr: 'La Villa d’Este et la Villa Erba, entre événements et mariages.',
      sq: 'Villa d’Este dhe Villa Erba, për evente dhe dasma.',
      ru: 'Вилла д’Эсте и вилла Эрба — мероприятия и свадьбы.',
    },
    bookTo: 'Cernobbio',
    href: '/ncc/como',
    minor: true,
    label: 'left',
  },
  {
    id: 'tremezzo',
    group: 'lake',
    lat: 45.9869,
    lon: 9.2186,
    km: 78,
    minutes: 85,
    name: same('Tremezzo', 'Тремеццо'),
    desc: {
      it: 'Villa Carlotta e i giardini della Tremezzina.',
      en: 'Villa Carlotta and the gardens of the Tremezzina.',
      es: 'Villa Carlotta y los jardines de la Tremezzina.',
      de: 'Villa Carlotta und die Gärten der Tremezzina.',
      fr: 'La Villa Carlotta et les jardins de la Tremezzina.',
      sq: 'Villa Carlotta dhe kopshtet e Tremezzinës.',
      ru: 'Вилла Карлотта и сады Тремеццины.',
    },
    bookTo: 'Tremezzo',
    href: '/ncc/como',
    minor: true,
    label: 'left',
  },
  {
    id: 'bellagio',
    group: 'lake',
    lat: 45.9867,
    lon: 9.2614,
    km: 75,
    minutes: 80,
    name: same('Bellagio', 'Белладжо'),
    desc: {
      it: 'La perla del lago, sulla punta del triangolo lariano.',
      en: 'The pearl of the lake, on the tip of the Larian triangle.',
      es: 'La perla del lago, en la punta del triángulo lariano.',
      de: 'Die Perle des Sees an der Spitze des Lario-Dreiecks.',
      fr: 'La perle du lac, à la pointe du triangle larien.',
      sq: 'Perla e liqenit, në majë të trekëndëshit larian.',
      ru: 'Жемчужина озера на оконечности Ларианского треугольника.',
    },
    bookTo: 'Bellagio',
    href: '/ncc/como',
    label: 'bottom',
  },
  {
    id: 'menaggio',
    group: 'lake',
    lat: 46.0211,
    lon: 9.2381,
    km: 85,
    minutes: 90,
    name: same('Menaggio', 'Менаджо'),
    desc: {
      it: 'La sponda occidentale, a un passo dalla Svizzera.',
      en: 'The western shore, a stone’s throw from Switzerland.',
      es: 'La orilla occidental, a un paso de Suiza.',
      de: 'Das Westufer, nur einen Katzensprung von der Schweiz.',
      fr: 'La rive ouest, à deux pas de la Suisse.',
      sq: 'Bregu perëndimor, dy hapa nga Zvicra.',
      ru: 'Западный берег, в двух шагах от Швейцарии.',
    },
    bookTo: 'Menaggio',
    href: '/ncc/como',
    minor: true,
    label: 'top',
  },
  {
    id: 'varenna',
    group: 'lake',
    lat: 46.0103,
    lon: 9.2836,
    km: 80,
    minutes: 75,
    name: same('Varenna', 'Варенна'),
    desc: {
      it: 'Villa Monastero e il Castello di Vezio, sulla sponda est.',
      en: 'Villa Monastero and Vezio Castle, on the eastern shore.',
      es: 'Villa Monastero y el Castillo de Vezio, en la orilla este.',
      de: 'Villa Monastero und das Castello di Vezio am Ostufer.',
      fr: 'La Villa Monastero et le château de Vezio, sur la rive est.',
      sq: 'Villa Monastero dhe Kështjella e Vezios, në bregun lindor.',
      ru: 'Вилла Монастеро и замок Вецио на восточном берегу.',
    },
    bookTo: 'Varenna',
    href: '/ncc/como',
    minor: true,
    label: 'right',
  },
  {
    id: 'mxp',
    group: 'airport',
    lat: 45.6306,
    lon: 8.7281,
    km: 50,
    minutes: 50,
    name: same('Malpensa (MXP)', 'Мальпенса (MXP)'),
    desc: {
      it: 'Terminal 1 e 2. Tariffa fissa da Milano e monitoraggio del volo.',
      en: 'Terminals 1 and 2. Fixed fare from Milan and flight monitoring.',
      es: 'Terminales 1 y 2. Tarifa fija desde Milán y seguimiento del vuelo.',
      de: 'Terminal 1 und 2. Festpreis ab Mailand und Flugüberwachung.',
      fr: 'Terminaux 1 et 2. Tarif fixe depuis Milan et suivi du vol.',
      sq: 'Terminali 1 dhe 2. Tarifë fikse nga Milano dhe monitorim i fluturimit.',
      ru: 'Терминалы 1 и 2. Фиксированный тариф из Милана и отслеживание рейса.',
    },
    bookTo: 'Aeroporto di Milano Malpensa (MXP)',
    href: '/services/airport-transfer',
    label: 'bottom',
  },
  {
    id: 'lin',
    group: 'airport',
    lat: 45.4451,
    lon: 9.2767,
    km: 8,
    minutes: 20,
    name: same('Linate (LIN)', 'Линате (LIN)'),
    desc: {
      it: 'L’aeroporto cittadino, a pochi minuti dal centro.',
      en: 'The city airport, minutes from the centre.',
      es: 'El aeropuerto urbano, a pocos minutos del centro.',
      de: 'Der Stadtflughafen, wenige Minuten vom Zentrum.',
      fr: 'L’aéroport de la ville, à quelques minutes du centre.',
      sq: 'Aeroporti i qytetit, pak minuta nga qendra.',
      ru: 'Городской аэропорт в нескольких минутах от центра.',
    },
    bookTo: 'Aeroporto di Milano Linate (LIN)',
    href: '/services/airport-transfer',
    label: 'right',
  },
  {
    id: 'bgy',
    group: 'airport',
    lat: 45.6739,
    lon: 9.7042,
    km: 50,
    minutes: 50,
    name: same('Orio al Serio (BGY)', 'Орио-аль-Серио (BGY)'),
    desc: {
      it: 'Bergamo Orio al Serio, con accoglienza in arrivo.',
      en: 'Bergamo Orio al Serio, with meet-and-greet on arrival.',
      es: 'Bérgamo Orio al Serio, con recepción a la llegada.',
      de: 'Bergamo Orio al Serio, mit Empfang bei der Ankunft.',
      fr: 'Bergame Orio al Serio, avec accueil à l’arrivée.',
      sq: 'Bergamo Orio al Serio, me pritje në mbërritje.',
      ru: 'Бергамо Орио-аль-Серио, со встречей в зале прилёта.',
    },
    bookTo: 'Aeroporto di Bergamo Orio al Serio (BGY)',
    href: '/services/airport-transfer',
    label: 'left',
  },
  {
    id: 'lugano',
    group: 'intl',
    lat: 46.0037,
    lon: 8.9511,
    km: 80,
    minutes: 75,
    name: same('Lugano', 'Лугано'),
    desc: {
      it: 'Canton Ticino: transfer d’affari e collegamenti con gli aeroporti.',
      en: 'Canton Ticino: business transfers and airport connections.',
      es: 'Cantón del Tesino: traslados de negocios y conexiones con aeropuertos.',
      de: 'Kanton Tessin: Geschäftstransfers und Flughafenverbindungen.',
      fr: 'Canton du Tessin : transferts d’affaires et liaisons aéroport.',
      sq: 'Kantoni i Ticinos: transferta biznesi dhe lidhje me aeroportet.',
      ru: 'Кантон Тичино: деловые трансферы и поездки в аэропорты.',
    },
    bookTo: 'Lugano',
    href: '/services/trasferimenti-internazionali',
    label: 'left',
  },
  {
    id: 'stmoritz',
    group: 'intl',
    lat: 46.4908,
    lon: 9.8355,
    km: 200,
    minutes: 195,
    name: { it: 'St. Moritz', en: 'St. Moritz', es: 'St. Moritz', de: 'St. Moritz', fr: 'Saint-Moritz', sq: 'St. Moritz', ru: 'Санкт-Мориц' },
    desc: {
      it: 'Engadina: transfer da Milano e da Malpensa, d’inverno e d’estate.',
      en: 'Engadine: transfers from Milan and Malpensa, winter and summer.',
      es: 'Engadina: traslados desde Milán y Malpensa, en invierno y en verano.',
      de: 'Engadin: Transfers ab Mailand und Malpensa, im Winter wie im Sommer.',
      fr: 'Engadine : transferts depuis Milan et Malpensa, hiver comme été.',
      sq: 'Engadina: transferta nga Milano dhe Malpensa, në dimër dhe verë.',
      ru: 'Энгадин: трансферы из Милана и Мальпенсы зимой и летом.',
    },
    bookTo: 'St. Moritz',
    href: '/services/trasferimenti-internazionali',
  },
  {
    id: 'zurich',
    group: 'intl',
    lat: 47.3769,
    lon: 8.5417,
    km: 280,
    minutes: 210,
    name: { it: 'Zurigo', en: 'Zurich', es: 'Zúrich', de: 'Zürich', fr: 'Zurich', sq: 'Cyrih', ru: 'Цюрих' },
    desc: {
      it: 'Transfer door-to-door verso la Svizzera tedesca.',
      en: 'Door-to-door transfers to German-speaking Switzerland.',
      es: 'Traslados puerta a puerta hacia la Suiza alemana.',
      de: 'Tür-zu-Tür-Transfers in die Deutschschweiz.',
      fr: 'Transferts porte-à-porte vers la Suisse alémanique.',
      sq: 'Transferta derë më derë drejt Zvicrës gjermanofone.',
      ru: 'Трансферы «от двери до двери» в немецкоязычную Швейцарию.',
    },
    bookTo: 'Zurigo',
    href: '/services/trasferimenti-internazionali',
  },
  {
    id: 'geneva',
    group: 'intl',
    lat: 46.2044,
    lon: 6.1432,
    km: 330,
    minutes: 240,
    name: { it: 'Ginevra', en: 'Geneva', es: 'Ginebra', de: 'Genf', fr: 'Genève', sq: 'Gjenevë', ru: 'Женева' },
    desc: {
      it: 'Transfer door-to-door verso il Lago Lemano.',
      en: 'Door-to-door transfers to Lake Geneva.',
      es: 'Traslados puerta a puerta hacia el lago Lemán.',
      de: 'Tür-zu-Tür-Transfers an den Genfersee.',
      fr: 'Transferts porte-à-porte vers le Léman.',
      sq: 'Transferta derë më derë drejt Liqenit të Gjenevës.',
      ru: 'Трансферы «от двери до двери» к Женевскому озеру.',
    },
    bookTo: 'Ginevra',
    href: '/services/trasferimenti-internazionali',
    // Keep clear of the Malpensa pin on narrow screens.
    edge: { y: 430 },
  },
  {
    id: 'nice',
    group: 'intl',
    lat: 43.7102,
    lon: 7.262,
    km: 320,
    minutes: 225,
    name: { it: 'Nizza e Monaco', en: 'Nice & Monaco', es: 'Niza y Mónaco', de: 'Nizza & Monaco', fr: 'Nice et Monaco', sq: 'Nisë dhe Monako', ru: 'Ницца и Монако' },
    desc: {
      it: 'Costa Azzurra e Principato di Monaco.',
      en: 'The French Riviera and the Principality of Monaco.',
      es: 'La Costa Azul y el Principado de Mónaco.',
      de: 'Côte d’Azur und Fürstentum Monaco.',
      fr: 'La Côte d’Azur et la Principauté de Monaco.',
      sq: 'Bregu i Kaltër dhe Principata e Monakos.',
      ru: 'Лазурный Берег и княжество Монако.',
    },
    bookTo: 'Nizza / Monaco',
    href: '/services/trasferimenti-internazionali',
  },
];

export function pointName(p: CoveragePoint, locale: Locale): string {
  return typeof p.name === 'string' ? p.name : (p.name[locale] ?? p.name.it);
}

/** Lat/lon → map units (same projection as the generated geometry). */
export function project(lat: number, lon: number): { x: number; y: number } {
  const { lon0, lat1, cos, k } = GEO_FRAME;
  return { x: (lon - lon0) * cos * k, y: (lat1 - lat) * k };
}

const EDGE = 34;

/**
 * Where a point sits on the map. Points outside the frame are pinned to its
 * edge along the line from Milan, and flagged `off` (drawn as an arrow chip).
 */
export function mapPosition(p: CoveragePoint): { x: number; y: number; off: boolean; angle: number } {
  const hub = project(45.4642, 9.19);
  const raw = project(p.lat, p.lon);
  const { width: W, height: H } = GEO_FRAME;
  const angle = (Math.atan2(raw.y - hub.y, raw.x - hub.x) * 180) / Math.PI;
  if (raw.x >= EDGE && raw.x <= W - EDGE && raw.y >= EDGE && raw.y <= H - EDGE) {
    return { ...raw, off: false, angle };
  }
  const dx = raw.x - hub.x;
  const dy = raw.y - hub.y;
  const ts = [
    dx > 0 ? (W - EDGE - hub.x) / dx : dx < 0 ? (EDGE - hub.x) / dx : Infinity,
    dy > 0 ? (H - EDGE - hub.y) / dy : dy < 0 ? (EDGE - hub.y) / dy : Infinity,
  ];
  const t = Math.min(...ts.filter((v) => v > 0));
  return { x: p.edge?.x ?? hub.x + dx * t, y: p.edge?.y ?? hub.y + dy * t, off: true, angle };
}

/** "50 min", "1 h 20", "3 h" — units come from the dictionary. */
export function formatDuration(minutes: number, unitMin: string, unitHour: string): string {
  if (minutes < 60) return `${minutes} ${unitMin}`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} ${unitHour} ${String(m).padStart(2, '0')}` : `${h} ${unitHour}`;
}
