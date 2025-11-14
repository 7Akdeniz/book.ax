import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';

/**
 * Admin Financial Reports
 * 
 * Security: Admin-only endpoint
 * Returns: Financial summary and transaction details
 */
export async function GET(req: NextRequest) {
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

    // Get filters from query params
    const { searchParams } = new URL(req.url);
    const dateRange = searchParams.get('dateRange') || '30d';
    const statusFilter = searchParams.get('status') || 'all';

    // Calculate date range
    let dateFilter = new Date();
    switch (dateRange) {
      case '7d':
        dateFilter.setDate(dateFilter.getDate() - 7);
        break;
      case '30d':
        dateFilter.setDate(dateFilter.getDate() - 30);
        break;
      case '90d':
        dateFilter.setDate(dateFilter.getDate() - 90);
        break;
      case 'all':
        dateFilter = new Date(0); // Unix epoch
        break;
    }

    // Build query
    let query = supabaseAdmin
      .from('bookings')
      .select(`
        id,
        booking_number,
        total_amount,
        commission_amount,
        hotel_payout,
        commission_percentage,
        status,
        created_at,
        paid_at,
        hotels!inner (
          name
        ),
        users!inner (
          email
        )
      `)
      .gte('created_at', dateFilter.toISOString())
      .order('created_at', { ascending: false });

    // Apply status filter
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data: bookings, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch financial data' },
        { status: 500 }
      );
    }

    // Calculate summary
    const summary = {
      totalRevenue: 0,
      totalCommissions: 0,
      totalPayouts: 0,
      pendingPayouts: 0,
      bookingCount: bookings?.length || 0,
    };

    const transactions = bookings?.map((booking: any) => {
      const totalAmount = booking.total_amount || 0;
      const commissionAmount = booking.commission_amount || 0;
      const hotelPayout = booking.hotel_payout || 0;

      // Add to summary
      summary.totalRevenue += totalAmount;
      summary.totalCommissions += commissionAmount;
      
      if (booking.status === 'confirmed' && booking.paid_at) {
        summary.totalPayouts += hotelPayout;
      } else if (booking.status === 'confirmed' && !booking.paid_at) {
        summary.pendingPayouts += hotelPayout;
      }

      return {
        id: booking.id,
        bookingId: booking.booking_number || booking.id,
        hotelName: booking.hotels?.name || 'Unknown',
        guestEmail: booking.users?.email || 'Unknown',
        totalAmount,
        commissionAmount,
        hotelPayout,
        commissionPercentage: booking.commission_percentage || 0,
        status: booking.status,
        createdAt: booking.created_at,
        paidAt: booking.paid_at,
      };
    }) || [];

    return NextResponse.json({
      summary,
      transactions,
      filters: {
        dateRange,
        status: statusFilter,
      },
    });
  } catch (error) {
    console.error('Admin finances error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch financial data' },
      { status: 500 }
    );
  }
}
