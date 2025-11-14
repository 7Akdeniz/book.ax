import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';

/**
 * Admin User Management - List Users
 * 
 * Security: Admin-only endpoint
 * Returns: List of all users with role and status
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

    // Fetch all users
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, email, role, full_name, created_at, last_login_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    // Check user status from refresh_tokens table (if token exists, user is active)
    const userIds = users?.map(u => u.id) || [];
    const { data: tokens } = await supabaseAdmin
      .from('refresh_tokens')
      .select('user_id')
      .in('user_id', userIds)
      .gte('expires_at', new Date().toISOString());

    const activeUserIds = new Set(tokens?.map(t => t.user_id) || []);

    // Transform data
    const transformedUsers = users?.map((user: any) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
      status: activeUserIds.has(user.id) ? 'active' : 'suspended',
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at,
    })) || [];

    return NextResponse.json({ users: transformedUsers });
  } catch (error) {
    console.error('Admin users list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
