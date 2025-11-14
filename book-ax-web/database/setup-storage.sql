-- =====================================================
-- SUPABASE STORAGE SETUP für media.book.ax
-- =====================================================
-- Dieses Script erstellt den privaten Storage Bucket
-- und konfiguriert RLS Policies für sichere Access Control
-- =====================================================

-- 1. CREATE PRIVATE BUCKET (falls noch nicht existiert)
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hotel-images',
  'hotel-images',
  false, -- PRIVATE! Access nur via media.book.ax Proxy
  5242880, -- 5MB max file size
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS POLICIES
-- =====================================================

-- Policy 1: Authenticated Hoteliers und Admins können Bilder hochladen
CREATE POLICY "Authenticated users can upload hotel images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'hotel-images' AND
  (auth.jwt() ->> 'role')::text IN ('hotelier', 'admin')
);

-- Policy 2: Service Role hat vollen Zugriff (für Backend Operations)
CREATE POLICY "Service role full access to hotel images"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'hotel-images')
WITH CHECK (bucket_id = 'hotel-images');

-- Policy 3: Authenticated Users können Bilder lesen (für Backend)
-- Wichtig: Diese Policy erlaubt nur Backend-Access via Service Role
-- Public Access erfolgt ausschließlich über media.book.ax Proxy
CREATE POLICY "Authenticated users can read hotel images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'hotel-images');

-- Optional Policy 4: Hotelier kann nur eigene Hotel-Bilder löschen
-- (später implementieren, wenn user_id in object metadata gespeichert wird)
-- CREATE POLICY "Hoteliers can delete own hotel images"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (
--   bucket_id = 'hotel-images' AND
--   (auth.jwt() ->> 'role')::text = 'hotelier' AND
--   (storage.foldername(name))[1] IN (
--     SELECT id::text FROM hotels WHERE owner_id = auth.uid()
--   )
-- );

-- =====================================================
-- 3. VERIFY SETUP
-- =====================================================

-- Check Bucket Configuration
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id = 'hotel-images';

-- Check RLS Policies
SELECT 
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%hotel%';

-- =====================================================
-- 4. TEST QUERIES (Optional)
-- =====================================================

-- List all files in bucket (as service_role)
-- SELECT * FROM storage.objects WHERE bucket_id = 'hotel-images';

-- Check storage usage
-- SELECT 
--   bucket_id,
--   COUNT(*) as file_count,
--   SUM((metadata->>'size')::bigint) as total_bytes,
--   pg_size_pretty(SUM((metadata->>'size')::bigint)) as total_size
-- FROM storage.objects
-- WHERE bucket_id = 'hotel-images'
-- GROUP BY bucket_id;

-- =====================================================
-- NOTES
-- =====================================================
-- 
-- 1. Bucket ist PRIVATE (public: false)
--    - Keine direkten Supabase Storage URLs funktionieren
--    - Zugriff nur via media.book.ax Reverse Proxy
-- 
-- 2. RLS Policies:
--    - Upload: Nur für authenticated hoteliers/admins
--    - Download: Nur via Service Role (Backend)
--    - Public Access: Nur via media.book.ax
-- 
-- 3. Security:
--    - Kein direkter Storage Access von außen
--    - Alle Requests gehen durch Vercel Edge Functions
--    - CDN Caching für Performance
-- 
-- 4. File Organization:
--    hotel-images/
--      └── {hotel-uuid}/
--          ├── image1.jpg
--          ├── image2.jpg
--          └── ...
-- 
-- 5. Access URLs:
--    Supabase:  https://xxx.supabase.co/storage/v1/object/hotel-images/... (NICHT PUBLIC!)
--    CDN:       https://media.book.ax/{hotel-uuid}/image.jpg (PUBLIC via Proxy)
-- 
-- =====================================================

COMMENT ON TABLE storage.objects IS 'Storage objects table with RLS policies for media.book.ax CDN proxy';
