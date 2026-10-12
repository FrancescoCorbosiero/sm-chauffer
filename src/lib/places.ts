import { COVERAGE_POINTS, HUB_ID, type CoveragePoint } from './coverage';

/**
 * Frequent pickup / drop-off points, offered as type-ahead suggestions in
 * the booking forms (native <datalist>). Names stay in Italian: they end
 * up in the request the operator reads.
 */
export const POPULAR_PLACES = [
  'Aeroporto di Milano Malpensa (MXP)',
  'Aeroporto di Milano Linate (LIN)',
  'Aeroporto di Bergamo Orio al Serio (BGY)',
  'Milano centro',
  'Stazione di Milano Centrale',
  'Fiera Milano Rho',
  'Monza',
  'Como',
  'Cernobbio',
  'Bellagio',
  'Tremezzo',
  'Menaggio',
  'Varenna',
  'Lecco',
  'Lugano',
  'St. Moritz',
] as const;

/** Short labels for one-tap destination chips. */
export const QUICK_DESTINATIONS = [
  { label: 'Malpensa', value: 'Aeroporto di Milano Malpensa (MXP)' },
  { label: 'Linate', value: 'Aeroporto di Milano Linate (LIN)' },
  { label: 'Orio al Serio', value: 'Aeroporto di Bergamo Orio al Serio (BGY)' },
  { label: 'Milano', value: 'Milano centro' },
  { label: 'Como', value: 'Como' },
  { label: 'Bellagio', value: 'Bellagio' },
] as const;

/* ------------------------------------------------------------------ */
/* Gazetteer: the places the booking app recognises in free text, to draw
   the trip on the map and give an indicative distance and drive time. */

export type PlaceKind = 'airport' | 'station' | 'venue' | 'city' | 'lake' | 'intl';

export interface Place {
  id: string;
  /** What goes into the request (Italian, as the operator reads it). */
  value: string;
  kind: PlaceKind;
  /** IATA code for airports. */
  code?: string;
  lat: number;
  lon: number;
  /** Coverage point with curated figures from central Milan, if any. */
  point?: CoveragePoint;
  /** Lower-case, accent-free names that identify the place in free text. */
  aliases: string[];
}

const KIND_OF: Record<CoveragePoint['group'], PlaceKind> = {
  city: 'city',
  lake: 'lake',
  airport: 'airport',
  intl: 'intl',
};

/** Extra names per coverage point (the localized names are added too). */
const ALIASES: Record<string, string[]> = {
  milano: ['milano', 'milano centro', 'milan', 'mailand', 'milao', 'milanu'],
  monza: ['monza', 'autodromo di monza', 'autodromo nazionale'],
  brianza: [
    'brianza',
    'seregno',
    'desio',
    'lissone',
    'carate brianza',
    'meda',
    'cantu',
    'cesano maderno',
    'seveso',
    'giussano',
    'arcore',
    'vimercate',
  ],
  como: ['como', 'villa olmo'],
  lecco: ['lecco'],
  cernobbio: ['cernobbio', "villa d'este", 'villa d este', 'villa erba'],
  tremezzo: ['tremezzo', 'tremezzina', 'villa carlotta'],
  bellagio: ['bellagio'],
  menaggio: ['menaggio'],
  varenna: ['varenna'],
  mxp: ['malpensa', 'mxp'],
  lin: ['linate', 'lin'],
  bgy: ['orio al serio', 'orio', 'bgy'],
  lugano: ['lugano'],
  stmoritz: ['st. moritz', 'st moritz', 'sankt moritz', 'san maurizio'],
  zurich: ['zurigo', 'zurich', 'zuerich', 'zurych'],
  geneva: ['ginevra', 'geneva', 'geneve', 'genf', 'ginebra'],
  nice: ['nizza', 'nice', 'niza', 'montecarlo', 'monte carlo', 'principato di monaco'],
};

const EXTRA: Place[] = [
  {
    id: 'centrale',
    value: 'Stazione di Milano Centrale',
    kind: 'station',
    lat: 45.4859,
    lon: 9.2035,
    aliases: ['milano centrale', 'stazione centrale', 'central station', 'stazione di milano centrale'],
  },
  {
    id: 'fiera',
    value: 'Fiera Milano Rho',
    kind: 'venue',
    lat: 45.5209,
    lon: 9.087,
    aliases: ['fiera milano', 'fiera rho', 'rho fiera', 'rho'],
  },
  {
    id: 'bergamo',
    value: 'Bergamo',
    kind: 'city',
    lat: 45.6983,
    lon: 9.6773,
    aliases: ['bergamo', 'bergame', 'бергамо'],
  },
];

/** A city named together with "airport" means its airport. */
const AIRPORT_OF: Record<string, string> = { bergamo: 'bgy' };
const AIRPORT_WORD = /aeroport|airport|flughafen|aeropuerto|аэропорт/;

/** Street types: "Viale Monza, Milano" is in Milan, not in Monza. */
const STREET_BEFORE =
  /(^|\s)(via|viale|v\.le|corso|c\.so|piazza|piazzale|p\.za|p\.zza|p\.le|largo|vicolo|strada|str\.|alzaia|bastioni|lungolago|riva|salita|galleria|passaggio|ponte)(\s+(di|del|della|dello|dei|degli|delle|per))?\s*$/;

/** Lower-case, accents stripped, punctuation folded to spaces. */
export function normalizePlace(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’`´]/g, "'")
    .replace(/[^\p{L}\p{N}'.]+/gu, ' ')
    .trim();
}

/** The point's names in every language, also without the airport code. */
function pointNames(p: CoveragePoint): string[] {
  const names = typeof p.name === 'string' ? [p.name] : Object.values(p.name);
  return names.flatMap((n) => [n, n.replace(/\([^)]*\)/g, ' ')]);
}

export const PLACES: Place[] = [
  ...COVERAGE_POINTS.map<Place>((p) => ({
    id: p.id,
    value: p.bookTo,
    kind: KIND_OF[p.group],
    code: p.group === 'airport' ? p.bookTo.match(/\(([A-Z]{3})\)/)?.[1] : undefined,
    lat: p.lat,
    lon: p.lon,
    point: p,
    aliases: [...new Set([...(ALIASES[p.id] ?? []), ...pointNames(p)].map(normalizePlace))],
  })),
  ...EXTRA,
];

const BY_ID = new Map(PLACES.map((p) => [p.id, p]));
export const getPlace = (id: string) => BY_ID.get(id);

// More specific kinds win when a text names two places
// ("Aeroporto di Milano Malpensa" is Malpensa, not Milan).
const KIND_RANK: Record<PlaceKind, number> = {
  airport: 4,
  station: 4,
  venue: 3,
  lake: 2,
  intl: 2,
  city: 1,
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const MATCHERS = PLACES.flatMap((place) =>
  place.aliases.map((alias) => ({
    place,
    alias,
    re: new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(alias)}(?=$|[^\\p{L}\\p{N}])`, 'gu'),
  })),
);

/** Whether `alias` names the place somewhere in `q` (not as a street name). */
function names(q: string, re: RegExp): boolean {
  re.lastIndex = 0;
  for (let m = re.exec(q); m; m = re.exec(q)) {
    const start = m.index + m[1].length;
    if (!STREET_BEFORE.test(q.slice(0, start))) return true;
    re.lastIndex = start + 1;
  }
  return false;
}

/** The place a free-text pickup or destination refers to, if any. */
export function matchPlace(text: string): Place | null {
  const q = normalizePlace(text);
  if (q.length < 2) return null;
  let best: { place: Place; score: number } | null = null;
  for (const m of MATCHERS) {
    if (!names(q, m.re)) continue;
    const score = KIND_RANK[m.place.kind] * 100 + m.alias.length;
    if (!best || score > best.score) best = { place: m.place, score };
  }
  const airport = best && AIRPORT_WORD.test(q) ? AIRPORT_OF[best.place.id] : undefined;
  return (airport && getPlace(airport)) || (best?.place ?? null);
}

/** Suggestions for a pickup/destination field, best first. */
export function searchPlaces(query: string, opts: { airportsFirst?: boolean; limit?: number } = {}): Place[] {
  const q = normalizePlace(query);
  const order = (p: Place) => (opts.airportsFirst && p.kind === 'airport' ? 0 : 1);
  const base = [...PLACES].sort((a, b) => order(a) - order(b));
  if (!q) return base.slice(0, opts.limit ?? 8);
  const hits = base
    .map((p) => {
      const value = normalizePlace(p.value);
      const starts = p.aliases.some((a) => a.startsWith(q)) || value.startsWith(q);
      const contains = starts || p.aliases.some((a) => a.includes(q)) || value.includes(q);
      return { p, rank: starts ? 0 : contains ? 1 : 2 };
    })
    .filter((h) => h.rank < 2)
    .sort((a, b) => a.rank - b.rank);
  return hits.map((h) => h.p).slice(0, opts.limit ?? 8);
}

/* ------------------------------------------------------------------ */
/* Indicative distance and drive time between two places. */

export interface RouteInfo {
  km: number;
  minutes: number;
}

/** Places whose curated figures are measured from (central Milan). */
const MILAN_LIKE = new Set([HUB_ID, 'centrale']);

function haversineKm(a: Place, b: Place): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const round5 = (n: number) => Math.max(5, Math.round(n / 5) * 5);

/**
 * From central Milan the curated figures of the coverage map are used;
 * between other places, the straight line × 1.3 for the road and a drive
 * time fitted on those same figures. Always shown as indicative.
 */
export function routeBetween(a: Place, b: Place): RouteInfo | null {
  if (a.id === b.id) return null;
  if (MILAN_LIKE.has(a.id) && b.point && b.point.id !== HUB_ID) return { km: b.point.km, minutes: b.point.minutes };
  if (MILAN_LIKE.has(b.id) && a.point && a.point.id !== HUB_ID) return { km: a.point.km, minutes: a.point.minutes };
  const km = haversineKm(a, b) * 1.3;
  return { km: round5(km), minutes: round5(12 + 0.85 * km) };
}
