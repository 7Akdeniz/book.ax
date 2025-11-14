'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface HotelBasicInfoFormProps {
  data: any;
  onNext: (data: any) => void;
}

const PROPERTY_TYPES = [
  { value: 'hotel', icon: '🏨', label: 'Hotel' },
  { value: 'hostel', icon: '🏠', label: 'Hostel' },
  { value: 'apartment', icon: '🏢', label: 'Apartment' },
  { value: 'villa', icon: '🏡', label: 'Villa' },
  { value: 'resort', icon: '🌴', label: 'Resort' },
  { value: 'motel', icon: '🚗', label: 'Motel' },
  { value: 'guesthouse', icon: '🏘️', label: 'Guesthouse' },
  { value: 'boutique', icon: '✨', label: 'Boutique Hotel' },
];

export function HotelBasicInfoForm({ data, onNext }: HotelBasicInfoFormProps) {
  const t = useTranslations('panel.hotels.new.basic');

  const [formData, setFormData] = useState({
    propertyType: data.propertyType || 'hotel',
    name: data.name || '',
    starRating: data.starRating || 3,
    checkInTime: data.checkInTime || '14:00',
    checkOutTime: data.checkOutTime || '11:00',
    totalRooms: data.totalRooms || 10,
    commissionPercentage: data.commissionPercentage || 15,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = t('errors.nameRequired');
    }

    if (formData.totalRooms < 1 || formData.totalRooms > 1000) {
      newErrors.totalRooms = t('errors.totalRoomsInvalid');
    }

    if (formData.commissionPercentage < 10 || formData.commissionPercentage > 50) {
      newErrors.commissionPercentage = t('errors.commissionInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Property Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('propertyType.label')} <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, propertyType: type.value })}
              className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                formData.propertyType === type.value
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }`}
            >
              <span className="text-3xl mb-2">{type.icon}</span>
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hotel Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          {t('name.label')} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={t('name.placeholder')}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">{t('name.hint')}</p>
      </div>

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('starRating.label')} <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setFormData({ ...formData, starRating: rating })}
              className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all ${
                formData.starRating >= rating
                  ? 'border-yellow-400 bg-yellow-50 text-yellow-600'
                  : 'border-gray-300 text-gray-400 hover:border-gray-400'
              }`}
            >
              <span className="text-2xl">⭐</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {formData.starRating} {formData.starRating === 1 ? 'Star' : 'Stars'}
        </p>
      </div>

      {/* Check-in/Check-out Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="checkInTime" className="block text-sm font-medium text-gray-700 mb-2">
            {t('checkInTime.label')} <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="checkInTime"
            value={formData.checkInTime}
            onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="checkOutTime" className="block text-sm font-medium text-gray-700 mb-2">
            {t('checkOutTime.label')} <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="checkOutTime"
            value={formData.checkOutTime}
            onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Total Rooms */}
      <div>
        <label htmlFor="totalRooms" className="block text-sm font-medium text-gray-700 mb-2">
          {t('totalRooms.label')} <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="totalRooms"
          min="1"
          max="1000"
          value={formData.totalRooms}
          onChange={(e) => setFormData({ ...formData, totalRooms: parseInt(e.target.value) || 0 })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.totalRooms ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.totalRooms && (
          <p className="mt-1 text-sm text-red-500">{errors.totalRooms}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">{t('totalRooms.hint')}</p>
      </div>

      {/* Commission Percentage */}
      <div>
        <label htmlFor="commissionPercentage" className="block text-sm font-medium text-gray-700 mb-2">
          {t('commission.label')} <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            id="commissionPercentage"
            min="10"
            max="50"
            step="1"
            value={formData.commissionPercentage}
            onChange={(e) => setFormData({ ...formData, commissionPercentage: parseInt(e.target.value) })}
            className="flex-1"
          />
          <div className="flex items-center justify-center w-20 h-12 bg-primary-50 border-2 border-primary-600 rounded-lg">
            <span className="text-lg font-bold text-primary-700">
              {formData.commissionPercentage}%
            </span>
          </div>
        </div>
        {errors.commissionPercentage && (
          <p className="mt-1 text-sm text-red-500">{errors.commissionPercentage}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">{t('commission.hint')}</p>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 {t('commission.info')}
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {t('nextButton')} →
        </button>
      </div>
    </form>
  );
}
