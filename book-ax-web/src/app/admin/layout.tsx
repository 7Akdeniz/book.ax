import { Metadata } from 'next';

// 🔒 SECURITY: Force dynamic rendering - NO static generation for admin
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'Admin Panel - Book.ax',
  description: 'Administration panel for Book.ax',
  robots: 'noindex, nofollow', // 🔒 SECURITY: Don't index admin pages
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
