/**
 * Server-Side Database Queries
 * 
 * These functions are designed for Server Components and API Routes.
 * They use supabaseAdmin for better performance (bypasses RLS).
 * 
 * ⚠️ NEVER import this file in Client Components!
 */

import { supabaseAdmin } from './supabase';
import type { Hotel, RoomCategory, Review, HotelImage, Amenity } from '@/types/models';

// ==============================================
// HOTEL QUERIES
// ==============================================

export interface HotelWithDetails extends Hotel {
  // Extended fields with proper snake_case
  name: string; // from translations
  description?: string; // from translations
  images: Array<{ url: string; alt_text?: string }>;
  amenities: Array<{ code: string; icon?: string }>;
  room_categories: Array<RoomCategory & { name: string; description?: string }>;
  reviews: Array<Review & { guestName: string }>;
  average_rating: number;
  total_reviews: number;
}

/**
 * Get a single hotel by ID with all details (server-side)
 */
export async function getHotelById(
  hotelId: string,
  locale: string = 'en'
): Promise<HotelWithDetails | null> {
  try {
    // Fetch hotel basic info
    const { data: hotel, error: hotelError } = await supabaseAdmin
      .from('hotels')
      .select(`
        *,
        hotel_images (
          id,
          url,
          alt_text,
          display_order,
          is_primary
        ),
        hotel_amenities (
          amenity_code,
          hotel_amenities_mapping (
            icon,
            is_featured
          )
        )
      `)
      .eq('id', hotelId)
      .eq('status', 'approved')
      .single();

    if (hotelError || !hotel) {
      console.error('Hotel not found:', hotelError);
      return null;
    }

    // Fetch translations
    const { data: translation } = await supabaseAdmin
      .from('hotel_translations')
      .select('name, description')
      .eq('hotel_id', hotelId)
      .eq('language', locale)
      .single();

    // Fetch room categories with translations
    const { data: roomCategories } = await supabaseAdmin
      .from('room_categories')
      .select(`
        *,
        room_category_translations (
          name,
          description,
          language
        )
      `)
      .eq('hotel_id', hotelId)
      .eq('status', 'approved')
      .order('sort_order', { ascending: true });

    // Fetch reviews
    const { data: reviews } = await supabaseAdmin
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        users (
          first_name,
          last_name
        )
      `)
      .eq('hotel_id', hotelId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(10);

    // Transform data
    const transformedHotel: HotelWithDetails = {
      ...hotel,
      name: translation?.name || 'Hotel',
      description: translation?.description,
      images: (hotel.hotel_images || [])
        .sort((a: any, b: any) => {
          if (a.is_primary) return -1;
          if (b.is_primary) return 1;
          return a.display_order - b.display_order;
        })
        .map((img: any) => ({
          url: img.url,
          alt_text: img.alt_text,
        })),
      amenities: (hotel.hotel_amenities || []).map((a: any) => ({
        code: a.amenity_code,
        icon: a.hotel_amenities_mapping?.icon,
      })),
      room_categories: (roomCategories || []).map((room: any) => {
        const roomTranslation = room.room_category_translations?.find(
          (t: any) => t.language === locale
        );
        return {
          ...room,
          name: roomTranslation?.name || room.code,
          description: roomTranslation?.description,
        };
      }),
      reviews: (reviews || []).map((review: any) => ({
        ...review,
        guestName: review.users
          ? `${review.users.first_name} ${review.users.last_name}`
          : 'Guest',
      })),
      average_rating: hotel.average_rating || 0,
      total_reviews: hotel.total_reviews || 0,
    };

    return transformedHotel;
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return null;
  }
}

/**
 * Get hotels for sitemap generation
 */
export async function getHotelsForSitemap(): Promise<
  Array<{ id: string; updated_at: string }>
> {
  try {
    const { data, error } = await supabaseAdmin
      .from('hotels')
      .select('id, updated_at')
      .eq('status', 'approved')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching hotels for sitemap:', error);
    return [];
  }
}

/**
 * Search hotels with filters (server-side)
 */
export interface HotelSearchParams {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  starRating?: number[];
  amenities?: string[];
  locale?: string;
}

export async function searchHotels(
  params: HotelSearchParams
): Promise<Hotel[]> {
  try {
    let query = supabaseAdmin
      .from('hotels')
      .select(`
        *,
        hotel_images!inner (
          url,
          alt_text,
          is_primary
        ),
        hotel_translations (
          name,
          description,
          language
        )
      `)
      .eq('status', 'approved');

    // Filter by destination (city or country)
    if (params.destination) {
      query = query.or(
        `city.ilike.%${params.destination}%,country.ilike.%${params.destination}%`
      );
    }

    // Filter by star rating
    if (params.starRating && params.starRating.length > 0) {
      query = query.in('star_rating', params.starRating);
    }

    // Execute query
    const { data: hotels, error } = await query
      .order('average_rating', { ascending: false })
      .limit(50);

    if (error) throw error;

    // Transform data
    const transformedHotels = (hotels || []).map((hotel: any) => {
      const translation = hotel.hotel_translations?.find(
        (t: any) => t.language === (params.locale || 'en')
      );
      const primaryImage = hotel.hotel_images?.find((img: any) => img.is_primary);

      return {
        ...hotel,
        name: translation?.name || 'Hotel',
        description: translation?.description,
        image: primaryImage?.url || hotel.hotel_images?.[0]?.url,
        average_rating: hotel.average_rating || 0,
        total_reviews: hotel.total_reviews || 0,
      };
    });

    return transformedHotels;
  } catch (error) {
    console.error('Error searching hotels:', error);
    return [];
  }
}

/**
 * Get featured hotels for homepage
 */
export async function getFeaturedHotels(
  locale: string = 'en',
  limit: number = 8
): Promise<Hotel[]> {
  try {
    const { data: hotels, error } = await supabaseAdmin
      .from('hotels')
      .select(`
        *,
        hotel_images!inner (
          url,
          alt_text,
          is_primary
        ),
        hotel_translations (
          name,
          description,
          language
        )
      `)
      .eq('status', 'approved')
      .not('hotel_images', 'is', null)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Transform data (same as searchHotels)
    const transformedHotels = (hotels || []).map((hotel: any) => {
      const translation = hotel.hotel_translations?.find(
        (t: any) => t.language === locale
      );
      const primaryImage = hotel.hotel_images?.find((img: any) => img.is_primary);

      return {
        ...hotel,
        name: translation?.name || hotel.name,
        description: translation?.description || hotel.description,
        image: primaryImage?.url || hotel.hotel_images?.[0]?.url,
      };
    });

    return transformedHotels;
  } catch (error) {
    console.error('Error fetching featured hotels:', error);
    return [];
  }
}

/**
 * Get hotel's minimum price (for search results)
 */
export async function getHotelMinPrice(hotelId: string): Promise<number | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('room_categories')
      .select('base_price')
      .eq('hotel_id', hotelId)
      .eq('status', 'approved')
      .order('base_price', { ascending: true })
      .limit(1)
      .single();

    if (error) throw error;

    return data?.base_price || null;
  } catch (error) {
    console.error('Error fetching hotel min price:', error);
    return null;
  }
}
