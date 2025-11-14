'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface RoomCategoryModalProps {
  hotelId: string;
  room: any | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

const BED_TYPES = [
  { value: 'single', label: 'Single Bed', icon: '🛏️' },
  { value: 'double', label: 'Double Bed', icon: '🛏️🛏️' },
  { value: 'queen', label: 'Queen Bed', icon: '👑' },
  { value: 'king', label: 'King Bed', icon: '👑👑' },
  { value: 'twin', label: 'Twin Beds', icon: '🛏️+🛏️' },
  { value: 'sofa', label: 'Sofa Bed', icon: '🛋️' },
];

const AMENITIES = [
  { code: 'wifi', icon: '📶', label: 'WiFi' },
  { code: 'tv', icon: '📺', label: 'TV' },
  { code: 'ac', icon: '❄️', label: 'Air Conditioning' },
  { code: 'minibar', icon: '🍷', label: 'Minibar' },
  { code: 'safe', icon: '🔐', label: 'Safe' },
  { code: 'balcony', icon: '🌅', label: 'Balcony' },
  { code: 'bathtub', icon: '🛁', label: 'Bathtub' },
  { code: 'shower', icon: '🚿', label: 'Shower' },
  { code: 'hairdryer', icon: '💨', label: 'Hairdryer' },
  { code: 'iron', icon: '🧺', label: 'Iron' },
  { code: 'coffee', icon: '☕', label: 'Coffee Maker' },
  { code: 'desk', icon: '🖥️', label: 'Desk' },
];

export function RoomCategoryModal({ hotelId, room, onClose, onSave }: RoomCategoryModalProps) {
  const t = useTranslations('panel.hotels.rooms.modal');

  const [formData, setFormData] = useState({
    name: room?.name || '',
    basePrice: room?.basePrice || 100,
    maxOccupancy: room?.maxOccupancy || 2,
    totalRooms: room?.totalRooms || 1,
    size: room?.size || 25,
    bedType: room?.bedType || 'double',
    amenities: room?.amenities?.map((a: any) => a.code) || [],
    translations: {
      en: {
        name: room?.translations?.find((t: any) => t.language === 'en')?.name || '',
        description: room?.translations?.find((t: any) => t.language === 'en')?.description || '',
      },
    },
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave({
        name: formData.name,
        basePrice: formData.basePrice,
        maxOccupancy: formData.maxOccupancy,
        totalRooms: formData.totalRooms,
        size: formData.size,
        bedType: formData.bedType,
        amenityCodes: formData.amenities,
        translations: [
          {
            language: 'en',
            name: formData.translations.en.name,
            description: formData.translations.en.description,
          },
        ],
      });
    } catch (error) {
      console.error('Error saving room:', error);
      setSaving(false);
    }
  };

  const toggleAmenity = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(code)
        ? prev.amenities.filter((a: string) => a !== code)
        : [...prev.amenities, code],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {room ? t('editTitle') : t('addTitle')}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Standard Double Room"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('basePrice')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">€</span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('maxOccupancy')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={formData.maxOccupancy}
                  onChange={(e) => setFormData({ ...formData, maxOccupancy: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('totalRooms')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.totalRooms}
                  onChange={(e) => setFormData({ ...formData, totalRooms: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('size')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: parseInt(e.target.value) || undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">m²</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('bedType')}
                </label>
                <select
                  value={formData.bedType}
                  onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {BED_TYPES.map((bed) => (
                    <option key={bed.value} value={bed.value}>
                      {bed.icon} {bed.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Translations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('englishName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.translations.en.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    translations: {
                      ...formData.translations,
                      en: { ...formData.translations.en, name: e.target.value },
                    },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Translated room name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('englishDescription')}
              </label>
              <textarea
                rows={3}
                value={formData.translations.en.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    translations: {
                      ...formData.translations,
                      en: { ...formData.translations.en, description: e.target.value },
                    },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Room description, features, view, etc."
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('amenities')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {AMENITIES.map((amenity) => (
                  <button
                    key={amenity.code}
                    type="button"
                    onClick={() => toggleAmenity(amenity.code)}
                    className={`flex items-center gap-2 p-3 border-2 rounded-lg transition-all ${
                      formData.amenities.includes(amenity.code)
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-xl">{amenity.icon}</span>
                    <span className="text-sm font-medium">{amenity.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {saving ? t('saving') : t('save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
