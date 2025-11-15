'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { authenticatedFetch } from '@/lib/auth/client';
import { useAuth } from '@/contexts/AuthContext';
import { PanelNav } from '@/components/panel/PanelNav';

interface BookingWithDetails {
  id: string;
  booking_reference: string;
  room_category_name: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  num_rooms: number;
  total_amount: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
  source: 'direct' | 'booking_com' | 'airbnb' | 'expedia' | 'other';
  special_requests: string | null;
  created_at: string;
}

interface Stats {
  totalBookings: number;
  confirmedBookings: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  totalRevenue: number;
}

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
type DateFilter = 'all' | 'today' | 'upcoming' | 'past';

export default function HotelierBookingsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('panel.bookings');
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    confirmedBookings: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Verify hotelier access
  const verifyHotelierAccess = async () => {
    if (!user) {
      router.push(`/${locale}/login`);
      return false;
    }

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

  // Fetch bookings data
  const fetchBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (dateFilter !== 'all') params.append('dateFilter', dateFilter);

      const response = await authenticatedFetch(`/api/panel/bookings?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data.bookings || []);
      setStats(data.stats || {});
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(t('fetchError'));
    } finally {
      setLoading(false);
    }
  };

  // Check-in booking
  const handleCheckIn = async (bookingId: string) => {
    if (!confirm(t('confirmCheckIn'))) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/panel/bookings/${bookingId}/checkin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check in');
      }

      toast.success(t('checkInSuccess'));
      fetchBookings(); // Refresh data
    } catch (error) {
      console.error('Error checking in:', error);
      toast.error(t('checkInError'));
    }
  };

  // Check-out booking
  const handleCheckOut = async (bookingId: string) => {
    if (!confirm(t('confirmCheckOut'))) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/panel/bookings/${bookingId}/checkout`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check out');
      }

      toast.success(t('checkOutSuccess'));
      fetchBookings(); // Refresh data
    } catch (error) {
      console.error('Error checking out:', error);
      toast.error(t('checkOutError'));
    }
  };

  // Cancel booking
  const handleCancel = async (bookingId: string) => {
    if (!confirm(t('confirmCancel'))) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/panel/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      toast.success(t('cancelSuccess'));
      fetchBookings(); // Refresh data
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(t('cancelError'));
    }
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      const hasAccess = await verifyHotelierAccess();
      if (hasAccess) {
        await fetchBookings();
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch on filter change
  useEffect(() => {
    if (!loading) {
      fetchBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, dateFilter]);

  // Client-side search filter
  const filteredBookings = bookings.filter((booking) => {
    const query = searchQuery.toLowerCase();
    return (
      booking.booking_reference.toLowerCase().includes(query) ||
      booking.guest_name.toLowerCase().includes(query) ||
      booking.guest_email.toLowerCase().includes(query) ||
      booking.room_category_name.toLowerCase().includes(query)
    );
  });

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'checked_in':
        return 'bg-blue-100 text-blue-800';
      case 'checked_out':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Source badge colors
  const getSourceColor = (source: string) => {
    switch (source) {
      case 'direct':
        return 'bg-blue-100 text-blue-800';
      case 'booking_com':
        return 'bg-indigo-100 text-indigo-800';
      case 'airbnb':
        return 'bg-pink-100 text-pink-800';
      case 'expedia':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-2 text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">{t('stats.total')}</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalBookings}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">{t('stats.confirmed')}</div>
            <div className="mt-2 text-3xl font-bold text-green-600">{stats.confirmedBookings}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">{t('stats.todayCheckIns')}</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">{stats.todayCheckIns}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">{t('stats.todayCheckOuts')}</div>
            <div className="mt-2 text-3xl font-bold text-purple-600">{stats.todayCheckOuts}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">{t('stats.revenue')}</div>
            <div className="mt-2 text-3xl font-bold text-primary-600">
              {new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
              }).format(stats.totalRevenue)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.search')}
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('filters.searchPlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.status')}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">{t('filters.allStatuses')}</option>
                <option value="pending">{t('status.pending')}</option>
                <option value="confirmed">{t('status.confirmed')}</option>
                <option value="checked_in">{t('status.checkedIn')}</option>
                <option value="checked_out">{t('status.checkedOut')}</option>
                <option value="cancelled">{t('status.cancelled')}</option>
                <option value="no_show">{t('status.noShow')}</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.date')}
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">{t('filters.allDates')}</option>
                <option value="today">{t('filters.today')}</option>
                <option value="upcoming">{t('filters.upcoming')}</option>
                <option value="past">{t('filters.past')}</option>
              </select>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={fetchBookings}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {t('refresh')}
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.reference')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.room')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.guest')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.dates')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.guests')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.amount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.source')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      {t('noBookings')}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.booking_reference.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.room_category_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.guest_name}</div>
                        <div className="text-sm text-gray-500">{booking.guest_email}</div>
                        {booking.guest_phone && (
                          <div className="text-sm text-gray-500">{booking.guest_phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Intl.DateTimeFormat('de-DE').format(new Date(booking.check_in_date))}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Intl.DateTimeFormat('de-DE').format(new Date(booking.check_out_date))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.num_guests} / {booking.num_rooms}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Intl.NumberFormat('de-DE', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(parseFloat(booking.total_amount))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {t(`status.${booking.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getSourceColor(
                            booking.source
                          )}`}
                        >
                          {t(`source.${booking.source}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCheckIn(booking.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {t('actions.checkIn')}
                          </button>
                        )}
                        {booking.status === 'checked_in' && (
                          <button
                            onClick={() => handleCheckOut(booking.id)}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            {t('actions.checkOut')}
                          </button>
                        )}
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            {t('actions.cancel')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
