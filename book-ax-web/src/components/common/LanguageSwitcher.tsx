'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { languageNames, locales, type Locale } from '@/i18n/config';

const flagEmojis: Record<Locale, string> = {
  da: '🇩�',
  de: '��',
  en: '��',
  es: '🇪🇸',
  fr: '🇫🇷',
  it: '🇮🇹',
  no: '🇳�',
  pl: '🇵🇱',
  sv: '🇸�',
  tr: '🇹�',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: Locale) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    
    // Set cookie before navigation
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    
    // Force full page reload to load new translations
    window.location.href = newPath;
  };

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
