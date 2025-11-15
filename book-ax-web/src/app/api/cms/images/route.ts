// =====================================================
// API: POST /api/cms/images - Upload image
// API: GET /api/cms/images - List images
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, type AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';

// =====================================================
// GET - List Images
// =====================================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get('folder');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);

    let query = supabaseAdmin
      .from('cms_images')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (folder) {
      query = query.eq('folder', folder);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: images, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      images: images || [],
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// =====================================================
// POST - Upload Image
// =====================================================
export async function POST(req: NextRequest) {
  return requireAdmin(async (authReq: AuthenticatedRequest) => {
    try {
      const formData = await authReq.formData();
      const file = formData.get('file') as File;
      const alt_text = formData.get('alt_text') as string;
      const caption = formData.get('caption') as string;
      const folder = formData.get('folder') as string || 'uploads';
      const tags = formData.get('tags') as string;

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG' },
          { status: 400 }
        );
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'File too large. Maximum size: 10MB' },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop();
      const filename = `${timestamp}-${randomString}.${extension}`;
      const storagePath = `${folder}/${filename}`;

      // Convert File to Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin
        .storage
        .from('cms-media') // Bucket name
        .upload(storagePath, buffer, {
          contentType: file.type,
          cacheControl: '31536000', // 1 year
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabaseAdmin
        .storage
        .from('cms-media')
        .getPublicUrl(storagePath);

      // Get image dimensions if possible
      let width: number | null = null;
      let height: number | null = null;

      // For simple images, try to extract dimensions (optional)
      // This would require a library like 'sharp' in production
      // For now, we'll leave it as null

      // Save to database
      const { data: image, error: dbError } = await supabaseAdmin
        .from('cms_images')
        .insert({
          filename,
          original_filename: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          width,
          height,
          storage_path: storagePath,
          cdn_url: urlData.publicUrl,
          thumbnail_url: null, // Could generate thumbnail with sharp
          alt_text: alt_text || null,
          caption: caption || null,
          uploader_id: authReq.user?.userId || null,
          folder,
          tags: tags ? tags.split(',').map(t => t.trim()) : null,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return NextResponse.json({
        image,
        message: 'Image uploaded successfully',
      }, { status: 201 });
    } catch (error) {
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req as AuthenticatedRequest);
}
