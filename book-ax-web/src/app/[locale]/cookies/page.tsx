'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
  cookies: {
    name: string;
    purpose: string;
    duration: string;
    type: string;
  }[];
}

export default function CookiesPage() {
  const t = useTranslations();
  
  const [cookieSettings, setCookieSettings] = useState<CookieCategory[]>([
    {
      id: 'necessary',
      name: 'Notwendige Cookies',
      description: 'Diese Cookies sind für die grundlegende Funktionalität der Website erforderlich und können nicht deaktiviert werden.',
      required: true,
      enabled: true,
      cookies: [
        {
          name: 'session_token',
          purpose: 'Speichert Ihre Login-Sitzung',
          duration: '7 Tage',
          type: 'First-Party'
        },
        {
          name: 'locale',
          purpose: 'Speichert Ihre Sprachauswahl',
          duration: '1 Jahr',
          type: 'First-Party'
        },
        {
          name: 'cookie_consent',
          purpose: 'Speichert Ihre Cookie-Einstellungen',
          duration: '1 Jahr',
          type: 'First-Party'
        }
      ]
    },
    {
      id: 'functional',
      name: 'Funktionale Cookies',
      description: 'Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.',
      required: false,
      enabled: false,
      cookies: [
        {
          name: 'search_history',
          purpose: 'Speichert Ihre letzten Suchvorgänge',
          duration: '30 Tage',
          type: 'First-Party'
        },
        {
          name: 'preferred_currency',
          purpose: 'Speichert Ihre bevorzugte Währung',
          duration: '1 Jahr',
          type: 'First-Party'
        }
      ]
    },
    {
      id: 'analytics',
      name: 'Analyse-Cookies',
      description: 'Diese Cookies helfen uns, die Website-Nutzung zu verstehen und zu verbessern.',
      required: false,
      enabled: false,
      cookies: [
        {
          name: '_ga',
          purpose: 'Google Analytics - Unterscheidet Nutzer',
          duration: '2 Jahre',
          type: 'Third-Party (Google)'
        },
        {
          name: '_gid',
          purpose: 'Google Analytics - Unterscheidet Nutzer',
          duration: '24 Stunden',
          type: 'Third-Party (Google)'
        },
        {
          name: 'vercel_analytics',
          purpose: 'Vercel Analytics - Performance-Tracking',
          duration: '1 Jahr',
          type: 'Third-Party (Vercel)'
        }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing-Cookies',
      description: 'Diese Cookies werden verwendet, um Werbung relevanter für Sie zu gestalten.',
      required: false,
      enabled: false,
      cookies: [
        {
          name: 'fb_pixel',
          purpose: 'Facebook Pixel - Conversion-Tracking',
          duration: '90 Tage',
          type: 'Third-Party (Facebook)'
        },
        {
          name: 'google_ads',
          purpose: 'Google Ads - Remarketing',
          duration: '90 Tage',
          type: 'Third-Party (Google)'
        }
      ]
    }
  ]);

  const toggleCategory = (categoryId: string) => {
    setCookieSettings(prev =>
      prev.map(cat =>
        cat.id === categoryId && !cat.required
          ? { ...cat, enabled: !cat.enabled }
          : cat
      )
    );
  };

  const acceptAll = () => {
    setCookieSettings(prev =>
      prev.map(cat => ({ ...cat, enabled: true }))
    );
    saveSettings();
  };

  const acceptNecessary = () => {
    setCookieSettings(prev =>
      prev.map(cat => ({ ...cat, enabled: cat.required }))
    );
    saveSettings();
  };

  const saveSettings = () => {
    // Save to localStorage
    const settings = cookieSettings.reduce((acc, cat) => {
      acc[cat.id] = cat.enabled;
      return acc;
    }, {} as Record<string, boolean>);
    
    localStorage.setItem('cookie_preferences', JSON.stringify(settings));
    
    // Show confirmation
    alert('Ihre Cookie-Einstellungen wurden gespeichert!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cookie-Richtlinie
          </h1>
          <p className="text-gray-600">
            Letzte Aktualisierung: 13. November 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="text-gray-700 space-y-4">
            <p>
              Diese Website verwendet Cookies. Cookies sind kleine Textdateien, die auf 
              Ihrem Gerät gespeichert werden, wenn Sie unsere Website besuchen. Sie helfen 
              uns, die Website für Sie nutzerfreundlicher zu gestalten.
            </p>
            <p>
              Einige Cookies sind notwendig, damit die Website ordnungsgemäß funktioniert. 
              Andere sind optional und helfen uns, die Website zu verbessern oder Ihnen 
              personalisierte Inhalte anzuzeigen.
            </p>
            <p>
              Sie können Ihre Cookie-Einstellungen jederzeit ändern. Beachten Sie, dass 
              das Deaktivieren bestimmter Cookies die Funktionalität der Website 
              beeinträchtigen kann.
            </p>
          </div>
        </div>

        {/* Cookie Categories */}
        <div className="space-y-4 mb-8">
          {cookieSettings.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Category Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {category.name}
                  </h2>
                  <div className="flex items-center">
                    {category.required ? (
                      <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                        Immer aktiv
                      </span>
                    ) : (
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          category.enabled ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            category.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>

              {/* Cookie Details */}
              <div className="p-6">
                <div className="space-y-4">
                  {category.cookies.map((cookie, index) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-900">{cookie.name}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {cookie.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{cookie.purpose}</p>
                      <p className="text-xs text-gray-500">
                        Speicherdauer: {cookie.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={acceptAll}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
            >
              Alle Cookies akzeptieren
            </button>
            <button
              onClick={acceptNecessary}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium transition-colors"
            >
              Nur notwendige Cookies
            </button>
            <button
              onClick={saveSettings}
              className="flex-1 px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-medium transition-colors"
            >
              Einstellungen speichern
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Was sind Cookies?
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Cookies sind kleine Textdateien, die von Ihrem Webbrowser auf Ihrem Gerät 
                gespeichert werden. Sie enthalten Informationen über Ihre Website-Nutzung 
                und helfen uns, Ihnen ein besseres Nutzererlebnis zu bieten.
              </p>
              <p>
                Es gibt verschiedene Arten von Cookies:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Session-Cookies:</strong> Werden gelöscht, wenn Sie Ihren Browser schließen
                </li>
                <li>
                  <strong>Persistente Cookies:</strong> Bleiben für einen bestimmten Zeitraum gespeichert
                </li>
                <li>
                  <strong>First-Party-Cookies:</strong> Werden direkt von unserer Website gesetzt
                </li>
                <li>
                  <strong>Third-Party-Cookies:</strong> Werden von Drittanbietern gesetzt (z.B. Google Analytics)
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Warum verwenden wir Cookies?
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>Wir verwenden Cookies aus verschiedenen Gründen:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Notwendigkeit:</strong> Einige Cookies sind unbedingt erforderlich, 
                  damit die Website funktioniert (z.B. Login-Status)
                </li>
                <li>
                  <strong>Funktionalität:</strong> Cookies speichern Ihre Präferenzen 
                  (z.B. Sprache, Währung)
                </li>
                <li>
                  <strong>Analyse:</strong> Wir verstehen, wie Besucher unsere Website nutzen 
                  und können sie verbessern
                </li>
                <li>
                  <strong>Marketing:</strong> Wir zeigen Ihnen relevante Werbung basierend 
                  auf Ihren Interessen
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cookies verwalten
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Sie können Cookies auf verschiedene Arten verwalten:
              </p>
              <h3 className="font-semibold text-gray-900 mt-4">1. Über unsere Website</h3>
              <p>
                Verwenden Sie die Einstellungen auf dieser Seite, um Ihre Cookie-Präferenzen 
                zu ändern.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">2. Über Ihren Browser</h3>
              <p>
                Die meisten Browser ermöglichen es Ihnen, Cookies zu blockieren oder zu löschen:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Chrome:</strong> Einstellungen → Datenschutz und Sicherheit → Cookies
                </li>
                <li>
                  <strong>Firefox:</strong> Einstellungen → Datenschutz & Sicherheit → Cookies
                </li>
                <li>
                  <strong>Safari:</strong> Einstellungen → Datenschutz → Cookies
                </li>
                <li>
                  <strong>Edge:</strong> Einstellungen → Cookies und Websiteberechtigungen
                </li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">3. Browser-Plugins</h3>
              <p>
                Sie können auch Browser-Erweiterungen wie &quot;Cookie AutoDelete&quot; oder 
                &quot;Privacy Badger&quot; verwenden, um Cookies automatisch zu verwalten.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Drittanbieter-Cookies
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Wir nutzen auch Dienste von Drittanbietern, die Cookies setzen:
              </p>
              
              <div className="space-y-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Google Analytics</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Analysiert die Website-Nutzung. Datenschutz:{' '}
                    <a 
                      href="https://policies.google.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      Google Privacy Policy
                    </a>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Opt-Out:{' '}
                    <a 
                      href="https://tools.google.com/dlpage/gaoptout" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      Google Analytics Opt-Out
                    </a>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Vercel Analytics</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Performance-Monitoring und Analytics. Datenschutz:{' '}
                    <a 
                      href="https://vercel.com/legal/privacy-policy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      Vercel Privacy Policy
                    </a>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Stripe</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Zahlungsabwicklung (nur auf Zahlungsseiten). Datenschutz:{' '}
                    <a 
                      href="https://stripe.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      Stripe Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Weitere Informationen
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Weitere Informationen zum Datenschutz finden Sie in unserer{' '}
                <a href="/de/privacy" className="text-primary-600 hover:underline">
                  Datenschutzerklärung
                </a>.
              </p>
              <p>
                Bei Fragen zu Cookies kontaktieren Sie uns bitte:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <p className="font-semibold">Book.ax</p>
                <p>3171 Burnham Ave</p>
                <p>Las Vegas, NV 89169, USA</p>
                <p className="mt-2">E-Mail: i@book.ax</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
