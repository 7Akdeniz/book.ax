import { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/app/globals.css';

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
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      {children}
    </AuthProvider>
  );
}
