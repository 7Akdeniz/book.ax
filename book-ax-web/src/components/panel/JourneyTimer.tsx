'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { HotelJourneyStorage } from '@/utils/hotelJourneyStorage';

export function JourneyTimer() {
  const t = useTranslations('panel.hotels.new');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Update timer every minute
    const updateTimer = () => {
      const remaining = HotelJourneyStorage.getTimeRemaining();
      setTimeRemaining(remaining);
      
      // Show warning if less than 5 minutes remaining
      if (remaining !== null && remaining < 5 && remaining > 0) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (timeRemaining === null || timeRemaining <= 0) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg transition-all ${
        showWarning
          ? 'bg-red-50 border-2 border-red-500 text-red-800'
          : 'bg-blue-50 border border-blue-200 text-blue-800'
      }`}
    >
      <div className="flex items-center space-x-2">
        {showWarning ? (
          <svg
            className="w-5 h-5 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <div>
          <p className="text-sm font-medium">
            {showWarning ? '⚠️ Bald abgelaufen!' : '💾 Automatisch gespeichert'}
          </p>
          <p className="text-xs">
            Noch {timeRemaining} Min. gültig
          </p>
        </div>
      </div>
    </div>
  );
}
