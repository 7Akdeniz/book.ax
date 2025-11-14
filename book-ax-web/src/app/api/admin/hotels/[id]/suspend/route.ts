import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';

/**
 * Admin Hotel Suspension
 * 
 * Security: Admin-only, suspends an approved hotel
 * Warning: Affects all future bookings, existing bookings remain active
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const hotelId = params.id;

    // Get suspension reason from request body (optional)
    let suspensionReason = '';
    try {
      const body = await req.json();
      suspensionReason = body.reason || '';
    } catch {
      // No body provided, continue without reason
    }

    // Check if hotel exists
    const { data: hotel, error: fetchError } = await supabaseAdmin
      .from('hotels')
      .select('id, name, status')
      .eq('id', hotelId)
      .single();

    if (fetchError || !hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      );
    }

    // Check if hotel is approved
    if (hotel.status !== 'approved') {
      return NextResponse.json(
        { error: 'Only approved hotels can be suspended' },
        { status: 400 }
      );
    }

    // Update hotel status to suspended
    const { error: updateError } = await supabaseAdmin
      .from('hotels')
      .update({ 
        status: 'suspended',
        updated_at: new Date().toISOString(),
      })
      .eq('id', hotelId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to suspend hotel' },
        { status: 500 }
      );
    }

    // TODO: Send email notification to hotelier
    // TODO: Log action in audit_logs table with reason
    // TODO: Consider cancelling pending bookings

    console.log(`⚠️ Admin ${decoded.email} suspended hotel ${hotel.name} (ID: ${hotelId})${suspensionReason ? ` - Reason: ${suspensionReason}` : ''}`);

    return NextResponse.json({
      message: 'Hotel suspended successfully',
      hotel: {
        id: hotelId,
        name: hotel.name,
        status: 'suspended',
      },
    });
  } catch (error) {
    console.error('Hotel suspension error:', error);
    return NextResponse.json(
      { error: 'Failed to suspend hotel' },
      { status: 500 }
    );
  }
}
