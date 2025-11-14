# Book.ax Web - Hotel Booking Platform

Multi-language hotel booking platform built with Next.js 14, Supabase, and TypeScript.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build for production
npm run build
npm start
```

---

## 📊 Vercel CLI - Deployment & Monitoring

### Setup (Einmalig)
```bash
# Vercel CLI global installieren (bereits erledigt ✅)
npm install -g vercel

# Bei Vercel einloggen (bereits erledigt ✅)
vercel login

# Projekt verbinden (bereits erledigt ✅)
vercel link
```

### Interaktives Monitoring
```bash
npm run vercel:monitor
```
Zeigt ein Menü mit allen wichtigen Optionen!

### Häufigste Befehle

```bash
# Live Logs (beste Option für Fehlersuche!)
npm run vercel:logs:follow

# Production deployen
npm run vercel:deploy

# Preview deployen (zum Testen)
npm run vercel:deploy:preview

# Letzte Logs anzeigen
npm run vercel:logs

# Environment Variables anzeigen
npm run vercel:env
```

### Fehlersuche
```bash
# Fehler in Echtzeit
vercel logs --follow | grep -E "Error|Warning"

# Fehler der letzten Stunde
vercel logs --since 1h | grep -i error

# Deployment Details
vercel inspect
```

📖 **Vollständige Dokumentation**: Siehe `VERCEL_CLI_GUIDE.md`  
⚡ **Quick Reference**: Siehe `VERCEL_QUICK_REF.md`

---

## 🌍 Internationalization (i18n)

50+ Sprachen unterstützt via `next-intl`:
- Top 9: de, en, zh, hi, es, ar, fr, tr, ru
- Weitere 41 Sprachen verfügbar

### Config Files
- `src/i18n/config.ts` - Sprachen & Locales
- `src/i18n/request.ts` - Request Config
- `messages/*.json` - Übersetzungen

---

## 🗂️ Projekt-Struktur

```
book-ax-web/
├── src/
│   ├── app/[locale]/       # Multi-language routes
│   ├── components/         # React components
│   ├── i18n/              # i18n config
│   ├── lib/db/            # Supabase client
│   └── types/             # TypeScript types
├── messages/              # Translation files (50+)
├── public/                # Static assets
├── VERCEL_CLI_GUIDE.md   # Vollständige CLI Docs
├── VERCEL_QUICK_REF.md   # Quick Reference
└── monitor.sh            # Deployment Monitor
```

---

## 🔐 Environment Variables

### Required Env Vars
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
SUPABASE_JWT_SECRET=xxx
NEXT_PUBLIC_APP_URL=https://book-ax.vercel.app
```

### Lokale Env Vars von Vercel ziehen
```bash
vercel env pull .env.local
```

---

## 🛠️ Development Scripts

```bash
npm run dev              # Development server
npm run build            # Production build
npm start                # Production server
npm run lint             # ESLint
npm run type-check       # TypeScript check
npm test                 # Jest tests
npm run generate-icons   # Generate app icons
```

---

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **i18n**: next-intl (50+ languages)
- **Payments**: Stripe
- **Deployment**: Vercel

---

## 🚢 Deployment

### Automatisch via Git
```bash
git push origin main  # Auto-deploy to Vercel
```

### Manuell via CLI
```bash
# Preview (Test)
vercel

# Production
vercel --prod
```

### Nach Deployment prüfen
```bash
# Live Logs verfolgen
npm run vercel:logs:follow

# Oder interaktives Menü
npm run vercel:monitor
```

---

## 🔗 Links

- **Live App**: https://book-ax.vercel.app
- **Vercel Dashboard**: https://vercel.com/bookax
- **GitHub Repo**: https://github.com/7Akdeniz/book.ax
- **Supabase**: https://supabase.com/dashboard

---

## 📚 Weitere Dokumentation

- `VERCEL_CLI_GUIDE.md` - Vollständige Vercel CLI Anleitung
- `VERCEL_QUICK_REF.md` - Quick Reference Card
- `START_HIER.md` - Projekt-Übersicht
- `IMPLEMENTATION_GUIDE.md` - Feature Implementierung

---

**Status**: ✅ Production-ready  
**Letzte Aktualisierung**: 14. November 2025
