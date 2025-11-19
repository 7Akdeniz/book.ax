const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

// 10 active languages
const languages = ['da', 'de', 'en', 'es', 'fr', 'it', 'no', 'pl', 'sv', 'tr'];

const reviewsTranslations = {
  da: {
    title: "Gæsteanmeldelser",
    writeReview: "Skriv en anmeldelse",
    submitReview: "Indsend anmeldelse",
    submitSuccess: "Tak for din anmeldelse!",
    submitError: "Det lykkedes ikke at sende anmeldelse. Prøv venligst igen.",
    submitting: "Sender...",
    loginRequired: "Log ind for at skrive en anmeldelse",
    commentTooShort: "Skriv venligst mindst 10 tegn",
    yourReview: "Din anmeldelse",
    commentPlaceholder: "Del din oplevelse med dette hotel...",
    characters: "tegn",
    overallRating: "Samlet bedømmelse",
    cleanliness: "Renlighed",
    location: "Beliggenhed",
    service: "Service",
    value: "Pris-kvalitetsforhold",
    categories: "Bedømmelseskategorier",
    noReviews: "Ingen anmeldelser endnu",
    noReviewsDescription: "Vær den første til at anmelde dette hotel!",
    basedOn: "{count} anmeldelser",
    loading: "Indlæser anmeldelser...",
    loadMore: "Indlæs flere anmeldelser",
    verified: "Verificeret booking",
    hotelResponse: "Hotellets svar"
  },
  de: {
    title: "Gästebewertungen",
    writeReview: "Bewertung schreiben",
    submitReview: "Bewertung absenden",
    submitSuccess: "Vielen Dank für Ihre Bewertung!",
    submitError: "Bewertung konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    submitting: "Wird gesendet...",
    loginRequired: "Bitte melden Sie sich an, um eine Bewertung zu schreiben",
    commentTooShort: "Bitte schreiben Sie mindestens 10 Zeichen",
    yourReview: "Ihre Bewertung",
    commentPlaceholder: "Teilen Sie Ihre Erfahrungen mit diesem Hotel...",
    characters: "Zeichen",
    overallRating: "Gesamtbewertung",
    cleanliness: "Sauberkeit",
    location: "Lage",
    service: "Service",
    value: "Preis-Leistungs-Verhältnis",
    categories: "Bewertungskategorien",
    noReviews: "Noch keine Bewertungen",
    noReviewsDescription: "Seien Sie der Erste, der dieses Hotel bewertet!",
    basedOn: "{count} Bewertungen",
    loading: "Bewertungen werden geladen...",
    loadMore: "Weitere Bewertungen laden",
    verified: "Verifizierte Buchung",
    hotelResponse: "Antwort des Hotels"
  },
  en: {
    title: "Guest Reviews",
    writeReview: "Write a Review",
    submitReview: "Submit Review",
    submitSuccess: "Thank you for your review!",
    submitError: "Failed to submit review. Please try again.",
    submitting: "Submitting...",
    loginRequired: "Please login to write a review",
    commentTooShort: "Please write at least 10 characters",
    yourReview: "Your Review",
    commentPlaceholder: "Share your experience with this hotel...",
    characters: "characters",
    overallRating: "Overall Rating",
    cleanliness: "Cleanliness",
    location: "Location",
    service: "Service",
    value: "Value for Money",
    categories: "Rating Categories",
    noReviews: "No Reviews Yet",
    noReviewsDescription: "Be the first to review this hotel!",
    basedOn: "{count} reviews",
    loading: "Loading reviews...",
    loadMore: "Load More Reviews",
    verified: "Verified Booking",
    hotelResponse: "Hotel Response"
  },
  es: {
    title: "Opiniones de huéspedes",
    writeReview: "Escribir una opinión",
    submitReview: "Enviar opinión",
    submitSuccess: "¡Gracias por su opinión!",
    submitError: "No se pudo enviar la opinión. Por favor, inténtelo de nuevo.",
    submitting: "Enviando...",
    loginRequired: "Por favor, inicie sesión para escribir una opinión",
    commentTooShort: "Por favor, escriba al menos 10 caracteres",
    yourReview: "Su opinión",
    commentPlaceholder: "Comparta su experiencia con este hotel...",
    characters: "caracteres",
    overallRating: "Valoración general",
    cleanliness: "Limpieza",
    location: "Ubicación",
    service: "Servicio",
    value: "Relación calidad-precio",
    categories: "Categorías de valoración",
    noReviews: "Aún no hay opiniones",
    noReviewsDescription: "¡Sea el primero en opinar sobre este hotel!",
    basedOn: "{count} opiniones",
    loading: "Cargando opiniones...",
    loadMore: "Cargar más opiniones",
    verified: "Reserva verificada",
    hotelResponse: "Respuesta del hotel"
  },
  fr: {
    title: "Avis des clients",
    writeReview: "Écrire un avis",
    submitReview: "Soumettre l'avis",
    submitSuccess: "Merci pour votre avis !",
    submitError: "Échec de l'envoi de l'avis. Veuillez réessayer.",
    submitting: "Envoi en cours...",
    loginRequired: "Veuillez vous connecter pour écrire un avis",
    commentTooShort: "Veuillez écrire au moins 10 caractères",
    yourReview: "Votre avis",
    commentPlaceholder: "Partagez votre expérience avec cet hôtel...",
    characters: "caractères",
    overallRating: "Note globale",
    cleanliness: "Propreté",
    location: "Emplacement",
    service: "Service",
    value: "Rapport qualité-prix",
    categories: "Catégories d'évaluation",
    noReviews: "Aucun avis pour le moment",
    noReviewsDescription: "Soyez le premier à donner votre avis sur cet hôtel !",
    basedOn: "{count} avis",
    loading: "Chargement des avis...",
    loadMore: "Charger plus d'avis",
    verified: "Réservation vérifiée",
    hotelResponse: "Réponse de l'hôtel"
  },
  it: {
    title: "Recensioni degli ospiti",
    writeReview: "Scrivi una recensione",
    submitReview: "Invia recensione",
    submitSuccess: "Grazie per la tua recensione!",
    submitError: "Impossibile inviare la recensione. Riprova.",
    submitting: "Invio in corso...",
    loginRequired: "Effettua il login per scrivere una recensione",
    commentTooShort: "Scrivi almeno 10 caratteri",
    yourReview: "La tua recensione",
    commentPlaceholder: "Condividi la tua esperienza con questo hotel...",
    characters: "caratteri",
    overallRating: "Valutazione complessiva",
    cleanliness: "Pulizia",
    location: "Posizione",
    service: "Servizio",
    value: "Rapporto qualità-prezzo",
    categories: "Categorie di valutazione",
    noReviews: "Nessuna recensione ancora",
    noReviewsDescription: "Sii il primo a recensire questo hotel!",
    basedOn: "{count} recensioni",
    loading: "Caricamento recensioni...",
    loadMore: "Carica altre recensioni",
    verified: "Prenotazione verificata",
    hotelResponse: "Risposta dell'hotel"
  },
  no: {
    title: "Gjesteanmeldelser",
    writeReview: "Skriv en anmeldelse",
    submitReview: "Send anmeldelse",
    submitSuccess: "Takk for din anmeldelse!",
    submitError: "Kunne ikke sende anmeldelse. Vennligst prøv igjen.",
    submitting: "Sender...",
    loginRequired: "Vennligst logg inn for å skrive en anmeldelse",
    commentTooShort: "Vennligst skriv minst 10 tegn",
    yourReview: "Din anmeldelse",
    commentPlaceholder: "Del din opplevelse med dette hotellet...",
    characters: "tegn",
    overallRating: "Samlet vurdering",
    cleanliness: "Renslighet",
    location: "Beliggenhet",
    service: "Service",
    value: "Valuta for pengene",
    categories: "Vurderingskategorier",
    noReviews: "Ingen anmeldelser ennå",
    noReviewsDescription: "Bli den første til å anmelde dette hotellet!",
    basedOn: "{count} anmeldelser",
    loading: "Laster anmeldelser...",
    loadMore: "Last flere anmeldelser",
    verified: "Verifisert booking",
    hotelResponse: "Hotellets svar"
  },
  pl: {
    title: "Opinie gości",
    writeReview: "Napisz opinię",
    submitReview: "Wyślij opinię",
    submitSuccess: "Dziękujemy za Twoją opinię!",
    submitError: "Nie udało się wysłać opinii. Spróbuj ponownie.",
    submitting: "Wysyłanie...",
    loginRequired: "Zaloguj się, aby napisać opinię",
    commentTooShort: "Napisz co najmniej 10 znaków",
    yourReview: "Twoja opinia",
    commentPlaceholder: "Podziel się swoimi doświadczeniami z tym hotelem...",
    characters: "znaków",
    overallRating: "Ogólna ocena",
    cleanliness: "Czystość",
    location: "Lokalizacja",
    service: "Obsługa",
    value: "Stosunek jakości do ceny",
    categories: "Kategorie ocen",
    noReviews: "Brak opinii",
    noReviewsDescription: "Bądź pierwszą osobą, która oceni ten hotel!",
    basedOn: "{count} opinii",
    loading: "Ładowanie opinii...",
    loadMore: "Załaduj więcej opinii",
    verified: "Zweryfikowana rezerwacja",
    hotelResponse: "Odpowiedź hotelu"
  },
  sv: {
    title: "Gästrecensioner",
    writeReview: "Skriv en recension",
    submitReview: "Skicka recension",
    submitSuccess: "Tack för din recension!",
    submitError: "Det gick inte att skicka recensionen. Försök igen.",
    submitting: "Skickar...",
    loginRequired: "Logga in för att skriva en recension",
    commentTooShort: "Skriv minst 10 tecken",
    yourReview: "Din recension",
    commentPlaceholder: "Dela din upplevelse med detta hotell...",
    characters: "tecken",
    overallRating: "Totalt betyg",
    cleanliness: "Renlighet",
    location: "Läge",
    service: "Service",
    value: "Valuta för pengarna",
    categories: "Betygskategorier",
    noReviews: "Inga recensioner än",
    noReviewsDescription: "Bli den första att recensera detta hotell!",
    basedOn: "{count} recensioner",
    loading: "Laddar recensioner...",
    loadMore: "Ladda fler recensioner",
    verified: "Verifierad bokning",
    hotelResponse: "Hotellets svar"
  },
  tr: {
    title: "Misafir Yorumları",
    writeReview: "Yorum Yaz",
    submitReview: "Yorumu Gönder",
    submitSuccess: "Yorumunuz için teşekkür ederiz!",
    submitError: "Yorum gönderilemedi. Lütfen tekrar deneyin.",
    submitting: "Gönderiliyor...",
    loginRequired: "Yorum yazmak için lütfen giriş yapın",
    commentTooShort: "Lütfen en az 10 karakter yazın",
    yourReview: "Yorumunuz",
    commentPlaceholder: "Bu otel ile ilgili deneyiminizi paylaşın...",
    characters: "karakter",
    overallRating: "Genel Değerlendirme",
    cleanliness: "Temizlik",
    location: "Konum",
    service: "Hizmet",
    value: "Fiyat-Performans",
    categories: "Değerlendirme Kategorileri",
    noReviews: "Henüz yorum yok",
    noReviewsDescription: "Bu oteli ilk değerlendiren siz olun!",
    basedOn: "{count} yorum",
    loading: "Yorumlar yükleniyor...",
    loadMore: "Daha Fazla Yorum Yükle",
    verified: "Onaylanmış Rezervasyon",
    hotelResponse: "Otel Yanıtı"
  }
};

console.log('📝 Adding review translations to all 10 language files...\n');

languages.forEach(lang => {
  const filePath = path.join(messagesDir, `${lang}.json`);
  
  try {
    // Read existing file
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Add reviews section (or update if exists)
    data.reviews = reviewsTranslations[lang];
    
    // Write back with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    
    console.log(`✅ ${lang}.json - Reviews section added/updated`);
  } catch (error) {
    console.error(`❌ ${lang}.json - Error: ${error.message}`);
  }
});

console.log('\n✅ All review translations added successfully!');
console.log('\nTranslation keys added:');
console.log('- title, writeReview, submitReview');
console.log('- submitSuccess, submitError, submitting');
console.log('- loginRequired, commentTooShort');
console.log('- yourReview, commentPlaceholder, characters');
console.log('- overallRating, cleanliness, location, service, value');
console.log('- categories, noReviews, noReviewsDescription');
console.log('- basedOn, loading, loadMore');
console.log('- verified, hotelResponse');
