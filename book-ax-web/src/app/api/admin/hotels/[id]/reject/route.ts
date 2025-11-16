
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * Admin Hotel Rejection
 * 
 * Security: Admin-only, updates hotel status to 'rejected'
 * Warning: This is a destructive action that cannot be undone
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

    // Get rejection reason from request body (optional)
    let rejectionReason = '';
    try {
      const body = await req.json();
      rejectionReason = body.reason || '';
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

    // Check if hotel is pending
    if (hotel.status !== 'pending') {
      return NextResponse.json(
        { error: 'Only pending hotels can be rejected' },
        { status: 400 }
      );
    }

    // Update hotel status to rejected
    const { error: updateError } = await supabaseAdmin
      .from('hotels')
      .update({ 
        status: 'rejected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', hotelId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to reject hotel' },
        { status: 500 }
      );
    }

    // TODO: Send email notification to hotelier with rejection reason
    // TODO: Log action in audit_logs table with reason

    console.log(`❌ Admin ${decoded.email} rejected hotel ${hotel.name} (ID: ${hotelId})${rejectionReason ? ` - Reason: ${rejectionReason}` : ''}`);

    return NextResponse.json({
      message: 'Hotel rejected successfully',
      hotel: {
        id: hotelId,
        name: hotel.name,
        status: 'rejected',
      },
    });
  } catch (error) {
    console.error('Hotel rejection error:', error);
    return NextResponse.json(
      { error: 'Failed to reject hotel' },
      { status: 500 }
    );
  }
}
