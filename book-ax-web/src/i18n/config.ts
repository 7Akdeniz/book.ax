// Supported languages - 10 languages (alphabetically sorted)
export const locales = [
  'da', 'de', 'en', 'es', 'fr', 'it', 'no', 'pl', 'sv', 'tr'
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Language names in their native form
export const languageNames: Record<Locale, string> = {
  da: 'Dansk',
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  no: 'Norsk',
  pl: 'Polski',
  sv: 'Svenska',
  tr: 'Türkçe',
};
