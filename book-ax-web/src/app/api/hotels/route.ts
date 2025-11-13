import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { searchSchema } from '@/utils/validation';
import { handleApiError } from '@/utils/errors';

// ✅ PERFORMANCE: Cache hotel search results for 5 minutes
// Hotels don't change frequently, so we can cache the results
export const revalidate = 300; // 5 minutes in seconds

// ✅ PERFORMANCE: Enable Edge Runtime for faster response times
// export const runtime = 'edge'; // Optional: Enable if needed

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const params = {
      destination: searchParams.get('destination') || undefined,
      checkIn: searchParams.get('checkIn') || undefined,
      checkOut: searchParams.get('checkOut') || undefined,
      guests: searchParams.get('guests') ? parseInt(searchParams.get('guests')!) : undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
      amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || undefined,
      propertyType: searchParams.get('propertyType')?.split(',').filter(Boolean) || undefined,
      locale: searchParams.get('locale') || 'en',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      sortBy: (searchParams.get('sortBy') as 'price' | 'rating' | 'distance') || 'rating',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };

    // Validate
    const validation = searchSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { destination, checkIn, checkOut, guests, minPrice, maxPrice, minRating, amenities, propertyType, page, limit, sortBy, sortOrder } = validation.data;
    const locale = params.locale;

    // Build query
    let query = supabaseAdmin
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
          alt_text,
          is_primary
        ),
        hotel_amenities(
          amenity:amenities(
            code,
            icon
          )
        ),
        reviews(
          rating
        )
      `, { count: 'exact' })
      .eq('status', 'approved')
      .eq('hotel_translations.language', locale || 'en');

    // Filter by destination (city or country)
    if (destination) {
      query = query.or(`address_city.ilike.%${destination}%,address_country.ilike.%${destination}%`);
    }

    // Filter by property type
    if (propertyType && propertyType.length > 0) {
      query = query.in('property_type', propertyType);
    }

    // Filter by price (using room categories' base_price)
    if (minPrice !== undefined || maxPrice !== undefined) {
      // This requires a join with room_categories - simplified for now
      // In production, use a materialized view or separate query
    }

    // Pagination
    const offset = (page! - 1) * limit!;
    query = query.range(offset, offset + limit! - 1);

    const { data: hotels, error, count } = await query;

    if (error) {
      throw error;
    }

    // Post-process results
    const processedHotels = (hotels || []).map((hotel: any) => {
      // Calculate average rating
      const ratings = hotel.reviews?.map((r: any) => r.rating) || [];
      const averageRating = ratings.length > 0
        ? ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length
        : 0;

      // Filter by minRating if specified
      if (minRating && averageRating < minRating) {
        return null;
      }

      // Get primary image
      const primaryImage = hotel.hotel_images?.find((img: any) => img.is_primary)
        || hotel.hotel_images?.[0];

      return {
        id: hotel.id,
        name: hotel.hotel_translations[0]?.name || 'Unknown Hotel',
        description: hotel.hotel_translations[0]?.description,
        propertyType: hotel.property_type,
        city: hotel.address_city,
        country: hotel.address_country,
        starRating: hotel.star_rating,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: ratings.length,
        image: primaryImage?.url,
        amenities: hotel.hotel_amenities?.map((ha: any) => ha.amenity) || [],
      };
    }).filter((hotel): hotel is NonNullable<typeof hotel> => hotel !== null); // Remove nulls (filtered by rating)

    // Sort results
    if (sortBy === 'rating') {
      processedHotels.sort((a, b) => {
        return sortOrder === 'desc'
          ? b.averageRating - a.averageRating
          : a.averageRating - b.averageRating;
      });
    }

    const total = processedHotels.length;
    const hasMore = offset + limit! < total;

    return NextResponse.json({
      hotels: processedHotels,
      total,
      page,
      limit,
      hasMore,
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
