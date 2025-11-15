import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

const CheckIcon = () => (
  <svg className="h-6 w-6 text-success mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'pricing' });
  
  return {
    title: `${t('hero.title')} - Book.ax`,
    description: t('hero.subtitle'),
  };
}

export default function PricingPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('pricing');
  
  const hotelierServices = [
    { icon: '🏨', title: t('hotelierPortal.title'), features: t.raw('hotelierPortal.features') as string[] },
    { icon: '🔗', title: t('channelManager.title'), features: t.raw('channelManager.features') as string[] },
    { icon: '📈', title: t('revenueManagement.title'), features: t.raw('revenueManagement.features') as string[] },
    { icon: '🌍', title: t('guestFrontend.title'), features: t.raw('guestFrontend.features') as string[] },
    { icon: '🛡️', title: t('security.title'), features: t.raw('security.features') as string[] },
    { icon: '🧩', title: t('admin.title'), features: t.raw('admin.features') as string[] },
  ];

  const pricingTable = [
    { service: t('table.registration'), price: '0 €' },
    { service: t('table.setup'), price: '0 €' },
    { service: t('table.pms'), price: '0 €' },
    { service: t('table.channelManager'), price: '0 €' },
    { service: t('table.bookingEngine'), price: '0 €' },
    { service: t('table.revenueManagement'), price: '0 €' },
    { service: t('table.translations'), price: '0 €' },
    { service: t('table.support'), price: '0 €' },
    { service: t('table.commission'), price: t('table.commissionPrice'), highlighted: true },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-6xl mb-6">💰</div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-2xl md:text-3xl font-light mb-4 text-purple-100">
            {t('hero.subtitle')}
          </p>
          <p className="text-xl md:text-2xl text-purple-200">
            {t('hero.description')}
          </p>
        </div>
      </div>

      {/* Commission Highlight */}
      <div className="max-w-7xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-primary-500 p-12 text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('commission.title')}
          </h2>
          <p className="text-2xl md:text-3xl text-gray-700 mb-6">
            {t('commission.subtitle')}
          </p>
          <div className="inline-block bg-gradient-to-r from-primary-500 to-primary-700 text-white px-12 py-6 rounded-2xl text-3xl md:text-4xl font-extrabold shadow-lg">
            {t('commission.rate')}
          </div>
          <p className="text-xl text-gray-600 mt-6">
            {t('commission.description')}
          </p>
        </div>
      </div>

      {/* Free Services Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🆓</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('freeServices.title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('freeServices.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotelierServices.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-200 hover:border-primary-400"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {service.title}
              </h3>
              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckIcon />
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {t('freeServices.badge')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Table */}
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">📊</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('table.title')}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <th className="px-8 py-6 text-left text-2xl font-bold">{t('table.serviceColumn')}</th>
                <th className="px-8 py-6 text-right text-2xl font-bold">{t('table.priceColumn')}</th>
              </tr>
            </thead>
            <tbody>
              {pricingTable.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 ${
                    row.highlighted
                      ? 'bg-gradient-to-r from-primary-50 to-primary-100 font-bold'
                      : index % 2 === 0
                      ? 'bg-white'
                      : 'bg-gray-50'
                  } hover:bg-primary-50 transition-colors`}
                >
                  <td className={`px-8 py-6 ${row.highlighted ? 'text-2xl font-bold text-primary-700' : 'text-xl text-gray-700'}`}>
                    {row.service}
                  </td>
                  <td className={`px-8 py-6 text-right ${row.highlighted ? 'text-2xl font-bold text-primary-700' : 'text-xl text-gray-900'}`}>
                    {row.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl shadow-2xl p-16 text-center text-white">
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            {t('finalCta.title')}
          </h2>
          <p className="text-2xl md:text-3xl mb-4 font-light text-purple-100">
            {t('finalCta.line1')}
          </p>
          <p className="text-2xl md:text-3xl mb-8 font-light text-purple-100">
            {t('finalCta.line2')}
          </p>
          <div className="text-3xl md:text-4xl font-bold mb-10 bg-white text-primary-700 inline-block px-12 py-6 rounded-2xl shadow-lg">
            {t('finalCta.highlight')}
          </div>
          <div className="mt-10">
            <Link 
              href={`/${params.locale}/register`}
              className="inline-block bg-white text-primary-700 px-12 py-5 rounded-xl text-2xl font-bold hover:bg-purple-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              {t('finalCta.button')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
