'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { authenticatedFetch, isAuthenticated, getUser } from '@/lib/auth/client';

interface Booking {
  id: string;
  booking_reference: string;
  hotel_name: string;
  room_category_name: string;
  guest_name: string;
  guest_email: string;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  num_rooms: number;
  total_amount: number;
  status: string;
  source: string;
  created_at: string;
}

interface Stats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  totalRevenue: number;
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const t = useTranslations('admin.bookings');
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    verifyAdminAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, sourceFilter]);

  const verifyAdminAccess = async () => {
    try {
      // Check if authenticated
      if (!isAuthenticated()) {
        toast.error('Session expired. Please login again.');
        router.push('/de/login');
        return;
      }

      const user = getUser();
      
      // Check role on client-side first
      if (!user || user.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        router.push('/');
        return;
      }

      // Verify admin role with backend
      const response = await authenticatedFetch('/api/admin/verify');

      if (response.status === 401) {
        toast.error('Unauthorized access');
        router.push('/de/login');
        return;
      }

      if (response.status === 403) {
        toast.error('Access denied. Admin only.');
        router.push('/');
        return;
      }

      if (!response.ok) {
        throw new Error('Admin verification failed');
      }

      setLoading(false);
      fetchBookings();
    } catch (error) {
      console.error('Admin verification failed:', error);
      toast.error('Authentication failed');
      router.push('/de/login');
    }
  };

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (sourceFilter !== 'all') params.append('source', sourceFilter);

      const response = await authenticatedFetch(`/api/admin/bookings?${params}`);

      if (!response.ok) throw new Error('Failed to fetch bookings');

      const data = await response.json();
      setBookings(data.bookings || []);
      setStats(data.stats || null);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error(t('fetchError'));
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm(t('confirmCancel'))) return;

    try {
      const response = await authenticatedFetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) throw new Error('Failed to cancel booking');

      toast.success(t('cancelSuccess'));
      fetchBookings();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      toast.error(t('cancelError'));
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      checked_in: 'bg-blue-100 text-blue-800',
      checked_out: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSourceBadgeColor = (source: string) => {
    const colors: Record<string, string> = {
      direct: 'bg-blue-100 text-blue-800',
      booking_com: 'bg-indigo-100 text-indigo-800',
      airbnb: 'bg-pink-100 text-pink-800',
      expedia: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

  const filteredBookings = bookings.filter((booking) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.booking_reference.toLowerCase().includes(query) ||
      booking.hotel_name.toLowerCase().includes(query) ||
      booking.guest_name.toLowerCase().includes(query) ||
      booking.guest_email.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('subtitle')}</p>
        </div>
        <button
          onClick={fetchBookings}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t('refresh')}
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">
              {t('stats.total')}
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {stats.totalBookings}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">
              {t('stats.confirmed')}
            </div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              {stats.confirmedBookings}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">
              {t('stats.pending')}
            </div>
            <div className="mt-2 text-3xl font-bold text-yellow-600">
              {stats.pendingBookings}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">
              {t('stats.revenue')}
            </div>
            <div className="mt-2 text-3xl font-bold text-primary-600">
              {new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
              }).format(stats.totalRevenue)}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.search')}
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('filters.searchPlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.status')}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.source')}
              </label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">{t('filters.allSources')}</option>
                <option value="direct">{t('source.direct')}</option>
                <option value="booking_com">{t('source.bookingCom')}</option>
                <option value="airbnb">{t('source.airbnb')}</option>
                <option value="expedia">{t('source.expedia')}</option>
                <option value="other">{t('source.other')}</option>
              </select>
            </div>
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
                    {t('table.hotel')}
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      {t('noBookings')}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.booking_reference}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{booking.hotel_name}</div>
                        <div className="text-sm text-gray-500">{booking.room_category_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{booking.guest_name}</div>
                        <div className="text-sm text-gray-500">{booking.guest_email}</div>
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
                        }).format(booking.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(booking.status)}`}>
                          {t(`status.${booking.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSourceBadgeColor(booking.source)}`}>
                          {t(`source.${booking.source}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {booking.status !== 'cancelled' && booking.status !== 'checked_out' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-900"
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
  );
}
