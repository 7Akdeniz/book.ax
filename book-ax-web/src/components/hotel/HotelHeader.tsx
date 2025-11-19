interface HotelHeaderProps {
  name: string;
  address: {
    street: string;
    city: string;
    state?: string;
    country: string;
  };
  starRating?: number;
  propertyType: string;
}

export default function HotelHeader({
  name,
  address,
  starRating,
  propertyType,
}: HotelHeaderProps) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 mb-2">
          {starRating && (
            <span className="text-yellow-500 text-xl">
              {'★'.repeat(starRating)}
            </span>
          )}
          <span className="text-sm text-gray-500 uppercase">{propertyType}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {name}
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>
            {address.street}, {address.city}
            {address.state && `, ${address.state}`}, {address.country}
          </span>
        </div>
      </div>
    </div>
  );
}
