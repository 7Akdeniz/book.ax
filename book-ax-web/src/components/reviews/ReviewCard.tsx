interface Review {
  id: string;
  rating: number;
  ratings: {
    cleanliness?: number;
    location?: number;
    service?: number;
    value?: number;
  };
  comment?: string;
  response?: string;
  responseDate?: string;
  isVerified: boolean;
  guestName: string;
  createdAt: string;
}

interface ReviewCardProps {
  review: Review;
  locale: string;
}

export default function ReviewCard({ review, locale }: ReviewCardProps) {
  const StarDisplay = ({ rating }: { rating: number }) => (
    <div className="flex gap-1 text-yellow-500">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? '' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900">{review.guestName}</h3>
            {review.isVerified && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">{review.rating.toFixed(1)}</span>
          <StarDisplay rating={review.rating} />
        </div>
      </div>

      {/* Category Ratings */}
      {(review.ratings.cleanliness || review.ratings.location || review.ratings.service || review.ratings.value) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
          {review.ratings.cleanliness && (
            <div>
              <span className="text-gray-600">Cleanliness:</span>
              <span className="ml-2 font-medium">{review.ratings.cleanliness.toFixed(1)}</span>
            </div>
          )}
          {review.ratings.location && (
            <div>
              <span className="text-gray-600">Location:</span>
              <span className="ml-2 font-medium">{review.ratings.location.toFixed(1)}</span>
            </div>
          )}
          {review.ratings.service && (
            <div>
              <span className="text-gray-600">Service:</span>
              <span className="ml-2 font-medium">{review.ratings.service.toFixed(1)}</span>
            </div>
          )}
          {review.ratings.value && (
            <div>
              <span className="text-gray-600">Value:</span>
              <span className="ml-2 font-medium">{review.ratings.value.toFixed(1)}</span>
            </div>
          )}
        </div>
      )}

      {/* Comment */}
      {review.comment && (
        <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
      )}

      {/* Hotel Response */}
      {review.response && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4 border-l-4 border-primary-600">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="font-semibold text-gray-900">Hotel Response</span>
            {review.responseDate && (
              <span className="text-sm text-gray-500">
                {new Date(review.responseDate).toLocaleDateString(locale)}
              </span>
            )}
          </div>
          <p className="text-gray-700">{review.response}</p>
        </div>
      )}
    </div>
  );
}
