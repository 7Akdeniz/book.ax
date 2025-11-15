'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/db/supabase';
import { getUser, isAuthenticated } from '@/lib/auth/client';
import { useAuth } from '@/contexts/AuthContext';

interface Booking {
  id: string;
  hotel_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  created_at: string;
  hotel?: {
    name: string;
    city: string;
    country: string;
  };
}

export default function MyBookingsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  const { user: authUser } = useAuth();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBookings = async () => {
    try {
      // Check if user is logged in
      if (!isAuthenticated()) {
        router.push(`/${locale}/login`);
        return;
      }

      const user = getUser();
      if (!user) {
        router.push(`/${locale}/login`);
        return;
      }

      // Fetch bookings from Supabase
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          hotel:hotels(name, city, country)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBookings(data || []);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError(t('bookings.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('bookings.myBookings')}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {t('bookings.noBookings')}
            </h3>
            <p className="mt-1 text-gray-500">
              {t('bookings.noBookingsDescription')}
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push(`/${locale}`)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                {t('bookings.searchHotels')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {booking.hotel?.name || t('bookings.unknownHotel')}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {booking.hotel?.city}, {booking.hotel?.country}
                    </p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">{t('bookings.checkIn')}</p>
                        <p className="font-medium">{formatDate(booking.check_in)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('bookings.checkOut')}</p>
                        <p className="font-medium">{formatDate(booking.check_out)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('bookings.guests')}</p>
                        <p className="font-medium">
                          {booking.guests} {booking.guests === 1 ? t('bookings.guest') : t('bookings.guestsPlural')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6 text-right">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {t(`bookings.status.${booking.status}`)}
                    </span>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      €{booking.total_price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t('bookings.bookedOn')} {formatDate(booking.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
