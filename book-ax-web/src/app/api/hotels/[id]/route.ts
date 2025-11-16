// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError, NotFoundError } from '@/utils/errors';

// ✅ PERFORMANCE: Cache individual hotel details for 10 minutes
// Hotel details change even less frequently than search results
export const revalidate = 600; // 10 minutes

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';

    // Get hotel with all related data
    const { data: hotel, error } = await supabaseAdmin
      .from('hotels')
      .select(`
        *,
        hotel_translations(
          language,
          name,
          description,
          policies
        ),
        hotel_images(
          id,
          url,
          alt_text,
          display_order,
          is_primary
        ),
        hotel_amenities(
          amenity:amenities(
            id,
            code,
            icon,
            category
          )
        ),
        room_categories(
          id,
          code,
          max_occupancy,
          base_price,
          total_rooms,
          size_sqm,
          bed_type,
          smoking_allowed,
          room_category_translations(
            language,
            name,
            description
          ),
          room_category_amenities(
            amenity:amenities(
              id,
              code,
              icon
            )
          )
        ),
        reviews(
          id,
          rating,
          cleanliness_rating,
          location_rating,
          service_rating,
          value_rating,
          comment,
          created_at,
          user:users(
            first_name,
            last_name
          )
        )
      `)
      .eq('id', id)
      .eq('status', 'approved')
      .single();

    if (error || !hotel) {
      throw new NotFoundError('Hotel');
    }

    // Get translation for requested locale (fallback to English)
    const translation = hotel.hotel_translations.find((t: any) => t.language === locale)
      || hotel.hotel_translations.find((t: any) => t.language === 'en')
      || hotel.hotel_translations[0];

    // Process room categories
    const roomCategories = hotel.room_categories.map((rc: any) => {
      const rcTranslation = rc.room_category_translations.find((t: any) => t.language === locale)
        || rc.room_category_translations.find((t: any) => t.language === 'en')
        || rc.room_category_translations[0];

      return {
        id: rc.id,
        code: rc.code,
        name: rcTranslation?.name || 'Room',
        description: rcTranslation?.description,
        maxOccupancy: rc.max_occupancy,
        basePrice: rc.base_price,
        totalRooms: rc.total_rooms,
        sizeSqm: rc.size_sqm,
        bedType: rc.bed_type,
        smokingAllowed: rc.smoking_allowed,
        amenities: rc.room_category_amenities?.map((rca: any) => rca.amenity) || [],
      };
    });

    // Calculate ratings
    const ratings = hotel.reviews?.map((r: any) => r.rating) || [];
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length
      : 0;

    // Process reviews
    const reviews = hotel.reviews?.map((r: any) => ({
      id: r.id,
      rating: r.rating,
      cleanlinessRating: r.cleanliness_rating,
      locationRating: r.location_rating,
      serviceRating: r.service_rating,
      valueRating: r.value_rating,
      comment: r.comment,
      createdAt: r.created_at,
      guestName: r.user ? `${r.user.first_name} ${r.user.last_name.charAt(0)}.` : 'Anonymous',
    })) || [];

    // Sort images by display order
    const images = hotel.hotel_images?.sort((a: any, b: any) => a.display_order - b.display_order) || [];

    // Build response
    const response = {
      id: hotel.id,
      name: translation?.name || 'Hotel',
      description: translation?.description,
      policies: translation?.policies,
      propertyType: hotel.property_type,
      email: hotel.email,
      phone: hotel.phone,
      website: hotel.website,
      address: {
        street: hotel.address_street,
        city: hotel.address_city,
        state: hotel.address_state,
        postalCode: hotel.address_postal_code,
        country: hotel.address_country,
      },
      coordinates: {
        latitude: hotel.latitude,
        longitude: hotel.longitude,
      },
      checkInTime: hotel.check_in_time,
      checkOutTime: hotel.check_out_time,
      starRating: hotel.star_rating,
      totalRooms: hotel.total_rooms,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: reviews.length,
      images,
      amenities: hotel.hotel_amenities?.map((ha: any) => ha.amenity) || [],
      roomCategories,
      reviews: reviews.slice(0, 10), // Limit to 10 most recent reviews
    };

    return NextResponse.json(response);
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
