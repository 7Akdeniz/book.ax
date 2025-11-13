import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale });
  
  return {
    title: `${t('footer.privacyPolicy')} - Book.ax`,
    description: 'Datenschutzerklärung von Book.ax - Informationen zur Verarbeitung Ihrer personenbezogenen Daten',
  };
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Datenschutzerklärung
          </h1>
          <p className="text-gray-600">
            Letzte Aktualisierung: 13. November 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="text-gray-700 space-y-3">
              <p>
                Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. 
                Wir verarbeiten Ihre Daten ausschließlich auf Grundlage der gesetzlichen 
                Bestimmungen (DSGVO, TKG 2003).
              </p>
              <p>
                In dieser Datenschutzerklärung informieren wir Sie über die wichtigsten 
                Aspekte der Datenverarbeitung im Rahmen unserer Website und Services.
              </p>
            </div>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Verantwortlicher
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Verantwortlich für die Datenverarbeitung auf dieser Website ist:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">Book.ax</p>
                <p>3171 Burnham Ave</p>
                <p>Las Vegas, NV 89169, USA</p>
                <p className="mt-2">E-Mail: i@book.ax</p>
              </div>
              <p className="mt-3">
                Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Welche Daten werden erfasst?
            </h2>
            <div className="text-gray-700 space-y-3">
              <h3 className="font-semibold text-gray-900 mt-4">2.1 Automatisch erfasste Daten</h3>
              <p>
                Bei jedem Zugriff auf unsere Website werden folgende Daten automatisch 
                erfasst und in Server-Logfiles gespeichert:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP-Adresse des zugreifenden Rechners</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                <li>Verwendeter Browser und ggf. das Betriebssystem</li>
                <li>Name Ihres Internet-Providers</li>
              </ul>
              <p className="mt-3">
                <strong>Rechtsgrundlage:</strong> Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO) 
                zur Sicherstellung der Systemsicherheit und zur technischen Administration.
              </p>
              <p>
                <strong>Speicherdauer:</strong> Diese Daten werden nach 7 Tagen gelöscht.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">2.2 Bei Registrierung</h3>
              <p>
                Wenn Sie ein Konto bei Book.ax erstellen, erfassen wir:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>E-Mail-Adresse (Pflichtfeld)</li>
                <li>Name und Vorname (optional)</li>
                <li>Telefonnummer (optional)</li>
                <li>Passwort (verschlüsselt gespeichert)</li>
              </ul>
              <p className="mt-3">
                <strong>Rechtsgrundlage:</strong> Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO)
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">2.3 Bei Buchungen</h3>
              <p>
                Für die Durchführung einer Buchung benötigen wir:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name und Vorname</li>
                <li>E-Mail-Adresse</li>
                <li>Telefonnummer</li>
                <li>Zahlungsinformationen (werden über sichere Zahlungsdienstleister verarbeitet)</li>
                <li>Buchungsdetails (Hotel, Datum, Anzahl Gäste)</li>
              </ul>
              <p className="mt-3">
                <strong>Rechtsgrundlage:</strong> Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO)
              </p>
              <p>
                <strong>Speicherdauer:</strong> Bis zur vollständigen Abwicklung der Buchung plus 
                gesetzliche Aufbewahrungsfristen (bis zu 10 Jahre).
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">2.4 Für Hoteliers</h3>
              <p>
                Hotelpartner stellen uns zusätzlich folgende Informationen zur Verfügung:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Firmendaten (Name, Adresse, Steuernummer)</li>
                <li>Bankverbindung für Auszahlungen</li>
                <li>Hotelbeschreibungen und Fotos</li>
                <li>Preis- und Verfügbarkeitsdaten</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Cookies
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, 
                die auf Ihrem Endgerät gespeichert werden.
              </p>
              
              <h3 className="font-semibold text-gray-900 mt-4">3.1 Notwendige Cookies</h3>
              <p>
                Diese Cookies sind für die Funktion der Website unbedingt erforderlich:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Session-Cookies (Login-Status)</li>
                <li>Sprachauswahl-Cookie</li>
                <li>Cookie-Consent-Cookie</li>
              </ul>
              <p className="mt-3">
                <strong>Rechtsgrundlage:</strong> Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO)
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">3.2 Analyse-Cookies</h3>
              <p>
                Mit Ihrer Einwilligung verwenden wir:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Analytics (anonymisiert)</li>
                <li>Vercel Analytics</li>
              </ul>
              <p className="mt-3">
                <strong>Rechtsgrundlage:</strong> Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)
              </p>
              <p>
                Sie können Ihre Einwilligung jederzeit in den{' '}
                <a href="/de/cookies" className="text-primary-600 hover:underline">
                  Cookie-Einstellungen
                </a>{' '}
                widerrufen.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Weitergabe von Daten
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Eine Übermittlung Ihrer persönlichen Daten an Dritte erfolgt nur:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Wenn Sie ausdrücklich eingewilligt haben (Art. 6 Abs. 1 lit. a DSGVO)</li>
                <li>Zur Vertragserfüllung (z.B. Weiterleitung Ihrer Buchungsdaten an das Hotel)</li>
                <li>Wenn eine gesetzliche Verpflichtung besteht (Art. 6 Abs. 1 lit. c DSGVO)</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">4.1 Zahlungsdienstleister</h3>
              <p>
                Für die Zahlungsabwicklung nutzen wir:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Stripe (Stripe Inc., USA - EU-US Privacy Shield zertifiziert)</li>
                <li>PayPal (PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxemburg)</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">4.2 Hosting & Infrastructure</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vercel Inc. (Hosting der Website)</li>
                <li>Supabase Inc. (Database & Backend Services)</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">4.3 Hotelpartner</h3>
              <p>
                Ihre Buchungsdaten werden an das gebuchte Hotel weitergeleitet, um 
                die Reservierung durchzuführen.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Ihre Rechte
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, 
                Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und Widerspruch zu.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">5.1 Auskunftsrecht</h3>
              <p>
                Sie haben das Recht, Auskunft über Ihre von uns verarbeiteten Daten zu erhalten.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">5.2 Recht auf Berichtigung</h3>
              <p>
                Unrichtige Daten können Sie jederzeit in Ihrem Benutzerkonto korrigieren 
                oder uns zur Korrektur mitteilen.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">5.3 Recht auf Löschung</h3>
              <p>
                Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzlichen 
                Aufbewahrungspflichten entgegenstehen.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">5.4 Widerrufsrecht</h3>
              <p>
                Eine erteilte Einwilligung zur Datenverarbeitung können Sie jederzeit 
                widerrufen. Dies gilt auch für Einwilligungen, die vor der DSGVO erteilt wurden.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">5.5 Beschwerderecht</h3>
              <p>
                Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <p className="font-semibold">Bundesbeauftragte für den Datenschutz und die Informationsfreiheit</p>
                <p>Graurheindorfer Str. 153</p>
                <p>53117 Bonn</p>
                <p className="mt-2">Tel.: +49 (0)228-997799-0</p>
                <p>E-Mail: poststelle@bfdi.bund.de</p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Datensicherheit
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren 
                (Secure Socket Layer) in Verbindung mit der jeweils höchsten Verschlüsselungsstufe.
              </p>
              <p>
                Darüber hinaus sichern wir unsere Website und sonstigen Systeme durch 
                technische und organisatorische Maßnahmen gegen Verlust, Zerstörung, 
                Zugriff, Veränderung oder Verbreitung Ihrer Daten durch unbefugte Personen.
              </p>
              <h3 className="font-semibold text-gray-900 mt-4">Sicherheitsmaßnahmen:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>HTTPS-Verschlüsselung für alle Verbindungen</li>
                <li>Verschlüsselte Passwort-Speicherung (Hashing mit bcrypt)</li>
                <li>Regelmäßige Sicherheits-Audits</li>
                <li>Zugriffsbeschränkungen für Mitarbeiter</li>
                <li>Regelmäßige Backups</li>
                <li>Firewall und DDoS-Schutz</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Datenübermittlung in Drittländer
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Einige unserer Dienstleister befinden sich außerhalb der EU/EEA 
                (z.B. USA). In diesen Fällen stellen wir sicher, dass:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>EU-Standardvertragsklauseln abgeschlossen wurden</li>
                <li>Das Unternehmen Privacy Shield zertifiziert ist</li>
                <li>Ein Angemessenheitsbeschluss der EU-Kommission vorliegt</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Minderjährigenschutz
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Personen unter 16 Jahren sollten ohne Zustimmung der Erziehungsberechtigten 
                keine personenbezogenen Daten an uns übermitteln.
              </p>
              <p>
                Wir fordern keine personenbezogenen Daten von Kindern an, sammeln diese 
                nicht und geben sie nicht an Dritte weiter.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Automatisierte Entscheidungsfindung
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Wir verwenden keine automatisierte Entscheidungsfindung oder Profiling 
                gemäß Art. 22 DSGVO.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Änderungen der Datenschutzerklärung
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie 
                stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen 
                unserer Leistungen umzusetzen.
              </p>
              <p>
                Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Kontakt
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen 
                Daten, bei Auskünften, Berichtigung, Sperrung oder Löschung von Daten sowie 
                Widerruf erteilter Einwilligungen wenden Sie sich bitte an:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">Datenschutzbeauftragter Book.ax</p>
                <p>3171 Burnham Ave</p>
                <p>Las Vegas, NV 89169, USA</p>
                <p className="mt-2">E-Mail: i@book.ax</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">
            Ihre Daten sind bei uns sicher
          </h3>
          <p className="text-sm text-gray-700">
            Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst und behandeln 
            Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen 
            Datenschutzvorschriften sowie dieser Datenschutzerklärung.
          </p>
        </div>
      </div>
    </div>
  );
}
