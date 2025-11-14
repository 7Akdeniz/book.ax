import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { handleApiError, NotFoundError, AuthorizationError, AuthenticationError } from '@/utils/errors';

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
// DELETE: Delete a specific image
// =====================================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const user = getAuthUser(req);
    
    // Check role
    if (user.role !== 'hotelier' && user.role !== 'admin') {
      throw new AuthorizationError('Only hoteliers and admins can delete images');
    }

    const { id: hotelId, imageId } = params;

    // Verify hotel ownership
    await verifyHotelOwnership(hotelId, user.userId, user.role);

    // Verify image exists and belongs to this hotel
    const { data: image, error: imageError } = await supabaseAdmin
      .from('hotel_images')
      .select('id, url, hotel_id')
      .eq('id', imageId)
      .eq('hotel_id', hotelId)
      .single();

    if (imageError || !image) {
      throw new NotFoundError('Image');
    }

    // TODO: Delete from Supabase Storage
    // Extract file path from URL and delete
    // const filePath = extractFilePathFromUrl(image.url);
    // await supabase.storage.from('hotel-images').remove([filePath]);

    // Delete image record from database
    const { error: deleteError } = await supabaseAdmin
      .from('hotel_images')
      .delete()
      .eq('id', imageId);

    if (deleteError) throw deleteError;

    return NextResponse.json({
      message: 'Image deleted successfully',
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
