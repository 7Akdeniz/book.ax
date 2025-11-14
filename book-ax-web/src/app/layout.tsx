import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://book-ax.vercel.app'),
  title: {
    default: 'Book.ax - Find Your Perfect Stay',
    template: '%s | Book.ax',
  },
  description: 'Book hotels worldwide - Over 500,000 properties with the best prices. Discover your perfect stay with Book.ax.',
  keywords: [
    'hotel booking',
    'hotels',
    'accommodation',
    'travel',
    'vacation',
    'booking',
    'cheap hotels',
    'hotel deals',
    'best price guarantee',
  ],
  authors: [{ name: 'Book.ax Team' }],
  creator: 'Book.ax',
  publisher: 'Book.ax',
  
  // Icons
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
  
  // OpenGraph
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    alternateLocale: ['en_US', 'es_ES', 'fr_FR', 'it_IT', 'pt_PT'],
    url: 'https://book-ax.vercel.app',
    siteName: 'Book.ax',
    title: 'Book.ax - Find Your Perfect Stay',
    description: 'Book hotels worldwide - Over 500,000 properties with the best prices',
    images: [
      {
        url: '/og-image.jpg', // TODO: Create this image (1200x630px)
        width: 1200,
        height: 630,
        alt: 'Book.ax - Hotel Booking Platform',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Book.ax - Find Your Perfect Stay',
    description: 'Book hotels worldwide with the best prices',
    // creator: '@bookax', // TODO: Add when Twitter account exists
    images: ['/twitter-image.jpg'], // TODO: Create this image (1200x600px)
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification (TODO: Add verification codes when available)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  // },
  
  // Alternate Languages (top 9 languages)
  alternates: {
    canonical: 'https://book-ax.vercel.app',
    languages: {
      'de-DE': 'https://book-ax.vercel.app/de',
      'en-US': 'https://book-ax.vercel.app/en',
      'zh-CN': 'https://book-ax.vercel.app/zh',
      'hi-IN': 'https://book-ax.vercel.app/hi',
      'es-ES': 'https://book-ax.vercel.app/es',
      'ar-SA': 'https://book-ax.vercel.app/ar',
      'fr-FR': 'https://book-ax.vercel.app/fr',
      'tr-TR': 'https://book-ax.vercel.app/tr',
      'ru-RU': 'https://book-ax.vercel.app/ru',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

