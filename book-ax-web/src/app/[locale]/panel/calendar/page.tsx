'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { authenticatedFetch } from '@/lib/auth/client';
import { PanelNav } from '@/components/panel/PanelNav';

interface DayBooking {
  id: string;
  booking_reference: string;
  guest_name: string;
  room_category_name: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
  num_rooms: number;
}

interface CalendarDay {
  date: string;
  isCurrentMonth: boolean;
  bookings: DayBooking[];
  checkIns: number;
  checkOuts: number;
  occupiedRooms: number;
}

interface MonthStats {
  totalBookings: number;
  totalCheckIns: number;
  totalCheckOuts: number;
  averageOccupancy: number;
  totalRevenue: number;
}

export default function HotelierCalendarPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('panel.calendar');
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [stats, setStats] = useState<MonthStats>({
    totalBookings: 0,
    totalCheckIns: 0,
    totalCheckOuts: 0,
    averageOccupancy: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [totalRooms, setTotalRooms] = useState(0);

  const verifyHotelierAccess = async () => {
    // Check if user is logged in
    if (!user) {
      router.push(`/${locale}/login`);
      return false;
    }

    // Check if user is hotelier or admin
    if (user.role !== 'hotelier' && user.role !== 'admin') {
      toast.error(t('accessDenied'));
      router.push(`/${locale}`);
      return false;
    }

    try {
      const response = await authenticatedFetch('/api/panel/verify');

      if (response.status === 401) {
        router.push(`/${locale}/login`);
        return false;
      }

      if (response.status === 403) {
        toast.error(t('accessDenied'));
        router.push(`/${locale}`);
        return false;
      }

      return response.ok;
    } catch (error) {
      console.error('Verification error:', error);
      router.push(`/${locale}/login`);
      return false;
    }
  };

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const response = await authenticatedFetch(`/api/panel/calendar?year=${year}&month=${month}`);

      if (!response.ok) {
        throw new Error('Failed to fetch calendar data');
      }

      const data = await response.json();
      setCalendarData(data.calendar || []);
      setStats(data.stats || {});
      setTotalRooms(data.totalRooms || 0);
    } catch (error) {
      console.error('Error fetching calendar:', error);
      toast.error(t('fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const hasAccess = await verifyHotelierAccess();
      if (hasAccess) {
        await fetchCalendarData();
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchCalendarData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthYear = new Intl.DateTimeFormat('de-DE', {
    month: 'long',
    year: 'numeric',
  }).format(currentDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'checked_in':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'checked_out':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getOccupancyColor = (occupiedRooms: number) => {
    if (totalRooms === 0) return 'text-gray-500';
    const percentage = (occupiedRooms / totalRooms) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 40) return 'text-green-600';
    return 'text-blue-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user?.role === 'hotelier' && <PanelNav />}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-2 text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">{t('stats.bookings')}</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalBookings}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">{t('stats.checkIns')}</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">{stats.totalCheckIns}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">{t('stats.checkOuts')}</div>
            <div className="mt-2 text-3xl font-bold text-green-600">{stats.totalCheckOuts}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">{t('stats.occupancy')}</div>
            <div className="mt-2 text-3xl font-bold text-purple-600">
              {stats.averageOccupancy.toFixed(1)}%
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">{t('stats.revenue')}</div>
            <div className="mt-2 text-3xl font-bold text-primary-600">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(stats.totalRevenue)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <button onClick={goToPreviousMonth} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              ← {t('previous')}
            </button>
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{monthYear}</h2>
              <button onClick={goToToday} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                {t('today')}
              </button>
            </div>
            <button onClick={goToNextMonth} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              {t('next')} →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
              <div key={day} className="p-4 text-center font-semibold text-gray-700">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarData.map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] border-b border-r p-2 ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'} ${day.date === new Date().toISOString().split('T')[0] ? 'ring-2 ring-primary-500' : ''} hover:bg-gray-50 cursor-pointer transition-colors`}
                onClick={() => setSelectedDay(day)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                    {new Date(day.date).getDate()}
                  </span>
                  {day.occupiedRooms > 0 && (
                    <span className={`text-xs font-medium ${getOccupancyColor(day.occupiedRooms)}`}>
                      {day.occupiedRooms}/{totalRooms}
                    </span>
                  )}
                </div>

                {(day.checkIns > 0 || day.checkOuts > 0) && (
                  <div className="space-y-1 mb-2">
                    {day.checkIns > 0 && (
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        ↓ {day.checkIns} {t('checkIn')}
                      </div>
                    )}
                    {day.checkOuts > 0 && (
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        ↑ {day.checkOuts} {t('checkOut')}
                      </div>
                    )}
                  </div>
                )}

                {day.bookings.length > 0 && (
                  <div className="space-y-1">
                    {day.bookings.slice(0, 2).map((booking) => (
                      <div key={booking.id} className={`text-xs px-2 py-1 rounded border ${getStatusColor(booking.status)}`}>
                        {booking.guest_name.split(' ')[0]}
                      </div>
                    ))}
                    {day.bookings.length > 2 && (
                      <div className="text-xs text-gray-500 px-2">+{day.bookings.length - 2} {t('more')}</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedDay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDay(null)}>
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {new Intl.DateTimeFormat('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(selectedDay.date))}
                  </h3>
                  <button onClick={() => setSelectedDay(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm text-blue-600">{t('checkIns')}</div>
                    <div className="text-2xl font-bold text-blue-900">{selectedDay.checkIns}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-green-600">{t('checkOuts')}</div>
                    <div className="text-2xl font-bold text-green-900">{selectedDay.checkOuts}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-sm text-purple-600">{t('occupied')}</div>
                    <div className="text-2xl font-bold text-purple-900">{selectedDay.occupiedRooms}/{totalRooms}</div>
                  </div>
                </div>

                {selectedDay.bookings.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">{t('bookings')}</h4>
                    {selectedDay.bookings.map((booking) => (
                      <div key={booking.id} className={`border rounded-lg p-4 ${getStatusColor(booking.status)}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{booking.guest_name}</div>
                            <div className="text-sm text-gray-600">{booking.room_category_name}</div>
                            <div className="text-xs text-gray-500 mt-1">{booking.booking_reference.substring(0, 8)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{booking.num_rooms} {t('rooms')}</div>
                            <div className="text-xs text-gray-500 mt-1 capitalize">{t(`status.${booking.status}`)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">{t('noBookings')}</div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">{t('legend')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span className="text-sm text-gray-700">{t('status.pending')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-sm text-gray-700">{t('status.confirmed')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-sm text-gray-700">{t('status.checkedIn')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span className="text-sm text-gray-700">{t('status.checkedOut')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-sm text-gray-700">{t('status.cancelled')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 ring-2 ring-primary-500 rounded"></div>
              <span className="text-sm text-gray-700">{t('today')}</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
