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
