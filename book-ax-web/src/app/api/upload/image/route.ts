// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { handleApiError, ValidationError, AuthorizationError, AuthenticationError } from '@/utils/errors';

// Helper to verify auth (supports both Authorization header and cookies)
function getAuthUser(req: NextRequest) {
  let token: string | undefined;

  console.log('[Upload API] Checking authentication...');
  console.log('[Upload API] Headers:', {
    authorization: req.headers.get('authorization') ? 'present' : 'missing',
    cookie: req.headers.get('cookie') ? 'present' : 'missing',
  });
  console.log('[Upload API] Cookies:', {
    accessToken: req.cookies.get('accessToken') ? 'present' : 'missing',
    refreshToken: req.cookies.get('refreshToken') ? 'present' : 'missing',
  });

  // 1. Try Authorization header first
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
    console.log('[Upload API] Using Bearer token from header');
  }

  // 2. Fallback to cookie
  if (!token) {
    token = req.cookies.get('accessToken')?.value;
    if (token) {
      console.log('[Upload API] Using token from cookie');
    }
  }

  if (!token) {
    console.error('[Upload API] No token found in header or cookies');
    throw new AuthenticationError('No authentication token provided');
  }

  const decoded = verifyAccessToken(token);
  
  if (!decoded) {
    console.error('[Upload API] Token verification failed');
    throw new AuthenticationError('Invalid or expired token');
  }

  console.log('[Upload API] Token verified successfully');
  return decoded;
}

// =====================================================
// POST: Upload image file to Supabase Storage
// =====================================================
export async function POST(req: NextRequest) {
  try {
    console.log('[Upload API] Starting image upload...');
    const user = getAuthUser(req);
    console.log('[Upload API] User authenticated:', { userId: user.userId, role: user.role });
    
    // Check role
    if (user.role !== 'hotelier' && user.role !== 'admin') {
      console.error('[Upload API] Authorization failed: invalid role', user.role);
      throw new AuthorizationError('Only hoteliers and admins can upload images');
    }

    // Get form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const hotelId = formData.get('hotelId') as string | null;
    console.log('[Upload API] File info:', { 
      fileName: file?.name, 
      fileSize: file?.size, 
      fileType: file?.type,
      hotelId 
    });

    if (!file) {
      console.error('[Upload API] No file provided');
      throw new ValidationError('No file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new ValidationError('Only JPEG, PNG, and WebP images are allowed');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new ValidationError('File size must be less than 5MB');
    }

    // Generate unique filename
    // If no hotelId provided (during hotel creation), use 'temp' folder
    const folder = hotelId || 'temp';
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    console.log('[Upload API] Uploading to Supabase Storage:', fileName);
    const { data, error } = await supabaseAdmin.storage
      .from('media')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('[Upload API] Supabase Storage error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    console.log('[Upload API] Upload successful:', data);

    // Generate media subdomain URL (media.book.ax)
    const mediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_URL || 'https://media.book.ax';
    const mediaUrl = `${mediaBaseUrl}/${fileName}`;
    console.log('[Upload API] Generated URL:', mediaUrl);

    return NextResponse.json({
      message: 'Image uploaded successfully',
      url: mediaUrl,
      fileName: data.path,
    }, { status: 201 });
  } catch (error) {
    console.error('[Upload API] Error:', error);
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
