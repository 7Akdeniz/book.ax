# 🚀 Hotel PMS System - Implementierungsplan

## ⚠️ Wichtige Realität

**Dieses System ist RIESIG!** Es entspricht mehreren Enterprise-Produkten:
- **SiteMinder** (Wert: ~100 Mio. USD, 15+ Jahre Entwicklung)
- **Cloudbeds** (Wert: ~3 Mrd. USD, 10+ Jahre)
- **Mews** (Wert: ~1 Mrd. USD, 10+ Jahre)
- **IDeaS** (Gekauft von SAS für 400+ Mio. USD)

**Realistische Einschätzung:**
- **Vollständiges System:** 5-10 Entwickler, 12-24 Monate
- **MVP (Minimum Viable Product):** 2-3 Entwickler, 3-6 Monate
- **Kosten:** 500.000€ - 2.000.000€ für vollständige Entwicklung

---

## 🎯 Pragmatischer Ansatz

Da du bereits eine **Buchungsplattform** hast, können wir **schrittweise** erweitern:

### Was du BEREITS hast:
✅ Supabase Backend
✅ User Authentication  
✅ Hotel Search
✅ Booking System
✅ Basic Payment Flow

### Was wir HINZUFÜGEN:
1. **PMS Light** (Hotel-Verwaltung)
2. **Admin Dashboard** (für Hoteliers)
3. **Channel Manager Basis** (Booking.com)
4. **Einfache Preisanpassung**

---

## 📋 Phase 1: PMS Foundation (2-4 Wochen)

### 1.1 Erweiterte Datenbank
```sql
-- Property Management (Hotels verwalten)
CREATE TABLE properties_extended (
  id UUID PRIMARY KEY REFERENCES hotels(id),
  owner_id UUID REFERENCES users(id),
  settings JSONB,
  pms_enabled BOOLEAN DEFAULT true,
  subscription_plan VARCHAR(50),
  created_at TIMESTAMP
);

-- Staff Management
CREATE TABLE hotel_staff (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES hotels(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR(50), -- owner, manager, receptionist, housekeeper
  permissions JSONB,
  created_at TIMESTAMP
);

-- Room Inventory (erweitert)
CREATE TABLE room_inventory (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES hotels(id),
  room_type VARCHAR(100),
  room_number VARCHAR(50),
  floor INTEGER,
  status VARCHAR(50), -- available, occupied, cleaning, maintenance
  last_cleaned TIMESTAMP,
  assigned_to UUID REFERENCES hotel_staff(id)
);

-- Housekeeping
CREATE TABLE housekeeping_tasks (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES hotels(id),
  room_id UUID REFERENCES room_inventory(id),
  task_type VARCHAR(50), -- clean, inspect, maintenance
  assigned_to UUID REFERENCES hotel_staff(id),
  status VARCHAR(50), -- pending, in_progress, completed
  priority VARCHAR(20), -- low, medium, high, urgent
  notes TEXT,
  created_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Revenue Management (Basic)
CREATE TABLE daily_rates (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES hotels(id),
  room_type VARCHAR(100),
  date DATE,
  base_rate DECIMAL(10,2),
  dynamic_rate DECIMAL(10,2),
  min_rate DECIMAL(10,2),
  max_rate DECIMAL(10,2),
  occupancy_forecast DECIMAL(5,2),
  created_at TIMESTAMP
);
```

### 1.2 Admin Dashboard Features
```typescript
// Admin Features für Hoteliers

1. Property Overview
   - Total Rooms
   - Current Occupancy %
   - Today's Check-ins/Check-outs
   - Revenue Today/This Month
   
2. Reservation Management
   - Calendar View (Timeline)
   - Room Assignment Drag & Drop
   - Guest Details
   - Payment Status
   
3. Room Status Board
   - Clean/Dirty/Maintenance Grid
   - Assign Housekeeping Tasks
   - Update Room Status
   
4. Pricing Control
   - Set Base Rates
   - Apply Discounts
   - Season Pricing
   - Min/Max Limits
   
5. Reports
   - Occupancy Report
   - Revenue Report
   - Booking Source Report
```

---

## 📋 Phase 2: Channel Manager Lite (4-6 Wochen)

### 2.1 Booking.com Integration

```typescript
// Booking.com XML API Integration

// 1. Push Availability
async function pushAvailability(
  propertyId: string,
  roomType: string,
  date: Date,
  available: number
) {
  const xml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <request>
      <username>${BOOKING_COM_USER}</username>
      <password>${BOOKING_COM_PASS}</password>
      <hotel_id>${propertyId}</hotel_id>
      <room_id>${roomType}</room_id>
      <date>${date}</date>
      <availability>${available}</availability>
    </request>
  `;
  
  await axios.post('https://supply-xml.booking.com/availability', xml);
}

// 2. Push Rates
async function pushRates(
  propertyId: string,
  roomType: string,
  date: Date,
  price: number
) {
  const xml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <request>
      <hotel_id>${propertyId}</hotel_id>
      <room_id>${roomType}</room_id>
      <date>${date}</date>
      <rate>${price}</rate>
    </request>
  `;
  
  await axios.post('https://supply-xml.booking.com/rates', xml);
}

// 3. Receive Bookings
async function receiveBooking(bookingXml: string) {
  // Parse XML
  const booking = parseXML(bookingXml);
  
  // Create reservation in our system
  const reservation = await supabase
    .from('bookings')
    .insert({
      hotel_id: booking.hotel_id,
      guest_name: booking.customer.name,
      check_in: booking.checkin,
      check_out: booking.checkout,
      total_price: booking.price,
      source: 'booking.com',
      channel_booking_id: booking.reservation_id,
      commission: booking.commission
    });
    
  // Send confirmation
  await sendConfirmation(booking.reservation_id);
  
  // Update availability
  await updateAvailability(booking.hotel_id, booking.room_type);
}
```

### 2.2 Channel Manager Database
```sql
-- Channel Configuration
CREATE TABLE channel_configurations (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES hotels(id),
  channel_name VARCHAR(100), -- booking.com, expedia, airbnb
  credentials JSONB ENCRYPTED,
  is_active BOOLEAN,
  auto_sync BOOLEAN,
  sync_frequency INTEGER, -- minutes
  last_sync TIMESTAMP
);

-- Channel Sync Log
CREATE TABLE channel_sync_log (
  id UUID PRIMARY KEY,
  config_id UUID REFERENCES channel_configurations(id),
  sync_type VARCHAR(50), -- availability, rate, booking
  direction VARCHAR(20), -- push, pull
  status VARCHAR(50), -- success, error
  details JSONB,
  created_at TIMESTAMP
);
```

---

## 📋 Phase 3: Simple Revenue Management (2-3 Wochen)

### 3.1 Automatic Price Adjustment

```typescript
// Simple Dynamic Pricing Algorithm

async function calculateDynamicPrice(
  propertyId: string,
  roomType: string,
  date: Date
): Promise<number> {
  // Get base price
  const basePrice = await getBasePrice(propertyId, roomType);
  
  // Get current occupancy for that date
  const occupancy = await getCurrentOccupancy(propertyId, date);
  
  // Get days until check-in
  const daysUntil = Math.floor(
    (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Calculate multipliers
  let price = basePrice;
  
  // Occupancy-based pricing
  if (occupancy > 80) {
    price *= 1.3; // +30% wenn fast voll
  } else if (occupancy > 60) {
    price *= 1.15; // +15% bei guter Auslastung
  } else if (occupancy < 30) {
    price *= 0.85; // -15% bei niedriger Auslastung
  }
  
  // Lead time pricing
  if (daysUntil <= 3) {
    price *= 1.2; // Last Minute +20%
  } else if (daysUntil >= 60) {
    price *= 0.9; // Early Bird -10%
  }
  
  // Weekend/Weekday
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 5 || dayOfWeek === 6) { // Fr/Sa
    price *= 1.1; // Weekend +10%
  }
  
  // Apply min/max limits
  const minPrice = basePrice * 0.7;
  const maxPrice = basePrice * 2.0;
  
  price = Math.max(minPrice, Math.min(maxPrice, price));
  
  return Math.round(price * 100) / 100;
}

// Auto-Update Prices Daily
async function autoUpdatePrices() {
  const properties = await getActiveProperties();
  
  for (const property of properties) {
    const roomTypes = await getRoomTypes(property.id);
    
    for (const roomType of roomTypes) {
      // Update prices for next 90 days
      for (let i = 0; i < 90; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        const newPrice = await calculateDynamicPrice(
          property.id,
          roomType.id,
          date
        );
        
        // Save to database
        await saveDynamicRate(property.id, roomType.id, date, newPrice);
        
        // Push to channels
        await pushRateToChannels(property.id, roomType.id, date, newPrice);
      }
    }
  }
}

// Run daily at 2 AM
cron.schedule('0 2 * * *', autoUpdatePrices);
```

---

## 🎯 Minimum Viable Product (MVP)

### Was WIR JETZT bauen können (6-8 Wochen):

#### 1. **Admin Panel für Hoteliers**
```
Features:
✅ Property Management (Hotel-Profil)
✅ Room Inventory Management
✅ Reservation Calendar (Timeline-View)
✅ Room Status Board (Housekeeping)
✅ Guest List & Details
✅ Basic Reports (Occupancy, Revenue)
✅ Price Management (Base Rates)
```

#### 2. **Booking.com Integration**
```
Features:
✅ One OTA Connection (Booking.com)
✅ 2-Way Sync (Availability + Rates)
✅ Receive Bookings from Booking.com
✅ Auto-Update Inventory
✅ Commission Tracking
```

#### 3. **Simple Dynamic Pricing**
```
Features:
✅ Occupancy-based Pricing
✅ Lead Time Pricing
✅ Weekend Premium
✅ Min/Max Limits
✅ Manual Override
✅ Price Calendar View
```

#### 4. **Mobile App (Hotel Staff)**
```
Features:
✅ Today's Check-ins/Check-outs
✅ Room Status Update
✅ Housekeeping Tasks
✅ Push Notifications
✅ Quick Guest Lookup
```

---

## 📱 Konkrete Implementierung

### Schritt 1: Neue Screens erstellen

```typescript
// Admin Screens:
1. AdminDashboardScreen.tsx - Overview
2. ReservationCalendarScreen.tsx - Bookings Timeline
3. RoomStatusScreen.tsx - Housekeeping Board
4. PriceManagementScreen.tsx - Rate Calendar
5. ReportsScreen.tsx - Analytics
6. SettingsScreen.tsx - Property Settings

// Staff Screens:
7. StaffDashboardScreen.tsx - Today's Tasks
8. CheckInScreen.tsx - Quick Check-in
9. HousekeepingScreen.tsx - Room Cleaning
```

### Schritt 2: API Services

```typescript
// PMS Services:
pmsService.ts - Property Management
reservationService.ts - Booking Management
housekeepingService.ts - Room Status
revenueService.ts - Pricing

// Channel Services:
channelService.ts - Channel Framework
bookingComService.ts - Booking.com Integration
```

### Schritt 3: Background Jobs

```typescript
// Cron Jobs:
- Sync channels every 15 minutes
- Update prices daily at 2 AM
- Generate reports daily at 6 AM
- Send booking reminders
- Auto-assign housekeeping tasks
```

---

## 💰 Kosten & Ressourcen

### Development (MVP):
- **Zeit:** 6-8 Wochen
- **Entwickler:** 1-2 Full-time
- **Kosten:** 15.000€ - 30.000€

### Third-Party Services (Monatlich):
- Supabase Pro: 25€
- Booking.com API: Gratis (Provision)
- SendGrid (Email): 15€
- Twilio (SMS): 20€
- Server (AWS): 50€
**Total:** ~110€/Monat

### Pro Property (Abo-Modell):
- Starter: 49€/Monat
- Pro: 149€/Monat
- Enterprise: 399€/Monat

---

## ✅ Nächste Schritte

### Option A: MVP starten (EMPFOHLEN)
```
1. Erweitere Datenbank-Schema (1 Tag)
2. Admin Dashboard UI (1 Woche)
3. Reservation Management (1 Woche)
4. Booking.com Integration (2 Wochen)
5. Simple Pricing (1 Woche)
6. Testing & Deployment (1 Woche)
```

### Option B: Vollständiges System
```
1. Gründe Firma
2. Stelle Team (5-10 Entwickler)
3. Fundraising (500k-2M€)
4. 12-24 Monate Entwicklung
5. Enterprise-System wie Cloudbeds
```

---

## 🤔 Meine Empfehlung

**START SMALL, THINK BIG:**

1. **Jetzt:** Baue das MVP (Admin Panel + Booking.com)
2. **Monat 3:** Add 2-3 weitere Channels
3. **Monat 6:** Advanced Pricing
4. **Monat 9:** Mobile Apps
5. **Jahr 2:** Enterprise Features

**Fokus:** Hotels mit 10-50 Zimmern (Mittelstand)

Soll ich mit **Phase 1 (Admin Dashboard)** konkret anfangen? 🚀
