'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { HotelBasicInfoForm } from '@/components/panel/HotelBasicInfoForm';
import { HotelAddressForm } from '@/components/panel/HotelAddressForm';
import { HotelTranslationsForm } from '@/components/panel/HotelTranslationsForm';
import { HotelImagesForm } from '@/components/panel/HotelImagesForm';
import { HotelReviewSubmit } from '@/components/panel/HotelReviewSubmit';
import { HotelJourneyStorage } from '@/utils/hotelJourneyStorage';
import { JourneyTimer } from '@/components/panel/JourneyTimer';

type Step = 'basic' | 'address' | 'translations' | 'images' | 'review';

interface HotelFormData {
  // Basic Info
  propertyType: string;
  name: string;
  starRating: number;
  checkInTime: string;
  checkOutTime: string;
  totalRooms: number;
  commissionPercentage: number;

  // Address & Contact
  addressLine1: string;
  addressLine2?: string;
  addressCity: string;
  addressState?: string;
  addressPostalCode: string;
  addressCountry: string;
  contactPhone: string;
  contactEmail: string;
  website?: string;
  latitude?: number;
  longitude?: number;

  // Translations (will be sent separately)
  translations: {
    [locale: string]: {
      name: string;
      description: string;
      checkInInstructions?: string;
      checkOutInstructions?: string;
      houseRules?: string;
    };
  };

  // Images (will be uploaded separately)
  images: Array<{
    url: string;
    fileName: string;
    isPrimary: boolean;
    altText?: string;
  }>;
}

const STEPS: Step[] = ['basic', 'address', 'translations', 'images', 'review'];

export default function NewHotelPage() {
  const t = useTranslations('panel.hotels.new');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [formData, setFormData] = useState<Partial<HotelFormData>>({
    propertyType: 'hotel',
    starRating: 3,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    totalRooms: 10,
    commissionPercentage: 15,
    translations: {},
    images: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved journey on mount
  useEffect(() => {
    const savedJourney = HotelJourneyStorage.load();
    
    if (savedJourney) {
      const timeRemaining = HotelJourneyStorage.getTimeRemaining();
      
      toast.success(
        `Fortschritt wiederhergestellt! Noch ${timeRemaining} Min. gültig`,
        { duration: 4000 }
      );
      
      setFormData(savedJourney.data);
      setCurrentStep(savedJourney.currentStep as Step);
    }
    
    setIsLoaded(true);
  }, []);

  // Save journey whenever data or step changes
  useEffect(() => {
    if (isLoaded && formData) {
      HotelJourneyStorage.save(formData, currentStep);
    }
  }, [formData, currentStep, isLoaded]);

  // Refresh timer on user activity
  useEffect(() => {
    const handleActivity = () => {
      HotelJourneyStorage.refreshTimer();
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, []);

  const currentStepIndex = STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const handleNext = (data: Partial<HotelFormData>) => {
    setFormData({ ...formData, ...data });
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const handleClearJourney = () => {
    if (confirm('Möchten Sie wirklich von vorne beginnen? Alle Daten gehen verloren.')) {
      HotelJourneyStorage.clear();
      setFormData({
        propertyType: 'hotel',
        starRating: 3,
        checkInTime: '14:00',
        checkOutTime: '11:00',
        totalRooms: 10,
        commissionPercentage: 15,
        translations: {},
        images: [],
      });
      setCurrentStep('basic');
      toast.success('Fortschritt gelöscht. Sie können neu beginnen.');
    }
  };

  const handleSubmit = async (finalData: HotelFormData) => {
    try {
      // Submit will be implemented in HotelReviewSubmit component
      
      // Clear journey after successful submission
      HotelJourneyStorage.clear();
      toast.success('Hotel erfolgreich erstellt!');
      
      // After successful submission, redirect to hotel dashboard
      router.push('/panel/hotels');
    } catch (error) {
      toast.error('Fehler beim Erstellen des Hotels');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Journey Timer */}
      <JourneyTimer />
      
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {t('title')}
            </h1>
            {HotelJourneyStorage.hasSaved() && (
              <button
                onClick={handleClearJourney}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                🗑️ Neu beginnen
              </button>
            )}
          </div>
          <p className="text-gray-600">{t('subtitle')}</p>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              {STEPS.map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center ${
                    index < STEPS.length - 1 ? 'flex-1' : ''
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      index <= currentStepIndex
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        index < currentStepIndex
                          ? 'bg-primary-600'
                          : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{t('steps.basic')}</span>
              <span>{t('steps.address')}</span>
              <span>{t('steps.translations')}</span>
              <span>{t('steps.images')}</span>
              <span>{t('steps.review')}</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {currentStep === 'basic' && (
            <HotelBasicInfoForm
              data={formData}
              onNext={handleNext}
            />
          )}

          {currentStep === 'address' && (
            <HotelAddressForm
              data={formData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 'translations' && (
            <HotelTranslationsForm
              data={formData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 'images' && (
            <HotelImagesForm
              data={formData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 'review' && (
            <HotelReviewSubmit
              data={formData as HotelFormData}
              onBack={handleBack}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
