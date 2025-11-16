
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * Admin User Suspension
 * 
 * Security: Admin-only, suspends a user by deleting refresh tokens
 * Warning: User will be logged out immediately
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

    const userId = params.id;

    // Check if trying to suspend self
    if (decoded.userId === userId) {
      return NextResponse.json(
        { error: 'Cannot suspend your own account' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id, email, role')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete all refresh tokens for this user (suspends access)
    const { error: deleteError } = await supabaseAdmin
      .from('refresh_tokens')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Delete tokens error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to suspend user' },
        { status: 500 }
      );
    }

    // TODO: Send email notification to user
    // TODO: Log action in audit_logs table

    console.log(`⚠️ Admin ${decoded.email} suspended user ${user.email} (ID: ${userId})`);

    return NextResponse.json({
      message: 'User suspended successfully',
      user: {
        id: userId,
        email: user.email,
        status: 'suspended',
      },
    });
  } catch (error) {
    console.error('User suspension error:', error);
    return NextResponse.json(
      { error: 'Failed to suspend user' },
      { status: 500 }
    );
  }
}
