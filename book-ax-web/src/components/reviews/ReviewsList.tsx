'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import ReviewCard from './ReviewCard';

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

interface ReviewsListProps {
  hotelId: string;
  locale: string;
}

interface ReviewStats {
  totalReviews: number;
  avgRating: number;
  avgCleanliness: number;
  avgLocation: number;
  avgService: number;
  avgValue: number;
}

export default function ReviewsList({ hotelId, locale }: ReviewsListProps) {
  const t = useTranslations('reviews');
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const limit = 10;

  useEffect(() => {
    loadReviews();
  }, [hotelId]);

  const loadReviews = async (loadMore = false) => {
    try {
      setLoading(true);
      const currentOffset = loadMore ? offset : 0;

      const response = await fetch(
        `/api/hotels/${hotelId}/reviews?limit=${limit}&offset=${currentOffset}`
      );

      if (!response.ok) {
        throw new Error('Failed to load reviews');
      }

      const data = await response.json();
      
      if (loadMore) {
        setReviews([...reviews, ...data.reviews]);
      } else {
        setReviews(data.reviews);
      }
      
      setStats(data.stats);
      setHasMore(data.pagination.hasMore);
      setOffset(currentOffset + limit);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const CategoryRating = ({ label, value }: { label: string; value: number }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full"
            style={{ width: `${(value / 5) * 100}%` }}
          />
        </div>
        <span className="text-gray-900 font-medium w-8">{value.toFixed(1)}</span>
      </div>
    </div>
  );

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-6xl mb-4">⭐</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('noReviews')}
        </h3>
        <p className="text-gray-600">{t('noReviewsDescription')}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Review Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <div className="text-6xl font-bold text-gray-900">
                {stats.avgRating.toFixed(1)}
              </div>
              <div>
                <div className="flex text-3xl text-yellow-500 mb-1">
                  {'★'.repeat(Math.round(stats.avgRating))}
                  {'☆'.repeat(5 - Math.round(stats.avgRating))}
                </div>
                <p className="text-gray-600">
                  {t('basedOn', { count: stats.totalReviews })}
                </p>
              </div>
            </div>
          </div>

          {/* Category Ratings */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">{t('categories')}</h3>
            <CategoryRating label={t('cleanliness')} value={stats.avgCleanliness} />
            <CategoryRating label={t('location')} value={stats.avgLocation} />
            <CategoryRating label={t('service')} value={stats.avgService} />
            <CategoryRating label={t('value')} value={stats.avgValue} />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} locale={locale} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => loadReviews(true)}
            disabled={loading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? t('loading') : t('loadMore')}
          </button>
        </div>
      )}
    </div>
  );
}
