import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale });
  
  return {
    title: `${t('footer.termsConditions')} - Book.ax`,
    description: 'Allgemeine Geschäftsbedingungen von Book.ax - Ihre Hotel-Buchungsplattform',
  };
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>
          <p className="text-lg text-gray-600">
            Letzte Aktualisierung: 13. November 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-10 space-y-10">
          {/* Section 1 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              1. Geltungsbereich
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der 
                Buchungsplattform Book.ax und regeln das Vertragsverhältnis zwischen:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Book.ax (nachfolgend "wir" oder "Plattform")</li>
                <li>Hoteliers und Unterkunftsanbietern (nachfolgend "Partner")</li>
                <li>Gästen und Buchenden (nachfolgend "Nutzer" oder "Sie")</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              2. Leistungsbeschreibung
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                Book.ax ist eine Online-Buchungsplattform für Hotels und Unterkünfte. 
                Wir bieten:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Vermittlung von Hotelzimmern und Unterkünften</li>
                <li>Sichere Online-Buchung und Zahlungsabwicklung</li>
                <li>Verwaltungstools für Hoteliers (Hotelier Dashboard)</li>
                <li>Mehrsprachige Plattform (50+ Sprachen)</li>
                <li>Kundenservice und Support</li>
              </ul>
              <p className="mt-4">
                Book.ax tritt als Vermittler zwischen Hotels und Gästen auf. Der 
                eigentliche Beherbergungsvertrag wird zwischen Gast und Hotel geschlossen.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              3. Buchungsprozess
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <h3 className="text-xl font-semibold text-gray-900 mt-5">3.1 Für Gäste</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li>Die Auswahl eines Hotels stellt ein verbindliches Angebot dar</li>
                <li>Die Buchungsbestätigung erfolgt per E-Mail</li>
                <li>Es gelten die angegebenen Preise zum Zeitpunkt der Buchung</li>
                <li>Stornierungsbedingungen variieren je nach Hotel</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-5">3.2 Für Hoteliers</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li>Partner verpflichten sich, Zimmerverfügbarkeiten aktuell zu halten</li>
                <li>Buchungsbestätigungen müssen innerhalb von 24h erfolgen</li>
                <li>Falsche Angaben können zur Sperrung führen</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              4. Preise und Zahlung
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                Alle Preise sind in Euro (€) angegeben und verstehen sich inklusive 
                gesetzlicher Mehrwertsteuer, sofern nicht anders angegeben.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mt-5">4.1 Zahlungsmethoden</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li>Kreditkarte (Visa, Mastercard, American Express)</li>
                <li>PayPal</li>
                <li>SEPA-Lastschrift</li>
                <li>Vor-Ort-Zahlung (je nach Hotel)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-5">4.2 Provision</h3>
              <p>
                Book.ax erhebt eine Provision von 10-50% (je nach Vereinbarung) auf 
                erfolgreiche Buchungen. Die Provision wird automatisch vom Buchungsbetrag 
                einbehalten.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              5. Stornierung und Rückerstattung
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                Die Stornierungsbedingungen werden vom jeweiligen Hotel festgelegt und 
                sind vor der Buchung einsehbar.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mt-5">Typische Regelungen:</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li>Kostenlose Stornierung: Bis zu X Tage vor Anreise</li>
                <li>Teilweise Rückerstattung: Bei Stornierung innerhalb der Frist</li>
                <li>Keine Rückerstattung: Bei No-Show oder Stornierung am Anreisetag</li>
              </ul>
              <p className="mt-4">
                Rückerstattungen erfolgen auf das ursprüngliche Zahlungsmittel innerhalb 
                von 5-10 Werktagen.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              6. Nutzerverhalten und Pflichten
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <h3 className="text-xl font-semibold text-gray-900 mt-5">6.1 Verbotene Aktivitäten</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li>Missbrauch der Plattform für illegale Zwecke</li>
                <li>Falsche oder irreführende Informationen</li>
                <li>Manipulation von Bewertungen</li>
                <li>Verstoß gegen geltende Gesetze</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-5">6.2 Konsequenzen</h3>
              <p>
                Bei Verstößen gegen diese AGB behalten wir uns vor:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Buchungen zu stornieren</li>
                <li>Nutzerkonten zu sperren</li>
                <li>Schadensersatz geltend zu machen</li>
                <li>Rechtliche Schritte einzuleiten</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              7. Haftung
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                Book.ax haftet ausschließlich für die Vermittlung zwischen Hotel und Gast. 
                Für die tatsächliche Leistungserbringung (Unterkunft, Service, etc.) ist 
                das jeweilige Hotel verantwortlich.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mt-5">Haftungsausschluss:</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li>Keine Haftung für fehlerhafte Hotelangaben</li>
                <li>Keine Haftung für Schäden während des Aufenthalts</li>
                <li>Keine Haftung für technische Störungen (Force Majeure)</li>
              </ul>
              <p className="mt-4">
                Die Haftung für vorsätzliche oder grob fahrlässige Pflichtverletzungen 
                bleibt unberührt.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              8. Datenschutz
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                Der Schutz Ihrer persönlichen Daten ist uns wichtig. Ausführliche 
                Informationen finden Sie in unserer{' '}
                <a href="/de/privacy" className="text-primary-600 hover:text-primary-700 font-medium underline">
                  Datenschutzerklärung
                </a>.
              </p>
              <p>
                Wir verarbeiten Ihre Daten ausschließlich im Rahmen der DSGVO und 
                geltender Datenschutzgesetze.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              9. Änderungen der AGB
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                Wir behalten uns vor, diese AGB jederzeit zu ändern. Änderungen werden 
                30 Tage vor Inkrafttreten auf der Website veröffentlicht.
              </p>
              <p>
                Bei wesentlichen Änderungen werden registrierte Nutzer per E-Mail 
                informiert.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              10. Streitbeilegung und anwendbares Recht
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <h3 className="text-xl font-semibold text-gray-900 mt-5">10.1 Anwendbares Recht</h3>
              <p>
                Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des 
                UN-Kaufrechts.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-5">10.2 Gerichtsstand</h3>
              <p>
                Gerichtsstand für alle Streitigkeiten ist, soweit gesetzlich zulässig, 
                der Sitz von Book.ax.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-5">10.3 Online-Streitbeilegung</h3>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung 
                (OS) bereit:{' '}
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
              11. Salvatorische Klausel
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, 
                bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              12. Kontakt
            </h2>
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                Bei Fragen zu diesen AGB oder unseren Dienstleistungen erreichen Sie uns:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p className="font-semibold text-lg">Book.ax</p>
                <p>3171 Burnham Ave</p>
                <p>Las Vegas, NV 89169, USA</p>
                <p className="mt-3">E-Mail: i@book.ax</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-base text-gray-500">
          <p>
            Mit der Nutzung von Book.ax stimmen Sie diesen Allgemeinen 
            Geschäftsbedingungen zu.
          </p>
        </div>
      </div>
    </div>
  );
}
