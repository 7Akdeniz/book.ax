import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales, type Locale, defaultLocale} from './config';

export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // For admin routes or routes without locale, use default locale (en)
  // This prevents notFound() from being called for /admin paths
  if (!locale || !locales.includes(locale as Locale)) {
    // Check if this is an admin route or other non-localized route
    // In such cases, return default locale instead of throwing notFound()
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
