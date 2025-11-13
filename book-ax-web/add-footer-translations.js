#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const footerTranslations = {
  de: {
    tagline: "Ihre All-in-One-Plattform für Hotelbuchung und -verwaltung",
    forGuests: "Für Gäste",
    searchHotels: "Hotels suchen",
    myBookings: "Meine Buchungen",
    helpCenter: "Hilfe-Center",
    forHoteliers: "Für Hoteliers",
    dashboard: "Dashboard",
    listYourProperty: "Unterkunft eintragen",
    pricing: "Preise",
    legal: "Rechtliches",
    termsConditions: "AGB",
    privacyPolicy: "Datenschutz",
    cookiePolicy: "Cookie-Richtlinie",
    copyright: "© 2025 Book.ax. Alle Rechte vorbehalten. Mit ❤️ für die Hotelbranche"
  },
  en: {
    tagline: "Your all-in-one hotel booking and management platform",
    forGuests: "For Guests",
    searchHotels: "Search Hotels",
    myBookings: "My Bookings",
    helpCenter: "Help Center",
    forHoteliers: "For Hoteliers",
    dashboard: "Dashboard",
    listYourProperty: "List Your Property",
    pricing: "Pricing",
    legal: "Legal",
    termsConditions: "Terms & Conditions",
    privacyPolicy: "Privacy Policy",
    cookiePolicy: "Cookie Policy",
    copyright: "© 2025 Book.ax. All rights reserved. Made with ❤️ for the hospitality industry"
  },
  es: {
    tagline: "Tu plataforma todo en uno para reservas y gestión hotelera",
    forGuests: "Para Huéspedes",
    searchHotels: "Buscar Hoteles",
    myBookings: "Mis Reservas",
    helpCenter: "Centro de Ayuda",
    forHoteliers: "Para Hoteleros",
    dashboard: "Panel",
    listYourProperty: "Anunciar Propiedad",
    pricing: "Precios",
    legal: "Legal",
    termsConditions: "Términos y Condiciones",
    privacyPolicy: "Política de Privacidad",
    cookiePolicy: "Política de Cookies",
    copyright: "© 2025 Book.ax. Todos los derechos reservados. Hecho con ❤️ para la industria hotelera"
  },
  fr: {
    tagline: "Votre plateforme tout-en-un pour la réservation et la gestion d'hôtels",
    forGuests: "Pour les Clients",
    searchHotels: "Rechercher des Hôtels",
    myBookings: "Mes Réservations",
    helpCenter: "Centre d'Aide",
    forHoteliers: "Pour les Hôteliers",
    dashboard: "Tableau de bord",
    listYourProperty: "Inscrire Votre Propriété",
    pricing: "Tarifs",
    legal: "Légal",
    termsConditions: "Conditions Générales",
    privacyPolicy: "Politique de Confidentialité",
    cookiePolicy: "Politique de Cookies",
    copyright: "© 2025 Book.ax. Tous droits réservés. Fait avec ❤️ pour l'industrie hôtelière"
  },
  tr: {
    tagline: "Tek adımda otel rezervasyon ve yönetim platformunuz",
    forGuests: "Misafirler İçin",
    searchHotels: "Otel Ara",
    myBookings: "Rezervasyonlarım",
    helpCenter: "Yardım Merkezi",
    forHoteliers: "Otelciler İçin",
    dashboard: "Kontrol Paneli",
    listYourProperty: "Mülkünüzü Ekleyin",
    pricing: "Fiyatlandırma",
    legal: "Yasal",
    termsConditions: "Şartlar ve Koşullar",
    privacyPolicy: "Gizlilik Politikası",
    cookiePolicy: "Çerez Politikası",
    copyright: "© 2025 Book.ax. Tüm hakları saklıdır. Konaklama sektörü için ❤️ ile yapılmıştır"
  },
  ru: {
    tagline: "Ваша универсальная платформа для бронирования и управления отелями",
    forGuests: "Для Гостей",
    searchHotels: "Поиск Отелей",
    myBookings: "Мои Бронирования",
    helpCenter: "Центр Помощи",
    forHoteliers: "Для Владельцев",
    dashboard: "Панель Управления",
    listYourProperty: "Добавить Объект",
    pricing: "Цены",
    legal: "Правовая Информация",
    termsConditions: "Условия Использования",
    privacyPolicy: "Политика Конфиденциальности",
    cookiePolicy: "Политика Cookies",
    copyright: "© 2025 Book.ax. Все права защищены. Создано с ❤️ для индустрии гостеприимства"
  },
  zh: {
    tagline: "您的一体化酒店预订和管理平台",
    forGuests: "客人专区",
    searchHotels: "搜索酒店",
    myBookings: "我的预订",
    helpCenter: "帮助中心",
    forHoteliers: "酒店经营者",
    dashboard: "仪表板",
    listYourProperty: "添加您的酒店",
    pricing: "价格",
    legal: "法律信息",
    termsConditions: "条款和条件",
    privacyPolicy: "隐私政策",
    cookiePolicy: "Cookie政策",
    copyright: "© 2025 Book.ax. 版权所有。用 ❤️ 为酒店业打造"
  },
  hi: {
    tagline: "आपका ऑल-इन-वन होटल बुकिंग और प्रबंधन प्लेटफॉर्म",
    forGuests: "मेहमानों के लिए",
    searchHotels: "होटल खोजें",
    myBookings: "मेरी बुकिंग",
    helpCenter: "सहायता केंद्र",
    forHoteliers: "होटल मालिकों के लिए",
    dashboard: "डैशबोर्ड",
    listYourProperty: "अपनी संपत्ति जोड़ें",
    pricing: "मूल्य निर्धारण",
    legal: "कानूनी",
    termsConditions: "नियम और शर्तें",
    privacyPolicy: "गोपनीयता नीति",
    cookiePolicy: "कुकी नीति",
    copyright: "© 2025 Book.ax. सर्वाधिकार सुरक्षित। आतिथ्य उद्योग के लिए ❤️ से बनाया गया"
  },
  ar: {
    tagline: "منصتك الشاملة لحجز وإدارة الفنادق",
    forGuests: "للضيوف",
    searchHotels: "البحث عن فنادق",
    myBookings: "حجوزاتي",
    helpCenter: "مركز المساعدة",
    forHoteliers: "لأصحاب الفنادق",
    dashboard: "لوحة التحكم",
    listYourProperty: "أضف فندقك",
    pricing: "التسعير",
    legal: "قانوني",
    termsConditions: "الشروط والأحكام",
    privacyPolicy: "سياسة الخصوصية",
    cookiePolicy: "سياسة ملفات تعريف الارتباط",
    copyright: "© 2025 Book.ax. جميع الحقوق محفوظة. صنع بـ ❤️ لصناعة الضيافة"
  },
  it: {
    tagline: "La tua piattaforma tutto-in-uno per prenotazioni e gestione alberghiera",
    forGuests: "Per gli Ospiti",
    searchHotels: "Cerca Hotel",
    myBookings: "Le Mie Prenotazioni",
    helpCenter: "Centro Assistenza",
    forHoteliers: "Per Albergatori",
    dashboard: "Cruscotto",
    listYourProperty: "Inserisci la Tua Struttura",
    pricing: "Prezzi",
    legal: "Legale",
    termsConditions: "Termini e Condizioni",
    privacyPolicy: "Privacy Policy",
    cookiePolicy: "Cookie Policy",
    copyright: "© 2025 Book.ax. Tutti i diritti riservati. Fatto con ❤️ per l'industria dell'ospitalità"
  },
  ja: {
    tagline: "オールインワンのホテル予約・管理プラットフォーム",
    forGuests: "ゲスト向け",
    searchHotels: "ホテル検索",
    myBookings: "予約一覧",
    helpCenter: "ヘルプセンター",
    forHoteliers: "ホテル経営者向け",
    dashboard: "ダッシュボード",
    listYourProperty: "施設を登録",
    pricing: "料金",
    legal: "法的情報",
    termsConditions: "利用規約",
    privacyPolicy: "プライバシーポリシー",
    cookiePolicy: "Cookieポリシー",
    copyright: "© 2025 Book.ax. 無断転載禁止。ホスピタリティ業界のために ❤️ を込めて"
  },
  ko: {
    tagline: "올인원 호텔 예약 및 관리 플랫폼",
    forGuests: "고객용",
    searchHotels: "호텔 검색",
    myBookings: "내 예약",
    helpCenter: "고객센터",
    forHoteliers: "호텔 경영자용",
    dashboard: "대시보드",
    listYourProperty: "숙소 등록",
    pricing: "요금제",
    legal: "법적 고지",
    termsConditions: "이용약관",
    privacyPolicy: "개인정보처리방침",
    cookiePolicy: "쿠키 정책",
    copyright: "© 2025 Book.ax. 모든 권리 보유. 환대 산업을 위해 ❤️를 담아 제작"
  },
  pt: {
    tagline: "Sua plataforma completa para reservas e gestão hoteleira",
    forGuests: "Para Hóspedes",
    searchHotels: "Pesquisar Hotéis",
    myBookings: "Minhas Reservas",
    helpCenter: "Centro de Ajuda",
    forHoteliers: "Para Hoteleiros",
    dashboard: "Painel",
    listYourProperty: "Anunciar Propriedade",
    pricing: "Preços",
    legal: "Legal",
    termsConditions: "Termos e Condições",
    privacyPolicy: "Política de Privacidade",
    cookiePolicy: "Política de Cookies",
    copyright: "© 2025 Book.ax. Todos os direitos reservados. Feito com ❤️ para a indústria hoteleira"
  },
  nl: {
    tagline: "Uw all-in-one platform voor hotelboeking en -beheer",
    forGuests: "Voor Gasten",
    searchHotels: "Hotels Zoeken",
    myBookings: "Mijn Boekingen",
    helpCenter: "Helpcentrum",
    forHoteliers: "Voor Hoteliers",
    dashboard: "Dashboard",
    listYourProperty: "Accommodatie Vermelden",
    pricing: "Prijzen",
    legal: "Juridisch",
    termsConditions: "Algemene Voorwaarden",
    privacyPolicy: "Privacybeleid",
    cookiePolicy: "Cookiebeleid",
    copyright: "© 2025 Book.ax. Alle rechten voorbehouden. Met ❤️ gemaakt voor de horeca"
  },
  pl: {
    tagline: "Twoja kompleksowa platforma rezerwacji i zarządzania hotelami",
    forGuests: "Dla Gości",
    searchHotels: "Szukaj Hoteli",
    myBookings: "Moje Rezerwacje",
    helpCenter: "Centrum Pomocy",
    forHoteliers: "Dla Hotelarzy",
    dashboard: "Panel",
    listYourProperty: "Dodaj Obiekt",
    pricing: "Cennik",
    legal: "Prawne",
    termsConditions: "Regulamin",
    privacyPolicy: "Polityka Prywatności",
    cookiePolicy: "Polityka Cookies",
    copyright: "© 2025 Book.ax. Wszelkie prawa zastrzeżone. Stworzone z ❤️ dla branży hotelarskiej"
  }
};

console.log('🔄 Füge Footer-Übersetzungen hinzu...\n');

const messagesDir = path.join(__dirname, 'messages');
const locales = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));

let count = 0;
locales.forEach(locale => {
  const filePath = path.join(messagesDir, `${locale}.json`);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Füge footer Sektion hinzu
    data.footer = footerTranslations[locale] || footerTranslations.en;
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    count++;
  } catch (error) {
    console.error(`❌ Fehler bei ${locale}.json:`, error.message);
  }
});

console.log(`✅ ${count} Dateien aktualisiert`);
console.log('✨ Footer-Übersetzungen erfolgreich hinzugefügt!');
