-- =====================================================
-- Supabase Storage: Media Bucket (Hotel Images)
-- =====================================================
-- Created: 2025-11-17
-- Purpose: Store hotel images with proper access controls
-- Bucket Name: media (already exists in Supabase)
-- Region: eu-central-1
-- S3 URL: https://mjenrkuzlgxznbrjygfe.storage.supabase.co/storage/v1/s3
-- =====================================================

-- Note: Bucket 'media' already exists in Supabase Dashboard
-- This migration only sets up RLS policies

-- =====================================================
-- Storage RLS Policies for media bucket
-- =====================================================

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated hoteliers and admins to upload images
CREATE POLICY "Hoteliers and admins can upload to media bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'media'
  AND (
    auth.jwt() ->> 'role' = 'hotelier'
    OR auth.jwt() ->> 'role' = 'admin'
  )
);

-- Policy: Allow authenticated hoteliers and admins to read their images
CREATE POLICY "Hoteliers and admins can read from media bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'media'
  AND (
    auth.jwt() ->> 'role' = 'hotelier'
    OR auth.jwt() ->> 'role' = 'admin'
  )
);

-- Policy: Allow authenticated hoteliers and admins to update their images
CREATE POLICY "Hoteliers and admins can update media bucket files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'media'
  AND (
    auth.jwt() ->> 'role' = 'hotelier'
    OR auth.jwt() ->> 'role' = 'admin'
  )
);

-- Policy: Allow authenticated hoteliers and admins to delete their images
CREATE POLICY "Hoteliers and admins can delete from media bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'media'
  AND (
    auth.jwt() ->> 'role' = 'hotelier'
    OR auth.jwt() ->> 'role' = 'admin'
  )
);

-- Policy: Allow service role (backend) full access
-- This is handled by Supabase Admin Client with service_role key

-- =====================================================
-- 3. Create indexes for better performance
-- =====================================================

-- Index for faster lookup by bucket_id
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_id 
ON storage.objects(bucket_id);

-- Index for faster lookup by name within a bucket
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_name 
ON storage.objects(bucket_id, name);

-- =====================================================
-- Notes:
-- =====================================================
-- 1. Bucket 'media' already exists in Supabase Dashboard
-- 2. Images are served via /api/media/[...path] proxy
-- 3. Frontend uses NEXT_PUBLIC_MEDIA_URL for image URLs
-- 4. Backend uses supabaseAdmin.storage for uploads
-- 5. RLS policies ensure only authorized users can access
-- 6. Region: eu-central-1
-- 7. S3 URL: https://mjenrkuzlgxznbrjygfe.storage.supabase.co/storage/v1/s3
-- =====================================================
