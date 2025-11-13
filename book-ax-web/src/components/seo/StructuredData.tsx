/**
 * Schema.org Structured Data Components
 * 
 * These components generate JSON-LD structured data for better SEO
 * and rich snippets in search results.
 * 
 * Benefits:
 * - Google Rich Results (hotel cards, ratings)
 * - Better click-through rates
 * - Enhanced search appearance
 * 
 * Documentation: https://schema.org/Hotel
 */

import { ReactElement } from 'react';

// ==============================================
// TYPE DEFINITIONS
// ==============================================

export interface HotelSchemaProps {
  name: string;
  description: string;
  url: string;
  image: string | string[];
  address: {
    streetAddress: string;
    addressLocality: string; // City
    addressRegion?: string; // State/Province
    postalCode: string;
    addressCountry: string; // ISO 3166-1 alpha-2 code (e.g., "DE", "US")
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  priceRange?: string; // e.g., "$$", "$$$", or "€50-€200"
  starRating?: number; // Hotel star rating (1-5)
  telephone?: string;
  email?: string;
  amenityFeature?: string[]; // e.g., ["Free WiFi", "Pool", "Gym"]
  checkInTime?: string; // e.g., "14:00"
  checkOutTime?: string; // e.g., "11:00"
}

export interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo: string;
  description?: string;
  contactPoint?: {
    telephone: string;
    contactType: string; // e.g., "customer service"
    availableLanguage: string[]; // e.g., ["de", "en"]
  };
  sameAs?: string[]; // Social media URLs
}

export interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

// ==============================================
// HOTEL STRUCTURED DATA
// ==============================================

export function HotelStructuredData({ 
  name,
  description,
  url,
  image,
  address,
  geo,
  aggregateRating,
  priceRange,
  starRating,
  telephone,
  email,
  amenityFeature,
  checkInTime = '14:00',
  checkOutTime = '11:00',
}: HotelSchemaProps): ReactElement {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name,
    description,
    url,
    image: Array.isArray(image) ? image : [image],
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    },
    ...(geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
    ...(aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
        bestRating: aggregateRating.bestRating || 5,
        worstRating: aggregateRating.worstRating || 1,
      },
    }),
    ...(priceRange && { priceRange }),
    ...(starRating && { 
      starRating: {
        '@type': 'Rating',
        ratingValue: starRating,
      }
    }),
    ...(telephone && { telephone }),
    ...(email && { email }),
    ...(amenityFeature && {
      amenityFeature: amenityFeature.map(amenity => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity,
      })),
    }),
    checkinTime: checkInTime,
    checkoutTime: checkOutTime,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ==============================================
// ORGANIZATION STRUCTURED DATA (Homepage)
// ==============================================

export function OrganizationStructuredData({
  name = 'Book.ax',
  url = 'https://book-ax.vercel.app',
  logo = 'https://book-ax.vercel.app/logo.png',
  description = 'Book hotels worldwide - Over 500,000 properties with the best prices',
  contactPoint,
  sameAs,
}: Partial<OrganizationSchemaProps> = {}): ReactElement {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    ...(contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: contactPoint.telephone,
        contactType: contactPoint.contactType,
        availableLanguage: contactPoint.availableLanguage,
      },
    }),
    ...(sameAs && { sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ==============================================
// BREADCRUMB STRUCTURED DATA
// ==============================================

export function BreadcrumbStructuredData({ items }: BreadcrumbSchemaProps): ReactElement {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ==============================================
// SEARCH ACTION STRUCTURED DATA (Homepage)
// ==============================================

export function SearchActionStructuredData(): ReactElement {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://book-ax.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://book-ax.vercel.app/search?destination={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ==============================================
// FAQ STRUCTURED DATA (Help Page)
// ==============================================

export interface FAQItem {
  question: string;
  answer: string;
}

export function FAQStructuredData({ items }: { items: FAQItem[] }): ReactElement {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
