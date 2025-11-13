# 🚀 VERCEL DEPLOYMENT - SUPER EINFACH

## ✅ Gute Nachricht!
Deine Environment Variables sind bereits in `.env.prod` - du musst sie nur noch in Vercel eintragen.

---

## Schritt 1: Vercel Environment Variables setzen

### Gehe zu:
👉 https://vercel.com/7Akdeniz/book-ax/settings/environment-variables

### Trage folgende Variablen ein (KOPIERE EINFACH!):

Klicke auf **"Add New"** und füge **JEDE Variable einzeln** hinzu:

---

**Variable 1:**
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://mjenrkuzlgxznbrjygfe.supabase.co
```
✅ Production ✅ Preview ✅ Development

---

**Variable 2:**
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZW5ya3V6bGd4em5icmp5Z2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MTc4MTAsImV4cCI6MjA3ODQ5MzgxMH0.IVPV9xn7Q4JT08IjpiSdTiKzCASAkrtOjf0qLK9af_E
```
✅ Production ✅ Preview ✅ Development

---

**Variable 3:**
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZW5ya3V6bGd4em5icmp5Z2ZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjkxNzgxMCwiZXhwIjoyMDc4NDkzODEwfQ.SrDvRBX1itZvZUhjRHQkfdGwmAwYJ3gL_dmVlnkzoME
```
✅ Production ✅ Preview ✅ Development

---

**Variable 4:**
```
Key: NEXT_PUBLIC_APP_URL
Value: https://book-ax.vercel.app
```
✅ Production ✅ Preview ✅ Development

---

**Variable 5:**
```
Key: SUPABASE_JWT_SECRET
Value: TZ7x2CvdT87pFxdsl/GHpyyto7isJNlLeRGPTvdyIuevBfjri73eqoCczYyr7qLcSmKzZ06vJ2yDpN6XgFwnkA==
```
✅ Production ✅ Preview ✅ Development

---

**Variable 6 (Optional - für Stripe später):**
```
Key: JWT_SECRET
Value: TZ7x2CvdT87pFxdsl/GHpyyto7isJNlLeRGPTvdyIuevBfjri73eqoCczYyr7qLcSmKzZ06vJ2yDpN6XgFwnkA==
```
✅ Production ✅ Preview ✅ Development

---

**Variable 7 (Optional - für Stripe später):**
```
Key: JWT_REFRESH_SECRET
Value: TZ7x2CvdT87pFxdsl/GHpyyto7isJNlLeRGPTvdyIuevBfjri73eqoCczYyr7qLcSmKzZ06vJ2yDpN6XgFwnkA==
```
✅ Production ✅ Preview ✅ Development

---

## Schritt 2: Deployment auslösen

### Option A: Automatisch (EINFACHSTE)
```bash
git add .
git commit -m "Add Vercel config"
git push origin main
```

### Option B: Manuell neu deployen
1. Gehe zu: https://vercel.com/7Akdeniz/book-ax/deployments
2. Klicke auf die 3 Punkte beim letzten Deployment
3. Klicke "Redeploy"

---

## Schritt 3: Warten & Testen

1. Öffne: https://vercel.com/7Akdeniz/book-ax/deployments
2. Warte bis Status **"Ready"** ist (~2-5 Min)
3. Öffne: https://book-ax.vercel.app

---

## ✅ Checkliste

- [ ] 7 Environment Variables in Vercel eingetragen
- [ ] Code gepushed ODER Redeploy geklickt
- [ ] Deployment Status "Ready"
- [ ] Website öffnet sich: https://book-ax.vercel.app

---

**FERTIG!** 🎉

Wenn alles läuft, kannst du auch andere Sprachen testen:
- https://book-ax.vercel.app/de
- https://book-ax.vercel.app/en
- https://book-ax.vercel.app/es
