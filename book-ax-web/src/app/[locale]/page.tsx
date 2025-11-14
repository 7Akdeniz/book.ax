import { useTranslations } from 'next-intl';
import { SearchBar } from '@/components/common/SearchBar';
import { FeaturedHotels } from '@/components/hotel/FeaturedHotels';
import { PopularDestinations } from '@/components/home/PopularDestinations';
import { OrganizationStructuredData, SearchActionStructuredData } from '@/components/seo/StructuredData';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <>
      {/* SEO: Structured Data */}
      <OrganizationStructuredData />
      <SearchActionStructuredData />
      
      <div className="w-full bg-white">
      {/* Hero Section - Full Width, Larger Text */}
      <section className="w-full bg-white py-16 px-6">
        <div className="w-full max-w-none">
          
          {/* Title and Subtitle - Larger */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600">
              {t('subtitle')}
            </p>
          </div>

          {/* Search Bar - Full Width */}
          <div className="w-full px-4">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-white w-full px-6">
        <div className="w-full">
          <h2 className="text-5xl font-bold mb-12 text-center text-gray-900">
            {t('popularDestinations')}
          </h2>
          <PopularDestinations />
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-20 bg-white w-full px-6">
        <div className="w-full">
          <h2 className="text-5xl font-bold mb-12 text-center text-gray-900">
            {t('featuredHotels')}
          </h2>
          <FeaturedHotels />
        </div>
      </section>

      {/* Why Book With Us */}
      <section className="py-20 bg-white w-full px-6">
        <div className="w-full">
          <h2 className="text-5xl font-bold mb-16 text-center text-gray-900">
            {t('whyBookWithUs')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-semibold mb-4">{t('bestPriceGuarantee')}</h3>
              <p className="text-gray-600 text-xl">{t('bestPriceGuaranteeDesc')}</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-3xl font-semibold mb-4">{t('noCreditCardFees')}</h3>
              <p className="text-gray-600 text-xl">{t('noCreditCardFeesDesc')}</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-semibold mb-4">{t('freeChangesCancellation')}</h3>
              <p className="text-gray-600 text-xl">{t('freeChangesCancellationDesc')}</p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
