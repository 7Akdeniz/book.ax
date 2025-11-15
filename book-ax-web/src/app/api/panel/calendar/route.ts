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

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());

    // Get hotelier's hotel
    const { data: hotel, error: hotelError } = await supabaseAdmin
      .from('hotels')
      .select('id, total_rooms')
      .eq('owner_id', payload.userId)
      .single();

    if (hotelError || !hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    // Calculate month range
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    
    // Get first Monday before or on first day of month
    const startDate = new Date(firstDay);
    const dayOfWeek = startDate.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToSubtract);

    // Get last Sunday after or on last day of month
    const endDate = new Date(lastDay);
    const endDayOfWeek = endDate.getDay();
    const daysToAdd = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek;
    endDate.setDate(endDate.getDate() + daysToAdd);

    // Fetch all bookings for the calendar period
    const { data: bookingsData, error: bookingsError } = await supabaseAdmin
      .from('bookings')
      .select('*, room_categories!inner(id)')
      .eq('hotel_id', hotel.id)
      .gte('check_in_date', startDate.toISOString().split('T')[0])
      .lte('check_out_date', endDate.toISOString().split('T')[0])
      .in('status', ['pending', 'confirmed', 'checked_in', 'checked_out']);

    if (bookingsError) {
      console.error('Bookings query error:', bookingsError);
      throw bookingsError;
    }

    // Fetch room category translations
    const bookingsWithTranslations = await Promise.all(
      (bookingsData || []).map(async (booking: any) => {
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
          room_category_name: roomTranslation?.name || 'Unknown Room',
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
          num_rooms: booking.num_rooms,
          num_guests: booking.num_guests,
          status: booking.status,
          total_amount: booking.total_amount,
        };
      })
    );

    // Build calendar grid
    const calendar = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const isCurrentMonth = currentDate.getMonth() === month - 1;

      // Find bookings for this day
      const dayBookings = bookingsWithTranslations.filter((booking) => {
        const checkIn = new Date(booking.check_in_date);
        const checkOut = new Date(booking.check_out_date);
        const current = new Date(dateStr);
        
        // Include if current date is within booking period (inclusive check-in, exclusive check-out)
        return current >= checkIn && current < checkOut;
      });

      // Count check-ins and check-outs
      const checkIns = bookingsWithTranslations.filter(
        (b) => b.check_in_date === dateStr
      ).length;
      const checkOuts = bookingsWithTranslations.filter(
        (b) => b.check_out_date === dateStr
      ).length;

      // Calculate occupied rooms (checked_in bookings)
      const occupiedRooms = dayBookings
        .filter((b) => b.status === 'checked_in')
        .reduce((sum, b) => sum + b.num_rooms, 0);

      calendar.push({
        date: dateStr,
        isCurrentMonth,
        bookings: dayBookings.map((b) => ({
          id: b.id,
          booking_reference: b.booking_reference,
          guest_name: b.guest_name,
          room_category_name: b.room_category_name,
          status: b.status,
          num_rooms: b.num_rooms,
        })),
        checkIns,
        checkOuts,
        occupiedRooms,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate month statistics
    const monthBookings = bookingsWithTranslations.filter((b) => {
      const checkIn = new Date(b.check_in_date);
      return checkIn.getMonth() === month - 1 && checkIn.getFullYear() === year;
    });

    const totalBookings = monthBookings.length;
    const totalCheckIns = monthBookings.filter(
      (b) => b.status !== 'cancelled'
    ).length;
    const totalCheckOuts = bookingsWithTranslations.filter((b) => {
      const checkOut = new Date(b.check_out_date);
      return (
        checkOut.getMonth() === month - 1 &&
        checkOut.getFullYear() === year &&
        b.status !== 'cancelled'
      );
    }).length;

    // Calculate average occupancy for the month
    const daysInMonth = lastDay.getDate();
    const totalRoomNights = hotel.total_rooms * daysInMonth;
    const occupiedRoomNights = monthBookings
      .filter((b) => ['confirmed', 'checked_in', 'checked_out'].includes(b.status))
      .reduce((sum, booking) => {
        const checkIn = new Date(booking.check_in_date);
        const checkOut = new Date(booking.check_out_date);
        
        // Calculate nights in this month
        const monthStart = new Date(year, month - 1, 1);
        const monthEnd = new Date(year, month, 0);
        
        const effectiveStart = checkIn > monthStart ? checkIn : monthStart;
        const effectiveEnd = checkOut < monthEnd ? checkOut : monthEnd;
        
        const nights = Math.ceil((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24));
        
        return sum + (nights * booking.num_rooms);
      }, 0);

    const averageOccupancy = totalRoomNights > 0 ? (occupiedRoomNights / totalRoomNights) * 100 : 0;

    // Calculate total revenue for the month
    const totalRevenue = monthBookings
      .filter((b) => ['confirmed', 'checked_out'].includes(b.status))
      .reduce((sum, b) => sum + parseFloat(b.total_amount), 0);

    const stats = {
      totalBookings,
      totalCheckIns,
      totalCheckOuts,
      averageOccupancy: Math.round(averageOccupancy * 10) / 10,
      totalRevenue,
    };

    return NextResponse.json({
      calendar,
      stats,
      totalRooms: hotel.total_rooms,
    });
  } catch (error) {
    console.error('Error in GET /api/panel/calendar:', error);
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
