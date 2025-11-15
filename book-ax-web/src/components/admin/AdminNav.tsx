'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function AdminNav() {
  const t = useTranslations('admin');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('navigation.dashboard'), href: '/admin', current: pathname === '/admin' },
    { name: t('navigation.hotels'), href: '/admin/hotels', current: pathname === '/admin/hotels' },
    { name: t('navigation.users'), href: '/admin/users', current: pathname === '/admin/users' },
    { name: 'Bookings', href: '/admin/bookings', current: pathname === '/admin/bookings' },
    { name: t('navigation.finances'), href: '/admin/finances', current: pathname === '/admin/finances' },
    { name: 'CMS', href: '/admin/cms/pages', current: pathname.includes('/admin/cms') },
    { name: t('navigation.settings'), href: '/admin/settings', current: pathname === '/admin/settings' },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  item.current
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden w-full justify-between">
            <span className="text-lg font-bold text-gray-900">Admin Panel</span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open menu</span>
              {!mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop - Back to Site */}
          <div className="hidden md:flex items-center">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Site
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-3 pt-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  item.current
                    ? 'text-gray-900 bg-gray-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Site
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
