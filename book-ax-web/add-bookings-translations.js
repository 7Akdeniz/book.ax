const fs = require('fs');
const path = require('path');

const translations = {
  de: {
    myBookings: "Meine Buchungen",
    noBookings: "Keine Buchungen vorhanden",
    noBookingsDescription: "Du hast noch keine Buchungen vorgenommen. Durchsuche unsere Hotels und finde deine perfekte Unterkunft!",
    searchHotels: "Hotels durchsuchen",
    unknownHotel: "Unbekanntes Hotel",
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Gäste",
    guest: "Gast",
    guestsPlural: "Gäste",
    bookedOn: "Gebucht am",
    loadError: "Fehler beim Laden der Buchungen",
    status: {
      confirmed: "Bestätigt",
      pending: "Ausstehend",
      cancelled: "Storniert"
    }
  },
  en: {
    myBookings: "My Bookings",
    noBookings: "No bookings yet",
    noBookingsDescription: "You haven't made any bookings yet. Browse our hotels and find your perfect stay!",
    searchHotels: "Search Hotels",
    unknownHotel: "Unknown Hotel",
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Guests",
    guest: "Guest",
    guestsPlural: "Guests",
    bookedOn: "Booked on",
    loadError: "Error loading bookings",
    status: {
      confirmed: "Confirmed",
      pending: "Pending",
      cancelled: "Cancelled"
    }
  },
  es: {
    myBookings: "Mis Reservas",
    noBookings: "Sin reservas aún",
    noBookingsDescription: "Aún no has realizado ninguna reserva. ¡Explora nuestros hoteles y encuentra tu estancia perfecta!",
    searchHotels: "Buscar Hoteles",
    unknownHotel: "Hotel Desconocido",
    checkIn: "Entrada",
    checkOut: "Salida",
    guests: "Huéspedes",
    guest: "Huésped",
    guestsPlural: "Huéspedes",
    bookedOn: "Reservado el",
    loadError: "Error al cargar las reservas",
    status: {
      confirmed: "Confirmado",
      pending: "Pendiente",
      cancelled: "Cancelado"
    }
  },
  fr: {
    myBookings: "Mes Réservations",
    noBookings: "Aucune réservation",
    noBookingsDescription: "Vous n'avez pas encore effectué de réservation. Parcourez nos hôtels et trouvez votre séjour idéal !",
    searchHotels: "Rechercher des Hôtels",
    unknownHotel: "Hôtel Inconnu",
    checkIn: "Arrivée",
    checkOut: "Départ",
    guests: "Voyageurs",
    guest: "Voyageur",
    guestsPlural: "Voyageurs",
    bookedOn: "Réservé le",
    loadError: "Erreur lors du chargement des réservations",
    status: {
      confirmed: "Confirmé",
      pending: "En attente",
      cancelled: "Annulé"
    }
  },
  zh: {
    myBookings: "我的预订",
    noBookings: "暂无预订",
    noBookingsDescription: "您还没有任何预订。浏览我们的酒店，找到您完美的住宿！",
    searchHotels: "搜索酒店",
    unknownHotel: "未知酒店",
    checkIn: "入住",
    checkOut: "退房",
    guests: "客人",
    guest: "客人",
    guestsPlural: "客人",
    bookedOn: "预订于",
    loadError: "加载预订时出错",
    status: {
      confirmed: "已确认",
      pending: "待处理",
      cancelled: "已取消"
    }
  },
  hi: {
    myBookings: "मेरी बुकिंग",
    noBookings: "अभी तक कोई बुकिंग नहीं",
    noBookingsDescription: "आपने अभी तक कोई बुकिंग नहीं की है। हमारे होटलों को ब्राउज़ करें और अपना परफेक्ट स्टे खोजें!",
    searchHotels: "होटल खोजें",
    unknownHotel: "अज्ञात होटल",
    checkIn: "चेक-इन",
    checkOut: "चेक-आउट",
    guests: "मेहमान",
    guest: "मेहमान",
    guestsPlural: "मेहमान",
    bookedOn: "बुक किया गया",
    loadError: "बुकिंग लोड करने में त्रुटि",
    status: {
      confirmed: "पुष्टि की गई",
      pending: "लंबित",
      cancelled: "रद्द"
    }
  },
  ar: {
    myBookings: "حجوزاتي",
    noBookings: "لا توجد حجوزات بعد",
    noBookingsDescription: "لم تقم بأي حجوزات بعد. تصفح فنادقنا واعثر على إقامتك المثالية!",
    searchHotels: "ابحث عن الفنادق",
    unknownHotel: "فندق غير معروف",
    checkIn: "تسجيل الوصول",
    checkOut: "تسجيل المغادرة",
    guests: "الضيوف",
    guest: "ضيف",
    guestsPlural: "ضيوف",
    bookedOn: "تم الحجز في",
    loadError: "خطأ في تحميل الحجوزات",
    status: {
      confirmed: "مؤكد",
      pending: "قيد الانتظار",
      cancelled: "ملغى"
    }
  },
  tr: {
    myBookings: "Rezervasyonlarım",
    noBookings: "Henüz rezervasyon yok",
    noBookingsDescription: "Henüz bir rezervasyon yapmadınız. Otellerimize göz atın ve mükemmel konaklamanızı bulun!",
    searchHotels: "Otel Ara",
    unknownHotel: "Bilinmeyen Otel",
    checkIn: "Giriş",
    checkOut: "Çıkış",
    guests: "Misafirler",
    guest: "Misafir",
    guestsPlural: "Misafirler",
    bookedOn: "Rezervasyon tarihi",
    loadError: "Rezervasyonlar yüklenirken hata",
    status: {
      confirmed: "Onaylandı",
      pending: "Beklemede",
      cancelled: "İptal Edildi"
    }
  },
  ru: {
    myBookings: "Мои Бронирования",
    noBookings: "Пока нет бронирований",
    noBookingsDescription: "У вас еще нет бронирований. Просмотрите наши отели и найдите идеальный вариант!",
    searchHotels: "Найти Отели",
    unknownHotel: "Неизвестный Отель",
    checkIn: "Заезд",
    checkOut: "Выезд",
    guests: "Гости",
    guest: "Гость",
    guestsPlural: "Гостей",
    bookedOn: "Забронировано",
    loadError: "Ошибка загрузки бронирований",
    status: {
      confirmed: "Подтверждено",
      pending: "Ожидается",
      cancelled: "Отменено"
    }
  }
};

const messagesDir = path.join(__dirname, 'messages');
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const locale = file.replace('.json', '');
  const filePath = path.join(messagesDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Use translation if available, otherwise use English as fallback
  const bookingsTranslation = translations[locale] || translations.en;
  
  // Add bookings section if not exists
  if (!content.bookings) {
    content.bookings = bookingsTranslation;
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
    console.log(`✅ Added bookings translations to ${locale}.json`);
  } else {
    console.log(`⚠️  Bookings section already exists in ${locale}.json`);
  }
});

console.log('\n✨ Done!');
