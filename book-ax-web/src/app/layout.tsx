import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Book.ax - Find Your Perfect Stay',
  description: 'Book hotels worldwide - Over 500,000 properties with the best prices',
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

