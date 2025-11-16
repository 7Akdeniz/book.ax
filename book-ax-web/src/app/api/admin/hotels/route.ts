import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * Admin Hotel Management - List Hotels
 * 
 * Security: Admin-only endpoint
 * Returns: List of all hotels with status filter
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

    // Get status filter from query params
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');

    // Build query
    let query = supabaseAdmin
      .from('hotels')
      .select(`
        id,
        name,
        stars,
        commission_percentage,
        status,
        created_at,
        hotel_translations!inner (
          city,
          country
        )
      `)
      .eq('hotel_translations.language_code', 'en')
      .order('created_at', { ascending: false });

    // Apply status filter if provided
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data: hotels, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch hotels' },
        { status: 500 }
      );
    }

    // Transform data to match frontend expectations
    const transformedHotels = hotels?.map((hotel: any) => {
      const translation = hotel.hotel_translations[0] || {};
      return {
        id: hotel.id,
        name: hotel.name,
        stars: hotel.stars,
        commissionPercentage: hotel.commission_percentage,
        status: hotel.status,
        city: translation.city || 'N/A',
        country: translation.country || 'N/A',
        createdAt: hotel.created_at,
      };
    }) || [];

    return NextResponse.json({ hotels: transformedHotels });
  } catch (error) {
    console.error('Admin hotels list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    );
  }
}
