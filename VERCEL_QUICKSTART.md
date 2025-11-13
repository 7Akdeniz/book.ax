# ⚡ Schnelle Vercel Deployment Anleitung

## 🎯 Was jetzt zu tun ist

### Schritt 1: Vercel Dashboard öffnen
👉 https://vercel.com/7Akdeniz/book-ax/settings/environment-variables

### Schritt 2: Environment Variables setzen

Kopiere diese Variables **einzeln** ins Vercel Dashboard:

```bash
# Supabase (WICHTIG!)
NEXT_PUBLIC_SUPABASE_URL=https://cmoohnktsgszmuxxnobd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-hier-einfügen
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-hier-einfügen

# App URL
NEXT_PUBLIC_APP_URL=https://book-ax.vercel.app

# JWT
JWT_SECRET=dein-super-secret-jwt-key-mindestens-32-zeichen-lang
JWT_REFRESH_SECRET=dein-super-secret-refresh-key-mindestens-32-zeichen-lang

# Stripe (später)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

**Wo finde ich die Supabase Keys?**
1. Gehe zu: https://supabase.com/dashboard/project/cmoohnktsgszmuxxnobd/settings/api
2. Kopiere:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ geheim!)

### Schritt 3: Deployment starten

**Option A: Automatisch (empfohlen)**
```bash
git add vercel.json VERCEL_DEPLOYMENT.md
git commit -m "Add Vercel deployment config"
git push origin main
```
→ Vercel deployed automatisch!

**Option B: Manuell**
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Schritt 4: Warten & Testen

1. Gehe zu: https://vercel.com/7Akdeniz/book-ax/deployments
2. Warte bis Status "Ready" ist (~2-5 Min)
3. Öffne: https://book-ax.vercel.app

---

## ✅ Checkliste

- [ ] Environment Variables im Vercel Dashboard gesetzt
- [ ] Code gepushed (`git push origin main`)
- [ ] Deployment erfolgreich (grüner Haken im Dashboard)
- [ ] Website öffnet sich: https://book-ax.vercel.app
- [ ] Andere Sprachen funktionieren: `/de`, `/en`, `/es`

---

## 🐛 Fehler?

### Build Fehler
→ Logs checken: https://vercel.com/7Akdeniz/book-ax/deployments

### 404 Error
→ Environment Variables fehlen

### "Supabase connection failed"
→ Supabase Keys falsch oder fehlen

---

**Hilfe?** Schau in `VERCEL_DEPLOYMENT.md` für Details!
