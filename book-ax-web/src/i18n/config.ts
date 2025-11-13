// Top 50 supported languages - Top 9 fixed, rest alphabetically sorted
export const locales = [
  // Top 9 languages (fixed order)
  'de', 'en', 'zh', 'hi', 'es', 'ar', 'fr', 'tr', 'ru',
  // Remaining 41 languages (alphabetically sorted by English name)
  'am', 'az', 'bn', 'my', 'ceb', 'cs', 'nl', 'fil', 'el', 'gu',
  'he', 'ha', 'id', 'it', 'ja', 'jv', 'kn', 'ko', 'ms', 'ml',
  'mr', 'ne', 'om', 'fa', 'pl', 'pa', 'ro', 'sr', 'sd', 'si',
  'so', 'sw', 'ta', 'te', 'th', 'uk', 'ur', 'vi', 'yo', 'zu',
  'pt'
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Language names in their native form
export const languageNames: Record<Locale, string> = {
  // Top 9 languages
  de: 'Deutsch',
  en: 'English',
  zh: '中文',
  hi: 'हिन्दी',
  es: 'Español',
  ar: 'العربية',
  fr: 'Français',
  tr: 'Türkçe',
  ru: 'Русский',
  // Remaining languages (alphabetically)
  am: 'አማርኛ',
  az: 'Azərbaycan',
  bn: 'বাংলা',
  my: 'မြန်မာ',
  ceb: 'Cebuano',
  cs: 'Čeština',
  nl: 'Nederlands',
  fil: 'Filipino',
  el: 'Ελληνικά',
  gu: 'ગુજરાતી',
  he: 'עברית',
  ha: 'Hausa',
  id: 'Bahasa Indonesia',
  it: 'Italiano',
  ja: '日本語',
  jv: 'Basa Jawa',
  kn: 'ಕನ್ನಡ',
  ko: '한국어',
  ms: 'Bahasa Melayu',
  ml: 'മലയാളം',
  mr: 'मराठी',
  ne: 'नेपाली',
  om: 'Afaan Oromoo',
  fa: 'فارسی',
  pl: 'Polski',
  pa: 'ਪੰਜਾਬੀ',
  ro: 'Română',
  sr: 'Српски',
  sd: 'سنڌي',
  si: 'සිංහල',
  so: 'Soomaali',
  sw: 'Kiswahili',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  th: 'ไทย',
  uk: 'Українська',
  ur: 'اردو',
  vi: 'Tiếng Việt',
  yo: 'Yorùbá',
  zu: 'isiZulu',
  pt: 'Português',
};
