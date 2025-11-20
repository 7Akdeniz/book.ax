// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';

export async function GET(req: NextRequest) {
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

    // Get hotelier's hotel
    const { data: hotel, error: hotelError } = await supabaseAdmin
      .from('hotels')
      .select('id, total_rooms')
      .eq('owner_id', payload.userId)
      .single();

    if (hotelError || !hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const dateFilter = searchParams.get('dateFilter');
    const requestedLocale = (searchParams.get('locale') || 'en').toLowerCase();
    const fallbackLocale = 'en';

    // Build query
    let query = supabaseAdmin
      .from('bookings')
      .select('*, room_categories!inner(id)')
      .eq('hotel_id', hotel.id)
      .order('created_at', { ascending: false });

    // Apply status filter
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Apply date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    if (dateFilter === 'today') {
      query = query.or(`check_in_date.eq.${todayStr},check_out_date.eq.${todayStr}`);
    } else if (dateFilter === 'upcoming') {
      query = query.gte('check_in_date', todayStr);
    } else if (dateFilter === 'past') {
      query = query.lt('check_out_date', todayStr);
    }

    const { data: bookingsData, error: bookingsError } = await query;

    if (bookingsError) {
      console.error('Bookings query error:', bookingsError);
      throw bookingsError;
    }

    const bookingsList = bookingsData || [];

    // Prefetch room category translations for requested locale (fallback to English)
    const translationsMap = new Map<string, string>();
    if (bookingsList.length > 0) {
      const roomCategoryIds = Array.from(
        new Set(bookingsList.map((booking: any) => booking.room_category_id))
      );

      if (roomCategoryIds.length > 0) {
        const languages = requestedLocale === fallbackLocale
          ? [fallbackLocale]
          : [requestedLocale, fallbackLocale];

        const { data: translationsData, error: translationsError } = await supabaseAdmin
          .from('room_category_translations')
          .select('room_category_id, language, name')
          .in('room_category_id', roomCategoryIds)
          .in('language', languages);

        if (translationsError) {
          console.error('Room translation error:', translationsError);
        } else {
          (translationsData || []).forEach((translation) => {
            translationsMap.set(
              `${translation.room_category_id}-${translation.language}`,
              translation.name
            );
          });
        }
      }
    }

    const bookings = bookingsList.map((booking: any) => {
      const localizedRoomName =
        translationsMap.get(`${booking.room_category_id}-${requestedLocale}`) ||
        translationsMap.get(`${booking.room_category_id}-${fallbackLocale}`) ||
        'Unknown Room';

      return {
        id: booking.id,
        booking_reference: booking.booking_reference,
        room_category_name: localizedRoomName,
        guest_name: `${booking.guest_first_name} ${booking.guest_last_name}`,
        guest_email: booking.guest_email,
        guest_phone: booking.guest_phone,
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        num_guests: booking.num_guests,
        num_rooms: booking.num_rooms,
        subtotal: booking.subtotal,
        tax_amount: booking.tax_amount,
        total_amount: booking.total_amount,
        commission_percentage: booking.commission_percentage,
        commission_amount: booking.commission_amount,
        hotel_payout: booking.hotel_payout,
        status: booking.status,
        source: booking.source,
        special_requests: booking.special_requests,
        cancellation_reason: booking.cancellation_reason,
        cancellation_date: booking.cancellation_date,
        created_at: booking.created_at,
        updated_at: booking.updated_at,
      };
    });

    // Calculate statistics
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
    
    // Today's check-ins/outs
    const todayCheckIns = bookings.filter(
      (b) => b.check_in_date === todayStr && ['confirmed', 'checked_in'].includes(b.status)
    ).length;
    const todayCheckOuts = bookings.filter(
      (b) => b.check_out_date === todayStr && ['confirmed', 'checked_in'].includes(b.status)
    ).length;

    // Calculate total revenue (confirmed + checked_out bookings)
    const totalRevenue = bookings
      .filter((b) => ['confirmed', 'checked_out'].includes(b.status))
      .reduce((sum, b) => sum + parseFloat(b.total_amount), 0);

    const stats = {
      totalBookings,
      confirmedBookings,
      todayCheckIns,
      todayCheckOuts,
      totalRevenue,
      currency: 'EUR',
    };

    return NextResponse.json({ bookings, stats });
  } catch (error) {
    console.error('Error in GET /api/panel/bookings:', error);
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
