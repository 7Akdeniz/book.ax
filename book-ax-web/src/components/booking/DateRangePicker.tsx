'use client';

import { useTranslations } from 'next-intl';

interface DateRangePickerProps {
  checkInDate: string;
  checkOutDate: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  minDate?: string;
}

export default function DateRangePicker({
  checkInDate,
  checkOutDate,
  onCheckInChange,
  onCheckOutChange,
  minDate,
}: DateRangePickerProps) {
  const t = useTranslations('booking');

  // Calculate minimum checkout date (day after check-in)
  const minCheckOutDate = checkInDate
    ? new Date(new Date(checkInDate).getTime() + 86400000).toISOString().split('T')[0]
    : minDate;

  return (
    <div className="space-y-4">
      {/* Check-in */}
      <div>
        <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
          {t('checkIn')}
        </label>
        <input
          type="date"
          id="checkIn"
          value={checkInDate}
          onChange={(e) => onCheckInChange(e.target.value)}
          min={minDate}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Check-out */}
      <div>
        <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
          {t('checkOut')}
        </label>
        <input
          type="date"
          id="checkOut"
          value={checkOutDate}
          onChange={(e) => onCheckOutChange(e.target.value)}
          min={minCheckOutDate}
          disabled={!checkInDate}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
