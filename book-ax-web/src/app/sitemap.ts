import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { getHotelsForSitemap } from '@/lib/db/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://book.ax';
  
  // Static pages for all locales
  const staticPages = [
    '', // Homepage
    '/search',
    '/help',
    '/privacy',
    '/terms',
    '/cookies',
    '/login',
    '/register',
  ];
  
  // Generate routes for all locales
  const staticRoutes = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'daily' as const : 'weekly' as const,
      priority: page === '' ? 1.0 : 0.8,
    }))
  );

  // ✅ Fetch dynamic hotel pages from database
  const hotels = await getHotelsForSitemap();
  
  const hotelRoutes = hotels.flatMap(hotel =>
    locales.map(locale => ({
      url: `${baseUrl}/${locale}/hotel/${hotel.id}`,
      lastModified: new Date(hotel.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  console.log(`✅ Sitemap generated: ${staticRoutes.length} static + ${hotelRoutes.length} hotel pages`);

  return [...staticRoutes, ...hotelRoutes];
}
