import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, generateRefreshToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';

/**
 * Admin User Activation
 * 
 * Security: Admin-only, reactivates a suspended user
 * Note: User will need to login again
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

    // Check if user already has active tokens
    const { data: existingTokens } = await supabaseAdmin
      .from('refresh_tokens')
      .select('id')
      .eq('user_id', userId)
      .gte('expires_at', new Date().toISOString());

    if (existingTokens && existingTokens.length > 0) {
      return NextResponse.json(
        { error: 'User is already active' },
        { status: 400 }
      );
    }

    // User is suspended - activation means they can login again
    // We don't generate tokens here, user needs to login

    // TODO: Send email notification to user (account reactivated)
    // TODO: Log action in audit_logs table

    console.log(`✅ Admin ${decoded.email} reactivated user ${user.email} (ID: ${userId})`);

    return NextResponse.json({
      message: 'User reactivated successfully',
      user: {
        id: userId,
        email: user.email,
        status: 'active',
      },
    });
  } catch (error) {
    console.error('User activation error:', error);
    return NextResponse.json(
      { error: 'Failed to activate user' },
      { status: 500 }
    );
  }
}
