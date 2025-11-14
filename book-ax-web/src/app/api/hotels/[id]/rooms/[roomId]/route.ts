import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { handleApiError, ValidationError, NotFoundError, AuthorizationError, AuthenticationError } from '@/utils/errors';
import { z } from 'zod';

// Validation Schema
const RoomCategoryUpdateSchema = z.object({
  code: z.string().min(1).max(50).optional(),
  maxOccupancy: z.number().int().min(1).max(20).optional(),
  basePrice: z.number().positive().optional(),
  totalRooms: z.number().int().min(1).max(1000).optional(),
  sizeSqm: z.number().positive().optional(),
  bedType: z.string().max(50).optional(),
  smokingAllowed: z.boolean().optional(),
  amenities: z.array(z.string().uuid()).optional(),
  translations: z.array(z.object({
    language: z.string().length(2).or(z.string().length(3)),
    name: z.string().min(1).max(255),
    description: z.string().optional(),
  })).optional(),
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
// GET: Get a single room category
// =====================================================
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; roomId: string } }
) {
  try {
    const { id: hotelId, roomId } = params;
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';

    // Get room category with all details
    const { data: roomCategory, error } = await supabaseAdmin
      .from('room_categories')
      .select(`
        *,
        room_category_translations(*),
        room_category_amenities(
          amenity:amenities(*)
        )
      `)
      .eq('id', roomId)
      .eq('hotel_id', hotelId)
      .single();

    if (error || !roomCategory) {
      throw new NotFoundError('Room category');
    }

    // Format response with locale-specific translation
    const translation = roomCategory.room_category_translations.find((t: any) => t.language === locale)
      || roomCategory.room_category_translations.find((t: any) => t.language === 'en')
      || roomCategory.room_category_translations[0];

    const response = {
      id: roomCategory.id,
      hotelId: roomCategory.hotel_id,
      code: roomCategory.code,
      name: translation?.name || 'Room',
      description: translation?.description,
      maxOccupancy: roomCategory.max_occupancy,
      basePrice: roomCategory.base_price,
      totalRooms: roomCategory.total_rooms,
      sizeSqm: roomCategory.size_sqm,
      bedType: roomCategory.bed_type,
      smokingAllowed: roomCategory.smoking_allowed,
      amenities: roomCategory.room_category_amenities?.map((rca: any) => rca.amenity) || [],
      translations: roomCategory.room_category_translations,
      createdAt: roomCategory.created_at,
      updatedAt: roomCategory.updated_at,
    };

    return NextResponse.json(response);
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// =====================================================
// PUT: Update a room category
// =====================================================
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; roomId: string } }
) {
  try {
    const user = getAuthUser(req);
    
    // Check role
    if (user.role !== 'hotelier' && user.role !== 'admin') {
      throw new AuthorizationError('Only hoteliers and admins can update room categories');
    }

    const { id: hotelId, roomId } = params;
    const body = await req.json();

    // Validate input
    const data = RoomCategoryUpdateSchema.parse(body);

    // Verify hotel ownership
    await verifyHotelOwnership(hotelId, user.userId, user.role);

    // Verify room category exists and belongs to this hotel
    const { data: existing, error: existError } = await supabaseAdmin
      .from('room_categories')
      .select('id, hotel_id, total_rooms')
      .eq('id', roomId)
      .eq('hotel_id', hotelId)
      .single();

    if (existError || !existing) {
      throw new NotFoundError('Room category');
    }

    // Check if code is being changed and already exists
    if (data.code) {
      const { data: codeExists } = await supabaseAdmin
        .from('room_categories')
        .select('id')
        .eq('hotel_id', hotelId)
        .eq('code', data.code)
        .neq('id', roomId)
        .single();

      if (codeExists) {
        throw new ValidationError(`Room category with code '${data.code}' already exists for this hotel`);
      }
    }

    // Update room category
    const updateData: any = {};
    if (data.code !== undefined) updateData.code = data.code;
    if (data.maxOccupancy !== undefined) updateData.max_occupancy = data.maxOccupancy;
    if (data.basePrice !== undefined) updateData.base_price = data.basePrice;
    if (data.totalRooms !== undefined) updateData.total_rooms = data.totalRooms;
    if (data.sizeSqm !== undefined) updateData.size_sqm = data.sizeSqm;
    if (data.bedType !== undefined) updateData.bed_type = data.bedType;
    if (data.smokingAllowed !== undefined) updateData.smoking_allowed = data.smokingAllowed;

    const { error: updateError } = await supabaseAdmin
      .from('room_categories')
      .update(updateData)
      .eq('id', roomId);

    if (updateError) throw updateError;

    // Update translations if provided
    if (data.translations && data.translations.length > 0) {
      const translationsToUpsert = data.translations.map(t => ({
        room_category_id: roomId,
        language: t.language,
        name: t.name,
        description: t.description || null,
      }));

      const { error: transError } = await supabaseAdmin
        .from('room_category_translations')
        .upsert(translationsToUpsert, {
          onConflict: 'room_category_id,language',
          ignoreDuplicates: false,
        });

      if (transError) throw transError;
    }

    // Update amenities if provided
    if (data.amenities !== undefined) {
      // Delete existing amenities
      await supabaseAdmin
        .from('room_category_amenities')
        .delete()
        .eq('room_category_id', roomId);

      // Insert new amenities
      if (data.amenities.length > 0) {
        const amenityMappings = data.amenities.map(amenityId => ({
          room_category_id: roomId,
          amenity_id: amenityId,
        }));

        const { error: amenityError } = await supabaseAdmin
          .from('room_category_amenities')
          .insert(amenityMappings);

        if (amenityError) throw amenityError;
      }
    }

    // If total_rooms changed, update inventory
    if (data.totalRooms !== undefined && data.totalRooms !== existing.total_rooms) {
      const difference = data.totalRooms - existing.total_rooms;

      // Update future inventory (from today onwards)
      const today = new Date().toISOString().split('T')[0];
      
      // Get all future inventory records
      const { data: futureInventory } = await supabaseAdmin
        .from('inventory')
        .select('id, available_rooms')
        .eq('room_category_id', roomId)
        .gte('date', today);

      // Update each record
      if (futureInventory) {
        for (const inv of futureInventory) {
          const newAvailable = Math.max(0, inv.available_rooms + difference);
          await supabaseAdmin
            .from('inventory')
            .update({
              total_rooms: data.totalRooms,
              available_rooms: newAvailable,
            })
            .eq('id', inv.id);
        }
      }

      // Update hotel's total_rooms count
      const { data: allCategories } = await supabaseAdmin
        .from('room_categories')
        .select('total_rooms')
        .eq('hotel_id', hotelId);

      const totalRooms = (allCategories || []).reduce((sum: number, rc: any) => sum + rc.total_rooms, 0);

      await supabaseAdmin
        .from('hotels')
        .update({ total_rooms: totalRooms })
        .eq('id', hotelId);
    }

    // Fetch updated room category
    const { data: updatedCategory } = await supabaseAdmin
      .from('room_categories')
      .select(`
        *,
        room_category_translations(*),
        room_category_amenities(
          amenity:amenities(*)
        )
      `)
      .eq('id', roomId)
      .single();

    return NextResponse.json({
      message: 'Room category updated successfully',
      roomCategory: updatedCategory,
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// =====================================================
// DELETE: Delete a room category
// =====================================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; roomId: string } }
) {
  try {
    const user = getAuthUser(req);
    
    // Check role
    if (user.role !== 'hotelier' && user.role !== 'admin') {
      throw new AuthorizationError('Only hoteliers and admins can delete room categories');
    }

    const { id: hotelId, roomId } = params;

    // Verify hotel ownership
    await verifyHotelOwnership(hotelId, user.userId, user.role);

    // Verify room category exists and belongs to this hotel
    const { data: existing, error: existError } = await supabaseAdmin
      .from('room_categories')
      .select('id, hotel_id')
      .eq('id', roomId)
      .eq('hotel_id', hotelId)
      .single();

    if (existError || !existing) {
      throw new NotFoundError('Room category');
    }

    // Check if there are any bookings for this room category
    const { data: bookings } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('room_category_id', roomId)
      .limit(1);

    if (bookings && bookings.length > 0) {
      throw new ValidationError('Cannot delete room category with existing bookings. Please cancel or complete all bookings first.');
    }

    // Delete room category (CASCADE will handle translations, amenities, inventory, rates)
    const { error: deleteError } = await supabaseAdmin
      .from('room_categories')
      .delete()
      .eq('id', roomId);

    if (deleteError) throw deleteError;

    // Update hotel's total_rooms count
    const { data: allCategories } = await supabaseAdmin
      .from('room_categories')
      .select('total_rooms')
      .eq('hotel_id', hotelId);

    const totalRooms = (allCategories || []).reduce((sum: number, rc: any) => sum + rc.total_rooms, 0);

    await supabaseAdmin
      .from('hotels')
      .update({ total_rooms: totalRooms })
      .eq('id', hotelId);

    return NextResponse.json({
      message: 'Room category deleted successfully',
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
