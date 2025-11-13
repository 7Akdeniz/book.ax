'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

const featuredHotels = [
  {
    id: '1',
    name: 'Grand Hotel Berlin',
    city: 'Berlin',
    country: 'Deutschland',
    rating: 4.8,
    reviews: 1234,
    price: 129,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop',
  },
  {
    id: '2',
    name: 'Luxury Suite München',
    city: 'München',
    country: 'Deutschland',
    rating: 4.9,
    reviews: 876,
    price: 189,
    image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=600&h=400&fit=crop',
  },
  {
    id: '3',
    name: 'Harbor View Hamburg',
    city: 'Hamburg',
    country: 'Deutschland',
    rating: 4.7,
    reviews: 654,
    price: 149,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
  },
  {
    id: '4',
    name: 'Rhein Panorama Köln',
    city: 'Köln',
    country: 'Deutschland',
    rating: 4.6,
    reviews: 543,
    price: 119,
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&h=400&fit=crop',
  },
];

export function FeaturedHotels() {
  const locale = useLocale();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredHotels.map((hotel) => (
        <Link
          key={hotel.id}
          href={`/${locale}/hotel/${hotel.id}`}
          className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div className="aspect-[4/3] relative overflow-hidden">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {hotel.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {hotel.city}, {hotel.country}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-primary-600 text-white px-2 py-1 rounded">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold">{hotel.rating}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-gray-600">
                {hotel.reviews} Bewertungen
              </span>
              <div className="text-right">
                <div className="text-sm text-gray-600">ab</div>
                <div className="text-xl font-bold text-primary-600">
                  €{hotel.price}
                  <span className="text-sm font-normal text-gray-600">/Nacht</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
