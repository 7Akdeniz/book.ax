import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { getHotelById } from '@/lib/db/queries';
import { HotelImageGallery } from '@/components/hotel/HotelImageGallery';
import { BookingCard } from '@/components/hotel/BookingCard';
import { HotelStructuredData } from '@/components/seo/StructuredData';
import { formatCurrency } from '@/utils/formatting';
import { BookNowButton } from '@/components/hotel/BookNowButton';
import ReviewsList from '@/components/reviews/ReviewsList';

interface PageProps {
  params: {
    id: string;
    locale: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const hotel = await getHotelById(params.id, params.locale);

  if (!hotel) {
    return { title: 'Hotel Not Found' };
  }

  const minPrice = hotel.room_categories[0]?.base_price;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://book.ax';

  return {
    title: `\${hotel.name} - \${hotel.address_city} | Book.ax`,
    description: hotel.description?.substring(0, 160) || `Book \${hotel.name} in \${hotel.address_city}, \${hotel.address_country}. \${hotel.star_rating}-star hotel with \${hotel.total_reviews} reviews.`,
    keywords: [hotel.name, hotel.address_city, hotel.address_country, hotel.property_type, 'hotel booking'],
    alternates: {
      canonical: `\${baseUrl}/\${params.locale}/hotel/\${params.id}`,
      languages: {
        'de-DE': `\${baseUrl}/de/hotel/\${params.id}`,
        'en-US': `\${baseUrl}/en/hotel/\${params.id}`,
      },
    },
    openGraph: {
      title: `\${hotel.name} - \${hotel.address_city}`,
      description: hotel.description?.substring(0, 200) || `Book \${hotel.name}`,
      url: `\${baseUrl}/\${params.locale}/hotel/\${params.id}`,
      siteName: 'Book.ax',
      images: [{ url: hotel.images[0]?.url || '/og-image.jpg', width: 1200, height: 630, alt: hotel.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `\${hotel.name} - \${hotel.address_city}`,
      description: hotel.description?.substring(0, 160) || `Book \${hotel.name}`,
      images: [hotel.images[0]?.url || '/og-image.jpg'],
    },
  };
}

export default async function HotelPage({ params }: PageProps) {
  const t = await getTranslations();
  const hotel = await getHotelById(params.id, params.locale);

  if (!hotel) {
    notFound();
  }

  return (
    <>
      <HotelStructuredData
        name={hotel.name}
        description={hotel.description || ''}
        url={`\${process.env.NEXT_PUBLIC_APP_URL}/\${params.locale}/hotel/\${params.id}`}
        image={hotel.images.map(img => img.url)}
        address={{
          streetAddress: hotel.address_street || '',
          addressLocality: hotel.address_city,
          addressRegion: hotel.address_state || '',
          postalCode: hotel.address_postal_code || '',
          addressCountry: hotel.address_country,
        }}
        geo={hotel.latitude && hotel.longitude ? { latitude: hotel.latitude, longitude: hotel.longitude } : undefined}
        aggregateRating={hotel.total_reviews > 0 ? { ratingValue: hotel.average_rating, reviewCount: hotel.total_reviews } : undefined}
        starRating={hotel.star_rating || undefined}
        telephone={hotel.phone}
        email={hotel.email}
        amenityFeature={hotel.amenities.map(a => a.code)}
        checkInTime={hotel.check_in_time}
        checkOutTime={hotel.check_out_time}
      />

      <HotelImageGallery images={hotel.images} hotelName={hotel.name} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                {hotel.star_rating && <span className="text-yellow-500 text-xl">{'★'.repeat(hotel.star_rating)}</span>}
                <span className="text-sm text-gray-500 uppercase">{hotel.property_type}</span>
              </div>
              <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
              <p className="text-gray-600">{hotel.address_street}, {hotel.address_city}, {hotel.address_country}</p>
              {hotel.average_rating > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded font-bold">{hotel.average_rating.toFixed(1)}</span>
                  <span className="text-gray-700 font-semibold">{t('hotel.excellent')}</span>
                  <span className="text-gray-500">· {hotel.total_reviews} {t('hotel.reviews')}</span>
                </div>
              )}
            </div>

            {hotel.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-3">{t('hotel.aboutProperty')}</h2>
                <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
              </div>
            )}

            {hotel.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-3">{t('hotel.amenities')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hotel.amenities.map((amenity) => (
                    <div key={amenity.code} className="flex items-center gap-2">
                      <span className="text-primary-600 text-xl">{amenity.icon || '✓'}</span>
                      <span className="text-gray-700 capitalize">{amenity.code.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{t('hotel.availableRooms')}</h2>
              <div className="space-y-4">
                {hotel.room_categories.map((room) => (
                  <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{room.name}</h3>
                        {room.description && <p className="text-gray-600 text-sm mb-2">{room.description}</p>}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>👥 Max {room.max_occupancy} {t('hotel.guests')}</span>
                          {room.size_sqm && <span>📏 {room.size_sqm} m²</span>}
                          {room.bed_type && <span>🛏️ {room.bed_type}</span>}
                          <span>{room.smoking_allowed ? '🚬 ' + t('hotel.smokingAllowed') : '🚭 ' + t('hotel.nonSmoking')}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-primary-600">{formatCurrency(room.base_price, 'EUR', params.locale)}</p>
                        <p className="text-sm text-gray-600">{t('hotel.perNight')}</p>
                        <BookNowButton roomName={room.name} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {hotel.reviews.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{t('hotel.guestReviews')}</h2>
                <ReviewsList hotelId={params.id} locale={params.locale} />
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="booking-card-container">
              <BookingCard checkInTime={hotel.check_in_time} checkOutTime={hotel.check_out_time} hotelId={hotel.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
