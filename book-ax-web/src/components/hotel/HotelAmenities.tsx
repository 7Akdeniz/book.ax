interface HotelAmenitiesProps {
  amenities: string[];
}

const amenityIcons: Record<string, string> = {
  wifi: '📶',
  parking: '🅿️',
  pool: '🏊',
  gym: '💪',
  restaurant: '🍽️',
  bar: '🍸',
  spa: '💆',
  ac: '❄️',
  heating: '🔥',
  breakfast: '🍳',
  room_service: '🛎️',
  laundry: '👔',
  pet_friendly: '🐕',
  elevator: '🛗',
  airport_shuttle: '🚐',
  concierge: '🤵',
  safe: '🔐',
  minibar: '🍾',
};

export default function HotelAmenities({ amenities }: HotelAmenitiesProps) {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {amenities.map((amenity) => {
          const icon = amenityIcons[amenity] || '✓';
          const label = amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          
          return (
            <div key={amenity} className="flex items-center gap-3 text-gray-700">
              <span className="text-2xl">{icon}</span>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
