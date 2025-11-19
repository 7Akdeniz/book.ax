import { NextRequest, NextResponse } from 'next/server';
import { requireHotelier } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';
import { z } from 'zod';

// ✅ Dynamic route
export const dynamic = 'force-dynamic';

// Validation schema for hotel creation
const createHotelSchema = z.object({
  // Basic Info
  propertyType: z.enum(['hotel', 'apartment', 'hostel', 'guesthouse', 'villa', 'resort']),
  name: z.string().min(3, 'Hotel name must be at least 3 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  starRating: z.number().int().min(1).max(5),
  checkInTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  checkOutTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  totalRooms: z.number().int().min(1).optional(),
  commissionPercentage: z.number().min(10).max(50),

  // Address & Contact
  addressStreet: z.string().min(5),
  addressCity: z.string().min(2),
  addressState: z.string().optional(),
  addressPostalCode: z.string().min(3),
  addressCountry: z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email(),
  website: z.string().url().optional().or(z.literal('')),
  latitude: z.number().optional(),
  longitude: z.number().optional(),

  // Locale for translation
  locale: z.string().default('de'),
});

/**
 * POST /api/panel/hotels
 * Create a new hotel (Hotelier only)
 */
export const POST = requireHotelier(async (req) => {
  try {
    const body = await req.json();
    
    // Validate input
    const validation = createHotelSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = validation.data;
    const userId = req.user!.userId; // from requireHotelier middleware

    // Check if hotelier already has a hotel
    const { data: existingHotels, error: checkError } = await supabaseAdmin
      .from('hotels')
      .select('id')
      .eq('hotelier_id', userId)
      .limit(1);

    if (checkError) throw checkError;

    // For now, allow multiple hotels per hotelier
    // In future, you might want to restrict to 1 hotel or require approval

    // Create hotel
    const { data: hotel, error: hotelError } = await supabaseAdmin
      .from('hotels')
      .insert({
        hotelier_id: userId,
        property_type: data.propertyType,
        star_rating: data.starRating,
        address_street: data.addressStreet,
        address_city: data.addressCity,
        address_state: data.addressState,
        address_postal_code: data.addressPostalCode,
        address_country: data.addressCountry,
        latitude: data.latitude,
        longitude: data.longitude,
        contact_phone: data.phone,
        contact_email: data.email,
        website: data.website || null,
        check_in_time: data.checkInTime,
        check_out_time: data.checkOutTime,
        total_rooms: data.totalRooms || 0,
        commission_percentage: data.commissionPercentage,
        status: 'pending', // Requires admin approval
      })
      .select()
      .single();

    if (hotelError) throw hotelError;

    // Create hotel translation
    const { error: translationError } = await supabaseAdmin
      .from('hotel_translations')
      .insert({
        hotel_id: hotel.id,
        language: data.locale,
        name: data.name,
        description: data.description,
      });

    if (translationError) throw translationError;

    return NextResponse.json({
      message: 'Hotel created successfully. Pending admin approval.',
      hotel: {
        id: hotel.id,
        name: data.name,
        status: hotel.status,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating hotel:', error);
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
});

/**
 * GET /api/panel/hotels
 * Get all hotels for the authenticated hotelier
 */
export const GET = requireHotelier(async (req) => {
  try {
    const userId = req.user!.userId;

    const { data: hotels, error } = await supabaseAdmin
      .from('hotels')
      .select(`
        *,
        hotel_translations!inner(
          language,
          name,
          description
        ),
        hotel_images(
          id,
          url,
          is_primary
        )
      `)
      .eq('hotelier_id', userId)
      .eq('hotel_translations.language', 'de') // Default to German
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Format response
    const formattedHotels = hotels.map((hotel: any) => ({
      id: hotel.id,
      name: hotel.hotel_translations[0]?.name || 'Unnamed Hotel',
      description: hotel.hotel_translations[0]?.description,
      propertyType: hotel.property_type,
      starRating: hotel.star_rating,
      city: hotel.address_city,
      country: hotel.address_country,
      status: hotel.status,
      totalRooms: hotel.total_rooms,
      commissionPercentage: hotel.commission_percentage,
      primaryImage: hotel.hotel_images?.find((img: any) => img.is_primary)?.url,
      createdAt: hotel.created_at,
    }));

    return NextResponse.json({
      hotels: formattedHotels,
      total: formattedHotels.length,
    });

  } catch (error) {
    console.error('Error fetching hotels:', error);
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
});
