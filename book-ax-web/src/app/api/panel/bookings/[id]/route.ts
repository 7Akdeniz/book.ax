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

    if (!payload || (payload.role !== 'hotelier' && payload.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
        { status: 400 }
      );
    }

    // Get booking to verify ownership
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('*, hotel:hotels!inner(owner_id)')
      .eq('id', params.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Verify hotelier owns this hotel (unless admin)
    if (payload.role === 'hotelier' && booking.hotel.owner_id !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update booking status
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // If cancelling, add cancellation date
    if (status === 'cancelled') {
      updateData.cancellation_date = new Date().toISOString();
    }

    const { data: updatedBooking, error: updateError } = await supabaseAdmin
      .from('bookings')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Error in PATCH /api/panel/bookings/[id]:', error);
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
