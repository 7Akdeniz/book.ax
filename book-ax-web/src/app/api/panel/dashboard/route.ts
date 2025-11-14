import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';

export async function GET(req: NextRequest) {
  try {
    // Verify hotelier access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
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

    // Get hotel name
    const { data: hotelTranslation } = await supabaseAdmin
      .from('hotel_translations')
      .select('name')
      .eq('hotel_id', hotel.id)
      .eq('language', 'de')
      .single();

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get this month's date range
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get today's check-ins
    const { data: todayCheckIns } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('hotel_id', hotel.id)
      .eq('check_in_date', today.toISOString().split('T')[0])
      .in('status', ['confirmed', 'checked_in']);

    // Get today's check-outs
    const { data: todayCheckOuts } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('hotel_id', hotel.id)
      .eq('check_out_date', today.toISOString().split('T')[0])
      .in('status', ['confirmed', 'checked_in']);

    // Get current guests (checked_in status)
    const { data: currentGuests } = await supabaseAdmin
      .from('bookings')
      .select('num_guests')
      .eq('hotel_id', hotel.id)
      .eq('status', 'checked_in');

    // Get upcoming bookings (future confirmed bookings)
    const { data: upcomingBookings } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('hotel_id', hotel.id)
      .gte('check_in_date', today.toISOString().split('T')[0])
      .eq('status', 'confirmed');

    // Get total revenue (all time)
    const { data: allBookings } = await supabaseAdmin
      .from('bookings')
      .select('total_amount')
      .eq('hotel_id', hotel.id)
      .in('status', ['confirmed', 'checked_out']);

    // Get monthly revenue
    const { data: monthlyBookings } = await supabaseAdmin
      .from('bookings')
      .select('total_amount')
      .eq('hotel_id', hotel.id)
      .gte('created_at', firstDayOfMonth.toISOString())
      .in('status', ['confirmed', 'checked_out']);

    // Calculate occupancy rate (simplified - based on bookings for next 30 days)
    const next30Days = new Date(today);
    next30Days.setDate(next30Days.getDate() + 30);
    
    const { data: occupancyBookings } = await supabaseAdmin
      .from('bookings')
      .select('num_rooms')
      .eq('hotel_id', hotel.id)
      .gte('check_in_date', today.toISOString().split('T')[0])
      .lte('check_in_date', next30Days.toISOString().split('T')[0])
      .in('status', ['confirmed', 'checked_in']);

    const totalRoomsBooked = occupancyBookings?.reduce((sum, b) => sum + (b.num_rooms || 0), 0) || 0;
    const totalRoomsAvailable = (hotel.total_rooms || 1) * 30; // 30 days
    const occupancyRate = (totalRoomsBooked / totalRoomsAvailable) * 100;

    // Get recent bookings
    const { data: recentBookingsData } = await supabaseAdmin
      .from('bookings')
      .select(`
        id,
        booking_reference,
        guest_first_name,
        guest_last_name,
        check_in_date,
        check_out_date,
        status,
        total_amount,
        room_category_id
      `)
      .eq('hotel_id', hotel.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get room category names for recent bookings
    const recentBookings = await Promise.all(
      (recentBookingsData || []).map(async (booking) => {
        const { data: roomTranslation } = await supabaseAdmin
          .from('room_category_translations')
          .select('name')
          .eq('room_category_id', booking.room_category_id)
          .eq('language', 'de')
          .single();

        return {
          id: booking.id,
          booking_reference: booking.booking_reference,
          guest_name: `${booking.guest_first_name} ${booking.guest_last_name}`,
          room_name: roomTranslation?.name || 'Unknown Room',
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
          status: booking.status,
          total_amount: booking.total_amount,
        };
      })
    );

    const stats = {
      todayCheckIns: todayCheckIns?.length || 0,
      todayCheckOuts: todayCheckOuts?.length || 0,
      currentGuests: currentGuests?.reduce((sum, b) => sum + (b.num_guests || 0), 0) || 0,
      upcomingBookings: upcomingBookings?.length || 0,
      totalRevenue: allBookings?.reduce((sum, b) => sum + parseFloat(b.total_amount.toString()), 0) || 0,
      monthlyRevenue: monthlyBookings?.reduce((sum, b) => sum + parseFloat(b.total_amount.toString()), 0) || 0,
      occupancyRate: Math.round(occupancyRate * 10) / 10,
      totalRooms: hotel.total_rooms || 0,
      availableRooms: Math.max(0, (hotel.total_rooms || 0) - (currentGuests?.length || 0)),
    };

    return NextResponse.json({
      stats,
      recentBookings,
      hotelName: hotelTranslation?.name || 'Mein Hotel',
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
