'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

interface Hotel {
  id: string;
  name: string;
  description?: string;
  city: string;
  country: string;
  starRating?: number;
  averageRating: number;
  totalReviews: number;
  image?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const t = useTranslations();
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const destination = searchParams.get('destination');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (destination) params.append('destination', destination);
        if (checkIn) params.append('checkIn', checkIn);
        if (checkOut) params.append('checkOut', checkOut);
        if (guests) params.append('guests', guests);
        
        const response = await fetch(`/api/hotels?${params.toString()}`);
        const data = await response.json();
        
        if (response.ok) {
          setHotels(data.hotels || []);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destination, checkIn, checkOut, guests]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {destination ? `${t('search.resultsFor')} ${destination}` : t('search.allHotels')}
        </h1>
        <p className="text-gray-600">
          {total} {t('search.hotelsFound')}
        </p>
          {checkIn && checkOut && (
            <p className="text-sm text-gray-500 mt-1">
              {checkIn} - {checkOut} · {guests || 2} {t('search.guests')}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80" />
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">{t('search.noResults')}</p>
            <p className="text-gray-500 mt-2">{t('search.tryDifferent')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <a
                key={hotel.id}
                href={`/hotel/${hotel.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  {hotel.starRating && (
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-semibold">
                      {'★'.repeat(hotel.starRating)}
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-1">{hotel.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {hotel.city}, {hotel.country}
                  </p>
                  
                  {hotel.averageRating > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-primary text-white px-2 py-1 rounded font-semibold text-sm">
                        {hotel.averageRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({hotel.totalReviews} {t('hotel.reviews')})
                      </span>
                    </div>
                  )}
                  
                  {hotel.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {hotel.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
  );
}
