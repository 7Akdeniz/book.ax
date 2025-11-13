'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/db/supabase';
import Link from 'next/link';

interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  status: string;
}

interface DashboardStats {
  todaysArrivals: number;
  todaysDepartures: number;
  occupancyRate: number;
  revenue: number;
  averageDailyRate: number;
  revPAR: number;
}

export default function PanelPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // Check if user is logged in
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        router.push(`/${locale}/login`);
        return;
      }

      // Get user from localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        router.push(`/${locale}/login`);
        return;
      }

      const user = JSON.parse(userStr);
      setUserName(user.email || user.full_name || 'User');

      // Load hotels owned by this user
      await loadHotels(user.id);
      await loadDashboardStats(user.id);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadHotels = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('id, name, city, country, status')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setHotels(data || []);
    } catch (err) {
      console.error('Error loading hotels:', err);
    }
  };

  const loadDashboardStats = async (userId: string) => {
    try {
      // Get today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get user's hotels
      const { data: userHotels } = await supabase
        .from('hotels')
        .select('id')
        .eq('owner_id', userId);

      if (!userHotels || userHotels.length === 0) {
        setStats({
          todaysArrivals: 0,
          todaysDepartures: 0,
          occupancyRate: 0,
          revenue: 0,
          averageDailyRate: 0,
          revPAR: 0,
        });
        return;
      }

      const hotelIds = userHotels.map(h => h.id);

      // Get today's arrivals
      const { data: arrivals } = await supabase
        .from('bookings')
        .select('id')
        .in('hotel_id', hotelIds)
        .gte('check_in', today.toISOString())
        .lt('check_in', tomorrow.toISOString());

      // Get today's departures
      const { data: departures } = await supabase
        .from('bookings')
        .select('id')
        .in('hotel_id', hotelIds)
        .gte('check_out', today.toISOString())
        .lt('check_out', tomorrow.toISOString());

      // Get current month's revenue
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const { data: revenueData } = await supabase
        .from('bookings')
        .select('total_price')
        .in('hotel_id', hotelIds)
        .gte('created_at', firstDayOfMonth.toISOString())
        .eq('status', 'confirmed');

      const totalRevenue = revenueData?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

      // Calculate stats (simplified for now)
      setStats({
        todaysArrivals: arrivals?.length || 0,
        todaysDepartures: departures?.length || 0,
        occupancyRate: 0, // TODO: Calculate based on rooms
        revenue: totalRevenue,
        averageDailyRate: totalRevenue / Math.max(1, (revenueData?.length || 1)),
        revPAR: 0, // TODO: Calculate Revenue Per Available Room
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push(`/${locale}/login`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('panel.hotelierDashboard')}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {t('common.welcome')}, {userName}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t('auth.logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">{t('panel.todaysArrivals')}</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.todaysArrivals}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">{t('panel.todaysDepartures')}</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.todaysDepartures}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">{t('panel.revenue')}</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                €{stats.revenue.toFixed(2)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">{t('panel.occupancyRate')}</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.occupancyRate}%</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">{t('panel.averageDailyRate')}</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                €{stats.averageDailyRate.toFixed(2)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">{t('panel.revPAR')}</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                €{stats.revPAR.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href={`/${locale}/panel/reservations`}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="text-2xl mb-2">📅</div>
                <h3 className="font-medium text-gray-900">{t('panel.reservations')}</h3>
                <p className="text-sm text-gray-500">View and manage bookings</p>
              </Link>

              <Link
                href={`/${locale}/panel/hotels`}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="text-2xl mb-2">🏨</div>
                <h3 className="font-medium text-gray-900">{t('panel.myHotels')}</h3>
                <p className="text-sm text-gray-500">Manage your properties</p>
              </Link>

              <Link
                href={`/${locale}/panel/calendar`}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="text-2xl mb-2">📆</div>
                <h3 className="font-medium text-gray-900">{t('panel.calendar')}</h3>
                <p className="text-sm text-gray-500">Check availability</p>
              </Link>

              <Link
                href={`/${locale}/panel/rates`}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="text-2xl mb-2">💰</div>
                <h3 className="font-medium text-gray-900">{t('panel.rates')}</h3>
                <p className="text-sm text-gray-500">Update pricing</p>
              </Link>

              <Link
                href={`/${locale}/panel/guests`}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="text-2xl mb-2">👥</div>
                <h3 className="font-medium text-gray-900">{t('panel.guests')}</h3>
                <p className="text-sm text-gray-500">Guest management</p>
              </Link>

              <Link
                href={`/${locale}/panel/reports`}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-medium text-gray-900">{t('panel.reports')}</h3>
                <p className="text-sm text-gray-500">Analytics & insights</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Hotels List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">{t('panel.myHotels')}</h2>
            <Link
              href={`/${locale}/panel/hotels/new`}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Add Hotel
            </Link>
          </div>
          <div className="p-6">
            {hotels.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hotels yet. Add your first property!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {hotels.map((hotel) => (
                  <Link
                    key={hotel.id}
                    href={`/${locale}/panel/hotels/${hotel.id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{hotel.name}</h3>
                        <p className="text-sm text-gray-500">
                          {hotel.city}, {hotel.country}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          hotel.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : hotel.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {hotel.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
