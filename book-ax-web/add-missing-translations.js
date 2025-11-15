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
  },
  'panel.dashboard.subtitle': {
    de: 'Willkommen in Ihrem Hotelier-Dashboard',
    en: 'Welcome to your hotelier dashboard',
    es: 'Bienvenido a tu panel de hotelero',
    fr: 'Bienvenue sur votre tableau de bord hôtelier',
    tr: 'Otelci kontrol panelinize hoş geldiniz',
    da: 'Velkommen til dit hotelejer-dashboard',
    it: 'Benvenuto nella tua dashboard alberghiera',
    no: 'Velkommen til ditt hotelleierdashboard',
    pl: 'Witamy w panelu hotelarza',
    sv: 'Välkommen till din hotelliers instrumentpanel'
  },
  'panel.dashboard.actions.viewBookings': {
    de: 'Alle Buchungen ansehen',
    en: 'View All Bookings',
    es: 'Ver Todas las Reservas',
    fr: 'Voir Toutes les Réservations',
    tr: 'Tüm Rezervasyonları Görüntüle',
    da: 'Se Alle Bookinger',
    it: 'Visualizza Tutte le Prenotazioni',
    no: 'Se Alle Bestillinger',
    pl: 'Zobacz Wszystkie Rezerwacje',
    sv: 'Visa Alla Bokningar'
  },
  'panel.dashboard.stats.todayCheckIns': {
    de: 'Check-ins Heute',
    en: "Today's Check-Ins",
    es: 'Check-ins de Hoy',
    fr: "Arrivées d'Aujourd'hui",
    tr: 'Bugünkü Giriş',
    da: 'Dagens Indtjekninger',
    it: 'Check-in di Oggi',
    no: 'Dagens Innsjekking',
    pl: 'Dzisiejsze Zameldowania',
    sv: 'Dagens Incheckning'
  },
  'panel.dashboard.stats.todayCheckOuts': {
    de: 'Check-outs Heute',
    en: "Today's Check-Outs",
    es: 'Check-outs de Hoy',
    fr: "Départs d'Aujourd'hui",
    tr: 'Bugünkü Çıkış',
    da: 'Dagens Udtjekninger',
    it: 'Check-out di Oggi',
    no: 'Dagens Utsjekking',
    pl: 'Dzisiejsze Wymeldowania',
    sv: 'Dagens Utcheckning'
  },
  'panel.dashboard.stats.currentGuests': {
    de: 'Aktuelle Gäste',
    en: 'Current Guests',
    es: 'Huéspedes Actuales',
    fr: 'Clients Actuels',
    tr: 'Mevcut Misafirler',
    da: 'Nuværende Gæster',
    it: 'Ospiti Attuali',
    no: 'Nåværende Gjester',
    pl: 'Obecni Goście',
    sv: 'Nuvarande Gäster'
  },
  'panel.dashboard.stats.upcomingBookings': {
    de: 'Bevorstehende Buchungen',
    en: 'Upcoming Bookings',
    es: 'Próximas Reservas',
    fr: 'Réservations à Venir',
    tr: 'Yaklaşan Rezervasyonlar',
    da: 'Kommende Bookinger',
    it: 'Prenotazioni in Arrivo',
    no: 'Kommende Bestillinger',
    pl: 'Nadchodzące Rezerwacje',
    sv: 'Kommande Bokningar'
  },
  'panel.dashboard.stats.monthlyRevenue': {
    de: 'Monatlicher Umsatz',
    en: 'Monthly Revenue',
    es: 'Ingresos Mensuales',
    fr: 'Revenus Mensuels',
    tr: 'Aylık Gelir',
    da: 'Månedlig Omsætning',
    it: 'Entrate Mensili',
    no: 'Månedlige Inntekter',
    pl: 'Przychody Miesięczne',
    sv: 'Månadsinkomst'
  },
  'panel.dashboard.stats.totalRevenue': {
    de: 'Gesamtumsatz',
    en: 'Total Revenue',
    es: 'Ingresos Totales',
    fr: 'Revenus Totaux',
    tr: 'Toplam Gelir',
    da: 'Samlet Omsætning',
    it: 'Entrate Totali',
    no: 'Totale Inntekter',
    pl: 'Łączne Przychody',
    sv: 'Total Inkomst'
  },
  'panel.dashboard.stats.occupancyRate': {
    de: 'Auslastung',
    en: 'Occupancy Rate',
    es: 'Tasa de Ocupación',
    fr: "Taux d'Occupation",
    tr: 'Doluluk Oranı',
    da: 'Belægningsgrad',
    it: 'Tasso di Occupazione',
    no: 'Beleggsprosent',
    pl: 'Wskaźnik Obłożenia',
    sv: 'Beläggningsgrad'
  },
  'panel.dashboard.stats.roomAvailability': {
    de: 'Zimmerverfügbarkeit',
    en: 'Room Availability',
    es: 'Disponibilidad de Habitaciones',
    fr: 'Disponibilité des Chambres',
    tr: 'Oda Müsaitliği',
    da: 'Værelsestilgængelighed',
    it: 'Disponibilità Camere',
    no: 'Romtilgjengelighet',
    pl: 'Dostępność Pokoi',
    sv: 'Rumstillgänglighet'
  },
  'panel.dashboard.stats.availableToday': {
    de: 'Heute verfügbar',
    en: 'Available Today',
    es: 'Disponible Hoy',
    fr: "Disponible Aujourd'hui",
    tr: 'Bugün Müsait',
    da: 'Tilgængelig i dag',
    it: 'Disponibile Oggi',
    no: 'Tilgjengelig i dag',
    pl: 'Dostępne Dzisiaj',
    sv: 'Tillgängligt idag'
  },
  'panel.dashboard.recentBookings.title': {
    de: 'Letzte Buchungen',
    en: 'Recent Bookings',
    es: 'Reservas Recientes',
    fr: 'Réservations Récentes',
    tr: 'Son Rezervasyonlar',
    da: 'Seneste Bookinger',
    it: 'Prenotazioni Recenti',
    no: 'Nylige Bestillinger',
    pl: 'Ostatnie Rezerwacje',
    sv: 'Senaste Bokningar'
  },
  'panel.dashboard.recentBookings.reference': {
    de: 'Referenz',
    en: 'Reference',
    es: 'Referencia',
    fr: 'Référence',
    tr: 'Referans',
    da: 'Reference',
    it: 'Riferimento',
    no: 'Referanse',
    pl: 'Numer',
    sv: 'Referens'
  },
  'panel.dashboard.recentBookings.guest': {
    de: 'Gast',
    en: 'Guest',
    es: 'Huésped',
    fr: 'Client',
    tr: 'Misafir',
    da: 'Gæst',
    it: 'Ospite',
    no: 'Gjest',
    pl: 'Gość',
    sv: 'Gäst'
  },
  'panel.dashboard.recentBookings.room': {
    de: 'Zimmer',
    en: 'Room',
    es: 'Habitación',
    fr: 'Chambre',
    tr: 'Oda',
    da: 'Værelse',
    it: 'Camera',
    no: 'Rom',
    pl: 'Pokój',
    sv: 'Rum'
  },
  'panel.dashboard.recentBookings.checkIn': {
    de: 'Check-in',
    en: 'Check-In',
    es: 'Check-in',
    fr: 'Arrivée',
    tr: 'Giriş',
    da: 'Indtjekning',
    it: 'Check-in',
    no: 'Innsjekking',
    pl: 'Zameldowanie',
    sv: 'Incheckning'
  },
  'panel.dashboard.recentBookings.status': {
    de: 'Status',
    en: 'Status',
    es: 'Estado',
    fr: 'Statut',
    tr: 'Durum',
    da: 'Status',
    it: 'Stato',
    no: 'Status',
    pl: 'Status',
    sv: 'Status'
  },
  'panel.dashboard.recentBookings.amount': {
    de: 'Betrag',
    en: 'Amount',
    es: 'Monto',
    fr: 'Montant',
    tr: 'Tutar',
    da: 'Beløb',
    it: 'Importo',
    no: 'Beløp',
    pl: 'Kwota',
    sv: 'Belopp'
  },
  'panel.dashboard.recentBookings.noBookings': {
    de: 'Keine aktuellen Buchungen',
    en: 'No recent bookings',
    es: 'No hay reservas recientes',
    fr: 'Aucune réservation récente',
    tr: 'Son rezervasyon yok',
    da: 'Ingen seneste bookinger',
    it: 'Nessuna prenotazione recente',
    no: 'Ingen nylige bestillinger',
    pl: 'Brak ostatnich rezerwacji',
    sv: 'Inga senaste bokningar'
  },
  'panel.dashboard.quickActions.manageBookings': {
    de: 'Buchungen verwalten',
    en: 'Manage Bookings',
    es: 'Gestionar Reservas',
    fr: 'Gérer les Réservations',
    tr: 'Rezervasyonları Yönet',
    da: 'Administrer Bookinger',
    it: 'Gestisci Prenotazioni',
    no: 'Administrer Bestillinger',
    pl: 'Zarządzaj Rezerwacjami',
    sv: 'Hantera Bokningar'
  },
  'panel.dashboard.quickActions.manageBookingsDesc': {
    de: 'Alle Buchungen ansehen und verwalten',
    en: 'View and manage all bookings',
    es: 'Ver y gestionar todas las reservas',
    fr: 'Voir et gérer toutes les réservations',
    tr: 'Tüm rezervasyonları görüntüle ve yönet',
    da: 'Se og administrer alle bookinger',
    it: 'Visualizza e gestisci tutte le prenotazioni',
    no: 'Se og administrer alle bestillinger',
    pl: 'Zobacz i zarządzaj wszystkimi rezerwacjami',
    sv: 'Visa och hantera alla bokningar'
  },
  'panel.dashboard.quickActions.calendar': {
    de: 'Kalenderansicht',
    en: 'Calendar View',
    es: 'Vista de Calendario',
    fr: 'Vue Calendrier',
    tr: 'Takvim Görünümü',
    da: 'Kalendervisning',
    it: 'Vista Calendario',
    no: 'Kalendervisning',
    pl: 'Widok Kalendarza',
    sv: 'Kalendervy'
  },
  'panel.dashboard.quickActions.calendarDesc': {
    de: 'Verfügbarkeit und Preise prüfen',
    en: 'Check availability and rates',
    es: 'Consultar disponibilidad y tarifas',
    fr: 'Vérifier la disponibilité et les tarifs',
    tr: 'Müsaitlik ve fiyatları kontrol et',
    da: 'Tjek tilgængelighed og priser',
    it: 'Verifica disponibilità e tariffe',
    no: 'Sjekk tilgjengelighet og priser',
    pl: 'Sprawdź dostępność i ceny',
    sv: 'Kontrollera tillgänglighet och priser'
  },
  'panel.dashboard.quickActions.rooms': {
    de: 'Zimmerverwaltung',
    en: 'Room Management',
    es: 'Gestión de Habitaciones',
    fr: 'Gestion des Chambres',
    tr: 'Oda Yönetimi',
    da: 'Værelsesadministration',
    it: 'Gestione Camere',
    no: 'Romadministrasjon',
    pl: 'Zarządzanie Pokojami',
    sv: 'Rumshantering'
  },
  'panel.dashboard.quickActions.roomsDesc': {
    de: 'Zimmer und Inventar verwalten',
    en: 'Manage rooms and inventory',
    es: 'Gestionar habitaciones e inventario',
    fr: "Gérer les chambres et l'inventaire",
    tr: 'Odaları ve envanteri yönet',
    da: 'Administrer værelser og inventar',
    it: 'Gestisci camere e inventario',
    no: 'Administrer rom og inventar',
    pl: 'Zarządzaj pokojami i zapasami',
    sv: 'Hantera rum och inventarier'
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

      // Dashboard-Übersetzungen
      const dashboardKeys = [
        'subtitle',
        'actions.viewBookings',
        'stats.todayCheckIns',
        'stats.todayCheckOuts',
        'stats.currentGuests',
        'stats.upcomingBookings',
        'stats.monthlyRevenue',
        'stats.totalRevenue',
        'stats.occupancyRate',
        'stats.roomAvailability',
        'stats.availableToday',
        'recentBookings.title',
        'recentBookings.reference',
        'recentBookings.guest',
        'recentBookings.room',
        'recentBookings.checkIn',
        'recentBookings.status',
        'recentBookings.amount',
        'recentBookings.noBookings',
        'quickActions.manageBookings',
        'quickActions.manageBookingsDesc',
        'quickActions.calendar',
        'quickActions.calendarDesc',
        'quickActions.rooms',
        'quickActions.roomsDesc'
      ];

      dashboardKeys.forEach(key => {
        const parts = key.split('.');
        const translationKey = `panel.dashboard.${key}`;
        
        if (!data.panel) data.panel = {};
        if (!data.panel.dashboard) data.panel.dashboard = {};
        
        let current = data.panel.dashboard;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        
        const lastPart = parts[parts.length - 1];
        if (!current[lastPart]) {
          current[lastPart] = missingTranslations[translationKey][locale];
          modified = true;
        }
      });

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
