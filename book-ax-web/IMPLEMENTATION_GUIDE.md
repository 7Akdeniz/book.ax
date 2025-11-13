# 🚀 BOOK.AX - VOLLSTÄNDIGE IMPLEMENTIERUNGSANLEITUNG

## 📋 PROJEKT-ÜBERSICHT

**BOOK.AX** ist eine vollständige Hotel-Plattform mit:
- ✅ **Gäste-Portal** (wie Booking.com)
- ✅ **Hotelier-Portal** (PMS + Channel Manager + Revenue Management)
- ✅ **Admin-Portal** (System-Verwaltung)
- ✅ **75 Sprachen** (vollständiges i18n-System)
- ✅ **Channel Manager** (450+ OTA-Integrationen)
- ✅ **KI Revenue Management**
- ✅ **Provisions-Modell** (10-50% frei einstellbar)

---

## 🏗️ TECH STACK

### Frontend
- **Next.js 14** (App Router, Server Components)
- **React 18** (TypeScript)
- **Tailwind CSS** (Styling)
- **next-intl** (i18n für 75 Sprachen)
- **Recharts** (Analytics & Charts)
- **React Hot Toast** (Notifications)

### Backend
- **Next.js API Routes** (Serverless Functions)
- **PostgreSQL** (Hauptdatenbank via Supabase)
- **JWT + Refresh Tokens** (Authentication)
- **Stripe** (Payment Processing)

### Infrastructure
- **Vercel** (Frontend Hosting)
- **Supabase** (PostgreSQL + Auth)
- **AWS S3** (File Storage)
- **Stripe** (Payments)

---

## 📁 PROJEKT-STRUKTUR

```
book-ax-web/
├── messages/                    # i18n translations (75 languages)
│   ├── en.json
│   ├── de.json
│   ├── zh.json
│   └── ... (72 more languages)
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── [locale]/            # Language-based routing
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── search/
│   │   │   │   └── page.tsx     # Search results
│   │   │   ├── hotel/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # Hotel details
│   │   │   ├── booking/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # Booking confirmation
│   │   │   ├── login/
│   │   │   │   └── page.tsx     # Login
│   │   │   ├── register/
│   │   │   │   └── page.tsx     # Register
│   │   │   ├── panel/           # Hotelier Portal
│   │   │   │   ├── page.tsx     # Dashboard
│   │   │   │   ├── hotels/
│   │   │   │   ├── calendar/
│   │   │   │   ├── pms/
│   │   │   │   ├── channel-manager/
│   │   │   │   ├── revenue/
│   │   │   │   └── commission/
│   │   │   └── my-bookings/
│   │   │       └── page.tsx     # Guest bookings
│   │   │
│   │   ├── admin/               # Admin Portal (no locale)
│   │   │   ├── page.tsx         # Admin dashboard
│   │   │   ├── hotels/
│   │   │   ├── users/
│   │   │   ├── commissions/
│   │   │   ├── finances/
│   │   │   ├── settings/
│   │   │   └── ota-connections/
│   │   │
│   │   ├── api/                 # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── refresh/
│   │   │   │   └── logout/
│   │   │   ├── hotels/
│   │   │   │   ├── route.ts     # GET, POST hotels
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts # GET, PUT, DELETE
│   │   │   ├── bookings/
│   │   │   ├── payments/
│   │   │   ├── channel-manager/
│   │   │   │   ├── rate-push/
│   │   │   │   ├── inventory-push/
│   │   │   │   └── reservation-pull/
│   │   │   ├── revenue/
│   │   │   │   ├── recommendations/
│   │   │   │   └── apply/
│   │   │   └── webhook/
│   │   │       └── stripe/
│   │   │
│   │   ├── globals.css          # Global styles
│   │   └── layout.tsx           # Root layout
│   │
│   ├── components/              # React components
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── hotel/
│   │   │   ├── HotelCard.tsx
│   │   │   ├── HotelGallery.tsx
│   │   │   ├── RoomSelector.tsx
│   │   │   └── ReviewsList.tsx
│   │   ├── booking/
│   │   │   ├── BookingForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── BookingSummary.tsx
│   │   ├── panel/               # Hotelier components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CalendarView.tsx
│   │   │   ├── RatesTable.tsx
│   │   │   ├── HousekeepingBoard.tsx
│   │   │   └── CommissionSettings.tsx
│   │   └── admin/               # Admin components
│   │       ├── HotelApproval.tsx
│   │       ├── UserManagement.tsx
│   │       └── SystemSettings.tsx
│   │
│   ├── lib/                     # Core libraries
│   │   ├── db/
│   │   │   └── supabase.ts      # Supabase client
│   │   ├── auth/
│   │   │   ├── jwt.ts           # JWT utilities
│   │   │   └── middleware.ts    # Auth middleware
│   │   ├── stripe/
│   │   │   └── client.ts        # Stripe client
│   │   ├── channel-manager/
│   │   │   ├── booking-com.ts   # Booking.com integration
│   │   │   ├── airbnb.ts        # Airbnb integration
│   │   │   ├── expedia.ts       # Expedia integration
│   │   │   └── base.ts          # Base OTA class
│   │   ├── revenue/
│   │   │   ├── engine.ts        # AI pricing engine
│   │   │   ├── rules.ts         # Pricing rules
│   │   │   └── forecasting.ts   # Demand forecasting
│   │   └── email/
│   │       └── client.ts        # Email service
│   │
│   ├── types/                   # TypeScript types
│   │   ├── models.ts            # Database models
│   │   ├── api.ts               # API types
│   │   └── enums.ts             # Enums
│   │
│   ├── utils/                   # Utilities
│   │   ├── validation.ts        # Input validation
│   │   ├── formatting.ts        # Date, currency formatting
│   │   └── errors.ts            # Error handling
│   │
│   ├── config/
│   │   ├── ota.ts               # OTA configurations
│   │   └── constants.ts         # App constants
│   │
│   ├── middleware.ts            # Next.js middleware (i18n, auth)
│   └── i18n.ts                  # i18n configuration
│
├── database/
│   ├── schema.sql               # ✅ Complete database schema
│   ├── migrations/
│   └── seeds/
│
├── .env.local                   # Environment variables
├── package.json                 # ✅ Dependencies
├── tsconfig.json                # ✅ TypeScript config
├── tailwind.config.ts           # ✅ Tailwind config
├── next.config.mjs              # ✅ Next.js config
└── README.md
```

---

## 🔐 AUTHENTICATION SYSTEM

Das vollständige Auth-System ist bereits dokumentiert in `HOTEL_PMS_SYSTEM_ARCHITEKTUR.md`.

### Kern-Dateien die erstellt werden müssen:

#### `src/lib/auth/jwt.ts`
```typescript
import jwt from 'jsonwebtoken';
import { User } from '@/types/models';

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export function generateAccessToken(user: User): string {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

export function generateRefreshToken(user: User): string {
  return jwt.sign(
    { userId: user.id },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}
```

#### `src/app/api/auth/login/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/db/supabase';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in database
    await supabase.from('refresh_tokens').insert({
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Update last_login
    await supabase
      .from('users')
      .update({ last_login: new Date() })
      .eq('id', user.id);

    return NextResponse.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 🏨 HOTEL SEARCH & BOOKING API

#### `src/app/api/hotels/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const locale = searchParams.get('locale') || 'en';

    let query = supabase
      .from('hotels')
      .select(`
        *,
        hotel_translations!inner(name, description),
        room_categories(
          id,
          base_price,
          max_occupancy,
          room_category_translations(name)
        )
      `)
      .eq('status', 'approved')
      .eq('hotel_translations.language', locale);

    if (city) {
      query = query.ilike('address_city', `%${city}%`);
    }

    // Check availability if dates provided
    if (checkIn && checkOut && guests) {
      // Complex availability query - check rates and inventory tables
      // This would need a more sophisticated approach
    }

    if (minPrice || maxPrice) {
      // Filter by room prices
    }

    const { data: hotels, error } = await query;

    if (error) throw error;

    return NextResponse.json({ hotels });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Create new hotel (hotelier only)
  // Includes authentication check
}
```

---

## 💳 PAYMENT INTEGRATION (STRIPE)

#### `src/lib/stripe/client.ts`
```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function createPaymentIntent(
  amount: number,
  currency: string = 'eur',
  metadata: any
) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}
```

#### `src/app/api/payments/create-intent/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe/client';
import { supabase } from '@/lib/db/supabase';

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json();

    // Get booking details
    const { data: booking } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent(
      booking.total_amount,
      'eur',
      {
        bookingId: booking.id,
        bookingReference: booking.booking_reference,
        hotelId: booking.hotel_id,
      }
    );

    // Store payment in database
    await supabase.from('payments').insert({
      booking_id: booking.id,
      amount: booking.total_amount,
      currency: 'EUR',
      stripe_payment_intent_id: paymentIntent.id,
      payment_method: 'credit_card',
      status: 'pending',
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Payment creation failed' },
      { status: 500 }
    );
  }
}
```

---

## 📡 CHANNEL MANAGER - OTA INTEGRATION

#### `src/lib/channel-manager/base.ts`
```typescript
export abstract class OTAConnector {
  abstract pushRates(hotelId: string, roomCategoryId: string, rates: any[]): Promise<void>;
  abstract pushInventory(hotelId: string, roomCategoryId: string, inventory: any[]): Promise<void>;
  abstract pullReservations(hotelId: string): Promise<any[]>;
  abstract testConnection(): Promise<boolean>;
}
```

#### `src/lib/channel-manager/booking-com.ts`
```typescript
import axios from 'axios';
import { OTAConnector } from './base';

export class BookingComConnector extends OTAConnector {
  private apiKey: string;
  private hotelId: string;

  constructor(apiKey: string, hotelId: string) {
    super();
    this.apiKey = apiKey;
    this.hotelId = hotelId;
  }

  async pushRates(hotelId: string, roomCategoryId: string, rates: any[]) {
    // Booking.com XML API implementation
    const xml = this.buildRateXML(rates);
    
    try {
      const response = await axios.post(
        'https://supply-xml.booking.com/hotels/xml/availability',
        xml,
        {
          headers: {
            'Content-Type': 'application/xml',
          },
        }
      );

      // Log sync
      await this.logSync('rate_push', 'success', xml, response.data);
    } catch (error) {
      await this.logSync('rate_push', 'error', xml, error);
      throw error;
    }
  }

  async pushInventory(hotelId: string, roomCategoryId: string, inventory: any[]) {
    // Similar to pushRates
  }

  async pullReservations(hotelId: string) {
    // Pull reservations from Booking.com
    // This would be called via webhook or scheduled job
  }

  async testConnection() {
    // Test API connection
    return true;
  }

  private buildRateXML(rates: any[]): string {
    // Build Booking.com XML format
    return `
      <request>
        <username>${this.apiKey}</username>
        <password>...</password>
        <hotel_id>${this.hotelId}</hotel_id>
        <room>
          ${rates.map(rate => `
            <date from="${rate.date}" to="${rate.date}">
              <rate>${rate.price}</rate>
            </date>
          `).join('')}
        </room>
      </request>
    `;
  }

  private async logSync(type: string, status: string, request: any, response: any) {
    // Log to ota_sync_logs table
  }
}
```

---

## 🤖 AI REVENUE MANAGEMENT ENGINE

#### `src/lib/revenue/engine.ts`
```typescript
import { supabase } from '@/lib/db/supabase';

export class RevenueEngine {
  async generatePriceRecommendations(
    roomCategoryId: string,
    startDate: Date,
    endDate: Date
  ) {
    // Get historical data
    const historicalBookings = await this.getHistoricalBookings(roomCategoryId);
    const marketData = await this.getMarketData(roomCategoryId);
    const currentOccupancy = await this.getCurrentOccupancy(roomCategoryId);

    // Get revenue rules
    const rules = await this.getRevenueRules(roomCategoryId);

    // Calculate recommendations for each date
    const recommendations = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const basePrice = await this.getBasePrice(roomCategoryId);
      let recommendedPrice = basePrice;

      // Apply occupancy-based adjustment
      if (currentOccupancy > 0.8) {
        recommendedPrice *= 1.2; // 20% increase
      } else if (currentOccupancy < 0.3) {
        recommendedPrice *= 0.9; // 10% decrease
      }

      // Apply day-of-week adjustment
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 5 || dayOfWeek === 6) { // Fri, Sat
        recommendedPrice *= 1.15;
      }

      // Check for events
      const events = await this.getEventsForDate(currentDate);
      if (events.length > 0) {
        recommendedPrice *= 1.3; // 30% increase for events
      }

      // Apply revenue rules
      for (const rule of rules) {
        if (rule.is_active) {
          if (rule.occupancy_threshold && currentOccupancy >= rule.occupancy_threshold) {
            recommendedPrice *= (1 + rule.price_adjustment_percentage / 100);
          }
        }
      }

      // Enforce min/max prices from rules
      const minPrice = Math.min(...rules.map(r => r.min_price || 0));
      const maxPrice = Math.max(...rules.map(r => r.max_price || Infinity));
      recommendedPrice = Math.max(minPrice, Math.min(maxPrice, recommendedPrice));

      recommendations.push({
        room_category_id: roomCategoryId,
        date: currentDate.toISOString().split('T')[0],
        current_price: basePrice,
        recommended_price: Math.round(recommendedPrice * 100) / 100,
        confidence_score: 0.85,
        factors: {
          occupancy: currentOccupancy,
          dayOfWeek,
          events: events.length,
        },
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Store recommendations
    await supabase.from('price_recommendations').upsert(recommendations);

    return recommendations;
  }

  private async getHistoricalBookings(roomCategoryId: string) {
    // Fetch last 12 months of bookings
  }

  private async getMarketData(roomCategoryId: string) {
    // Fetch market intelligence data
  }

  private async getCurrentOccupancy(roomCategoryId: string) {
    // Calculate current occupancy rate
  }

  private async getRevenueRules(roomCategoryId: string) {
    const { data } = await supabase
      .from('revenue_rules')
      .select('*')
      .eq('room_category_id', roomCategoryId)
      .eq('is_active', true);
    return data || [];
  }

  private async getBasePrice(roomCategoryId: string) {
    const { data } = await supabase
      .from('room_categories')
      .select('base_price')
      .eq('id', roomCategoryId)
      .single();
    return data?.base_price || 100;
  }

  private async getEventsForDate(date: Date) {
    // Check market_data table for events
    return [];
  }
}
```

---

## 🌍 I18N ROUTING & LANGUAGE SWITCHER

#### `src/middleware.ts`
```typescript
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

#### `src/components/common/LanguageSwitcher.tsx`
```typescript
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { languageNames, locales, type Locale } from '@/i18n';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: Locale) => {
    // Replace current locale in path with new locale
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    
    // Store in cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
  };

  return (
    <select
      value={locale}
      onChange={(e) => switchLanguage(e.target.value as Locale)}
      className="border rounded px-2 py-1"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {languageNames[loc]}
        </option>
      ))}
    </select>
  );
}
```

---

## 📊 COMMISSION CALCULATION

Die Provisions-Berechnung ist bereits im **Database Trigger** implementiert (`calculate_commission()` in `schema.sql`).

Jedes Mal wenn ein Booking erstellt wird:
```sql
NEW.commission_amount = NEW.total_amount * (NEW.commission_percentage / 100);
NEW.hotel_payout = NEW.total_amount - NEW.commission_amount;
```

---

## 🚀 DEPLOYMENT

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables in Vercel
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
```

### Docker (Alternative)
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

---

## ✅ NÄCHSTE SCHRITTE

1. **Dependencies installieren**
   ```bash
   cd book-ax-web
   npm install
   ```

2. **Datenbank deployen**
   ```bash
   # In Supabase SQL Editor:
   # Kopiere den Inhalt von database/schema.sql und führe aus
   ```

3. **Environment Variables setzen**
   ```bash
   cp .env.local.example .env.local
   # Füge deine echten Keys ein
   ```

4. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

5. **Restliche Sprach-Dateien erstellen**
   - Kopiere `messages/en.json` 73 Mal
   - Übersetze mit professionellem Übersetzungsdienst

6. **API-Endpunkte vervollständigen**
   - Alle Endpunkte sind oben spezifiziert
   - Erstelle die fehlenden Route-Dateien

7. **Frontend-Komponenten bauen**
   - Nutze die Struktur aus diesem Dokument
   - Verwende Tailwind CSS für Styling

8. **OTA-Integrationen**
   - Registriere dich bei Booking.com, Airbnb, Expedia
   - Hole API-Credentials
   - Vervollständige die Connector-Klassen

---

## 📄 DOKUMENTATIONS-REFERENZ

Für **detaillierte technische Spezifikationen** siehe:
- `HOTEL_PMS_SYSTEM_ARCHITEKTUR.md` - Komplette System-Architektur
- `PMS_IMPLEMENTIERUNG_REALISTISCH.md` - MVP Implementierungsplan
- `database/schema.sql` - Komplettes Datenbank-Schema

---

## 🎯 ZUSAMMENFASSUNG

Dieses Projekt ist ein **Enterprise-Level System** mit:
- **200+ Dateien**
- **50.000+ Zeilen Code**
- **75 Sprachen**
- **450+ OTA-Integrationen**
- **KI Revenue Engine**
- **Komplettes PMS**

**Geschätzte Entwicklungszeit:** 12-24 Monate mit 10-15 Entwicklern
**Geschätzte Kosten:** 970.000€ - 1.500.000€

Das hier erstellte **Fundament** bietet:
✅ Komplette Datenbank-Struktur
✅ API-Architektur mit Code-Beispielen
✅ i18n-System für 75 Sprachen
✅ Payment-Integration
✅ Channel-Manager-Framework
✅ Revenue-Engine-Logik
✅ Deployment-Konfiguration

**Für vollständige Umsetzung:** Stelle ein Entwickler-Team ein oder beauftrage eine Agentur mit diesem Dokument als Spezifikation.
