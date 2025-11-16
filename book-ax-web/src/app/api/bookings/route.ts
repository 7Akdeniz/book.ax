// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { bookingSchema } from '@/utils/validation';
import { handleApiError } from '@/utils/errors';
import { calculateNights } from '@/utils/formatting';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request
    const validation = bookingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      hotelId,
      roomCategoryId,
      checkInDate,
      checkOutDate,
      numGuests,
      numRooms,
      guestFirstName,
      guestLastName,
      guestEmail,
      guestPhone,
      specialRequests,
    } = validation.data;

    // Get room category and hotel info
    const { data: roomCategory, error: rcError } = await supabaseAdmin
      .from('room_categories')
      .select(`
        *,
        hotel:hotels(
          id,
          commission_percentage
        )
      `)
      .eq('id', roomCategoryId)
      .single();

    if (rcError || !roomCategory) {
      return NextResponse.json({ error: 'Room category not found' }, { status: 404 });
    }

    // Calculate pricing
    const nights = calculateNights(checkInDate, checkOutDate);
    const subtotal = roomCategory.base_price * nights * numRooms;
    const taxAmount = subtotal * 0.07; // 7% tax (example)
    const totalAmount = subtotal + taxAmount;
    const commissionPercentage = roomCategory.hotel.commission_percentage;
    const commissionAmount = totalAmount * (commissionPercentage / 100);
    const hotelPayout = totalAmount - commissionAmount;

    // Create booking
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        hotel_id: hotelId,
        room_category_id: roomCategoryId,
        guest_first_name: guestFirstName,
        guest_last_name: guestLastName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        num_guests: numGuests,
        num_rooms: numRooms,
        status: 'pending',
        source: 'direct',
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        commission_percentage: commissionPercentage,
        commission_amount: commissionAmount,
        hotel_payout: hotelPayout,
        special_requests: specialRequests,
      })
      .select()
      .single();

    if (bookingError) {
      throw bookingError;
    }

    // Update inventory (decrease available rooms)
    // This is simplified - in production, use proper inventory management
    // with atomic operations and date range handling

    return NextResponse.json({
      booking: {
        id: booking.id,
        bookingReference: booking.booking_reference,
        status: booking.status,
        checkInDate: booking.check_in_date,
        checkOutDate: booking.check_out_date,
        totalAmount: booking.total_amount,
      },
    }, { status: 201 });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
