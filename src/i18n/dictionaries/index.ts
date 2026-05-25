import type { Dictionary, Locale } from '../types';
import it from './it';
import en from './en';
import es from './es';
import de from './de';
import fr from './fr';
import sq from './sq';
import ru from './ru';

export const dictionaries: Record<Locale, Dictionary> = {
  it,
  en,
  es,
  de,
  fr,
  sq,
  ru,
};
