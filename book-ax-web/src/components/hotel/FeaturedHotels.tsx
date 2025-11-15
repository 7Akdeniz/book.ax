import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedHotels } from '@/lib/db/queries';

interface FeaturedHotelsProps {
  locale: string;
}

export async function FeaturedHotels({ locale }: FeaturedHotelsProps) {
  // Fetch real hotels from database
  const hotels = await getFeaturedHotels(locale, 4);

  if (!hotels || hotels.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No featured hotels available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {hotels.map((hotel: any) => {
        const primaryImage = hotel.image || '/placeholder-hotel.jpg';
        const minPrice = 99; // Placeholder since we don't have room categories here
        
        return (
          <Link
            key={hotel.id}
            href={`/${locale}/hotel/${hotel.id}`}
            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="aspect-[4/3] relative overflow-hidden bg-gray-200">
              <Image
                src={primaryImage}
                alt={`${hotel.name} in ${hotel.address_city}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
                quality={85}
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {hotel.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {hotel.address_city}, {hotel.address_country}
                  </p>
                </div>
                {hotel.average_rating && hotel.average_rating > 0 && (
                  <div className="flex items-center gap-1 bg-primary-600 text-white px-2 py-1 rounded">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-semibold">{hotel.average_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-600">
                  {hotel.total_reviews || 0} Reviews
                </span>
                <div className="text-right">
                  <div className="text-sm text-gray-600">from</div>
                  <div className="text-xl font-bold text-primary-600">
                    €{minPrice}
                    <span className="text-sm font-normal text-gray-600">/night</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
