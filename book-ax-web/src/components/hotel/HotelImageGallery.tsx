'use client';

import Image from 'next/image';
import { useState } from 'react';

interface HotelImage {
  url: string;
  alt_text?: string;
}

interface HotelImageGalleryProps {
  images: HotelImage[];
  hotelName: string;
}

export function HotelImageGallery({ images, hotelName }: HotelImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const mainImage = images[selectedImage]?.url || images[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-4 gap-2 h-96">
        <div className="col-span-3 relative">
          <Image
            src={mainImage}
            alt={images[selectedImage]?.alt_text || hotelName}
            fill
            className="object-cover rounded-lg"
            priority
            sizes="(max-width: 768px) 100vw, 75vw"
          />
        </div>
        <div className="grid grid-rows-4 gap-2">
          {images.slice(0, 4).map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={image.url}
                alt={image.alt_text || hotelName}
                fill
                className={`object-cover rounded-lg cursor-pointer transition-all ${
                  selectedImage === index ? 'ring-2 ring-primary-600' : 'hover:opacity-80'
                }`}
                onClick={() => setSelectedImage(index)}
                sizes="(max-width: 768px) 25vw, 20vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
