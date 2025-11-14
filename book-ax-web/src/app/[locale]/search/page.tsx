import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { searchHotels } from '@/lib/db/queries';

interface SearchPageProps {
  params: { locale: string };
  searchParams: {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export async function generateMetadata({ searchParams, params }: SearchPageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://book.ax';
  const destination = searchParams.destination || 'Hotels';
  
  return {
    title: `${destination} Hotels - Search Results | Book.ax`,
    description: `Find the best hotels in ${destination}. Compare prices and book directly with no booking fees.`,
    alternates: {
      canonical: `${baseUrl}/${params.locale}/search`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams, params }: SearchPageProps) {
  const t = await getTranslations();
  
  const hotels = await searchHotels({
    destination: searchParams.destination,
    checkIn: searchParams.checkIn,
    checkOut: searchParams.checkOut,
    guests: searchParams.guests ? parseInt(searchParams.guests) : undefined,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    locale: params.locale,
  });

  const total = hotels.length;
  const destination = searchParams.destination;
  const checkIn = searchParams.checkIn;
  const checkOut = searchParams.checkOut;
  const guests = searchParams.guests || '2';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {destination ? `Hotels in ${destination}` : 'All Hotels'}
        </h1>
        <p className="text-gray-600">{total} hotels found</p>
        {checkIn && checkOut && (
          <p className="text-sm text-gray-500 mt-1">
            {checkIn} - {checkOut} · {guests} guests
          </p>
        )}
      </div>

      {hotels.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No hotels found</p>
          <p className="text-gray-500 mt-2">Try different search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Link
              key={hotel.id}
              href={`/${params.locale}/hotel/${hotel.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
                  alt={hotel.name || 'Hotel'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {hotel.name || 'Hotel'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {hotel.address_city}, {hotel.address_country}
                    </p>
                  </div>
                  {hotel.average_rating && hotel.average_rating > 0 && (
                    <div className="flex items-center gap-1 bg-primary-600 text-white px-2 py-1 rounded ml-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-semibold">{hotel.average_rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {hotel.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {hotel.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-sm text-gray-600">
                    {hotel.total_reviews || 0} reviews
                  </span>
                  {hotel.star_rating && (
                    <span className="text-yellow-500">
                      {'★'.repeat(hotel.star_rating)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
