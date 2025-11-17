import { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '@/app/globals.css';

// 🔒 SECURITY: Force dynamic rendering - NO static generation for admin
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'Admin Panel - Book.ax',
  description: 'Administration panel for Book.ax',
  robots: 'noindex, nofollow', // 🔒 SECURITY: Don't index admin pages
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load English messages for admin panel
  const messages = (await import(`../../../messages/en.json`)).default;

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <NextIntlClientProvider locale="en" messages={messages as any}>
          <AuthProvider>
            <div className="flex min-h-screen">
              {/* Left Sidebar */}
              <AdminSidebar />

              {/* Main Content Area */}
              <div className="flex-1 lg:ml-64 transition-all duration-300">
                {/* Top Header */}
                <AdminHeader />

                {/* Page Content */}
                <main className="pt-16 min-h-screen">
                  <div className="p-6">
                    {children}
                  </div>
                </main>
              </div>
            </div>

            <Toaster position="top-right" />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
