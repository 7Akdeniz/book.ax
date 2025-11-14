'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface HotelTranslationsFormProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const TOP_LANGUAGES = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export function HotelTranslationsForm({ data, onNext, onBack }: HotelTranslationsFormProps) {
  const t = useTranslations('panel.hotels.new.translations');

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translations, setTranslations] = useState(data.translations || {
    en: { name: '', description: '', checkInInstructions: '', checkOutInstructions: '', houseRules: '' },
  });

  const currentTranslation = translations[selectedLanguage] || {
    name: '',
    description: '',
    checkInInstructions: '',
    checkOutInstructions: '',
    houseRules: '',
  };

  const updateTranslation = (field: string, value: string) => {
    setTranslations({
      ...translations,
      [selectedLanguage]: {
        ...currentTranslation,
        [field]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // At least English translation must be filled
    if (!translations.en?.name || !translations.en?.description) {
      alert(t('errors.englishRequired'));
      return;
    }

    onNext({ translations });
  };

  const completedLanguages = Object.keys(translations).filter(
    (lang) => translations[lang]?.name && translations[lang]?.description
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Language Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('selectLanguage')}
        </label>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {TOP_LANGUAGES.map((lang) => {
            const isCompleted = translations[lang.code]?.name && translations[lang.code]?.description;
            const isSelected = selectedLanguage === lang.code;

            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLanguage(lang.code)}
                className={`relative flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50'
                    : isCompleted
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <span className="text-2xl mb-1">{lang.flag}</span>
                <span className="text-xs font-medium">{lang.name}</span>
                {isCompleted && (
                  <span className="absolute top-1 right-1 text-green-500">✓</span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {completedLanguages.length} / {TOP_LANGUAGES.length} {t('languagesCompleted')}
        </p>
      </div>

      {/* Translation Form */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">
            {TOP_LANGUAGES.find((l) => l.code === selectedLanguage)?.flag}
          </span>
          <h3 className="text-lg font-semibold">
            {TOP_LANGUAGES.find((l) => l.code === selectedLanguage)?.name}
          </h3>
          {selectedLanguage === 'en' && (
            <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
              {t('required')}
            </span>
          )}
        </div>

        {/* Hotel Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('name.label')} {selectedLanguage === 'en' && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            value={currentTranslation.name}
            onChange={(e) => updateTranslation('name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('name.placeholder')}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('description.label')} {selectedLanguage === 'en' && <span className="text-red-500">*</span>}
          </label>
          <textarea
            rows={4}
            value={currentTranslation.description}
            onChange={(e) => updateTranslation('description', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('description.placeholder')}
          />
        </div>

        {/* Check-in Instructions */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('checkIn.label')}
          </label>
          <textarea
            rows={3}
            value={currentTranslation.checkInInstructions}
            onChange={(e) => updateTranslation('checkInInstructions', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('checkIn.placeholder')}
          />
        </div>

        {/* Check-out Instructions */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('checkOut.label')}
          </label>
          <textarea
            rows={3}
            value={currentTranslation.checkOutInstructions}
            onChange={(e) => updateTranslation('checkOutInstructions', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('checkOut.placeholder')}
          />
        </div>

        {/* House Rules */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('houseRules.label')}
          </label>
          <textarea
            rows={3}
            value={currentTranslation.houseRules}
            onChange={(e) => updateTranslation('houseRules', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('houseRules.placeholder')}
          />
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 {t('info')}
        </p>
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
