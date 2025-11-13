import { useTranslations } from 'next-intl';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'terms' });
  
  return {
    title: `${t('title')} - Book.ax`,
    description: t('metaDescription'),
  };
}

export default async function TermsPage({ params }: { params: { locale: string } }) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'terms' });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('lastUpdated')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-10 space-y-10">
          {/* Section 1 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('section1.title')}
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                {t('section1.intro')}
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>{t('section1.party1')}</li>
                <li>{t('section1.party2')}</li>
                <li>{t('section1.party3')}</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('section2.title')}
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                {t('section2.intro')}
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>{t('section2.service1')}</li>
                <li>{t('section2.service2')}</li>
                <li>{t('section2.service3')}</li>
                <li>{t('section2.service4')}</li>
                <li>{t('section2.service5')}</li>
              </ul>
              <p className="mt-4">
                {t('section2.note')}
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('section3.title')}
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <h3 className="text-xl font-semibold text-gray-900 mt-5">{t('section3.guests.title')}</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li>{t('section3.guests.rule1')}</li>
                <li>{t('section3.guests.rule2')}</li>
                <li>{t('section3.guests.rule3')}</li>
                <li>{t('section3.guests.rule4')}</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-5">{t('section3.hoteliers.title')}</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li>{t('section3.hoteliers.rule1')}</li>
                <li>{t('section3.hoteliers.rule2')}</li>
                <li>{t('section3.hoteliers.rule3')}</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('section4.title')}
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                {t('section4.intro')}
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mt-5">{t('section4.payment.title')}</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li>{t('section4.payment.method1')}</li>
                <li>{t('section4.payment.method2')}</li>
                <li>{t('section4.payment.method3')}</li>
                <li>{t('section4.payment.method4')}</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-5">{t('section4.commission.title')}</h3>
              <p>
                {t('section4.commission.text')}
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('section5.title')}
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                {t('section5.intro')}
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mt-5">{t('section5.rulesTitle')}</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li>{t('section5.rule1')}</li>
                <li>{t('section5.rule2')}</li>
                <li>{t('section5.rule3')}</li>
              </ul>
              <p className="mt-4">
                {t('section5.refund')}
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('section6.title')}
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <h3 className="text-xl font-semibold text-gray-900 mt-5">{t('section6.prohibited.title')}</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li>{t('section6.prohibited.activity1')}</li>
                <li>{t('section6.prohibited.activity2')}</li>
                <li>{t('section6.prohibited.activity3')}</li>
                <li>{t('section6.prohibited.activity4')}</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-5">{t('section6.consequences.title')}</h3>
              <p>
                {t('section6.consequences.intro')}
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>{t('section6.consequences.consequence1')}</li>
                <li>{t('section6.consequences.consequence2')}</li>
                <li>{t('section6.consequences.consequence3')}</li>
                <li>{t('section6.consequences.consequence4')}</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('section7.title')}
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                {t('section7.intro')}
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mt-5">{t('section7.disclaimerTitle')}</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li>{t('section7.disclaimer1')}</li>
                <li>{t('section7.disclaimer2')}</li>
                <li>{t('section7.disclaimer3')}</li>
              </ul>
              <p className="mt-4">
                {t('section7.note')}
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('section8.title')}
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                {t('section8.intro')}{' '}
                <Link href={`/${params.locale}/privacy`} className="text-primary-600 hover:text-primary-700 font-medium underline">
                  {t('section8.privacyLink')}
                </Link>.
              </p>
              <p>
                {t('section8.note')}
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('section9.title')}
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                {t('section9.text1')}
              </p>
              <p>
                {t('section9.text2')}
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('section10.title')}
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <h3 className="text-xl font-semibold text-gray-900 mt-5">{t('section10.law.title')}</h3>
              <p>
                {t('section10.law.text')}
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-5">{t('section10.jurisdiction.title')}</h3>
              <p>
                {t('section10.jurisdiction.text')}
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-5">{t('section10.odr.title')}</h3>
              <p>
                {t('section10.odr.intro')}{' '}
                <a 
                  href="https://ec.europa.eu/consumers/odr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('section11.title')}
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                {t('section11.text')}
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('section12.title')}
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                {t('section12.intro')}
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p className="font-semibold text-lg">{t('section12.company')}</p>
                <p>{t('section12.address1')}</p>
                <p>{t('section12.address2')}</p>
                <p className="mt-3">{t('section12.email')}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-base text-gray-500">
          <p>
            {t('footer')}
          </p>
        </div>
      </div>
    </div>
  );
}
