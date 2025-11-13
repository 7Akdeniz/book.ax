'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export function Footer() {
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Book.ax</h3>
            <p className="text-gray-400 text-sm">
              Your all-in-one hotel booking and management platform
            </p>
          </div>

          {/* For Guests */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Guests</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/search`} className="text-gray-400 hover:text-white">
                  Search Hotels
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/my-bookings`} className="text-gray-400 hover:text-white">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/help`} className="text-gray-400 hover:text-white">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* For Hoteliers */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Hoteliers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/panel`} className="text-gray-400 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/panel/hotels`} className="text-gray-400 hover:text-white">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/pricing`} className="text-gray-400 hover:text-white">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/terms`} className="text-gray-400 hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookies`} className="text-gray-400 hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Book.ax. All rights reserved. Made with ❤️ for the hospitality industry</p>
        </div>
      </div>
    </footer>
  );
}
