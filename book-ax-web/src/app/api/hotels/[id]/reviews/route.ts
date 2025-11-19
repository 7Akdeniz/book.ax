// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get reviews with user info
    const { data: reviews, error: reviewsError } = await supabaseAdmin
      .from('reviews')
      .select(`
        id,
        rating,
        cleanliness_rating,
        location_rating,
        service_rating,
        value_rating,
        comment,
        response,
        response_date,
        is_verified,
        created_at,
        user:users(first_name, last_name)
      `)
      .eq('hotel_id', params.id)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (reviewsError) {
      throw reviewsError;
    }

    // Get review statistics
    const { data: stats } = await supabaseAdmin
      .from('reviews')
      .select('rating, cleanliness_rating, location_rating, service_rating, value_rating')
      .eq('hotel_id', params.id)
      .eq('is_published', true);

    const totalReviews = stats?.length || 0;
    const avgRating = totalReviews > 0
      ? stats!.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
    
    const avgCleanliness = stats && stats.length > 0
      ? stats.filter(r => r.cleanliness_rating).reduce((sum, r) => sum + (r.cleanliness_rating || 0), 0) / stats.filter(r => r.cleanliness_rating).length
      : 0;
    
    const avgLocation = stats && stats.length > 0
      ? stats.filter(r => r.location_rating).reduce((sum, r) => sum + (r.location_rating || 0), 0) / stats.filter(r => r.location_rating).length
      : 0;
    
    const avgService = stats && stats.length > 0
      ? stats.filter(r => r.service_rating).reduce((sum, r) => sum + (r.service_rating || 0), 0) / stats.filter(r => r.service_rating).length
      : 0;
    
    const avgValue = stats && stats.length > 0
      ? stats.filter(r => r.value_rating).reduce((sum, r) => sum + (r.value_rating || 0), 0) / stats.filter(r => r.value_rating).length
      : 0;

    // Format reviews
    const formattedReviews = reviews?.map(review => {
      const user = Array.isArray(review.user) ? review.user[0] : review.user;
      return {
        id: review.id,
        rating: review.rating,
        ratings: {
          cleanliness: review.cleanliness_rating,
          location: review.location_rating,
          service: review.service_rating,
          value: review.value_rating,
        },
        comment: review.comment,
        response: review.response,
        responseDate: review.response_date,
        isVerified: review.is_verified,
        guestName: user 
          ? `${user.first_name} ${user.last_name[0]}.`
          : 'Anonymous',
        createdAt: review.created_at,
      };
    }) || [];

    return NextResponse.json({
      reviews: formattedReviews,
      stats: {
        totalReviews,
        avgRating: Math.round(avgRating * 10) / 10,
        avgCleanliness: Math.round(avgCleanliness * 10) / 10,
        avgLocation: Math.round(avgLocation * 10) / 10,
        avgService: Math.round(avgService * 10) / 10,
        avgValue: Math.round(avgValue * 10) / 10,
      },
      pagination: {
        limit,
        offset,
        hasMore: formattedReviews.length === limit,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/hotels/[id]/reviews:', error);
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
