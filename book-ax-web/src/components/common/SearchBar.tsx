'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

export function SearchBar() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('home');
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams({
      destination,
      checkIn,
      checkOut,
      guests: guests.toString(),
    });

    router.push(`/${locale}/search?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200"
      role="search"
      aria-label={t('searchHotels') || 'Search hotels'}
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
        {/* Destination */}
        <div className="relative">
          <label 
            htmlFor="destination-input"
            className="absolute left-5 top-2 text-primary-600 text-base font-bold"
          >
            {t('searchPlaceholder')}
          </label>
          <input
            id="destination-input"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder={t('searchPlaceholderExample') || 'e.g. Berlin, Germany'}
            className="peer w-full px-5 pt-8 pb-3 text-lg font-medium border-b-2 border-gray-300 bg-transparent focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-200 rounded transition-all"
            aria-label={t('destination') || 'Destination'}
            aria-required="true"
            required
          />
        </div>

        {/* Check-in */}
        <div className="relative">
          <label 
            htmlFor="checkin-input"
            className="absolute left-5 top-2 text-primary-600 text-base font-bold"
          >
            {t('checkIn')}
          </label>
          <input
            id="checkin-input"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="peer w-full px-5 pt-8 pb-3 text-lg font-medium border-b-2 border-gray-300 bg-transparent focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-200 rounded transition-all"
            aria-label={t('checkIn') || 'Check-in date'}
            aria-required="true"
            required
          />
        </div>

        {/* Check-out */}
        <div className="relative">
          <label 
            htmlFor="checkout-input"
            className="absolute left-5 top-2 text-primary-600 text-base font-bold"
          >
            {t('checkOut')}
          </label>
          <input
            id="checkout-input"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="peer w-full px-5 pt-8 pb-3 text-lg font-medium border-b-2 border-gray-300 bg-transparent focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-200 rounded transition-all"
            aria-label={t('checkOut') || 'Check-out date'}
            aria-required="true"
            required
          />
        </div>

        {/* Guests */}
        <div className="relative">
          <label 
            htmlFor="guests-input"
            className="absolute left-5 top-2 text-primary-600 text-base font-bold"
          >
            {t('guests')}
          </label>
          <input
            id="guests-input"
            type="number"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            min={1}
            max={10}
            className="peer w-full px-5 pt-8 pb-3 text-lg font-medium border-b-2 border-gray-300 bg-transparent focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-200 rounded transition-all"
            aria-label={t('numberOfGuests') || 'Number of guests'}
            aria-valuemin={1}
            aria-valuemax={10}
            aria-valuenow={guests}
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="px-8 py-4 bg-primary-600 text-white text-lg rounded-full font-semibold hover:bg-primary-700 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
          aria-label={t('searchHotelsButton') || 'Search hotels'}
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {t('searchButton')}
        </button>
      </div>
    </form>
  );
}
