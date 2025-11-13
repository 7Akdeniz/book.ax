# ⚠️ WICHTIG: Vercel Root Directory Setup

## Problem
Vercel sucht das Next.js Projekt im Root-Verzeichnis, aber es ist in `book-ax-web/`.

## Lösung: Root Directory in Vercel Dashboard setzen

### Schritt 1: Öffne Vercel Settings
👉 https://vercel.com/bookax/settings

### Schritt 2: General Settings → Root Directory

1. Scrolle zu **"Root Directory"**
2. Klicke auf **"Edit"**
3. Gib ein: `book-ax-web`
4. Klicke **"Save"**

### Schritt 3: Redeploy

1. Gehe zu: https://vercel.com/bookax/deployments
2. Klicke auf das fehlgeschlagene Deployment
3. Klicke **"⋮" (3 Punkte)** → **"Redeploy"**

---

## Alternative: Vercel CLI (falls Dashboard nicht funktioniert)

```bash
vercel --cwd book-ax-web
```

---

**Nach Root Directory Änderung sollte der Build funktionieren!**
