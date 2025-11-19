'use client';

interface HotelLocationProps {
  latitude?: number;
  longitude?: number;
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
}

export default function HotelLocation({
  latitude,
  longitude,
  address,
}: HotelLocationProps) {
  const fullAddress = [
    address.street,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ].filter(Boolean).join(', ');

  const mapUrl = latitude && longitude
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
      
      <div className="flex items-start gap-3 mb-6">
        <svg className="h-6 w-6 text-primary-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <div>
          <p className="text-gray-700 font-medium">{fullAddress}</p>
          {latitude && longitude && (
            <p className="text-sm text-gray-500 mt-1">
              Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          )}
        </div>
      </div>

      {mapUrl && (
        <div className="relative w-full h-96 rounded-lg overflow-hidden">
          <iframe
            src={mapUrl}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
