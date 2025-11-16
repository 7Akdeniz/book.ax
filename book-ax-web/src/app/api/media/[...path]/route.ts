// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';

// Use Vercel Edge Runtime for better performance and global distribution
export const runtime = 'edge';

/**
 * Media Proxy - Serves images from private Supabase Storage bucket
 * via media.book.ax subdomain
 * 
 * Example: https://media.book.ax/hotel-uuid/image.jpg
 * → Fetches from Supabase Storage bucket 'hotel-images'
 * → Returns with CDN caching headers
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Reconstruct file path from URL segments
    const filePath = params.path.join('/');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    // Fetch file from private Supabase Storage bucket
    const { data, error } = await supabaseAdmin.storage
      .from('hotel-images')
      .download(filePath);

    if (error) {
      console.error('Supabase Storage error:', error);
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Determine content type from file extension
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    const contentType = getContentType(fileExtension);

    // Convert Blob to ArrayBuffer for Response
    const arrayBuffer = await data.arrayBuffer();

    // Return file with CDN-friendly headers
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 year cache
        'Access-Control-Allow-Origin': '*', // Allow CORS
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'X-Content-Type-Options': 'nosniff', // Security header
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

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}

/**
 * Get MIME type from file extension
 */
function getContentType(extension?: string): string {
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    // Documents (future)
    pdf: 'application/pdf',
  };

  return mimeTypes[extension || ''] || 'application/octet-stream';
}
