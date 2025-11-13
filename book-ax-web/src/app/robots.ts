import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/panel/',
          '/_next/',
          '/admin/',
          '/private/',
        ],
      },
      // Be nice to search engine crawlers
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/panel/', '/admin/'],
      },
    ],
    sitemap: 'https://book-ax.vercel.app/sitemap.xml',
  };
}
