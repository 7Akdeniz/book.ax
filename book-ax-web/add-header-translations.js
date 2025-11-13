#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const headerTranslations = {
  de: {
    hotels: "Hotels",
    forHoteliers: "Für Hoteliers",
    myBookings: "Meine Buchungen",
    login: "Anmelden",
    signUp: "Registrieren"
  },
  en: {
    hotels: "Hotels",
    forHoteliers: "For Hoteliers",
    myBookings: "My Bookings",
    login: "Login",
    signUp: "Sign Up"
  },
  es: {
    hotels: "Hoteles",
    forHoteliers: "Para Hoteleros",
    myBookings: "Mis Reservas",
    login: "Iniciar sesión",
    signUp: "Registrarse"
  },
  fr: {
    hotels: "Hôtels",
    forHoteliers: "Pour Hôteliers",
    myBookings: "Mes Réservations",
    login: "Se connecter",
    signUp: "S'inscrire"
  },
  tr: {
    hotels: "Oteller",
    forHoteliers: "Otelciler İçin",
    myBookings: "Rezervasyonlarım",
    login: "Giriş Yap",
    signUp: "Kayıt Ol"
  },
  ru: {
    hotels: "Отели",
    forHoteliers: "Для Отельеров",
    myBookings: "Мои Бронирования",
    login: "Войти",
    signUp: "Регистрация"
  },
  zh: {
    hotels: "酒店",
    forHoteliers: "酒店业主",
    myBookings: "我的预订",
    login: "登录",
    signUp: "注册"
  },
  hi: {
    hotels: "होटल",
    forHoteliers: "होटल मालिकों के लिए",
    myBookings: "मेरी बुकिंग",
    login: "लॉग इन करें",
    signUp: "पंजीकरण करें"
  },
  ar: {
    hotels: "الفنادق",
    forHoteliers: "لأصحاب الفنادق",
    myBookings: "حجوزاتي",
    login: "تسجيل الدخول",
    signUp: "التسجيل"
  },
  it: {
    hotels: "Hotel",
    forHoteliers: "Per Albergatori",
    myBookings: "Le Mie Prenotazioni",
    login: "Accedi",
    signUp: "Registrati"
  },
  ja: {
    hotels: "ホテル",
    forHoteliers: "ホテル経営者向け",
    myBookings: "予約一覧",
    login: "ログイン",
    signUp: "登録"
  },
  ko: {
    hotels: "호텔",
    forHoteliers: "호텔 경영자용",
    myBookings: "내 예약",
    login: "로그인",
    signUp: "회원가입"
  },
  pt: {
    hotels: "Hotéis",
    forHoteliers: "Para Hoteleiros",
    myBookings: "Minhas Reservas",
    login: "Entrar",
    signUp: "Registar"
  },
  nl: {
    hotels: "Hotels",
    forHoteliers: "Voor Hoteliers",
    myBookings: "Mijn Boekingen",
    login: "Inloggen",
    signUp: "Registreren"
  },
  pl: {
    hotels: "Hotele",
    forHoteliers: "Dla Hotelarzy",
    myBookings: "Moje Rezerwacje",
    login: "Zaloguj się",
    signUp: "Zarejestruj się"
  }
};

console.log('🔄 Füge Header-Übersetzungen hinzu...\n');

const messagesDir = path.join(__dirname, 'messages');
const locales = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));

locales.forEach(locale => {
  const filePath = path.join(messagesDir, `${locale}.json`);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Füge header Sektion hinzu
    data.header = headerTranslations[locale] || headerTranslations.en;
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ ${locale}.json - Header-Übersetzungen hinzugefügt`);
  } catch (error) {
    console.error(`❌ Fehler bei ${locale}.json:`, error.message);
  }
});

console.log('\n✨ Header-Übersetzungen erfolgreich hinzugefügt!');
