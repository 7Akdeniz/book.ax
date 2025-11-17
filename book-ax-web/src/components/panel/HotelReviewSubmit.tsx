'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { authenticatedFetch } from '@/lib/auth/client';

interface HotelReviewSubmitProps {
  data: any;
  onBack: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function HotelReviewSubmit({ data, onBack, onSubmit }: HotelReviewSubmitProps) {
  const t = useTranslations('panel.hotels.new.review');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // Get first translation for hotel name and description
      const firstTranslation = Object.values(data.translations || {})[0] as any;
      const hotelName = firstTranslation?.name || data.name;
      const hotelDescription = firstTranslation?.description || '';

      // 1. Create Hotel
      const hotelResponse = await authenticatedFetch('/api/panel/hotels', {
        method: 'POST',
        body: JSON.stringify({
          propertyType: data.propertyType,
          name: hotelName,
          description: hotelDescription,
          starRating: data.starRating,
          addressStreet: data.addressLine1,
          addressCity: data.addressCity,
          addressState: data.addressState,
          addressPostalCode: data.addressPostalCode,
          addressCountry: data.addressCountry,
          phone: data.contactPhone,
          email: data.contactEmail,
          website: data.website,
          latitude: data.latitude,
          longitude: data.longitude,
          checkInTime: data.checkInTime,
          checkOutTime: data.checkOutTime,
          totalRooms: data.totalRooms,
          commissionPercentage: data.commissionPercentage,
          locale: locale || 'de',
        }),
      });

      if (!hotelResponse.ok) {
        const error = await hotelResponse.json();
        throw new Error(error.error || 'Failed to create hotel');
      }

      const { hotel } = await hotelResponse.json();
      const hotelId = hotel.id;

      // 2. Upload Images (if any)
      if (data.images && data.images.length > 0) {
        const imageUploadPromises = data.images.map((image: any, index: number) =>
          authenticatedFetch(`/api/panel/hotels/${hotelId}/images`, {
            method: 'POST',
            body: JSON.stringify({
              url: image.url,
              altText: image.altText,
              isPrimary: image.isPrimary,
              displayOrder: index,
            }),
          })
        );

        const imageResults = await Promise.allSettled(imageUploadPromises);
        const failedImages = imageResults.filter(r => r.status === 'rejected');
        
        if (failedImages.length > 0) {
          console.warn(`${failedImages.length} image(s) failed to upload`);
        }
      }

      // TODO: Add additional translations (beyond the first one)
      // This would require a separate API endpoint for translations

      toast.success(t('success'));
      router.push(`/${locale}/panel`);
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || t('error'));
      setSubmitting(false);
    }
  };

  const PROPERTY_TYPE_ICONS: Record<string, string> = {
    hotel: '🏨',
    hostel: '🏠',
    apartment: '🏢',
    villa: '🏡',
    resort: '🌴',
    motel: '🚗',
    guesthouse: '🏘️',
    boutique: '✨',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Review Sections */}
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>{PROPERTY_TYPE_ICONS[data.propertyType] || '🏨'}</span>
            {t('sections.basic')}
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">{t('fields.name')}:</span>
              <p className="font-medium">{data.name}</p>
            </div>
            <div>
              <span className="text-gray-600">{t('fields.starRating')}:</span>
              <p className="font-medium">{'⭐'.repeat(data.starRating)}</p>
            </div>
            <div>
              <span className="text-gray-600">{t('fields.totalRooms')}:</span>
              <p className="font-medium">{data.totalRooms}</p>
            </div>
            <div>
              <span className="text-gray-600">{t('fields.commission')}:</span>
              <p className="font-medium">{data.commissionPercentage}%</p>
            </div>
            <div>
              <span className="text-gray-600">{t('fields.checkIn')}:</span>
              <p className="font-medium">{data.checkInTime}</p>
            </div>
            <div>
              <span className="text-gray-600">{t('fields.checkOut')}:</span>
              <p className="font-medium">{data.checkOutTime}</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📍 {t('sections.address')}
          </h3>
          <div className="text-sm space-y-1">
            <p>{data.addressLine1}</p>
            {data.addressLine2 && <p>{data.addressLine2}</p>}
            <p>
              {data.addressCity}, {data.addressState && `${data.addressState}, `}
              {data.addressPostalCode}
            </p>
            <p className="font-medium">{data.addressCountry}</p>
          </div>
          <div className="mt-3 pt-3 border-t space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">📞 {t('fields.phone')}:</span>{' '}
              {data.contactPhone}
            </p>
            <p className="text-sm">
              <span className="text-gray-600">✉️ {t('fields.email')}:</span>{' '}
              {data.contactEmail}
            </p>
            {data.website && (
              <p className="text-sm">
                <span className="text-gray-600">🌐 {t('fields.website')}:</span>{' '}
                <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                  {data.website}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Translations */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🌍 {t('sections.translations')}
          </h3>
          <div className="space-y-2">
            {Object.entries(data.translations || {}).map(([lang, trans]: [string, any]) => (
              trans.name && (
                <div key={lang} className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-white border rounded font-mono text-xs">
                    {lang.toUpperCase()}
                  </span>
                  <span className="font-medium">{trans.name}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 truncate max-w-md">
                    {trans.description?.substring(0, 60)}...
                  </span>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📸 {t('sections.images')} ({data.images?.length || 0})
          </h3>
          {data.images && data.images.length > 0 ? (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {data.images.map((image: any, index: number) => (
                <div key={index} className="relative aspect-square rounded overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.altText || `Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {image.isPrimary && (
                    <div className="absolute top-1 left-1 px-1 py-0.5 bg-primary-600 text-white text-xs rounded">
                      ⭐
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">{t('noImages')}</p>
          )}
        </div>
      </div>

      {/* Warning */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          ⚠️ {t('warning')}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          ← {t('backButton')}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <span className="inline-block animate-spin mr-2">⏳</span>
              {t('submitting')}
            </>
          ) : (
            <>
              ✓ {t('submitButton')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
