'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'react-hot-toast';
import { authenticatedFetch, isAuthenticated } from '@/lib/auth/client';

interface ReviewFormProps {
  bookingId: string;
  hotelName: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ bookingId, hotelName, onSuccess }: ReviewFormProps) {
  const t = useTranslations('reviews');
  const locale = useLocale();

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    cleanlinessRating: 5,
    locationRating: 5,
    serviceRating: 5,
    valueRating: 5,
    comment: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      toast.error(t('loginRequired'));
      return;
    }

    if (formData.comment.length < 10) {
      toast.error(t('commentTooShort'));
      return;
    }

    try {
      setSubmitting(true);

      const response = await authenticatedFetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          rating: formData.rating,
          cleanlinessRating: formData.cleanlinessRating,
          locationRating: formData.locationRating,
          serviceRating: formData.serviceRating,
          valueRating: formData.valueRating,
          comment: formData.comment,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit review');
      }

      toast.success(t('submitSuccess'));
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error.message || t('submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-3xl transition-colors ${
              star <= value ? 'text-yellow-500' : 'text-gray-300'
            } hover:text-yellow-400`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {t('writeReview')} - {hotelName}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <StarRating
          label={t('overallRating')}
          value={formData.rating}
          onChange={(value) => setFormData({ ...formData, rating: value })}
        />

        {/* Category Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StarRating
            label={t('cleanliness')}
            value={formData.cleanlinessRating}
            onChange={(value) => setFormData({ ...formData, cleanlinessRating: value })}
          />
          <StarRating
            label={t('location')}
            value={formData.locationRating}
            onChange={(value) => setFormData({ ...formData, locationRating: value })}
          />
          <StarRating
            label={t('service')}
            value={formData.serviceRating}
            onChange={(value) => setFormData({ ...formData, serviceRating: value })}
          />
          <StarRating
            label={t('value')}
            value={formData.valueRating}
            onChange={(value) => setFormData({ ...formData, valueRating: value })}
          />
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            {t('yourReview')} *
          </label>
          <textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={6}
            placeholder={t('commentPlaceholder')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
            minLength={10}
            maxLength={2000}
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.comment.length} / 2000 {t('characters')}
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || formData.comment.length < 10}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? t('submitting') : t('submitReview')}
        </button>
      </form>
    </div>
  );
}
