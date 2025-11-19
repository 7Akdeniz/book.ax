import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const roomCategoryId = searchParams.get('roomCategoryId');
    const numRooms = parseInt(searchParams.get('numRooms') || '1');

    if (!checkIn || !checkOut || !roomCategoryId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get room category info
    const { data: roomCategory, error: rcError } = await supabaseAdmin
      .from('room_categories')
      .select('id, total_rooms')
      .eq('id', roomCategoryId)
      .eq('hotel_id', params.id)
      .single();

    if (rcError || !roomCategory) {
      return NextResponse.json(
        { error: 'Room category not found' },
        { status: 404 }
      );
    }

    // Generate date range
    const dates = generateDateRange(checkIn, checkOut);

    // Check inventory for each date
    const { data: inventory, error: invError } = await supabaseAdmin
      .from('inventory')
      .select('date, available_rooms')
      .eq('room_category_id', roomCategoryId)
      .in('date', dates);

    if (invError) {
      throw invError;
    }

    // Check existing bookings for dates without inventory records
    const { data: bookings, error: bookError } = await supabaseAdmin
      .from('bookings')
      .select('check_in_date, check_out_date, num_rooms')
      .eq('room_category_id', roomCategoryId)
      .eq('hotel_id', params.id)
      .in('status', ['pending', 'confirmed', 'checked_in'])
      .or(`check_in_date.lte.${checkOut},check_out_date.gte.${checkIn}`);

    if (bookError) {
      throw bookError;
    }

    // Calculate availability for each date
    const availabilityMap = new Map<string, number>();

    for (const date of dates) {
      // Check if we have inventory record
      const invRecord = inventory?.find(inv => inv.date === date);
      
      if (invRecord) {
        availabilityMap.set(date, invRecord.available_rooms);
      } else {
        // Calculate from bookings
        const bookedRooms = bookings
          ?.filter(b => date >= b.check_in_date && date < b.check_out_date)
          .reduce((sum, b) => sum + b.num_rooms, 0) || 0;
        
        const available = roomCategory.total_rooms - bookedRooms;
        availabilityMap.set(date, available);
      }
    }

    // Find minimum availability across all dates
    const minAvailability = Math.min(...Array.from(availabilityMap.values()));
    const isAvailable = minAvailability >= numRooms;

    return NextResponse.json({
      available: isAvailable,
      availableRooms: minAvailability,
      totalRooms: roomCategory.total_rooms,
      requestedRooms: numRooms,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      dailyAvailability: Object.fromEntries(availabilityMap),
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Don't include checkout date (guest leaves that day)
  while (start < end) {
    dates.push(start.toISOString().split('T')[0]);
    start.setDate(start.getDate() + 1);
  }

  return dates;
}
