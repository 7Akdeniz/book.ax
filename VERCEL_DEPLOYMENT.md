# Vercel Deployment Anleitung

## Problem gelöst! ✅

Der Fehler kam daher, dass Vercel versuchte die **React Native App** zu deployen statt des **Next.js Web-Projekts**.

## Was wurde gemacht?

1. ✅ `vercel.json` wurde erstellt mit korrekter Konfiguration
2. ✅ Build-Befehle zeigen auf `book-ax-web/` Unterordner
3. ✅ Output-Directory ist korrekt gesetzt

## Deployment-Schritte

### Option 1: Automatisches Deployment (empfohlen)

1. **Git Push**:
   ```bash
   git add vercel.json
   git commit -m "Fix: Vercel config for Next.js web app"
   git push origin main
   ```

2. Vercel deployed **automatisch** nach jedem Push

### Option 2: Manuelles Deployment via CLI

1. **Vercel CLI installieren** (falls noch nicht):
   ```bash
   npm install -g vercel
   ```

2. **Einloggen**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Production Deploy**:
   ```bash
   vercel --prod
   ```

## Vercel Dashboard Einstellungen

Falls es noch nicht funktioniert, gehe zu: https://vercel.com/dashboard

1. **Projekt auswählen**: `book-ax`
2. **Settings** → **General**
3. **Root Directory**: Leer lassen (die `vercel.json` regelt alles)
4. **Framework Preset**: Next.js
5. **Build & Development Settings**:
   - Build Command: `cd book-ax-web && npm run build`
   - Output Directory: `book-ax-web/.next`
   - Install Command: `cd book-ax-web && npm install`

## Environment Variables

Setze folgende Environment Variables im Vercel Dashboard:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=deine-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
SUPABASE_SERVICE_ROLE_KEY=dein-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=dein-stripe-key
STRIPE_SECRET_KEY=dein-stripe-secret

# App URL
NEXT_PUBLIC_APP_URL=https://book-ax.vercel.app
```

### Environment Variables setzen:

1. Gehe zu: https://vercel.com/7Akdeniz/book-ax/settings/environment-variables
2. Klicke auf "Add New"
3. Füge jede Variable einzeln hinzu
4. Wähle "Production", "Preview", "Development"

## Nach dem Deployment testen

1. **Homepage**: https://book-ax.vercel.app
2. **Andere Sprachen**:
   - Deutsch: https://book-ax.vercel.app/de
   - Englisch: https://book-ax.vercel.app/en
   - Spanisch: https://book-ax.vercel.app/es
   - etc.

## Troubleshooting

### Fehler: "Module not found"
→ Environment Variables im Vercel Dashboard setzen

### Fehler: "Build failed"
→ Logs im Vercel Dashboard prüfen: https://vercel.com/7Akdeniz/book-ax/deployments

### Fehler: "404 Not Found"
→ Prüfe ob `next.config.mjs` Rewrites korrekt sind

### Build dauert zu lange
→ Vercel Free Tier: 6 Minuten Limit
→ Upgrade zu Pro wenn nötig

## Projekt-Struktur

```
book.ax/                    ← React Native App (iOS/Android)
├── vercel.json            ← Vercel Config (NEU!)
├── src/
├── App.tsx
└── book-ax-web/           ← Next.js Web App (wird deployed!)
    ├── src/
    ├── package.json
    └── next.config.mjs
```

## Wichtig!

- **React Native App** (`/`) ist für **Mobile** (iOS/Android)
- **Next.js Web App** (`/book-ax-web`) ist für **Web** (Vercel)
- Beide Apps können die **gleiche Supabase Database** nutzen

## Nächste Schritte

1. ✅ Environment Variables im Vercel Dashboard setzen
2. ✅ Code pushen
3. ✅ Warten bis Deployment fertig ist (~2-5 Minuten)
4. ✅ https://book-ax.vercel.app öffnen
5. ✅ Custom Domain hinzufügen (optional)

## Custom Domain (optional)

1. Gehe zu: https://vercel.com/7Akdeniz/book-ax/settings/domains
2. Klicke "Add Domain"
3. Gib deine Domain ein (z.B. `book.ax`)
4. Folge den DNS-Anweisungen von Vercel

---

**Status**: ✅ Konfiguration komplett  
**Nächster Schritt**: Git Push oder `vercel --prod`
