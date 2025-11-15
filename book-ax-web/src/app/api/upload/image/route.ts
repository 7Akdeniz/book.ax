import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { handleApiError, ValidationError, AuthorizationError, AuthenticationError } from '@/utils/errors';

// Helper to verify auth (supports both Authorization header and cookies)
function getAuthUser(req: NextRequest) {
  let token: string | undefined;

  // 1. Try Authorization header first
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // 2. Fallback to cookie
  if (!token) {
    token = req.cookies.get('accessToken')?.value;
  }

  if (!token) {
    throw new AuthenticationError('No authentication token provided');
  }

  const decoded = verifyAccessToken(token);
  
  if (!decoded) {
    throw new AuthenticationError('Invalid or expired token');
  }

  return decoded;
}

// =====================================================
// POST: Upload image file to Supabase Storage
// =====================================================
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    
    // Check role
    if (user.role !== 'hotelier' && user.role !== 'admin') {
      throw new AuthorizationError('Only hoteliers and admins can upload images');
    }

    // Get form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const hotelId = formData.get('hotelId') as string | null;

    if (!file) {
      throw new ValidationError('No file provided');
    }

    if (!hotelId) {
      throw new ValidationError('Hotel ID is required');
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
    const fileExt = file.name.split('.').pop();
    const fileName = `${hotelId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('hotel-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase Storage error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Generate media subdomain URL (media.book.ax)
    const mediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_URL || 'https://media.book.ax';
    const mediaUrl = `${mediaBaseUrl}/${fileName}`;

    return NextResponse.json({
      message: 'Image uploaded successfully',
      url: mediaUrl,
      fileName: data.path,
    }, { status: 201 });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
