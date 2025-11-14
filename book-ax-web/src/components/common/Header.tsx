'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export function Header() {
  const locale = useLocale();
  const t = useTranslations('header');

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

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href={`/${locale}/search`} className="text-lg font-semibold text-gray-700 hover:text-primary-600 transition-colors">
              {t('hotels')}
            </Link>
            <Link href={`/${locale}/panel`} className="text-lg font-semibold text-gray-700 hover:text-primary-600 transition-colors">
              {t('forHoteliers')}
            </Link>
            <Link href={`/${locale}/my-bookings`} className="text-lg font-semibold text-gray-700 hover:text-primary-600 transition-colors">
              {t('myBookings')}
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-8">
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
            
            <div className="ml-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
