'use client';

import { useState } from 'react';
import Image from 'next/image';

interface HotelImage {
  id: string;
  url: string;
  alt?: string;
  is_primary?: boolean;
}

interface HotelGalleryProps {
  images: HotelImage[];
  hotelName: string;
}

export default function HotelGallery({ images, hotelName }: HotelGalleryProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const primaryImage = images.find(img => img.is_primary) || images[0];
  const otherImages = images.filter(img => img.id !== primaryImage.id).slice(0, 4);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-4 gap-2 h-96">
          {/* Primary Image */}
          <div className="col-span-4 md:col-span-2 row-span-2 relative rounded-lg overflow-hidden cursor-pointer group" onClick={() => { setShowGallery(true); setCurrentImageIndex(0); }}>
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || hotelName}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>

          {/* Other Images */}
          {otherImages.map((image, index) => (
            <div
              key={image.id}
              className="relative rounded-lg overflow-hidden cursor-pointer group hidden md:block"
              onClick={() => { setShowGallery(true); setCurrentImageIndex(index + 1); }}
            >
              <Image
                src={image.url}
                alt={image.alt || `${hotelName} - Image ${index + 2}`}
                fill
                sizes="25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}

          {/* Show All Photos Button */}
          {images.length > 5 && (
            <button
              onClick={() => setShowGallery(true)}
              className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow font-medium"
            >
              Show all {images.length} photos
            </button>
          )}
        </div>
      </div>

      {/* Full Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={handlePrevious}
            className="absolute left-4 text-white hover:text-gray-300 z-10"
          >
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-8">
            <Image
              src={images[currentImageIndex].url}
              alt={images[currentImageIndex].alt || `${hotelName} - Image ${currentImageIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 text-white hover:text-gray-300 z-10"
          >
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
