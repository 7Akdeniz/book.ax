# ⚡ VERCEL DEPLOYMENT - 3 SCHRITTE

## 1️⃣ Variablen in Vercel eintragen

Gehe zu: https://vercel.com/bookax/settings/environment-variables

Füge hinzu (aus `.env.prod`):

| Key | Value | Wo? |
|-----|-------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://mjenrkuzlgxznbrjygfe.supabase.co` | Alle 3 ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJ...af_E` | Alle 3 ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJ...zoME` | Alle 3 ✅ |
| `NEXT_PUBLIC_APP_URL` | `https://book-ax.vercel.app` | Alle 3 ✅ |
| `SUPABASE_JWT_SECRET` | `TZ7x2CvdT8...wnkA==` | Alle 3 ✅ |

"Alle 3" = Production + Preview + Development

---

## 2️⃣ Code pushen

```bash
git add .
git commit -m "Add Vercel config"
git push origin main
```

---

## 3️⃣ Fertig!

Warte 2-5 Min, dann öffne:
👉 https://book-ax.vercel.app

---

**Vollständige Werte:** Siehe `VERCEL_START.md`  
**Details & Hilfe:** Siehe `VERCEL_DEPLOYMENT.md`
