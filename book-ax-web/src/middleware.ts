import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

const intlMiddleware = createIntlMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,
  
  // Always use a locale prefix
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for API routes (except media subdomain)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check if request is from media.book.ax subdomain
  const hostname = request.headers.get('host') || '';
  
  if (hostname.startsWith('media.')) {
    // Rewrite all media.book.ax requests to /api/media/[...path]
    // Remove leading slash if present
    const path = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    
    // Rewrite to media API
    return NextResponse.rewrite(
      new URL(`/api/media/${path}`, request.url)
    );
  }

  // For all other requests, use next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next` or `/_vercel`
  // - … if they start with `/api` (API routes, except media subdomain)
  // - … the ones containing a dot in the first segment (e.g. `favicon.ico`)
  matcher: ['/((?!_next|_vercel|api(?!/media)|.*\\..*).*)', '/api/media/:path*']
};
