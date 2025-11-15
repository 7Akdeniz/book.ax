import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale });
  
  return {
    title: `${t('help.title')} - Book.ax`,
    description: t('help.subtitle'),
  };
}

interface HelpPageProps {
  params: { locale: string };
}

export default function HelpPage({ params }: HelpPageProps) {
  const t = useTranslations('help');
  const locale = params.locale;
  
  const faqSections = [
    {
      title: t('bookingHelpTitle'),
      questions: [
        {
          question: t('bookingQuestion1'),
          answer: t('bookingAnswer1'),
        },
        {
          question: t('bookingQuestion2'),
          answer: t('bookingAnswer2'),
        },
        {
          question: t('bookingQuestion3'),
          answer: t('bookingAnswer3'),
        },
      ],
    },
    {
      title: t('accountHelpTitle'),
      questions: [
        {
          question: t('accountQuestion1'),
          answer: t('accountAnswer1'),
        },
        {
          question: t('accountQuestion2'),
          answer: t('accountAnswer2'),
        },
        {
          question: t('accountQuestion3'),
          answer: t('accountAnswer3'),
        },
      ],
    },
    {
      title: t('paymentHelpTitle'),
      questions: [
        {
          question: t('paymentQuestion1'),
          answer: t('paymentAnswer1'),
        },
        {
          question: t('paymentQuestion2'),
          answer: t('paymentAnswer2'),
        },
        {
          question: t('paymentQuestion3'),
          answer: t('paymentAnswer3'),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 rounded-full p-4">
              <svg className="h-16 w-16 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('faq')}
          </h2>
          
          <div className="space-y-8">
            {faqSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {section.questions.map((item, index) => (
                    <div key={index} className="px-6 py-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        {item.question}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">
              {t('contactTitle')}
            </h2>
            <p className="text-purple-100 text-lg">
              {t('contactDescription')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 p-8">
            {/* Email */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 rounded-full p-4">
                  <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('email')}
              </h3>
              <a 
                href={`mailto:${t('supportEmail')}`}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                {t('supportEmail')}
              </a>
            </div>

            {/* Phone */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 rounded-full p-4">
                  <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('phone')}
              </h3>
              <a 
                href={`tel:${t('supportPhone').replace(/\s/g, '')}`}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                {t('supportPhone')}
              </a>
            </div>

            {/* Business Hours */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 rounded-full p-4">
                  <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('businessHours').split(':')[0]}
              </h3>
              <p className="text-gray-600">
                {t('businessHours').split(':').slice(1).join(':')}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Quick Links
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* For Guests */}
            <Link
              href={`/${locale}/search`}
              className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <svg className="h-12 w-12 text-primary-600 mb-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Search Hotels</h3>
              <p className="text-sm text-gray-600 text-center">Find your perfect stay</p>
            </Link>

            <Link
              href={`/${locale}/my-bookings`}
              className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <svg className="h-12 w-12 text-primary-600 mb-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">My Bookings</h3>
              <p className="text-sm text-gray-600 text-center">View your reservations</p>
            </Link>

            <Link
              href={`/${locale}/panel`}
              className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <svg className="h-12 w-12 text-primary-600 mb-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Hotelier Portal</h3>
              <p className="text-sm text-gray-600 text-center">Manage your properties</p>
            </Link>

            <Link
              href={`/${locale}/pricing`}
              className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <svg className="h-12 w-12 text-primary-600 mb-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Pricing</h3>
              <p className="text-sm text-gray-600 text-center">View our commission rates</p>
            </Link>
          </div>
        </div>

        {/* Legal & Policy Links */}
        <div className="bg-gray-100 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Legal & Policies
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/terms`}
              className="px-6 py-3 bg-white rounded-lg hover:shadow-md transition-shadow text-gray-900 font-medium"
            >
              Terms & Conditions
            </Link>
            <Link
              href={`/${locale}/privacy`}
              className="px-6 py-3 bg-white rounded-lg hover:shadow-md transition-shadow text-gray-900 font-medium"
            >
              Privacy Policy
            </Link>
            <Link
              href={`/${locale}/cookies`}
              className="px-6 py-3 bg-white rounded-lg hover:shadow-md transition-shadow text-gray-900 font-medium"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
