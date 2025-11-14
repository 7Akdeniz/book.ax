import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';

/**
 * Admin Hotel Reactivation
 * 
 * Security: Admin-only, reactivates a suspended hotel
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

    // Check if hotel is suspended
    if (hotel.status !== 'suspended') {
      return NextResponse.json(
        { error: 'Only suspended hotels can be reactivated' },
        { status: 400 }
      );
    }

    // Update hotel status back to approved
    const { error: updateError } = await supabaseAdmin
      .from('hotels')
      .update({ 
        status: 'approved',
        updated_at: new Date().toISOString(),
      })
      .eq('id', hotelId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to reactivate hotel' },
        { status: 500 }
      );
    }

    // TODO: Send email notification to hotelier
    // TODO: Log action in audit_logs table

    console.log(`✅ Admin ${decoded.email} reactivated hotel ${hotel.name} (ID: ${hotelId})`);

    return NextResponse.json({
      message: 'Hotel reactivated successfully',
      hotel: {
        id: hotelId,
        name: hotel.name,
        status: 'approved',
      },
    });
  } catch (error) {
    console.error('Hotel reactivation error:', error);
    return NextResponse.json(
      { error: 'Failed to reactivate hotel' },
      { status: 500 }
    );
  }
}
