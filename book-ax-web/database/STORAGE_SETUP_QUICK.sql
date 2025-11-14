-- ============================================================
-- SUPABASE STORAGE QUICK SETUP für media.book.ax
-- ============================================================
-- ANLEITUNG: 
-- 1. Gehe zu https://supabase.com/dashboard
-- 2. Wähle dein Projekt
-- 3. Gehe zu SQL Editor
-- 4. Füge dieses Script ein und klicke "Run"
-- ============================================================

-- 1. CREATE PRIVATE BUCKET
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hotel-images',
  'hotel-images',
  false, -- PRIVATE! Access nur via media.book.ax
  5242880, -- 5MB max file size
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS POLICIES für Uploads (Hoteliers/Admins)
CREATE POLICY IF NOT EXISTS "Authenticated users can upload hotel images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'hotel-images' AND
  (auth.jwt() ->> 'role')::text IN ('hotelier', 'admin')
);

-- 3. RLS POLICY für Service Role (Backend Access)
CREATE POLICY IF NOT EXISTS "Service role full access"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'hotel-images')
WITH CHECK (bucket_id = 'hotel-images');

-- 4. RLS POLICY für Authenticated Read (Backend)
CREATE POLICY IF NOT EXISTS "Authenticated users can read hotel images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'hotel-images');

-- VERIFY SETUP
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'hotel-images';
