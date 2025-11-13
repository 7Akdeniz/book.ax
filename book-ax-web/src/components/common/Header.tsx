'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export function Header() {
  const locale = useLocale();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="text-2xl font-bold text-primary-600">
            Book.ax
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href={`/${locale}/search`} className="text-gray-700 hover:text-primary-600">
              Hotels
            </Link>
            <Link href={`/${locale}/panel`} className="text-gray-700 hover:text-primary-600">
              For Hoteliers
            </Link>
            <Link href={`/${locale}/my-bookings`} className="text-gray-700 hover:text-primary-600">
              My Bookings
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            <Link 
              href={`/${locale}/login`}
              className="text-gray-700 hover:text-primary-600"
            >
              Login
            </Link>
            
            <Link 
              href={`/${locale}/register`}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
