'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/utils/formatting';

interface RoomCategory {
  id: string;
  name: string;
  description?: string;
  maxOccupancy: number;
  basePrice: number;
  totalRooms: number;
  sizeSqm?: number;
  bedType?: string;
  smokingAllowed: boolean;
}

interface Hotel {
  id: string;
  name: string;
  description?: string;
  propertyType: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  checkInTime: string;
  checkOutTime: string;
  starRating?: number;
  averageRating: number;
  totalReviews: number;
  images: Array<{ url: string; alt_text?: string }>;
  amenities: Array<{ code: string; icon?: string }>;
  roomCategories: RoomCategory[];
  reviews: Array<{
    id: string;
    rating: number;
    comment?: string;
    guestName: string;
    createdAt: string;
  }>;
}

export default function HotelPage() {
  const params = useParams();
  const t = useTranslations();
  const locale = params.locale as string;
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/hotels/${params.id}?locale=${locale}`);
        const data = await response.json();
        
        if (response.ok) {
          setHotel(data);
        }
      } catch (error) {
        console.error('Failed to load hotel:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchHotel();
    }
  }, [params.id, locale]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-96 rounded-lg mb-6" />
          <div className="bg-gray-200 h-8 w-1/2 rounded mb-4" />
          <div className="bg-gray-200 h-4 w-1/3 rounded mb-8" />
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">{t('hotel.notFound')}</h1>
          <a href="/" className="text-primary hover:underline">
            {t('common.backHome')}
          </a>
        </div>
      </div>
    );
  }

  const mainImage = hotel.images[selectedImage]?.url || hotel.images[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

  return (
    <>
      {/* Image Gallery */}
      <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-4 gap-2 h-96">
            <div className="col-span-3">
              <img
                src={mainImage}
                alt={hotel.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-rows-4 gap-2">
              {hotel.images.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.alt_text || hotel.name}
                  className={`w-full h-full object-cover rounded-lg cursor-pointer ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {hotel.starRating && (
                    <span className="text-yellow-500 text-xl">
                      {'★'.repeat(hotel.starRating)}
                    </span>
                  )}
                  <span className="text-sm text-gray-500 uppercase">{hotel.propertyType}</span>
                </div>
                <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
                <p className="text-gray-600">
                  {hotel.address.street}, {hotel.address.city}, {hotel.address.country}
                </p>
                {hotel.averageRating > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="bg-primary text-white px-3 py-1 rounded font-bold">
                      {hotel.averageRating.toFixed(1)}
                    </span>
                    <span className="text-gray-700 font-semibold">
                      {t('hotel.excellent')}
                    </span>
                    <span className="text-gray-500">
                      · {hotel.totalReviews} {t('hotel.reviews')}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {hotel.description && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-3">{t('hotel.aboutProperty')}</h2>
                  <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
                </div>
              )}

              {/* Amenities */}
              {hotel.amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-3">{t('hotel.amenities')}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {hotel.amenities.map((amenity) => (
                      <div key={amenity.code} className="flex items-center gap-2">
                        <span className="text-primary text-xl">{amenity.icon || '✓'}</span>
                        <span className="text-gray-700 capitalize">{amenity.code.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Categories */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{t('hotel.availableRooms')}</h2>
                <div className="space-y-4">
                  {hotel.roomCategories.map((room) => (
                    <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-1">{room.name}</h3>
                          {room.description && (
                            <p className="text-gray-600 text-sm mb-2">{room.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span>👥 Max {room.maxOccupancy} {t('hotel.guests')}</span>
                            {room.sizeSqm && <span>📏 {room.sizeSqm} m²</span>}
                            {room.bedType && <span>🛏️ {room.bedType}</span>}
                            <span>{room.smokingAllowed ? '🚬 ' + t('hotel.smokingAllowed') : '🚭 ' + t('hotel.nonSmoking')}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(room.basePrice, 'EUR', locale)}
                          </p>
                          <p className="text-sm text-gray-600">{t('hotel.perNight')}</p>
                          <button className="mt-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                            {t('hotel.bookNow')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              {hotel.reviews.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">{t('hotel.guestReviews')}</h2>
                  <div className="space-y-4">
                    {hotel.reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold">{review.guestName}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString(locale)}
                            </p>
                          </div>
                          <span className="bg-primary text-white px-3 py-1 rounded font-bold">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border rounded-lg shadow-lg p-6 sticky top-4">
                <h3 className="text-xl font-bold mb-4">{t('hotel.bookYourStay')}</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">{t('common.checkIn')}</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">{t('common.checkOut')}</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">{t('common.guests')}</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    defaultValue="2"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-1">{t('hotel.checkInTime')}:</p>
                  <p className="font-semibold">{hotel.checkInTime}</p>
                  <p className="text-sm text-gray-600 mt-2 mb-1">{t('hotel.checkOutTime')}:</p>
                  <p className="font-semibold">{hotel.checkOutTime}</p>
                </div>

                <button className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-600 transition-colors">
                  {t('hotel.checkAvailability')}
                </button>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
