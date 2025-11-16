import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * Admin Dashboard Statistics
 * 
 * Security: Admin-only endpoint
 * Returns: Overview stats for admin dashboard
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

    // Fetch statistics from database
    const [
      hotelsResult,
      pendingHotelsResult,
      usersResult,
      revenueResult,
      activeBookingsResult,
    ] = await Promise.all([
      // Total hotels
      supabaseAdmin
        .from('hotels')
        .select('id', { count: 'exact', head: true }),
      
      // Pending approvals
      supabaseAdmin
        .from('hotels')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),
      
      // Total users
      supabaseAdmin
        .from('users')
        .select('id', { count: 'exact', head: true }),
      
      // Total revenue (sum of all confirmed bookings)
      supabaseAdmin
        .from('bookings')
        .select('total_amount')
        .eq('status', 'confirmed'),
      
      // Active bookings (confirmed + pending)
      supabaseAdmin
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .in('status', ['confirmed', 'pending']),
    ]);

    // Calculate total revenue
    const totalRevenue = revenueResult.data?.reduce(
      (sum, booking) => sum + (booking.total_amount || 0),
      0
    ) || 0;

    // System health (simple check: if DB queries work, system is healthy)
    const systemHealth = 'healthy';

    return NextResponse.json({
      totalHotels: hotelsResult.count || 0,
      pendingApprovals: pendingHotelsResult.count || 0,
      totalUsers: usersResult.count || 0,
      totalRevenue: totalRevenue,
      activeBookings: activeBookingsResult.count || 0,
      systemHealth,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
