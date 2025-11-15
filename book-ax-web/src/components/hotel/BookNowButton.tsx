'use client';

import { useTranslations } from 'next-intl';

interface BookNowButtonProps {
  roomName: string;
}

export function BookNowButton({ roomName }: BookNowButtonProps) {
  const t = useTranslations('hotel');

  const handleBookNow = () => {
    // Scroll to BookingCard
    const bookingCard = document.querySelector('.booking-card-container');
    if (bookingCard) {
      bookingCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      onClick={handleBookNow}
      className="mt-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
    >
      {t('bookNow')}
    </button>
  );
}
