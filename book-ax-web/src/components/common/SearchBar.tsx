'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export function SearchBar() {
  const router = useRouter();
  const locale = useLocale();
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
    <form onSubmit={handleSearch} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Destination */}
        <div className="relative">
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder=" "
            className="peer w-full px-5 pt-8 pb-3 text-lg border-b-2 border-gray-300 bg-transparent focus:border-primary-600 focus:outline-none transition-colors"
            required
          />
          <label className="absolute left-5 top-6 text-gray-500 text-base peer-focus:text-sm peer-focus:top-2 peer-focus:text-primary-600 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:top-2 transition-all">
            Reiseziel
          </label>
        </div>

        {/* Check-in */}
        <div className="relative">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="peer w-full px-5 pt-8 pb-3 text-lg border-b-2 border-gray-300 bg-transparent focus:border-primary-600 focus:outline-none transition-colors"
            required
          />
          <label className="absolute left-5 top-2 text-primary-600 text-sm">
            Check-in
          </label>
        </div>

        {/* Check-out */}
        <div className="relative">
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="peer w-full px-5 pt-8 pb-3 text-lg border-b-2 border-gray-300 bg-transparent focus:border-primary-600 focus:outline-none transition-colors"
            required
          />
          <label className="absolute left-5 top-2 text-primary-600 text-sm">
            Check-out
          </label>
        </div>

        {/* Guests */}
        <div className="relative">
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            min={1}
            max={10}
            className="peer w-full px-5 pt-8 pb-3 text-lg border-b-2 border-gray-300 bg-transparent focus:border-primary-600 focus:outline-none transition-colors"
          />
          <label className="absolute left-5 top-2 text-primary-600 text-sm">
            Gäste
          </label>
        </div>
      </div>

      {/* Search Button - Larger */}
      <div className="mt-10 flex justify-center">
        <button
          type="submit"
          className="px-12 py-4 bg-primary-600 text-white text-xl rounded-full font-semibold hover:bg-primary-700 hover:shadow-2xl transition-all duration-200 flex items-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Hotels suchen
        </button>
      </div>
    </form>
  );
}
