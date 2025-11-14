/**
 * Book.ax Content Automation - Konfiguration
 * AIO-optimiert, SEO-ready, Multi-Language
 */

export const BRAND = {
  name: 'Book.ax',
  tagline: 'Die moderne Hotelsuchmaschine',
  color: '#9C27B0',
  cta: 'Jetzt Hotels vergleichen auf Book.ax',
  benefits: [
    'Hotelpreise weltweit vergleichen',
    'Bestpreis-Fokus',
    'Schnell, modern, transparent',
    'Über 500.000+ Hotels weltweit',
    'Keine versteckten Kosten'
  ],
  tone: {
    style: 'AIO',
    rules: [
      'Klar, modern, einfach',
      'Kurze Sätze',
      'Menschlicher Ton',
      'Sofort verständlich'
    ]
  }
};

export const SEO = {
  titleTemplate: '{{keyword}} – {{benefit}} | Book.ax',
  metaTemplate: 'Book.ax vergleicht {{keyword}} in Sekunden. {{benefit}}. Jetzt Hotels vergleichen auf Book.ax.',
  h1Template: '{{keyword}} – moderne Hotelsuchmaschine',
  
  lsiKeywords: [
    'hotel deals vergleichen',
    'bestpreis garantie',
    'weltweit hotelpreise in echtzeit',
    'transparente preise ohne versteckte kosten',
    'hotelvergleich schnell & einfach',
    'hotelsuchmaschine modern',
    'günstige hotels finden',
    'hotel preisvergleich online',
    'beste hoteldeals',
    'hotelsuche weltweit'
  ],
  
  keywordClusters: {
    main: ['hotelpreise vergleichen', 'hotel vergleich', 'hotelsuchmaschine'],
    longtail: [
      'luxus hotels {{city}} mit bestpreis',
      'günstige hotels {{city}} vergleichen',
      'business hotels {{city}} preise',
      'familienhotels {{city}} angebote'
    ],
    questions: [
      'Wie finde ich den besten Hotelpreis?',
      'Wo kann ich Hotelpreise vergleichen?',
      'Welche Hotelsuchmaschine ist die beste?',
      'Wie spare ich bei Hotelbuchungen?'
    ]
  }
};

export const LANGUAGES = {
  // Top 9 Sprachen
  top: ['de', 'en', 'zh', 'hi', 'es', 'ar', 'fr', 'tr', 'ru'],
  
  // 75 Sprachen insgesamt (wie in Book.ax Web App)
  all: [
    'de', 'en', 'zh', 'hi', 'es', 'ar', 'fr', 'tr', 'ru',
    'pt', 'ja', 'ko', 'it', 'nl', 'pl', 'sv', 'no', 'da',
    'fi', 'cs', 'hu', 'ro', 'uk', 'el', 'th', 'vi', 'id',
    'ms', 'tl', 'he', 'fa', 'ur', 'bn', 'ta', 'te', 'mr',
    'gu', 'kn', 'ml', 'pa', 'sw', 'zu', 'af', 'am', 'my',
    'km', 'lo', 'si', 'ne', 'dz', 'bo', 'ug', 'ka', 'hy',
    'az', 'kk', 'uz', 'tg', 'tk', 'mn', 'ky', 'ps', 'ku',
    'sd', 'yi', 'eu', 'ca', 'gl', 'cy', 'ga', 'mt', 'is',
    'sq', 'mk', 'sr', 'hr', 'bs', 'sl'
  ],
  
  names: {
    de: 'Deutsch',
    en: 'English',
    es: 'Español',
    fr: 'Français',
    zh: '中文',
    ar: 'العربية',
    hi: 'हिन्दी',
    tr: 'Türkçe',
    ru: 'Русский'
  }
};

export const CONTENT_TYPES = {
  blog: {
    name: 'Blog Artikel',
    minWords: 800,
    maxWords: 1500,
    sections: ['intro', 'benefits', 'howto', 'tips', 'cta', 'faq']
  },
  landing: {
    name: 'Landing Page',
    minWords: 400,
    maxWords: 800,
    sections: ['hero', 'highlights', 'comparison', 'testimonials', 'cta', 'faq']
  },
  social: {
    name: 'Social Media Post',
    maxChars: 280,
    platforms: ['instagram', 'tiktok', 'twitter', 'facebook']
  },
  ads: {
    name: 'Ads Text',
    headlines: 3,
    descriptions: 2,
    platforms: ['google', 'meta', 'instagram']
  },
  guide: {
    name: 'Reise-Guide',
    minWords: 600,
    maxWords: 1200,
    sections: ['intro', 'attractions', 'hotels', 'tips', 'cta']
  },
  hotelDescription: {
    name: 'Hotel Beschreibung',
    minWords: 150,
    maxWords: 300,
    sections: ['ambience', 'features', 'price', 'cta']
  },
  microPost: {
    name: 'Mikro-Post',
    maxChars: 150,
    types: ['deal', 'tip', 'announcement']
  },
  faq: {
    name: 'FAQ Block',
    questions: 5,
    schema: 'FAQPage'
  },
  richSnippet: {
    name: 'Rich Snippet',
    maxWords: 200,
    schema: 'Article'
  }
};

export default {
  BRAND,
  SEO,
  LANGUAGES,
  CONTENT_TYPES
};
