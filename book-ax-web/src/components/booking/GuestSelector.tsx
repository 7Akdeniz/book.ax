'use client';

import { useTranslations } from 'next-intl';

interface GuestSelectorProps {
  numGuests: number;
  numRooms: number;
  onGuestsChange: (num: number) => void;
  onRoomsChange: (num: number) => void;
  maxGuests?: number;
  maxRooms?: number;
}

export default function GuestSelector({
  numGuests,
  numRooms,
  onGuestsChange,
  onRoomsChange,
  maxGuests = 10,
  maxRooms = 5,
}: GuestSelectorProps) {
  const t = useTranslations('booking');

  return (
    <div className="space-y-4">
      {/* Guests */}
      <div>
        <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
          {t('guests')}
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onGuestsChange(Math.max(1, numGuests - 1))}
            disabled={numGuests <= 1}
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-lg font-semibold w-12 text-center">{numGuests}</span>
          <button
            onClick={() => onGuestsChange(Math.min(maxGuests, numGuests + 1))}
            disabled={numGuests >= maxGuests}
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Rooms */}
      <div>
        <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-2">
          {t('rooms')}
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onRoomsChange(Math.max(1, numRooms - 1))}
            disabled={numRooms <= 1}
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-lg font-semibold w-12 text-center">{numRooms}</span>
          <button
            onClick={() => onRoomsChange(Math.min(maxRooms, numRooms + 1))}
            disabled={numRooms >= maxRooms}
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
