// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { handleApiError, ValidationError, NotFoundError, AuthorizationError, AuthenticationError } from '@/utils/errors';
import { z } from 'zod';

// Validation Schema
const ImageUploadSchema = z.object({
  url: z.string().url(), // Image URL (after upload to Supabase Storage)
  altText: z.string().max(255).optional(),
  displayOrder: z.number().int().min(0).default(0),
  isPrimary: z.boolean().default(false),
});

// Helper to verify auth
function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('No authentication token provided');
  }

  const token = authHeader.substring(7);
  const decoded = verifyAccessToken(token);
  
  if (!decoded) {
    throw new AuthenticationError('Invalid or expired token');
  }

  return decoded;
}

// Helper to verify hotel ownership
async function verifyHotelOwnership(hotelId: string, userId: string, userRole: string) {
  const { data: hotel, error } = await supabaseAdmin
    .from('hotels')
    .select('id, owner_id')
    .eq('id', hotelId)
    .single();

  if (error || !hotel) {
    throw new NotFoundError('Hotel');
  }

  if (userRole === 'hotelier' && hotel.owner_id !== userId) {
    throw new AuthorizationError('You can only modify your own hotels');
  }

  return hotel;
}

// =====================================================
// GET: Get all images for a hotel
// =====================================================
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: hotelId } = params;

    // Verify hotel exists (public route, no auth required)
    const { data: hotel, error: hotelError } = await supabaseAdmin
      .from('hotels')
      .select('id')
      .eq('id', hotelId)
      .single();

    if (hotelError || !hotel) {
      throw new NotFoundError('Hotel');
    }

    // Get all images
    const { data: images, error } = await supabaseAdmin
      .from('hotel_images')
      .select('*')
      .eq('hotel_id', hotelId)
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ images: images || [] });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// =====================================================
// POST: Add a new image
// =====================================================
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(req);
    
    // Check role
    if (user.role !== 'hotelier' && user.role !== 'admin') {
      throw new AuthorizationError('Only hoteliers and admins can upload images');
    }

    const { id: hotelId } = params;
    const body = await req.json();

    // Validate input
    const data = ImageUploadSchema.parse(body);

    // Verify hotel ownership
    await verifyHotelOwnership(hotelId, user.userId, user.role);

    // If this is marked as primary, unmark all other images
    if (data.isPrimary) {
      await supabaseAdmin
        .from('hotel_images')
        .update({ is_primary: false })
        .eq('hotel_id', hotelId);
    }

    // Insert image
    const { data: image, error } = await supabaseAdmin
      .from('hotel_images')
      .insert({
        hotel_id: hotelId,
        url: data.url,
        alt_text: data.altText || null,
        display_order: data.displayOrder,
        is_primary: data.isPrimary,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Image added successfully',
      image,
    }, { status: 201 });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// =====================================================
// PUT: Update image order or set as primary
// =====================================================
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(req);
    
    // Check role
    if (user.role !== 'hotelier' && user.role !== 'admin') {
      throw new AuthorizationError('Only hoteliers and admins can update images');
    }

    const { id: hotelId } = params;
    const body = await req.json();

    // Expect array of image updates: [{ id, displayOrder, isPrimary }]
    const updates = z.array(z.object({
      id: z.string().uuid(),
      displayOrder: z.number().int().min(0).optional(),
      isPrimary: z.boolean().optional(),
      altText: z.string().max(255).optional(),
    })).parse(body);

    // Verify hotel ownership
    await verifyHotelOwnership(hotelId, user.userId, user.role);

    // Check if any image is being set as primary
    const newPrimaryImage = updates.find(u => u.isPrimary === true);
    if (newPrimaryImage) {
      // Unmark all current primary images
      await supabaseAdmin
        .from('hotel_images')
        .update({ is_primary: false })
        .eq('hotel_id', hotelId);
    }

    // Update each image
    for (const update of updates) {
      const updateData: any = {};
      if (update.displayOrder !== undefined) updateData.display_order = update.displayOrder;
      if (update.isPrimary !== undefined) updateData.is_primary = update.isPrimary;
      if (update.altText !== undefined) updateData.alt_text = update.altText;

      await supabaseAdmin
        .from('hotel_images')
        .update(updateData)
        .eq('id', update.id)
        .eq('hotel_id', hotelId); // Security: ensure image belongs to this hotel
    }

    // Fetch updated images
    const { data: images } = await supabaseAdmin
      .from('hotel_images')
      .select('*')
      .eq('hotel_id', hotelId)
      .order('display_order', { ascending: true });

    return NextResponse.json({
      message: 'Images updated successfully',
      images,
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
