'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { languageNames, locales, type Locale } from '@/i18n/config';

// Flag emojis for all 50 languages
const flagEmojis: Record<Locale, string> = {
  // Top 9 languages
  de: '🇩🇪',
  en: '🇬🇧',
  zh: '🇨🇳',
  hi: '🇮🇳',
  es: '🇪🇸',
  ar: '🇸🇦',
  fr: '🇫🇷',
  tr: '🇷',
  ru: '🇷🇺',
  // Remaining 41 languages (alphabetically)
  am: '��',
  az: '�🇿',
  bn: '��',
  my: '��',
  ceb: '��',
  cs: '��',
  nl: '🇱',
  fil: '��',
  el: '�🇷',
  gu: '🇮�',
  he: '🇮�',
  ha: '🇳🇬',
  id: '��',
  it: '��',
  ja: '��',
  jv: '🇮�',
  kn: '��',
  ko: '��',
  ms: '🇲�',
  ml: '🇮🇳',
  mr: '🇮🇳',
  ne: '��',
  om: '🇪🇹',
  fa: '��',
  pl: '🇱',
  pa: '🇮�',
  ro: '🇷🇴',
  sr: '🇸',
  sd: '��',
  si: '��',
  so: '🇸🇴',
  sw: '�🇿',
  ta: '��',
  te: '🇮🇳',
  th: '��',
  uk: '�🇦',
  ur: '��',
  vi: '🇻🇳',
  yo: '🇳🇬',
  zu: '��',
  pt: '�🇹',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: Locale) => {
    // Replace current locale in path with new locale
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    
    router.push(newPath);
    
    // Store in cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
  };

  // Keep the order from i18n.ts: Top 9 first, then alphabetically sorted
  const orderedLocales = locales;

  return (
    <select
      value={locale}
      onChange={(e) => switchLanguage(e.target.value as Locale)}
      className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
      aria-label="Select language"
      style={{ fontFamily: 'system-ui, -apple-system' }}
    >
      {orderedLocales.map((loc) => (
        <option key={loc} value={loc}>
          {flagEmojis[loc]} {languageNames[loc]}
        </option>
      ))}
    </select>
  );
}
