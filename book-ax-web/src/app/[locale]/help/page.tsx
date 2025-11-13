import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale });
  
  return {
    title: `${t('help.title')} - Book.ax`,
    description: t('help.subtitle'),
  };
}

export default function HelpPage() {
  const t = useTranslations('help');
  
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
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
      </div>
    </div>
  );
}
