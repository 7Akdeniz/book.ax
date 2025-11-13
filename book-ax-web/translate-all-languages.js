#!/usr/bin/env node

/**
 * Vollständige Übersetzungs-Script für alle 50 Sprachen
 * Übersetzt die wichtigsten UI-Texte
 */

const fs = require('fs');
const path = require('path');

// Vollständige Übersetzungen für alle 50 Sprachen
const translations = {
  // Top 9 Sprachen
  de: {
    common: {
      search: "Suchen",
      login: "Anmelden",
      register: "Registrieren",
      logout: "Abmelden",
      profile: "Profil",
      bookings: "Meine Buchungen",
      dashboard: "Dashboard",
      admin: "Admin",
      loading: "Wird geladen...",
      error: "Fehler",
      success: "Erfolg",
      cancel: "Abbrechen",
      save: "Speichern",
      delete: "Löschen",
      edit: "Bearbeiten",
      back: "Zurück",
      next: "Weiter",
      submit: "Absenden",
      close: "Schließen"
    },
    home: {
      title: "Finde deine perfekte Unterkunft",
      subtitle: "Über 500.000 Hotels weltweit",
      searchPlaceholder: "Wohin möchtest du reisen?",
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Gäste",
      searchButton: "Hotels suchen",
      popularDestinations: "Beliebte Reiseziele",
      featuredHotels: "Empfohlene Hotels",
      whyBookWithUs: "Warum bei uns buchen",
      bestPriceGuarantee: "Bestpreis-Garantie",
      noCreditCardFees: "Keine Kreditkartengebühren",
      freeChangesCancellation: "Kostenlose Änderungen & Stornierung"
    }
  },
  
  en: {
    common: {
      search: "Search",
      login: "Login",
      register: "Register",
      logout: "Logout",
      profile: "Profile",
      bookings: "My Bookings",
      dashboard: "Dashboard",
      admin: "Admin",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      back: "Back",
      next: "Next",
      submit: "Submit",
      close: "Close"
    },
    home: {
      title: "Find Your Perfect Stay",
      subtitle: "Over 500,000 hotels worldwide",
      searchPlaceholder: "Where are you going?",
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Guests",
      searchButton: "Search Hotels",
      popularDestinations: "Popular Destinations",
      featuredHotels: "Featured Hotels",
      whyBookWithUs: "Why Book With Us",
      bestPriceGuarantee: "Best Price Guarantee",
      noCreditCardFees: "No Credit Card Fees",
      freeChangesCancellation: "Free Changes & Cancellation"
    }
  },

  zh: {
    common: {
      search: "搜索",
      login: "登录",
      register: "注册",
      logout: "退出",
      profile: "个人资料",
      bookings: "我的预订",
      dashboard: "仪表板",
      admin: "管理员",
      loading: "加载中...",
      error: "错误",
      success: "成功",
      cancel: "取消",
      save: "保存",
      delete: "删除",
      edit: "编辑",
      back: "返回",
      next: "下一步",
      submit: "提交",
      close: "关闭"
    },
    home: {
      title: "找到您的完美住宿",
      subtitle: "全球超过500,000家酒店",
      searchPlaceholder: "您要去哪里？",
      checkIn: "入住",
      checkOut: "退房",
      guests: "客人",
      searchButton: "搜索酒店",
      popularDestinations: "热门目的地",
      featuredHotels: "精选酒店",
      whyBookWithUs: "为什么选择我们",
      bestPriceGuarantee: "最优价格保证",
      noCreditCardFees: "无信用卡手续费",
      freeChangesCancellation: "免费更改和取消"
    }
  },

  hi: {
    common: {
      search: "खोजें",
      login: "लॉग इन करें",
      register: "पंजीकरण करें",
      logout: "लॉग आउट",
      profile: "प्रोफ़ाइल",
      bookings: "मेरी बुकिंग",
      dashboard: "डैशबोर्ड",
      admin: "व्यवस्थापक",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफलता",
      cancel: "रद्द करें",
      save: "सहेजें",
      delete: "हटाएं",
      edit: "संपादित करें",
      back: "वापस",
      next: "अगला",
      submit: "जमा करें",
      close: "बंद करें"
    },
    home: {
      title: "अपना परफेक्ट होटल खोजें",
      subtitle: "दुनिया भर में 500,000 से अधिक होटल",
      searchPlaceholder: "आप कहाँ जा रहे हैं?",
      checkIn: "चेक-इन",
      checkOut: "चेक-आउट",
      guests: "अतिथि",
      searchButton: "होटल खोजें",
      popularDestinations: "लोकप्रिय गंतव्य",
      featuredHotels: "विशेष होटल",
      whyBookWithUs: "हमारे साथ क्यों बुक करें",
      bestPriceGuarantee: "सर्वोत्तम मूल्य गारंटी",
      noCreditCardFees: "कोई क्रेडिट कार्ड शुल्क नहीं",
      freeChangesCancellation: "मुफ्त परिवर्तन और रद्दीकरण"
    }
  },

  es: {
    common: {
      search: "Buscar",
      login: "Iniciar sesión",
      register: "Registrarse",
      logout: "Cerrar sesión",
      profile: "Perfil",
      bookings: "Mis Reservas",
      dashboard: "Panel",
      admin: "Admin",
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      cancel: "Cancelar",
      save: "Guardar",
      delete: "Eliminar",
      edit: "Editar",
      back: "Atrás",
      next: "Siguiente",
      submit: "Enviar",
      close: "Cerrar"
    },
    home: {
      title: "Encuentra tu estancia perfecta",
      subtitle: "Más de 500,000 hoteles en todo el mundo",
      searchPlaceholder: "¿A dónde vas?",
      checkIn: "Entrada",
      checkOut: "Salida",
      guests: "Huéspedes",
      searchButton: "Buscar hoteles",
      popularDestinations: "Destinos populares",
      featuredHotels: "Hoteles destacados",
      whyBookWithUs: "Por qué reservar con nosotros",
      bestPriceGuarantee: "Garantía del mejor precio",
      noCreditCardFees: "Sin comisiones de tarjeta",
      freeChangesCancellation: "Cambios y cancelación gratuitos"
    }
  },

  ar: {
    common: {
      search: "بحث",
      login: "تسجيل الدخول",
      register: "التسجيل",
      logout: "تسجيل الخروج",
      profile: "الملف الشخصي",
      bookings: "حجوزاتي",
      dashboard: "لوحة التحكم",
      admin: "المسؤول",
      loading: "جاري التحميل...",
      error: "خطأ",
      success: "نجح",
      cancel: "إلغاء",
      save: "حفظ",
      delete: "حذف",
      edit: "تعديل",
      back: "رجوع",
      next: "التالي",
      submit: "إرسال",
      close: "إغلاق"
    },
    home: {
      title: "اعثر على إقامتك المثالية",
      subtitle: "أكثر من 500,000 فندق حول العالم",
      searchPlaceholder: "إلى أين أنت ذاهب؟",
      checkIn: "تسجيل الوصول",
      checkOut: "تسجيل المغادرة",
      guests: "الضيوف",
      searchButton: "ابحث عن الفنادق",
      popularDestinations: "الوجهات الشعبية",
      featuredHotels: "الفنادق المميزة",
      whyBookWithUs: "لماذا تحجز معنا",
      bestPriceGuarantee: "ضمان أفضل سعر",
      noCreditCardFees: "بدون رسوم بطاقة ائتمان",
      freeChangesCancellation: "تغييرات وإلغاء مجاني"
    }
  },

  fr: {
    common: {
      search: "Rechercher",
      login: "Se connecter",
      register: "S'inscrire",
      logout: "Se déconnecter",
      profile: "Profil",
      bookings: "Mes Réservations",
      dashboard: "Tableau de bord",
      admin: "Admin",
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      cancel: "Annuler",
      save: "Enregistrer",
      delete: "Supprimer",
      edit: "Modifier",
      back: "Retour",
      next: "Suivant",
      submit: "Soumettre",
      close: "Fermer"
    },
    home: {
      title: "Trouvez votre séjour parfait",
      subtitle: "Plus de 500 000 hôtels dans le monde",
      searchPlaceholder: "Où allez-vous?",
      checkIn: "Arrivée",
      checkOut: "Départ",
      guests: "Invités",
      searchButton: "Rechercher des hôtels",
      popularDestinations: "Destinations populaires",
      featuredHotels: "Hôtels en vedette",
      whyBookWithUs: "Pourquoi réserver avec nous",
      bestPriceGuarantee: "Garantie du meilleur prix",
      noCreditCardFees: "Pas de frais de carte",
      freeChangesCancellation: "Modifications et annulation gratuites"
    }
  },

  tr: {
    common: {
      search: "Ara",
      login: "Giriş Yap",
      register: "Kayıt Ol",
      logout: "Çıkış Yap",
      profile: "Profil",
      bookings: "Rezervasyonlarım",
      dashboard: "Kontrol Paneli",
      admin: "Yönetici",
      loading: "Yükleniyor...",
      error: "Hata",
      success: "Başarılı",
      cancel: "İptal",
      save: "Kaydet",
      delete: "Sil",
      edit: "Düzenle",
      back: "Geri",
      next: "İleri",
      submit: "Gönder",
      close: "Kapat"
    },
    home: {
      title: "Mükemmel Konaklamanızı Bulun",
      subtitle: "Dünya çapında 500.000'den fazla otel",
      searchPlaceholder: "Nereye gidiyorsunuz?",
      checkIn: "Giriş",
      checkOut: "Çıkış",
      guests: "Misafirler",
      searchButton: "Otel Ara",
      popularDestinations: "Popüler Destinasyonlar",
      featuredHotels: "Öne Çıkan Oteller",
      whyBookWithUs: "Neden Bizimle Rezervasyon Yapmalı",
      bestPriceGuarantee: "En İyi Fiyat Garantisi",
      noCreditCardFees: "Kredi Kartı Ücreti Yok",
      freeChangesCancellation: "Ücretsiz Değişiklik ve İptal"
    }
  },

  ru: {
    common: {
      search: "Поиск",
      login: "Войти",
      register: "Регистрация",
      logout: "Выйти",
      profile: "Профиль",
      bookings: "Мои Бронирования",
      dashboard: "Панель управления",
      admin: "Администратор",
      loading: "Загрузка...",
      error: "Ошибка",
      success: "Успешно",
      cancel: "Отмена",
      save: "Сохранить",
      delete: "Удалить",
      edit: "Редактировать",
      back: "Назад",
      next: "Далее",
      submit: "Отправить",
      close: "Закрыть"
    },
    home: {
      title: "Найдите свой идеальный отель",
      subtitle: "Более 500 000 отелей по всему миру",
      searchPlaceholder: "Куда вы едете?",
      checkIn: "Заезд",
      checkOut: "Выезд",
      guests: "Гости",
      searchButton: "Искать отели",
      popularDestinations: "Популярные направления",
      featuredHotels: "Рекомендуемые отели",
      whyBookWithUs: "Почему стоит бронировать у нас",
      bestPriceGuarantee: "Гарантия лучшей цены",
      noCreditCardFees: "Без комиссий по карте",
      freeChangesCancellation: "Бесплатные изменения и отмена"
    }
  },

  // Restliche 41 Sprachen
  am: { // Amharic
    common: {
      search: "ፈልግ",
      login: "ግባ",
      register: "ይመዝገቡ",
      logout: "ውጣ",
      profile: "መገለጫ",
      bookings: "የእኔ ቦታ ማስያዝ",
      loading: "በመጫን ላይ...",
      cancel: "ሰርዝ",
      save: "አስቀምጥ"
    },
    home: {
      title: "ፍጹም የሆነ ማረፊያዎን ያግኙ",
      subtitle: "በዓለም ዙሪያ ከ500,000 በላይ ሆቴሎች",
      searchPlaceholder: "የት እየሄዱ ነው?",
      searchButton: "ሆቴሎችን ይፈልጉ"
    }
  },

  az: { // Azerbaijani
    common: {
      search: "Axtar",
      login: "Daxil ol",
      register: "Qeydiyyat",
      logout: "Çıxış",
      profile: "Profil",
      bookings: "Rezervasiyalarım",
      loading: "Yüklənir...",
      cancel: "Ləğv et",
      save: "Yadda saxla"
    },
    home: {
      title: "Mükəmməl Qalmanızı Tapın",
      subtitle: "Dünya üzrə 500,000-dən çox otel",
      searchPlaceholder: "Hara gedirsiniz?",
      searchButton: "Otel axtar"
    }
  },

  bn: { // Bengali
    common: {
      search: "খুঁজুন",
      login: "লগইন",
      register: "নিবন্ধন",
      logout: "লগআউট",
      profile: "প্রোফাইল",
      bookings: "আমার বুকিং",
      loading: "লোড হচ্ছে...",
      cancel: "বাতিল",
      save: "সংরক্ষণ"
    },
    home: {
      title: "আপনার নিখুঁত থাকার জায়গা খুঁজুন",
      subtitle: "বিশ্বব্যাপী 500,000+ হোটেল",
      searchPlaceholder: "আপনি কোথায় যাচ্ছেন?",
      searchButton: "হোটেল খুঁজুন"
    }
  },

  my: { // Burmese
    common: {
      search: "ရှာဖွေရန်",
      login: "လော့ဂ်အင်",
      register: "မှတ်ပုံတင်ရန်",
      logout: "ထွက်ရန်",
      profile: "ပရိုဖိုင်",
      bookings: "ကျွန်ုပ်၏ကြိုတင်မှာကြားမှုများ",
      loading: "တင်နေသည်...",
      cancel: "ပယ်ဖျက်ရန်",
      save: "သိမ်းရန်"
    },
    home: {
      title: "သင့်အတွက် ပြီးပြည့်စုံသော နေရာကို ရှာပါ",
      subtitle: "ကမ္ဘာတစ်ဝှမ်း ဟိုတယ် 500,000 ကျော်",
      searchPlaceholder: "သင်ဘယ်ကိုသွားမလဲ?",
      searchButton: "ဟိုတယ်ရှာရန်"
    }
  },

  ceb: { // Cebuano
    common: {
      search: "Pangita",
      login: "Login",
      register: "Pagrehistro",
      logout: "Logout",
      profile: "Profile",
      bookings: "Akong mga Booking",
      loading: "Nag-load...",
      cancel: "Kanselahon",
      save: "I-save"
    },
    home: {
      title: "Pangitaa ang Imong Perfect Stay",
      subtitle: "Kapin sa 500,000 ka hotel sa tibuok kalibutan",
      searchPlaceholder: "Asa ka paingon?",
      searchButton: "Pangitag Hotel"
    }
  },

  cs: { // Czech
    common: {
      search: "Hledat",
      login: "Přihlásit se",
      register: "Registrovat",
      logout: "Odhlásit se",
      profile: "Profil",
      bookings: "Moje Rezervace",
      loading: "Načítání...",
      cancel: "Zrušit",
      save: "Uložit"
    },
    home: {
      title: "Najděte svůj dokonalý pobyt",
      subtitle: "Přes 500 000 hotelů po celém světě",
      searchPlaceholder: "Kam jedete?",
      searchButton: "Hledat hotely"
    }
  },

  nl: { // Dutch
    common: {
      search: "Zoeken",
      login: "Inloggen",
      register: "Registreren",
      logout: "Uitloggen",
      profile: "Profiel",
      bookings: "Mijn Boekingen",
      loading: "Laden...",
      cancel: "Annuleren",
      save: "Opslaan"
    },
    home: {
      title: "Vind uw perfecte verblijf",
      subtitle: "Meer dan 500.000 hotels wereldwijd",
      searchPlaceholder: "Waar gaat u heen?",
      searchButton: "Hotels zoeken"
    }
  },

  fil: { // Filipino
    common: {
      search: "Maghanap",
      login: "Mag-login",
      register: "Magrehistro",
      logout: "Mag-logout",
      profile: "Profile",
      bookings: "Aking mga Booking",
      loading: "Naglo-load...",
      cancel: "Kanselahin",
      save: "I-save"
    },
    home: {
      title: "Hanapin ang Iyong Perpektong Tuluyan",
      subtitle: "Higit sa 500,000 hotel sa buong mundo",
      searchPlaceholder: "Saan ka pupunta?",
      searchButton: "Maghanap ng Hotel"
    }
  },

  el: { // Greek
    common: {
      search: "Αναζήτηση",
      login: "Σύνδεση",
      register: "Εγγραφή",
      logout: "Αποσύνδεση",
      profile: "Προφίλ",
      bookings: "Οι Κρατήσεις μου",
      loading: "Φόρτωση...",
      cancel: "Ακύρωση",
      save: "Αποθήκευση"
    },
    home: {
      title: "Βρείτε την Τέλεια Διαμονή σας",
      subtitle: "Πάνω από 500.000 ξενοδοχεία παγκοσμίως",
      searchPlaceholder: "Πού πηγαίνετε;",
      searchButton: "Αναζήτηση Ξενοδοχείων"
    }
  },

  gu: { // Gujarati
    common: {
      search: "શોધો",
      login: "લૉગિન",
      register: "નોંધણી",
      logout: "લૉગઆઉટ",
      profile: "પ્રોફાઇલ",
      bookings: "મારી બુકિંગ",
      loading: "લોડ થઈ રહ્યું છે...",
      cancel: "રદ કરો",
      save: "સાચવો"
    },
    home: {
      title: "તમારું સંપૂર્ણ રોકાણ શોધો",
      subtitle: "વિશ્વભરમાં 500,000+ હોટેલ્સ",
      searchPlaceholder: "તમે ક્યાં જઈ રહ્યા છો?",
      searchButton: "હોટેલ્સ શોધો"
    }
  },

  he: { // Hebrew
    common: {
      search: "חיפוש",
      login: "התחברות",
      register: "הרשמה",
      logout: "התנתקות",
      profile: "פרופיל",
      bookings: "ההזמנות שלי",
      loading: "טוען...",
      cancel: "ביטול",
      save: "שמירה"
    },
    home: {
      title: "מצא את השהייה המושלמת שלך",
      subtitle: "למעלה מ-500,000 מלונות ברחבי העולם",
      searchPlaceholder: "לאן אתה נוסע?",
      searchButton: "חפש מלונות"
    }
  },

  ha: { // Hausa
    common: {
      search: "Nema",
      login: "Shiga",
      register: "Yi Rajista",
      logout: "Fita",
      profile: "Bayani",
      bookings: "Ajiye Na",
      loading: "Ana lodawa...",
      cancel: "Soke",
      save: "Ajiye"
    },
    home: {
      title: "Nemo Mafi Kyawun Zama",
      subtitle: "Sama da otal 500,000 a duniya",
      searchPlaceholder: "Ina za ku?",
      searchButton: "Nemo Otal"
    }
  },

  id: { // Indonesian
    common: {
      search: "Cari",
      login: "Masuk",
      register: "Daftar",
      logout: "Keluar",
      profile: "Profil",
      bookings: "Pemesanan Saya",
      loading: "Memuat...",
      cancel: "Batal",
      save: "Simpan"
    },
    home: {
      title: "Temukan Penginapan Sempurna Anda",
      subtitle: "Lebih dari 500.000 hotel di seluruh dunia",
      searchPlaceholder: "Mau ke mana?",
      searchButton: "Cari Hotel"
    }
  },

  it: { // Italian
    common: {
      search: "Cerca",
      login: "Accedi",
      register: "Registrati",
      logout: "Esci",
      profile: "Profilo",
      bookings: "Le Mie Prenotazioni",
      loading: "Caricamento...",
      cancel: "Annulla",
      save: "Salva"
    },
    home: {
      title: "Trova il Tuo Soggiorno Perfetto",
      subtitle: "Oltre 500.000 hotel in tutto il mondo",
      searchPlaceholder: "Dove vai?",
      searchButton: "Cerca Hotel"
    }
  },

  ja: { // Japanese
    common: {
      search: "検索",
      login: "ログイン",
      register: "登録",
      logout: "ログアウト",
      profile: "プロフィール",
      bookings: "予約一覧",
      loading: "読み込み中...",
      cancel: "キャンセル",
      save: "保存"
    },
    home: {
      title: "最適な宿泊先を見つけよう",
      subtitle: "世界中で500,000軒以上のホテル",
      searchPlaceholder: "どこへ行きますか？",
      searchButton: "ホテルを検索"
    }
  },

  jv: { // Javanese
    common: {
      search: "Goleki",
      login: "Mlebu",
      register: "Ndaftar",
      logout: "Metu",
      profile: "Profil",
      bookings: "Pesenanku",
      loading: "Ngemot...",
      cancel: "Batal",
      save: "Simpen"
    },
    home: {
      title: "Temokake Panggonan Sing Sampurna",
      subtitle: "Luwih saka 500.000 hotel ing saindenging jagad",
      searchPlaceholder: "Arep menyang ngendi?",
      searchButton: "Goleki Hotel"
    }
  },

  kn: { // Kannada
    common: {
      search: "ಹುಡುಕಿ",
      login: "ಲಾಗಿನ್",
      register: "ನೋಂದಣಿ",
      logout: "ಲಾಗ್ಔಟ್",
      profile: "ಪ್ರೊಫೈಲ್",
      bookings: "ನನ್ನ ಬುಕಿಂಗ್‌ಗಳು",
      loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      cancel: "ರದ್ದುಮಾಡಿ",
      save: "ಉಳಿಸಿ"
    },
    home: {
      title: "ನಿಮ್ಮ ಪರಿಪೂರ್ಣ ವಸತಿ ಹುಡುಕಿ",
      subtitle: "ವಿಶ್ವಾದ್ಯಂತ 500,000+ ಹೋಟೆಲ್‌ಗಳು",
      searchPlaceholder: "ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?",
      searchButton: "ಹೋಟೆಲ್‌ಗಳನ್ನು ಹುಡುಕಿ"
    }
  },

  ko: { // Korean
    common: {
      search: "검색",
      login: "로그인",
      register: "회원가입",
      logout: "로그아웃",
      profile: "프로필",
      bookings: "내 예약",
      loading: "로딩 중...",
      cancel: "취소",
      save: "저장"
    },
    home: {
      title: "완벽한 숙소를 찾아보세요",
      subtitle: "전 세계 500,000개 이상의 호텔",
      searchPlaceholder: "어디로 가시나요?",
      searchButton: "호텔 검색"
    }
  },

  ms: { // Malay
    common: {
      search: "Cari",
      login: "Log Masuk",
      register: "Daftar",
      logout: "Log Keluar",
      profile: "Profil",
      bookings: "Tempahan Saya",
      loading: "Memuatkan...",
      cancel: "Batal",
      save: "Simpan"
    },
    home: {
      title: "Cari Penginapan Sempurna Anda",
      subtitle: "Lebih 500,000 hotel di seluruh dunia",
      searchPlaceholder: "Ke mana anda pergi?",
      searchButton: "Cari Hotel"
    }
  },

  ml: { // Malayalam
    common: {
      search: "തിരയുക",
      login: "ലോഗിൻ",
      register: "രജിസ്റ്റർ",
      logout: "ലോഗൗട്ട്",
      profile: "പ്രൊഫൈൽ",
      bookings: "എന്റെ ബുക്കിംഗുകൾ",
      loading: "ലോഡ് ചെയ്യുന്നു...",
      cancel: "റദ്ദാക്കുക",
      save: "സേവ് ചെയ്യുക"
    },
    home: {
      title: "നിങ്ങളുടെ പെർഫെക്റ്റ് താമസം കണ്ടെത്തുക",
      subtitle: "ലോകമെമ്പാടും 500,000+ ഹോട്ടലുകൾ",
      searchPlaceholder: "നിങ്ങൾ എവിടേക്കാണ് പോകുന്നത്?",
      searchButton: "ഹോട്ടലുകൾ തിരയുക"
    }
  },

  mr: { // Marathi
    common: {
      search: "शोधा",
      login: "लॉगिन",
      register: "नोंदणी",
      logout: "लॉगआउट",
      profile: "प्रोफाइल",
      bookings: "माझी बुकिंग",
      loading: "लोड होत आहे...",
      cancel: "रद्द करा",
      save: "जतन करा"
    },
    home: {
      title: "तुमचा परिपूर्ण मुक्काम शोधा",
      subtitle: "जगभरात 500,000+ हॉटेल्स",
      searchPlaceholder: "तुम्ही कुठे जात आहात?",
      searchButton: "हॉटेल्स शोधा"
    }
  },

  ne: { // Nepali
    common: {
      search: "खोज्नुहोस्",
      login: "लगइन",
      register: "दर्ता गर्नुहोस्",
      logout: "लगआउट",
      profile: "प्रोफाइल",
      bookings: "मेरो बुकिङ",
      loading: "लोड हुँदैछ...",
      cancel: "रद्द गर्नुहोस्",
      save: "सुरक्षित गर्नुहोस्"
    },
    home: {
      title: "आफ्नो उत्तम बास खोज्नुहोस्",
      subtitle: "विश्वभर 500,000+ होटलहरू",
      searchPlaceholder: "तपाईं कहाँ जाँदै हुनुहुन्छ?",
      searchButton: "होटल खोज्नुहोस्"
    }
  },

  om: { // Oromo
    common: {
      search: "Barbaadi",
      login: "Seeni",
      register: "Galmaa'i",
      logout: "Ba'i",
      profile: "Piroofaayilii",
      bookings: "Buufata Koo",
      loading: "Fe'aa jira...",
      cancel: "Dhiisi",
      save: "Olkaa'i"
    },
    home: {
      title: "Bakka Turuu Gaarii Barbaadi",
      subtitle: "Mana keessummaa 500,000 ol addunyaa irratti",
      searchPlaceholder: "Eessa deemta?",
      searchButton: "Mana Keessummaa Barbaadi"
    }
  },

  fa: { // Persian/Farsi
    common: {
      search: "جستجو",
      login: "ورود",
      register: "ثبت نام",
      logout: "خروج",
      profile: "پروفایل",
      bookings: "رزروهای من",
      loading: "در حال بارگذاری...",
      cancel: "لغو",
      save: "ذخیره"
    },
    home: {
      title: "اقامت ایده‌آل خود را پیدا کنید",
      subtitle: "بیش از 500,000 هتل در سراسر جهان",
      searchPlaceholder: "کجا می‌روید؟",
      searchButton: "جستجوی هتل"
    }
  },

  pl: { // Polish
    common: {
      search: "Szukaj",
      login: "Zaloguj się",
      register: "Zarejestruj się",
      logout: "Wyloguj",
      profile: "Profil",
      bookings: "Moje Rezerwacje",
      loading: "Ładowanie...",
      cancel: "Anuluj",
      save: "Zapisz"
    },
    home: {
      title: "Znajdź swój idealny pobyt",
      subtitle: "Ponad 500 000 hoteli na całym świecie",
      searchPlaceholder: "Dokąd jedziesz?",
      searchButton: "Szukaj hoteli"
    }
  },

  pa: { // Punjabi
    common: {
      search: "ਖੋਜੋ",
      login: "ਲਾਗਇਨ",
      register: "ਰਜਿਸਟਰ",
      logout: "ਲਾਗਆਉਟ",
      profile: "ਪ੍ਰੋਫਾਈਲ",
      bookings: "ਮੇਰੀਆਂ ਬੁਕਿੰਗਾਂ",
      loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
      cancel: "ਰੱਦ ਕਰੋ",
      save: "ਸੰਭਾਲੋ"
    },
    home: {
      title: "ਆਪਣੀ ਸੰਪੂਰਨ ਠਹਿਰਾਉ ਲੱਭੋ",
      subtitle: "ਦੁਨੀਆ ਭਰ ਵਿੱਚ 500,000+ ਹੋਟਲ",
      searchPlaceholder: "ਤੁਸੀਂ ਕਿੱਥੇ ਜਾ ਰਹੇ ਹੋ?",
      searchButton: "ਹੋਟਲ ਖੋਜੋ"
    }
  },

  ro: { // Romanian
    common: {
      search: "Căutare",
      login: "Autentificare",
      register: "Înregistrare",
      logout: "Deconectare",
      profile: "Profil",
      bookings: "Rezervările Mele",
      loading: "Se încarcă...",
      cancel: "Anulare",
      save: "Salvare"
    },
    home: {
      title: "Găsește-ți Cazarea Perfectă",
      subtitle: "Peste 500.000 de hoteluri în întreaga lume",
      searchPlaceholder: "Unde mergi?",
      searchButton: "Caută Hoteluri"
    }
  },

  sr: { // Serbian
    common: {
      search: "Претрага",
      login: "Пријава",
      register: "Регистрација",
      logout: "Одјава",
      profile: "Профил",
      bookings: "Моје Резервације",
      loading: "Учитавање...",
      cancel: "Откажи",
      save: "Сачувај"
    },
    home: {
      title: "Пронађите Свој Савршен Боравак",
      subtitle: "Преко 500.000 хотела широм света",
      searchPlaceholder: "Где идете?",
      searchButton: "Претражи Хотеле"
    }
  },

  sd: { // Sindhi
    common: {
      search: "ڳولھيو",
      login: "لاگ ان",
      register: "رجسٽر",
      logout: "لاگ آئوٽ",
      profile: "پروفائيل",
      bookings: "منهنجون بُڪنگون",
      loading: "لوڊ ٿي رهيو آهي...",
      cancel: "منسوخ",
      save: "محفوظ ڪريو"
    },
    home: {
      title: "پنهنجو بهترين رهائش ڳوليو",
      subtitle: "دنيا ۾ 500,000+ هوٽلون",
      searchPlaceholder: "توهان ڪٿي وڃي رهيا آهيو؟",
      searchButton: "هوٽل ڳوليو"
    }
  },

  si: { // Sinhala
    common: {
      search: "සොයන්න",
      login: "ලොගින්",
      register: "ලියාපදිංචිය",
      logout: "ලොග්අවුට්",
      profile: "පැතිකඩ",
      bookings: "මගේ වෙන්කිරීම්",
      loading: "පූරණය වෙමින්...",
      cancel: "අවලංගු කරන්න",
      save: "සුරකින්න"
    },
    home: {
      title: "ඔබේ පරිපූර්ණ නවාතැන සොයන්න",
      subtitle: "ලොව පුරා හෝටල් 500,000+",
      searchPlaceholder: "ඔබ කොතැනටද යන්නේ?",
      searchButton: "හෝටල් සොයන්න"
    }
  },

  so: { // Somali
    common: {
      search: "Raadi",
      login: "Gal",
      register: "Isdiiwaangeli",
      logout: "Ka bax",
      profile: "Astaanta",
      bookings: "Dalabkayga",
      loading: "Soo raraya...",
      cancel: "Jooji",
      save: "Kaydi"
    },
    home: {
      title: "Ka Raadi Meeshaada Ugu Fiican",
      subtitle: "In ka badan 500,000 oo hudheelka ah adduunka oo dhan",
      searchPlaceholder: "Xaggee baad u socotaa?",
      searchButton: "Raadi Hudheellada"
    }
  },

  sw: { // Swahili
    common: {
      search: "Tafuta",
      login: "Ingia",
      register: "Jiandikishe",
      logout: "Toka",
      profile: "Wasifu",
      bookings: "Mialiko Yangu",
      loading: "Inapakia...",
      cancel: "Ghairi",
      save: "Hifadhi"
    },
    home: {
      title: "Tafuta Makazi Yako Kamili",
      subtitle: "Zaidi ya hoteli 500,000 ulimwenguni",
      searchPlaceholder: "Unaenda wapi?",
      searchButton: "Tafuta Hoteli"
    }
  },

  ta: { // Tamil
    common: {
      search: "தேடு",
      login: "உள்நுழைய",
      register: "பதிவு",
      logout: "வெளியேறு",
      profile: "சுயவிவரம்",
      bookings: "எனது முன்பதிவுகள்",
      loading: "ஏற்றுகிறது...",
      cancel: "ரத்து செய்",
      save: "சேமி"
    },
    home: {
      title: "உங்கள் சிறந்த தங்குமிடத்தைக் கண்டறியுங்கள்",
      subtitle: "உலகளவில் 500,000+ ஹோட்டல்கள்",
      searchPlaceholder: "நீங்கள் எங்கு செல்கிறீர்கள்?",
      searchButton: "ஹோட்டல்களைத் தேடுங்கள்"
    }
  },

  te: { // Telugu
    common: {
      search: "వెతకండి",
      login: "లాగిన్",
      register: "నమోదు",
      logout: "లాగ్అవుట్",
      profile: "ప్రొఫైల్",
      bookings: "నా బుకింగ్‌లు",
      loading: "లోడ్ అవుతోంది...",
      cancel: "రద్దు చేయండి",
      save: "సేవ్ చేయండి"
    },
    home: {
      title: "మీ పరిపూర్ణ బస వెతకండి",
      subtitle: "ప్రపంచవ్యాప్తంగా 500,000+ హోటళ్లు",
      searchPlaceholder: "మీరు ఎక్కడికి వెళ్తున్నారు?",
      searchButton: "హోటళ్లను వెతకండి"
    }
  },

  th: { // Thai
    common: {
      search: "ค้นหา",
      login: "เข้าสู่ระบบ",
      register: "ลงทะเบียน",
      logout: "ออกจากระบบ",
      profile: "โปรไฟล์",
      bookings: "การจองของฉัน",
      loading: "กำลังโหลด...",
      cancel: "ยกเลิก",
      save: "บันทึก"
    },
    home: {
      title: "ค้นหาที่พักที่สมบูรณ์แบบของคุณ",
      subtitle: "โรงแรมกว่า 500,000 แห่งทั่วโลก",
      searchPlaceholder: "คุณจะไปที่ไหน?",
      searchButton: "ค้นหาโรงแรม"
    }
  },

  uk: { // Ukrainian
    common: {
      search: "Пошук",
      login: "Увійти",
      register: "Реєстрація",
      logout: "Вийти",
      profile: "Профіль",
      bookings: "Мої Бронювання",
      loading: "Завантаження...",
      cancel: "Скасувати",
      save: "Зберегти"
    },
    home: {
      title: "Знайдіть своє ідеальне помешкання",
      subtitle: "Понад 500 000 готелів у всьому світі",
      searchPlaceholder: "Куди ви їдете?",
      searchButton: "Шукати готелі"
    }
  },

  ur: { // Urdu
    common: {
      search: "تلاش کریں",
      login: "لاگ ان",
      register: "رجسٹر",
      logout: "لاگ آؤٹ",
      profile: "پروفائل",
      bookings: "میری بکنگز",
      loading: "لوڈ ہو رہا ہے...",
      cancel: "منسوخ کریں",
      save: "محفوظ کریں"
    },
    home: {
      title: "اپنی بہترین رہائش تلاش کریں",
      subtitle: "دنیا بھر میں 500,000+ ہوٹل",
      searchPlaceholder: "آپ کہاں جا رہے ہیں؟",
      searchButton: "ہوٹل تلاش کریں"
    }
  },

  vi: { // Vietnamese
    common: {
      search: "Tìm kiếm",
      login: "Đăng nhập",
      register: "Đăng ký",
      logout: "Đăng xuất",
      profile: "Hồ sơ",
      bookings: "Đặt phòng của tôi",
      loading: "Đang tải...",
      cancel: "Hủy",
      save: "Lưu"
    },
    home: {
      title: "Tìm Chỗ Nghỉ Hoàn Hảo Của Bạn",
      subtitle: "Hơn 500.000 khách sạn trên toàn thế giới",
      searchPlaceholder: "Bạn sẽ đi đâu?",
      searchButton: "Tìm khách sạn"
    }
  },

  yo: { // Yoruba
    common: {
      search: "Wa",
      login: "Wọle",
      register: "Forukọsilẹ",
      logout: "Jade",
      profile: "Profaili",
      bookings: "Awọn Ifiweranṣẹ Mi",
      loading: "Nṣiṣẹ...",
      cancel: "Fagilee",
      save: "Fipamọ"
    },
    home: {
      title: "Wa Ibi Gbigbe Pipe Rẹ",
      subtitle: "Ju awọn hotẹẹli 500,000 lọ ni agbaye",
      searchPlaceholder: "Nibo ni o nlọ?",
      searchButton: "Wa Awọn Hotẹẹli"
    }
  },

  zu: { // Zulu
    common: {
      search: "Sesha",
      login: "Ngena",
      register: "Bhalisa",
      logout: "Phuma",
      profile: "Iphrofayela",
      bookings: "Ukubhukha Kwami",
      loading: "Iyalayisha...",
      cancel: "Khansela",
      save: "Londoloza"
    },
    home: {
      title: "Thola Ukuhlala Kwakho Okuphelele",
      subtitle: "Amahhotela angaphezu kuka-500,000 emhlabeni wonke",
      searchPlaceholder: "Uyaphi?",
      searchButton: "Sesha Amahhotela"
    }
  },

  pt: { // Portuguese
    common: {
      search: "Pesquisar",
      login: "Entrar",
      register: "Registar",
      logout: "Sair",
      profile: "Perfil",
      bookings: "Minhas Reservas",
      loading: "Carregando...",
      cancel: "Cancelar",
      save: "Guardar"
    },
    home: {
      title: "Encontre a Sua Estadia Perfeita",
      subtitle: "Mais de 500.000 hotéis em todo o mundo",
      searchPlaceholder: "Para onde vai?",
      searchButton: "Pesquisar Hotéis"
    }
  }
};

console.log('🌍 Starte vollständige Übersetzung für alle 50 Sprachen...\n');

let successCount = 0;
let errorCount = 0;

// Aktualisiere alle Sprachen
Object.keys(translations).forEach(lang => {
  const filePath = path.join(__dirname, 'messages', `${lang}.json`);
  
  try {
    // Lese existierende Datei
    let existing = {};
    try {
      existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (readError) {
      console.log(`⚠️  ${lang}.json nicht gefunden, erstelle neue Datei...`);
    }
    
    // Merge Übersetzungen
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
    console.log(`✅ ${lang}.json erfolgreich aktualisiert`);
    successCount++;
  } catch (error) {
    console.error(`❌ Fehler bei ${lang}.json:`, error.message);
    errorCount++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`✨ Übersetzung abgeschlossen!`);
console.log(`   Erfolgreich: ${successCount}/50`);
console.log(`   Fehler: ${errorCount}/50`);
console.log('='.repeat(60));
console.log('\n📝 Alle 50 Sprachen wurden mit Basis-Übersetzungen aktualisiert!');
console.log('🌐 Teste jetzt deine App in verschiedenen Sprachen!');
console.log('\n💡 Tipp: Für professionelle Übersetzungen verwende:');
console.log('   - Google Translate API');
console.log('   - DeepL API');
console.log('   - Professionelle Übersetzungsdienste');
