import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Verify admin access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const source = searchParams.get('source');

    // Build query
    let query = supabaseAdmin
      .from('bookings')
      .select(`
        id,
        booking_reference,
        hotel_id,
        room_category_id,
        guest_first_name,
        guest_last_name,
        guest_email,
        check_in_date,
        check_out_date,
        num_guests,
        num_rooms,
        total_amount,
        status,
        source,
        created_at,
        hotels!inner(id),
        room_categories!inner(id)
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (source && source !== 'all') {
      query = query.eq('source', source);
    }

    const { data: bookings, error: bookingsError } = await query;

    if (bookingsError) throw bookingsError;

    // Get hotel translations and room category translations
    const bookingsWithDetails = await Promise.all(
      (bookings || []).map(async (booking) => {
        // Get hotel translation
        const { data: hotelTranslation } = await supabaseAdmin
          .from('hotel_translations')
          .select('name')
          .eq('hotel_id', booking.hotel_id)
          .eq('language', 'de')
          .single();

        // Get room category translation
        const { data: roomTranslation } = await supabaseAdmin
          .from('room_category_translations')
          .select('name')
          .eq('room_category_id', booking.room_category_id)
          .eq('language', 'de')
          .single();

        return {
          id: booking.id,
          booking_reference: booking.booking_reference,
          hotel_name: hotelTranslation?.name || 'Unknown Hotel',
          room_category_name: roomTranslation?.name || 'Unknown Room',
          guest_name: `${booking.guest_first_name} ${booking.guest_last_name}`,
          guest_email: booking.guest_email,
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
          num_guests: booking.num_guests,
          num_rooms: booking.num_rooms,
          total_amount: booking.total_amount,
          status: booking.status,
          source: booking.source,
          created_at: booking.created_at,
        };
      })
    );

    // Calculate stats
    const stats = {
      totalBookings: bookingsWithDetails.length,
      confirmedBookings: bookingsWithDetails.filter((b) => b.status === 'confirmed').length,
      pendingBookings: bookingsWithDetails.filter((b) => b.status === 'pending').length,
      totalRevenue: bookingsWithDetails
        .filter((b) => b.status === 'confirmed' || b.status === 'checked_out')
        .reduce((sum, b) => sum + parseFloat(b.total_amount.toString()), 0),
    };

    return NextResponse.json({
      bookings: bookingsWithDetails,
      stats,
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
