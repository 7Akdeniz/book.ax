---
applyTo: '**'
---

# 🚀 BOOK.AX WEB APP - AI CODING INSTRUCTIONS

## 📋 PROJEKT STATUS (Stand: 14. November 2025)

**BOOK.AX Web App** ist eine vollständige Hotel-Buchungsplattform mit:
- ✅ **Next.js 14 App Router** mit TypeScript
- ✅ **50 Sprachen** (vollständig implementiert mit next-intl)
- ✅ **JWT Authentication** (Login, Register, Refresh Token)
- ✅ **Supabase PostgreSQL** mit vollständigem Schema
- ✅ **Stripe Payment Integration**
- ✅ **Hotels, Bookings, Payments APIs** (teilweise implementiert)
- ✅ **Responsive UI** mit Tailwind CSS
- ✅ **Deployed auf Vercel**: https://book.ax

---

## 🏗️ TECH STACK

### Frontend
- **Next.js 14** (App Router, Server/Client Components)
- **React 18** mit TypeScript 5
- **Tailwind CSS** für Styling
- **next-intl** für i18n (50 Sprachen)
- **React Hot Toast** für Notifications

### Backend & Database
- **Next.js API Routes** (Serverless Functions)
- **Supabase** (PostgreSQL + Auth Helpers)
- **JWT** (Access + Refresh Tokens)
- **bcryptjs** (Password Hashing)

### Payment & Services
- **Stripe** (Payment Processing)
- **Zod** (Validation)
- **date-fns** (Date Formatting)

---

## 📁 PROJEKT-STRUKTUR (Was existiert bereits)

```
book-ax-web/
├── messages/                    # ✅ 50 Sprachen vollständig (en, de, zh, hi, es, ar, fr, tr, ru, ...)
│   ├── en.json                  # ✅ Vollständige Übersetzungen
│   ├── de.json
│   └── ... (48 weitere)
│
├── database/
│   ├── schema.sql               # ✅ Vollständiges Schema (17 Tabellen)
│   └── performance-indexes.sql  # ✅ Performance Optimierung
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── [locale]/            # ✅ Language Routing
│   │   │   ├── page.tsx         # ✅ Homepage
│   │   │   ├── search/          # ✅ Hotel Search
│   │   │   ├── hotel/[id]/      # ✅ Hotel Details
│   │   │   ├── login/           # ✅ Login Page
│   │   │   ├── register/        # ✅ Register Page
│   │   │   ├── my-bookings/     # ✅ Guest Bookings
│   │   │   ├── panel/           # ✅ Hotelier Portal (Basic)
│   │   │   ├── forgot-password/ # ✅ Password Reset
│   │   │   ├── terms/           # ✅ Terms & Conditions
│   │   │   ├── privacy/         # ✅ Privacy Policy
│   │   │   └── help/            # ✅ Help Center
│   │   │
│   │   ├── api/                 # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── login/       # ✅ POST - JWT Login
│   │   │   │   ├── register/    # ✅ POST - User Registration
│   │   │   │   ├── refresh/     # ✅ POST - Refresh Token
│   │   │   │   ├── logout/      # ✅ POST - Logout
│   │   │   │   └── forgot-password/ # ✅ POST - Password Reset
│   │   │   ├── hotels/
│   │   │   │   ├── route.ts     # ✅ GET, POST Hotels
│   │   │   │   └── [id]/route.ts # ✅ GET, PUT, DELETE
│   │   │   ├── bookings/
│   │   │   │   ├── route.ts     # ✅ GET, POST Bookings
│   │   │   │   └── [id]/route.ts # ✅ GET, PUT, DELETE
│   │   │   └── payments/
│   │   │       ├── create-intent/ # ✅ POST - Stripe Payment Intent
│   │   │       └── webhook/      # ✅ POST - Stripe Webhook
│   │   │
│   │   ├── globals.css          # ✅ Global Styles
│   │   └── layout.tsx           # ✅ Root Layout
│   │
│   ├── components/              # React Components
│   │   ├── common/
│   │   │   ├── Header.tsx       # ✅ Main Header mit i18n
│   │   │   ├── Footer.tsx       # ✅ Footer mit i18n
│   │   │   └── LanguageSwitcher.tsx # ✅ 50 Sprachen Switcher
│   │   ├── home/                # ✅ Homepage Components
│   │   ├── hotel/               # ✅ Hotel Components
│   │   └── seo/                 # ✅ SEO Components
│   │
│   ├── lib/                     # Core Libraries
│   │   ├── auth/
│   │   │   ├── jwt.ts           # ✅ JWT Token Management
│   │   │   └── middleware.ts    # ✅ Auth Middleware (verifyAuth, requireRole)
│   │   ├── db/
│   │   │   └── supabase.ts      # ✅ Supabase Client (Browser + Admin)
│   │   └── env.ts               # ✅ Environment Variables Validation
│   │
│   ├── types/
│   │   └── models.ts            # ✅ TypeScript Models (User, Hotel, Booking, etc.)
│   │
│   ├── utils/
│   │   ├── validation.ts        # ✅ Zod Schemas (Login, Register, etc.)
│   │   ├── errors.ts            # ✅ Error Handling (ValidationError, AuthError)
│   │   └── formatting.ts        # ✅ Date, Currency Formatting
│   │
│   ├── i18n/
│   │   ├── config.ts            # ✅ 50 Sprachen Config
│   │   └── request.ts           # ✅ next-intl Request Config
│   │
│   └── middleware.ts            # ✅ Next.js Middleware (i18n Routing)
│
├── .env.local                   # ⚠️ Nicht in Git (siehe .env.example)
├── package.json                 # ✅ Dependencies
├── tsconfig.json                # ✅ TypeScript Config
├── tailwind.config.ts           # ✅ Tailwind Config
└── next.config.mjs              # ✅ Next.js Config
```

---

## 🎯 WAS FEHLT NOCH (Entwicklungsprioritäten)

### 1. **Hotelier Portal (PMS)**
- [ ] Dashboard mit Analytics
- [ ] Kalender-Ansicht (Reservierungen)
- [ ] Preise & Verfügbarkeit Management
- [ ] Housekeeping Board
- [ ] Provisions-Einstellungen (10-50%)

### 2. **Admin Portal**
- [ ] Hotel-Genehmigungen
- [ ] User-Management
- [ ] Finanz-Reports
- [ ] System-Einstellungen
- [ ] OTA Connection Management

### 3. **Channel Manager (OTA Integration)**
- [ ] Booking.com Connector
- [ ] Airbnb Connector
- [ ] Expedia Connector
- [ ] Rate & Inventory Push
- [ ] Reservation Pull

### 4. **Revenue Management (AI Engine)**
- [ ] Preisempfehlungen-Engine
- [ ] Demand Forecasting
- [ ] Dynamic Pricing Rules
- [ ] Market Data Integration

### 5. **Zusätzliche Features**
- [ ] Email Service (Bestätigungen, Notifications)
- [ ] SMS Notifications
- [ ] Reviews & Ratings System
- [ ] Loyalty Program
- [ ] Multi-Currency Support (aktuell nur EUR)

---

## 🔐 AUTHENTICATION PATTERN

### Implementiertes System
```typescript
// JWT Access Token (15 Minuten)
// JWT Refresh Token (7 Tage)
// Stored in HTTP-Only Cookies + Database

// Login Flow
POST /api/auth/login
→ Verify Email + Password (bcrypt)
→ Generate Access Token + Refresh Token
→ Store Refresh Token in DB
→ Return Tokens + User Data

// Protected Routes
verifyAuth(async (req: AuthenticatedRequest) => {
  // req.user ist verfügbar
  // req.userId, req.userRole automatisch gesetzt
})

// Role-based Access
requireHotelier(async (req) => { ... })
requireAdmin(async (req) => { ... })
```

### Environment Variables (Required)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# JWT (min. 32 Zeichen!)
JWT_SECRET=xxx...
JWT_REFRESH_SECRET=xxx...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App
NEXT_PUBLIC_APP_URL=https://book.ax
```

---

## 🌍 I18N SYSTEM

### Wie es funktioniert
```typescript
// 50 Sprachen in locales Array (config.ts)
// Top 9: de, en, zh, hi, es, ar, fr, tr, ru
// + 41 weitere alphabetisch sortiert

// Routing: /{locale}/path
// Beispiel: /de/hotel/123, /en/hotel/123

// In Components:
import { useTranslations } from 'next-intl';

const t = useTranslations('header');
<h1>{t('welcome')}</h1>

// In Server Components:
import { getTranslations } from 'next-intl/server';

const t = await getTranslations('header');
```

### Neue Übersetzungen hinzufügen
1. Füge Key in `messages/en.json` hinzu
2. Repliziere in alle anderen 49 Sprach-Dateien
3. Verwende professionellen Übersetzungsdienst (DeepL, Google Translate API)

---

## 📊 DATABASE SCHEMA (Supabase)

**Vollständig implementiert in `database/schema.sql`**

### Kern-Tabellen
- `users` - User accounts (guest, hotelier, admin)
- `hotels` - Hotel properties
- `hotel_translations` - Multi-language hotel data
- `room_categories` - Room types (Standard, Deluxe, etc.)
- `room_category_translations` - Multi-language room data
- `bookings` - Guest bookings mit automatischer Provisions-Berechnung
- `payments` - Stripe payments
- `refresh_tokens` - JWT Refresh Tokens
- `hotel_images` - Hotel & Room images
- `rates` - Dynamic pricing (pro Datum)
- `inventory` - Availability (pro Datum)

### Wichtige Trigger
```sql
-- Automatische Provisions-Berechnung bei Booking
CREATE TRIGGER trigger_calculate_commission
BEFORE INSERT ON bookings
FOR EACH ROW EXECUTE FUNCTION calculate_commission();

-- commission_amount = total_amount * (commission_percentage / 100)
-- hotel_payout = total_amount - commission_amount
```

---

## 💳 STRIPE INTEGRATION

```typescript
// Payment Flow
1. Guest wählt Hotel & Zimmer
2. POST /api/payments/create-intent { bookingId }
3. Backend erstellt Stripe PaymentIntent
4. Frontend zeigt Stripe Checkout
5. Guest zahlt
6. Webhook /api/payments/webhook aktualisiert Booking Status
7. Email-Bestätigung (TODO)
```

### Webhook Events
```typescript
// payment_intent.succeeded → Booking auf 'confirmed'
// payment_intent.payment_failed → Booking auf 'failed'
// charge.refunded → Booking auf 'cancelled'
```

---

## 🎨 STYLING GUIDELINES

### Tailwind CSS Best Practices
```typescript
// ✅ DO: Nutze Tailwind Classes
<div className="bg-white shadow-lg rounded-lg p-6">

// ❌ DON'T: Keine inline styles
<div style={{ background: 'white' }}>

// ✅ DO: Custom Colors in tailwind.config.ts
colors: {
  primary: { 600: '#0066cc', 700: '#0052a3' },
}

// ✅ DO: Responsive Design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Component Patterns
```typescript
// ✅ Server Component (default)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// ✅ Client Component (mit 'use client')
'use client';
export function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={...}>...</button>;
}
```

---

## 🚀 DEPLOYMENT (Vercel)

### Live URL
https://book.ax (via Vercel)

### Environment Variables in Vercel Dashboard setzen
Alle Env Vars aus `.env.local` müssen im Vercel Dashboard konfiguriert sein:
- Production, Preview, Development aktivieren

### Build Command
```bash
npm run build
```

### Vercel Configuration (vercel.json)
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**WICHTIG**: Root Directory = `book-ax-web` im Vercel Dashboard!

---

## 🧪 TESTING

```bash
# Unit Tests (Jest)
npm test

# Type Check
npm run type-check

# Linting
npm run lint

# Development Server
npm run dev
```

---

## 📋 CODE GUIDELINES

### TypeScript
```typescript
// ✅ IMMER Types definieren
interface Props {
  userId: string;
  onSubmit: (data: FormData) => void;
}

// ✅ KEINE 'any'
// ❌ DON'T: data: any
// ✅ DO: data: unknown oder specific type

// ✅ Nutze Zod für Runtime Validation
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### Error Handling
```typescript
// ✅ Nutze Custom Errors aus utils/errors.ts
throw new ValidationError('Invalid email');
throw new AuthenticationError('Invalid credentials');
throw new NotFoundError('Hotel not found');

// ✅ In API Routes mit handleApiError
try {
  // ... API logic
} catch (error) {
  const { error: message, status } = handleApiError(error);
  return NextResponse.json({ error: message }, { status });
}
```

### API Route Pattern
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';

export const GET = verifyAuth(async (req: AuthenticatedRequest) => {
  try {
    // req.userId automatisch verfügbar
    const { data, error } = await supabaseAdmin
      .from('table')
      .select('*')
      .eq('user_id', req.userId);

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
});
```

### Component Pattern
```typescript
'use client'; // wenn State oder Events benötigt

import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface Props {
  title: string;
  onSubmit: () => void;
}

export function MyComponent({ title, onSubmit }: Props) {
  const t = useTranslations('common');
  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <button 
        onClick={onSubmit}
        disabled={loading}
        className="bg-primary-600 text-white px-4 py-2 rounded"
      >
        {t('submit')}
      </button>
    </div>
  );
}
```

---

## ⚠️ WICHTIGE REGELN

### Security
1. **NIEMALS** Secrets in Git committen
2. **IMMER** Environment Variables validieren (siehe `lib/env.ts`)
3. **IMMER** Input Validation mit Zod
4. **IMMER** verifyAuth für protected Routes
5. **NIEMALS** Supabase Admin Key im Client Code

### Performance
1. **IMMER** Next.js Image Component verwenden
2. **IMMER** Dynamic Imports für große Components
3. **IMMER** Database Indexes nutzen (siehe `performance-indexes.sql`)
4. **IMMER** React.memo() für teure Components

### i18n
1. **NIEMALS** Hardcoded Text im Code
2. **IMMER** useTranslations Hook nutzen
3. **IMMER** Neue Keys in ALLEN 50 Sprach-Dateien hinzufügen
4. **IMMER** Locale in URLs (`/${locale}/path`)

### Database
1. **IMMER** Supabase Admin für Server-Side Operations
2. **IMMER** RLS (Row Level Security) Policies prüfen
3. **NIEMALS** Admin Key im Client exponieren
4. **IMMER** Prepared Statements (Supabase macht das automatisch)

---

## 🎯 NÄCHSTE IMPLEMENTIERUNGS-SCHRITTE

### Priorität 1: Hotelier Portal vervollständigen
```bash
# Dateien erstellen:
src/app/[locale]/panel/
  ├── calendar/page.tsx           # Kalender mit Buchungen
  ├── rates/page.tsx              # Preise & Verfügbarkeit
  ├── housekeeping/page.tsx       # Housekeeping Board
  └── commission/page.tsx         # Provisions-Einstellungen

src/components/panel/
  ├── CalendarView.tsx
  ├── RatesTable.tsx
  ├── HousekeepingBoard.tsx
  └── CommissionSettings.tsx
```

### Priorität 2: Admin Portal
```bash
src/app/admin/                    # Ohne [locale]!
  ├── page.tsx                    # Dashboard
  ├── hotels/page.tsx             # Hotel Approvals
  ├── users/page.tsx              # User Management
  └── finances/page.tsx           # Finance Reports
```

### Priorität 3: Channel Manager
```bash
src/lib/channel-manager/
  ├── base.ts                     # Abstract OTA Class
  ├── booking-com.ts              # Booking.com Connector
  ├── airbnb.ts                   # Airbnb Connector
  └── expedia.ts                  # Expedia Connector

src/app/api/channel-manager/
  ├── rate-push/route.ts
  ├── inventory-push/route.ts
  └── reservation-pull/route.ts
```

### Priorität 4: Revenue Management
```bash
src/lib/revenue/
  ├── engine.ts                   # AI Pricing Engine
  ├── rules.ts                    # Pricing Rules
  └── forecasting.ts              # Demand Forecasting

src/app/api/revenue/
  ├── recommendations/route.ts
  └── apply/route.ts
```

---

## 📚 WICHTIGE DOKUMENTATIONS-REFERENZEN

- **Vollständige System-Architektur**: `HOTEL_PMS_SYSTEM_ARCHITEKTUR.md`
- **Implementation Guide**: `web_app_IMPLEMENTATION_GUIDE.md`
- **Database Schema**: `database/schema.sql`
- **Project Overview**: `.github/copilot-instructions.md`

---

## 🎓 FÜR AI ASSISTENTEN

**Wenn du Code generierst:**
1. ✅ Prüfe was bereits existiert (siehe Struktur oben)
2. ✅ Folge den TypeScript Patterns
3. ✅ Nutze bestehende Utilities (validation.ts, errors.ts)
4. ✅ Verwende i18n für ALLE Texte
5. ✅ Implementiere Error Handling mit handleApiError
6. ✅ Nutze Tailwind für Styling
7. ✅ Teste Authentication mit verifyAuth
8. ✅ Dokumentiere komplexe Logik

**Wenn du Fragen beantwortest:**
1. ✅ Referenziere existierenden Code
2. ✅ Zeige konkrete File Paths
3. ✅ Gib vollständige Code-Beispiele
4. ✅ Erkläre Zusammenhänge mit anderen Teilen

---

**Stand:** 14. November 2025  
**Version:** 1.0  
**Status:** ✅ Foundation Complete, 🚧 Advanced Features In Progress