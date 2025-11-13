'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

export function Footer() {
  const locale = useLocale();
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Book.ax</h3>
            <p className="text-gray-400 text-base">
              {t('tagline')}
            </p>
          </div>

          {/* For Guests */}
          <div>
            <h4 className="text-xl font-semibold mb-4">{t('forGuests')}</h4>
            <ul className="space-y-2 text-base">
              <li>
                <Link href={`/${locale}/search`} className="text-gray-400 hover:text-white">
                  {t('searchHotels')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/my-bookings`} className="text-gray-400 hover:text-white">
                  {t('myBookings')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/help`} className="text-gray-400 hover:text-white">
                  {t('helpCenter')}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Hoteliers */}
          <div>
            <h4 className="text-xl font-semibold mb-4">{t('forHoteliers')}</h4>
            <ul className="space-y-2 text-base">
              <li>
                <Link href={`/${locale}/panel`} className="text-gray-400 hover:text-white">
                  {t('dashboard')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/panel/hotels`} className="text-gray-400 hover:text-white">
                  {t('listYourProperty')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/pricing`} className="text-gray-400 hover:text-white">
                  {t('pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xl font-semibold mb-4">{t('legal')}</h4>
            <ul className="space-y-2 text-base">
              <li>
                <Link href={`/${locale}/terms`} className="text-gray-400 hover:text-white">
                  {t('termsConditions')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-gray-400 hover:text-white">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookies`} className="text-gray-400 hover:text-white">
                  {t('cookiePolicy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 text-center text-base text-gray-400">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
