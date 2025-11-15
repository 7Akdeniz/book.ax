'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface DashboardStats {
  occupancyRate: number;
  totalRevenue: number;
  todayArrivals: number;
  todayDepartures: number;
  totalBookings: number;
  averageRate: number;
}

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  roomCategoryName: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  totalAmount: number;
}

export default function HotelDashboard({ params }: { params: { locale: string; id: string } }) {
  const router = useRouter();
  const t = useTranslations('panel.hotels.dashboard');
  const tCommon = useTranslations('common');
  const { id: hotelId } = params;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [hotelName, setHotelName] = useState('');

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch hotel details
      const hotelRes = await fetch(`/api/hotels/${hotelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!hotelRes.ok) {
        throw new Error('Failed to fetch hotel');
      }

      const hotelData = await hotelRes.json();
      setHotelName(hotelData.name);

      // Fetch bookings for this hotel
      const bookingsRes = await fetch(`/api/bookings?hotelId=${hotelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        
        // Calculate stats from bookings
        const today = new Date().toISOString().split('T')[0];
        const todayArrivals = bookingsData.filter(
          (b: any) => b.checkInDate === today && b.status !== 'cancelled'
        ).length;
        const todayDepartures = bookingsData.filter(
          (b: any) => b.checkOutDate === today && b.status !== 'cancelled'
        ).length;
        
        const confirmedBookings = bookingsData.filter(
          (b: any) => b.status === 'confirmed' || b.status === 'checked_in'
        );
        
        const totalRevenue = bookingsData
          .filter((b: any) => b.status !== 'cancelled')
          .reduce((sum: number, b: any) => sum + b.totalAmount, 0);

        const averageRate = confirmedBookings.length > 0
          ? totalRevenue / confirmedBookings.length
          : 0;

        // Calculate occupancy (simplified - would need room count and date range in real app)
        const occupancyRate = Math.min(
          (confirmedBookings.length / (hotelData.totalRooms * 30)) * 100,
          100
        );

        setStats({
          occupancyRate: Math.round(occupancyRate),
          totalRevenue,
          todayArrivals,
          todayDepartures,
          totalBookings: bookingsData.length,
          averageRate,
        });

        // Get recent bookings (last 10)
        const recent = bookingsData
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10)
          .map((b: any) => ({
            id: b.id,
            guestName: `${b.user?.firstName || ''} ${b.user?.lastName || ''}`.trim() || 'Guest',
            guestEmail: b.user?.email || '',
            roomCategoryName: b.roomCategory?.name || 'N/A',
            checkInDate: b.checkInDate,
            checkOutDate: b.checkOutDate,
            status: b.status,
            totalAmount: b.totalAmount,
          }));

        setRecentBookings(recent);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error(t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'checked_in':
        return 'bg-blue-100 text-blue-800';
      case 'checked_out':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('welcome')}, {hotelName}
        </h1>
        <p className="text-gray-600">{t('title')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Occupancy Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{t('stats.occupancy')}</h3>
            <span className="text-2xl">🏨</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.occupancyRate || 0}%</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{t('stats.revenue')}</h3>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            €{stats?.totalRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
        </div>

        {/* Today's Arrivals */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{t('stats.todayArrivals')}</h3>
            <span className="text-2xl">✈️</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.todayArrivals || 0}</p>
        </div>

        {/* Today's Departures */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{t('stats.todayDepartures')}</h3>
            <span className="text-2xl">🚪</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.todayDepartures || 0}</p>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{t('stats.totalBookings')}</h3>
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
        </div>

        {/* Average Daily Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{t('stats.averageRate')}</h3>
            <span className="text-2xl">💵</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            €{stats?.averageRate.toLocaleString('de-DE', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('quickActions.title')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            href={`/${params.locale}/panel/hotels/${hotelId}/rooms`}
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all"
          >
            <span className="text-3xl mb-2">🛏️</span>
            <span className="text-sm font-medium text-center">{t('quickActions.manageRooms')}</span>
          </Link>

          <Link
            href={`/${params.locale}/panel/calendar`}
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all"
          >
            <span className="text-3xl mb-2">📅</span>
            <span className="text-sm font-medium text-center">{t('quickActions.viewCalendar')}</span>
          </Link>

          <Link
            href={`/${params.locale}/panel/rates`}
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all"
          >
            <span className="text-3xl mb-2">💲</span>
            <span className="text-sm font-medium text-center">{t('quickActions.manageRates')}</span>
          </Link>

          <Link
            href={`/${params.locale}/my-bookings`}
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all"
          >
            <span className="text-3xl mb-2">📋</span>
            <span className="text-sm font-medium text-center">{t('quickActions.viewBookings')}</span>
          </Link>

          <Link
            href={`/${params.locale}/panel/hotels/${hotelId}/edit`}
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all"
          >
            <span className="text-3xl mb-2">✏️</span>
            <span className="text-sm font-medium text-center">{t('quickActions.editHotel')}</span>
          </Link>

          <Link
            href={`/${params.locale}/panel/hotels/${hotelId}/rooms`}
            className="flex flex-col items-center p-4 border-2 border-primary-600 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
          >
            <span className="text-3xl mb-2">➕</span>
            <span className="text-sm font-medium text-center">{t('quickActions.addRoom')}</span>
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{t('recentBookings.title')}</h2>
          <Link
            href={`/${params.locale}/my-bookings`}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            {t('recentBookings.viewAll')} →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-6xl mb-4 block">📭</span>
            <p className="text-gray-600">{t('recentBookings.noBookings')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('recentBookings.guest')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('recentBookings.room')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('recentBookings.checkIn')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('recentBookings.checkOut')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('recentBookings.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('recentBookings.total')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                      <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.roomCategoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.checkInDate).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.checkOutDate).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {t(`recentBookings.statuses.${booking.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      €{booking.totalAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
