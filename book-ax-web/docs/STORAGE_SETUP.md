# 📦 Supabase Storage Setup für Book.ax

## Übersicht

Book.ax nutzt **Supabase Storage** für Hotel-Bilder. Dieser Guide erklärt die Einrichtung.

---

## 🎯 Warum Supabase Storage?

✅ **Vorteile:**
- Bereits integriert im Code
- Kostenlos bis 1GB (Supabase Free Tier)
- S3-kompatibel (kann später zu AWS S3 migriert werden)
- RLS Policies für Sicherheit
- CDN mit Cache-Control

❌ **Alternative: Vercel Blob Storage**
- Kostet extra ($0.15/GB + $0.30/GB transfer)
- Würde Code-Änderungen erfordern
- Nur sinnvoll bei sehr großem Traffic

---

## 🛠️ Setup in Supabase Dashboard

### 1. Storage Bucket erstellen

1. Gehe zu [Supabase Dashboard](https://app.supabase.com)
2. Wähle dein Projekt aus
3. Navigiere zu **Storage** → **Buckets**
4. Klicke auf **New Bucket**
5. Konfiguriere:
   ```
   Name: hotel-images
   Public: ❌ NO (Private Bucket)
   File Size Limit: 50 MB
   Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp
   ```
6. Klicke **Save**

### 2. RLS Policies setzen (automatisch via Migration)

Die Migration `20251117000002_storage_buckets.sql` erstellt automatisch:

```sql
-- ✅ Hoteliers & Admins können uploaden
-- ✅ Hoteliers & Admins können ihre Bilder lesen
-- ✅ Hoteliers & Admins können ihre Bilder löschen
-- ✅ Service Role (Backend) hat vollen Zugriff
```

### 3. Migration ausführen

**Lokal (Supabase CLI):**
```bash
cd book-ax-web
supabase db push
```

**Production (Supabase Dashboard):**
1. Gehe zu **SQL Editor**
2. Öffne `supabase/migrations/20251117000002_storage_buckets.sql`
3. Kopiere den Inhalt
4. Führe das SQL aus

---

## 🔐 Environment Variables

Stelle sicher, dass diese Variablen in **Vercel Dashboard** gesetzt sind:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...  # ⚠️ Server-only!

# Media URL (Required)
NEXT_PUBLIC_MEDIA_URL=https://media.book.ax  # Oder https://book.ax/api/media
```

---

## 📸 Wie Bild-Upload funktioniert

### 1. **Frontend**: Datei hochladen
```typescript
// HotelImagesForm.tsx
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/upload/image', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});

const { url, fileName } = await response.json();
// url = "https://media.book.ax/temp/1234567890-abc123.jpg"
```

### 2. **Backend**: Upload zu Supabase Storage
```typescript
// /api/upload/image/route.ts
const { data, error } = await supabaseAdmin.storage
  .from('hotel-images')
  .upload(fileName, buffer, {
    contentType: file.type,
    cacheControl: '3600',
  });
```

### 3. **Hotel erstellen**: Bilder verknüpfen
```typescript
// HotelReviewSubmit.tsx
// Nach Hotel-Erstellung:
await authenticatedFetch(`/api/panel/hotels/${hotelId}/images`, {
  method: 'POST',
  body: JSON.stringify({
    url: image.url,
    isPrimary: image.isPrimary,
  }),
});
```

### 4. **Frontend**: Bilder anzeigen
```tsx
// Über Media Proxy (CDN + Cache)
<img src="https://media.book.ax/temp/1234567890-abc123.jpg" />

// Wird geleitet zu:
// → /api/media/temp/1234567890-abc123.jpg
// → Supabase Storage → hotel-images/temp/1234567890-abc123.jpg
```

---

## 🚀 Testing

### Lokal testen (Supabase Local)
```bash
# 1. Supabase Local starten
cd book-ax-web
supabase start

# 2. Web App starten
npm run dev

# 3. Test Upload
# → http://localhost:3000/de/panel/hotels/new
# → Bilder hochladen
# → Prüfe: http://localhost:54321/storage/v1/object/public/hotel-images/
```

### Production testen
```bash
# 1. Deploy zu Vercel
git push origin main

# 2. Prüfe Vercel Logs
# → https://vercel.com/bookax/book-ax/deployments

# 3. Test Upload
# → https://book.ax/de/panel/hotels/new
# → Bilder hochladen
# → Prüfe: Supabase Dashboard → Storage → hotel-images
```

---

## 🐛 Troubleshooting

### Problem: "Failed to upload image: Bucket not found"
**Lösung:**
1. Prüfe ob Bucket `hotel-images` existiert (Supabase Dashboard → Storage)
2. Führe Migration aus: `supabase db push`

### Problem: "Storage error: new row violates row-level security policy"
**Lösung:**
1. Prüfe RLS Policies im Supabase Dashboard
2. Stelle sicher, dass JWT `role` = 'hotelier' oder 'admin'
3. Führe Migration aus (erstellt Policies automatisch)

### Problem: "CORS error when uploading"
**Lösung:**
1. Gehe zu Supabase Dashboard → Settings → API
2. Füge deine Domain zu "CORS Origins" hinzu:
   - `https://book.ax`
   - `https://*.book.ax`
   - `http://localhost:3000` (für lokal)

### Problem: Bilder werden nicht angezeigt
**Lösung:**
1. Prüfe `NEXT_PUBLIC_MEDIA_URL` in Vercel Dashboard
2. Teste Media Proxy: `curl https://book.ax/api/media/test.jpg`
3. Prüfe Supabase Storage Permissions

### Problem: "File size exceeds limit"
**Lösung:**
1. Bucket Limit erhöhen (Supabase Dashboard → Storage → Bucket Settings)
2. Oder Bilder komprimieren (Frontend mit `compressorjs`)

---

## 📊 Storage Limits & Costs

### Supabase Free Tier
- ✅ 1 GB Storage
- ✅ 2 GB Transfer/Monat
- ✅ Ausreichend für ~1000 Hotel-Bilder (je 1MB)

### Supabase Pro ($25/Monat)
- ✅ 100 GB Storage
- ✅ 200 GB Transfer/Monat
- ✅ Für ~100.000 Hotel-Bilder

### Upgrade später möglich
- Migration zu AWS S3 (wenn Storage > 100GB)
- CDN vor Supabase Storage (Cloudflare, Fastly)
- Image Optimization Service (ImageKit, Cloudinary)

---

## 🔄 Alternative: Vercel Blob Storage

Falls du **Vercel Blob Storage** nutzen möchtest (nicht empfohlen):

```bash
npm install @vercel/blob
```

```typescript
// /api/upload/image/route.ts (Alternative)
import { put } from '@vercel/blob';

const blob = await put(fileName, file, {
  access: 'public',
  token: process.env.BLOB_READ_WRITE_TOKEN,
});

return { url: blob.url };
```

**Kosten:**
- $0.15/GB Storage
- $0.30/GB Transfer
- Für 1000 Bilder (1GB): ~$0.15/Monat + Transfer

**Nachteil:**
- Code-Änderungen nötig
- Teurer als Supabase Free Tier
- Vendor Lock-in (schwer zu migrieren)

---

## ✅ Checkliste

- [ ] Supabase Bucket `hotel-images` erstellt
- [ ] Migration `20251117000002_storage_buckets.sql` ausgeführt
- [ ] Environment Variables in Vercel gesetzt
- [ ] CORS Origins in Supabase konfiguriert
- [ ] Upload getestet (lokal + production)
- [ ] Media Proxy funktioniert (`/api/media/...`)

---

**Status**: ✅ Ready für Production  
**Letzte Aktualisierung**: 17. November 2025
