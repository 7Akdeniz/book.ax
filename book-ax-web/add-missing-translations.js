#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Alle 50 Sprachen
const locales = [
  'de', 'en', 'zh', 'hi', 'es', 'ar', 'fr', 'tr', 'ru',
  'af', 'bn', 'cs', 'da', 'el', 'fa', 'fi', 'he', 'hu',
  'id', 'it', 'ja', 'ko', 'ms', 'nl', 'no', 'pl', 'pt',
  'ro', 'sr', 'sv', 'sw', 'ta', 'te', 'th', 'uk', 'ur',
  'vi', 'bg', 'ca', 'et', 'hr', 'is', 'ka', 'lt', 'lv',
  'mk', 'sk', 'sl', 'sq', 'uz'
];

// Fehlende Übersetzungen mit professionellen Übersetzungen
const missingTranslations = {
  'panel.navigation.hotels': {
    de: 'Hotels',
    en: 'Hotels',
    zh: '酒店',
    hi: 'होटल',
    es: 'Hoteles',
    ar: 'الفنادق',
    fr: 'Hôtels',
    tr: 'Oteller',
    ru: 'Отели',
    af: 'Hotelle',
    bn: 'হোটেল',
    cs: 'Hotely',
    da: 'Hoteller',
    el: 'Ξενοδοχεία',
    fa: 'هتل‌ها',
    fi: 'Hotellit',
    he: 'מלונות',
    hu: 'Hotelek',
    id: 'Hotel',
    it: 'Hotel',
    ja: 'ホテル',
    ko: '호텔',
    ms: 'Hotel',
    nl: 'Hotels',
    no: 'Hoteller',
    pl: 'Hotele',
    pt: 'Hotéis',
    ro: 'Hoteluri',
    sr: 'Хотели',
    sv: 'Hotell',
    sw: 'Hoteli',
    ta: 'ஹோட்டல்கள்',
    te: 'హోటళ్లు',
    th: 'โรงแรม',
    uk: 'Готелі',
    ur: 'ہوٹل',
    vi: 'Khách sạn',
    bg: 'Хотели',
    ca: 'Hotels',
    et: 'Hotellid',
    hr: 'Hoteli',
    is: 'Hótel',
    ka: 'სასტუმროები',
    lt: 'Viešbučiai',
    lv: 'Viesnīcas',
    mk: 'Хотели',
    sk: 'Hotely',
    sl: 'Hoteli',
    sq: 'Hotele',
    uz: 'Mehmonxonalar'
  },
  'panel.navigation.backToSite': {
    de: 'Zurück zur Website',
    en: 'Back to Site',
    zh: '返回网站',
    hi: 'साइट पर वापस जाएं',
    es: 'Volver al sitio',
    ar: 'العودة إلى الموقع',
    fr: 'Retour au site',
    tr: 'Siteye Dön',
    ru: 'Вернуться на сайт',
    af: 'Terug na Webwerf',
    bn: 'সাইটে ফিরে যান',
    cs: 'Zpět na stránky',
    da: 'Tilbage til hjemmeside',
    el: 'Επιστροφή στον ιστότοπο',
    fa: 'بازگشت به سایت',
    fi: 'Takaisin sivustolle',
    he: 'חזרה לאתר',
    hu: 'Vissza az oldalra',
    id: 'Kembali ke Situs',
    it: 'Torna al sito',
    ja: 'サイトに戻る',
    ko: '사이트로 돌아가기',
    ms: 'Kembali ke Laman',
    nl: 'Terug naar site',
    no: 'Tilbake til siden',
    pl: 'Powrót do strony',
    pt: 'Voltar ao site',
    ro: 'Înapoi la site',
    sr: 'Назад на сајт',
    sv: 'Tillbaka till webbplatsen',
    sw: 'Rudi kwa Tovuti',
    ta: 'தளத்திற்குத் திரும்பு',
    te: 'సైట్‌కు తిరిగి వెళ్లండి',
    th: 'กลับไปที่เว็บไซต์',
    uk: 'Повернутися на сайт',
    ur: 'سائٹ پر واپس جائیں',
    vi: 'Quay lại trang',
    bg: 'Обратно към сайта',
    ca: 'Tornar al lloc',
    et: 'Tagasi saidile',
    hr: 'Natrag na stranicu',
    is: 'Aftur á síðuna',
    ka: 'უკან საიტზე',
    lt: 'Grįžti į svetainę',
    lv: 'Atpakaļ uz vietni',
    mk: 'Назад на страната',
    sk: 'Späť na stránku',
    sl: 'Nazaj na spletno stran',
    sq: 'Kthehu në faqe',
    uz: 'Saytga qaytish'
  },
  'auth.noAccount': {
    de: 'Noch kein Konto?',
    en: "Don't have an account?",
    zh: '还没有账户？',
    hi: 'खाता नहीं है?',
    es: '¿No tienes cuenta?',
    ar: 'ليس لديك حساب؟',
    fr: "Vous n'avez pas de compte?",
    tr: 'Hesabınız yok mu?',
    ru: 'Нет аккаунта?',
    af: 'Het jy nie \'n rekening nie?',
    bn: 'অ্যাকাউন্ট নেই?',
    cs: 'Nemáte účet?',
    da: 'Har du ikke en konto?',
    el: 'Δεν έχετε λογαριασμό;',
    fa: 'حساب کاربری ندارید؟',
    fi: 'Eikö sinulla ole tiliä?',
    he: 'אין לך חשבון?',
    hu: 'Nincs fiókod?',
    id: 'Belum punya akun?',
    it: 'Non hai un account?',
    ja: 'アカウントをお持ちでないですか？',
    ko: '계정이 없으신가요?',
    ms: 'Tidak mempunyai akaun?',
    nl: 'Heb je geen account?',
    no: 'Har du ikke en konto?',
    pl: 'Nie masz konta?',
    pt: 'Não tem conta?',
    ro: 'Nu ai cont?',
    sr: 'Немате налог?',
    sv: 'Har du inget konto?',
    sw: 'Hauna akaunti?',
    ta: 'கணக்கு இல்லையா?',
    te: 'ఖాతా లేదా?',
    th: 'ไม่มีบัญชี?',
    uk: 'Немає облікового запису?',
    ur: 'اکاؤنٹ نہیں ہے؟',
    vi: 'Chưa có tài khoản?',
    bg: 'Нямате акаунт?',
    ca: 'No tens compte?',
    et: 'Kas teil pole kontot?',
    hr: 'Nemate račun?',
    is: 'Ertu ekki með reikning?',
    ka: 'არ გაქვთ ანგარიში?',
    lt: 'Neturite paskyros?',
    lv: 'Vai jums nav konta?',
    mk: 'Немате сметка?',
    sk: 'Nemáte účet?',
    sl: 'Nimate računa?',
    sq: 'Nuk keni llogari?',
    uz: 'Hisobingiz yo\'qmi?'
  },
  'auth.loginFailed': {
    de: 'Anmeldung fehlgeschlagen',
    en: 'Login failed',
    zh: '登录失败',
    hi: 'लॉगिन विफल',
    es: 'Error de inicio de sesión',
    ar: 'فشل تسجيل الدخول',
    fr: 'Échec de la connexion',
    tr: 'Giriş başarısız',
    ru: 'Ошибка входа',
    af: 'Aanmelding het misluk',
    bn: 'লগইন ব্যর্থ হয়েছে',
    cs: 'Přihlášení se nezdařilo',
    da: 'Login mislykkedes',
    el: 'Η σύνδεση απέτυχε',
    fa: 'ورود ناموفق',
    fi: 'Kirjautuminen epäonnistui',
    he: 'הכניסה נכשלה',
    hu: 'Bejelentkezés sikertelen',
    id: 'Login gagal',
    it: 'Accesso non riuscito',
    ja: 'ログインに失敗しました',
    ko: '로그인 실패',
    ms: 'Log masuk gagal',
    nl: 'Inloggen mislukt',
    no: 'Pålogging mislyktes',
    pl: 'Logowanie nie powiodło się',
    pt: 'Falha no login',
    ro: 'Autentificare eșuată',
    sr: 'Пријављивање није успело',
    sv: 'Inloggningen misslyckades',
    sw: 'Kuingia kumeshindwa',
    ta: 'உள்நுழைவு தோல்வியுற்றது',
    te: 'లాగిన్ విఫలమైంది',
    th: 'เข้าสู่ระบบล้มเหลว',
    uk: 'Помилка входу',
    ur: 'لاگ ان ناکام',
    vi: 'Đăng nhập thất bại',
    bg: 'Неуспешен вход',
    ca: 'Error d\'inici de sessió',
    et: 'Sisselogimine ebaõnnestus',
    hr: 'Prijava nije uspjela',
    is: 'Innskráning mistókst',
    ka: 'შესვლა ვერ მოხერხდა',
    lt: 'Prisijungimas nepavyko',
    lv: 'Pieteikšanās neizdevās',
    mk: 'Најавата не успеа',
    sk: 'Prihlásenie zlyhalo',
    sl: 'Prijava ni uspela',
    sq: 'Hyrja dështoi',
    uz: 'Kirish muvaffaqiyatsiz'
  },
  'header.logout': {
    de: 'Abmelden',
    en: 'Logout',
    zh: '登出',
    hi: 'लॉगआउट',
    es: 'Cerrar sesión',
    ar: 'تسجيل الخروج',
    fr: 'Se déconnecter',
    tr: 'Çıkış Yap',
    ru: 'Выход',
    af: 'Teken uit',
    bn: 'লগআউট',
    cs: 'Odhlásit se',
    da: 'Log ud',
    el: 'Αποσύνδεση',
    fa: 'خروج',
    fi: 'Kirjaudu ulos',
    he: 'התנתק',
    hu: 'Kijelentkezés',
    id: 'Keluar',
    it: 'Esci',
    ja: 'ログアウト',
    ko: '로그아웃',
    ms: 'Log keluar',
    nl: 'Uitloggen',
    no: 'Logg ut',
    pl: 'Wyloguj',
    pt: 'Sair',
    ro: 'Deconectare',
    sr: 'Одјави се',
    sv: 'Logga ut',
    sw: 'Toka',
    ta: 'வெளியேறு',
    te: 'లాగ్అవుట్',
    th: 'ออกจากระบบ',
    uk: 'Вийти',
    ur: 'لاگ آؤٹ',
    vi: 'Đăng xuất',
    bg: 'Излез',
    ca: 'Tancar sessió',
    et: 'Logi välja',
    hr: 'Odjava',
    is: 'Útskrá',
    ka: 'გასვლა',
    lt: 'Atsijungti',
    lv: 'Iziet',
    mk: 'Одјави се',
    sk: 'Odhlásiť sa',
    sl: 'Odjava',
    sq: 'Dil',
    uz: 'Chiqish'
  },
  'search.noHotelsFound': {
    de: 'Keine Hotels gefunden',
    en: 'No hotels found',
    zh: '未找到酒店',
    hi: 'कोई होटल नहीं मिला',
    es: 'No se encontraron hoteles',
    ar: 'لم يتم العثور على فنادق',
    fr: 'Aucun hôtel trouvé',
    tr: 'Otel bulunamadı',
    ru: 'Отели не найдены',
    af: 'Geen hotelle gevind nie',
    bn: 'কোনো হোটেল পাওয়া যায়নি',
    cs: 'Nebyly nalezeny žádné hotely',
    da: 'Ingen hoteller fundet',
    el: 'Δεν βρέθηκαν ξενοδοχεία',
    fa: 'هتلی پیدا نشد',
    fi: 'Hotelleja ei löytynyt',
    he: 'לא נמצאו מלונות',
    hu: 'Nem található szálloda',
    id: 'Tidak ada hotel ditemukan',
    it: 'Nessun hotel trovato',
    ja: 'ホテルが見つかりません',
    ko: '호텔을 찾을 수 없습니다',
    ms: 'Tiada hotel dijumpai',
    nl: 'Geen hotels gevonden',
    no: 'Ingen hoteller funnet',
    pl: 'Nie znaleziono hoteli',
    pt: 'Nenhum hotel encontrado',
    ro: 'Nu s-au găsit hoteluri',
    sr: 'Хотели нису пронађени',
    sv: 'Inga hotell hittades',
    sw: 'Hakuna hoteli zilizopatikana',
    ta: 'ஹோட்டல்கள் எதுவும் கிடைக்கவில்லை',
    te: 'హోటల్స్ కనుగొనబడలేదు',
    th: 'ไม่พบโรงแรม',
    uk: 'Готелів не знайдено',
    ur: 'کوئی ہوٹل نہیں ملا',
    vi: 'Không tìm thấy khách sạn',
    bg: 'Не са намерени хотели',
    ca: 'No s\'han trobat hotels',
    et: 'Hotelle ei leitud',
    hr: 'Nema pronađenih hotela',
    is: 'Engin hótel fundust',
    ka: 'სასტუმროები ვერ მოიძებნა',
    lt: 'Viešbučių nerasta',
    lv: 'Viesnīcas nav atrastas',
    mk: 'Не се пронајдени хотели',
    sk: 'Nenašli sa žiadne hotely',
    sl: 'Ni bilo najdenih hotelov',
    sq: 'Nuk u gjetën hotele',
    uz: 'Mehmonxonalar topilmadi'
  },
  'search.tryDifferentCriteria': {
    de: 'Versuchen Sie andere Suchkriterien',
    en: 'Try different search criteria',
    zh: '尝试不同的搜索条件',
    hi: 'विभिन्न खोज मानदंड आज़माएं',
    es: 'Pruebe con diferentes criterios de búsqueda',
    ar: 'جرب معايير بحث مختلفة',
    fr: 'Essayez différents critères de recherche',
    tr: 'Farklı arama kriterleri deneyin',
    ru: 'Попробуйте другие критерии поиска',
    af: 'Probeer ander soekkriteria',
    bn: 'বিভিন্ন অনুসন্ধান মানদণ্ড চেষ্টা করুন',
    cs: 'Zkuste jiná vyhledávací kritéria',
    da: 'Prøv forskellige søgekriterier',
    el: 'Δοκιμάστε διαφορετικά κριτήρια αναζήτησης',
    fa: 'معیارهای جستجوی متفاوتی را امتحان کنید',
    fi: 'Kokeile erilaisia hakukriteereitä',
    he: 'נסה קריטריונים שונים לחיפוש',
    hu: 'Próbáljon más keresési feltételeket',
    id: 'Coba kriteria pencarian yang berbeda',
    it: 'Prova criteri di ricerca diversi',
    ja: '別の検索条件をお試しください',
    ko: '다른 검색 조건을 시도해 보세요',
    ms: 'Cuba kriteria carian yang berbeza',
    nl: 'Probeer andere zoekcriteria',
    no: 'Prøv forskjellige søkekriterier',
    pl: 'Spróbuj innych kryteriów wyszukiwania',
    pt: 'Tente critérios de pesquisa diferentes',
    ro: 'Încercați criterii de căutare diferite',
    sr: 'Покушајте различите критеријуме претраге',
    sv: 'Prova olika sökkriterier',
    sw: 'Jaribu vigezo tofauti vya utafutaji',
    ta: 'வேறு தேடல் அளவுகோல்களை முயற்சிக்கவும்',
    te: 'వేరే శోధన ప్రమాణాలను ప్రయత్నించండి',
    th: 'ลองใช้เกณฑ์การค้นหาที่แตกต่างกัน',
    uk: 'Спробуйте інші критерії пошуку',
    ur: 'مختلف تلاش کے معیار آزمائیں',
    vi: 'Thử tiêu chí tìm kiếm khác',
    bg: 'Опитайте различни критерии за търсене',
    ca: 'Proveu amb diferents criteris de cerca',
    et: 'Proovige erinevaid otsingukriteeriume',
    hr: 'Pokušajte s različitim kriterijima pretraživanja',
    is: 'Prófaðu mismunandi leitarviðmið',
    ka: 'სცადეთ სხვა საძიებო კრიტერიუმები',
    lt: 'Išbandykite skirtingus paieškos kriterijus',
    lv: 'Izmēģiniet dažādus meklēšanas kritērijus',
    mk: 'Обидете се со различни критериуми за пребарување',
    sk: 'Skúste iné kritériá vyhľadávania',
    sl: 'Poskusite z drugimi iskalnimi kriteriji',
    sq: 'Provoni kritere të ndryshme kërkimi',
    uz: 'Turli qidiruv mezonlarini sinab ko\'ring'
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
