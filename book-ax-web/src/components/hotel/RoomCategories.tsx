'use client';

import { formatCurrency } from '@/utils/formatting';

interface Room {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  max_occupancy: number;
  size_sqm?: number;
  bed_type?: string;
  smoking_allowed?: boolean;
  amenities?: string[];
}

interface RoomCategoriesProps {
  rooms: Room[];
  hotelId: string;
  checkIn?: string;
  checkOut?: string;
  locale: string;
}

export default function RoomCategories({
  rooms,
  hotelId,
  checkIn,
  checkOut,
  locale,
}: RoomCategoriesProps) {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No rooms available at the moment</p>
      </div>
    );
  }

  const handleBookRoom = (roomId: string) => {
    const params = new URLSearchParams({
      roomCategoryId: roomId,
    });
    
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    
    window.location.href = `/${locale}/booking/confirm?${params.toString()}&hotelId=${hotelId}`;
  };

  return (
    <div className="space-y-4">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            {/* Room Info */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {room.name}
              </h3>
              
              {room.description && (
                <p className="text-gray-600 mb-4">{room.description}</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Max {room.max_occupancy} guests</span>
                </div>
                
                {room.size_sqm && (
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                    </svg>
                    <span>{room.size_sqm} m²</span>
                  </div>
                )}
                
                {room.bed_type && (
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>{room.bed_type}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  {room.smoking_allowed ? (
                    <>
                      <span>🚬</span>
                      <span>Smoking allowed</span>
                    </>
                  ) : (
                    <>
                      <span>🚭</span>
                      <span>Non-smoking</span>
                    </>
                  )}
                </div>
              </div>
              
              {room.amenities && room.amenities.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Room amenities:</p>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.slice(0, 6).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {amenity.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {room.amenities.length > 6 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{room.amenities.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Pricing & Booking */}
            <div className="lg:w-64 flex flex-col items-end justify-between">
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600">
                  {formatCurrency(room.base_price, 'EUR', locale)}
                </p>
                <p className="text-sm text-gray-600">per night</p>
              </div>
              
              <button
                onClick={() => handleBookRoom(room.id)}
                className="w-full lg:w-auto mt-4 bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                Select Room
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
