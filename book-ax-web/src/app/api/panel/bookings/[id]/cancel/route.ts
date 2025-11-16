// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    if (!payload || payload.role !== 'hotelier') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const bookingId = params.id;

    // Get hotelier's hotel
    const { data: hotel, error: hotelError } = await supabaseAdmin
      .from('hotels')
      .select('id')
      .eq('owner_id', payload.userId)
      .single();

    if (hotelError || !hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    // Verify booking belongs to hotelier's hotel
    const { data: existingBooking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('hotel_id, status')
      .eq('id', bookingId)
      .single();

    if (bookingError || !existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (existingBooking.hotel_id !== hotel.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if booking can be cancelled (must be pending or confirmed)
    if (!['pending', 'confirmed'].includes(existingBooking.status)) {
      return NextResponse.json(
        { error: 'Only pending or confirmed bookings can be cancelled' },
        { status: 400 }
      );
    }

    // Update booking status to cancelled
    const { data: updatedBooking, error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'cancelled',
        cancellation_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating booking:', updateError);
      throw updateError;
    }

    console.log(
      `[HOTELIER] Booking ${bookingId} cancelled by hotelier ${payload.email}`
    );

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    console.error('Error in PATCH /api/panel/bookings/[id]/cancel:', error);
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
