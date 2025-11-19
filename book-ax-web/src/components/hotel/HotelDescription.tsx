'use client';

import { useState } from 'react';

interface HotelDescriptionProps {
  shortDescription?: string;
  description?: string;
}

export default function HotelDescription({
  shortDescription,
  description,
}: HotelDescriptionProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!description && !shortDescription) {
    return null;
  }

  const shouldTruncate = description && description.length > 500;
  const displayDescription = showFullDescription || !shouldTruncate
    ? description
    : description?.substring(0, 500) + '...';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">About this property</h2>
      
      {shortDescription && (
        <p className="text-lg text-gray-700 mb-4 font-medium">
          {shortDescription}
        </p>
      )}
      
      {description && (
        <>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {displayDescription}
          </p>
          
          {shouldTruncate && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-primary-600 hover:text-primary-700 font-medium mt-3"
            >
              {showFullDescription ? 'Show less' : 'Read more'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
