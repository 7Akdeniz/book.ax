import { format, formatDistance, formatRelative, parseISO, differenceInDays } from 'date-fns';
import { de, enUS, es, fr, ar, zhCN, ja, ko } from 'date-fns/locale';

// Get locale object for date-fns
const getDateLocale = (locale: string) => {
  const locales: Record<string, any> = {
    en: enUS,
    de,
    es,
    fr,
    ar,
    zh: zhCN,
    ja,
    ko,
  };
  return locales[locale] || enUS;
};

// Format date to localized string
export const formatDate = (date: string | Date, formatStr: string = 'PP', locale: string = 'en'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: getDateLocale(locale) });
};

// Format date to short format (e.g., "Jan 15, 2024")
export const formatShortDate = (date: string | Date, locale: string = 'en'): string => {
  return formatDate(date, 'PP', locale);
};

// Format date to long format (e.g., "January 15, 2024")
export const formatLongDate = (date: string | Date, locale: string = 'en'): string => {
  return formatDate(date, 'PPP', locale);
};

// Format date with time (e.g., "Jan 15, 2024 at 3:30 PM")
export const formatDateTime = (date: string | Date, locale: string = 'en'): string => {
  return formatDate(date, 'PPp', locale);
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date: string | Date, baseDate: Date = new Date(), locale: string = 'en'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatRelative(dateObj, baseDate, { locale: getDateLocale(locale) });
};

// Format distance (e.g., "2 days")
export const formatDistanceTime = (date: string | Date, baseDate: Date = new Date(), locale: string = 'en'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, baseDate, { locale: getDateLocale(locale), addSuffix: true });
};

// Calculate number of nights
export const calculateNights = (checkIn: string | Date, checkOut: string | Date): number => {
  const checkInDate = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;
  return differenceInDays(checkOutDate, checkInDate);
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'EUR', locale: string = 'en'): string => {
  const localeMap: Record<string, string> = {
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
    it: 'it-IT',
    pt: 'pt-PT',
    ja: 'ja-JP',
    zh: 'zh-CN',
    ko: 'ko-KR',
    ar: 'ar-SA',
  };

  const formatterLocale = localeMap[locale] || 'en-US';

  return new Intl.NumberFormat(formatterLocale, {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format number
export const formatNumber = (num: number, locale: string = 'en', decimals?: number): string => {
  const localeMap: Record<string, string> = {
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
  };

  const formatterLocale = localeMap[locale] || 'en-US';

  return new Intl.NumberFormat(formatterLocale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

// Format percentage
export const formatPercentage = (value: number, locale: string = 'en', decimals: number = 0): string => {
  const localeMap: Record<string, string> = {
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
  };

  const formatterLocale = localeMap[locale] || 'en-US';

  return new Intl.NumberFormat(formatterLocale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

// Format rating (e.g., "4.5 out of 5")
export const formatRating = (rating: number, maxRating: number = 5): string => {
  return `${rating.toFixed(1)} / ${maxRating}`;
};

// Truncate text
export const truncateText = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length).trim() + suffix;
};

// Capitalize first letter
export const capitalizeFirst = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length (simple international format)
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone; // Return original if can't format
};

// Format booking reference
export const formatBookingReference = (ref: string): string => {
  // BKX-20240115-ABC123 -> BKX-2024-0115-ABC123 (more readable)
  if (ref.match(/^BKX-\d{8}-[A-Z0-9]+$/)) {
    const parts = ref.split('-');
    const date = parts[1];
    return `${parts[0]}-${date.slice(0, 4)}-${date.slice(4)}-${parts[2]}`;
  }
  return ref;
};
