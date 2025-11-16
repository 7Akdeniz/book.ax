// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError, NotFoundError } from '@/utils/errors';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        hotel:hotels(
          id,
          address_city,
          address_country,
          hotel_translations(
            language,
            name
          )
        ),
        room_category:room_categories(
          id,
          room_category_translations(
            language,
            name
          )
        ),
        payment:payments(
          id,
          status,
          payment_method,
          paid_at
        )
      `)
      .eq('id', id)
      .single();

    if (error || !booking) {
      throw new NotFoundError('Booking');
    }

    // Format response
    const response = {
      id: booking.id,
      bookingReference: booking.booking_reference,
      status: booking.status,
      hotel: {
        id: booking.hotel.id,
        name: booking.hotel.hotel_translations[0]?.name || 'Hotel',
        city: booking.hotel.address_city,
        country: booking.hotel.address_country,
      },
      roomCategory: {
        id: booking.room_category.id,
        name: booking.room_category.room_category_translations[0]?.name || 'Room',
      },
      guest: {
        firstName: booking.guest_first_name,
        lastName: booking.guest_last_name,
        email: booking.guest_email,
        phone: booking.guest_phone,
      },
      checkInDate: booking.check_in_date,
      checkOutDate: booking.check_out_date,
      numGuests: booking.num_guests,
      numRooms: booking.num_rooms,
      subtotal: booking.subtotal,
      taxAmount: booking.tax_amount,
      totalAmount: booking.total_amount,
      specialRequests: booking.special_requests,
      payment: booking.payment,
      createdAt: booking.created_at,
    };

    return NextResponse.json(response);
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
