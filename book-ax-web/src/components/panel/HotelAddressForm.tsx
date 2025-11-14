'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface HotelAddressFormProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const COUNTRIES = [
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  // Add more countries as needed
];

export function HotelAddressForm({ data, onNext, onBack }: HotelAddressFormProps) {
  const t = useTranslations('panel.hotels.new.address');

  const [formData, setFormData] = useState({
    addressLine1: data.addressLine1 || '',
    addressLine2: data.addressLine2 || '',
    addressCity: data.addressCity || '',
    addressState: data.addressState || '',
    addressPostalCode: data.addressPostalCode || '',
    addressCountry: data.addressCountry || 'DE',
    contactPhone: data.contactPhone || '',
    contactEmail: data.contactEmail || '',
    website: data.website || '',
    latitude: data.latitude || undefined,
    longitude: data.longitude || undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.addressLine1 || formData.addressLine1.trim().length < 5) {
      newErrors.addressLine1 = t('errors.addressRequired');
    }

    if (!formData.addressCity || formData.addressCity.trim().length < 2) {
      newErrors.addressCity = t('errors.cityRequired');
    }

    if (!formData.addressPostalCode) {
      newErrors.addressPostalCode = t('errors.postalCodeRequired');
    }

    if (!formData.contactPhone || formData.contactPhone.length < 8) {
      newErrors.contactPhone = t('errors.phoneInvalid');
    }

    if (!formData.contactEmail || !formData.contactEmail.includes('@')) {
      newErrors.contactEmail = t('errors.emailInvalid');
    }

    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = t('errors.websiteInvalid');
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

      {/* Address Line 1 */}
      <div>
        <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-2">
          {t('addressLine1.label')} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="addressLine1"
          value={formData.addressLine1}
          onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={t('addressLine1.placeholder')}
        />
        {errors.addressLine1 && (
          <p className="mt-1 text-sm text-red-500">{errors.addressLine1}</p>
        )}
      </div>

      {/* Address Line 2 */}
      <div>
        <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-2">
          {t('addressLine2.label')}
        </label>
        <input
          type="text"
          id="addressLine2"
          value={formData.addressLine2}
          onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder={t('addressLine2.placeholder')}
        />
      </div>

      {/* City, State, Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="addressCity" className="block text-sm font-medium text-gray-700 mb-2">
            {t('city.label')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="addressCity"
            value={formData.addressCity}
            onChange={(e) => setFormData({ ...formData, addressCity: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.addressCity ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('city.placeholder')}
          />
          {errors.addressCity && (
            <p className="mt-1 text-sm text-red-500">{errors.addressCity}</p>
          )}
        </div>

        <div>
          <label htmlFor="addressState" className="block text-sm font-medium text-gray-700 mb-2">
            {t('state.label')}
          </label>
          <input
            type="text"
            id="addressState"
            value={formData.addressState}
            onChange={(e) => setFormData({ ...formData, addressState: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('state.placeholder')}
          />
        </div>

        <div>
          <label htmlFor="addressPostalCode" className="block text-sm font-medium text-gray-700 mb-2">
            {t('postalCode.label')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="addressPostalCode"
            value={formData.addressPostalCode}
            onChange={(e) => setFormData({ ...formData, addressPostalCode: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.addressPostalCode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('postalCode.placeholder')}
          />
          {errors.addressPostalCode && (
            <p className="mt-1 text-sm text-red-500">{errors.addressPostalCode}</p>
          )}
        </div>
      </div>

      {/* Country */}
      <div>
        <label htmlFor="addressCountry" className="block text-sm font-medium text-gray-700 mb-2">
          {t('country.label')} <span className="text-red-500">*</span>
        </label>
        <select
          id="addressCountry"
          value={formData.addressCountry}
          onChange={(e) => setFormData({ ...formData, addressCountry: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Contact Information */}
      <div className="pt-4 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('contactInfo.title')}
        </h3>

        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
            {t('phone.label')} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="contactPhone"
            value={formData.contactPhone}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.contactPhone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('phone.placeholder')}
          />
          {errors.contactPhone && (
            <p className="mt-1 text-sm text-red-500">{errors.contactPhone}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
            {t('email.label')} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="contactEmail"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.contactEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('email.placeholder')}
          />
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-500">{errors.contactEmail}</p>
          )}
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            {t('website.label')}
          </label>
          <input
            type="url"
            id="website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.website ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('website.placeholder')}
          />
          {errors.website && (
            <p className="mt-1 text-sm text-red-500">{errors.website}</p>
          )}
        </div>
      </div>

      {/* Coordinates (Optional) */}
      <div className="pt-4 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t('coordinates.title')}
        </h3>
        <p className="text-sm text-gray-600 mb-4">{t('coordinates.subtitle')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
              {t('latitude.label')}
            </label>
            <input
              type="number"
              step="0.000001"
              id="latitude"
              value={formData.latitude || ''}
              onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="52.520008"
            />
          </div>

          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
              {t('longitude.label')}
            </label>
            <input
              type="number"
              step="0.000001"
              id="longitude"
              value={formData.longitude || ''}
              onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="13.404954"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← {t('backButton')}
        </button>
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
