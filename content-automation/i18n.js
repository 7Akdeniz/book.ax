/**
 * Multi-Language Support für Book.ax Content Automation
 * Unterstützt 75 Sprachen (wie in Book.ax Web App)
 */

import { LANGUAGES } from './config.js';

/**
 * Sprachspezifische CTAs
 */
export const CTAs = {
  de: 'Jetzt Hotels vergleichen auf Book.ax',
  en: 'Compare hotels now on Book.ax',
  es: 'Compara hoteles ahora en Book.ax',
  fr: 'Comparez les hôtels maintenant sur Book.ax',
  it: 'Confronta gli hotel ora su Book.ax',
  pt: 'Compare hotéis agora no Book.ax',
  nl: 'Vergelijk nu hotels op Book.ax',
  ru: 'Сравните отели сейчас на Book.ax',
  zh: '立即在 Book.ax 上比较酒店',
  ja: 'Book.axでホテルを今すぐ比較',
  ko: '지금 Book.ax에서 호텔 비교',
  ar: 'قارن الفنادق الآن على Book.ax',
  hi: 'Book.ax पर अभी होटल की तुलना करें',
  tr: 'Book.ax\'te şimdi otelleri karşılaştırın'
};

/**
 * Sprachspezifische Keywords
 */
export const KeywordsByLanguage = {
  de: {
    main: 'Hotels vergleichen',
    search: 'Hotelsuche',
    price: 'Hotelpreise',
    best: 'Beste Hotels',
    cheap: 'Günstige Hotels',
    luxury: 'Luxushotels',
    booking: 'Hotelbuchung'
  },
  en: {
    main: 'Compare hotels',
    search: 'Hotel search',
    price: 'Hotel prices',
    best: 'Best hotels',
    cheap: 'Cheap hotels',
    luxury: 'Luxury hotels',
    booking: 'Hotel booking'
  },
  es: {
    main: 'Comparar hoteles',
    search: 'Búsqueda de hoteles',
    price: 'Precios de hoteles',
    best: 'Mejores hoteles',
    cheap: 'Hoteles baratos',
    luxury: 'Hoteles de lujo',
    booking: 'Reserva de hotel'
  },
  fr: {
    main: 'Comparer les hôtels',
    search: 'Recherche d\'hôtel',
    price: 'Prix des hôtels',
    best: 'Meilleurs hôtels',
    cheap: 'Hôtels pas chers',
    luxury: 'Hôtels de luxe',
    booking: 'Réservation d\'hôtel'
  }
};

/**
 * Übersetzt Content in Zielsprache
 * (Vereinfachte Version - in Produktion: externe Translation API)
 */
export function translateContent(content, targetLang = 'en') {
  if (targetLang === 'de') return content;
  
  // Einfache Placeholder-Ersetzung für Demo
  const cta = CTAs[targetLang] || CTAs.en;
  const keywords = KeywordsByLanguage[targetLang] || KeywordsByLanguage.en;
  
  // CTA ersetzen
  let translated = content.replace(/Jetzt Hotels vergleichen auf Book\.ax/g, cta);
  
  // Keywords ersetzen (vereinfacht)
  translated = translated.replace(/Hotels vergleichen/g, keywords.main);
  translated = translated.replace(/Hotelsuche/g, keywords.search);
  
  return translated;
}

/**
 * Generiert sprachspezifische SEO-Meta-Daten
 */
export function getLocalizedSEO(city, language = 'de') {
  const keywords = KeywordsByLanguage[language] || KeywordsByLanguage.de;
  const cta = CTAs[language] || CTAs.de;
  
  return {
    title: `${keywords.main} ${city} | Book.ax`,
    meta: `Book.ax ${keywords.search} - ${keywords.price} ${city}. ${cta}.`,
    h1: `${keywords.main} ${city}`,
    cta
  };
}

/**
 * Verfügbare Sprachen mit Metadaten
 */
export const LanguageMetadata = {
  // Top 9
  de: { name: 'Deutsch', rtl: false, region: 'Europe' },
  en: { name: 'English', rtl: false, region: 'Global' },
  zh: { name: '中文', rtl: false, region: 'Asia' },
  hi: { name: 'हिन्दी', rtl: false, region: 'Asia' },
  es: { name: 'Español', rtl: false, region: 'Europe/Americas' },
  ar: { name: 'العربية', rtl: true, region: 'Middle East' },
  fr: { name: 'Français', rtl: false, region: 'Europe' },
  tr: { name: 'Türkçe', rtl: false, region: 'Europe/Asia' },
  ru: { name: 'Русский', rtl: false, region: 'Europe/Asia' },
  
  // Weitere wichtige Sprachen
  pt: { name: 'Português', rtl: false, region: 'Europe/Americas' },
  ja: { name: '日本語', rtl: false, region: 'Asia' },
  ko: { name: '한국어', rtl: false, region: 'Asia' },
  it: { name: 'Italiano', rtl: false, region: 'Europe' },
  nl: { name: 'Nederlands', rtl: false, region: 'Europe' }
};

export default {
  CTAs,
  KeywordsByLanguage,
  translateContent,
  getLocalizedSEO,
  LanguageMetadata
};
