import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales, type Locale} from './config';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  // Try to load the locale's messages, fallback to English if not found
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    // Fallback to English if translation file doesn't exist
    console.warn(`Translation file for locale "${locale}" not found, falling back to English`);
    messages = (await import(`../../messages/en.json`)).default;
  }

  return {
    messages
  };
});
