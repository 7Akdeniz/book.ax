'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

const destinations = [
  {
    name: 'Berlin',
    country: 'Deutschland',
    hotels: 2543,
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&h=400&fit=crop',
  },
  {
    name: 'München',
    country: 'Deutschland',
    hotels: 1876,
    image: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?w=600&h=400&fit=crop',
  },
  {
    name: 'Hamburg',
    country: 'Deutschland',
    hotels: 1432,
    image: 'https://images.unsplash.com/photo-1564221710304-0b37c8b9d729?w=600&h=400&fit=crop',
  },
  {
    name: 'Köln',
    country: 'Deutschland',
    hotels: 987,
    image: 'https://images.unsplash.com/photo-1590686536039-6f7d4b63c7b1?w=600&h=400&fit=crop',
  },
];

export function PopularDestinations() {
  const locale = useLocale();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {destinations.map((destination) => (
        <Link
          key={destination.name}
          href={`/${locale}/search?destination=${destination.name}`}
          className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
        >
          <div className="aspect-[4/3] relative">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-xl font-bold">{destination.name}</h3>
              <p className="text-sm opacity-90">{destination.hotels} Hotels</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
