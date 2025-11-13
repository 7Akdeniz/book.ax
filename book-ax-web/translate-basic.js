#!/usr/bin/env node

/**
 * Basic Translation Script
 * Übersetzt die wichtigsten UI-Texte für die Top 9 Sprachen
 * Für professionelle Übersetzungen sollte Google Translate API oder DeepL verwendet werden
 */

const fs = require('fs');
const path = require('path');

// Basis-Übersetzungen für Top 9 Sprachen
const translations = {
  de: {
    "common": {
      "search": "Suchen",
      "login": "Anmelden",
      "register": "Registrieren",
      "logout": "Abmelden",
      "profile": "Profil",
      "bookings": "Meine Buchungen",
      "loading": "Wird geladen...",
      "cancel": "Abbrechen",
      "save": "Speichern"
    },
    "home": {
      "title": "Finde deine perfekte Unterkunft",
      "subtitle": "Über 500.000 Hotels weltweit",
      "searchPlaceholder": "Wohin möchtest du reisen?",
      "searchButton": "Hotels suchen"
    }
  },
  es: {
    "common": {
      "search": "Buscar",
      "login": "Iniciar sesión",
      "register": "Registrarse",
      "logout": "Cerrar sesión",
      "profile": "Perfil",
      "bookings": "Mis Reservas",
      "loading": "Cargando...",
      "cancel": "Cancelar",
      "save": "Guardar"
    },
    "home": {
      "title": "Encuentra tu estancia perfecta",
      "subtitle": "Más de 500,000 hoteles en todo el mundo",
      "searchPlaceholder": "¿A dónde vas?",
      "searchButton": "Buscar hoteles"
    }
  },
  fr: {
    "common": {
      "search": "Rechercher",
      "login": "Se connecter",
      "register": "S'inscrire",
      "logout": "Se déconnecter",
      "profile": "Profil",
      "bookings": "Mes Réservations",
      "loading": "Chargement...",
      "cancel": "Annuler",
      "save": "Enregistrer"
    },
    "home": {
      "title": "Trouvez votre séjour parfait",
      "subtitle": "Plus de 500 000 hôtels dans le monde",
      "searchPlaceholder": "Où allez-vous?",
      "searchButton": "Rechercher des hôtels"
    }
  },
  tr: {
    "common": {
      "search": "Ara",
      "login": "Giriş Yap",
      "register": "Kayıt Ol",
      "logout": "Çıkış Yap",
      "profile": "Profil",
      "bookings": "Rezervasyonlarım",
      "loading": "Yükleniyor...",
      "cancel": "İptal",
      "save": "Kaydet"
    },
    "home": {
      "title": "Mükemmel Konaklamanızı Bulun",
      "subtitle": "Dünya çapında 500.000'den fazla otel",
      "searchPlaceholder": "Nereye gidiyorsunuz?",
      "searchButton": "Otel ara"
    }
  },
  ru: {
    "common": {
      "search": "Поиск",
      "login": "Войти",
      "register": "Регистрация",
      "logout": "Выйти",
      "profile": "Профиль",
      "bookings": "Мои Бронирования",
      "loading": "Загрузка...",
      "cancel": "Отмена",
      "save": "Сохранить"
    },
    "home": {
      "title": "Найдите свой идеальный отель",
      "subtitle": "Более 500 000 отелей по всему миру",
      "searchPlaceholder": "Куда вы едете?",
      "searchButton": "Искать отели"
    }
  },
  zh: {
    "common": {
      "search": "搜索",
      "login": "登录",
      "register": "注册",
      "logout": "退出",
      "profile": "个人资料",
      "bookings": "我的预订",
      "loading": "加载中...",
      "cancel": "取消",
      "save": "保存"
    },
    "home": {
      "title": "找到您的完美住宿",
      "subtitle": "全球超过500,000家酒店",
      "searchPlaceholder": "您要去哪里？",
      "searchButton": "搜索酒店"
    }
  },
  hi: {
    "common": {
      "search": "खोजें",
      "login": "लॉग इन करें",
      "register": "पंजीकरण करें",
      "logout": "लॉग आउट",
      "profile": "प्रोफ़ाइल",
      "bookings": "मेरी बुकिंग",
      "loading": "लोड हो रहा है...",
      "cancel": "रद्द करें",
      "save": "सहेजें"
    },
    "home": {
      "title": "अपना परफेक्ट होटल खोजें",
      "subtitle": "दुनिया भर में 500,000 से अधिक होटल",
      "searchPlaceholder": "आप कहाँ जा रहे हैं?",
      "searchButton": "होटल खोजें"
    }
  },
  ar: {
    "common": {
      "search": "بحث",
      "login": "تسجيل الدخول",
      "register": "التسجيل",
      "logout": "تسجيل الخروج",
      "profile": "الملف الشخصي",
      "bookings": "حجوزاتي",
      "loading": "جاري التحميل...",
      "cancel": "إلغاء",
      "save": "حفظ"
    },
    "home": {
      "title": "اعثر على إقامتك المثالية",
      "subtitle": "أكثر من 500,000 فندق حول العالم",
      "searchPlaceholder": "إلى أين أنت ذاهب؟",
      "searchButton": "ابحث عن الفنادق"
    }
  }
};

console.log('🌍 Starte Übersetzungs-Update...\n');

// Aktualisiere jede Sprache
Object.keys(translations).forEach(lang => {
  const filePath = path.join(__dirname, 'messages', `${lang}.json`);
  
  try {
    // Lese existierende Datei
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Merge Übersetzungen (überschreibe nur die übersetzten Felder)
    const updated = {
      ...existing,
      common: {
        ...existing.common,
        ...translations[lang].common
      },
      home: {
        ...existing.home,
        ...translations[lang].home
      }
    };
    
    // Schreibe zurück
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8');
    console.log(`✅ ${lang}.json aktualisiert`);
  } catch (error) {
    console.error(`❌ Fehler bei ${lang}.json:`, error.message);
  }
});

console.log('\n✨ Übersetzungen erfolgreich aktualisiert!');
console.log('\n📝 Hinweis: Für professionelle Übersetzungen aller Sprachen');
console.log('   solltest du einen Übersetzungsdienst wie DeepL oder Google Translate API nutzen.');
