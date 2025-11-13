'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const t = useTranslations('auth');
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Fehler beim Senden der E-Mail');
      }
    } catch (err) {
      setError('Fehler beim Senden der E-Mail');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center">
            <div className="mb-4 text-green-500 text-5xl">✓</div>
            <h1 className="text-2xl font-bold mb-4">E-Mail gesendet!</h1>
            <p className="text-gray-600 mb-6">
              Wir haben Dir eine E-Mail mit einem Link zum Zurücksetzen Deines Passworts gesendet. 
              Bitte überprüfe Dein Postfach.
            </p>
            <Link 
              href="/login"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Zurück zum Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">
          {t('resetPassword')}
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Gib Deine E-Mail-Adresse ein und wir senden Dir einen Link zum Zurücksetzen Deines Passworts.
        </p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="deine@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 mb-4"
          >
            {loading ? 'Wird gesendet...' : 'Link senden'}
          </button>

          <div className="text-center">
            <Link 
              href="/login" 
              className="text-primary hover:underline text-sm"
            >
              Zurück zum Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
