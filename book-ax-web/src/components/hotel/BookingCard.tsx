'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface BookingCardProps {
  checkInTime: string;
  checkOutTime: string;
  hotelId: string;
}

export function BookingCard({ checkInTime, checkOutTime, hotelId }: BookingCardProps) {
  const t = useTranslations();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const minDate = new Date().toISOString().split('T')[0];

  const handleCheckAvailability = () => {
    // TODO: Navigate to booking page with params
    console.log('Check availability:', { hotelId, checkIn, checkOut, guests });
  };

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6 sticky top-4">
      <h3 className="text-xl font-bold mb-4">{t('hotel.bookYourStay')}</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{t('common.checkIn')}</label>
        <input
          type="date"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          min={minDate}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{t('common.checkOut')}</label>
        <input
          type="date"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          min={checkIn || minDate}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{t('common.guests')}</label>
        <input
          type="number"
          min="1"
          max="10"
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded">
        <p className="text-sm text-gray-600 mb-1">{t('hotel.checkInTime')}:</p>
        <p className="font-semibold">{checkInTime}</p>
        <p className="text-sm text-gray-600 mt-2 mb-1">{t('hotel.checkOutTime')}:</p>
        <p className="font-semibold">{checkOutTime}</p>
      </div>

      <button 
        onClick={handleCheckAvailability}
        disabled={!checkIn || !checkOut}
        className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {t('hotel.checkAvailability')}
      </button>
    </div>
  );
}
