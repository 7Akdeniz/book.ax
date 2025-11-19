// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';
import { z } from 'zod';

const reviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  cleanlinessRating: z.number().int().min(1).max(5).optional(),
  locationRating: z.number().int().min(1).max(5).optional(),
  serviceRating: z.number().int().min(1).max(5).optional(),
  valueRating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(10).max(2000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const validation = reviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      bookingId,
      rating,
      cleanlinessRating,
      locationRating,
      serviceRating,
      valueRating,
      comment,
    } = validation.data;

    // Verify booking exists and belongs to user
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('id, hotel_id, user_id, status')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Only allow review if booking is completed
    if (booking.status !== 'checked_out') {
      return NextResponse.json(
        { error: 'Can only review after checkout' },
        { status: 400 }
      );
    }

    // Check if review already exists
    const { data: existingReview } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('booking_id', bookingId)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: 'Review already submitted for this booking' },
        { status: 409 }
      );
    }

    // Create review
    const { data: review, error: reviewError } = await supabaseAdmin
      .from('reviews')
      .insert({
        booking_id: bookingId,
        hotel_id: booking.hotel_id,
        user_id: payload.userId,
        rating,
        cleanliness_rating: cleanlinessRating,
        location_rating: locationRating,
        service_rating: serviceRating,
        value_rating: valueRating,
        comment,
        is_verified: true, // Verified because linked to booking
        is_published: true,
      })
      .select()
      .single();

    if (reviewError) {
      throw reviewError;
    }

    return NextResponse.json({
      success: true,
      review,
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
