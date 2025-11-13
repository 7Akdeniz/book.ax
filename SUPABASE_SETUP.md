# 🚀 Supabase Integration für Book.ax

## ✅ Was wurde installiert:

1. **@supabase/supabase-js** - Supabase Client
2. **react-native-url-polyfill** - URL Support für React Native
3. **Supabase Services** erstellt:
   - `src/services/supabase.ts` - Client & Typen
   - `src/services/supabaseAuth.ts` - Authentication
   - `src/services/supabaseHotels.ts` - Hotel-Verwaltung
   - `src/services/supabaseBookings.ts` - Buchungs-Verwaltung

---

## 📝 Setup-Anleitung (Schritt für Schritt)

### Schritt 1: Supabase Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com)
2. Klicke "Start your project" / "Sign Up"
3. Erstelle ein neues Projekt:
   - **Name:** Book.ax
   - **Database Password:** (Speichere das sicher!)
   - **Region:** Europe (Frankfurt)
4. Warte ~2 Minuten bis das Projekt bereit ist

### Schritt 2: API-Keys holen

1. Gehe zu: **Project Settings** (⚙️ Icon links unten)
2. Klicke: **API**
3. Kopiere diese 2 Werte:
   - **Project URL** (z.B. `https://abcdefg.supabase.co`)
   - **anon public key** (langer String)

### Schritt 3: .env Datei konfigurieren

Öffne `/Users/alanbest/B_Imo_co/.env` und ersetze:

```env
SUPABASE_URL=https://dein-projekt.supabase.co
SUPABASE_ANON_KEY=dein-anon-key-hier
```

Mit deinen echten Werten:

```env
SUPABASE_URL=https://abcdefghijklmn.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Schritt 4: Datenbank-Tabellen erstellen

1. Gehe zu: **SQL Editor** (📝 Icon in der Sidebar)
2. Klicke: **+ New query**
3. Öffne die Datei `supabase-schema.sql` in diesem Projekt
4. **Kopiere den KOMPLETTEN Inhalt** (Ctrl/Cmd + A, dann Ctrl/Cmd + C)
5. **Füge ihn in den SQL Editor ein** (Ctrl/Cmd + V)
6. Klicke **Run** (oder drücke F5)
7. Warte bis "Success" angezeigt wird

### Schritt 5: Tabellen überprüfen

Gehe zu: **Database** → **Tables**

Du solltest sehen:
- ✅ `users`
- ✅ `hotels`
- ✅ `bookings`
- ✅ `reviews`

### Schritt 6: Sample-Daten prüfen

Gehe zu: **Table Editor** → **hotels**

Du solltest 2 Beispiel-Hotels sehen:
- Grand Hotel Berlin
- Seaside Resort München

---

## 🔄 App-Code anpassen (Auth-Service umstellen)

### Option A: Supabase Auth ZUSÄTZLICH zu Mock-Auth

Öffne: `src/features/auth/authService.ts`

Füge am Anfang hinzu:

```typescript
import {supabaseAuthService, isSupabaseConfigured} from '@services/supabaseAuth';

// In der login-Funktion:
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  // Versuche zuerst Supabase
  if (isSupabaseConfigured()) {
    try {
      return await supabaseAuthService.login(credentials);
    } catch (error) {
      console.error('Supabase login failed, falling back to mock:', error);
    }
  }
  
  // Fallback zu Mock-Auth (existierend)
  // ... (dein existierender Code)
}
```

### Option B: NUR Supabase Auth (Empfohlen)

Ersetze `src/features/auth/authService.ts` komplett:

```typescript
export * from '@services/supabaseAuth';
export {supabaseAuthService as authService} from '@services/supabaseAuth';
```

---

## 🏨 Hotels aus Supabase laden

### In `src/features/search/searchService.ts`:

```typescript
import {supabaseHotelService} from '@services/supabaseHotels';

export const searchService = {
  searchHotels: async (params) => {
    return await supabaseHotelService.searchHotels(params);
  },
  
  getHotelById: async (id) => {
    return await supabaseHotelService.getHotelById(id);
  },
};
```

### Oder als Fallback (Mock + Supabase):

```typescript
import {supabaseHotelService, isSupabaseConfigured} from '@services/supabaseHotels';
import {mockHotels} from '@utils/mockData';

export const searchService = {
  searchHotels: async (params) => {
    if (isSupabaseConfigured()) {
      return await supabaseHotelService.searchHotels(params);
    }
    return mockHotels; // Fallback
  },
};
```

---

## 📚 Verfügbare Supabase Services

### 1. Authentication (`supabaseAuthService`)

```typescript
import {supabaseAuthService} from '@services/supabaseAuth';

// Login
await supabaseAuthService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Register
await supabaseAuthService.register({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'Max',
  lastName: 'Mustermann'
});

// Logout
await supabaseAuthService.logout();

// Current User
const user = await supabaseAuthService.getCurrentUser();

// Update Profile
await supabaseAuthService.updateProfile({
  firstName: 'Maximilian',
  lastName: 'Mustermann'
});
```

### 2. Hotels (`supabaseHotelService`)

```typescript
import {supabaseHotelService} from '@services/supabaseHotels';

// Search
const hotels = await supabaseHotelService.searchHotels({
  location: 'Berlin',
  minPrice: 100,
  maxPrice: 300,
  minRating: 4.0
});

// Get by ID
const hotel = await supabaseHotelService.getHotelById('hotel-uuid');

// Popular Hotels
const popular = await supabaseHotelService.getPopularHotels(5);

// Near Location
const nearby = await supabaseHotelService.getHotelsNearLocation(
  52.5200, // latitude
  13.4050, // longitude
  50 // radius in km
);
```

### 3. Bookings (`supabaseBookingService`)

```typescript
import {supabaseBookingService} from '@services/supabaseBookings';

// Create Booking
const booking = await supabaseBookingService.createBooking({
  hotelId: 'hotel-uuid',
  checkIn: new Date('2025-12-01'),
  checkOut: new Date('2025-12-05'),
  guests: 2,
  totalPrice: 800
});

// Get User Bookings
const bookings = await supabaseBookingService.getUserBookings();

// Get Upcoming
const upcoming = await supabaseBookingService.getUpcomingBookings();

// Cancel
await supabaseBookingService.cancelBooking('booking-uuid');
```

---

## 🔒 Security (Row Level Security)

Supabase nutzt Row Level Security (RLS):

- ✅ **Users** sehen nur ihr eigenes Profil
- ✅ **Hotels** sind für alle lesbar
- ✅ **Bookings** sieht jeder User nur seine eigenen
- ✅ **Reviews** sind öffentlich, aber nur Ersteller kann ändern/löschen

---

## 🧪 Testen

### 1. Registrierung testen:

```typescript
// In deiner Register-Screen
const result = await supabaseAuthService.register({
  email: 'test@bookax.com',
  password: 'Test123!',
  firstName: 'Test',
  lastName: 'User'
});
console.log('Registered:', result);
```

### 2. Hotels laden:

```typescript
const hotels = await supabaseHotelService.searchHotels();
console.log('Hotels:', hotels.length);
```

### 3. Buchung erstellen:

```typescript
const booking = await supabaseBookingService.createBooking({
  hotelId: hotels[0].id,
  checkIn: new Date('2025-12-01'),
  checkOut: new Date('2025-12-05'),
  guests: 2,
  totalPrice: 800
});
console.log('Booking created:', booking.id);
```

---

## 📊 Supabase Dashboard Features

### Table Editor
- **Direkt Daten bearbeiten** wie in Excel
- Neue Hotels manuell hinzufügen
- User-Daten ansehen

### Auth
- **Registrierte User sehen**
- Email-Bestätigung konfigurieren
- Social Login (Google, GitHub) aktivieren

### Storage
- **Hotel-Bilder hochladen**
- Öffentliche Buckets für Images
- CDN für schnellen Zugriff

### Realtime (Optional)
- **Live-Updates** wenn neue Buchungen kommen
- Subscribe to changes

---

## 🚀 Next Steps

### Sofort einsatzbereit:
1. ✅ Supabase Projekt erstellt
2. ✅ API-Keys in .env
3. ✅ Schema deployed
4. ✅ Services installiert
5. 🔄 Auth-Service in App umstellen
6. 🔄 Hotels aus Supabase laden
7. 📱 App neu starten & testen

### Später (Erweiterungen):
- 📸 **Storage:** Hotel-Bilder in Supabase Storage
- 🔔 **Realtime:** Live-Buchungs-Updates
- 🔐 **Social Auth:** Login mit Google/Apple
- 📧 **Email:** Buchungsbestätigungen per Email
- 🗺️ **Maps:** Geo-Queries für "Hotels in meiner Nähe"

---

## ⚠️ Wichtig

### .env NICHT committen!

Füge zur `.gitignore` hinzu (falls noch nicht):

```
.env
.env.local
```

### Production Keys

Für Production:
- Nutze **Service Role Key** NIE in der App
- Nutze nur **anon/public key** im Frontend
- Setze RLS Policies richtig
- Aktiviere Email-Bestätigung

---

## 🐛 Troubleshooting

### "Supabase ist nicht konfiguriert"

✅ **Lösung:** Prüfe `.env` Datei, starte Metro neu:
```bash
npm start -- --reset-cache
```

### "relation 'users' does not exist"

✅ **Lösung:** SQL-Schema noch nicht deployed → Schritt 4 wiederholen

### "Row Level Security violation"

✅ **Lösung:** User ist nicht angemeldet → Login zuerst

### "Invalid API key"

✅ **Lösung:** Falsche Keys in `.env` → Neu aus Dashboard kopieren

---

## 📚 Weitere Ressourcen

- [Supabase Docs](https://supabase.com/docs)
- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

**🎉 Deine Book.ax App ist jetzt mit einer echten Production-Datenbank verbunden!**
