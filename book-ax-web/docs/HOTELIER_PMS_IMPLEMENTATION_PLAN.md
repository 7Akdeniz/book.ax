# 🏨 HOTELIER PMS - IMPLEMENTIERUNGSPLAN

**Stand:** 14. November 2025  
**Ziel:** Vollständiges Property Management System für Hotelbesitzer

---

## 📊 AKTUELLER STATUS - WAS EXISTIERT BEREITS?

### ✅ Datenbank Schema (100% fertig)
```sql
✅ hotels                    - Hotelstammdaten
✅ hotel_translations        - Multi-Language Support
✅ hotel_images              - Hotel & Zimmer Bilder
✅ room_categories           - Zimmertypen (Standard, Deluxe, Suite, etc.)
✅ room_category_translations - Multi-Language Zimmerbeschreibungen
✅ room_category_amenities   - Zimmer-Ausstattung
✅ rates                     - Preise pro Tag und Zimmertyp
✅ inventory                 - Verfügbarkeit pro Tag und Zimmertyp
✅ bookings                  - Buchungen mit Auto-Commission Trigger
✅ payments                  - Stripe Payments
✅ housekeeping              - Zimmer-Status Management
✅ amenities                 - Ausstattungsmerkmale
```

**Wichtige DB-Features:**
- ✅ Automatische Provisions-Berechnung via Trigger
- ✅ Booking Reference Auto-Generation
- ✅ Updated_at Timestamps
- ✅ Vollständige Constraints & Indexes
- ✅ Multi-Language Support für Hotels & Zimmer

### ⚠️ API Routes (teilweise implementiert)

**Existiert bereits:**
```
✅ /api/auth/*              - Login, Register, Refresh Token
✅ /api/hotels              - GET, POST (basic)
✅ /api/hotels/[id]         - GET, PUT, DELETE (basic)
✅ /api/bookings            - GET, POST (basic)
✅ /api/bookings/[id]       - GET, PUT, DELETE
✅ /api/payments/*          - Stripe Integration (basic)
```

**Fehlt noch:**
```
❌ /api/hotels/[id]/rooms              - Room Categories Management
❌ /api/hotels/[id]/images             - Image Upload
❌ /api/hotels/[id]/rates              - Rates Management (Bulk Update)
❌ /api/hotels/[id]/inventory          - Inventory Management
❌ /api/hotels/[id]/calendar           - Calendar Data (Aggregated View)
❌ /api/hotels/[id]/dashboard          - Dashboard Stats
❌ /api/hotels/[id]/housekeeping       - Housekeeping Operations
❌ /api/search/availability            - Availability Search (Guest-Side)
```

### 🎨 Frontend Components

**Existiert:**
```
✅ /panel                    - Basic Dashboard
✅ /panel/page.tsx           - Dashboard mit Stats (incomplete)
```

**Fehlt komplett:**
```
❌ /panel/hotels/new         - Hotel Onboarding Form
❌ /panel/hotels/[id]        - Hotel Details & Settings
❌ /panel/hotels/[id]/rooms  - Room Categories Management
❌ /panel/hotels/[id]/images - Image Upload & Gallery
❌ /panel/calendar           - Interactive Calendar View
❌ /panel/rates              - Rates Management Interface
❌ /panel/reservations       - Reservations List
❌ /panel/housekeeping       - Housekeeping Board
❌ /panel/reports            - Analytics & Reports

❌ Guest-Side:
   - /search                 - Availability Search
   - /hotel/[id]/book       - Booking Flow mit Room Selection
   - /checkout              - Payment Checkout
```

---

## 🎯 IMPLEMENTIERUNGS-PRIORITÄTEN

### Phase 1: Hotel & Zimmer Onboarding (KRITISCH)
**Warum zuerst?** Ohne Hotels und Zimmer gibt es nichts zu buchen!

**Komponenten:**
1. **Hotel Registration Form** (`/panel/hotels/new`)
   - Hotel Stammdaten (Name, Adresse, Kontakt)
   - Property Type Selection
   - Multi-Language Descriptions
   - Check-in/out Times
   - Commission Settings (10-50%, default 15%)

2. **Room Categories Management** (`/panel/hotels/[id]/rooms`)
   - Zimmertyp anlegen (Standard, Deluxe, Suite, etc.)
   - Multi-Language Name & Description
   - Base Price, Max Occupancy, Size
   - Bed Type, Smoking Policy
   - Total Rooms (für Inventory Initialization)
   - Amenities Selection

3. **Image Upload** (`/panel/hotels/[id]/images`)
   - Drag & Drop Upload
   - Primary Image Selection
   - Display Order Management
   - Alt Text für SEO

**API Routes zu erstellen:**
```typescript
POST   /api/hotels                      - Create Hotel
PUT    /api/hotels/[id]                 - Update Hotel
POST   /api/hotels/[id]/translations    - Add/Update Translations
POST   /api/hotels/[id]/rooms           - Create Room Category
PUT    /api/hotels/[id]/rooms/[roomId] - Update Room Category
DELETE /api/hotels/[id]/rooms/[roomId] - Delete Room Category
POST   /api/hotels/[id]/images          - Upload Image (Supabase Storage)
DELETE /api/hotels/[id]/images/[imgId] - Delete Image
```

**Geschätzte Zeit:** 3-4 Tage

---

### Phase 2: Verfügbarkeit & Preise Management (KRITISCH)
**Warum kritisch?** Inventory & Rates sind das Herzstück des PMS!

**Konzept:**
- **Inventory Table:** Verfügbare Zimmer pro Tag und Zimmertyp
- **Rates Table:** Preis pro Tag und Zimmertyp
- Bei Booking: Inventory automatisch dekrementieren
- Bei Cancellation: Inventory inkrementieren

**UI Features:**
1. **Bulk Rate Update** (`/panel/rates`)
   - Date Range Selector (z.B. 01.12.2025 - 31.12.2025)
   - Room Category Selection
   - Price Input (alle Tage gleich oder CSV-Upload)
   - Min/Max Stay Rules
   - Closed to Arrival/Departure Flags

2. **Inventory Initialization**
   - Beim Anlegen eines Room Category → automatisch Inventory für nächste 365 Tage generieren
   - `total_rooms` = Anzahl physischer Zimmer
   - `available_rooms` = initial gleich `total_rooms`

3. **Quick Actions:**
   - "Close Dates" → `available_rooms = 0` für bestimmte Tage
   - "Stop Sale" → `closed_to_arrival = true`
   - "Seasonal Pricing" → Bulk Update mit Prozent-Aufschlag

**API Routes:**
```typescript
GET    /api/hotels/[id]/rates           - Get Rates (Date Range)
POST   /api/hotels/[id]/rates/bulk      - Bulk Create/Update Rates
PUT    /api/hotels/[id]/rates/[rateId]  - Update Single Rate
DELETE /api/hotels/[id]/rates           - Delete Rates (Date Range)

GET    /api/hotels/[id]/inventory       - Get Inventory (Date Range)
POST   /api/hotels/[id]/inventory/init  - Initialize Inventory (365 days)
PUT    /api/hotels/[id]/inventory/bulk  - Bulk Update Inventory
```

**Business Logic:**
```typescript
// Bei Booking Creation:
1. Check Inventory: available_rooms >= num_rooms?
2. Check Rate: Preis vorhanden für alle Tage?
3. Calculate Total: Sum(rates[check_in:check_out]) * num_rooms
4. Decrement Inventory: available_rooms -= num_rooms (für alle Tage)
5. Insert Booking

// Bei Booking Cancellation:
1. Increment Inventory: available_rooms += num_rooms (für alle Tage)
2. Update Booking Status
```

**Geschätzte Zeit:** 4-5 Tage

---

### Phase 3: Kalender-Ansicht (HIGH PRIORITY)
**Warum wichtig?** Hoteliers arbeiten visuell mit Kalendern!

**UI Design:**
```
┌─────────────────────────────────────────────────────────┐
│  November 2025                    [<] [Today] [>]       │
├──────┬──────┬──────┬──────┬──────┬──────┬──────┬───────┤
│ Mon  │ Tue  │ Wed  │ Thu  │ Fri  │ Sat  │ Sun  │       │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┼───────┤
│ Standard Room (20 Zimmer)                              │
│  1   │  2   │  3   │  4   │  5   │  6   │  7   │       │
│ €80  │ €80  │ €90  │ €90  │€100  │€120  │€120  │       │
│ 15/20│ 18/20│ 20/20│ 12/20│ 8/20 │ 2/20 │ 5/20 │       │
│ 🟢   │ 🟡   │ 🔴   │ 🟢   │ 🟢   │ 🔴   │ 🟡   │       │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┼───────┤
│ Deluxe Room (10 Zimmer)                                │
│  1   │  2   │  3   │  4   │  5   │  6   │  7   │       │
│€120  │€120  │€130  │€130  │€150  │€180  │€180  │       │
│ 8/10 │ 9/10 │10/10 │ 6/10 │ 4/10 │ 0/10 │ 2/10 │       │
│ 🟡   │ 🟡   │ 🔴   │ 🟢   │ 🟢   │ ⚫   │ 🔴   │       │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┴───────┘
```

**Features:**
- Color Coding:
  - 🟢 Grün: > 50% verfügbar
  - 🟡 Gelb: 20-50% verfügbar
  - 🔴 Rot: < 20% verfügbar
  - ⚫ Schwarz: Ausgebucht (0 verfügbar)
  
- Click on Cell:
  - Edit Price
  - Edit Availability
  - View Bookings für diesen Tag
  
- Drag & Drop:
  - Preis über mehrere Tage ziehen (Bulk Update)

**Libraries:**
- **react-big-calendar** oder **FullCalendar** (React Wrapper)
- **date-fns** für Date Manipulation

**API Route:**
```typescript
GET /api/hotels/[id]/calendar?start=2025-11-01&end=2025-11-30&roomCategoryId=xxx

Response:
{
  "roomCategories": [
    {
      "id": "xxx",
      "name": "Standard Room",
      "totalRooms": 20,
      "days": [
        {
          "date": "2025-11-01",
          "rate": { "price": 80.00, "minStay": 1, "closedToArrival": false },
          "inventory": { "totalRooms": 20, "availableRooms": 15, "occupancyRate": 75 },
          "bookings": [
            { "id": "...", "guestName": "John Doe", "checkIn": "2025-11-01", "checkOut": "2025-11-03" }
          ]
        },
        // ... 29 weitere Tage
      ]
    }
  ]
}
```

**Geschätzte Zeit:** 5-6 Tage (komplex!)

---

### Phase 4: Verfügbarkeitssuche (Guest-Side)
**User Story:** Gast gibt Destination, Dates, Guests ein → findet verfügbare Hotels

**Search Flow:**
```
1. Guest: "Berlin, 15.12.2025 - 20.12.2025, 2 Gäste"
2. Backend Query:
   - Find Hotels in Berlin
   - Check Inventory für diese Dates
   - Filter: available_rooms > 0 für ALLE Tage (15.-19.12.)
   - Get Rates für Price Display
3. Return: Hotels mit verfügbaren Zimmern + Preis
```

**SQL Query (pseudo):**
```sql
SELECT h.*, rc.*, 
       SUM(r.price) as total_price,
       MIN(i.available_rooms) as min_available
FROM hotels h
JOIN room_categories rc ON rc.hotel_id = h.id
JOIN rates r ON r.room_category_id = rc.id
JOIN inventory i ON i.room_category_id = rc.id
WHERE h.address_city = 'Berlin'
  AND r.date BETWEEN '2025-12-15' AND '2025-12-19'
  AND i.date BETWEEN '2025-12-15' AND '2025-12-19'
  AND i.available_rooms > 0
GROUP BY h.id, rc.id
HAVING COUNT(DISTINCT r.date) = 5  -- Alle 5 Tage verfügbar
   AND MIN(i.available_rooms) > 0  -- Min 1 Zimmer frei
ORDER BY total_price ASC;
```

**API Route:**
```typescript
GET /api/search/availability?city=Berlin&checkIn=2025-12-15&checkOut=2025-12-20&guests=2

Response:
{
  "hotels": [
    {
      "id": "...",
      "name": "Hotel Berlin Mitte",
      "city": "Berlin",
      "starRating": 4,
      "images": [...],
      "availableRooms": [
        {
          "roomCategoryId": "...",
          "name": "Standard Room",
          "maxOccupancy": 2,
          "totalPrice": 400.00,  // 5 Nächte * 80€
          "pricePerNight": 80.00,
          "availableRooms": 5
        }
      ]
    }
  ]
}
```

**Frontend Component:**
```tsx
<SearchResults 
  results={hotels}
  checkIn={checkIn}
  checkOut={checkOut}
  guests={guests}
/>
```

**Geschätzte Zeit:** 3-4 Tage

---

### Phase 5: Buchungsprozess vervollständigen
**User Flow:**
```
1. Guest sucht Hotels → /search
2. Guest wählt Hotel → /hotel/[id]
3. Guest wählt Room Category → /hotel/[id]
4. Guest klickt "Book Now" → /hotel/[id]/book
5. Guest füllt Gast-Daten aus
6. Guest klickt "Proceed to Payment" → /checkout
7. Stripe Checkout
8. Payment Success → Booking Confirmed
```

**Bereits vorhanden:**
- ✅ POST /api/bookings (basic)
- ✅ Stripe Payment Intent Creation

**Zu erweitern:**
1. **Booking Creation mit Inventory Check:**
```typescript
// /api/bookings/route.ts
POST /api/bookings
{
  "hotelId": "...",
  "roomCategoryId": "...",
  "checkInDate": "2025-12-15",
  "checkOutDate": "2025-12-20",
  "numGuests": 2,
  "numRooms": 1,
  "guestFirstName": "John",
  "guestLastName": "Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+49..."
}

Logic:
1. Verify Availability (Check Inventory für alle Tage)
2. Calculate Total Price (Sum Rates)
3. Get Hotel Commission Percentage
4. Create Booking (Status: 'pending')
5. Decrement Inventory (alle Tage)
6. Return Booking + PaymentIntent
```

2. **Payment Webhook erweitern:**
```typescript
// /api/payments/webhook/route.ts
Stripe Events:
- payment_intent.succeeded → Update Booking Status: 'confirmed'
- payment_intent.payment_failed → Rollback Inventory, Delete Booking
- charge.refunded → Update Booking Status: 'cancelled', Increment Inventory
```

3. **Cancellation API:**
```typescript
POST /api/bookings/[id]/cancel
Logic:
1. Check if Booking is cancellable (Policy: 24h before check-in)
2. Refund Payment via Stripe
3. Update Booking Status: 'cancelled'
4. Increment Inventory (alle Tage)
```

**Geschätzte Zeit:** 3-4 Tage

---

### Phase 6: Stripe Payment Integration (VOLLSTÄNDIG)
**Bereits implementiert (basic):**
- ✅ POST /api/payments/create-intent
- ✅ POST /api/payments/webhook

**Zu erweitern:**
1. **Stripe Checkout Session** (statt Payment Intent):
```typescript
// Bessere UX mit Hosted Checkout
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'eur',
      product_data: {
        name: `${hotel.name} - ${roomCategory.name}`,
        description: `${nights} nights, ${numRooms} room(s)`,
        images: [hotel.images[0].url],
      },
      unit_amount: totalAmount * 100,
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/checkout?cancelled=true`,
  metadata: {
    bookingId: booking.id,
  },
});
```

2. **Success Page:**
```tsx
// /app/[locale]/booking-success/page.tsx
- Verify Checkout Session
- Display Booking Confirmation
- Send Email (TODO: Email Service)
```

**Geschätzte Zeit:** 2 Tage

---

### Phase 7: Housekeeping & Operations
**Ziel:** Hoteliers können Zimmer-Status managen

**UI: Housekeeping Board**
```
┌────────────────────────────────────────────────┐
│  Today: 14. November 2025                      │
├────────────────────────────────────────────────┤
│  Arrivals Today: 12    Departures Today: 8     │
├─────────┬──────────┬──────────┬────────────────┤
│  Room   │  Status  │  Guest   │  Actions       │
├─────────┼──────────┼──────────┼────────────────┤
│  101    │ 🟢 Clean │  -       │ [Assign]       │
│  102    │ 🔴 Dirty │ Doe, J.  │ [Clean Now]    │
│  103    │ 🟡 Inspect│ -       │ [Mark Clean]   │
│  104    │ ⚫ OOO    │  -       │ [Fix & Open]   │
└─────────┴──────────┴──────────┴────────────────┘
```

**Features:**
- Filter by Status (Clean, Dirty, Inspected, Out of Order, Occupied)
- Assign to Housekeeper
- Mark as Clean/Dirty
- Add Notes (e.g. "Broken TV, needs repair")
- Link to Booking (if occupied)

**API Routes:**
```typescript
GET    /api/hotels/[id]/housekeeping       - Get All Rooms
PUT    /api/hotels/[id]/housekeeping/[roomId] - Update Status
POST   /api/hotels/[id]/housekeeping       - Add Room (Manual)
```

**Geschätzte Zeit:** 2-3 Tage

---

### Phase 8: Reports & Analytics
**Dashboard KPIs:**
```typescript
interface DashboardStats {
  // Heutige Operationen
  todaysArrivals: number;
  todaysDepartures: number;
  currentOccupancy: number;  // Anzahl belegte Zimmer
  
  // Finanzielle Metriken
  revenue: number;                    // Gesamt-Umsatz (Monat/Jahr)
  occupancyRate: number;              // Belegungsrate (%)
  averageDailyRate: number;           // ADR (Durchschnittspreis)
  revPAR: number;                     // Revenue Per Available Room
  
  // Booking-Statistiken
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  noShows: number;
  
  // Zukünftige Buchungen
  upcomingBookings30Days: number;
  
  // Channel Performance
  directBookings: number;
  otaBookings: number;
}
```

**Charts:**
- Revenue Trend (Line Chart, letzte 12 Monate)
- Occupancy Rate by Room Category (Bar Chart)
- Booking Source Distribution (Pie Chart)
- Cancellation Rate Trend (Line Chart)

**Libraries:**
- **Chart.js** mit **react-chartjs-2**
- **Recharts** (Alternative, einfacher)

**API Route:**
```typescript
GET /api/hotels/[id]/dashboard?period=month|year

Response: DashboardStats (siehe oben)
```

**Geschätzte Zeit:** 3-4 Tage

---

## 📅 GESAMTZEITPLAN

| Phase | Beschreibung | Dauer | Abhängigkeiten |
|-------|-------------|-------|----------------|
| 1 | Hotel & Zimmer Onboarding | 3-4 Tage | - |
| 2 | Verfügbarkeit & Preise Management | 4-5 Tage | Phase 1 |
| 3 | Kalender-Ansicht | 5-6 Tage | Phase 2 |
| 4 | Verfügbarkeitssuche (Guest) | 3-4 Tage | Phase 2 |
| 5 | Buchungsprozess vervollständigen | 3-4 Tage | Phase 4 |
| 6 | Stripe Payment (vollständig) | 2 Tage | Phase 5 |
| 7 | Housekeeping & Operations | 2-3 Tage | Phase 1 |
| 8 | Reports & Analytics | 3-4 Tage | Alle |

**GESAMT: 25-34 Tage (5-7 Wochen)**

---

## 🚀 NÄCHSTE SCHRITTE (SOFORT STARTEN)

### 1. Phase 1 beginnen (Hotel & Zimmer Onboarding)

**Erste Implementierung:**
```bash
# API Routes erstellen
book-ax-web/src/app/api/
  hotels/
    [id]/
      rooms/
        route.ts          # GET, POST Room Categories
        [roomId]/
          route.ts        # GET, PUT, DELETE Room Category
      translations/
        route.ts          # POST Add/Update Hotel Translations
      images/
        route.ts          # POST Upload, GET List
        [imageId]/
          route.ts        # DELETE Image

# Frontend Pages
book-ax-web/src/app/[locale]/panel/
  hotels/
    new/
      page.tsx            # Hotel Onboarding Form
    [id]/
      page.tsx            # Hotel Details & Settings
      rooms/
        page.tsx          # Room Categories List
        new/
          page.tsx        # Create Room Category
        [roomId]/
          page.tsx        # Edit Room Category
      images/
        page.tsx          # Image Gallery & Upload

# Components
book-ax-web/src/components/panel/
  HotelForm.tsx           # Reusable Hotel Form
  RoomCategoryForm.tsx    # Reusable Room Form
  ImageUploader.tsx       # Drag & Drop Image Upload
```

**Zuerst:**
1. ✅ Hotels API erweitern (Translations, vollständige CRUD)
2. ✅ Room Categories API (vollständig)
3. ✅ Image Upload API (Supabase Storage Integration)
4. ✅ Hotel Onboarding Form (Frontend)
5. ✅ Room Categories Management (Frontend)

---

## 🔑 WICHTIGE TECHNISCHE DETAILS

### Inventory Management Pattern
```typescript
// Bei Booking Creation:
async function createBooking(data) {
  const transaction = await supabaseAdmin.transaction();
  
  try {
    // 1. Check Availability (alle Tage)
    const dates = getDatesBetween(checkInDate, checkOutDate);
    const { data: inventory } = await transaction
      .from('inventory')
      .select('*')
      .eq('room_category_id', roomCategoryId)
      .in('date', dates);
    
    // Verify: alle Tage verfügbar?
    const allAvailable = inventory.every(i => i.available_rooms >= numRooms);
    if (!allAvailable) throw new Error('Not available');
    
    // 2. Create Booking
    const booking = await transaction.from('bookings').insert({...});
    
    // 3. Decrement Inventory (alle Tage)
    await transaction
      .from('inventory')
      .update({ 
        available_rooms: supabase.raw('available_rooms - ?', [numRooms]) 
      })
      .eq('room_category_id', roomCategoryId)
      .in('date', dates);
    
    await transaction.commit();
    return booking;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

### Rate Calculation
```typescript
async function calculateBookingPrice(
  roomCategoryId: string,
  checkInDate: Date,
  checkOutDate: Date,
  numRooms: number
) {
  const dates = getDatesBetween(checkInDate, checkOutDate);
  
  const { data: rates } = await supabaseAdmin
    .from('rates')
    .select('date, price')
    .eq('room_category_id', roomCategoryId)
    .in('date', dates);
  
  // Fallback to base_price if rate not set
  const { data: roomCategory } = await supabaseAdmin
    .from('room_categories')
    .select('base_price')
    .eq('id', roomCategoryId)
    .single();
  
  let subtotal = 0;
  dates.forEach(date => {
    const rate = rates.find(r => r.date === date);
    const price = rate ? rate.price : roomCategory.base_price;
    subtotal += price * numRooms;
  });
  
  return subtotal;
}
```

### Supabase Storage für Images
```typescript
// Image Upload
async function uploadHotelImage(
  hotelId: string,
  file: File
): Promise<string> {
  const fileName = `${hotelId}/${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('hotel-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) throw error;
  
  // Get public URL
  const { data: publicURL } = supabase.storage
    .from('hotel-images')
    .getPublicUrl(fileName);
  
  return publicURL.publicUrl;
}
```

---

## 🎓 BEST PRACTICES

### 1. Transaktionen für Inventory
**IMMER** Transactions verwenden bei:
- Booking Creation (Check + Decrement)
- Booking Cancellation (Increment)
- Bulk Inventory Updates

### 2. Error Handling
```typescript
// Bei Inventory-Problemen
if (availableRooms < requestedRooms) {
  throw new ValidationError(
    `Only ${availableRooms} rooms available, ${requestedRooms} requested`
  );
}

// Bei Rate-Problemen
if (!rateExists) {
  // Fallback to base_price ODER
  throw new ValidationError('Rate not set for this period');
}
```

### 3. Performance
- **Index auf (room_category_id, date)** für rates & inventory ✅
- **Materialized View** für häufige Availability Queries (später)
- **Caching** für Calendar API (Redis, später)

### 4. Multi-Language
- Hotel & Room Category Namen IMMER in `translations` Tabellen
- Fallback: Wenn Translation fehlt, nutze EN

---

## 📞 KONTAKT & RESSOURCEN

- **Datenbank Schema:** `book-ax-web/database/schema.sql`
- **API Patterns:** `book-ax-web/src/lib/auth/middleware.ts`
- **Validation:** `book-ax-web/src/utils/validation.ts`
- **i18n Config:** `book-ax-web/src/i18n/config.ts`

---

**Ready to start! Phase 1 zuerst implementieren. 🚀**
