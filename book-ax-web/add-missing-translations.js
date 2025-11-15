#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Aktuell vorhandene 10 Sprachen
const locales = [
  'de', 'en', 'es', 'fr', 'tr', 'da', 'it', 'no', 'pl', 'sv'
];

// Fehlende Übersetzungen mit professionellen Übersetzungen
const missingTranslations = {
  'panel.navigation.hotels': {
    de: 'Hotels',
    en: 'Hotels',
    es: 'Hoteles',
    fr: 'Hôtels',
    tr: 'Oteller',
    da: 'Hoteller',
    it: 'Hotel',
    no: 'Hoteller',
    pl: 'Hotele',
    sv: 'Hotell'
  },
  'panel.navigation.backToSite': {
    de: 'Zurück zur Website',
    en: 'Back to Site',
    es: 'Volver al sitio',
    fr: 'Retour au site',
    tr: 'Siteye Dön',
    da: 'Tilbage til hjemmeside',
    it: 'Torna al sito',
    no: 'Tilbake til siden',
    pl: 'Powrót do strony',
    sv: 'Tillbaka till webbplatsen'
  },
  'auth.noAccount': {
    de: 'Noch kein Konto?',
    en: "Don't have an account?",
    es: '¿No tienes cuenta?',
    fr: "Vous n'avez pas de compte?",
    tr: 'Hesabınız yok mu?',
    da: 'Har du ikke en konto?',
    it: 'Non hai un account?',
    no: 'Har du ikke en konto?',
    pl: 'Nie masz konta?',
    sv: 'Har du inget konto?'
  },
  'auth.loginFailed': {
    de: 'Anmeldung fehlgeschlagen',
    en: 'Login failed',
    es: 'Error de inicio de sesión',
    fr: 'Échec de la connexion',
    tr: 'Giriş başarısız',
    da: 'Login mislykkedes',
    it: 'Accesso non riuscito',
    no: 'Pålogging mislyktes',
    pl: 'Logowanie nie powiodło się',
    sv: 'Inloggningen misslyckades'
  },
  'header.logout': {
    de: 'Abmelden',
    en: 'Logout',
    es: 'Cerrar sesión',
    fr: 'Se déconnecter',
    tr: 'Çıkış Yap',
    da: 'Log ud',
    it: 'Esci',
    no: 'Logg ut',
    pl: 'Wyloguj',
    sv: 'Logga ut'
  },
  'search.noHotelsFound': {
    de: 'Keine Hotels gefunden',
    en: 'No hotels found',
    es: 'No se encontraron hoteles',
    fr: 'Aucun hôtel trouvé',
    tr: 'Otel bulunamadı',
    da: 'Ingen hoteller fundet',
    it: 'Nessun hotel trovato',
    no: 'Ingen hoteller funnet',
    pl: 'Nie znaleziono hoteli',
    sv: 'Inga hotell hittades'
  },
  'search.tryDifferentCriteria': {
    de: 'Versuchen Sie andere Suchkriterien',
    en: 'Try different search criteria',
    es: 'Pruebe con diferentes criterios de búsqueda',
    fr: 'Essayez différents critères de recherche',
    tr: 'Farklı arama kriterleri deneyin',
    da: 'Prøv forskellige søgekriterier',
    it: 'Prova criteri di ricerca diversi',
    no: 'Prøv forskjellige søkekriterier',
    pl: 'Spróbuj innych kryteriów wyszukiwania',
    sv: 'Prova olika sökkriterier'
  },
  'panel.hotels.title': {
    de: 'Meine Hotels',
    en: 'My Hotels',
    es: 'Mis Hoteles',
    fr: 'Mes Hôtels',
    tr: 'Otellerim',
    da: 'Mine Hoteller',
    it: 'I Miei Hotel',
    no: 'Mine Hoteller',
    pl: 'Moje Hotele',
    sv: 'Mina Hotell'
  },
  'panel.hotels.subtitle': {
    de: 'Verwalten Sie Ihre registrierten Unterkünfte',
    en: 'Manage your registered properties',
    es: 'Gestiona tus propiedades registradas',
    fr: 'Gérez vos établissements enregistrés',
    tr: 'Kayıtlı tesislerinizi yönetin',
    da: 'Administrer dine registrerede ejendomme',
    it: 'Gestisci le tue strutture registrate',
    no: 'Administrer dine registrerte eiendommer',
    pl: 'Zarządzaj swoimi zarejestrowanymi nieruchomościami',
    sv: 'Hantera dina registrerade fastigheter'
  },
  'panel.hotels.addNew': {
    de: 'Neues Hotel hinzufügen',
    en: 'Add New Hotel',
    es: 'Agregar Nuevo Hotel',
    fr: 'Ajouter un Nouvel Hôtel',
    tr: 'Yeni Otel Ekle',
    da: 'Tilføj Nyt Hotel',
    it: 'Aggiungi Nuovo Hotel',
    no: 'Legg til Nytt Hotell',
    pl: 'Dodaj Nowy Hotel',
    sv: 'Lägg till Nytt Hotell'
  },
  'panel.hotels.noHotels': {
    de: 'Noch keine Hotels',
    en: 'No Hotels Yet',
    es: 'Aún No Hay Hoteles',
    fr: 'Pas Encore d\'Hôtels',
    tr: 'Henüz Otel Yok',
    da: 'Ingen Hoteller Endnu',
    it: 'Nessun Hotel Ancora',
    no: 'Ingen Hoteller Ennå',
    pl: 'Jeszcze Brak Hoteli',
    sv: 'Inga Hotell Ännu'
  },
  'panel.hotels.noHotelsDescription': {
    de: 'Registrieren Sie Ihr erstes Hotel, um Buchungen zu empfangen',
    en: 'Register your first hotel to start accepting bookings',
    es: 'Registra tu primer hotel para empezar a recibir reservas',
    fr: 'Enregistrez votre premier hôtel pour commencer à recevoir des réservations',
    tr: 'Rezervasyon almaya başlamak için ilk otelinizi kaydedin',
    da: 'Registrer dit første hotel for at begynde at acceptere bookinger',
    it: 'Registra il tuo primo hotel per iniziare ad accettare prenotazioni',
    no: 'Registrer ditt første hotell for å begynne å akseptere bookinger',
    pl: 'Zarejestruj swój pierwszy hotel, aby zacząć przyjmować rezerwacje',
    sv: 'Registrera ditt första hotell för att börja ta emot bokningar'
  },
  'panel.hotels.registerFirst': {
    de: 'Registrieren Sie Ihr erstes Hotel',
    en: 'Register Your First Hotel',
    es: 'Registra Tu Primer Hotel',
    fr: 'Enregistrez Votre Premier Hôtel',
    tr: 'İlk Otelinizi Kaydedin',
    da: 'Registrer Dit Første Hotel',
    it: 'Registra Il Tuo Primo Hotel',
    no: 'Registrer Ditt Første Hotell',
    pl: 'Zarejestruj Swój Pierwszy Hotel',
    sv: 'Registrera Ditt Första Hotell'
  }
};

// Funktion zum Hinzufügen der fehlenden Übersetzungen
function addMissingTranslations() {
  let updatedCount = 0;

  locales.forEach(locale => {
    const filePath = path.join(__dirname, 'messages', `${locale}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Datei nicht gefunden: ${locale}.json`);
      return;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      let modified = false;

      // panel.navigation.hotels hinzufügen
      if (!data.panel?.navigation?.hotels) {
        if (!data.panel) data.panel = {};
        if (!data.panel.navigation) data.panel.navigation = {};
        data.panel.navigation.hotels = missingTranslations['panel.navigation.hotels'][locale];
        modified = true;
      }

      // panel.navigation.backToSite hinzufügen
      if (!data.panel?.navigation?.backToSite) {
        if (!data.panel) data.panel = {};
        if (!data.panel.navigation) data.panel.navigation = {};
        data.panel.navigation.backToSite = missingTranslations['panel.navigation.backToSite'][locale];
        modified = true;
      }

      // auth.noAccount hinzufügen
      if (!data.auth?.noAccount) {
        if (!data.auth) data.auth = {};
        data.auth.noAccount = missingTranslations['auth.noAccount'][locale];
        modified = true;
      }

      // auth.loginFailed hinzufügen
      if (!data.auth?.loginFailed) {
        if (!data.auth) data.auth = {};
        data.auth.loginFailed = missingTranslations['auth.loginFailed'][locale];
        modified = true;
      }

      // header.logout hinzufügen
      if (!data.header?.logout) {
        if (!data.header) data.header = {};
        data.header.logout = missingTranslations['header.logout'][locale];
        modified = true;
      }

      // search.noHotelsFound hinzufügen
      if (!data.search?.noHotelsFound) {
        if (!data.search) data.search = {};
        data.search.noHotelsFound = missingTranslations['search.noHotelsFound'][locale];
        modified = true;
      }

      // search.tryDifferentCriteria hinzufügen
      if (!data.search?.tryDifferentCriteria) {
        if (!data.search) data.search = {};
        data.search.tryDifferentCriteria = missingTranslations['search.tryDifferentCriteria'][locale];
        modified = true;
      }

      // panel.hotels.title hinzufügen
      if (!data.panel?.hotels?.title) {
        if (!data.panel) data.panel = {};
        if (!data.panel.hotels) data.panel.hotels = {};
        data.panel.hotels.title = missingTranslations['panel.hotels.title'][locale];
        modified = true;
      }

      // panel.hotels.subtitle hinzufügen
      if (!data.panel?.hotels?.subtitle) {
        if (!data.panel) data.panel = {};
        if (!data.panel.hotels) data.panel.hotels = {};
        data.panel.hotels.subtitle = missingTranslations['panel.hotels.subtitle'][locale];
        modified = true;
      }

      // panel.hotels.addNew hinzufügen
      if (!data.panel?.hotels?.addNew) {
        if (!data.panel) data.panel = {};
        if (!data.panel.hotels) data.panel.hotels = {};
        data.panel.hotels.addNew = missingTranslations['panel.hotels.addNew'][locale];
        modified = true;
      }

      // panel.hotels.noHotels hinzufügen
      if (!data.panel?.hotels?.noHotels) {
        if (!data.panel) data.panel = {};
        if (!data.panel.hotels) data.panel.hotels = {};
        data.panel.hotels.noHotels = missingTranslations['panel.hotels.noHotels'][locale];
        modified = true;
      }

      // panel.hotels.noHotelsDescription hinzufügen
      if (!data.panel?.hotels?.noHotelsDescription) {
        if (!data.panel) data.panel = {};
        if (!data.panel.hotels) data.panel.hotels = {};
        data.panel.hotels.noHotelsDescription = missingTranslations['panel.hotels.noHotelsDescription'][locale];
        modified = true;
      }

      // panel.hotels.registerFirst hinzufügen
      if (!data.panel?.hotels?.registerFirst) {
        if (!data.panel) data.panel = {};
        if (!data.panel.hotels) data.panel.hotels = {};
        data.panel.hotels.registerFirst = missingTranslations['panel.hotels.registerFirst'][locale];
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
        console.log(`✅ ${locale}.json aktualisiert`);
        updatedCount++;
      } else {
        console.log(`✓  ${locale}.json bereits vollständig`);
      }

    } catch (error) {
      console.error(`❌ Fehler bei ${locale}.json:`, error.message);
    }
  });

  console.log(`\n🎉 Fertig! ${updatedCount} Dateien aktualisiert.`);
}

// Script ausführen
addMissingTranslations();
