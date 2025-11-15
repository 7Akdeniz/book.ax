'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('header');
  const { user, logout: handleLogout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onLogout = async () => {
    await handleLogout();
    setMobileMenuOpen(false);
    router.push(`/${locale}`);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.svg" 
              alt="Book.ax" 
              width={100} 
              height={30}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href={`/${locale}/search`} className="text-lg font-semibold text-gray-700 hover:text-primary-600 transition-colors">
              {t('hotels')}
            </Link>
            
            {/* Hotelier Panel - immer sichtbar für Marketing */}
            <Link href={`/${locale}/panel`} className="text-lg font-semibold text-gray-700 hover:text-primary-600 transition-colors">
              {t('forHoteliers')}
            </Link>
            
            {/* Admin Panel - nur für Admin */}
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-lg font-semibold text-gray-700 hover:text-primary-600 transition-colors">
                Admin
              </Link>
            )}
            
            {/* My Bookings - für alle eingeloggten User */}
            {user && (
              <Link href={`/${locale}/my-bookings`} className="text-lg font-semibold text-gray-700 hover:text-primary-600 transition-colors">
                {t('myBookings')}
              </Link>
            )}
          </nav>

          {/* Desktop - Right Side */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {user.firstName} {user.lastName}
                </span>
                <button
                  onClick={onLogout}
                  className="text-lg font-semibold text-gray-700 hover:text-primary-600 transition-colors"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href={`/${locale}/login`}
                  className="text-lg font-semibold text-gray-700 hover:text-primary-600 transition-colors"
                >
                  {t('login')}
                </Link>
                
                <Link 
                  href={`/${locale}/register`}
                  className="bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 text-lg font-semibold transition-colors"
                >
                  {t('signUp')}
                </Link>
              </div>
            )}
            
            <div className="ml-4">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile - Right Side */}
          <div className="flex md:hidden items-center gap-4">
            <LanguageSwitcher />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
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
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Navigation Links */}
              <Link
                href={`/${locale}/search`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
              >
                {t('hotels')}
              </Link>
              
              <Link
                href={`/${locale}/panel`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
              >
                {t('forHoteliers')}
              </Link>
              
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                >
                  Admin
                </Link>
              )}
              
              {user && (
                <Link
                  href={`/${locale}/my-bookings`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                >
                  {t('myBookings')}
                </Link>
              )}

              {/* User Actions */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      {t('logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/${locale}/login`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                    >
                      {t('login')}
                    </Link>
                    <Link
                      href={`/${locale}/register`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors text-center"
                    >
                      {t('signUp')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
