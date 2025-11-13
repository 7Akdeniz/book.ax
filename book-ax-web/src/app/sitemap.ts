import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://book-ax.vercel.app';
  
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

  // TODO: Add dynamic hotel pages when hotels are available in production
  // Example:
  // const { data: hotels } = await supabase
  //   .from('hotels')
  //   .select('id, updated_at')
  //   .eq('status', 'active');
  // 
  // const hotelRoutes = hotels?.flatMap(hotel =>
  //   locales.map(locale => ({
  //     url: `${baseUrl}/${locale}/hotel/${hotel.id}`,
  //     lastModified: new Date(hotel.updated_at),
  //     changeFrequency: 'weekly' as const,
  //     priority: 0.6,
  //   }))
  // ) || [];

  return [...staticRoutes];
}
