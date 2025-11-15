'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'guest' as 'guest' | 'hotelier',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on role
        if (data.user.role === 'hotelier') {
          router.push('/panel');
        } else {
          router.push('/');
        }
      } else {
        setError(data.error || t('auth.registrationFailed'));
      }
    } catch (err) {
      setError(t('auth.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('auth.signUp')}</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t('auth.firstName')}
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t('auth.lastName')}
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t('auth.password')}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">{t('auth.passwordRequirements')}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                {t('auth.accountType')}
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'guest' | 'hotelier' })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="guest">{t('auth.guest')}</option>
                <option value="hotelier">{t('auth.hotelier')}</option>
              </select>
              {formData.role === 'hotelier' && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>{t('auth.hotelierTip')}</strong>
                  </p>
                  <Link 
                    href={`/${locale}/pricing`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold underline mt-1 inline-block"
                  >
                    {t('auth.viewPricing')} →
                  </Link>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {t('auth.haveAccount')}{' '}
            <a href="/login" className="text-primary hover:underline font-semibold">
              {t('auth.login')}
            </a>
          </div>
        </div>
      </div>
  );
}
