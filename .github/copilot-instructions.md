# AI Coding Agent Instructions

## Projektkontext

Dies ist **Book.ax** - eine Multi-Platform Hotel-Buchungsplattform (ähnlich Booking.com):

### Zwei separate Projekte in einem Repository:

1. **React Native Mobile App** (Root-Verzeichnis)
   - iOS & Android Apps
   - Expo für Development
   - Für Hotel-Gäste unterwegs

2. **Next.js Web App** (`book-ax-web/`)
   - Responsive Web-Plattform
   - 50+ Sprachen Support
   - Deployed auf Vercel
   - Live: https://book-ax.vercel.app

**Gemeinsame Backend**: Beide Apps nutzen dieselbe Supabase Database

---

## Mobile App Architektur (React Native)

### Feature-basierte Struktur
- **Organisation**: Code ist nach Features organisiert (`src/features/*`)
- **Feature-Module**: `components/`, `screens/`, `hooks/`, `types.ts`, `slice.ts` (Redux)
- **Shared Code**: Wiederverwendbare Komponenten in `src/components/`, Utils in `src/utils/`

### State Management
- **Redux Toolkit** für globalen App-State (Auth, Buchungen, etc.)
- **React Context** für Theme und App-Konfiguration
- Verwende `useSelector` und `useDispatch` Hooks, nicht `connect()`

### Navigation
- **React Navigation v6** mit TypeScript
- Stack Navigator für Feature-Flows, Bottom Tabs für Hauptnavigation
- Typisierte Navigation: `RootStackParamList` in `src/navigation/types.ts`

### Mobile App starten
```bash
npm start              # Metro Bundler (Expo)
npm run ios            # iOS Simulator
npm run android        # Android Emulator
```

---

## Web App Architektur (Next.js)

### Projekt-Struktur
```
book-ax-web/
├── src/
│   ├── app/               # Next.js 14 App Router
│   │   └── [locale]/      # Multi-Language Routes
│   ├── components/        # React Components
│   │   ├── common/        # Shared Components (Header, Footer)
│   │   ├── home/          # Homepage Components
│   │   └── hotel/         # Hotel Components
│   ├── lib/               # Utilities & Configs
│   │   └── db/            # Supabase Client
│   ├── i18n/              # Internationalization
│   │   ├── config.ts      # Languages & Locales (50+ Sprachen)
│   │   └── request.ts     # next-intl Request Config
│   ├── middleware.ts      # Next.js Middleware (Language Detection)
│   └── types/             # TypeScript Types
├── messages/              # Translation Files (50+ .json)
│   ├── de.json
│   ├── en.json
│   └── ...
└── public/                # Static Assets
```

### Internationalization (i18n)
- **next-intl** für Multi-Language Support
- **50 Sprachen**: Top 9 (de, en, zh, hi, es, ar, fr, tr, ru) + 41 weitere
- **URL-basiert**: `/de`, `/en`, `/es`, etc.
- **Config**: `src/i18n/config.ts` (Locales, Language Names)
- **Request Config**: `src/i18n/request.ts` (verwendet `requestLocale` API)

```typescript
// i18n/config.ts - Language Configuration
export const locales = ['de', 'en', 'zh', 'hi', 'es', ...] as const;
export type Locale = (typeof locales)[number];
export const languageNames: Record<Locale, string> = { ... };

// i18n/request.ts - Next-Intl Request Config
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

### Styling & UI
- **Tailwind CSS** für Styling
- **Responsive Design**: Mobile-first Approach
- **Components**: Modular, wiederverwendbar
- **No inline styles**: Immer Tailwind Classes verwenden

### Web App starten
```bash
cd book-ax-web
npm run dev            # Development Server (localhost:3000)
npm run build          # Production Build
npm start              # Production Server
```

---

## Backend & Database

### Supabase Integration
- **Database**: PostgreSQL via Supabase
- **Auth**: Supabase Auth (Row Level Security)
- **Storage**: Supabase Storage für Bilder
- **Real-time**: Supabase Realtime (optional)

### Environment Variables
```bash
# Supabase (beide Projekte)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...  # Server-only!

# JWT Secrets (Web)
SUPABASE_JWT_SECRET=xxx

# App URLs
NEXT_PUBLIC_APP_URL=https://book-ax.vercel.app
```

### Supabase Client Pattern (Web)
```typescript
// src/lib/db/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Browser Client (mit RLS)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'placeholder',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
);

// Admin Client (bypasses RLS, server-only!)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'placeholder',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);
```

---

## Deployment & CI/CD

### Vercel (Web App)
- **Live URL**: https://book-ax.vercel.app
- **Auto-Deploy**: Jeder `git push` deployed automatisch
- **Dashboard**: https://vercel.com/bookax
- **Root Directory**: `book-ax-web` (wichtig!)

### Vercel Konfiguration
```json
// vercel.json (Root)
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**WICHTIG**: Im Vercel Dashboard muss **Root Directory = `book-ax-web`** gesetzt sein!

### Environment Variables in Vercel
- Alle Env Vars im Vercel Dashboard setzen
- **Production**, **Preview**, **Development** aktivieren
- NIEMALS Secrets in Git committen!

---

## TypeScript Patterns

### Mobile (React Native)
```typescript
// Komponenten mit React.FC
const HotelCard: React.FC<HotelCardProps> = ({hotel, onPress}) => { ... };

// Path Aliases
import {Button} from '@components/Button';
import {useAuth} from '@features/auth/hooks/useAuth';
```

### Web (Next.js)
```typescript
// Server Components (default in App Router)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Components (mit 'use client')
'use client';
export function InteractiveComponent() { ... }

// Typed Props
interface PageProps {
  params: { locale: string; id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
```

---

## Code-Qualität & Testing

### ESLint Konfiguration
- **Mobile**: `.eslintrc.mobile.js` (React Native Config)
- **Web**: `book-ax-web/.eslintrc.json` (Next.js Config)

```bash
# Mobile
npm run lint           # ESLint (Root)

# Web
cd book-ax-web
npm run lint           # Next.js ESLint
npm run type-check     # TypeScript Check
```

### Testing
```bash
# Mobile
npm test               # Jest

# Web
cd book-ax-web
npm test               # Jest (falls konfiguriert)
```

---

## Git & Repository

### Repository
- **GitHub**: https://github.com/7Akdeniz/book.ax
- **Owner**: 7Akdeniz
- **Branch Strategy**: `main` für Production

### Commit Messages (Best Practice)
```
feat: Add hotel booking flow
fix: Resolve i18n language detection
chore: Update dependencies
docs: Update README with deployment instructions
```

---

## Wichtige Dateien & Pfade

### Mobile App
```
src/
├── features/          # Feature-Module
├── components/        # Shared Components
├── navigation/        # Navigation Config
├── services/          # API Services
├── store/            # Redux Store
├── types/            # TypeScript Types
└── utils/            # Helper Functions
```

### Web App
```
book-ax-web/
├── src/app/[locale]/  # Multi-Language Pages
├── src/components/    # React Components
├── src/i18n/         # i18n Config (WICHTIG!)
├── src/lib/db/       # Supabase Client
├── messages/         # Translations (50+ Sprachen)
└── public/           # Static Files
```

---

## Häufige Probleme & Lösungen

### Mobile
- **Metro Cache**: `npm start -- --reset-cache`
- **iOS Pods**: `cd ios && pod install && cd ..`
- **Android Build**: `cd android && ./gradlew clean`

### Web
- **Build Error**: Prüfe Environment Variables in Vercel Dashboard
- **i18n Error**: Stelle sicher `src/i18n/request.ts` existiert
- **Vercel Root Directory**: MUSS auf `book-ax-web` gesetzt sein!

### Supabase
- **Missing Env Vars**: Verwende Placeholders zur Build-Zeit
- **RLS Errors**: Prüfe Row Level Security Policies
- **CORS**: Füge Domain zu Supabase Allowed Origins hinzu

---

## Performance Best Practices

### Mobile
- **FlatList** für lange Listen (mit `getItemLayout`)
- **React.memo()** für teure Komponenten
- **Image-Optimierung**: `react-native-fast-image`

### Web
- **Next.js Image**: `<Image />` statt `<img>`
- **Dynamic Imports**: Code-Splitting für große Components
- **Static Generation**: Nutze `generateStaticParams` wo möglich

---

## Nützliche Befehle

### Mobile
```bash
npm start              # Start Expo
npm run ios            # iOS Simulator
npm run android        # Android Emulator
npm run lint           # ESLint
```

### Web
```bash
cd book-ax-web
npm run dev            # Development (localhost:3000)
npm run build          # Production Build
npm start              # Production Server
npm run lint           # ESLint
npm run type-check     # TypeScript
```

### Deployment
```bash
git add .
git commit -m "feat: Add new feature"
git push origin main   # Auto-Deploy zu Vercel
```

---

## Wichtige Links & Ressourcen

| Ressource | Link |
|-----------|------|
| **Live Web App** | https://book-ax.vercel.app |
| **Vercel Dashboard** | https://vercel.com/bookax |
| **GitHub Repo** | https://github.com/7Akdeniz/book.ax |
| **Supabase** | https://supabase.com/dashboard |
| **Next.js Docs** | https://nextjs.org/docs |
| **Expo Docs** | https://docs.expo.dev |

---

## Sicherheit & Best Practices

### Niemals committen:
- `.env` Files mit Secrets
- API Keys, Tokens
- Supabase Service Role Key
- Stripe Secret Keys

### Immer .gitignore:
```
.env
.env.local
.env.production
.env.prod
*.key
*.pem
```

### Environment Variables Handling:
- **Development**: `.env.local` (nicht committen)
- **Production**: Vercel Dashboard / Platform-Secrets
- **Build-Time**: Verwende Placeholders wenn nötig

---

**Letzte Aktualisierung**: 13. November 2025  
**Status**: ✅ Web App deployed, Mobile App in Development

## Nützliche Befehle für AI Agents

```bash
# Projekt-Struktur anzeigen
tree -L 3 -I 'node_modules|ios/Pods'

# Dependencies aktualisieren
npm update

# Type-Check vor Commits
npx tsc --noEmit

# iOS-Logs live anzeigen
npx react-native log-ios

# Android-Logs live anzeigen
npx react-native log-android
```
