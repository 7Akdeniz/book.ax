'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  guestName: string;
  roomCategoryName: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  totalAmount: number;
}

interface DayBookings {
  checkIns: Booking[];
  checkOuts: Booking[];
  inHouse: Booking[];
}

export default function CalendarPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('panel.hotels.calendar');
  const tCommon = useTranslations('common');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // In a real app, we'd fetch bookings for the current hotel
      // For now, we fetch all bookings for the logged-in hotelier
      const res = await fetch('/api/bookings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await res.json();
      
      const formattedBookings = data.map((b: any) => ({
        id: b.id,
        guestName: `${b.user?.firstName || ''} ${b.user?.lastName || ''}`.trim() || 'Guest',
        roomCategoryName: b.roomCategory?.name || 'N/A',
        checkInDate: b.checkInDate,
        checkOutDate: b.checkOutDate,
        status: b.status,
        totalAmount: b.totalAmount,
      }));

      setBookings(formattedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getBookingsForDate = (date: Date): DayBookings => {
    const dateStr = date.toISOString().split('T')[0];
    
    const checkIns = bookings.filter(b => b.checkInDate === dateStr && b.status !== 'cancelled');
    const checkOuts = bookings.filter(b => b.checkOutDate === dateStr && b.status !== 'cancelled');
    
    // In-house: bookings where date is between check-in and check-out
    const inHouse = bookings.filter(b => {
      if (b.status === 'cancelled') return false;
      const checkIn = new Date(b.checkInDate);
      const checkOut = new Date(b.checkOutDate);
      const current = new Date(dateStr);
      return current > checkIn && current < checkOut;
    });

    return { checkIns, checkOuts, inHouse };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="border border-gray-200 bg-gray-50 min-h-[120px]" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayBookings = getBookingsForDate(date);
      const totalBookings = dayBookings.checkIns.length + dayBookings.checkOuts.length + dayBookings.inHouse.length;
      const isTodayDate = isToday(date);

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`border border-gray-200 min-h-[120px] p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
            isTodayDate ? 'bg-primary-50 border-primary-500' : 'bg-white'
          } ${selectedDate?.toDateString() === date.toDateString() ? 'ring-2 ring-primary-500' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-semibold ${isTodayDate ? 'text-primary-700' : 'text-gray-900'}`}>
              {day}
            </span>
            {totalBookings > 0 && (
              <span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">
                {totalBookings}
              </span>
            )}
          </div>

          <div className="space-y-1">
            {dayBookings.checkIns.length > 0 && (
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                ✓ {dayBookings.checkIns.length} {t('bookings.checkIn')}
              </div>
            )}
            {dayBookings.checkOuts.length > 0 && (
              <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                → {dayBookings.checkOuts.length} {t('bookings.checkOut')}
              </div>
            )}
            {dayBookings.inHouse.length > 0 && (
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                🏠 {dayBookings.inHouse.length} {t('bookings.inHouse')}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderSelectedDateDetails = () => {
    if (!selectedDate) return null;

    const dayBookings = getBookingsForDate(selectedDate);
    const allBookings = [
      ...dayBookings.checkIns.map(b => ({ ...b, type: 'checkIn' })),
      ...dayBookings.checkOuts.map(b => ({ ...b, type: 'checkOut' })),
      ...dayBookings.inHouse.map(b => ({ ...b, type: 'inHouse' })),
    ];

    if (allBookings.length === 0) {
      return (
        <div className="text-center py-8">
          <span className="text-6xl mb-4 block">📭</span>
          <p className="text-gray-600">{t('noBookings')}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {allBookings.map((booking, index) => (
          <div key={`${booking.id}-${index}`} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">{booking.guestName}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  booking.type === 'checkIn'
                    ? 'bg-green-100 text-green-800'
                    : booking.type === 'checkOut'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {booking.type === 'checkIn'
                  ? t('bookings.checkIn')
                  : booking.type === 'checkOut'
                  ? t('bookings.checkOut')
                  : t('bookings.inHouse')}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>🛏️ {booking.roomCategoryName}</p>
              <p>
                📅 {new Date(booking.checkInDate).toLocaleDateString('de-DE')} →{' '}
                {new Date(booking.checkOutDate).toLocaleDateString('de-DE')}
              </p>
              <p className="font-semibold text-gray-900">
                💰 €{booking.totalAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const monthNames = [
    t('months.january'),
    t('months.february'),
    t('months.march'),
    t('months.april'),
    t('months.may'),
    t('months.june'),
    t('months.july'),
    t('months.august'),
    t('months.september'),
    t('months.october'),
    t('months.november'),
    t('months.december'),
  ];

  const weekdaysShort = [
    t('weekdaysShort.sun'),
    t('weekdaysShort.mon'),
    t('weekdaysShort.tue'),
    t('weekdaysShort.wed'),
    t('weekdaysShort.thu'),
    t('weekdaysShort.fri'),
    t('weekdaysShort.sat'),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
        <button
          onClick={goToToday}
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          {t('today')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ← Previous
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Next →
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-200">
            {weekdaysShort.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-semibold text-gray-700">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">{renderCalendar()}</div>
        </div>

        {/* Selected Date Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {selectedDate
              ? selectedDate.toLocaleDateString('de-DE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : t('noBookings')}
          </h3>
          {renderSelectedDateDetails()}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('legend.title')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-sm text-gray-700">{t('legend.checkIn')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-sm text-gray-700">{t('legend.checkOut')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-sm text-gray-700">{t('legend.occupied')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary-50 border border-primary-500 rounded"></div>
            <span className="text-sm text-gray-700">{t('today')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
