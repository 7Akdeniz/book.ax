import { NextRequest, NextResponse } from 'next/server';
import { requireHotelier } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';
import { z } from 'zod';

// ✅ Dynamic route
export const dynamic = 'force-dynamic';

// Validation schema for image upload
const addImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  altText: z.string().optional(),
  isPrimary: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
});

/**
 * POST /api/panel/hotels/[id]/images
 * Add an image to a hotel (Hotelier only, must own the hotel)
 */
export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return requireHotelier(async (authReq) => {
    try {
      const hotelId = context.params.id;
      const userId = authReq.user!.userId;
      const body = await req.json();

      // Validate input
      const validation = addImageSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: validation.error.errors[0].message },
          { status: 400 }
        );
      }

      const data = validation.data;

      // Verify hotel ownership
      const { data: hotel, error: hotelError } = await supabaseAdmin
        .from('hotels')
        .select('id, hotelier_id')
        .eq('id', hotelId)
        .single();

      if (hotelError || !hotel) {
        return NextResponse.json(
          { error: 'Hotel not found' },
          { status: 404 }
        );
      }

      if (hotel.hotelier_id !== userId) {
        return NextResponse.json(
          { error: 'You do not have permission to modify this hotel' },
          { status: 403 }
        );
      }

      // If this image should be primary, unset all other primary images
      if (data.isPrimary) {
        await supabaseAdmin
          .from('hotel_images')
          .update({ is_primary: false })
          .eq('hotel_id', hotelId);
      }

      // Insert image
      const { data: image, error: insertError } = await supabaseAdmin
        .from('hotel_images')
        .insert({
          hotel_id: hotelId,
          url: data.url,
          alt_text: data.altText || null,
          is_primary: data.isPrimary,
          display_order: data.displayOrder,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return NextResponse.json({
        message: 'Image added successfully',
        image: {
          id: image.id,
          url: image.url,
          altText: image.alt_text,
          isPrimary: image.is_primary,
          displayOrder: image.display_order,
        },
      }, { status: 201 });

    } catch (error) {
      console.error('Error adding hotel image:', error);
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req);
}

/**
 * GET /api/panel/hotels/[id]/images
 * Get all images for a hotel
 */
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return requireHotelier(async (authReq) => {
    try {
      const hotelId = context.params.id;
      const userId = authReq.user!.userId;

      // Verify hotel ownership
      const { data: hotel, error: hotelError } = await supabaseAdmin
        .from('hotels')
        .select('id, hotelier_id')
        .eq('id', hotelId)
        .single();

      if (hotelError || !hotel) {
        return NextResponse.json(
          { error: 'Hotel not found' },
          { status: 404 }
        );
      }

      if (hotel.hotelier_id !== userId) {
        return NextResponse.json(
          { error: 'You do not have permission to access this hotel' },
          { status: 403 }
        );
      }

      // Get all images
      const { data: images, error } = await supabaseAdmin
        .from('hotel_images')
        .select('*')
        .eq('hotel_id', hotelId)
        .order('display_order', { ascending: true });

      if (error) throw error;

      return NextResponse.json({
        images: images.map((img: any) => ({
          id: img.id,
          url: img.url,
          altText: img.alt_text,
          isPrimary: img.is_primary,
          displayOrder: img.display_order,
          createdAt: img.created_at,
        })),
        total: images.length,
      });

    } catch (error) {
      console.error('Error fetching hotel images:', error);
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req);
}

/**
 * DELETE /api/panel/hotels/[id]/images?imageId=xxx
 * Delete an image from a hotel
 */
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return requireHotelier(async (authReq) => {
    try {
      const hotelId = context.params.id;
      const userId = authReq.user!.userId;
      const { searchParams } = req.nextUrl;
      const imageId = searchParams.get('imageId');

      if (!imageId) {
        return NextResponse.json(
          { error: 'imageId parameter is required' },
          { status: 400 }
        );
      }

      // Verify hotel ownership
      const { data: hotel, error: hotelError } = await supabaseAdmin
        .from('hotels')
        .select('id, hotelier_id')
        .eq('id', hotelId)
        .single();

      if (hotelError || !hotel) {
        return NextResponse.json(
          { error: 'Hotel not found' },
          { status: 404 }
        );
      }

      if (hotel.hotelier_id !== userId) {
        return NextResponse.json(
          { error: 'You do not have permission to modify this hotel' },
          { status: 403 }
        );
      }

      // Delete image
      const { error: deleteError } = await supabaseAdmin
        .from('hotel_images')
        .delete()
        .eq('id', imageId)
        .eq('hotel_id', hotelId); // Double-check hotel ownership

      if (deleteError) throw deleteError;

      return NextResponse.json({
        message: 'Image deleted successfully',
      });

    } catch (error) {
      console.error('Error deleting hotel image:', error);
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req);
}
