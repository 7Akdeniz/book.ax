import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { handleApiError, ValidationError, NotFoundError, AuthorizationError, AuthenticationError } from '@/utils/errors';
import { z } from 'zod';

// Validation Schemas
const RoomCategorySchema = z.object({
  code: z.string().min(1).max(50),
  maxOccupancy: z.number().int().min(1).max(20),
  basePrice: z.number().positive(),
  totalRooms: z.number().int().min(1).max(1000),
  sizeSqm: z.number().positive().optional(),
  bedType: z.string().max(50).optional(),
  smokingAllowed: z.boolean().default(false),
  amenities: z.array(z.string().uuid()).optional(), // Array of amenity IDs
  translations: z.array(z.object({
    language: z.string().length(2).or(z.string().length(3)),
    name: z.string().min(1).max(255),
    description: z.string().optional(),
  })).min(1),
});

const RoomCategoryUpdateSchema = RoomCategorySchema.partial().omit({ translations: true });

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
// GET: Get all room categories for a hotel
// =====================================================
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: hotelId } = params;
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';

    // Verify hotel exists (public route, no auth required for GET)
    const { data: hotel, error: hotelError } = await supabaseAdmin
      .from('hotels')
      .select('id')
      .eq('id', hotelId)
      .single();

    if (hotelError || !hotel) {
      throw new NotFoundError('Hotel');
    }

    // Get all room categories with translations and amenities
    const { data: roomCategories, error } = await supabaseAdmin
      .from('room_categories')
      .select(`
        *,
        room_category_translations(
          language,
          name,
          description
        ),
        room_category_amenities(
          amenity:amenities(
            id,
            code,
            icon,
            category
          )
        )
      `)
      .eq('hotel_id', hotelId)
      .order('code', { ascending: true });

    if (error) throw error;

    // Format response with locale-specific translations
    const formattedCategories = (roomCategories || []).map((rc: any) => {
      const translation = rc.room_category_translations.find((t: any) => t.language === locale)
        || rc.room_category_translations.find((t: any) => t.language === 'en')
        || rc.room_category_translations[0];

      return {
        id: rc.id,
        hotelId: rc.hotel_id,
        code: rc.code,
        name: translation?.name || 'Room',
        description: translation?.description,
        maxOccupancy: rc.max_occupancy,
        basePrice: rc.base_price,
        totalRooms: rc.total_rooms,
        sizeSqm: rc.size_sqm,
        bedType: rc.bed_type,
        smokingAllowed: rc.smoking_allowed,
        amenities: rc.room_category_amenities?.map((rca: any) => rca.amenity) || [],
        translations: rc.room_category_translations,
        createdAt: rc.created_at,
        updatedAt: rc.updated_at,
      };
    });

    return NextResponse.json({ roomCategories: formattedCategories });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// =====================================================
// POST: Create a new room category
// =====================================================
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(req);
    
    // Check role
    if (user.role !== 'hotelier' && user.role !== 'admin') {
      throw new AuthorizationError('Only hoteliers and admins can create room categories');
    }

    const { id: hotelId } = params;
    const body = await req.json();

    // Validate input
    const data = RoomCategorySchema.parse(body);

    // Verify hotel ownership
    await verifyHotelOwnership(hotelId, user.userId, user.role);

    // Check if code already exists for this hotel
    const { data: existing } = await supabaseAdmin
      .from('room_categories')
      .select('id')
      .eq('hotel_id', hotelId)
      .eq('code', data.code)
      .single();

    if (existing) {
      throw new ValidationError(`Room category with code '${data.code}' already exists for this hotel`);
    }

    // Create room category
    const { data: roomCategory, error: rcError } = await supabaseAdmin
      .from('room_categories')
      .insert({
        hotel_id: hotelId,
        code: data.code,
        max_occupancy: data.maxOccupancy,
        base_price: data.basePrice,
        total_rooms: data.totalRooms,
        size_sqm: data.sizeSqm || null,
        bed_type: data.bedType || null,
        smoking_allowed: data.smokingAllowed,
      })
      .select()
      .single();

    if (rcError) throw rcError;

    // Insert translations
    const translationsToInsert = data.translations.map(t => ({
      room_category_id: roomCategory.id,
      language: t.language,
      name: t.name,
      description: t.description || null,
    }));

    const { error: transError } = await supabaseAdmin
      .from('room_category_translations')
      .insert(translationsToInsert);

    if (transError) throw transError;

    // Insert amenities if provided
    if (data.amenities && data.amenities.length > 0) {
      const amenityMappings = data.amenities.map(amenityId => ({
        room_category_id: roomCategory.id,
        amenity_id: amenityId,
      }));

      const { error: amenityError } = await supabaseAdmin
        .from('room_category_amenities')
        .insert(amenityMappings);

      if (amenityError) throw amenityError;
    }

    // Initialize inventory for next 365 days
    const today = new Date();
    const inventoryData = [];
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      inventoryData.push({
        room_category_id: roomCategory.id,
        date: date.toISOString().split('T')[0],
        total_rooms: data.totalRooms,
        available_rooms: data.totalRooms,
      });
    }

    const { error: invError } = await supabaseAdmin
      .from('inventory')
      .insert(inventoryData);

    if (invError) throw invError;

    // Update hotel's total_rooms count
    const { error: hotelUpdateError } = await supabaseAdmin.rpc(
      'update_hotel_total_rooms',
      { hotel_id: hotelId }
    );

    // If RPC doesn't exist, manually calculate
    if (hotelUpdateError) {
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

    // Fetch the complete room category with translations and amenities
    const { data: completeRoomCategory } = await supabaseAdmin
      .from('room_categories')
      .select(`
        *,
        room_category_translations(*),
        room_category_amenities(
          amenity:amenities(*)
        )
      `)
      .eq('id', roomCategory.id)
      .single();

    return NextResponse.json({
      message: 'Room category created successfully',
      roomCategory: completeRoomCategory,
    }, { status: 201 });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
