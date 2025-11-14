import Link from 'next/link';
import Image from 'next/image';

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
    image: 'https://images.unsplash.com/photo-1519635128870-97b1f85e2e6b?w=600&h=400&fit=crop',
  },
];

interface PopularDestinationsProps {
  locale: string;
}

export function PopularDestinations({ locale }: PopularDestinationsProps) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {destinations.map((destination) => (
        <Link
          key={destination.name}
          href={`/${locale}/search?destination=${destination.name}`}
          className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-offset-2 transition-all"
          aria-label={`Explore ${destination.hotels} hotels in ${destination.name}, ${destination.country}`}
        >
          <div className="aspect-[4/3] relative">
            <Image
              src={destination.image}
              alt={`${destination.name}, ${destination.country}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-xl font-bold">{destination.name}</h3>
              <p className="text-sm opacity-90" aria-label={`${destination.hotels} hotels available`}>
                {destination.hotels} Hotels
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
