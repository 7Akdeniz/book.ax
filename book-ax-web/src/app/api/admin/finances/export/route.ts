import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';

/**
 * Admin Financial Report Export
 * 
 * Security: Admin-only endpoint
 * Returns: CSV file with transaction details
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
        dateFilter = new Date(0);
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
        check_in_date,
        check_out_date,
        hotels!inner (
          name
        ),
        users!inner (
          email,
          full_name
        )
      `)
      .gte('created_at', dateFilter.toISOString())
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data: bookings, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      );
    }

    // Generate CSV
    const csvHeader = [
      'Booking ID',
      'Hotel Name',
      'Guest Name',
      'Guest Email',
      'Check-In',
      'Check-Out',
      'Total Amount (EUR)',
      'Commission Amount (EUR)',
      'Commission %',
      'Hotel Payout (EUR)',
      'Status',
      'Booking Date',
      'Payment Date',
    ].join(',');

    const csvRows = bookings?.map((booking: any) => {
      return [
        booking.booking_number || booking.id,
        `"${booking.hotels?.name || 'Unknown'}"`,
        `"${booking.users?.full_name || 'N/A'}"`,
        booking.users?.email || 'Unknown',
        booking.check_in_date || 'N/A',
        booking.check_out_date || 'N/A',
        (booking.total_amount || 0).toFixed(2),
        (booking.commission_amount || 0).toFixed(2),
        (booking.commission_percentage || 0).toFixed(1),
        (booking.hotel_payout || 0).toFixed(2),
        booking.status,
        new Date(booking.created_at).toISOString(),
        booking.paid_at ? new Date(booking.paid_at).toISOString() : 'Not Paid',
      ].join(',');
    }) || [];

    const csv = [csvHeader, ...csvRows].join('\n');

    // Log export action
    console.log(`📥 Admin ${decoded.email} exported financial report (${dateRange}, ${statusFilter})`);

    // Return CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="financial-report-${dateRange}-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export report' },
      { status: 500 }
    );
  }
}
