'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { authenticatedFetch, isAuthenticated, getUser } from '@/lib/auth/client';

interface Hotel {
  id: string;
  name: string;
  address_city: string;
  address_country: string;
  property_type: string;
  star_rating: number | null;
  total_rooms: number;
  status: string;
  created_at: string;
  images?: Array<{ url: string; is_primary: boolean }>;
}

export default function PanelHotelsPage() {
  const t = useTranslations('panel');
  const locale = useLocale();
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAndLoadHotels = async () => {
      // Check authentication
      if (!isAuthenticated()) {
        toast.error(t('auth.notAuthenticated'));
        router.push(`/${locale}/login`);
        return;
      }

      const user = getUser();
      if (user?.role !== 'hotelier' && user?.role !== 'admin') {
        toast.error(t('auth.unauthorized'));
        router.push(`/${locale}`);
        return;
      }

      // Load hotels
      await loadHotels();
    };

    verifyAndLoadHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, router, t]);

  const loadHotels = async () => {
    try {
      console.log('[Hotels Page] Loading hotels...');
      const response = await authenticatedFetch('/api/panel/hotels');
      
      console.log('[Hotels Page] Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[Hotels Page] Error:', errorData);
        throw new Error(errorData.error || 'Failed to load hotels');
      }

      const data = await response.json();
      console.log('[Hotels Page] Received data:', data);
      setHotels(data.hotels || []);
    } catch (error) {
      console.error('Error loading hotels:', error);
      toast.error(t('hotels.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status as keyof typeof statusColors] || statusColors.inactive}`}>
        {t(`hotels.status.${status}` as any) || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('hotels.title')}</h1>
          <p className="text-gray-600 mt-1">{t('hotels.subtitle')}</p>
        </div>
        <Link
          href={`/${locale}/panel/hotels/new`}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 font-medium"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('hotels.addNew')}
        </Link>
      </div>

      {/* Hotels List */}
      {hotels.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🏨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('hotels.noHotels')}</h3>
          <p className="text-gray-600 mb-6">{t('hotels.noHotelsDescription')}</p>
          <Link
            href={`/${locale}/panel/hotels/new`}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('hotels.registerFirst')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => {
            const primaryImage = hotel.images?.find(img => img.is_primary) || hotel.images?.[0];
            
            return (
              <Link
                key={hotel.id}
                href={`/${locale}/panel/hotels/${hotel.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Hotel Image */}
                <div className="aspect-[4/3] relative bg-gray-200">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt={hotel.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Hotel Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                        {hotel.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {hotel.address_city}, {hotel.address_country}
                      </p>
                    </div>
                    {hotel.star_rating && (
                      <div className="flex items-center gap-1 text-yellow-500 ml-2">
                        {'★'.repeat(hotel.star_rating)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {hotel.total_rooms || 0} {t('hotels.roomsCount')}
                      </span>
                    </div>
                    {getStatusBadge(hotel.status)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
