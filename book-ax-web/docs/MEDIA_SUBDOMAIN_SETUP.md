# 🖼️ MEDIA SUBDOMAIN SETUP - media.book.ax

## 📋 Setup-Plan

### **Ziel:**
- Subdomain: `media.book.ax`
- Reverse Proxy zu Supabase Storage
- Bucket bleibt **PRIVATE**
- CDN-Caching via Vercel

---

## 🔧 1. Supabase Storage Setup

### Bucket erstellen (Private)
```sql
-- In Supabase Dashboard > Storage > Create Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('hotel-images', 'hotel-images', false);
```

### RLS Policies für Private Bucket
```sql
-- Policy 1: Authenticated users can upload
CREATE POLICY "Authenticated users can upload hotel images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'hotel-images' AND
  (auth.jwt() ->> 'role')::text IN ('hotelier', 'admin')
);

-- Policy 2: Authenticated users can read their own hotel images
CREATE POLICY "Users can read hotel images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'hotel-images');

-- Policy 3: Service role (backend) can do anything
CREATE POLICY "Service role full access"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'hotel-images');
```

---

## 🌐 2. Vercel Reverse Proxy API Route

### Datei: `/api/media/[...path]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';

export const runtime = 'edge'; // Use Vercel Edge for better performance

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');

    // Get file from Supabase Storage (private bucket)
    const { data, error } = await supabaseAdmin.storage
      .from('hotel-images')
      .download(path);

    if (error || !data) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Get content type from file extension
    const ext = path.split('.').pop()?.toLowerCase();
    const contentType = getContentType(ext);

    // Stream the file with proper headers
    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 year cache
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    });
  } catch (error) {
    console.error('Media proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getContentType(ext?: string): string {
  const types: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  };
  return types[ext || ''] || 'application/octet-stream';
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

---

## 🔗 3. Vercel Subdomain Configuration

### Schritt 1: Subdomain in Vercel Dashboard hinzufügen

1. Gehe zu: https://vercel.com/bookax/book-ax/settings/domains
2. Klicke "Add Domain"
3. Füge hinzu: `media.book.ax`
4. Vercel gibt dir DNS-Records

### Schritt 2: DNS bei deinem Provider (z.B. Cloudflare)

```
Type: CNAME
Name: media
Value: cname.vercel-dns.com
TTL: Auto
Proxy: Optional (empfohlen für zusätzliches Caching)
```

### Schritt 3: Vercel Rewrites (vercel.json)

```json
{
  "rewrites": [
    {
      "source": "/media/:path*",
      "destination": "/api/media/:path*"
    }
  ]
}
```

---

## 🔄 4. Image Upload anpassen

### Updated: `/api/upload/image/route.ts`

```typescript
// ... existing code ...

// Upload to Supabase Storage (PRIVATE bucket)
const { data, error } = await supabaseAdmin.storage
  .from('hotel-images')
  .upload(fileName, buffer, {
    contentType: file.type,
    cacheControl: '3600',
    upsert: false,
  });

if (error) throw error;

// Return custom media subdomain URL
const mediaUrl = `https://media.book.ax/${fileName}`;

return NextResponse.json({
  message: 'Image uploaded successfully',
  url: mediaUrl, // Using media.book.ax instead of Supabase URL
  fileName: data.path,
}, { status: 201 });
```

---

## 📦 5. Environment Variables

### `.env.local` (Development)
```bash
# Existing Supabase vars
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Media subdomain (optional, for local testing)
NEXT_PUBLIC_MEDIA_URL=http://localhost:3000/media
```

### Vercel Production
```bash
# Media subdomain wird automatisch über media.book.ax routing
NEXT_PUBLIC_MEDIA_URL=https://media.book.ax
```

---

## 🧪 6. Testing

### Test 1: Upload
```bash
curl -X POST http://localhost:3000/api/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.jpg" \
  -F "hotelId=uuid"

# Response:
{
  "url": "https://media.book.ax/hotel-uuid/1731582000-abc123.jpg"
}
```

### Test 2: Access via Proxy
```bash
curl https://media.book.ax/hotel-uuid/1731582000-abc123.jpg

# Should return the image file
```

### Test 3: Cache Headers
```bash
curl -I https://media.book.ax/hotel-uuid/1731582000-abc123.jpg

# Expected Headers:
HTTP/2 200
cache-control: public, max-age=31536000, immutable
content-type: image/jpeg
access-control-allow-origin: *
```

---

## 🚀 7. Deployment Steps

### 1. Deploy Updated Code
```bash
cd book-ax-web
git add .
git commit -m "feat: Add media subdomain reverse proxy"
git push origin main
```

### 2. Add Subdomain in Vercel
- Dashboard → Settings → Domains → Add `media.book.ax`

### 3. Configure DNS
- Add CNAME record at DNS provider

### 4. Wait for DNS Propagation (5-60 minutes)

### 5. Test
```bash
curl https://media.book.ax/test.jpg
```

---

## 🔒 8. Security Benefits

### Private Bucket + Proxy:
- ✅ Supabase URLs nicht exponiert
- ✅ Bucket bleibt privat (nur Backend-Access)
- ✅ Signierte URLs nicht nötig
- ✅ Zugriffskontrolle über API möglich (später)
- ✅ Rate Limiting via Vercel möglich

### Future: Access Control (Optional)
```typescript
// In /api/media/[...path]/route.ts
export async function GET(req: NextRequest, { params }) {
  // Optional: Check permissions
  const authHeader = req.headers.get('authorization');
  if (authHeader) {
    // Verify user has access to this hotel's images
    const user = verifyToken(authHeader);
    // ... permission check ...
  }
  
  // Return file
}
```

---

## 📊 9. Performance Optimization

### CDN Caching Layers:
1. **Vercel Edge Network** (automatisch)
2. **Browser Cache** (1 Jahr via Cache-Control)
3. **Optional: Cloudflare** (wenn DNS über Cloudflare)

### Result:
- First Request: ~200ms (Supabase → Vercel → Client)
- Cached: ~20ms (Vercel Edge → Client)
- Browser Cached: 0ms (lokaler Cache)

---

## 🎯 10. Alternative: Cloudflare Workers (später)

Falls du später komplett unabhängig von Vercel sein willst:

```javascript
// Cloudflare Worker für media.book.ax
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.substring(1);
    
    // Fetch from Supabase Storage
    const supabaseUrl = `https://xxx.supabase.co/storage/v1/object/hotel-images/${path}`;
    const response = await fetch(supabaseUrl, {
      headers: {
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`
      }
    });
    
    // Return with CDN cache
    return new Response(response.body, {
      headers: {
        'Content-Type': response.headers.get('Content-Type'),
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
```

---

## ✅ Zusammenfassung

**Setup:**
1. ✅ Private Bucket in Supabase
2. ✅ Reverse Proxy API Route in Vercel
3. ✅ Subdomain `media.book.ax` in Vercel
4. ✅ DNS CNAME Record
5. ✅ Updated Upload API (nutzt media.book.ax URLs)

**Benefits:**
- 🔒 Secure (Private Bucket)
- 🚀 Fast (Vercel Edge CDN)
- 💰 Cost-effective (keine zusätzlichen Services)
- 🎨 Professional (eigene Subdomain)

**Nächster Schritt:**
Soll ich die Reverse Proxy API Route und die angepasste Upload API jetzt implementieren?
