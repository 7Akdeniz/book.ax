# 🚀 MEDIA SUBDOMAIN DEPLOYMENT GUIDE

## Schritt-für-Schritt Anleitung für media.book.ax Setup

---

## ✅ **Voraussetzungen**

- [x] Vercel Account mit book.ax Domain
- [x] Supabase Projekt
- [x] DNS-Zugriff (Cloudflare, etc.)

---

## 📋 **Schritt 1: Supabase Storage einrichten**

### 1.1 Bucket erstellen

**Option A: Via Supabase Dashboard**
1. Gehe zu: https://app.supabase.com/project/YOUR_PROJECT/storage
2. Klicke "Create Bucket"
3. Name: `hotel-images`
4. **WICHTIG:** Public: **false** ❌ (privat!)
5. File size limit: `5242880` (5MB)
6. Allowed MIME types: `image/jpeg, image/png, image/webp`

**Option B: Via SQL**
```bash
cd book-ax-web
psql -h db.xxx.supabase.co -U postgres -d postgres -f database/setup-storage.sql
```

### 1.2 RLS Policies setzen

Die Policies aus `database/setup-storage.sql` ausführen:
- Policy 1: Upload für authenticated hoteliers/admins
- Policy 2: Full access für service_role
- Policy 3: Read für authenticated users

### 1.3 Verifizieren

```sql
-- In Supabase SQL Editor
SELECT * FROM storage.buckets WHERE id = 'hotel-images';

-- Erwartetes Result:
-- id: hotel-images
-- name: hotel-images
-- public: false ✅
-- file_size_limit: 5242880
```

---

## 📋 **Schritt 2: Code deployen**

### 2.1 Environment Variable hinzufügen

**Vercel Dashboard:**
```bash
vercel env add NEXT_PUBLIC_MEDIA_URL production
# Eingabe: https://media.book.ax

vercel env add NEXT_PUBLIC_MEDIA_URL preview
# Eingabe: https://media.book.ax

vercel env add NEXT_PUBLIC_MEDIA_URL development
# Eingabe: http://localhost:3000/media
```

**Oder via CLI:**
```bash
cd book-ax-web
echo "https://media.book.ax" | vercel env add NEXT_PUBLIC_MEDIA_URL production
echo "https://media.book.ax" | vercel env add NEXT_PUBLIC_MEDIA_URL preview
echo "http://localhost:3000/media" | vercel env add NEXT_PUBLIC_MEDIA_URL development
```

### 2.2 Code committen und pushen

```bash
cd book-ax-web
git status
git add .
git commit -m "feat: Add media.book.ax reverse proxy for private Supabase Storage"
git push origin main
```

Vercel wird automatisch deployen! ✅

---

## 📋 **Schritt 3: Subdomain in Vercel hinzufügen**

### 3.1 Vercel Dashboard

1. Gehe zu: https://vercel.com/bookax/book-ax/settings/domains
2. Klicke "Add Domain"
3. Eingabe: `media.book.ax`
4. Klicke "Add"

Vercel zeigt dir jetzt die DNS-Konfiguration:

```
Type: CNAME
Name: media
Value: cname.vercel-dns.com
```

---

## 📋 **Schritt 4: DNS konfigurieren**

### 4.1 Bei deinem DNS-Provider (z.B. Cloudflare)

**Cloudflare Dashboard:**
1. Gehe zu: DNS → Records
2. Klicke "Add Record"
3. Konfiguration:
   ```
   Type: CNAME
   Name: media
   Target: cname.vercel-dns.com
   TTL: Auto
   Proxy status: Proxied (🟠 Orange Cloud) ✅
   ```
4. Speichern

**Andere DNS-Provider:**
- Google Domains, Namecheap, etc.: Ähnliche Konfiguration
- WICHTIG: CNAME Target = `cname.vercel-dns.com`

### 4.2 DNS Propagation warten

```bash
# Check DNS Propagation (ca. 5-60 Minuten)
dig media.book.ax

# Oder online:
# https://www.whatsmydns.net/#CNAME/media.book.ax
```

---

## 📋 **Schritt 5: SSL Zertifikat (automatisch)**

Vercel generiert automatisch ein SSL-Zertifikat via Let's Encrypt.

**Warten:** ~5-10 Minuten nach DNS Propagation

**Status prüfen:**
```bash
curl -I https://media.book.ax/test.jpg
# Sollte SSL-Fehler zeigen, bis Zertifikat bereit ist
```

---

## 📋 **Schritt 6: Testing**

### 6.1 Test 1: Upload

```bash
# Login und Token erhalten
TOKEN=$(curl -s -X POST https://book.ax/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hotelier@example.com","password":"password123"}' \
  | jq -r '.accessToken')

# Bild hochladen
curl -X POST https://book.ax/api/upload/image \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.jpg" \
  -F "hotelId=YOUR_HOTEL_UUID"

# Response:
{
  "message": "Image uploaded successfully",
  "url": "https://media.book.ax/YOUR_HOTEL_UUID/1731582000-abc123.jpg",
  "fileName": "YOUR_HOTEL_UUID/1731582000-abc123.jpg"
}
```

### 6.2 Test 2: Access via CDN

```bash
# Bild abrufen
curl -I https://media.book.ax/YOUR_HOTEL_UUID/1731582000-abc123.jpg

# Erwartete Headers:
HTTP/2 200
content-type: image/jpeg
cache-control: public, max-age=31536000, immutable
access-control-allow-origin: *
x-vercel-cache: MISS (erste Anfrage)
```

### 6.3 Test 3: Cache Verification

```bash
# Zweite Anfrage (sollte aus Cache kommen)
curl -I https://media.book.ax/YOUR_HOTEL_UUID/1731582000-abc123.jpg

# Erwartete Headers:
HTTP/2 200
x-vercel-cache: HIT ✅ (gecached!)
age: 10 (Sekunden im Cache)
```

### 6.4 Test 4: Browser

Öffne im Browser:
```
https://media.book.ax/YOUR_HOTEL_UUID/1731582000-abc123.jpg
```

Sollte das Bild anzeigen! ✅

---

## 📋 **Schritt 7: Verifizierung**

### 7.1 Health Check

```bash
# Test Proxy Endpoint
curl https://book.ax/api/media/test.jpg
# Sollte 404 zurückgeben (OK, da test.jpg nicht existiert)

# Test mit realem Bild
curl https://media.book.ax/YOUR_HOTEL_UUID/REAL_IMAGE.jpg
# Sollte 200 + Bild zurückgeben
```

### 7.2 Performance Check

```bash
# First Request
time curl -o /dev/null -s -w "%{time_total}\n" https://media.book.ax/image.jpg
# ~0.5-1.0 Sekunden (von Supabase)

# Second Request (cached)
time curl -o /dev/null -s -w "%{time_total}\n" https://media.book.ax/image.jpg
# ~0.02-0.05 Sekunden (von Vercel Edge) ✅
```

### 7.3 Security Check

```bash
# Versuche direkten Supabase Access (sollte FAIL)
curl https://xxx.supabase.co/storage/v1/object/public/hotel-images/test.jpg
# Sollte 404 oder 403 zurückgeben (Bucket ist privat) ✅

# Via media.book.ax (sollte SUCCESS)
curl https://media.book.ax/test.jpg
# Sollte funktionieren ✅
```

---

## 🔧 **Troubleshooting**

### Problem 1: DNS nicht erreichbar

**Symptom:**
```bash
curl https://media.book.ax
# curl: (6) Could not resolve host: media.book.ax
```

**Lösung:**
- DNS Propagation abwarten (5-60 Minuten)
- DNS Record prüfen: `dig media.book.ax`
- CNAME Target prüfen: muss `cname.vercel-dns.com` sein

### Problem 2: SSL Zertifikat Fehler

**Symptom:**
```bash
curl https://media.book.ax
# curl: (60) SSL certificate problem
```

**Lösung:**
- Warten (SSL Zertifikat wird automatisch generiert)
- Vercel Dashboard prüfen: Domains → media.book.ax → SSL Status
- Falls nach 30 Min nicht ready: Vercel Support kontaktieren

### Problem 3: 404 bei allen Bildern

**Symptom:**
```bash
curl https://media.book.ax/hotel-uuid/image.jpg
# {"error":"File not found"}
```

**Lösung:**
- Prüfen ob Datei existiert: Supabase Dashboard → Storage → hotel-images
- Path korrekt? Format: `hotel-uuid/filename.jpg`
- RLS Policies prüfen (siehe Schritt 1.2)
- Service Role Key korrekt in Vercel Env Vars?

### Problem 4: CORS Fehler im Browser

**Symptom:**
```
Access to image at 'https://media.book.ax/...' from origin 'https://book.ax'
has been blocked by CORS policy
```

**Lösung:**
- Sollte nicht passieren (Access-Control-Allow-Origin: * ist gesetzt)
- Hard Refresh im Browser: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
- Vercel Deployment abgeschlossen? (ca. 2-3 Minuten)

### Problem 5: Bilder laden langsam

**Symptom:**
- Erste Anfrage dauert >1 Sekunde

**Lösung:**
- Normal! Erste Anfrage holt Bild von Supabase
- Zweite Anfrage sollte <50ms sein (Vercel Edge Cache)
- Falls dauerhaft langsam: Supabase Region prüfen (sollte EU sein)

---

## 📊 **Monitoring**

### Vercel Logs

```bash
# Live Logs
vercel logs book-ax --follow

# Nur Errors
vercel logs book-ax --follow | grep ERROR
```

### Supabase Storage Monitoring

```sql
-- Storage Usage
SELECT 
  bucket_id,
  COUNT(*) as file_count,
  SUM((metadata->>'size')::bigint) as total_bytes,
  pg_size_pretty(SUM((metadata->>'size')::bigint)) as total_size
FROM storage.objects
WHERE bucket_id = 'hotel-images'
GROUP BY bucket_id;

-- Recent Uploads
SELECT 
  name,
  metadata->>'size' as size,
  created_at
FROM storage.objects
WHERE bucket_id = 'hotel-images'
ORDER BY created_at DESC
LIMIT 10;
```

---

## ✅ **Success Checklist**

- [ ] Supabase Bucket `hotel-images` erstellt (privat!)
- [ ] RLS Policies konfiguriert
- [ ] Code deployed (Vercel)
- [ ] Environment Variable `NEXT_PUBLIC_MEDIA_URL` gesetzt
- [ ] Subdomain `media.book.ax` in Vercel hinzugefügt
- [ ] DNS CNAME Record erstellt
- [ ] DNS Propagation abgeschlossen
- [ ] SSL Zertifikat aktiv
- [ ] Upload Test erfolgreich
- [ ] Access Test erfolgreich
- [ ] Cache Test erfolgreich

---

## 🎉 **Fertig!**

Deine media.book.ax Subdomain ist jetzt live!

**Next Steps:**
- Frontend Components für Image Upload erstellen
- Hotel Onboarding Form mit Image Upload
- Monitoring Dashboard aufsetzen

---

**Erstellt:** 14. November 2025  
**Status:** ✅ Ready for Deployment
